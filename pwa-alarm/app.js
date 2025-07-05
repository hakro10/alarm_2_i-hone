class AlarmApp {
    constructor() {
        this.alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        this.activeAlarms = new Map();
        this.selectedDays = new Set();
        this.currentAlarmSound = null;
        
        this.initializeElements();
        this.bindEvents();
        this.renderAlarms();
        this.requestNotificationPermission();
        this.registerServiceWorker();
        this.startAlarmChecker();
    }

    initializeElements() {
        this.addAlarmBtn = document.getElementById('addAlarmBtn');
        this.addAlarmModal = document.getElementById('addAlarmModal');
        this.closeModal = document.getElementById('closeModal');
        this.alarmTimeInput = document.getElementById('alarmTime');
        this.alarmLabelInput = document.getElementById('alarmLabel');
        this.saveAlarmBtn = document.getElementById('saveAlarm');
        this.alarmsList = document.getElementById('alarmsList');
        this.dayButtons = document.querySelectorAll('.day-btn');
        
        // Alarm notification elements
        this.alarmNotification = document.getElementById('alarmNotification');
        this.snoozeBtn = document.getElementById('snoozeBtn');
        this.dismissBtn = document.getElementById('dismissBtn');
    }

    bindEvents() {
        this.addAlarmBtn.addEventListener('click', () => this.openAddAlarmModal());
        this.closeModal.addEventListener('click', () => this.closeAddAlarmModal());
        this.saveAlarmBtn.addEventListener('click', () => this.saveAlarm());
        this.snoozeBtn.addEventListener('click', () => this.snoozeAlarm());
        this.dismissBtn.addEventListener('click', () => this.dismissAlarm());
        
        // Day selection buttons
        this.dayButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggleDay(btn));
        });

        // Close modal when clicking outside
        this.addAlarmModal.addEventListener('click', (e) => {
            if (e.target === this.addAlarmModal) {
                this.closeAddAlarmModal();
            }
        });

        // Close alarm notification when clicking outside
        this.alarmNotification.addEventListener('click', (e) => {
            if (e.target === this.alarmNotification) {
                this.dismissAlarm();
            }
        });
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    openAddAlarmModal() {
        this.addAlarmModal.classList.remove('hidden');
        this.resetModalForm();
    }

    closeAddAlarmModal() {
        this.addAlarmModal.classList.add('hidden');
        this.resetModalForm();
    }

    resetModalForm() {
        this.alarmTimeInput.value = '';
        this.alarmLabelInput.value = '';
        this.selectedDays.clear();
        this.dayButtons.forEach(btn => btn.classList.remove('active'));
    }

    toggleDay(button) {
        const day = button.dataset.day;
        
        if (this.selectedDays.has(day)) {
            this.selectedDays.delete(day);
            button.classList.remove('active');
        } else {
            this.selectedDays.add(day);
            button.classList.add('active');
        }
    }

    saveAlarm() {
        const time = this.alarmTimeInput.value;
        const label = this.alarmLabelInput.value || 'Alarm';
        
        if (!time) {
            alert('Please select a time for the alarm');
            return;
        }

        const alarm = {
            id: Date.now(),
            time: time,
            label: label,
            enabled: true,
            days: Array.from(this.selectedDays),
            created: new Date().toISOString()
        };

        this.alarms.push(alarm);
        this.saveToStorage();
        this.renderAlarms();
        this.closeAddAlarmModal();
        this.scheduleAlarm(alarm);
    }

    deleteAlarm(id) {
        this.alarms = this.alarms.filter(alarm => alarm.id !== id);
        this.clearAlarmTimeout(id);
        this.saveToStorage();
        this.renderAlarms();
    }

    toggleAlarm(id) {
        const alarm = this.alarms.find(a => a.id === id);
        if (alarm) {
            alarm.enabled = !alarm.enabled;
            this.saveToStorage();
            this.renderAlarms();
            
            if (alarm.enabled) {
                this.scheduleAlarm(alarm);
            } else {
                this.clearAlarmTimeout(id);
            }
        }
    }

    renderAlarms() {
        if (this.alarms.length === 0) {
            this.alarmsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⏰</div>
                    <h3>No alarms set</h3>
                    <p>Tap the + button to add your first alarm</p>
                </div>
            `;
            return;
        }

        this.alarmsList.innerHTML = this.alarms.map(alarm => `
            <div class="alarm-card" onclick="alarmApp.showTimeRemaining(${alarm.id})">
                <div class="alarm-info">
                    <div class="alarm-time">${this.formatTime(alarm.time)}</div>
                    <div class="alarm-label">${alarm.label}</div>
                    ${alarm.days.length > 0 ? `<div class="alarm-repeat">${this.formatDays(alarm.days)}</div>` : ''}
                    ${alarm.enabled ? `<div class="time-remaining" id="remaining-${alarm.id}"></div>` : ''}
                </div>
                <div class="alarm-controls">
                    <button class="alarm-toggle ${alarm.enabled ? 'active' : 'inactive'}" 
                            onclick="event.stopPropagation(); alarmApp.toggleAlarm(${alarm.id})"></button>
                    <button class="delete-btn" onclick="event.stopPropagation(); alarmApp.deleteAlarm(${alarm.id})">Delete</button>
                </div>
            </div>
        `).join('');

        // Schedule all enabled alarms and update time remaining
        this.alarms.forEach(alarm => {
            if (alarm.enabled) {
                this.scheduleAlarm(alarm);
                this.updateTimeRemaining(alarm);
            }
        });

        // Update time remaining every minute
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
        this.timeUpdateInterval = setInterval(() => {
            this.alarms.forEach(alarm => {
                if (alarm.enabled) {
                    this.updateTimeRemaining(alarm);
                }
            });
        }, 60000);
    }

    formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    formatDays(days) {
        const dayNames = {
            sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed',
            thu: 'Thu', fri: 'Fri', sat: 'Sat'
        };
        
        if (days.length === 7) return 'Every day';
        if (days.length === 5 && !days.includes('sun') && !days.includes('sat')) {
            return 'Weekdays';
        }
        if (days.length === 2 && days.includes('sun') && days.includes('sat')) {
            return 'Weekends';
        }
        
        return days.map(day => dayNames[day]).join(', ');
    }

    scheduleAlarm(alarm) {
        const now = new Date();
        const [hours, minutes] = alarm.time.split(':');
        
        // If alarm has specific days, check if today is one of them
        if (alarm.days.length > 0) {
            this.scheduleRecurringAlarm(alarm);
        } else {
            // One-time alarm
            const alarmTime = new Date();
            alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // If time has passed today, schedule for tomorrow
            if (alarmTime <= now) {
                alarmTime.setDate(alarmTime.getDate() + 1);
            }
            
            const timeUntilAlarm = alarmTime.getTime() - now.getTime();
            
            if (timeUntilAlarm > 0) {
                const timeoutId = setTimeout(() => {
                    this.triggerAlarm(alarm);
                    // Disable one-time alarm after it rings
                    alarm.enabled = false;
                    this.saveToStorage();
                    this.renderAlarms();
                }, timeUntilAlarm);
                
                this.activeAlarms.set(alarm.id, timeoutId);
            }
        }
    }

    scheduleRecurringAlarm(alarm) {
        const now = new Date();
        const [hours, minutes] = alarm.time.split(':');
        const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
        
        // Find the next occurrence
        let nextAlarmTime = null;
        let daysToCheck = 7; // Check next 7 days
        
        for (let i = 0; i < daysToCheck; i++) {
            const checkDate = new Date(now);
            checkDate.setDate(now.getDate() + i);
            checkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            const dayName = Object.keys(dayMap).find(key => dayMap[key] === checkDate.getDay());
            
            if (alarm.days.includes(dayName) && checkDate > now) {
                nextAlarmTime = checkDate;
                break;
            }
        }
        
        if (nextAlarmTime) {
            const timeUntilAlarm = nextAlarmTime.getTime() - now.getTime();
            
            const timeoutId = setTimeout(() => {
                this.triggerAlarm(alarm);
                // Reschedule for next occurrence
                setTimeout(() => this.scheduleRecurringAlarm(alarm), 1000);
            }, timeUntilAlarm);
            
            this.activeAlarms.set(alarm.id, timeoutId);
        }
    }

    clearAlarmTimeout(id) {
        if (this.activeAlarms.has(id)) {
            clearTimeout(this.activeAlarms.get(id));
            this.activeAlarms.delete(id);
        }
    }

    triggerAlarm(alarm) {
        // Show visual notification
        this.showAlarmNotification(alarm);
        
        // Show browser notification
        this.showBrowserNotification(alarm);
        
        // Play alarm sound
        this.playAlarmSound();
        
        // Store current triggering alarm
        this.currentTriggeringAlarm = alarm;
    }

    showAlarmNotification(alarm) {
        document.getElementById('alarmTitle').textContent = alarm.label;
        document.getElementById('alarmTime').textContent = this.formatTime(alarm.time);
        this.alarmNotification.classList.remove('hidden');
    }

    showBrowserNotification(alarm) {
        if (Notification.permission === 'granted') {
            new Notification(alarm.label, {
                body: `Alarm set for ${this.formatTime(alarm.time)}`,
                icon: './icon-192.png',
                tag: 'alarm',
                requireInteraction: true
            });
        }
    }

    playAlarmSound() {
        // Create a simple beep sound using Web Audio API
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            const playBeep = () => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            };
            
            // Play beeps in intervals
            this.currentAlarmSound = setInterval(playBeep, 1000);
        }
    }

    stopAlarmSound() {
        if (this.currentAlarmSound) {
            clearInterval(this.currentAlarmSound);
            this.currentAlarmSound = null;
        }
    }

    snoozeAlarm() {
        this.stopAlarmSound();
        this.alarmNotification.classList.add('hidden');
        
        if (this.currentTriggeringAlarm) {
            // Schedule snooze for 5 minutes
            const snoozeTime = new Date();
            snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
            
            const timeUntilSnooze = snoozeTime.getTime() - new Date().getTime();
            
            setTimeout(() => {
                this.triggerAlarm(this.currentTriggeringAlarm);
            }, timeUntilSnooze);
        }
    }

    dismissAlarm() {
        this.stopAlarmSound();
        this.alarmNotification.classList.add('hidden');
        this.currentTriggeringAlarm = null;
    }

    startAlarmChecker() {
        // Check every minute for any missed alarms
        setInterval(() => {
            this.alarms.forEach(alarm => {
                if (alarm.enabled && !this.activeAlarms.has(alarm.id)) {
                    this.scheduleAlarm(alarm);
                }
            });
        }, 60000); // Check every minute
    }

    updateTimeRemaining(alarm) {
        const element = document.getElementById(`remaining-${alarm.id}`);
        if (!element) return;

        const now = new Date();
        const [hours, minutes] = alarm.time.split(':');
        
        let nextAlarmTime = new Date();
        nextAlarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // If time has passed today, schedule for tomorrow or next valid day
        if (nextAlarmTime <= now) {
            if (alarm.days.length === 0) {
                // One-time alarm - schedule for tomorrow
                nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
            } else {
                // Recurring alarm - find next valid day
                const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
                let found = false;
                
                for (let i = 1; i <= 7; i++) {
                    const checkDate = new Date(now);
                    checkDate.setDate(now.getDate() + i);
                    checkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    
                    const dayName = Object.keys(dayMap).find(key => dayMap[key] === checkDate.getDay());
                    
                    if (alarm.days.includes(dayName)) {
                        nextAlarmTime = checkDate;
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
                }
            }
        }
        
        const diff = nextAlarmTime.getTime() - now.getTime();
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hoursLeft < 24) {
            element.textContent = `in ${hoursLeft}h ${minutesLeft}m`;
        } else {
            const daysLeft = Math.floor(hoursLeft / 24);
            const remainingHours = hoursLeft % 24;
            element.textContent = `in ${daysLeft}d ${remainingHours}h ${minutesLeft}m`;
        }
    }

    showTimeRemaining(alarmId) {
        const alarm = this.alarms.find(a => a.id === alarmId);
        if (!alarm || !alarm.enabled) return;

        const now = new Date();
        const [hours, minutes] = alarm.time.split(':');
        
        let nextAlarmTime = new Date();
        nextAlarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Calculate next alarm time
        if (nextAlarmTime <= now) {
            if (alarm.days.length === 0) {
                nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
            } else {
                const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
                
                for (let i = 1; i <= 7; i++) {
                    const checkDate = new Date(now);
                    checkDate.setDate(now.getDate() + i);
                    checkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    
                    const dayName = Object.keys(dayMap).find(key => dayMap[key] === checkDate.getDay());
                    
                    if (alarm.days.includes(dayName)) {
                        nextAlarmTime = checkDate;
                        break;
                    }
                }
            }
        }
        
        const diff = nextAlarmTime.getTime() - now.getTime();
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeText;
        if (hoursLeft < 24) {
            timeText = `${hoursLeft}h ${minutesLeft}m`;
        } else {
            const daysLeft = Math.floor(hoursLeft / 24);
            const remainingHours = hoursLeft % 24;
            timeText = `${daysLeft}d ${remainingHours}h ${minutesLeft}m`;
        }

        // Show popup with time remaining
        document.getElementById('alarmTitle').textContent = alarm.label;
        document.getElementById('alarmTime').textContent = timeText;
        this.alarmNotification.classList.remove('hidden');
    }

    saveToStorage() {
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
    }
}

// Initialize the app when the page loads
let alarmApp;
document.addEventListener('DOMContentLoaded', () => {
    alarmApp = new AlarmApp();
});

// Handle page visibility changes to keep alarms working
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again, refresh alarm schedules
        alarmApp.alarms.forEach(alarm => {
            if (alarm.enabled) {
                alarmApp.clearAlarmTimeout(alarm.id);
                alarmApp.scheduleAlarm(alarm);
            }
        });
    }
});
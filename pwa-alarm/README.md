# Alarm PWA

A simple and elegant Progressive Web App (PWA) alarm clock.

## Features

- ⏰ Set multiple alarms with custom labels
- 🔄 Recurring alarms (daily, weekdays, weekends, custom days)
- 🎵 Audio notifications with system sounds
- 📱 Browser notifications (when permission granted)
- 🌙 Dark theme design
- 💾 Offline functionality with service worker
- 📲 Installable as a PWA on mobile and desktop

## How to Use

1. Open `index.html` in your web browser
2. Click the "+" button to add a new alarm
3. Set the time and optional label
4. Choose repeat days if needed
5. Save the alarm
6. Toggle alarms on/off as needed

## Installation

### Local Development
1. Open the `pwa-alarm` folder
2. Start a local HTTP server (required for PWA features):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Install as PWA
1. Open the app in a supported browser (Chrome, Edge, Firefox, Safari)
2. Look for the "Install" button in the address bar
3. Click to install the app on your device

## Browser Compatibility

- Chrome 67+ (full PWA support)
- Firefox 79+ (partial PWA support)
- Safari 14+ (partial PWA support)
- Edge 79+ (full PWA support)

## Features in Detail

### Alarms
- Time selection with hour/minute picker
- Custom labels for easy identification
- Enable/disable individual alarms
- Delete unwanted alarms

### Notifications
- Visual popup notifications
- Browser push notifications (with permission)
- Audio alerts using Web Audio API
- Snooze functionality (5-minute intervals)

### Recurring Alarms
- One-time alarms
- Daily recurring alarms
- Weekdays only (Monday-Friday)
- Weekends only (Saturday-Sunday)
- Custom day selection

### Offline Support
- Service worker caches all resources
- Works without internet connection
- Background sync capabilities

## Technical Details

- Pure HTML5, CSS3, and JavaScript
- No external dependencies
- Uses Web Audio API for sound generation
- Implements Notification API for alerts
- Service Worker for offline functionality
- Local Storage for data persistence

## Permissions Required

- **Notifications**: For browser-based alarm alerts
- **Audio**: For playing alarm sounds (auto-granted)

## Troubleshooting

### Alarms Not Working
1. Ensure notifications are enabled for the website
2. Keep the browser tab open or install as PWA
3. Check that your device isn't in "Do Not Disturb" mode

### PWA Installation Issues
1. Ensure you're using HTTPS (or localhost)
2. Check that all PWA requirements are met
3. Try refreshing the page and looking for install prompt

### Audio Not Playing
1. Many browsers require user interaction before playing audio
2. Click anywhere on the page after loading
3. Check browser audio settings

## Development

The app consists of:
- `index.html` - Main application structure
- `styles.css` - Styling and responsive design
- `app.js` - Core application logic
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline functionality

## License

This project is open source and available under the MIT License.
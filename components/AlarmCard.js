import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import AlarmPopup from './AlarmPopup';

const AlarmCard = ({ time, enabled, onToggle }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeUntilAlarm, setTimeUntilAlarm] = useState('');

  const calculateTimeUntilAlarm = useCallback(() => {
    const now = new Date();
    const alarmTime = new Date();
    const [hours, minutes] = time.split(':');
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);

    if (alarmTime < now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const diff = alarmTime.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTimeUntilAlarm(`${hoursLeft}h ${minutesLeft}m`);
  }, [time]);

  useEffect(() => {
    if (enabled) {
      calculateTimeUntilAlarm();
      const interval = setInterval(calculateTimeUntilAlarm, 60000);
      return () => clearInterval(interval);
    }
  }, [enabled, calculateTimeUntilAlarm]);

  return (
    <>
      <TouchableOpacity onPress={() => setPopupVisible(true)} disabled={!enabled}>
        <View style={styles.card}>
          <Text style={styles.time}>{time}</Text>
          <Switch value={enabled} onValueChange={onToggle} />
        </View>
      </TouchableOpacity>
      <AlarmPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        timeUntilAlarm={timeUntilAlarm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    margin: 8,
  },
  time: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default AlarmCard;

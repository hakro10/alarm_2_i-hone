import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

const AlarmPopup = ({ visible, onClose, timeUntilAlarm }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.label}>Time until alarm:</Text>
          <Text style={styles.countdown}>{timeUntilAlarm}</Text>
          <Button title="Dismiss" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#374151',
    padding: 32,
    borderRadius: 8,
  },
  label: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 16,
  },
  countdown: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 32,
  },
});

export default AlarmPopup;

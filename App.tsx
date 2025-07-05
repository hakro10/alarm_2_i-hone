import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import AlarmCard from './components/AlarmCard';

const App = () => {
  const [alarms, setAlarms] = useState([
    { id: '1', time: '07:00', enabled: true },
    { id: '2', time: '08:30', enabled: false },
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alarms</Text>
      </View>
      <FlatList
        data={alarms}
        renderItem={({ item }) => (
          <AlarmCard
            time={item.time}
            enabled={item.enabled}
            onToggle={() => toggleAlarm(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default App;

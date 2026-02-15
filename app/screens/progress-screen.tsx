import { View, Text, StyleSheet } from 'react-native';

export function ProgressScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholder}>Progress Screen</Text>
        <Text style={styles.subtext}>Stats and progress tracking will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  subtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

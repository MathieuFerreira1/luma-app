import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/app/hooks/use-auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function AppLayout() {
  const { isAuthenticated, initialized } = useAuth();

  // Show loading while initializing auth
  if (!initialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

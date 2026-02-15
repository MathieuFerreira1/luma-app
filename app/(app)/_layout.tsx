import { Redirect } from 'expo-router';
import { useAuth } from '@/app/hooks/use-auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AppTabs } from '@/app/navigation/app-tabs';

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

  // Render AppTabs when authenticated
  return <AppTabs />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

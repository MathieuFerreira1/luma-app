import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/hooks/use-auth';
import { useUserProfile } from '@/app/hooks/use-user-profile';
import { useXP } from '@/app/hooks/use-xp';

export function HomeScreen() {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { xp, level, progressPercent, progress } = useXP();

  const handleLogout = async () => {
    await signOut();
  };

  // Build display name from profile or fallback to email
  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || profile?.last_name || user?.email?.split('@')[0] || 'User';

  const loading = profileLoading;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Loading profile...</Text>
        ) : (
          <>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.username}>{displayName}</Text>
            
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {level}</Text>
              <Text style={styles.xpText}>{xp} XP</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${progressPercent}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {progress.currentLevelXp} / {progress.requiredXp} XP to next level
              </Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{xp}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{level}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile?.streak ?? 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </>
        )}
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  welcome: {
    fontSize: 18,
    color: '#666',
    marginTop: 40,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 32,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  levelText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  xpText: {
    fontSize: 18,
    color: '#666',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 32,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 'auto',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

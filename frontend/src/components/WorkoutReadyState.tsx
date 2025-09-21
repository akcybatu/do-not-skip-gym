import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useWorkoutStore } from '../stores/workoutStore';

export const WorkoutReadyState: React.FC = () => {
  const { user, signOut, isLoading } = useAuthStore();
  const { setCurrentStep } = useWorkoutStore();

  const handleStartWorkout = () => {
    setCurrentStep('selectTypes');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏋️‍♂️ Ready to Train</Text>
          {user && (
            <Text style={styles.userText}>Welcome back, {user.email}!</Text>
          )}
        </View>

        {/* Main Action */}
        <View style={styles.mainAction}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonIcon}>🎯</Text>
            <Text style={styles.startButtonText}>Start New Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats (Placeholder for future) */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📈 Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
          </View>
        </View>

        {/* Sign Out (Temporary - will be moved to settings later) */}
        <TouchableOpacity
          style={[styles.signOutButton, isLoading && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutButtonText}>
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  userText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  mainAction: {
    alignItems: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

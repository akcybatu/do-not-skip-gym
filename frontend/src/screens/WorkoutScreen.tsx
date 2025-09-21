import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { useWorkoutStore } from '../stores/workoutStore';
import { TabNavigation } from '../components/TabNavigation';
import { WorkoutReadyState } from '../components/WorkoutReadyState';
import { WorkoutTypeSelector } from '../components/WorkoutTypeSelector';
import { ExerciseList } from '../components/ExerciseList';
import { SetLogger } from '../components/SetLogger';
import { WorkoutProgress } from '../components/WorkoutProgress';

export const WorkoutScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const { currentStep } = useWorkoutStore();

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderMainContent = () => {
    if (activeTab === 'stats') {
      // Placeholder for stats/history view
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📊</Text>
          <Text style={styles.placeholderTitle}>Stats & History</Text>
          <Text style={styles.placeholderText}>
            Coming soon! This will show your workout history and progress statistics.
          </Text>
        </View>
      );
    }

    // Workout tab content based on current step
    switch (currentStep) {
      case 'ready':
        return <WorkoutReadyState />;
      
      case 'selectTypes':
        return <WorkoutTypeSelector />;
      
      case 'selectExercise':
        return <ExerciseList />;
      
      case 'logSets':
        return <SetLogger />;
      
      case 'progress':
        return <WorkoutProgress />;
      
      default:
        return <WorkoutReadyState />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderMainContent()}
      </View>
      <TabNavigation activeTab={activeTab} onTabPress={handleTabPress} />
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
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

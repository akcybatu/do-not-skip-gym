import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useWorkoutStore } from '../stores/workoutStore';
import { ExerciseLog, ExerciseSetLog } from '../types/workout';
import { formatDuration, formatVolume, formatTime, formatExerciseSummary, formatSetDisplay } from '../utils/formatters';

export const WorkoutProgress: React.FC = () => {
  const { 
    activeWorkout,
    exerciseLogs,
    setCurrentStep,
    completeWorkout,
    setCurrentExerciseLogId 
  } = useWorkoutStore();

  const handleAddExercise = () => {
    setCurrentStep('selectExercise');
  };

  const handleCompleteWorkout = () => {
    if (!activeWorkout || exerciseLogs.length === 0) {
      Alert.alert(
        'No Exercises Logged',
        'Please complete at least one exercise before finishing your workout.',
        [{ text: 'OK' }]
      );
      return;
    }

    const completedExercises = exerciseLogs.filter(log => log.t_complete);
    const totalSets = completedExercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);

    Alert.alert(
      'Complete Workout',
      `Are you sure you want to complete your workout?\n\n• ${completedExercises.length} exercises completed\n• ${totalSets} total sets logged`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete Workout', 
          style: 'default',
          onPress: () => {
            completeWorkout();
          }
        }
      ]
    );
  };

  const handleEditExercise = (exerciseLogId: string) => {
    setCurrentExerciseLogId(exerciseLogId);
    setCurrentStep('logSets');
  };

  const getWorkoutDuration = () => {
    if (!activeWorkout) return '0 min';
    return formatDuration(new Date(activeWorkout.t_create));
  };

  const calculateExerciseVolume = (sets: ExerciseSetLog[]) => {
    return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
  };

  const calculateTotalVolume = () => {
    const completedExercises = exerciseLogs.filter(log => log.t_complete);
    return completedExercises.reduce((total, exercise) => 
      total + calculateExerciseVolume(exercise.sets), 0
    );
  };

  const getTotalSets = () => {
    const completedExercises = exerciseLogs.filter(log => log.t_complete);
    return completedExercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const getCompletedExercises = () => {
    return exerciseLogs.filter(log => log.t_complete);
  };

  const getActiveExercise = () => {
    return exerciseLogs.find(log => !log.t_complete);
  };

  const completedExercises = getCompletedExercises();
  const activeExercise = getActiveExercise();
  const totalVolume = calculateTotalVolume();
  const totalSets = getTotalSets();

  if (!activeWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>No Active Workout</Text>
          <Text style={styles.errorText}>
            Please start a new workout to track your progress.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Active Workout</Text>
          <Text style={styles.duration}>{getWorkoutDuration()}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>📊 Workout Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{completedExercises.length}</Text>
              <Text style={styles.summaryLabel}>Exercises</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalSets}</Text>
              <Text style={styles.summaryLabel}>Total Sets</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{formatVolume(totalVolume)}</Text>
              <Text style={styles.summaryLabel}>Volume (lbs)</Text>
            </View>
          </View>
        </View>

        {/* Active Exercise */}
        {activeExercise && (
          <View style={styles.activeExerciseContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏋️ Current Exercise</Text>
            </View>
            <TouchableOpacity
              style={styles.activeExerciseCard}
              onPress={() => handleEditExercise(activeExercise.id)}
            >
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{activeExercise.exerciseName}</Text>
                <Text style={styles.continueText}>Continue →</Text>
              </View>
              <Text style={styles.setsCount}>
                {activeExercise.sets.length} set{activeExercise.sets.length !== 1 ? 's' : ''} logged
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Exercises */}
        {completedExercises.length > 0 && (
          <View style={styles.completedContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✅ Completed Exercises</Text>
              <Text style={styles.sectionCount}>{completedExercises.length}</Text>
            </View>
            
            {completedExercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  <Text style={styles.exerciseVolume}>
                    {formatVolume(calculateExerciseVolume(exercise.sets))} lbs
                  </Text>
                </View>
                
                <View style={styles.setsContainer}>
                  {exercise.sets.map((set, setIndex) => (
                    <View key={setIndex} style={styles.setItem}>
                      <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                      <Text style={styles.setDetails}>
                        {formatSetDisplay(set.weight, set.reps)}
                      </Text>
                      <Text style={styles.setTime}>
                        {formatTime(new Date(set.t_create))}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.exerciseSummary}>
                  <Text style={styles.exerciseSummaryText}>
                    {formatExerciseSummary(exercise.sets.length, calculateExerciseVolume(exercise.sets))}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {completedExercises.length === 0 && !activeExercise && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💪</Text>
            <Text style={styles.emptyTitle}>Ready to Start!</Text>
            <Text style={styles.emptyText}>
              Add your first exercise to begin tracking your workout progress.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
        >
          <Text style={styles.addExerciseButtonText}>➕ Add Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.completeWorkoutButton,
            completedExercises.length === 0 && styles.disabledButton,
          ]}
          onPress={handleCompleteWorkout}
          disabled={completedExercises.length === 0}
        >
          <Text style={[
            styles.completeWorkoutButtonText,
            completedExercises.length === 0 && styles.disabledButtonText,
          ]}>
            🏁 Complete Workout
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeExerciseContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeExerciseCard: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 12,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  continueText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  exerciseVolume: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  setsCount: {
    fontSize: 14,
    color: '#856404',
  },
  completedContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  setsContainer: {
    marginTop: 12,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  setNumber: {
    fontSize: 14,
    color: '#666',
    width: 50,
  },
  setDetails: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  setTime: {
    fontSize: 12,
    color: '#666',
  },
  exerciseSummary: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  exerciseSummaryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  addExerciseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addExerciseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeWorkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  completeWorkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

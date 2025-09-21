import React, { useState } from 'react';
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

type SortOption = 'time' | 'type';

export const WorkoutProgress: React.FC = () => {
  const { 
    activeWorkout,
    exerciseLogs,
    setCurrentStep,
    completeWorkout,
    setCurrentExerciseLogId,
    exercises
  } = useWorkoutStore();

  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleAddExercise = () => {
    setCurrentStep('selectExercise');
  };

  const handleCompleteWorkout = () => {
    if (!activeWorkout) {
      return;
    }

    Alert.alert(
      'Complete Workout',
      'Are you sure you want to complete your workout?',
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

  const getWorkoutTypesSummary = () => {
    if (!activeWorkout || activeWorkout.selectedMuscleGroups.length === 0) return 'None';
    
    // Get completed exercises grouped by muscle group
    const completedExercises = exerciseLogs.filter(log => log.t_complete);
    const exercisesByMuscleGroup: Record<string, number> = {};
    
    // Initialize all selected muscle groups with 0
    activeWorkout.selectedMuscleGroups.forEach(group => {
      exercisesByMuscleGroup[group] = 0;
    });
    
    // Count completed exercises by muscle group
    // Note: We need to map exercise names back to muscle groups
    // For now, we'll use a simple approach based on exercise database
    completedExercises.forEach(exerciseLog => {
      // Find the muscle group for this exercise from the exercise database
      const exercise = exercises.find(ex => ex.name === exerciseLog.exerciseName);
      if (exercise && exercisesByMuscleGroup.hasOwnProperty(exercise.muscleGroup)) {
        exercisesByMuscleGroup[exercise.muscleGroup]++;
      }
    });
    
    // Format the summary
    const summaryParts = activeWorkout.selectedMuscleGroups
      .map(group => {
        const count = exercisesByMuscleGroup[group];
        const groupName = group.charAt(0).toUpperCase() + group.slice(1);
        return `${groupName} ${count}`;
      })
      .filter(part => !part.endsWith(' 0')); // Only show groups with exercises
    
    return summaryParts.length > 0 ? summaryParts.join(', ') : 'N/A';
  };

  const calculateExerciseVolume = (sets: ExerciseSetLog[]) => {
    return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
  };

  const calculateAverageWeightAndReps = (sets: ExerciseSetLog[]) => {
    if (sets.length === 0) return '0 lbs × 0';
    
    const totalWeight = sets.reduce((sum, set) => sum + set.weight, 0);
    const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
    
    const avgWeight = Math.round(totalWeight / sets.length);
    const avgReps = Math.round(totalReps / sets.length);
    
    return `${avgWeight} lbs × ${avgReps}`;
  };

  const calculateExerciseDuration = (exercise: ExerciseLog) => {
    if (!exercise.t_complete || exercise.sets.length === 0) return '0 min';
    
    const startTime = new Date(exercise.t_create);
    const endTime = new Date(exercise.t_complete);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    return `${durationMinutes} min`;
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
    const completed = exerciseLogs.filter(log => log.t_complete);
    
    return [...completed].sort((a, b) => {
      if (sortBy === 'time') {
        // Sort by completion time (most recent first)
        return new Date(b.t_complete!).getTime() - new Date(a.t_complete!).getTime();
      } else {
        // Sort by workout type (muscle group)
        const exerciseA = exercises.find(ex => ex.name === a.exerciseName);
        const exerciseB = exercises.find(ex => ex.name === b.exerciseName);
        const typeA = exerciseA?.muscleGroup || '';
        const typeB = exerciseB?.muscleGroup || '';
        
        if (typeA === typeB) {
          // If same muscle group, sort by completion time
          return new Date(b.t_complete!).getTime() - new Date(a.t_complete!).getTime();
        }
        return typeA.localeCompare(typeB);
      }
    });
  };

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const getSortLabel = (option: SortOption) => {
    return option === 'time' ? 'Time' : 'Workout Type';
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
              <Text style={styles.summaryValue}>{getWorkoutTypesSummary()}</Text>
              <Text style={styles.summaryLabel}>Exercises by Type</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{getWorkoutDuration()}</Text>
              <Text style={styles.summaryLabel}>Duration</Text>
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
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Exercises */}
        {completedExercises.length > 0 && (
          <View style={styles.completedContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✅ Completed Exercises</Text>
              <View style={styles.sectionHeaderRight}>
                <View style={styles.sortContainer}>
                  <Text style={styles.sortLabel}>⇅</Text>
                  <TouchableOpacity
                    style={styles.sortDropdown}
                    onPress={() => setShowSortDropdown(!showSortDropdown)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sortDropdownText}>{getSortLabel(sortBy)}</Text>
                    <Text style={styles.dropdownArrow}>{showSortDropdown ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {showSortDropdown && (
                    <View style={styles.sortOptions}>
                      <TouchableOpacity
                        style={[
                          styles.sortOption,
                          sortBy === 'time' && styles.sortOptionSelected,
                        ]}
                        onPress={() => handleSortSelect('time')}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.sortOptionText,
                          sortBy === 'time' && styles.sortOptionTextSelected,
                        ]}>Time</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.sortOption,
                          styles.sortOptionLast,
                          sortBy === 'type' && styles.sortOptionSelected,
                        ]}
                        onPress={() => handleSortSelect('type')}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.sortOptionText,
                          sortBy === 'type' && styles.sortOptionTextSelected,
                        ]}>Workout Type</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {completedExercises.map((exercise, index) => {
              // Find the muscle group for this exercise
              const exerciseData = exercises.find(ex => ex.name === exercise.exerciseName);
              const muscleGroup = exerciseData?.muscleGroup;
              const muscleGroupLabel = muscleGroup ? muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1) : '';
              
              return (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseNameContainer}>
                      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                      {muscleGroupLabel && (
                        <Text style={styles.muscleGroupLabel}>{muscleGroupLabel}</Text>
                      )}
                    </View>
                    <View style={styles.exerciseStats}>
                      <Text style={styles.exerciseVolume}>
                        {calculateAverageWeightAndReps(exercise.sets)}
                      </Text>
                      <Text style={styles.exerciseDuration}>
                        {calculateExerciseDuration(exercise)}
                      </Text>
                    </View>
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

                </View>
              );
            })}
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
          style={styles.completeWorkoutButton}
          onPress={handleCompleteWorkout}
        >
          <Text style={styles.completeWorkoutButtonText}>
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
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  sortDropdown: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 100,
  },
  sortDropdownText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#007AFF',
  },
  sortOptions: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    minWidth: 120,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  sortOptionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  sortOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sortOptionLast: {
    borderBottomWidth: 0,
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
  exerciseNameContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  muscleGroupLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
  continueText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  exerciseStats: {
    alignItems: 'flex-end',
  },
  exerciseVolume: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
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

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  SectionList,
} from 'react-native';
import { useWorkoutStore } from '../stores/workoutStore';
import { Exercise, MuscleGroup } from '../types/workout';

interface ExerciseSection {
  title: string;
  data: Exercise[];
  muscleGroup: MuscleGroup;
}

const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  back: 'Back',
  chest: 'Chest', 
  shoulder: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  abs: 'Abs',
  cardio: 'Cardio',
};

const MUSCLE_GROUP_ICONS: Record<MuscleGroup, string> = {
  back: '💪',
  chest: '🏋️',
  shoulder: '🤸',
  biceps: '💪',
  triceps: '🔨',
  legs: '🦵',
  abs: '🏃',
  cardio: '🏃‍♂️',
};

export const ExerciseList: React.FC = () => {
  const { 
    selectedMuscleGroups, 
    getExercisesForSelectedGroups,
    addExerciseToWorkout,
    setCurrentStep 
  } = useWorkoutStore();

  const handleBack = () => {
    setCurrentStep('selectTypes');
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    addExerciseToWorkout(exercise.id);
  };

  // Group exercises by muscle group
  const groupExercisesByMuscleGroup = (): ExerciseSection[] => {
    const exercises = getExercisesForSelectedGroups();
    const grouped: Record<MuscleGroup, Exercise[]> = {} as Record<MuscleGroup, Exercise[]>;

    // Initialize groups
    selectedMuscleGroups.forEach(group => {
      grouped[group] = [];
    });

    // Group exercises
    exercises.forEach(exercise => {
      if (grouped[exercise.muscleGroup]) {
        grouped[exercise.muscleGroup].push(exercise);
      }
    });

    // Convert to sections array in the order of selected muscle groups
    return selectedMuscleGroups.map(muscleGroup => ({
      title: MUSCLE_GROUP_LABELS[muscleGroup],
      data: grouped[muscleGroup] || [],
      muscleGroup,
    })).filter(section => section.data.length > 0);
  };

  const sections = groupExercisesByMuscleGroup();
  const totalExercises = sections.reduce((sum, section) => sum + section.data.length, 0);

  const renderSectionHeader = ({ section }: { section: ExerciseSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>
        {MUSCLE_GROUP_ICONS[section.muscleGroup]}
      </Text>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>{section.data.length}</Text>
      </View>
    </View>
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => handleExerciseSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseIcon}>{item.icon}</Text>
        <View style={styles.exerciseDetails}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseMuscleGroup}>
            {MUSCLE_GROUP_LABELS[item.muscleGroup]}
          </Text>
        </View>
      </View>
      <View style={styles.selectIndicator}>
        <Text style={styles.selectArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🤔</Text>
      <Text style={styles.emptyTitle}>No Exercises Found</Text>
      <Text style={styles.emptyText}>
        It looks like there are no exercises available for the selected muscle groups.
      </Text>
      <TouchableOpacity style={styles.backToSelectionButton} onPress={handleBack}>
        <Text style={styles.backToSelectionText}>Choose Different Groups</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Exercise</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Selected Groups Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {totalExercises} exercises available for:
        </Text>
        <View style={styles.selectedGroups}>
          {selectedMuscleGroups.map((group, index) => (
            <View key={group} style={styles.groupChip}>
              <Text style={styles.groupChipText}>
                {MUSCLE_GROUP_ICONS[group]} {MUSCLE_GROUP_LABELS[group]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Exercise List */}
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          renderSectionHeader={renderSectionHeader}
          style={styles.exerciseList}
          contentContainerStyle={styles.exerciseListContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          💡 Tap any exercise to start logging sets
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  groupChip: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  groupChipText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseListContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  sectionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  exerciseMuscleGroup: {
    fontSize: 12,
    color: '#666',
  },
  selectIndicator: {
    marginLeft: 12,
  },
  selectArrow: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 24,
  },
  backToSelectionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToSelectionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useWorkoutStore } from '../stores/workoutStore';
import { MuscleGroup } from '../types/workout';

interface MuscleGroupOption {
  id: MuscleGroup;
  label: string;
  icon: string;
  description: string;
}

const MUSCLE_GROUP_OPTIONS: MuscleGroupOption[] = [
  { id: 'back', label: 'Back', icon: '', description: '• Pull-ups\n• Rows\n• Deadlifts' },
  { id: 'chest', label: 'Chest', icon: '', description: '• Bench Press\n• Push-ups\n• Flyes' },
  { id: 'shoulder', label: 'Shoulder', icon: '', description: '• Overhead Press\n• Lateral Raises\n• Front Raises' },
  { id: 'biceps', label: 'Biceps', icon: '', description: '• Barbell Curls\n• Hammer Curls\n• Preacher Curls' },
  { id: 'triceps', label: 'Triceps', icon: '', description: '• Dips\n• Pushdowns\n• Extensions' },
  { id: 'legs', label: 'Legs', icon: '', description: '• Squats\n• Lunges\n• Leg Press' },
  { id: 'abs', label: 'Abs', icon: '', description: '• Crunches\n• Planks\n• Russian Twists' },
  { id: 'cardio', label: 'Cardio', icon: '', description: '• Treadmill\n• Bike\n• Elliptical' },
];

export const WorkoutTypeSelector: React.FC = () => {
  const { 
    selectedMuscleGroups, 
    setSelectedMuscleGroups, 
    setCurrentStep, 
    startWorkout,
    activeWorkout
  } = useWorkoutStore();

  const handleToggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    const isSelected = selectedMuscleGroups.includes(muscleGroup);
    
    if (isSelected) {
      // Remove from selection
      const updated = selectedMuscleGroups.filter(group => group !== muscleGroup);
      setSelectedMuscleGroups(updated);
    } else {
      // Add to selection
      const updated = [...selectedMuscleGroups, muscleGroup];
      setSelectedMuscleGroups(updated);
    }
  };

  const handleContinue = () => {
    if (selectedMuscleGroups.length > 0) {
      startWorkout(selectedMuscleGroups);
    }
  };

  const handleGoToSummary = () => {
    if (activeWorkout) {
      setCurrentStep('progress');
    }
  };

  const isSelectionValid = selectedMuscleGroups.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.title}>Choose Workout Types</Text>
        <TouchableOpacity 
          style={[
            styles.summaryButton, 
            !activeWorkout && styles.summaryButtonDisabled
          ]} 
          onPress={handleGoToSummary}
          disabled={!activeWorkout}
        >
          <Text style={[
            styles.summaryButtonText,
            !activeWorkout && styles.summaryButtonTextDisabled
          ]}>Summary</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          Select the muscle groups you{'\n'}want to train today
        </Text>
      </View>

      {/* Muscle Group Selection */}
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {MUSCLE_GROUP_OPTIONS.map((option) => {
            const isSelected = selectedMuscleGroups.includes(option.id);
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.selectedOptionCard,
                ]}
                onPress={() => handleToggleMuscleGroup(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionHeader}>
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.selectedOptionLabel,
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.optionDescription,
                  isSelected && styles.selectedOptionDescription,
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.continueContainer}>
        {selectedMuscleGroups.length > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              {selectedMuscleGroups.length} muscle group{selectedMuscleGroups.length > 1 ? 's' : ''} selected
            </Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isSelectionValid && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!isSelectionValid}
        >
          <Text style={[
            styles.continueButtonText,
            !isSelectionValid && styles.disabledButtonText,
          ]}>
            {isSelectionValid ? 'Continue to Exercises' : 'Select at least one group'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  summaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  summaryButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  summaryButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  summaryButtonTextDisabled: {
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 60, // Same width as back button for centering
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOptionCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedOptionLabel: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  selectedOptionDescription: {
    color: '#0056b3',
  },
  continueContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectionSummary: {
    alignItems: 'center',
    marginBottom: 12,
  },
  selectionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  continueButton: {
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
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
});

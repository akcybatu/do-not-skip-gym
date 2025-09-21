import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useWorkoutStore } from '../stores/workoutStore';
import { validateSetInputs, formatValidationError } from '../utils/validation';
import { formatSetDisplay, formatTime } from '../utils/formatters';

export const SetLogger: React.FC = () => {
  const { 
    getCurrentExerciseLog,
    addSetToExercise,
    completeExercise,
    setCurrentStep,
    currentExerciseLogId 
  } = useWorkoutStore();

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentExercise = getCurrentExerciseLog();

  // Reset form when exercise changes
  useEffect(() => {
    setWeight('');
    setReps('');
  }, [currentExerciseLogId]);

  const handleBack = () => {
    setCurrentStep('selectExercise');
  };

  const validateInputs = (): boolean => {
    const validation = validateSetInputs(weight, reps);
    
    if (!validation.isValid && validation.error) {
      Alert.alert('Invalid Input', formatValidationError(validation.error));
      return false;
    }

    return true;
  };

  const handleAddSet = async () => {
    if (!validateInputs() || !currentExercise) return;

    setIsLoading(true);
    
    try {
      const weightNum = parseFloat(weight);
      const repsNum = parseInt(reps);
      
      addSetToExercise(currentExercise.id, weightNum, repsNum);
      
      // Clear form for next set
      setWeight('');
      setReps('');
      
      // Show success feedback briefly
      setTimeout(() => setIsLoading(false), 200);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to add set. Please try again.');
    }
  };

  const handleCompleteExercise = () => {
    if (!currentExercise) return;

    if (currentExercise.sets.length === 0) {
      Alert.alert(
        'No Sets Logged', 
        'Please log at least one set before completing this exercise.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Complete Exercise',
      `Are you sure you want to complete ${currentExercise.exerciseName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          style: 'default',
          onPress: () => {
            completeExercise(currentExercise.id);
          }
        }
      ]
    );
  };

  const formatSetDisplayLocal = (set: any, index: number) => {
    return formatSetDisplay(set.weight, set.reps, index);
  };

  if (!currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>No Exercise Selected</Text>
          <Text style={styles.errorText}>
            Please go back and select an exercise to start logging sets.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back to Exercises</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={handleBack}>
            <Text style={styles.headerBackButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.exerciseName}>{currentExercise.exerciseName}</Text>
            <Text style={styles.setCounter}>Set {currentExercise.sets.length + 1}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Previous Sets */}
          {currentExercise.sets.length > 0 && (
            <View style={styles.previousSetsContainer}>
              <Text style={styles.previousSetsTitle}>Previous Sets</Text>
              {currentExercise.sets.map((set, index) => (
                <View key={index} style={styles.previousSetItem}>
                  <Text style={styles.previousSetText}>
                    {formatSetDisplayLocal(set, index)}
                  </Text>
                  <Text style={styles.previousSetTime}>
                    {formatTime(new Date(set.t_create))}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Log Current Set</Text>
            
            {/* Weight Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🏋️ Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter weight"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                returnKeyType="next"
                maxLength={6}
                editable={!isLoading}
              />
            </View>

            {/* Reps Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🔁 Reps</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reps"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={3}
                editable={!isLoading}
                onSubmitEditing={handleAddSet}
              />
            </View>

            {/* Quick Weight Suggestions */}
            {currentExercise.sets.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Quick Fill</Text>
                <View style={styles.suggestions}>
                  <TouchableOpacity
                    style={styles.suggestionButton}
                    onPress={() => {
                      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
                      setWeight(lastSet.weight.toString());
                      setReps(lastSet.reps.toString());
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionText}>Same as last</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.suggestionButton}
                    onPress={() => {
                      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
                      setWeight((lastSet.weight + 5).toString());
                      setReps(lastSet.reps.toString());
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionText}>+5 lbs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.addSetButton,
              isLoading && styles.disabledButton,
              (!weight || !reps) && styles.disabledButton,
            ]}
            onPress={handleAddSet}
            disabled={isLoading || !weight || !reps}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.addSetButtonText,
              (!weight || !reps) && styles.disabledButtonText,
            ]}>
              {isLoading ? 'Adding Set...' : '➕ Add Set'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.completeButton,
              currentExercise.sets.length === 0 && styles.disabledButton,
            ]}
            onPress={handleCompleteExercise}
            disabled={currentExercise.sets.length === 0}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.completeButtonText,
              currentExercise.sets.length === 0 && styles.disabledButtonText,
            ]}>
              ✅ Complete Exercise
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardContainer: {
    flex: 1,
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
  headerBackButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerBackButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  setCounter: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  previousSetsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previousSetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previousSetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  previousSetText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  previousSetTime: {
    fontSize: 12,
    color: '#666',
  },
  inputSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  suggestions: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  actionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  addSetButton: {
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
  addSetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
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
  completeButtonText: {
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
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

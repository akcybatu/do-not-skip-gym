export type MuscleGroup = 'back' | 'chest' | 'shoulder' | 'biceps' | 'triceps' | 'legs' | 'abs' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  icon: string;
}

export interface ExerciseSetLog {
  weight: number; // in lbs
  reps: number;
  t_create: Date;
  t_complete?: Date;
}

export interface ExerciseLog {
  id: string;
  workoutLogId: string;
  exerciseName: string;
  sets: ExerciseSetLog[];
  t_create: Date;
  t_complete?: Date;
}

export interface WorkoutLog {
  id: string;
  selectedMuscleGroups: MuscleGroup[];
  exercises: string[]; // ExerciseLog IDs
  t_create: Date;
  t_complete?: Date;
}

// State interfaces for the store
export interface WorkoutState {
  // Current active workout
  activeWorkout: WorkoutLog | null;
  
  // All exercise logs (can be filtered by workoutLogId)
  exerciseLogs: ExerciseLog[];
  
  // Workout history
  workoutHistory: WorkoutLog[];
  
  // Exercise database
  exercises: Exercise[];
  
  // UI state
  currentStep: 'ready' | 'selectTypes' | 'selectExercise' | 'logSets' | 'progress';
  selectedMuscleGroups: MuscleGroup[];
  currentExerciseLogId: string | null;
}

import { create } from 'zustand';
import { WorkoutState, WorkoutLog, ExerciseLog, MuscleGroup } from '../types/workout';
import { EXERCISE_DATABASE } from '../data/exercises';

interface WorkoutActions {
  // Workout management
  startWorkout: (muscleGroups: MuscleGroup[]) => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
  
  // Exercise management
  addExerciseToWorkout: (exerciseId: string) => void;
  completeExercise: (exerciseLogId: string) => void;
  
  // Set management
  addSetToExercise: (exerciseLogId: string, weight: number, reps: number) => void;
  completeSet: (exerciseLogId: string, setIndex: number) => void;
  
  // UI state management
  setCurrentStep: (step: WorkoutState['currentStep']) => void;
  setSelectedMuscleGroups: (groups: MuscleGroup[]) => void;
  setCurrentExerciseLogId: (id: string | null) => void;
  
  // Utility functions
  getCurrentExerciseLog: () => ExerciseLog | null;
  getExercisesForSelectedGroups: () => typeof EXERCISE_DATABASE;
  generateId: () => string;
  
  // Reset functions
  resetWorkoutState: () => void;
}

export const useWorkoutStore = create<WorkoutState & WorkoutActions>((set, get) => ({
  // Initial state
  activeWorkout: null,
  exerciseLogs: [],
  workoutHistory: [],
  exercises: EXERCISE_DATABASE,
  currentStep: 'ready',
  selectedMuscleGroups: [],
  currentExerciseLogId: null,

  // Workout management actions
  startWorkout: (muscleGroups: MuscleGroup[]) => {
    const workoutId = get().generateId();
    const newWorkout: WorkoutLog = {
      id: workoutId,
      selectedMuscleGroups: muscleGroups,
      exercises: [],
      t_create: new Date(),
    };

    set({
      activeWorkout: newWorkout,
      selectedMuscleGroups: muscleGroups,
      currentStep: 'selectExercise',
      exerciseLogs: [], // Reset exercise logs for new workout
    });
  },

  completeWorkout: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const completedWorkout: WorkoutLog = {
      ...activeWorkout,
      t_complete: new Date(),
    };

    set((state) => ({
      activeWorkout: null,
      workoutHistory: [...state.workoutHistory, completedWorkout],
      currentStep: 'ready',
      selectedMuscleGroups: [],
      currentExerciseLogId: null,
      exerciseLogs: [], // Clear exercise logs after workout completion
    }));
  },

  cancelWorkout: () => {
    set({
      activeWorkout: null,
      currentStep: 'ready',
      selectedMuscleGroups: [],
      currentExerciseLogId: null,
      exerciseLogs: [],
    });
  },

  // Exercise management actions
  addExerciseToWorkout: (exerciseId: string) => {
    const { activeWorkout, exercises, exerciseLogs } = get();
    if (!activeWorkout) return;

    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    // Check if there's already an incomplete exercise log for this exercise
    const existingIncompleteLog = exerciseLogs.find(
      log => log.exerciseName === exercise.name && !log.t_complete
    );

    if (existingIncompleteLog) {
      // Reuse existing incomplete exercise log
      set(() => ({
        currentExerciseLogId: existingIncompleteLog.id,
        currentStep: 'logSets',
      }));
      return;
    }

    // Create new exercise log only if no incomplete one exists
    const exerciseLogId = get().generateId();
    const newExerciseLog: ExerciseLog = {
      id: exerciseLogId,
      workoutLogId: activeWorkout.id,
      exerciseName: exercise.name,
      sets: [],
      t_create: new Date(),
    };

    set((state) => ({
      exerciseLogs: [...state.exerciseLogs, newExerciseLog],
      activeWorkout: {
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, exerciseLogId],
      },
      currentExerciseLogId: exerciseLogId,
      currentStep: 'logSets',
    }));
  },

  completeExercise: (exerciseLogId: string) => {
    set((state) => ({
      exerciseLogs: state.exerciseLogs.map(log =>
        log.id === exerciseLogId
          ? { ...log, t_complete: new Date() }
          : log
      ),
      currentStep: 'progress',
      currentExerciseLogId: null,
    }));
  },

  // Set management actions
  addSetToExercise: (exerciseLogId: string, weight: number, reps: number) => {
    set((state) => ({
      exerciseLogs: state.exerciseLogs.map(log =>
        log.id === exerciseLogId
          ? {
              ...log,
              sets: [
                ...log.sets,
                {
                  weight,
                  reps,
                  t_create: new Date(),
                },
              ],
            }
          : log
      ),
    }));
  },

  completeSet: (exerciseLogId: string, setIndex: number) => {
    set((state) => ({
      exerciseLogs: state.exerciseLogs.map(log =>
        log.id === exerciseLogId
          ? {
              ...log,
              sets: log.sets.map((set, index) =>
                index === setIndex
                  ? { ...set, t_complete: new Date() }
                  : set
              ),
            }
          : log
      ),
    }));
  },

  // UI state management
  setCurrentStep: (step: WorkoutState['currentStep']) => {
    set({ currentStep: step });
  },

  setSelectedMuscleGroups: (groups: MuscleGroup[]) => {
    set({ selectedMuscleGroups: groups });
  },

  setCurrentExerciseLogId: (id: string | null) => {
    set({ currentExerciseLogId: id });
  },

  // Utility functions
  getCurrentExerciseLog: () => {
    const { currentExerciseLogId, exerciseLogs } = get();
    if (!currentExerciseLogId) return null;
    return exerciseLogs.find(log => log.id === currentExerciseLogId) || null;
  },

  getExercisesForSelectedGroups: () => {
    const { selectedMuscleGroups, exercises } = get();
    return exercises.filter(exercise =>
      selectedMuscleGroups.includes(exercise.muscleGroup)
    );
  },

  generateId: () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  resetWorkoutState: () => {
    set({
      activeWorkout: null,
      exerciseLogs: [],
      currentStep: 'ready',
      selectedMuscleGroups: [],
      currentExerciseLogId: null,
    });
  },
}));

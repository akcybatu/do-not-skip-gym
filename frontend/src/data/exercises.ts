import { Exercise } from '../types/workout';

export const EXERCISE_DATABASE: Exercise[] = [
  // Back exercises
  { id: 'back-1', name: 'Pull-ups', muscleGroup: 'back', icon: '💪' },
  { id: 'back-2', name: 'Lat Pulldowns', muscleGroup: 'back', icon: '💪' },
  { id: 'back-3', name: 'Seated Cable Rows', muscleGroup: 'back', icon: '💪' },
  { id: 'back-4', name: 'Barbell Rows', muscleGroup: 'back', icon: '💪' },
  { id: 'back-5', name: 'T-Bar Rows', muscleGroup: 'back', icon: '💪' },
  { id: 'back-6', name: 'Deadlifts', muscleGroup: 'back', icon: '💪' },
  { id: 'back-7', name: 'Shrugs', muscleGroup: 'back', icon: '💪' },
  { id: 'back-8', name: 'Face Pulls', muscleGroup: 'back', icon: '💪' },

  // Chest exercises
  { id: 'chest-1', name: 'Bench Press', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-2', name: 'Incline Bench Press', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-3', name: 'Decline Bench Press', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-4', name: 'Dumbbell Press', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-5', name: 'Incline Dumbbell Press', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-6', name: 'Chest Flyes', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-7', name: 'Cable Flyes', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-8', name: 'Push-ups', muscleGroup: 'chest', icon: '🏋️' },
  { id: 'chest-9', name: 'Dips', muscleGroup: 'chest', icon: '🏋️' },

  // Shoulder exercises
  { id: 'shoulder-1', name: 'Overhead Press', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-2', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-3', name: 'Lateral Raises', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-4', name: 'Front Raises', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-5', name: 'Rear Delt Flyes', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-6', name: 'Arnold Press', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-7', name: 'Upright Rows', muscleGroup: 'shoulder', icon: '🤸' },
  { id: 'shoulder-8', name: 'Pike Push-ups', muscleGroup: 'shoulder', icon: '🤸' },

  // Biceps exercises
  { id: 'biceps-1', name: 'Barbell Curls', muscleGroup: 'biceps', icon: '💪' },
  { id: 'biceps-2', name: 'Dumbbell Curls', muscleGroup: 'biceps', icon: '💪' },
  { id: 'biceps-3', name: 'Hammer Curls', muscleGroup: 'biceps', icon: '💪' },
  { id: 'biceps-4', name: 'Preacher Curls', muscleGroup: 'biceps', icon: '💪' },
  { id: 'biceps-5', name: 'Cable Curls', muscleGroup: 'biceps', icon: '💪' },
  { id: 'biceps-6', name: 'Concentration Curls', muscleGroup: 'biceps', icon: '💪' },
  { id: 'biceps-7', name: '21s (Curl Variation)', muscleGroup: 'biceps', icon: '💪' },

  // Triceps exercises
  { id: 'triceps-1', name: 'Close-Grip Bench Press', muscleGroup: 'triceps', icon: '🔨' },
  { id: 'triceps-2', name: 'Tricep Dips', muscleGroup: 'triceps', icon: '🔨' },
  { id: 'triceps-3', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', icon: '🔨' },
  { id: 'triceps-4', name: 'Tricep Pushdowns', muscleGroup: 'triceps', icon: '🔨' },
  { id: 'triceps-5', name: 'Diamond Push-ups', muscleGroup: 'triceps', icon: '🔨' },
  { id: 'triceps-6', name: 'Skull Crushers', muscleGroup: 'triceps', icon: '🔨' },
  { id: 'triceps-7', name: 'Kickbacks', muscleGroup: 'triceps', icon: '🔨' },

  // Legs exercises
  { id: 'legs-1', name: 'Squats', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-2', name: 'Leg Press', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-3', name: 'Lunges', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-4', name: 'Romanian Deadlifts', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-5', name: 'Leg Curls', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-6', name: 'Leg Extensions', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-7', name: 'Calf Raises', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-8', name: 'Bulgarian Split Squats', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-9', name: 'Hip Thrusts', muscleGroup: 'legs', icon: '🦵' },
  { id: 'legs-10', name: 'Walking Lunges', muscleGroup: 'legs', icon: '🦵' },

  // Abs exercises
  { id: 'abs-1', name: 'Crunches', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-2', name: 'Planks', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-3', name: 'Russian Twists', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-4', name: 'Leg Raises', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-5', name: 'Mountain Climbers', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-6', name: 'Dead Bug', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-7', name: 'Bicycle Crunches', muscleGroup: 'abs', icon: '🏃' },
  { id: 'abs-8', name: 'Hanging Knee Raises', muscleGroup: 'abs', icon: '🏃' },

  // Cardio exercises
  { id: 'cardio-1', name: 'Treadmill', muscleGroup: 'cardio', icon: '🏃‍♂️' },
  { id: 'cardio-2', name: 'Elliptical', muscleGroup: 'cardio', icon: '🏃‍♂️' },
  { id: 'cardio-3', name: 'Stationary Bike', muscleGroup: 'cardio', icon: '🚴' },
  { id: 'cardio-4', name: 'Rowing Machine', muscleGroup: 'cardio', icon: '🚣' },
  { id: 'cardio-5', name: 'Stair Climber', muscleGroup: 'cardio', icon: '🏃‍♂️' },
  { id: 'cardio-6', name: 'Jump Rope', muscleGroup: 'cardio', icon: '🏃‍♂️' },
  { id: 'cardio-7', name: 'Burpees', muscleGroup: 'cardio', icon: '🏃‍♂️' },
  { id: 'cardio-8', name: 'High Knees', muscleGroup: 'cardio', icon: '🏃‍♂️' },
];

// Helper functions for exercise database
export const getExercisesByMuscleGroup = (muscleGroup: string) => {
  return EXERCISE_DATABASE.filter(exercise => exercise.muscleGroup === muscleGroup);
};

export const getExercisesByMuscleGroups = (muscleGroups: string[]) => {
  return EXERCISE_DATABASE.filter(exercise => 
    muscleGroups.includes(exercise.muscleGroup)
  );
};

export const getExerciseById = (id: string) => {
  return EXERCISE_DATABASE.find(exercise => exercise.id === id);
};

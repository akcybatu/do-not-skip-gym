// Validation utilities for workout tracking

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateWeight = (weight: string): ValidationResult => {
  if (!weight.trim()) {
    return { isValid: false, error: 'Weight is required' };
  }

  const weightNum = parseFloat(weight);
  
  if (isNaN(weightNum)) {
    return { isValid: false, error: 'Weight must be a valid number' };
  }

  if (weightNum <= 0) {
    return { isValid: false, error: 'Weight must be greater than 0' };
  }

  if (weightNum > 1000) {
    return { isValid: false, error: 'Weight must be less than 1000 lbs' };
  }

  // Check for reasonable decimal places (max 2)
  const decimalPlaces = weight.split('.')[1];
  if (decimalPlaces && decimalPlaces.length > 2) {
    return { isValid: false, error: 'Weight can have at most 2 decimal places' };
  }

  return { isValid: true };
};

export const validateReps = (reps: string): ValidationResult => {
  if (!reps.trim()) {
    return { isValid: false, error: 'Reps are required' };
  }

  const repsNum = parseInt(reps);
  
  if (isNaN(repsNum) || !Number.isInteger(parseFloat(reps))) {
    return { isValid: false, error: 'Reps must be a whole number' };
  }

  if (repsNum <= 0) {
    return { isValid: false, error: 'Reps must be greater than 0' };
  }

  if (repsNum > 100) {
    return { isValid: false, error: 'Reps must be less than 100' };
  }

  return { isValid: true };
};

export const validateSetInputs = (weight: string, reps: string): ValidationResult => {
  const weightValidation = validateWeight(weight);
  if (!weightValidation.isValid) {
    return weightValidation;
  }

  const repsValidation = validateReps(reps);
  if (!repsValidation.isValid) {
    return repsValidation;
  }

  return { isValid: true };
};

// Format validation for display
export const formatValidationError = (error: string): string => {
  return error.charAt(0).toUpperCase() + error.slice(1);
};

// Formatting utilities for workout data display

export const formatDuration = (startTime: Date, endTime?: Date): string => {
  const end = endTime || new Date();
  const diffMs = end.getTime() - startTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) {
    return '< 1 min';
  } else if (diffMins < 60) {
    return `${diffMins} min`;
  } else {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};

export const formatWeight = (weight: number): string => {
  // Remove unnecessary decimal places
  if (weight % 1 === 0) {
    return weight.toString();
  }
  return weight.toFixed(2).replace(/\.?0+$/, '');
};

export const formatVolume = (volume: number): string => {
  return volume.toLocaleString();
};

export const formatSetDisplay = (weight: number, reps: number, index?: number): string => {
  const setPrefix = index !== undefined ? `Set ${index + 1}: ` : '';
  return `${setPrefix}${formatWeight(weight)} lbs × ${reps} reps`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatExerciseSummary = (setsCount: number, volume: number): string => {
  const setsText = setsCount === 1 ? 'set' : 'sets';
  return `${setsCount} ${setsText} • ${formatVolume(volume)} lbs total volume`;
};

export type MuscleGroup = 'upper' | 'legs' | 'back' | 'chest' | 'arms' | 'cardio';

export interface ExerciseDefinition {
  id: string;
  name: {
    en: string;
    es: string;
  };
  group: MuscleGroup;
}

export const EXERCISE_CATALOG: ExerciseDefinition[] = [
  // Upper / Shoulders
  { id: 'shoulder_press', name: { en: 'Shoulder Press Machine', es: 'Prensa de Hombros' }, group: 'upper' },
  { id: 'lateral_raise', name: { en: 'Lateral Raises', es: 'Elevaciones Laterales' }, group: 'upper' },
  
  // Chest
  { id: 'bench_press', name: { en: 'Bench Press', es: 'Press de Banca' }, group: 'chest' },
  { id: 'chest_fly', name: { en: 'Chest Fly Machine', es: 'Máquina de Aperturas' }, group: 'chest' },
  { id: 'incline_press', name: { en: 'Incline Dumbbell Press', es: 'Press Inclinado' }, group: 'chest' },

  // Back
  { id: 'lat_pulldown', name: { en: 'Lat Pulldown', es: 'Jalón al Pecho' }, group: 'back' },
  { id: 'seated_row', name: { en: 'Seated Row', es: 'Máquina de Remo' }, group: 'back' },
  { id: 'pull_ups', name: { en: 'Pull-ups', es: 'Dominadas' }, group: 'back' },

  // Legs
  { id: 'leg_press', name: { en: 'Leg Press', es: 'Prensa de Piernas' }, group: 'legs' },
  { id: 'squats', name: { en: 'Barbell Squats', es: 'Sentadillas' }, group: 'legs' },
  { id: 'leg_extension', name: { en: 'Leg Extension', es: 'Extensión de Piernas' }, group: 'legs' },
  { id: 'leg_curl', name: { en: 'Leg Curl', es: 'Curl de Piernas' }, group: 'legs' },

  // Arms
  { id: 'bicep_curl', name: { en: 'Dumbbell Bicep Curls', es: 'Curl de Bíceps' }, group: 'arms' },
  { id: 'tricep_pushdown', name: { en: 'Tricep Pushdown', es: 'Extensión de Tríceps' }, group: 'arms' },
  { id: 'hammer_curl', name: { en: 'Hammer Curls', es: 'Curl Martillo' }, group: 'arms' },

  // Cardio
  { id: 'treadmill', name: { en: 'Treadmill', es: 'Cinta de Correr' }, group: 'cardio' },
  { id: 'cycling', name: { en: 'Stationary Bike', es: 'Bicicleta Estática' }, group: 'cardio' },
  { id: 'rowing', name: { en: 'Rowing Machine', es: 'Máquina de Remo Cardio' }, group: 'cardio' },
];
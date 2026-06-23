import { type SetRecord } from '@/components/exercise-card';

export interface WorkoutState {
  sessionDate: string;
  exercises: {
    [exerciseId: string]: SetRecord[];
  };
}

export type WorkoutAction =
  | { type: 'ADD_SET'; exerciseId: string; reps: number; weight: number }
  | { type: 'REMOVE_SET'; exerciseId: string; setId: string }
  | { type: 'RESET_WORKOUT' }
  | { type: 'LOAD_WORKOUT'; state: WorkoutState };

export const initialState: WorkoutState = {
  sessionDate: new Date().toISOString().split('T')[0],
  exercises: {},
};

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'ADD_SET': {
      const newSet: SetRecord = {
        id: Math.random().toString(36).substr(2, 9),
        reps: action.reps,
        weight: action.weight,
      };
      const existingSets = state.exercises[action.exerciseId] || [];
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [action.exerciseId]: [...existingSets, newSet],
        },
      };
    }
    case 'REMOVE_SET': {
      const updatedSets = (state.exercises[action.exerciseId] || []).filter(
        (s) => s.id !== action.setId
      );
      const newExercises = { ...state.exercises };
      if (updatedSets.length === 0) {
        delete newExercises[action.exerciseId];
      } else {
        newExercises[action.exerciseId] = updatedSets;
      }
      return {
        ...state,
        exercises: newExercises,
      };
    }
    case 'RESET_WORKOUT':
      return {
        ...initialState,
        sessionDate: new Date().toISOString().split('T')[0],
      };
    case 'LOAD_WORKOUT':
      return action.state;
    default:
      return state;
  }
}
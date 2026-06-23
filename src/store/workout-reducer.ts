import { type SetRecord } from '@/components/exercise-card';
import { type ExerciseDefinition, EXERCISE_CATALOG } from '@/lib/exercise-catalog';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DaySession {
  exercises: {
    [exerciseId: string]: SetRecord[];
  };
}

export interface WorkoutState {
  activeDay: WeekDay;
  sessions: {
    [key in WeekDay]: DaySession;
  };
  customExercises: ExerciseDefinition[];
}

export type WorkoutAction =
  | { type: 'ADD_SET'; exerciseId: string; reps: number; weight: number }
  | { type: 'REMOVE_SET'; exerciseId: string; setId: string }
  | { type: 'RESET_DAY' }
  | { type: 'SET_DAY'; day: WeekDay }
  | { type: 'ADD_CUSTOM_EXERCISE'; exercise: ExerciseDefinition }
  | { type: 'LOAD_STATE'; state: WorkoutState };

// Utilidad para crear una sesión vacía con su propia referencia de objeto
const createEmptySession = (): DaySession => ({ exercises: {} });

export const initialState: WorkoutState = {
  activeDay: 'monday',
  sessions: {
    monday: createEmptySession(),
    tuesday: createEmptySession(),
    wednesday: createEmptySession(),
    thursday: createEmptySession(),
    friday: createEmptySession(),
    saturday: createEmptySession(),
    sunday: createEmptySession(),
  },
  customExercises: [],
};

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'SET_DAY':
      return { ...state, activeDay: action.day };

    case 'ADD_SET': {
      const { activeDay } = state;
      const newSet: SetRecord = {
        id: Math.random().toString(36).substring(2, 9),
        reps: action.reps,
        weight: action.weight,
      };
      const currentSession = state.sessions[activeDay];
      const existingSets = currentSession.exercises[action.exerciseId] || [];
      
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [activeDay]: {
            ...currentSession,
            exercises: {
              ...currentSession.exercises,
              [action.exerciseId]: [...existingSets, newSet],
            },
          },
        },
      };
    }

    case 'REMOVE_SET': {
      const { activeDay } = state;
      const currentSession = state.sessions[activeDay];
      const updatedSets = (currentSession.exercises[action.exerciseId] || []).filter(
        (s) => s.id !== action.setId
      );
      
      const newExercises = { ...currentSession.exercises };
      if (updatedSets.length === 0) {
        delete newExercises[action.exerciseId];
      } else {
        newExercises[action.exerciseId] = updatedSets;
      }

      return {
        ...state,
        sessions: {
          ...state.sessions,
          [activeDay]: {
            ...currentSession,
            exercises: newExercises,
          },
        },
      };
    }

    case 'ADD_CUSTOM_EXERCISE':
      return {
        ...state,
        customExercises: [...state.customExercises, action.exercise],
      };

    case 'RESET_DAY':
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [state.activeDay]: createEmptySession(),
        },
      };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

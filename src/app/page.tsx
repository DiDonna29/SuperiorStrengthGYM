"use client"

import React, { useState, useEffect } from 'react';
import { translations, type Language } from '@/lib/translations';
import { ExerciseCard, type SetRecord } from '@/components/exercise-card';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  Languages, 
  RotateCcw, 
  Flame, 
  LayoutGrid, 
  Trophy,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkoutData = {
  [key: string]: SetRecord[];
};

export default function TrackerPage() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [workout, setWorkout] = useState<WorkoutData>({});
  const [mounted, setMounted] = useState(false);

  const t = translations[lang];

  const exerciseIds = [
    { id: 'benchPress', name: t.benchPress },
    { id: 'pullUps', name: t.pullUps },
    { id: 'shoulderPress', name: t.shoulderPress },
    { id: 'latPulldown', name: t.latPulldown },
    { id: 'bicepCurls', name: t.bicepCurls },
    { id: 'tricepExtensions', name: t.tricepExtensions }
  ];

  useEffect(() => {
    setMounted(true);
    const savedWorkout = localStorage.getItem('ss-workout-v1');
    const savedLang = localStorage.getItem('ss-lang');
    const savedTheme = localStorage.getItem('ss-theme');

    if (savedWorkout) setWorkout(JSON.parse(savedWorkout));
    if (savedLang) setLang(savedLang as Language);
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ss-workout-v1', JSON.stringify(workout));
    }
  }, [workout, mounted]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('ss-theme', nextTheme);
  };

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'es' : 'en';
    setLang(nextLang);
    localStorage.setItem('ss-lang', nextLang);
  };

  const addSet = (exerciseId: string, reps: number, weight: number) => {
    const newSet: SetRecord = {
      id: Math.random().toString(36).substr(2, 9),
      reps,
      weight
    };
    setWorkout(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), newSet]
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].filter(s => s.id !== setId)
    }));
  };

  const resetWorkout = () => {
    if (confirm(lang === 'en' ? 'Are you sure you want to clear today\'s session?' : '¿Estás seguro de que quieres limpiar la sesión de hoy?')) {
      setWorkout({});
    }
  };

  // Stats calculation
  const totalVolume = Object.values(workout).flat().reduce((acc, curr) => acc + (curr.reps * curr.weight), 0);
  const completedExercises = Object.values(workout).filter(sets => sets.length > 0).length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full">
              <Languages className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border shadow-sm flex flex-col items-center justify-center text-center">
            <Activity className="w-5 h-5 text-primary mb-1" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">{t.totalExercises}</span>
            <span className="text-2xl font-black font-headline text-foreground">{completedExercises}</span>
          </div>
          <div className="p-4 rounded-xl bg-card border shadow-sm flex flex-col items-center justify-center text-center">
            <Trophy className="w-5 h-5 text-secondary mb-1" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">{t.totalVolume}</span>
            <span className="text-2xl font-black font-headline text-foreground">{totalVolume}kg</span>
          </div>
        </section>

        {/* Action Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 font-headline text-lg font-bold">
            <LayoutGrid className="w-5 h-5 text-primary" />
            {lang === 'en' ? 'Today\'s Routine' : 'Rutina de Hoy'}
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetWorkout}
            className="text-xs font-bold border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            {t.reset}
          </Button>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exerciseIds.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              name={exercise.name}
              sets={workout[exercise.id] || []}
              onAddSet={addSet}
              onRemoveSet={removeSet}
              translations={{
                sets: t.sets,
                reps: t.reps,
                weight: t.weight,
                addSet: t.addSet
              }}
            />
          ))}
        </div>

        {completedExercises === 0 && (
          <div className="mt-12 text-center py-20 px-4 rounded-3xl bg-accent/20 border-2 border-dashed border-accent">
            <DumbbellIcon className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium max-w-xs mx-auto italic">
              {t.emptyMessage}
            </p>
          </div>
        )}
      </main>

      {/* Floating Save Status */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Activity className="w-3 h-3 text-secondary" />
          {t.save}
        </div>
      </div>
    </div>
  );
}

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6.5 6.5h11" />
      <path d="M6.5 17.5h11" />
      <path d="m3 21 18-18" />
      <path d="m3 3 18 18" />
      <rect x="2" y="6" width="4" height="12" rx="2" />
      <rect x="18" y="6" width="4" height="12" rx="2" />
    </svg>
  );
}

"use client"

import React, { useState, useEffect } from 'react';
import { translations, type Language } from '@/lib/translations';
import { ExerciseCard, type SetRecord } from '@/components/exercise-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Languages, 
  RotateCcw, 
  Flame, 
  LayoutGrid, 
  Trophy,
  Activity,
  Dumbbell,
  ArrowRight
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
    const savedWorkout = localStorage.getItem('ss-workout-v2');
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
      localStorage.setItem('ss-workout-v2', JSON.stringify(workout));
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
    const message = lang === 'en' ? 'Clear session?' : '¿Limpiar sesión?';
    if (confirm(message)) {
      setWorkout({});
    }
  };

  const totalVolume = Object.values(workout).flat().reduce((acc, curr) => acc + (curr.reps * curr.weight), 0);
  const completedExercises = Object.values(workout).filter(sets => sets.length > 0).length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary/20 overflow-x-hidden">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
              <div className="relative bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none uppercase">
                {t.title}
              </h1>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] mt-1 opacity-70">
                {t.subtitle}
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-xl hover:bg-secondary">
              <Languages className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl hover:bg-secondary">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Stats Grid - Asymmetric Layout Variance */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-1 p-6 rounded-2xl bg-card border premium-shadow flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground opacity-60">Status</span>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">{completedExercises}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.totalExercises}</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-2 p-6 rounded-2xl bg-primary text-primary-foreground premium-shadow flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Trophy className="w-64 h-64 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Session Power</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl md:text-6xl font-black font-headline tracking-tighter">{totalVolume.toLocaleString()}</p>
                <span className="text-xl font-bold opacity-60">kg</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">{t.totalVolume}</p>
            </div>
          </motion.div>
        </section>

        {/* Dashboard Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-black font-headline tracking-tight flex items-center gap-3">
              <LayoutGrid className="w-6 h-6 text-primary" />
              {lang === 'en' ? 'Today\'s Arsenal' : 'Arsenal de Hoy'}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {lang === 'en' ? 'Track your progression, lift by lift.' : 'Registra tu progreso, levantamiento por levantamiento.'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetWorkout}
            className="rounded-xl font-bold border-2 h-11 px-6 hover:bg-destructive hover:text-white hover:border-destructive transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Exercise Grid - Responsive Adaptive */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exerciseIds.map((exercise, idx) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ExerciseCard
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
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {completedExercises === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex flex-col items-center text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Dumbbell className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold font-headline mb-2">{lang === 'en' ? 'Empty Arena' : 'Arena Vacía'}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {t.emptyMessage}
            </p>
            <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 group">
              {lang === 'en' ? 'Start Training' : 'Empezar Entrenamiento'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </main>

      {/* Persistence Notification */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="bg-foreground text-background px-6 py-3 rounded-2xl premium-shadow flex items-center gap-3 text-xs font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          {t.save}
        </div>
      </motion.div>
    </div>
  );
}

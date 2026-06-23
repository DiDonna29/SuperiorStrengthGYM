"use client"

import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { translations, type Language } from '@/lib/translations';
import { ExerciseCard } from '@/components/exercise-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Languages, 
  RotateCcw, 
  Flame, 
  Trophy,
  Activity,
  Dumbbell,
  CalendarDays,
  Zap,
  Plus
} from 'lucide-react';
import { workoutReducer, initialState, type WeekDay } from '@/store/workout-reducer';
import { EXERCISE_CATALOG, type MuscleGroup } from '@/lib/exercise-catalog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BURN_FACTORS: Record<MuscleGroup, number> = {
  chest: 0.08,
  back: 0.10,
  legs: 0.15,
  shoulders: 0.07,
  biceps: 0.05,
  triceps: 0.05,
  cardio: 0.12
};

export default function TrackerPage() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeGroup, setActiveGroup] = useState<MuscleGroup>('chest');
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newExName, setNewExName] = useState('');
  const [newExGroup, setNewExGroup] = useState<MuscleGroup>('chest');

  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const t = translations[lang];

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('ss-master-state-v1');
    const savedLang = localStorage.getItem('ss-lang');
    const savedTheme = localStorage.getItem('ss-theme');

    if (savedState) {
      try {
        dispatch({ type: 'LOAD_STATE', state: JSON.parse(savedState) });
      } catch (e) { console.error(e); }
    }
    if (savedLang) setLang(savedLang as Language);
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ss-master-state-v1', JSON.stringify(state));
    }
  }, [state, mounted]);

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

  const fullCatalog = useMemo(() => {
    return [...EXERCISE_CATALOG, ...state.customExercises];
  }, [state.customExercises]);

  const currentSession = state.sessions[state.activeDay];

  const totalVolume = useMemo(() => {
    return Object.values(currentSession.exercises).flat().reduce((acc, curr) => acc + (curr.reps * curr.weight), 0);
  }, [currentSession.exercises]);

  const totalCalories = useMemo(() => {
    let total = 0;
    Object.entries(currentSession.exercises).forEach(([exerciseId, sets]) => {
      const exercise = fullCatalog.find(ex => ex.id === exerciseId);
      const factor = exercise ? BURN_FACTORS[exercise.group] : 0.05;
      const volume = sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
      total += volume * factor;
    });
    return Math.round(total);
  }, [currentSession.exercises, fullCatalog]);

  const completedCount = useMemo(() => Object.keys(currentSession.exercises).length, [currentSession.exercises]);

  const filteredExercises = useMemo(() => {
    return fullCatalog.filter(ex => ex.group === activeGroup);
  }, [activeGroup, fullCatalog]);

  const handleAddCustomExercise = () => {
    if (!newExName) return;
    const exercise = {
      id: `custom_${Date.now()}`,
      name: { en: newExName, es: newExName },
      group: newExGroup,
      isCustom: true
    };
    dispatch({ type: 'ADD_CUSTOM_EXERCISE', exercise });
    setNewExName('');
    setIsDialogOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary/20 overflow-x-hidden">
      <header className="sticky top-0 z-50 glass">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden shrink-0">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 shrink-0">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block overflow-hidden">
              <h1 className="text-xl font-black uppercase tracking-tight truncate">{t.title}</h1>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] truncate">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-hidden">
            <Select 
              value={state.activeDay} 
              onValueChange={(val) => dispatch({ type: 'SET_DAY', day: val as WeekDay })}
            >
              <SelectTrigger className="w-[120px] sm:w-[140px] rounded-xl font-bold bg-secondary/50 border-none truncate">
                <CalendarDays className="w-4 h-4 mr-2 text-primary shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {Object.keys(t.days).map((day) => (
                  <SelectItem key={day} value={day} className="font-bold">
                    {(t.days as any)[day]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-xl shrink-0">
              <Languages className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl shrink-0">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-card border premium-shadow flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-8 text-muted-foreground shrink-0">
              <Activity className="w-6 h-6 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest truncate">Day Stats</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-4xl font-black font-headline tracking-tighter truncate">{completedCount}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase truncate">{t.totalExercises}</p>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-primary text-primary-foreground premium-shadow relative overflow-hidden flex flex-col justify-between">
            <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12 pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 opacity-70 mb-6 gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <Trophy className="w-5 h-5 shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-widest truncate">{t.days[state.activeDay]}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md shrink-0">
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10 overflow-hidden">
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <p className="text-4xl sm:text-5xl md:text-6xl font-black font-headline tracking-tighter truncate max-w-full">
                    {totalVolume.toLocaleString()}
                  </p>
                  <span className="text-lg font-bold opacity-60 shrink-0">kg</span>
                </div>
                <p className="text-[11px] font-black uppercase opacity-80 tracking-widest mt-1 truncate">{t.totalVolume}</p>
              </div>

              <div className="flex flex-col sm:border-l sm:border-white/10 sm:pl-8 overflow-hidden">
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <p className="text-4xl sm:text-5xl md:text-6xl font-black font-headline tracking-tighter text-white truncate max-w-full">
                    {totalCalories.toLocaleString()}
                  </p>
                  <span className="text-lg font-bold opacity-60 shrink-0">kcal</span>
                </div>
                <p className="text-[11px] font-black uppercase opacity-80 tracking-widest mt-1 truncate">{t.estimatedCalories}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 overflow-hidden">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <Tabs 
              value={activeGroup} 
              onValueChange={(val) => setActiveGroup(val as MuscleGroup)}
            >
              <TabsList className="bg-secondary/50 p-1 h-12 rounded-2xl border flex flex-nowrap w-max sm:w-auto overflow-hidden">
                {Object.keys(t.muscleGroups).map((group) => (
                  <TabsTrigger 
                    key={group} 
                    value={group}
                    className="rounded-xl px-4 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {(t.muscleGroups as any)[group]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2 shrink-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl font-bold h-12 px-6 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addExercise}
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl sm:max-w-md overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="font-headline font-black uppercase">{t.addExercise}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4 overflow-hidden">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest">{t.exerciseName}</Label>
                    <Input 
                      placeholder="e.g. Hammer Strength Row" 
                      value={newExName} 
                      onChange={(e) => setNewExName(e.target.value)}
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-2 overflow-hidden">
                    <Label className="font-black text-[10px] uppercase tracking-widest">{t.selectMuscle}</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(t.muscleGroups).map(g => (
                        <Button 
                          key={g}
                          variant={newExGroup === g ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewExGroup(g as MuscleGroup)}
                          className="rounded-lg text-[10px] uppercase font-black"
                        >
                          {(t.muscleGroups as any)[g]}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddCustomExercise} className="w-full h-12 rounded-xl font-black uppercase">
                    Confirm Exercise
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-xl font-bold h-12 px-6 border-2 hover:bg-destructive hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t.reset}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-headline font-bold uppercase">{lang === 'en' ? 'Reset Today?' : '¿Reiniciar Día?'}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {lang === 'en' 
                      ? 'This will delete all exercise logs for today. This action cannot be undone.' 
                      : 'Esto eliminará todos los registros de ejercicios de hoy. Esta acción no se puede deshacer.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl font-bold">{lang === 'en' ? 'Cancel' : 'Cancelar'}</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => dispatch({ type: 'RESET_DAY' })}
                    className="rounded-xl font-bold bg-destructive hover:bg-destructive/90"
                  >
                    {lang === 'en' ? 'Clear Day' : 'Limpiar Día'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${state.activeDay}-${activeGroup}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name[lang]}
                sets={currentSession.exercises[exercise.id] || []}
                onAddSet={(id, r, w) => dispatch({ type: 'ADD_SET', exerciseId: id, reps: r, weight: w })}
                onRemoveSet={(eid, sid) => dispatch({ type: 'REMOVE_SET', exerciseId: eid, setId: sid })}
                translations={{
                  sets: t.sets,
                  reps: t.reps,
                  weight: t.weight,
                  addSet: t.addSet,
                  timeline: t.timeline,
                  volume: t.volume
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {completedCount === 0 && (
          <div className="mt-20 flex flex-col items-center text-center opacity-40 overflow-hidden">
            <Dumbbell className="w-20 h-20 mb-6 shrink-0" />
            <h3 className="text-xl font-bold font-headline uppercase mb-2 truncate">Arena Vacía</h3>
            <p className="text-sm font-medium max-w-xs">{t.emptyMessage}</p>
          </div>
        )}
      </main>

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

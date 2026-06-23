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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ArrowRight,
  LayoutGrid,
  Plus,
  CalendarDays
} from 'lucide-react';
import { workoutReducer, initialState, type WeekDay } from '@/store/workout-reducer';
import { EXERCISE_CATALOG, type MuscleGroup } from '@/lib/exercise-catalog';

export default function TrackerPage() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeGroup, setActiveGroup] = useState<MuscleGroup>('chest');
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Custom exercise form state
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
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black uppercase tracking-tight">{t.title}</h1>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={state.activeDay} 
              onValueChange={(val) => dispatch({ type: 'SET_DAY', day: val as WeekDay })}
            >
              <SelectTrigger className="w-[140px] rounded-xl font-bold bg-secondary/50 border-none">
                <CalendarDays className="w-4 h-4 mr-2 text-primary" />
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

            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-xl">
              <Languages className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-card border premium-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8 text-muted-foreground">
              <Activity className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Day Stats</span>
            </div>
            <div>
              <p className="text-4xl font-black font-headline tracking-tighter">{completedCount}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase">{t.totalExercises}</p>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-primary text-primary-foreground premium-shadow flex flex-col justify-between relative overflow-hidden">
            <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
            <div className="flex items-center justify-between relative z-10 opacity-60">
              <Trophy className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.days[state.activeDay]}</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2">
                <p className="text-5xl md:text-6xl font-black font-headline tracking-tighter">{totalVolume.toLocaleString()}</p>
                <span className="text-xl font-bold opacity-60">kg</span>
              </div>
              <p className="text-xs font-bold uppercase opacity-80">{t.totalVolume}</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <Tabs 
              value={activeGroup} 
              onValueChange={(val) => setActiveGroup(val as MuscleGroup)}
            >
              <TabsList className="bg-secondary/50 p-1 h-12 rounded-2xl border flex flex-nowrap w-max sm:w-auto">
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
              <DialogContent className="rounded-2xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline font-black uppercase">{t.addExercise}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest">{t.exerciseName}</Label>
                    <Input 
                      placeholder="e.g. Hammer Strength Row" 
                      value={newExName} 
                      onChange={(e) => setNewExName(e.target.value)}
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest">{t.selectMuscle}</Label>
                    <Select value={newExGroup} onValueChange={(v) => setNewExGroup(v as MuscleGroup)}>
                      <SelectTrigger className="h-12 rounded-xl font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {Object.keys(t.muscleGroups).map(g => (
                          <SelectItem key={g} value={g} className="font-bold">{(t.muscleGroups as any)[g]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCustomExercise} className="w-full h-12 rounded-xl font-black uppercase">
                    Confirm Exercise
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              onClick={() => confirm(lang === 'en' ? 'Reset today?' : '¿Reiniciar día?') && dispatch({ type: 'RESET_DAY' })}
              className="rounded-xl font-bold h-12 px-6 border-2 hover:bg-destructive hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.reset}
            </Button>
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
          <div className="mt-20 flex flex-col items-center text-center opacity-40">
            <Dumbbell className="w-20 h-20 mb-6" />
            <h3 className="text-xl font-bold font-headline uppercase mb-2">Arena Vacía</h3>
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

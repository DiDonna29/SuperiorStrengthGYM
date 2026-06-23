"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Dumbbell, History, Zap } from 'lucide-react';

export type SetRecord = {
  id: string;
  reps: number;
  weight: number;
};

interface ExerciseCardProps {
  id: string;
  name: string;
  sets: SetRecord[];
  onAddSet: (exerciseId: string, reps: number, weight: number) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  translations: {
    sets: string;
    reps: string;
    weight: string;
    addSet: string;
    timeline: string;
    volume: string;
  };
}

export function ExerciseCard({ id, name, sets, onAddSet, onRemoveSet, translations }: ExerciseCardProps) {
  const [newReps, setNewReps] = useState<string>('10');
  const [newWeight, setNewWeight] = useState<string>('0');

  const handleAdd = () => {
    const r = parseInt(newReps);
    const w = parseFloat(newWeight);
    if (!isNaN(r) && !isNaN(w)) {
      onAddSet(id, r, w);
    }
  };

  const volumePerExercise = sets.reduce((acc, curr) => acc + (curr.reps * curr.weight), 0);

  return (
    <Card className="overflow-hidden border premium-shadow bg-card/50 backdrop-blur-sm group h-full flex flex-col transition-all hover:border-primary/20 max-w-full">
      <CardHeader className="p-0 border-b border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-secondary rounded-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div className="overflow-hidden">
              <CardTitle className="font-headline text-lg font-bold tracking-tight text-foreground truncate max-w-[140px] sm:max-w-none">
                {name}
              </CardTitle>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">
                {volumePerExercise.toLocaleString()}kg total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 shrink-0">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-black text-primary">
              {sets.length}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col gap-8 overflow-hidden">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 overflow-hidden">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 truncate">
              {translations.reps}
            </Label>
            <Input 
              type="number" 
              value={newReps} 
              onChange={(e) => setNewReps(e.target.value)}
              className="h-12 text-lg font-bold rounded-xl bg-background border-2 focus-visible:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-1.5 overflow-hidden">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 truncate">
              {translations.weight}
            </Label>
            <Input 
              type="number" 
              value={newWeight} 
              onChange={(e) => setNewWeight(e.target.value)}
              className="h-12 text-lg font-bold rounded-xl bg-background border-2 focus-visible:ring-primary/20 transition-all"
            />
          </div>
          <div className="col-span-2">
            <Button 
              onClick={handleAdd}
              size="lg" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 group active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              {translations.addSet}
            </Button>
          </div>
        </div>

        <div className="space-y-4 overflow-hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground tracking-[0.2em] border-b pb-2 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <History className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{translations.timeline}</span>
            </div>
            <span className="shrink-0">{translations.volume}</span>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar flex-1">
            <AnimatePresence mode="popLayout">
              {sets.slice().reverse().map((set, index) => (
                <motion.div 
                  key={set.id} 
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-white/5 hover:border-primary/20 transition-all group/item overflow-hidden"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="text-[10px] font-black text-muted-foreground w-4 shrink-0">
                      #{sets.length - index}
                    </span>
                    <div className="flex items-baseline gap-1 overflow-hidden">
                      <span className="text-sm font-black truncate">{set.reps}</span>
                      <span className="text-[10px] font-bold text-muted-foreground shrink-0">REPS</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0 overflow-hidden">
                    <div className="flex flex-col items-end overflow-hidden">
                      <span className="text-sm font-black text-primary leading-none truncate">{set.weight}kg</span>
                      <span className="text-[9px] font-bold text-muted-foreground truncate">{(set.reps * set.weight).toLocaleString()}kg vol</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => onRemoveSet(id, set.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {sets.length === 0 && (
              <p className="text-center py-8 text-xs font-bold text-muted-foreground/40 italic">
                {translations.sets} 0. Ready?
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

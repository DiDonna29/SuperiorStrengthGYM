"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Dumbbell, History } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg bg-card">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5 py-4 px-6">
        <CardTitle className="font-headline text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          {name}
        </CardTitle>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          {sets.length} {translations.sets}
        </span>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Entry Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">{translations.reps}</Label>
            <Input 
              type="number" 
              value={newReps} 
              onChange={(e) => setNewReps(e.target.value)}
              className="h-9 font-medium"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">{translations.weight}</Label>
            <Input 
              type="number" 
              value={newWeight} 
              onChange={(e) => setNewWeight(e.target.value)}
              className="h-9 font-medium"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleAdd}
              size="sm" 
              className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-md"
            >
              <Plus className="w-4 h-4 mr-1" />
              {translations.addSet}
            </Button>
          </div>
        </div>

        {/* List of Sets */}
        {sets.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pb-1 border-b">
              <History className="w-3 h-3" />
              SESSION HISTORY
            </div>
            {sets.map((set, index) => (
              <div 
                key={set.id} 
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/50 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <div className="flex gap-4 text-sm font-medium">
                  <span className="text-muted-foreground">#{index + 1}</span>
                  <span>{set.reps} reps</span>
                  <span className="text-secondary font-bold">{set.weight}kg</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onRemoveSet(id, set.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
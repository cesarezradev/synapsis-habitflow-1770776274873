'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types';

const STORAGE_KEY = 'habitflow-habits';

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Exercise',
    emoji: '💪',
    color: '#ef4444',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    completions: {},
  },
  {
    id: '2',
    name: 'Read',
    emoji: '📚',
    color: '#8b5cf6',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    completions: {},
  },
  {
    id: '3',
    name: 'Meditate',
    emoji: '🧘',
    color: '#06b6d4',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    completions: {},
  },
  {
    id: '4',
    name: 'Drink Water',
    emoji: '💧',
    color: '#3b82f6',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    completions: {},
  },
];

// Generate some fake history for demo
function generateDemoData(habits: Habit[]): Habit[] {
  return habits.map(h => {
    const completions: Record<string, boolean> = {};
    for (let i = 1; i <= 14; i++) {
      const date = new Date(Date.now() - i * 86400000);
      const key = date.toISOString().split('T')[0];
      completions[key] = Math.random() > 0.35;
    }
    return { ...h, completions };
  });
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch {
        const demo = generateDemoData(defaultHabits);
        setHabits(demo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      }
    } else {
      const demo = generateDemoData(defaultHabits);
      setHabits(demo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    }
    setLoaded(true);
  }, []);

  const save = useCallback((updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const toggleHabit = useCallback((id: string, date: string) => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h;
        const completions = { ...h.completions };
        completions[date] = !completions[date];
        return { ...h, completions };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addHabit = useCallback((name: string, emoji: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      emoji,
      color,
      createdAt: new Date().toISOString(),
      completions: {},
    };
    setHabits(prev => {
      const updated = [...prev, newHabit];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getStreak = useCallback((habit: Habit): number => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let date = new Date();
    
    // Check if today is completed
    if (habit.completions[today]) {
      streak = 1;
      date = new Date(Date.now() - 86400000);
    }
    
    while (true) {
      const key = date.toISOString().split('T')[0];
      if (habit.completions[key]) {
        streak++;
        date = new Date(date.getTime() - 86400000);
      } else {
        break;
      }
    }
    return streak;
  }, []);

  const getCompletionRate = useCallback((habit: Habit, days: number = 7): number => {
    let completed = 0;
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      if (habit.completions[date]) completed++;
    }
    return Math.round((completed / days) * 100);
  }, []);

  const getWeekData = useCallback((habit: Habit): { day: string; done: boolean }[] => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const key = date.toISOString().split('T')[0];
      days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
        done: !!habit.completions[key],
      });
    }
    return days;
  }, []);

  return { habits, loaded, toggleHabit, addHabit, deleteHabit, getStreak, getCompletionRate, getWeekData, save };
}

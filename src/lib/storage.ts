import { Habit } from './types';

const STORAGE_KEY = 'habitflow_habits';

export function loadHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
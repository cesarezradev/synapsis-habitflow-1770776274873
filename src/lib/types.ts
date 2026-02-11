export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completions: string[];
}

export type ViewMode = 'today' | 'dashboard';

export const HABIT_COLORS = [
  '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#06b6d4', '#f97316',
];

export const HABIT_EMOJIS = [
  '💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '💤',
  '🥗', '🎵', '💊', '🚶', '🧹', '📱', '🌅', '🧠',
];

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDateKey(d));
  }
  return days;
}

export function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDateKey(d));
  }
  return days;
}

export function getDayLabel(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

export function getShortDate(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
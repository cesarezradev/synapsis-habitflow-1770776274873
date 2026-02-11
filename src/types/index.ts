export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completed
}

export type ViewMode = 'today' | 'dashboard';

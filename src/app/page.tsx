'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHabits } from '@/hooks/useHabits';
import HabitCard from '@/components/HabitCard';
import AddHabitModal from '@/components/AddHabitModal';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const { habits, loaded, toggleHabit, addHabit, deleteHabit, getStreak, getWeekData } = useHabits();
  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const dayName = new Date().toLocaleDateString('en', { weekday: 'long' });
  const dateStr = new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' });

  const completedCount = useMemo(
    () => habits.filter(h => h.completions[today]).length,
    [habits, today]
  );
  const totalCount = habits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{dayName}</p>
            <h1 className="text-2xl font-bold mt-0.5">{dateStr}</h1>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              editMode
                ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                : 'bg-surface-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {editMode ? '✓ Done' : '✎ Edit'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              {completedCount}/{totalCount} completed
            </span>
            <span className="text-sm font-semibold text-brand-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-surface-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Habits list */}
      <div className="px-4 mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completed={!!habit.completions[today]}
              streak={getStreak(habit)}
              weekData={getWeekData(habit)}
              onToggle={() => toggleHabit(habit.id, today)}
              editMode={editMode}
              onDelete={() => deleteHabit(habit.id)}
              onToggleDay={(date) => toggleHabit(habit.id, date)}
            />
          ))}
        </AnimatePresence>

        {habits.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-slate-500">No habits yet</p>
            <p className="text-slate-600 text-sm mt-1">Tap + to start building your routine</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAdd(true)}
        className="fixed right-5 bottom-24 w-14 h-14 rounded-2xl bg-brand-500 text-white text-2xl font-light shadow-lg shadow-brand-500/30 flex items-center justify-center z-40 hover:bg-brand-600 transition-colors"
      >
        +
      </motion.button>

      <AddHabitModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={addHabit} />
      <BottomNav />
    </main>
  );
}

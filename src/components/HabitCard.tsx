'use client';

import { motion } from 'framer-motion';
import { Habit } from '@/types';

interface Props {
  habit: Habit;
  completed: boolean;
  streak: number;
  weekData: { day: string; done: boolean }[];
  onToggle: () => void;
  editMode: boolean;
  onDelete: () => void;
  onToggleDay: (date: string) => void;
}

export default function HabitCard({ habit, completed, streak, weekData, onToggle, editMode, onDelete, onToggleDay }: Props) {
  const last7Dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return d.toISOString().split('T')[0];
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`glass-light rounded-2xl p-4 transition-all ${completed ? 'ring-1' : ''}`}
      style={{ borderColor: completed ? habit.color + '40' : undefined }}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={editMode ? undefined : onToggle}
          className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            backgroundColor: completed ? habit.color + '20' : 'rgba(15,23,42,0.6)',
            border: `2px solid ${completed ? habit.color : 'rgba(100,116,139,0.3)'}`,
          }}
        >
          {completed ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xl"
            >
              {habit.emoji}
            </motion.span>
          ) : (
            <span className="text-xl opacity-40">{habit.emoji}</span>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold truncate ${completed ? 'text-white' : 'text-slate-300'}`}>
              {habit.name}
            </h3>
            {streak > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium flex-shrink-0">
                🔥 {streak}
              </span>
            )}
          </div>
          
          {/* Mini week view */}
          <div className="flex gap-1.5 mt-2">
            {weekData.map((d, i) => (
              <button
                key={i}
                onClick={editMode ? () => onToggleDay(last7Dates[i]) : undefined}
                className="flex flex-col items-center gap-0.5"
                disabled={!editMode}
              >
                <span className="text-[10px] text-slate-600">{d.day}</span>
                <div
                  className={`w-5 h-5 rounded-md transition-all ${editMode ? 'cursor-pointer hover:scale-125' : ''}`}
                  style={{
                    backgroundColor: d.done ? habit.color : 'rgba(30,41,59,0.8)',
                    opacity: d.done ? 1 : 0.4,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Delete button in edit mode */}
        {editMode && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 hover:bg-red-500/30 transition-colors"
          >
            ✕
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

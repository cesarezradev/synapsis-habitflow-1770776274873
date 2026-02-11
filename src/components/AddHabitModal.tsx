'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['💪', '📚', '🧘', '💧', '🏃', '✍️', '🎯', '😴', '🥗', '💊', '🎸', '🧹', '💰', '🌿', '🤝', '📵'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, emoji: string, color: string) => void;
}

export default function AddHabitModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [color, setColor] = useState('#3b82f6');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), emoji, color);
    setName('');
    setEmoji('🎯');
    setColor('#3b82f6');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-3xl p-6 max-w-lg mx-auto"
            style={{ paddingBottom: 'calc(var(--safe-bottom, 16px) + 16px)' }}
          >
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-6" />
            
            <h2 className="text-xl font-bold mb-6">New Habit</h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning Run"
                  className="w-full bg-surface-900/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                        emoji === e
                          ? 'bg-brand-500/30 ring-2 ring-brand-400 scale-110'
                          : 'bg-surface-900/60 hover:bg-surface-800'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Color</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-9 h-9 rounded-full transition-all ${
                        color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl bg-surface-900/60 text-slate-400 font-medium transition-colors hover:bg-surface-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name.trim()}
                className="flex-1 py-3.5 rounded-xl bg-brand-500 text-white font-semibold transition-all hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit, getTodayKey, HABIT_COLORS, HABIT_EMOJIS, getLast7Days } from '@/lib/types';
import { loadHabits, saveHabits, generateId } from '@/lib/storage';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const today = getTodayKey();

  useEffect(() => {
    setHabits(loadHabits());
    setMounted(true);
  }, []);

  const persist = useCallback((updated: Habit[]) => {
    setHabits(updated);
    saveHabits(updated);
  }, []);

  const toggleCompletion = (habitId: string) => {
    if (editMode) return;
    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      const has = h.completions.includes(today);
      return {
        ...h,
        completions: has
          ? h.completions.filter(d => d !== today)
          : [...h.completions, today],
      };
    });
    persist(updated);
  };

  const toggleHistoryDay = (habitId: string, day: string) => {
    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      const has = h.completions.includes(day);
      return {
        ...h,
        completions: has
          ? h.completions.filter(d => d !== day)
          : [...h.completions, day],
      };
    });
    persist(updated);
  };

  const deleteHabit = (habitId: string) => {
    persist(habits.filter(h => h.id !== habitId));
  };

  const addHabit = (name: string, emoji: string, color: string) => {
    const habit: Habit = {
      id: generateId(),
      name,
      emoji,
      color,
      createdAt: today,
      completions: [],
    };
    persist([...habits, habit]);
    setShowCreate(false);
  };

  const completedToday = habits.filter(h => h.completions.includes(today)).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0;
  const last7 = getLast7Days();

  if (!mounted) {
    return <div className="min-h-screen bg-[#0f0a1e]" />;
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Hoje</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Progress Ring */}
      {total > 0 && (
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-5">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28" fill="none"
                stroke="url(#gradient)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 175.9} 175.9`}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-white font-semibold">{completedToday} de {total} concluídos</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {pct === 100 ? '🎉 Dia perfeito!' : pct >= 50 ? '💪 Quase lá!' : '🚀 Vamos nessa!'}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Hábito
        </button>

        {total > 0 && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              editMode
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'glass text-gray-300'
            }`}
          >
            {editMode ? '✓ Pronto' : '✏️ Editar'}
          </button>
        )}
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-400 text-sm">Nenhum hábito ainda</p>
          <p className="text-gray-500 text-xs mt-1">Toque em &quot;Novo Hábito&quot; para começar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit, i) => {
            const done = habit.completions.includes(today);
            const streak = getStreak(habit);
            return (
              <div
                key={habit.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                    done && !editMode ? 'ring-1 ring-green-500/30' : ''
                  }`}
                >
                  <div className="flex items-center p-4 gap-3">
                    {/* Check / Delete */}
                    {editMode ? (
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleCompletion(habit.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 ${
                          done
                            ? 'bg-green-500 shadow-lg shadow-green-500/25'
                            : 'border-2 border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {done && (
                          <svg className="w-5 h-5 text-white animate-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{habit.emoji}</span>
                        <span className={`font-medium transition-all ${done && !editMode ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {habit.name}
                        </span>
                      </div>
                      {streak > 0 && !editMode && (
                        <p className="text-xs mt-0.5" style={{ color: habit.color }}>
                          🔥 {streak} {streak === 1 ? 'dia' : 'dias'} seguidos
                        </p>
                      )}
                    </div>

                    {/* Mini dots (last 7 days) */}
                    {!editMode && (
                      <div className="flex gap-1">
                        {last7.slice(-5).map(day => (
                          <div
                            key={day}
                            className={`w-2 h-2 rounded-full transition-all ${
                              habit.completions.includes(day)
                                ? 'scale-100'
                                : 'bg-gray-700 scale-75'
                            }`}
                            style={habit.completions.includes(day) ? { backgroundColor: habit.color } : {}}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Edit mode: 7-day history */}
                  {editMode && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">Últimos 7 dias</p>
                      <div className="flex gap-2">
                        {last7.map(day => {
                          const isDone = habit.completions.includes(day);
                          const d = new Date(day + 'T12:00:00');
                          const label = d.toLocaleDateString('pt-BR', { weekday: 'narrow' });
                          return (
                            <button
                              key={day}
                              onClick={() => toggleHistoryDay(habit.id, day)}
                              className="flex flex-col items-center gap-1 flex-1"
                            >
                              <span className="text-[10px] text-gray-500">{label}</span>
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all active:scale-90 ${
                                  isDone ? 'text-white' : 'bg-gray-800 text-gray-500'
                                }`}
                                style={isDone ? { backgroundColor: habit.color } : {}}
                              >
                                {isDone ? '✓' : '–'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onAdd={addHabit}
        />
      )}
    </div>
  );
}

function getStreak(habit: Habit): number {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().split('T')[0];
    if (habit.completions.includes(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function CreateModal({ onClose, onAdd }: { onClose: () => void; onAdd: (n: string, e: string, c: string) => void }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');
  const [color, setColor] = useState(HABIT_COLORS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-strong rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up safe-bottom">
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5 sm:hidden" />

        <h2 className="text-lg font-bold text-white mb-5">Novo Hábito</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Nome do hábito..."
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-brand-500 transition-colors mb-4"
          maxLength={30}
        />

        {/* Emoji */}
        <p className="text-xs text-gray-400 mb-2">Ícone</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {HABIT_EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90 ${
                emoji === e ? 'bg-brand-600 scale-110' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Color */}
        <p className="text-xs text-gray-400 mb-2">Cor</p>
        <div className="flex gap-2 mb-6">
          {HABIT_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full transition-all active:scale-90 ${
                color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1230] scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Preview & Submit */}
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5">
          <span className="text-2xl">{emoji}</span>
          <span className="text-white font-medium">{name || 'Meu hábito'}</span>
          <div className="ml-auto w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl glass text-gray-300 font-medium transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={() => name.trim() && onAdd(name.trim(), emoji, color)}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-medium transition-all active:scale-95"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}

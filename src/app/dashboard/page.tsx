'use client';

import { useState, useEffect } from 'react';
import { Habit, getTodayKey, getLast7Days, getLast30Days, getDayLabel, getShortDate } from '@/lib/types';
import { loadHabits } from '@/lib/storage';

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    setHabits(loadHabits());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0f0a1e]" />;

  const today = getTodayKey();
  const days = timeRange === '7d' ? getLast7Days() : getLast30Days();
  const total = habits.length;

  // Daily completion rates
  const dailyRates = days.map(day => {
    if (total === 0) return 0;
    const completed = habits.filter(h => h.completions.includes(day)).length;
    return Math.round((completed / total) * 100);
  });

  // Per-habit stats
  const habitStats = habits.map(h => {
    const completed = days.filter(d => h.completions.includes(d)).length;
    const rate = Math.round((completed / days.length) * 100);
    const streak = getStreak(h);
    return { habit: h, completed, rate, streak };
  }).sort((a, b) => b.rate - a.rate);

  // Overall stats
  const avgRate = total > 0 ? Math.round(dailyRates.reduce((a, b) => a + b, 0) / dailyRates.length) : 0;
  const bestDay = dailyRates.indexOf(Math.max(...dailyRates));
  const todayRate = total > 0 ? Math.round((habits.filter(h => h.completions.includes(today)).length / total) * 100) : 0;
  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.filter(c => days.includes(c)).length, 0);

  return (
    <div className="max-w-md mx-auto px-4 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Sua evolução</p>
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {(['7d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === range ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {range === '7d' ? '7 dias' : '30 dias'}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 text-sm">Crie hábitos para ver as estatísticas</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard label="Hoje" value={`${todayRate}%`} sub={`${habits.filter(h => h.completions.includes(today)).length}/${total}`} icon="🎯" />
            <StatCard label="Média" value={`${avgRate}%`} sub={`últimos ${timeRange === '7d' ? '7' : '30'} dias`} icon="📈" />
            <StatCard label="Total" value={`${totalCompletions}`} sub="completados" icon="✅" />
            <StatCard label="Melhor dia" value={days[bestDay] ? getDayLabel(days[bestDay]) : '-'} sub={days[bestDay] ? `${dailyRates[bestDay]}%` : ''} icon="🏆" />
          </div>

          {/* Chart */}
          <div className="glass rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4">Taxa de Conclusão</h3>
            <div className="flex items-end gap-[3px] h-32">
              {dailyRates.map((rate, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative" style={{ height: '100px' }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${Math.max(rate, 2)}%`,
                        background: rate === 100
                          ? 'linear-gradient(180deg, #10b981, #059669)'
                          : rate >= 50
                          ? 'linear-gradient(180deg, #8b5cf6, #6d28d9)'
                          : 'linear-gradient(180deg, #4b5563, #374151)',
                      }}
                    />
                  </div>
                  {timeRange === '7d' && (
                    <span className="text-[9px] text-gray-500">{getDayLabel(days[i])}</span>
                  )}
                </div>
              ))}
            </div>
            {timeRange === '30d' && (
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-gray-500">{getShortDate(days[0])}</span>
                <span className="text-[9px] text-gray-500">{getShortDate(days[days.length - 1])}</span>
              </div>
            )}
          </div>

          {/* Habit Rankings */}
          <div className="glass rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4">Por Hábito</h3>
            <div className="space-y-3">
              {habitStats.map(({ habit, rate, streak, completed }) => (
                <div key={habit.id} className="flex items-center gap-3">
                  <span className="text-lg w-8 text-center">{habit.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white truncate">{habit.name}</span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{rate}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${rate}%`, backgroundColor: habit.color }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] text-gray-500">{completed}/{days.length} dias</span>
                      {streak > 0 && (
                        <span className="text-[10px]" style={{ color: habit.color }}>
                          🔥 {streak}d seguidos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="glass rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-white mb-4">Mapa de Atividade</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {getLast30Days().slice(-28).map(day => {
                const completed = habits.filter(h => h.completions.includes(day)).length;
                const intensity = total > 0 ? completed / total : 0;
                return (
                  <div
                    key={day}
                    className="aspect-square rounded-md transition-all"
                    style={{
                      backgroundColor: intensity === 0
                        ? 'rgba(255,255,255,0.03)'
                        : `rgba(139, 92, 246, ${0.2 + intensity * 0.8})`,
                    }}
                    title={`${day}: ${completed}/${total}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-3">
              <span className="text-[9px] text-gray-500">Menos</span>
              {[0, 0.25, 0.5, 0.75, 1].map(v => (
                <div
                  key={v}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: v === 0
                      ? 'rgba(255,255,255,0.03)'
                      : `rgba(139, 92, 246, ${0.2 + v * 0.8})`,
                  }}
                />
              ))}
              <span className="text-[9px] text-gray-500">Mais</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: string }) {
  return (
    <div className="glass rounded-2xl p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>
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

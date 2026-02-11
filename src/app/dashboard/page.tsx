'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '@/hooks/useHabits';
import BottomNav from '@/components/BottomNav';

export default function Dashboard() {
  const { habits, loaded, getStreak, getCompletionRate } = useHabits();

  const overallStats = useMemo(() => {
    if (habits.length === 0) return { todayRate: 0, weekRate: 0, bestStreak: 0, totalCompletions: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = habits.filter(h => h.completions[today]).length;
    const todayRate = Math.round((todayCompleted / habits.length) * 100);
    
    const weekRates = habits.map(h => getCompletionRate(h, 7));
    const weekRate = Math.round(weekRates.reduce((a, b) => a + b, 0) / weekRates.length);
    
    const bestStreak = Math.max(...habits.map(h => getStreak(h)));
    
    const totalCompletions = habits.reduce((sum, h) => 
      sum + Object.values(h.completions).filter(Boolean).length, 0
    );

    return { todayRate, weekRate, bestStreak, totalCompletions };
  }, [habits, getStreak, getCompletionRate]);

  const heatmapData = useMemo(() => {
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const key = date.toISOString().split('T')[0];
      const completed = habits.filter(h => h.completions[key]).length;
      const total = habits.length;
      const ratio = total > 0 ? completed / total : 0;
      days.push({ date: key, ratio, day: date.getDate(), weekday: date.getDay() });
    }
    return days;
  }, [habits]);

  const weeklyTrend = useMemo(() => {
    const weeks = [];
    for (let w = 3; w >= 0; w--) {
      let completed = 0;
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(Date.now() - (w * 7 + d) * 86400000).toISOString().split('T')[0];
        habits.forEach(h => {
          total++;
          if (h.completions[date]) completed++;
        });
      }
      weeks.push({ label: w === 0 ? 'This week' : `${w}w ago`, rate: total > 0 ? Math.round((completed / total) * 100) : 0 });
    }
    return weeks;
  }, [habits]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your habit analytics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        {[
          { label: 'Today', value: `${overallStats.todayRate}%`, icon: '📊', color: '#3b82f6' },
          { label: 'Week Avg', value: `${overallStats.weekRate}%`, icon: '📈', color: '#06b6d4' },
          { label: 'Best Streak', value: `${overallStats.bestStreak}d`, icon: '🔥', color: '#f97316' },
          { label: 'Total Done', value: `${overallStats.totalCompletions}`, icon: '✅', color: '#22c55e' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-light rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3 px-1">Activity (28 days)</h2>
        <div className="glass-light rounded-2xl p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {heatmapData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {i < 7 && (
                  <span className="text-[9px] text-slate-600">
                    {['S','M','T','W','T','F','S'][d.weekday]}
                  </span>
                )}
                <div
                  className="w-full aspect-square rounded-md transition-colors"
                  style={{
                    backgroundColor: d.ratio === 0
                      ? 'rgba(30,41,59,0.8)'
                      : d.ratio < 0.5
                        ? 'rgba(59,130,246,0.3)'
                        : d.ratio < 1
                          ? 'rgba(59,130,246,0.6)'
                          : '#3b82f6',
                  }}
                  title={`${d.date}: ${Math.round(d.ratio * 100)}%`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[10px] text-slate-600">Less</span>
            {[0, 0.3, 0.6, 1].map((v, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: v === 0 ? 'rgba(30,41,59,0.8)' : `rgba(59,130,246,${v})`,
                }}
              />
            ))}
            <span className="text-[10px] text-slate-600">More</span>
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3 px-1">Weekly Trend</h2>
        <div className="glass-light rounded-2xl p-4">
          <div className="space-y-3">
            {weeklyTrend.map((week, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16 text-right">{week.label}</span>
                <div className="flex-1 h-6 bg-surface-900/60 rounded-lg overflow-hidden">
                  <motion.div
                    className="h-full rounded-lg"
                    style={{
                      background: `linear-gradient(90deg, #3b82f6, ${week.rate > 70 ? '#22c55e' : '#06b6d4'})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${week.rate}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-300 w-10">{week.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-habit stats */}
      <div className="px-4 mt-6 mb-4">
        <h2 className="text-lg font-semibold mb-3 px-1">Per Habit</h2>
        <div className="space-y-2">
          {habits.map((habit, i) => {
            const rate = getCompletionRate(habit, 7);
            const streak = getStreak(habit);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-light rounded-xl p-3 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  {habit.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{habit.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{rate}% this week</span>
                    {streak > 0 && (
                      <span className="text-xs text-amber-400">🔥 {streak}d streak</span>
                    )}
                  </div>
                </div>
                <div className="w-16 h-2 bg-surface-900/60 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: habit.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${rate}%` }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

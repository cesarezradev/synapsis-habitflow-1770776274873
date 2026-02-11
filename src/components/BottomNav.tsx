'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/', label: 'Today', icon: '✓', activeIcon: '✓' },
  { href: '/dashboard', label: 'Stats', icon: '◔', activeIcon: '◉' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass" style={{ paddingBottom: 'var(--safe-bottom, 8px)' }}>
      <div className="flex items-center justify-around max-w-lg mx-auto px-6 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-0.5 py-2 px-6 rounded-2xl transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand-500/20 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`text-xl relative z-10 transition-transform ${active ? 'scale-110' : ''}`}>
                {active ? tab.activeIcon : tab.icon}
              </span>
              <span className={`text-xs relative z-10 font-medium ${active ? 'text-brand-400' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Camera, History, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
  onLogout?: () => void;
}

export const Layout = ({ children, user, onLogout }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'network', icon: Users, label: 'Network', path: '/network' },
    { id: 'scan', icon: Camera, label: 'Scan', path: '/scan', primary: true },
    { id: 'history', icon: History, label: 'History', path: '/history' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-20 sm:pb-0 sm:pl-20">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-slate-200 bg-white py-8 sm:flex">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <Camera className="h-6 w-6" />
        </div>
        <nav className="flex flex-1 flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="absolute left-16 scale-0 rounded-md bg-indigo-600 px-2 py-1 text-xs text-white transition-all group-hover:scale-100">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        {user && (
          <button
            onClick={onLogout}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-6 w-6" />
          </button>
        )}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-slate-200 bg-white/80 px-4 backdrop-blur-lg sm:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              'relative flex flex-col items-center gap-1 transition-all',
              item.primary
                ? 'mb-8 h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-white'
                : location.pathname === item.path
                ? 'text-indigo-600'
                : 'text-slate-400'
            )}
          >
            <item.icon className={cn('h-6 w-6', item.primary && 'h-8 w-8')} />
            {!item.primary && <span className="text-[10px] font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

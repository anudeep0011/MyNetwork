import React from 'react';
import { MemoryJarEntry } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface MemoryJarProps {
  entries: MemoryJarEntry[];
  onAddEntry?: (text: string) => void;
}

export const MemoryJar = ({ entries, onAddEntry }: MemoryJarProps) => {
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddEntry?.(text);
    setText('');
  };

  return (
    <Card className="flex h-[500px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Batch Memory Jar</CardTitle>
        <p className="text-xs text-slate-500">Share a one-line memory from your college years.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl bg-indigo-50/50 p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-700">"{entry.text}"</p>
            <p className="mt-2 text-[10px] text-slate-400">
              {entry.postedAt?.toDate ? formatDistanceToNow(entry.postedAt.toDate(), { addSuffix: true }) : 'Just now'}
            </p>
          </motion.div>
        ))}
      </CardContent>
      <div className="border-t border-slate-100 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a memory..."
            maxLength={100}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </div>
    </Card>
  );
};

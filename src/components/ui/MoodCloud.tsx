import React from 'react';
import { MOOD_OPTIONS } from '../../constants';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface MoodCloudProps {
  onSetMood?: (moodId: string) => void;
  entries: { moodId: string; count: number }[];
  currentMood?: string;
}

export const MoodCloud = ({ onSetMood, entries, currentMood }: MoodCloudProps) => {
  const moodCounts = entries.reduce((acc, entry) => ({ ...acc, [entry.moodId]: entry.count }), {} as Record<string, number>);
  const totalVotes = entries.reduce((a, b) => a + b.count, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Live Batch Mood</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-4 p-8">
        {MOOD_OPTIONS.map((mood) => {
          const count = moodCounts[mood.id] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
          const scale = 1 + (percentage / 100);

          return (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSetMood?.(mood.id)}
              className={`group flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                currentMood === mood.id
                  ? 'bg-indigo-100 ring-2 ring-indigo-500'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span
                className="text-4xl transition-transform group-hover:scale-110"
                style={{ transform: `scale(${scale})` }}
              >
                {mood.emoji}
              </span>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {mood.label}
                </p>
                <p className="text-xs font-bold text-indigo-600">{count}</p>
              </div>
            </motion.button>
          );
        })}
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { GraduationCap, MessageCircle, Send, User, CheckSquare, ArrowBigUp } from 'lucide-react';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';

interface BucketListEntry {
  id: string;
  text: string;
  votes: number;
  postedAt: any;
}

interface CollegeBucketListProps {
  onAddEntry?: (text: string) => void;
  onVote?: (id: string) => void;
  entries: BucketListEntry[];
}

export const CollegeBucketList = ({ onAddEntry, onVote, entries }: CollegeBucketListProps) => {
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddEntry?.(text);
    setText('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">College Bucket List</CardTitle>
        <p className="text-xs text-slate-500">Things you wish you had done during college.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-amber-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-amber-100 p-4 text-amber-600 shadow-sm">
              <CheckSquare className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Share Your Regrets</h4>
          <p className="mb-6 text-sm text-slate-600">
            A collective list of missed opportunities for future students to learn from.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Wish / Regret
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Should have joined the music club..."
                maxLength={100}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <Button type="submit" disabled={!text.trim()} className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Send className="h-4 w-4" />
              Add to List
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CheckSquare className="h-4 w-4 text-amber-600" />
            Collective Bucket List ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">"{entry.text}"</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  {entry.postedAt?.toDate ? formatDistanceToNow(entry.postedAt.toDate(), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => onVote?.(entry.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                >
                  <ArrowBigUp className="h-6 w-6" />
                </button>
                <span className="text-xs font-bold text-slate-900">{entry.votes}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

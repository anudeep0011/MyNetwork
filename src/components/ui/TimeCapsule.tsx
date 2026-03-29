import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Send } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { format } from 'date-fns';

interface TimeCapsuleProps {
  onAddEntry?: (text: string, unlockDate: Date) => void;
  entries: any[];
}

export const TimeCapsule = ({ onAddEntry, entries }: TimeCapsuleProps) => {
  const [text, setText] = React.useState('');
  const [unlockDate, setUnlockDate] = React.useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddEntry?.(text, unlockDate);
    setText('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Batch Time Capsule</CardTitle>
        <p className="text-xs text-slate-500">Write a message to your future self or the batch.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-indigo-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 shadow-sm">
              <Lock className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Lock Your Memories</h4>
          <p className="mb-6 text-sm text-slate-600">
            Messages are sealed until the unlock date. They will be revealed to everyone
            simultaneously.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              maxLength={500}
              className="h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Unlock Date
              </label>
              <input
                type="date"
                value={format(unlockDate, 'yyyy-MM-dd')}
                onChange={(e) => setUnlockDate(new Date(e.target.value))}
                min={format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button type="submit" disabled={!text.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              Seal Message
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock className="h-4 w-4 text-indigo-600" />
            Sealed Messages ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-slate-100 p-2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sealed Memory</p>
                  <p className="text-[10px] text-slate-500">
                    Unlocks on {format(entry.unlockDate.toDate(), 'PPP')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">Locked</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

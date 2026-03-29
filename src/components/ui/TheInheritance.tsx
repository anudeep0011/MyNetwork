import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { GraduationCap, MessageCircle, Send, User } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { formatDistanceToNow } from 'date-fns';

interface InheritanceTip {
  id: string;
  text: string;
  category: string;
  postedAt: any;
}

interface TheInheritanceProps {
  onAddTip?: (text: string, category: string) => void;
  entries: InheritanceTip[];
}

export const TheInheritance = ({ onAddTip, entries }: TheInheritanceProps) => {
  const [text, setText] = React.useState('');
  const [category, setCategory] = React.useState('Academic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTip?.(text, category);
    setText('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">The Inheritance</CardTitle>
        <p className="text-xs text-slate-500">Leave anonymous tips and advice for the junior batch.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-indigo-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 shadow-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Pass the Torch</h4>
          <p className="mb-6 text-sm text-slate-600">
            Your tips will be revealed to the junior batch when they reach their final year.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Academic">Academic</option>
                <option value="Campus">Campus</option>
                <option value="Social">Social</option>
                <option value="Survival">Survival</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tip
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your advice..."
                maxLength={150}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button type="submit" disabled={!text.trim()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-4 w-4" />
              Leave Tip
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <MessageCircle className="h-4 w-4 text-indigo-600" />
            Your Inheritance Tips ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{entry.category}</Badge>
                <p className="text-[10px] text-slate-400">
                  {entry.postedAt?.toDate ? formatDistanceToNow(entry.postedAt.toDate(), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
              <p className="text-sm text-slate-600 italic">"{entry.text}"</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

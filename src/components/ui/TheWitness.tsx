import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Send, Users, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { UserProfile } from '../../types';
import { format } from 'date-fns';

interface TheWitnessProps {
  onAddPromise?: (text: string, witnessIds: string[], reminderDate: Date) => void;
  users: UserProfile[];
  entries: any[];
}

export const TheWitness = ({ onAddPromise, users, entries }: TheWitnessProps) => {
  const [text, setText] = React.useState('');
  const [witnessIds, setWitnessIds] = React.useState<string[]>([]);
  const [reminderDate, setReminderDate] = React.useState(
    new Date(new Date().setMonth(new Date().getMonth() + 3))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || witnessIds.length === 0) return;
    onAddPromise?.(text, witnessIds, reminderDate);
    setText('');
    setWitnessIds([]);
  };

  const toggleWitness = (id: string) => {
    setWitnessIds((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">The Witness</CardTitle>
        <p className="text-xs text-slate-500">Make a personal promise with batchmates as witnesses.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-indigo-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 shadow-sm">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">A Promise Sealed</h4>
          <p className="mb-6 text-sm text-slate-600">
            Write a declaration and select up to 3 witnesses. You'll all be reminded on the chosen date.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Declaration
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., I promise to stay in touch with everyone..."
                maxLength={200}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Witnesses ({witnessIds.length}/3)
              </label>
              <div className="flex flex-wrap gap-2">
                {users.map((user) => (
                  <button
                    key={user.uid}
                    type="button"
                    onClick={() => toggleWitness(user.uid)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      witnessIds.includes(user.uid)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reminder Date
              </label>
              <input
                type="date"
                value={format(reminderDate, 'yyyy-MM-dd')}
                onChange={(e) => setReminderDate(new Date(e.target.value))}
                min={format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button type="submit" disabled={!text.trim() || witnessIds.length === 0} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-4 w-4" />
              Seal Promise
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock className="h-4 w-4 text-indigo-600" />
            Active Promises ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-slate-100 p-2 text-slate-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Promise with {entry.witnessNames.join(', ')}</p>
                  <p className="text-[10px] text-slate-500">
                    Reminder on {format(entry.reminderDate.toDate(), 'PPP')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

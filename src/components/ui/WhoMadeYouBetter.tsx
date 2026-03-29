import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Heart, Send, User, MessageCircle, Star } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface WhoMadeYouBetterProps {
  onAddBetter?: (targetId: string) => void;
  users: UserProfile[];
  entries: any[];
}

export const WhoMadeYouBetter = ({ onAddBetter, users, entries }: WhoMadeYouBetterProps) => {
  const [targetId, setTargetId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    onAddBetter?.(targetId);
    setTargetId('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Who Made You Better?</CardTitle>
        <p className="text-xs text-slate-500">Anonymously tag up to 3 batchmates who genuinely made you a better person.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-indigo-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 shadow-sm">
              <Star className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Acknowledge Impact</h4>
          <p className="mb-6 text-sm text-slate-600">
            The tagged person receives only a quiet notification. No sender name, no message — just the acknowledgment.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Batchmate
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a batchmate...</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={!targetId || entries.length >= 3} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-4 w-4" />
              Tag Batchmate
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Star className="h-4 w-4 text-indigo-600" />
            Your Impact Tags ({entries.length}/3)
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar src={users.find(u => u.uid === entry.targetId)?.photoUrl} alt="Recipient" size="sm" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Tagged {users.find(u => u.uid === entry.targetId)?.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Impact acknowledged anonymously
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Tagged</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

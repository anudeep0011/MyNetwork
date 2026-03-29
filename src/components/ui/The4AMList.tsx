import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Heart, Send, User, MessageCircle, PhoneCall } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface The4AMListProps {
  onAddNomination?: (targetId: string) => void;
  users: UserProfile[];
  entries: any[];
}

export const The4AMList = ({ onAddNomination, users, entries }: The4AMListProps) => {
  const [targetId, setTargetId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    onAddNomination?.(targetId);
    setTargetId('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">The 4AM List</CardTitle>
        <p className="text-xs text-slate-500">Anonymously nominate a batchmate as your '4AM person'.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-indigo-900 p-6 text-center shadow-inner text-white">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/10 p-4 text-white shadow-sm">
              <PhoneCall className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold">The One You'd Call</h4>
          <p className="mb-6 text-sm text-slate-400">
            Nominate the person you would call at 4 in the morning. They will receive a quiet notification.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Batchmate
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="">Select a batchmate...</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={!targetId || entries.length >= 1} className="gap-2 bg-white text-indigo-900 hover:bg-slate-100">
              <Send className="h-4 w-4" />
              Nominate Person
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <PhoneCall className="h-4 w-4 text-indigo-900" />
            Your 4AM Nomination ({entries.length}/1)
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar src={users.find(u => u.uid === entry.targetId)?.photoUrl} alt="Recipient" size="sm" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Nominated {users.find(u => u.uid === entry.targetId)?.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Nomination acknowledged anonymously
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Nominated</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

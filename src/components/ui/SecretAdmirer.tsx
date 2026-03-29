import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Heart, Send, User, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface SecretAdmirerProps {
  onAddAdmirer?: (targetId: string, text: string) => void;
  users: UserProfile[];
  entries: any[];
  matches?: any[];
}

export const SecretAdmirer = ({ onAddAdmirer, users, entries, matches = [] }: SecretAdmirerProps) => {
  const [text, setText] = React.useState('');
  const [targetId, setTargetId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    onAddAdmirer?.(targetId, text);
    setText('');
    setTargetId('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Secret Admirer Reveal</CardTitle>
        <p className="text-xs text-slate-500">Send an anonymous admirer message to a batchmate.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {matches.length > 0 && (
          <div className="mb-4 space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-bold text-pink-600">
              <Sparkles className="h-4 w-4" />
              Mutual Matches! ({matches.length})
            </h4>
            {matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={users.find(u => u.uid === match.senderId)?.photoUrl} alt="Match" size="sm" className="border-2 border-white" />
                  <div>
                    <p className="text-xs font-bold">It's a Match! {users.find(u => u.uid === match.senderId)?.name}</p>
                    <p className="text-[10px] opacity-90">"{match.text}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="rounded-2xl bg-pink-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-pink-100 p-4 text-pink-600 shadow-sm">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Send Some Love</h4>
          <p className="mb-6 text-sm text-slate-600">
            Messages are locked until farewell day. Only mutual reveals are shown.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Batchmate
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select a batchmate...</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Message (Optional)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., You've been a great friend..."
                maxLength={80}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <Button type="submit" disabled={!targetId} className="gap-2 bg-pink-600 hover:bg-pink-700">
              <Send className="h-4 w-4" />
              Send Admirer Note
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Heart className="h-4 w-4 text-pink-600" />
            Sent Admirer Notes ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-slate-100 p-2 text-slate-400">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Admirer Note for {users.find(u => u.uid === entry.targetId)?.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Locked until Farewell Day
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

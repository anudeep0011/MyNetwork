import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Send, User } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface BatchPredictionsProps {
  onAddPrediction?: (targetId: string, text: string) => void;
  users: UserProfile[];
  entries: any[];
}

export const BatchPredictions = ({ onAddPrediction, users, entries }: BatchPredictionsProps) => {
  const [text, setText] = React.useState('');
  const [targetId, setTargetId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !targetId) return;
    onAddPrediction?.(targetId, text);
    setText('');
    setTargetId('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Batch Predictions</CardTitle>
        <p className="text-xs text-slate-500">Write anonymous predictions about your batchmates.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-purple-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-purple-100 p-4 text-purple-600 shadow-sm">
              <Lock className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Anonymous Predictions</h4>
          <p className="mb-6 text-sm text-slate-600">
            Predictions are sealed for exactly 1 year. They will be revealed to their subjects
            simultaneously.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Batchmate
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                Prediction
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Will be a CEO before 30..."
                maxLength={120}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button type="submit" disabled={!text.trim() || !targetId} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
              Seal Prediction
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock className="h-4 w-4 text-purple-600" />
            Sealed Predictions ({entries.length})
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
                  <p className="text-xs font-bold text-slate-900">Prediction for {users.find(u => u.uid === entry.targetId)?.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Unlocks in 1 year
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

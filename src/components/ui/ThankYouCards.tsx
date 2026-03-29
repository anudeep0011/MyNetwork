import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Heart, Send, User, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface ThankYouCardsProps {
  onSendCard?: (targetId: string, text: string) => void;
  users: UserProfile[];
  entries: any[];
}

export const ThankYouCards = ({ onSendCard, users, entries }: ThankYouCardsProps) => {
  const [text, setText] = React.useState('');
  const [targetId, setTargetId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !text.trim()) return;
    onSendCard?.(targetId, text);
    setText('');
    setTargetId('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Thank You Cards</CardTitle>
        <p className="text-xs text-slate-500">Send a personal, heartfelt thank-you card to a batchmate.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-teal-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-teal-100 p-4 text-teal-600 shadow-sm">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Express Gratitude</h4>
          <p className="mb-6 text-sm text-slate-600">
            Send a private card to someone who made your college years special.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recipient
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                Message
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your thank you message..."
                maxLength={300}
                className="h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <Button type="submit" disabled={!targetId || !text.trim()} className="gap-2 bg-teal-600 hover:bg-teal-700">
              <Send className="h-4 w-4" />
              Send Thank You Card
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <MessageCircle className="h-4 w-4 text-teal-600" />
            Sent Cards ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar src={users.find(u => u.uid === entry.targetId)?.photoUrl} alt="Recipient" size="sm" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Card for {users.find(u => u.uid === entry.targetId)?.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Delivered privately
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Sent</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Send, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';
import { UserProfile } from '../../types';

interface UnsentMessageProps {
  onAddMessage?: (recipientName: string, text: string) => void;
  onDeleteMessage?: (id: string) => void;
  entries: any[];
  users: UserProfile[];
}

export const UnsentMessage = ({ onAddMessage, onDeleteMessage, entries, users }: UnsentMessageProps) => {
  const [text, setText] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddMessage?.(recipientName, text);
    setText('');
    setRecipientName('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">The Unsent Message</CardTitle>
        <p className="text-xs text-slate-500">A private, sealed space for things you never said.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-slate-900 p-6 text-center shadow-inner text-white">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/10 p-4 text-white shadow-sm">
              <Lock className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold">Sealed & Private</h4>
          <p className="mb-6 text-sm text-slate-400">
            This message is never sent, never shared, never seen by anyone else.
            It's a personal act of closure.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recipient Name (Optional)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Someone special"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Message
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your unsent message..."
                maxLength={500}
                className="h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <Button type="submit" disabled={!text.trim()} className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
              <Send className="h-4 w-4" />
              Seal & Keep Private
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Lock className="h-4 w-4 text-slate-900" />
            Your Unsent Messages ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900">To: {entry.recipientName || 'Someone'}</h5>
                <button
                  onClick={() => onDeleteMessage?.(entry.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-slate-600 italic">"{entry.text}"</p>
              <p className="text-[10px] text-slate-400">
                Sealed {entry.postedAt?.toDate ? formatDistanceToNow(entry.postedAt.toDate(), { addSuffix: true }) : 'Just now'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

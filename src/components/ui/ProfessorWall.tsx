import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Heart, Send, User, MessageCircle, GraduationCap } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface ProfessorWallProps {
  onAddShoutout?: (profName: string, dept: string, text: string, anonymous: boolean) => void;
  entries: any[];
}

export const ProfessorWall = ({ onAddShoutout, entries }: ProfessorWallProps) => {
  const [text, setText] = React.useState('');
  const [profName, setProfName] = React.useState('');
  const [dept, setDept] = React.useState('');
  const [anonymous, setAnonymous] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !text.trim()) return;
    onAddShoutout?.(profName, dept, text, anonymous);
    setText('');
    setProfName('');
    setDept('');
    setAnonymous(false);
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Professor Wall</CardTitle>
        <p className="text-xs text-slate-500">Send appreciation shoutouts to your professors.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-amber-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-amber-100 p-4 text-amber-600 shadow-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Appreciate Your Mentors</h4>
          <p className="mb-6 text-sm text-slate-600">
            Shoutouts are grouped by professor name. They don't need the app to be appreciated!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Professor Name
                </label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  placeholder="e.g., Prof. Sharma"
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Department
                </label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="e.g., CSE"
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Shoutout Message
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your appreciation message..."
                maxLength={200}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous-shoutout"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="anonymous-shoutout" className="text-sm text-slate-600">
                Send anonymously
              </label>
            </div>
            <Button type="submit" disabled={!profName || !text.trim()} className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Send className="h-4 w-4" />
              Send Shoutout
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <MessageCircle className="h-4 w-4 text-amber-600" />
            Recent Shoutouts ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-slate-900">{entry.profName}</h5>
                <Badge variant="secondary">{entry.dept}</Badge>
              </div>
              <p className="text-sm text-slate-600 italic">"{entry.text}"</p>
              <p className="text-[10px] text-slate-400">
                — {entry.anonymous ? 'Anonymous' : entry.senderName}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

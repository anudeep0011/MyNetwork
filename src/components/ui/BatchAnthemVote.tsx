import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Music, Send, User, MessageCircle, ArrowBigUp } from 'lucide-react';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';

interface AnthemNomination {
  id: string;
  songTitle: string;
  artistName: string;
  votes: number;
  postedAt: any;
}

interface BatchAnthemVoteProps {
  onNominate?: (songTitle: string, artistName: string) => void;
  onVote?: (id: string) => void;
  entries: AnthemNomination[];
}

export const BatchAnthemVote = ({ onNominate, onVote, entries }: BatchAnthemVoteProps) => {
  const [songTitle, setSongTitle] = React.useState('');
  const [artistName, setArtistName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !artistName.trim()) return;
    onNominate?.(songTitle, artistName);
    setSongTitle('');
    setArtistName('');
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Batch Anthem Vote</CardTitle>
        <p className="text-xs text-slate-500">Nominate and vote for the song that represents your 4 college years.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-indigo-50 p-6 text-center shadow-inner">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 shadow-sm">
              <Music className="h-8 w-8" />
            </div>
          </div>
          <h4 className="mb-2 text-lg font-bold text-slate-900">Nominate Your Anthem</h4>
          <p className="mb-6 text-sm text-slate-600">
            The song with the most votes will become the official Batch Anthem.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Song Title
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="e.g., Memories"
                  maxLength={60}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="e.g., Maroon 5"
                  maxLength={60}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <Button type="submit" disabled={!songTitle.trim() || !artistName.trim()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-4 w-4" />
              Nominate Song
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Music className="h-4 w-4 text-indigo-600" />
            Anthem Nominations ({entries.length})
          </h4>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{entry.songTitle}</p>
                <p className="text-xs text-slate-500">{entry.artistName}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => onVote?.(entry.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <ArrowBigUp className="h-6 w-6" />
                </button>
                <span className="text-xs font-bold text-slate-900">{entry.votes}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

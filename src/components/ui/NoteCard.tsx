import React from 'react';
import { FarewellNote } from '../../types';
import { Avatar } from './Avatar';
import { Card, CardContent } from './Card';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

interface NoteCardProps {
  note: FarewellNote;
  className?: string;
  key?: string | number;
}

export const NoteCard = ({ note, className }: NoteCardProps) => {
  return (
    <Card className={cn("overflow-hidden border-indigo-100 bg-indigo-50/30", className)}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar
            src={note.senderPhotoUrl}
            alt={note.senderName}
            fallback={note.senderName[0]}
            size="sm"
          />
          <div className="flex-1 overflow-hidden">
            <h4 className="truncate text-sm font-bold text-slate-900">{note.senderName}</h4>
            <p className="text-[10px] text-slate-500">
              {note.sentAt?.toDate ? formatDistanceToNow(note.sentAt.toDate(), { addSuffix: true }) : 'Just now'}
            </p>
          </div>
        </div>
        {note.type === 'text' ? (
          <p className="text-sm leading-relaxed text-slate-700">{note.content}</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
            <img
              src={note.content}
              alt="Handwritten note"
              className="h-auto w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

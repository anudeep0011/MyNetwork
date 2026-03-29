import React from 'react';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { Instagram, Linkedin, Phone, MessageCircle, UserPlus } from 'lucide-react';
import { generateVCard } from '../../services/vCardService';

interface ProfileCardProps {
  user: UserProfile;
  isOwn?: boolean;
  onConnect?: () => void;
  onLeaveNote?: () => void;
}

export const ProfileCard = ({ user, isOwn, onConnect, onLeaveNote }: ProfileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
      <CardContent className="relative -mt-12 flex flex-col items-center text-center">
        <Avatar
          src={user.photoUrl}
          alt={user.name}
          fallback={user.name[0]}
          size="xl"
          className="border-4 border-white shadow-xl"
        />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">{user.name}</h2>
        <p className="text-sm font-medium text-indigo-600">{user.branch}</p>
        <p className="text-xs text-slate-500">{user.college} • Class of {user.graduationYear}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {user.instagram && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => window.open(`https://instagram.com/${user.instagram}`, '_blank')}
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Button>
          )}
          {user.linkedin && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => window.open(user.linkedin, '_blank')}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => window.open(`tel:${user.phone}`, '_self')}
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>

        <div className="mt-8 w-full rounded-2xl bg-slate-50 p-6 italic text-slate-600 shadow-inner">
          "{user.farewellQuote}"
        </div>

        {!isOwn && (
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <Button onClick={() => generateVCard(user)} variant="secondary" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Save Contact
            </Button>
            <Button onClick={onLeaveNote} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Leave Note
            </Button>
          </div>
        )}

        <div className="mt-8 flex w-full justify-around border-t border-slate-100 pt-6">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{user.madeBetterCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Made Better</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{user.fourAmCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">4AM List</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

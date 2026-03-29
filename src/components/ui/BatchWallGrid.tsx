import React from 'react';
import { UserProfile } from '../../types';
import { Avatar } from './Avatar';
import { Card, CardContent } from './Card';
import { motion } from 'motion/react';

interface BatchWallGridProps {
  users: UserProfile[];
  onUserClick: (user: UserProfile) => void;
}

export const BatchWallGrid = ({ users, onUserClick }: BatchWallGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
      {users.map((user, index) => (
        <motion.div
          key={user.uid}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onUserClick(user)}
          className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <div className="aspect-square">
            <Avatar
              src={user.photoUrl}
              alt={user.name}
              fallback={user.name[0]}
              size="xl"
              className="h-full w-full rounded-none"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 sm:p-3">
            <p className="truncate text-[10px] font-bold text-white sm:text-xs">{user.name}</p>
            <p className="truncate text-[8px] text-white/70 sm:text-[10px]">{user.branch}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

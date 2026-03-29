import React from 'react';
import { SUPERLATIVE_CATEGORIES } from '../../constants';
import { UserProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { motion } from 'motion/react';

interface SuperlativesVotingProps {
  users: UserProfile[];
  onVote: (categoryId: string, targetId: string) => void;
  entries: { categoryId: string; targetId: string }[];
}

export const SuperlativesVoting = ({ users, onVote, entries }: SuperlativesVotingProps) => {
  const votes = entries.reduce((acc, entry) => ({ ...acc, [entry.categoryId]: entry.targetId }), {} as Record<string, string>);
  const [selectedCategory, setSelectedCategory] = React.useState(SUPERLATIVE_CATEGORIES[0].id);

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Batch Superlatives</CardTitle>
        <p className="text-xs text-slate-500">Vote for your batchmates in various categories.</p>
      </CardHeader>
      <div className="flex border-b border-slate-100 bg-white p-2 overflow-x-auto gap-2 scrollbar-hide">
        {SUPERLATIVE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {category.label}
            {votes[category.id] && ' ✓'}
          </button>
        ))}
      </div>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {users.map((user) => (
            <motion.div
              key={user.uid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onVote(selectedCategory, user.uid)}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                votes[selectedCategory] === user.uid
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <Avatar src={user.photoUrl} alt={user.name} fallback={user.name[0]} size="lg" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.branch}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

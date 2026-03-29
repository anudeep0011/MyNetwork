import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, User, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';

interface GoodbyeRitualProps {
  onComplete?: (word: string, message: string) => void;
  wordCloud?: Record<string, number>;
  messages?: any[];
}

export const GoodbyeRitual = ({ onComplete, wordCloud = {}, messages = [] }: GoodbyeRitualProps) => {
  const [step, setStep] = React.useState(1);
  const [word, setWord] = React.useState('');
  const [message, setMessage] = React.useState('');

  const nextStep = () => {
    if (step === 1 && !word.trim()) return;
    if (step === 2) {
      onComplete?.(word, message);
    }
    setStep(step + 1);
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">Goodbye Ritual</CardTitle>
        <p className="text-xs text-slate-500">A guided 3-step closing experience for your batch.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div className="mb-6 rounded-full bg-indigo-100 p-6 text-indigo-600 shadow-sm">
                <Sparkles className="h-12 w-12" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Step 1: The One Word</h3>
              <p className="mb-8 text-slate-600">Rate your 4 years with exactly one word.</p>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g., Unforgettable"
                maxLength={20}
                className="mb-8 w-full max-w-xs rounded-xl border-2 border-indigo-100 bg-white px-6 py-4 text-center text-xl font-bold text-indigo-600 focus:border-indigo-500 focus:outline-none"
              />
              <Button onClick={nextStep} disabled={!word.trim()} size="lg" className="w-full max-w-xs">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div className="mb-6 rounded-full bg-purple-100 p-6 text-purple-600 shadow-sm">
                <MessageCircle className="h-12 w-12" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Step 2: Final Message</h3>
              <p className="mb-8 text-slate-600">Write your last message to the entire batch.</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your final message..."
                maxLength={200}
                className="mb-8 h-32 w-full max-w-md rounded-xl border-2 border-purple-100 bg-white px-6 py-4 text-slate-700 focus:border-purple-500 focus:outline-none"
              />
              <Button onClick={nextStep} size="lg" className="w-full max-w-md bg-purple-600 hover:bg-purple-700">
                Complete Ritual
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-1 flex-col"
            >
              <h3 className="mb-6 text-center text-xl font-bold text-slate-900">The Batch Word Cloud</h3>
              <div className="flex flex-1 flex-wrap items-center justify-center gap-4 rounded-2xl bg-slate-50 p-8 shadow-inner">
                {Object.entries(wordCloud).map(([w, count]) => (
                  <span
                    key={w}
                    className="font-bold text-indigo-600 transition-all hover:scale-110"
                    style={{ fontSize: `${Math.min(12 + count * 4, 48)}px`, opacity: 0.5 + (count / 10) }}
                  >
                    {w}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-4 overflow-y-auto max-h-48">
                <h4 className="text-sm font-bold text-slate-900">Batch Farewell Messages</h4>
                {messages.map((m, i) => (
                  <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-700">"{m.message}"</p>
                    <p className="mt-1 text-[10px] text-slate-400">— {m.senderName}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { MapPin, Plus, User, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';

interface Pin {
  id: string;
  userId: string;
  userName: string;
  x: number;
  y: number;
  note?: string;
}

interface TheLastDayMapProps {
  onAddPin?: (x: number, y: number, note: string) => void;
  entries: Pin[];
  mapUrl?: string;
}

export const TheLastDayMap = ({ onAddPin, entries, mapUrl = 'https://picsum.photos/seed/campus/1200/800' }: TheLastDayMapProps) => {
  const [note, setNote] = React.useState('');
  const [tempPin, setTempPin] = React.useState<{ x: number; y: number } | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempPin({ x, y });
  };

  const handleSubmit = () => {
    if (!tempPin) return;
    onAddPin?.(tempPin.x, tempPin.y, note);
    setTempPin(null);
    setNote('');
  };

  return (
    <Card className="flex h-[700px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg">The Last Day Map</CardTitle>
        <p className="text-xs text-slate-500">Drop pins on your favorite campus spots.</p>
      </CardHeader>
      <CardContent className="relative flex-1 overflow-hidden p-0">
        <div
          className="relative h-full w-full cursor-crosshair overflow-hidden bg-slate-200"
          onClick={handleMapClick}
        >
          <img
            src={mapUrl}
            alt="Campus Map"
            className="h-full w-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          {entries.map((pin) => (
            <motion.div
              key={pin.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <div className="group relative">
                <MapPin className="h-6 w-6 text-indigo-600 drop-shadow-md" />
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 scale-0 rounded-lg bg-white p-2 text-xs font-bold text-slate-900 shadow-xl transition-all group-hover:block group-hover:scale-100">
                  <p className="whitespace-nowrap">{pin.userName}</p>
                  {pin.note && <p className="mt-1 font-normal text-slate-500 italic">"{pin.note}"</p>}
                </div>
              </div>
            </motion.div>
          ))}
          {tempPin && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${tempPin.x}%`, top: `${tempPin.y}%` }}
            >
              <MapPin className="h-8 w-8 animate-bounce text-indigo-500 drop-shadow-lg" />
            </motion.div>
          )}
        </div>

        {tempPin && (
          <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
            <h4 className="mb-2 text-sm font-bold text-slate-900 text-center">Add a Note to this Spot</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Where we first met..."
                maxLength={200}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button size="sm" onClick={handleSubmit}>
                Drop Pin
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTempPin(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { PhotoWallEntry } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { Upload, Camera } from 'lucide-react';
import { Button } from './Button';

interface PhotoWallProps {
  entries: PhotoWallEntry[];
  onAddPhoto?: (url: string, caption: string) => void;
}

export const PhotoWall = ({ entries, onAddPhoto }: PhotoWallProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we'd upload to Firebase Storage here.
      // For now, we'll use a placeholder URL.
      const url = URL.createObjectURL(file);
      onAddPhoto?.(url, file.name);
    }
  };

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Batch Photo Wall</CardTitle>
            <p className="text-xs text-slate-500">Share your favorite moments from the day.</p>
          </div>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 rounded-full"
          >
            <Camera className="h-4 w-4" />
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {entries.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <img
                src={photo.photoUrl}
                alt={`Uploaded by ${photo.uploaderName}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 sm:p-3">
                <p className="truncate text-[10px] font-bold text-white sm:text-xs">
                  {photo.uploaderName}
                </p>
                <p className="truncate text-[8px] text-white/70 sm:text-[10px]">
                  {photo.uploadedAt?.toDate ? formatDistanceToNow(photo.uploadedAt.toDate(), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

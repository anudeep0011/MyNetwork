import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, CameraOff } from 'lucide-react';
import { Button } from './Button';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleResult = (result: any, error: any) => {
    if (result) {
      onScan(result.text);
    }
    if (error) {
      // console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex items-center justify-between p-4 text-white">
        <h3 className="text-lg font-semibold">Scan QR Code</h3>
        <button onClick={onClose} className="rounded-full bg-white/10 p-2 hover:bg-white/20">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative h-64 w-64 overflow-hidden rounded-3xl border-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <QrReader
            onResult={handleResult}
            constraints={{ facingMode: 'environment' }}
            className="h-full w-full object-cover"
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute inset-0 z-10">
            <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-indigo-500" />
            <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-indigo-500" />
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-indigo-500" />
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-indigo-500" />
            <motion.div
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="p-8 text-center text-white/70">
        <p className="text-sm">Align the QR code within the frame to scan</p>
      </div>
    </div>
  );
};

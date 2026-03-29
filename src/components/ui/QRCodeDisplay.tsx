import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { Download, Share2 } from 'lucide-react';
import { Button } from './Button';

interface QRCodeDisplayProps {
  value: string;
  name: string;
  className?: string;
}

export const QRCodeDisplay = ({ value, name, className }: QRCodeDisplayProps) => {
  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${name.replace(/\s+/g, '_')}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s BatchSnap Profile`,
          text: `Connect with me on BatchSnap!`,
          url: window.location.origin + '/profile/' + value,
        });
      } catch (error) {
        // console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200"
      >
        <QRCodeSVG
          id="qr-code-svg"
          value={value}
          size={200}
          level="H"
          includeMargin={true}
          className="h-full w-full"
        />
      </motion.div>
      <div className="flex gap-4">
        <Button variant="outline" size="sm" onClick={downloadQR} className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={shareQR} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

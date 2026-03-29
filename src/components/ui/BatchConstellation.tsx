import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion } from 'motion/react';
import { Share2, Download, Star } from 'lucide-react';
import { Button } from './Button';
import { UserProfile, Connection } from '../../types';

interface BatchConstellationProps {
  users: UserProfile[];
  connections: Connection[];
}

export const BatchConstellation = ({ users, connections }: BatchConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || users.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Draw stars (users)
    const nodes = users.map((user) => ({
      id: user.uid,
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      name: user.name,
      connections: connections.filter(c => c.scannedUserId === user.uid).length
    }));

    // Draw connections
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)'; // indigo-500 with opacity
    ctx.lineWidth = 1;
    connections.forEach((conn) => {
      const source = nodes.find(n => n.id === conn.id.split('_')[0]); // Assuming id is senderId_receiverId
      const target = nodes.find(n => n.id === conn.scannedUserId);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const radius = 2 + (node.connections * 0.5);
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1'; // indigo-500
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#6366f1';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw name for highly connected nodes
      if (node.connections > 5) {
        ctx.fillStyle = 'white';
        ctx.font = '8px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + radius + 10);
      }
    });
  }, [users, connections]);

  const downloadConstellation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'Batch_Constellation.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Card className="overflow-hidden bg-slate-900 text-white">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Batch Constellation</CardTitle>
            <p className="text-xs text-slate-400">The unique pattern of your batch's connections.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={downloadConstellation} className="text-white hover:bg-white/10">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative p-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="h-auto w-full cursor-crosshair"
        />
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Stats</p>
          <p className="text-xs font-bold text-white">{users.length} Stars</p>
          <p className="text-xs font-bold text-white">{connections.length} Connections</p>
        </div>
      </CardContent>
    </Card>
  );
};

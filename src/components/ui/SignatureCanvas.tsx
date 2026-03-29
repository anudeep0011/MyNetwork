import React, { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from './Button';
import { Eraser, RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const SignatureCanvas = ({ onSave, onCancel }: SignatureCanvasProps) => {
  const sigPad = useRef<SignaturePad>(null);

  const clear = () => {
    sigPad.current?.clear();
  };

  const save = () => {
    if (sigPad.current?.isEmpty()) return;
    const dataUrl = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');
    if (dataUrl) onSave(dataUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-white">
        <SignaturePad
          ref={sigPad}
          canvasProps={{
            className: 'w-full h-48 cursor-crosshair',
            width: 400,
            height: 200,
          }}
          backgroundColor="white"
          penColor="black"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clear} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={save}>
            Save Drawing
          </Button>
        </div>
      </div>
    </div>
  );
};

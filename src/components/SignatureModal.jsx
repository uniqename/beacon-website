import React, { useRef, useState, useEffect } from 'react';

const PRESET_SIGNATURES = [
  { label: 'Black', src: '/signatures/sig_black.png' },
  { label: 'Dark Gray', src: '/signatures/sig_dark_gray.png' },
  { label: 'Navy Blue', src: '/signatures/sig_navy_blue.png' },
  { label: 'Transparent', src: '/signatures/sig_transparent.png' },
];

const SignatureModal = ({ onClose, onInsert }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigDataUrl, setSigDataUrl] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [mode, setMode] = useState('preset'); // 'preset' | 'draw'

  useEffect(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    }
  }, [mode]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSigDataUrl(canvasRef.current.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSigDataUrl(null);
  };

  const effectiveSig = mode === 'preset' ? selectedPreset : sigDataUrl;

  const buildHTMLPage = (imgSrc) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Signed Document</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
  .signature-block { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 16px; }
  .signature-block img { max-height: 80px; }
  .signature-label { font-size: 12px; color: #666; margin-top: 4px; }
  @media print { button { display: none; } }
</style>
</head>
<body>
<div contenteditable="true" style="min-height:300px; outline:none;">
  <p>Document content goes here...</p>
</div>
<div class="signature-block">
  <img src="${imgSrc}" alt="Signature"/>
  <div class="signature-label">Signature — Enam Egyir</div>
</div>
<button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#ea580c;color:#fff;border:none;border-radius:24px;cursor:pointer;font-size:14px;">Print / Save PDF</button>
</body>
</html>`;

  const handleInsert = () => {
    if (!effectiveSig) return;
    if (onInsert) {
      onInsert(effectiveSig);
    } else {
      const html = buildHTMLPage(effectiveSig);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">
        <div className="bg-gray-900 px-6 py-5 rounded-t-2xl text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none">&times;</button>
          <h2 className="text-xl font-serif font-bold">Signature Generator</h2>
          <p className="text-gray-400 text-sm mt-1">Choose a preset or draw your signature</p>
        </div>

        <div className="p-6">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button
              onClick={() => setMode('preset')}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${mode === 'preset' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              My Signatures
            </button>
            <button
              onClick={() => setMode('draw')}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${mode === 'draw' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Draw
            </button>
          </div>

          {mode === 'preset' ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PRESET_SIGNATURES.map((sig) => (
                <button
                  key={sig.label}
                  onClick={() => setSelectedPreset(sig.src)}
                  className={`border-2 rounded-xl p-3 transition-all ${selectedPreset === sig.src ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={sig.src} alt={sig.label} className="h-12 w-full object-contain" />
                  <p className="text-xs text-gray-500 mt-2">{sig.label}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <canvas
                ref={canvasRef}
                width={440}
                height={160}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl cursor-crosshair bg-white touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <button onClick={clearCanvas} className="mt-2 text-sm text-gray-500 hover:text-red-500 underline">
                Clear
              </button>
            </div>
          )}

          {effectiveSig && (
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Preview</p>
              <img src={effectiveSig} alt="preview" className="max-h-16 object-contain" />
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:border-gray-400 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!effectiveSig}
              className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-40"
            >
              Use Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;

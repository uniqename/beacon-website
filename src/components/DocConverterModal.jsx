import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href;

// ── Beacon letterhead config ──────────────────────────────────────────────────
const LH = {
  org: 'BEACON OF NEW BEGINNINGS',
  tagline: 'Supporting Survivors in Ghana',
  contact: 'info@beaconnewbeginnings.org  ·  beaconnewbeginnings.org',
  primaryColor: '#1e3a5f',
  accentColor: '#f97316',
  bg: '#fff7ed',
  lineColor: '#f97316',
};

const INK = [
  { id: 'black', label: 'Black', color: '#1a1a1a' },
  { id: 'blue',  label: 'Blue',  color: '#1e3a5f' },
  { id: 'gray',  label: 'Gray',  color: '#4b5563' },
];

const LH_HEADER_H = 72;

function loadImg(src) {
  return new Promise((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src;
  });
}

async function composeCanvas(pageDataUrl, withLetterhead) {
  const page = await loadImg(pageDataUrl);
  const W = page.naturalWidth || 794;
  const H = page.naturalHeight || 1123;
  const totalH = withLetterhead ? H + LH_HEADER_H : H;
  const c = document.createElement('canvas');
  c.width = W; c.height = totalH;
  const ctx = c.getContext('2d');

  if (withLetterhead) {
    ctx.fillStyle = LH.bg;
    ctx.fillRect(0, 0, W, LH_HEADER_H);
    ctx.fillStyle = LH.lineColor;
    ctx.fillRect(0, LH_HEADER_H - 2, W, 2);
    ctx.font = 'bold 13px Georgia, serif';
    ctx.fillStyle = LH.primaryColor;
    ctx.fillText(LH.org, 28, 26);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = LH.accentColor;
    ctx.fillText(LH.tagline.toUpperCase(), 28, 42);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(LH.contact, 28, 58);
    ctx.drawImage(page, 0, LH_HEADER_H);
  } else {
    ctx.drawImage(page, 0, 0);
  }
  return c;
}

const DocConverterModal = ({ onClose }) => {
  // Doc state
  const [docFile, setDocFile]             = useState(null);
  const [docType, setDocType]             = useState(null); // 'pdf' | 'word' | 'image'
  const [docPages, setDocPages]           = useState([]);
  const [currentPage, setCurrentPage]     = useState(0);
  const [docLoading, setDocLoading]       = useState(false);
  const [wordHtml, setWordHtml]           = useState(null);

  // UI state
  const [letterhead, setLetterhead]   = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [showSigPad, setShowSigPad]   = useState(false);
  const [inkColor, setInkColor]       = useState(INK[0].color);
  const [isDrawing, setIsDrawing]     = useState(false);
  const [sigDataUrl, setSigDataUrl]   = useState(null);

  // Signature placement
  const [sigBounds, setSigBounds]     = useState(null);
  const [placingMode, setPlacingMode] = useState(false);
  const [dragging, setDragging]       = useState(false);
  const [resizing, setResizing]       = useState(false);
  const dragOffset  = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Refs
  const fileInputRef = useRef(null);
  const docViewerRef = useRef(null);
  const wordViewRef  = useRef(null);
  const sigCanvasRef = useRef(null);

  // Notification
  const [notif, setNotif] = useState(null);
  const showNotif = (msg, ok = true) => {
    setNotif({ msg, ok });
    setTimeout(() => setNotif(null), 3000);
  };

  // Sync wordHtml into DOM
  useEffect(() => {
    if (wordViewRef.current && wordHtml !== null) {
      wordViewRef.current.innerHTML = wordHtml;
    }
  }, [wordHtml]);

  // Init sig canvas
  useEffect(() => {
    if (showSigPad && sigCanvasRef.current) {
      const ctx = sigCanvasRef.current.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
  }, [showSigPad]);

  useEffect(() => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.getContext('2d').strokeStyle = inkColor;
    }
  }, [inkColor]);

  // File handling
  const handleFileUpload = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    setDocFile(file);
    setDocPages([]); setWordHtml(null);
    setSigBounds(null); setPlacingMode(false); setEditMode(false); setLetterhead(false);

    if (ext === 'pdf') {
      setDocType('pdf'); setDocLoading(true);
      try {
        const ab = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale: 1.5 });
          const c = document.createElement('canvas');
          c.width = vp.width; c.height = vp.height;
          await pg.render({ canvas: c, viewport: vp }).promise;
          pages.push({ dataUrl: c.toDataURL(), width: vp.width, height: vp.height });
        }
        setDocPages(pages); setCurrentPage(0);
      } catch { showNotif('Could not load PDF', false); }
      setDocLoading(false);

    } else if (ext === 'docx' || ext === 'doc') {
      setDocType('word'); setDocLoading(true);
      try {
        const ab = await file.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer: ab });
        setWordHtml(value);
      } catch { showNotif('Could not load Word document', false); }
      setDocLoading(false);

    } else if (/^(png|jpe?g|webp|gif)$/.test(ext)) {
      setDocType('image'); setDocLoading(true);
      try {
        const dataUrl = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target.result);
          reader.readAsDataURL(file);
        });
        setDocPages([{ dataUrl, width: 0, height: 0 }]);
      } catch { showNotif('Could not load image', false); }
      setDocLoading(false);

    } else {
      showNotif('Unsupported file type. Use PDF, DOCX, or image.', false);
      setDocFile(null);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // Signature canvas drawing
  const getCanvasPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    return {
      x: ((touch ? touch.clientX : e.clientX) - rect.left) * (canvas.width / rect.width),
      y: ((touch ? touch.clientY : e.clientY) - rect.top)  * (canvas.height / rect.height),
    };
  };

  const startSigDraw = (e) => {
    const canvas = sigCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = inkColor; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pos = getCanvasPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const drawSig = (e) => {
    if (!isDrawing || !sigCanvasRef.current) return;
    e.preventDefault();
    const ctx = sigCanvasRef.current.getContext('2d');
    const pos = getCanvasPos(e, sigCanvasRef.current);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
  };

  const endSigDraw = () => {
    if (!isDrawing || !sigCanvasRef.current) return;
    setIsDrawing(false);
    setSigDataUrl(sigCanvasRef.current.toDataURL());
  };

  const clearSig = () => {
    if (!sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    setSigDataUrl(null);
  };

  // Signature placement
  const getViewerPos = (e) => {
    const el = docViewerRef.current;
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left + el.scrollLeft, y: e.clientY - rect.top + el.scrollTop };
  };

  const handleDocClick = (e) => {
    if (!placingMode || !sigDataUrl) return;
    const pos = getViewerPos(e);
    setSigBounds({ x: pos.x - 90, y: pos.y - 30, w: 180, h: 60 });
    setPlacingMode(false);
  };

  const handleSigMouseDown = (e) => {
    e.stopPropagation();
    if (!sigBounds) return;
    dragOffset.current = { x: e.clientX - sigBounds.x, y: e.clientY - sigBounds.y };
    setDragging(true);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    if (!sigBounds) return;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: sigBounds.w, h: sigBounds.h };
    setResizing(true);
  };

  const handleViewerMouseMove = (e) => {
    if (dragging && sigBounds) {
      setSigBounds(b => b ? { ...b, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y } : b);
    }
    if (resizing && sigBounds) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      setSigBounds(b => b ? { ...b, w: Math.max(60, resizeStart.current.w + dx), h: Math.max(20, resizeStart.current.h + dy) } : b);
    }
  };

  const handleViewerMouseUp = () => { setDragging(false); setResizing(false); };

  // Export / Print / Send
  const exportSigned = async () => {
    if (!docFile) return;
    try {
      if (docType === 'word') {
        const content = wordViewRef.current?.innerHTML ?? wordHtml ?? '';
        const lhHeader = letterhead
          ? `<div style="background:${LH.bg};border-bottom:2px solid ${LH.lineColor};padding:12px 28px;">
               <div style="font-family:Georgia,serif;font-weight:700;font-size:14px;color:${LH.primaryColor};letter-spacing:3px;">${LH.org}</div>
               <div style="font-size:9px;color:${LH.accentColor};font-weight:700;letter-spacing:2px;margin-top:3px;">${LH.tagline.toUpperCase()}</div>
             </div>` : '';
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
          body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;}
          @media print{.no-print{display:none}}
        </style></head><body>${lhHeader}<div contenteditable="true" style="outline:none;">${content}</div>
        <div class="no-print" style="margin-top:24px;">
          <button onclick="window.print()" style="padding:10px 24px;background:#f97316;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;">Print / Save PDF</button>
        </div></body></html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const a = document.createElement('a');
        a.download = `${docFile.name.replace(/\.[^.]+$/, '')}_edited.html`;
        a.href = URL.createObjectURL(blob);
        a.click();
        showNotif('Downloaded — open in browser then print/save as PDF');
        return;
      }

      const pageDataUrl = docPages[currentPage]?.dataUrl;
      if (!pageDataUrl) return;
      const composed = await composeCanvas(pageDataUrl, letterhead);

      if (sigBounds && sigDataUrl) {
        const ctx = composed.getContext('2d');
        const sig = await loadImg(sigDataUrl);
        ctx.drawImage(sig, sigBounds.x, sigBounds.y, sigBounds.w, sigBounds.h);
      }

      const pdfDoc = await PDFDocument.create();
      const imgBytes = await fetch(composed.toDataURL('image/png')).then(r => r.arrayBuffer());
      const pngImg = await pdfDoc.embedPng(imgBytes);
      const { width: iw, height: ih } = pngImg.scale(1);
      const pg = pdfDoc.addPage([iw, ih]);
      pg.drawImage(pngImg, { x: 0, y: 0, width: iw, height: ih });
      const pdfBytes = await pdfDoc.save();
      const a = document.createElement('a');
      a.download = `${docFile.name.replace(/\.[^.]+$/, '')}_signed.pdf`;
      a.href = URL.createObjectURL(new Blob([new Uint8Array(pdfBytes)]));
      a.click();
      showNotif('Saved as PDF!');
    } catch (err) {
      console.error(err);
      showNotif('Export failed', false);
    }
  };

  const printDoc = async () => {
    if (!docFile) return;
    if (docType === 'word') {
      const content = wordViewRef.current?.innerHTML ?? wordHtml ?? '';
      const lhHeader = letterhead
        ? `<div style="background:${LH.bg};border-bottom:2px solid ${LH.lineColor};padding:12px 28px;">
             <div style="font-family:Georgia,serif;font-weight:700;font-size:14px;color:${LH.primaryColor};letter-spacing:3px;">${LH.org}</div>
             <div style="font-size:9px;color:${LH.accentColor};font-weight:700;letter-spacing:2px;margin-top:3px;">${LH.tagline.toUpperCase()}</div>
           </div>` : '';
      const win = window.open('', '_blank');
      win?.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;}
      </style></head><body>${lhHeader}<div>${content}</div></body></html>`);
      win?.document.close();
      setTimeout(() => win?.print(), 400);
      return;
    }
    const pageDataUrl = docPages[currentPage]?.dataUrl;
    if (!pageDataUrl) return;
    const composed = await composeCanvas(pageDataUrl, letterhead);
    if (sigBounds && sigDataUrl) {
      const ctx = composed.getContext('2d');
      const sig = await loadImg(sigDataUrl);
      ctx.drawImage(sig, sigBounds.x, sigBounds.y, sigBounds.w, sigBounds.h);
    }
    const win = window.open('', '_blank');
    win?.document.write(`<!DOCTYPE html><html><head><style>body{margin:0;}img{max-width:100%;}</style></head>
      <body><img src="${composed.toDataURL('image/png')}"/></body></html>`);
    win?.document.close();
    setTimeout(() => win?.print(), 400);
  };

  const sendDoc = () => {
    const name = docFile?.name ?? 'document';
    const sub  = encodeURIComponent(`Document: ${name}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find my document attached: ${name}.\n\n(Save it first using the Save button, then attach the file to this email.)`
    );
    window.open(`mailto:info@beaconnewbeginnings.org?subject=${sub}&body=${body}`, '_blank');
  };

  const totalPages = docPages.length;
  const hasDoc = !!docFile && !docLoading && (docPages.length > 0 || wordHtml !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[94vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0"
          style={{ background: '#1e3a5f' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Document Converter</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Upload · Add letterhead · Sign · Edit · Save or Print</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            ✕
          </button>
        </div>

        {/* Notification */}
        {notif && (
          <div className={`mx-6 mt-3 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0 ${
            notif.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {notif.ok ? '✓' : '✕'} {notif.msg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Upload zone */}
          {!docFile && (
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl py-14 px-8 cursor-pointer text-center transition-all hover:border-orange-400 hover:bg-orange-50/40"
            >
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-700 font-semibold mb-3">Drop your document here or click to browse</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {['PDF', 'Word (.docx)', 'PNG / JPG'].map(l => (
                  <span key={l} className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">{l}</span>
                ))}
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />

          {/* Loading */}
          {docLoading && (
            <div className="text-center py-10 text-gray-400">
              <div className="animate-spin w-8 h-8 border-2 border-gray-200 rounded-full mx-auto mb-3" style={{ borderTopColor: '#f97316' }} />
              Loading document…
            </div>
          )}

          {hasDoc && (
            <>
              {/* Filename + change */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 truncate flex-1">{docFile.name}</span>
                <button onClick={() => { setDocFile(null); setDocPages([]); setWordHtml(null); setSigBounds(null); setSigDataUrl(null); }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors">
                  Change file
                </button>
              </div>

              {/* Letterhead toggle */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Letterhead</p>
                <div className="flex gap-2">
                  {[
                    { id: false, label: 'None' },
                    { id: true,  label: 'Beacon', color: LH.lineColor },
                  ].map(({ id, label, color }) => (
                    <button key={String(id)} onClick={() => setLetterhead(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        letterhead === id
                          ? 'text-white border-transparent'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                      }`}
                      style={letterhead === id ? { background: '#1e3a5f', borderColor: '#1e3a5f' } : {}}>
                      {color && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature section */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowSigPad(v => !v)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-gray-400 shrink-0">✍</span>
                  <span className="text-sm font-semibold text-gray-700 flex-1">
                    {sigDataUrl ? 'Signature ready' : 'Add Signature'}
                  </span>
                  {sigDataUrl && (
                    <img src={sigDataUrl} alt="sig preview" className="h-6 object-contain" />
                  )}
                  <span className="text-xs text-gray-400">{showSigPad ? '▲' : '▼'}</span>
                </button>

                {showSigPad && (
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ink</span>
                      {INK.map(ink => (
                        <button key={ink.id} onClick={() => setInkColor(ink.color)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${inkColor === ink.color ? 'scale-110' : 'border-gray-200'}`}
                          style={{ background: ink.color, borderColor: inkColor === ink.color ? '#1e3a5f' : undefined }}
                          title={ink.label}
                        />
                      ))}
                      <button onClick={clearSig} className="ml-auto text-xs text-gray-400 hover:text-red-400 transition-colors">
                        🗑 Clear
                      </button>
                    </div>

                    <canvas
                      ref={sigCanvasRef}
                      width={520} height={110}
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl cursor-crosshair bg-white touch-none"
                      onMouseDown={startSigDraw}
                      onMouseMove={drawSig}
                      onMouseUp={endSigDraw}
                      onMouseLeave={endSigDraw}
                      onTouchStart={startSigDraw}
                      onTouchMove={drawSig}
                      onTouchEnd={endSigDraw}
                    />
                    <p className="text-xs text-gray-400">Draw your signature above, then place it on the document.</p>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 flex-wrap">
                {sigDataUrl && (
                  <button onClick={() => setPlacingMode(p => !p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                    style={{ background: placingMode ? '#f97316' : '#1e3a5f' }}>
                    ✍ {placingMode ? 'Click to place…' : sigBounds ? 'Move Signature' : 'Place Signature'}
                  </button>
                )}
                {sigBounds && (
                  <button onClick={() => setSigBounds(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    ✕ Remove Sig
                  </button>
                )}
                {docType === 'word' && (
                  <button onClick={() => setEditMode(v => !v)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      editMode ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    ✏ {editMode ? 'Editing…' : 'Edit Text'}
                  </button>
                )}
                <div className="flex-1" />
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">‹</button>
                    <span className="text-xs font-medium">{currentPage + 1}/{totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">›</button>
                  </div>
                )}
                <button onClick={exportSigned}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                  style={{ background: '#1e3a5f' }}>
                  ↓ Save
                </button>
                <button onClick={printDoc}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors">
                  🖨 Print
                </button>
                <button onClick={sendDoc}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors">
                  ✉ Send
                </button>
              </div>

              {/* Placing mode banner */}
              {placingMode && (
                <div className="px-4 py-2.5 rounded-xl text-sm font-medium text-center"
                  style={{ background: '#fff7ed', border: '1px solid #f97316', color: '#c2410c' }}>
                  ✦ Click anywhere on the document below to place your signature
                </div>
              )}

              {/* Letterhead preview header */}
              {letterhead && (
                <div className="rounded-t-xl px-5 py-3 border-x-2 border-t-2 border-gray-200"
                  style={{ background: LH.bg, borderBottom: `2px solid ${LH.lineColor}` }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '3px', color: LH.primaryColor, fontSize: 13 }}>
                    {LH.org}
                  </div>
                  <div style={{ fontSize: 9, color: LH.accentColor, letterSpacing: '2px', fontWeight: 700, marginTop: 3 }}>
                    {LH.tagline.toUpperCase()}
                  </div>
                </div>
              )}

              {/* Document viewer */}
              <div
                ref={docViewerRef}
                onClick={handleDocClick}
                onMouseMove={handleViewerMouseMove}
                onMouseUp={handleViewerMouseUp}
                onMouseLeave={handleViewerMouseUp}
                className={`relative bg-white overflow-auto max-h-[55vh] shadow-inner border-2 select-none transition-colors ${
                  letterhead ? 'rounded-b-xl' : 'rounded-xl'
                }`}
                style={{
                  borderColor: placingMode ? '#f97316' : dragging || resizing ? '#d1d5db' : '#e5e7eb',
                  cursor: placingMode ? 'crosshair' : dragging || resizing ? 'grabbing' : 'default',
                  borderTopWidth: letterhead ? 0 : undefined,
                }}
              >
                {docType === 'word' && wordHtml !== null ? (
                  <div
                    ref={wordViewRef}
                    contentEditable={editMode}
                    suppressContentEditableWarning
                    className="p-10 text-sm leading-relaxed text-gray-900 min-h-64 focus:outline-none"
                    style={editMode ? { boxShadow: 'inset 0 0 0 2px #fbbf24' } : {}}
                  />
                ) : docPages[currentPage] ? (
                  <img src={docPages[currentPage].dataUrl} alt="Document page" className="w-full block" />
                ) : null}

                {/* Draggable/resizable signature */}
                {sigBounds && sigDataUrl && (
                  <div
                    onMouseDown={handleSigMouseDown}
                    style={{
                      position: 'absolute',
                      left: sigBounds.x, top: sigBounds.y,
                      width: sigBounds.w, height: sigBounds.h,
                      border: '2px solid #f97316', borderRadius: 4,
                      cursor: dragging ? 'grabbing' : 'grab',
                      boxSizing: 'border-box',
                    }}
                  >
                    <img src={sigDataUrl} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }} />
                    <div
                      onMouseDown={handleResizeMouseDown}
                      style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 14, height: 14,
                        background: '#f97316', borderRadius: '4px 0 0 0',
                        cursor: 'se-resize',
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocConverterModal;

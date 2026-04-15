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
  const [sigTab, setSigTab]           = useState('saved'); // 'saved' | 'presets' | 'draw' | 'upload'
  const [inkColor, setInkColor]       = useState(INK[0].color);
  const [isDrawing, setIsDrawing]     = useState(false);
  const [sigDataUrl, setSigDataUrl]   = useState(null);
  const [uploadedSigSrc, setUploadedSigSrc] = useState(null);

  // Signature placement — supports multiple signatures
  const [sigList, setSigList]         = useState([]); // [{ id, dataUrl, bounds: {x,y,w,h} }]
  const [placingMode, setPlacingMode] = useState(false);
  const [ghostPos, setGhostPos]       = useState(null); // viewer-relative {x,y} for cursor preview
  const [draggingId, setDraggingId]   = useState(null);
  const [resizingId, setResizingId]   = useState(null);
  const dragOffset  = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Refs
  const fileInputRef = useRef(null);
  const docViewerRef = useRef(null);
  const wordViewRef  = useRef(null);
  const sigCanvasRef = useRef(null);

  // Rich text formatting
  const execCmd = (cmd, val) => {
    wordViewRef.current?.focus();
    document.execCommand(cmd, false, val ?? '');
  };

  // Signature presets
  const SIG_PRESETS = [
    { label: 'Classic',  font: '"Brush Script MT","Segoe Script",cursive', size: 34 },
    { label: 'Elegant',  font: 'italic "Palatino Linotype",Georgia,serif', size: 28 },
    { label: 'Script',   font: 'italic "Book Antiqua","Times New Roman",serif', size: 28 },
    { label: 'Minimal',  font: 'italic Georgia,serif', size: 30 },
  ];
  const [presetName, setPresetName] = useState('');

  // Load saved signature from localStorage on mount
  const savedSigKey = 'bnb_saved_signature';
  const [savedSigUrl, setSavedSigUrl] = useState(() => localStorage.getItem(savedSigKey) || null);

  const applyPreset = (preset) => {
    // Use an offscreen canvas — sigCanvasRef is only in DOM on the 'draw' tab
    const offscreen = document.createElement('canvas');
    offscreen.width = 520; offscreen.height = 110;
    const ctx = offscreen.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    ctx.font = `${preset.size}px ${preset.font}`;
    ctx.fillStyle = inkColor;
    ctx.fillText(presetName || 'Your Name', 20, offscreen.height / 2 + preset.size / 3);
    setSigDataUrl(offscreen.toDataURL());
  };

  const handleSigUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result;
      setUploadedSigSrc(src);
      setSigDataUrl(src);
    };
    reader.readAsDataURL(file);
  };

  const saveSignatureAsDefault = (src) => {
    if (!src) return;
    localStorage.setItem(savedSigKey, src);
    setSavedSigUrl(src);
    showNotif('Signature saved as default');
  };

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

  // Inject CSS so inline sig images don't block clicks in the word editor
  useEffect(() => {
    if (docType !== 'word') return;
    const style = document.createElement('style');
    style.id = 'dcm-word-sig-style';
    style.textContent = '[contenteditable] img { pointer-events: none; user-select: none; }';
    if (!document.getElementById('dcm-word-sig-style')) document.head.appendChild(style);
    return () => { document.getElementById('dcm-word-sig-style')?.remove(); };
  }, [docType]);

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
    setSigList([]); setPlacingMode(false); setEditMode(false); setLetterhead(false);

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

    if (docType === 'word') {
      // Insert inline into the contenteditable so it is part of the saved HTML
      const imgHtml =
        `<span contenteditable="false" style="display:inline-block;position:relative;vertical-align:middle;user-select:none;">` +
        `<img src="${sigDataUrl}" style="height:60px;width:auto;display:block;pointer-events:none;" />` +
        `</span>`;
      let range = document.caretRangeFromPoint?.(e.clientX, e.clientY) ?? null;
      if (!range && document.caretPositionFromPoint) {
        const p = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (p) { range = document.createRange(); range.setStart(p.offsetNode, p.offset); }
      }
      if (range && wordViewRef.current?.contains(range.startContainer)) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('insertHTML', false, imgHtml);
      } else {
        wordViewRef.current?.insertAdjacentHTML('beforeend', imgHtml);
      }
      showNotif('Signature placed — click another spot to add more');
      return; // word sigs live in the contenteditable, not sigList
    }

    // PDF/image: floating overlay, composited at export with scale correction
    const pos = getViewerPos(e);
    setSigList(prev => [...prev, { id: Date.now(), dataUrl: sigDataUrl, bounds: { x: pos.x - 90, y: pos.y - 30, w: 180, h: 60 } }]);
  };

  const handleSigMouseDown = (e, id) => {
    e.stopPropagation();
    const sig = sigList.find(s => s.id === id);
    if (!sig) return;
    dragOffset.current = { x: e.clientX - sig.bounds.x, y: e.clientY - sig.bounds.y };
    setDraggingId(id);
  };

  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    const sig = sigList.find(s => s.id === id);
    if (!sig) return;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: sig.bounds.w, h: sig.bounds.h };
    setResizingId(id);
  };

  const handleViewerMouseMove = (e) => {
    if (draggingId !== null) {
      setSigList(prev => prev.map(s => s.id === draggingId
        ? { ...s, bounds: { ...s.bounds, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y } }
        : s));
    }
    if (resizingId !== null) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      setSigList(prev => prev.map(s => s.id === resizingId
        ? { ...s, bounds: { ...s.bounds, w: Math.max(60, resizeStart.current.w + dx), h: Math.max(20, resizeStart.current.h + dy) } }
        : s));
    }
    // Track mouse for ghost signature preview in placing mode
    if (placingMode && docViewerRef.current) {
      const rect = docViewerRef.current.getBoundingClientRect();
      const el = docViewerRef.current;
      setGhostPos({ x: e.clientX - rect.left + el.scrollLeft, y: e.clientY - rect.top + el.scrollTop });
    }
  };

  const handleViewerMouseUp = () => { setDraggingId(null); setResizingId(null); };
  const handleViewerMouseLeave = () => { setDraggingId(null); setResizingId(null); setGhostPos(null); };
  const removeSig = (id) => setSigList(prev => prev.filter(s => s.id !== id));

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

      if (sigList.length > 0) {
        // Map viewer display coords → full-resolution canvas coords
        const viewerEl = docViewerRef.current;
        const docImgEl = viewerEl?.querySelector('img');
        const displayW = docImgEl?.offsetWidth  || viewerEl?.offsetWidth  || composed.width;
        const displayH = docImgEl?.offsetHeight || viewerEl?.offsetHeight || (letterhead ? composed.height - LH_HEADER_H : composed.height);
        const pageCanvasH = letterhead ? composed.height - LH_HEADER_H : composed.height;
        const scaleX = composed.width / displayW;
        const scaleY = pageCanvasH   / displayH;
        const lhOff  = letterhead ? LH_HEADER_H : 0;
        for (const sig of sigList) {
          const ctx = composed.getContext('2d');
          const img = await loadImg(sig.dataUrl);
          ctx.drawImage(img,
            Math.round(sig.bounds.x * scaleX),
            Math.round(sig.bounds.y * scaleY + lhOff),
            Math.round(sig.bounds.w * scaleX),
            Math.round(sig.bounds.h * scaleY)
          );
        }
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
    if (sigList.length > 0) {
      const viewerEl = docViewerRef.current;
      const docImgEl = viewerEl?.querySelector('img');
      const displayW = docImgEl?.offsetWidth  || viewerEl?.offsetWidth  || composed.width;
      const displayH = docImgEl?.offsetHeight || viewerEl?.offsetHeight || (letterhead ? composed.height - LH_HEADER_H : composed.height);
      const pageCanvasH = letterhead ? composed.height - LH_HEADER_H : composed.height;
      const scaleX = composed.width / displayW;
      const scaleY = pageCanvasH   / displayH;
      const lhOff  = letterhead ? LH_HEADER_H : 0;
      for (const sig of sigList) {
        const ctx = composed.getContext('2d');
        const img = await loadImg(sig.dataUrl);
        ctx.drawImage(img,
          Math.round(sig.bounds.x * scaleX),
          Math.round(sig.bounds.y * scaleY + lhOff),
          Math.round(sig.bounds.w * scaleX),
          Math.round(sig.bounds.h * scaleY)
        );
      }
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
                <button onClick={() => { setDocFile(null); setDocPages([]); setWordHtml(null); setSigList([]); setSigDataUrl(null); setPlacingMode(false); setGhostPos(null); }}
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
                <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <button
                    onClick={() => setShowSigPad(v => !v)}
                    className="flex items-center gap-3 px-4 py-3 text-left flex-1"
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
                  {sigList.length > 0 && (
                    <button
                      onClick={() => {
                        setSigDataUrl(null);
                        setUploadedSigSrc(null);
                        setPresetName('');
                        if (sigCanvasRef.current) {
                          const ctx = sigCanvasRef.current.getContext('2d');
                          ctx.fillStyle = '#fff';
                          ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
                        }
                        setPlacingMode(false);
                        setGhostPos(null);
                        setSigTab('presets');
                        setShowSigPad(true);
                      }}
                      className="shrink-0 mr-3 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
                      style={{ borderColor: '#f97316', color: '#c2410c', background: '#fff7ed' }}
                      title="Clear current signature and create one for a different person"
                    >
                      + New signer
                    </button>
                  )}
                </div>

                {showSigPad && (
                  <div className="px-4 py-3 space-y-3">
                    {/* Tab switcher */}
                    <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                      {[
                        { id: 'saved',   label: '⭐ Saved' },
                        { id: 'presets', label: '✦ Presets' },
                        { id: 'draw',    label: '✏ Draw' },
                        { id: 'upload',  label: '↑ Upload' },
                      ].map(t => (
                        <button key={t.id} onClick={() => setSigTab(t.id)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${sigTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Saved panel */}
                    {sigTab === 'saved' && (
                      <div className="text-center space-y-3">
                        {savedSigUrl ? (
                          <>
                            <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 bg-gray-50">
                              <img src={savedSigUrl} alt="Saved signature" className="max-h-20 object-contain mx-auto" />
                            </div>
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setSigDataUrl(savedSigUrl)}
                                className="px-4 py-2 rounded-full text-xs font-bold text-white"
                                style={{ background: '#1e3a5f' }}>
                                Use This Signature
                              </button>
                              <button onClick={() => { localStorage.removeItem(savedSigKey); setSavedSigUrl(null); }}
                                className="px-4 py-2 rounded-full text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="py-6 text-gray-400">
                            <div className="text-3xl mb-2">🖊</div>
                            <p className="text-xs">No saved signature yet.</p>
                            <p className="text-xs">Draw or upload one, then click "Save as default".</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Presets panel */}
                    {sigTab === 'presets' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Type your name…"
                          value={presetName}
                          onChange={e => setPresetName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          {SIG_PRESETS.map((p, i) => (
                            <button key={i} onClick={() => applyPreset(p)}
                              className="h-14 border-2 border-gray-100 rounded-xl bg-white hover:border-orange-300 transition-all flex items-center justify-center px-3 overflow-hidden"
                              style={{ fontFamily: p.font, fontSize: p.size, color: inkColor }}>
                              {presetName || 'Your Name'}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Ink:</span>
                          {INK.map(ink => (
                            <button key={ink.id} onClick={() => setInkColor(ink.color)}
                              className={`w-5 h-5 rounded-full border-2 transition-all ${inkColor === ink.color ? 'scale-110' : 'border-gray-200'}`}
                              style={{ background: ink.color, borderColor: inkColor === ink.color ? '#1e3a5f' : undefined }}
                              title={ink.label}
                            />
                          ))}
                          {sigDataUrl && <button onClick={clearSig} className="ml-auto text-xs text-gray-400 hover:text-red-400">🗑 Clear</button>}
                        </div>
                      </div>
                    )}

                    {/* Draw panel */}
                    {sigTab === 'draw' && (
                      <div className="space-y-2">
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
                        {sigDataUrl && (
                          <button onClick={() => saveSignatureAsDefault(sigDataUrl)}
                            className="w-full py-1.5 text-xs font-semibold border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                            ⭐ Save as default signature
                          </button>
                        )}
                      </div>
                    )}

                    {/* Upload panel */}
                    {sigTab === 'upload' && (
                      <div className="space-y-3 text-center">
                        <label className="block border-2 border-dashed border-gray-200 rounded-xl py-6 px-4 cursor-pointer hover:border-orange-300 transition-colors">
                          <span className="text-2xl block mb-1">🖼</span>
                          <span className="text-sm font-semibold text-gray-600">Click to upload signature image</span>
                          <span className="text-xs text-gray-400 block mt-0.5">PNG, JPG — transparent background works best</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleSigUpload} />
                        </label>
                        {uploadedSigSrc && (
                          <>
                            <img src={uploadedSigSrc} alt="Uploaded signature" className="max-h-16 object-contain mx-auto border border-gray-100 rounded-lg p-2" />
                            <button onClick={() => saveSignatureAsDefault(uploadedSigSrc)}
                              className="w-full py-1.5 text-xs font-semibold border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                              ⭐ Save as default signature
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 flex-wrap">
                {sigDataUrl && (
                  <button onClick={() => { if (placingMode) setGhostPos(null); setPlacingMode(p => !p); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                    style={{ background: placingMode ? '#f97316' : '#1e3a5f' }}>
                    ✍ {placingMode ? 'Placing…' : 'Place Signature'}
                  </button>
                )}
                {sigList.length > 0 && (
                  <span className="text-xs text-gray-400">{sigList.length} signature{sigList.length > 1 ? 's' : ''} placed</span>
                )}
                {docType === 'word' && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full border"
                    style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#f97316' }}>
                    ✏ Editing
                  </span>
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

              {/* ── Rich text formatting toolbar (Word docs only) ── */}
              {docType === 'word' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', padding: '8px 12px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  {/* Bold / Italic / Underline */}
                  {[
                    { cmd: 'bold',      label: 'B', title: 'Bold',      extra: { fontWeight: 900 } },
                    { cmd: 'italic',    label: 'I', title: 'Italic',    extra: { fontStyle: 'italic' } },
                    { cmd: 'underline', label: 'U', title: 'Underline', extra: { textDecoration: 'underline' } },
                  ].map(({ cmd, label, title, extra }) => (
                    <button key={cmd} title={title}
                      onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13, color: '#374151', ...extra }}>
                      {label}
                    </button>
                  ))}
                  <span style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
                  {/* Alignment */}
                  {[
                    { cmd: 'justifyLeft',   label: '⬛ Left',    title: 'Align left' },
                    { cmd: 'justifyCenter', label: '⬛ Center',  title: 'Center' },
                    { cmd: 'justifyRight',  label: '⬛ Right',   title: 'Align right' },
                    { cmd: 'justifyFull',   label: '⬛ Justify', title: 'Justify' },
                  ].map(({ cmd, label, title }) => (
                    <button key={cmd} title={title}
                      onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                      style={{ height: 28, padding: '0 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 11, color: '#374151', whiteSpace: 'nowrap' }}>
                      {title}
                    </button>
                  ))}
                  <span style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
                  {/* Font size */}
                  <select title="Font size"
                    style={{ height: 28, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 12, color: '#374151', padding: '0 4px', background: '#fff', cursor: 'pointer' }}
                    defaultValue=""
                    onChange={e => { execCmd('fontSize', e.target.value); e.target.value = ''; }}
                  >
                    <option value="" disabled>Size</option>
                    <option value="1">Tiny (8pt)</option>
                    <option value="2">Small (10pt)</option>
                    <option value="3">Normal (12pt)</option>
                    <option value="4">Medium (14pt)</option>
                    <option value="5">Large (18pt)</option>
                    <option value="6">XL (24pt)</option>
                    <option value="7">XXL (36pt)</option>
                  </select>
                  {/* Headings */}
                  <select title="Paragraph style"
                    style={{ height: 28, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 12, color: '#374151', padding: '0 4px', background: '#fff', cursor: 'pointer' }}
                    defaultValue=""
                    onChange={e => { execCmd('formatBlock', e.target.value); e.target.value = ''; }}
                  >
                    <option value="" disabled>Style</option>
                    <option value="p">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                  </select>
                  <span style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
                  {/* Lists */}
                  {[
                    { cmd: 'insertUnorderedList', label: '• List', title: 'Bullet list' },
                    { cmd: 'insertOrderedList',   label: '1. List', title: 'Numbered list' },
                  ].map(({ cmd, label, title }) => (
                    <button key={cmd} title={title}
                      onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                      style={{ height: 28, padding: '0 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 11, color: '#374151' }}>
                      {label}
                    </button>
                  ))}
                  <span style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
                  <button title="Remove formatting"
                    onMouseDown={e => { e.preventDefault(); execCmd('removeFormat'); }}
                    style={{ height: 28, padding: '0 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 11, color: '#9ca3af' }}>
                    Tx
                  </button>
                </div>
              )}

              {/* Placing mode banner */}
              {placingMode && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: '#fff7ed', border: '1px solid #f97316', color: '#c2410c' }}>
                  <span className="flex-1 text-xs">✦ Click anywhere on the document to stamp your signature. Click again to add more.</span>
                  <button
                    onClick={() => { setPlacingMode(false); setGhostPos(null); }}
                    className="shrink-0 px-3 py-1 rounded-full text-xs font-bold border"
                    style={{ borderColor: '#c2410c', background: '#fff', color: '#c2410c' }}>
                    Done
                  </button>
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
                onMouseLeave={handleViewerMouseLeave}
                className={`relative bg-white overflow-auto max-h-[55vh] shadow-inner border-2 select-none transition-colors ${
                  letterhead ? 'rounded-b-xl' : 'rounded-xl'
                }`}
                style={{
                  borderColor: placingMode ? '#f97316' : draggingId || resizingId ? '#d1d5db' : '#e5e7eb',
                  cursor: placingMode ? 'crosshair' : draggingId || resizingId ? 'grabbing' : 'default',
                  borderTopWidth: letterhead ? 0 : undefined,
                }}
              >
                {docType === 'word' && wordHtml !== null ? (
                  <div
                    ref={wordViewRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="p-10 text-sm leading-relaxed text-gray-900 min-h-64 focus:outline-none"
                  />
                ) : docPages[currentPage] ? (
                  <img src={docPages[currentPage].dataUrl} alt="Document page" className="w-full block" />
                ) : null}

                {/* Ghost preview — semi-transparent sig follows cursor in placing mode */}
                {placingMode && sigDataUrl && ghostPos && !draggingId && !resizingId && (
                  <img
                    src={sigDataUrl}
                    alt=""
                    style={{
                      position: 'absolute',
                      left: ghostPos.x - 90,
                      top: ghostPos.y - 30,
                      width: 180,
                      height: 60,
                      objectFit: 'contain',
                      opacity: 0.45,
                      pointerEvents: 'none',
                      border: '2px dashed #f97316',
                      borderRadius: 4,
                    }}
                  />
                )}

                {/* Multiple draggable/resizable signatures */}
                {sigList.map(sig => (
                  <div
                    key={sig.id}
                    onMouseDown={e => handleSigMouseDown(e, sig.id)}
                    style={{
                      position: 'absolute',
                      left: sig.bounds.x, top: sig.bounds.y,
                      width: sig.bounds.w, height: sig.bounds.h,
                      border: '2px solid #f97316', borderRadius: 4,
                      cursor: draggingId === sig.id ? 'grabbing' : 'grab',
                      boxSizing: 'border-box',
                    }}
                  >
                    <img src={sig.dataUrl} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }} />
                    {/* Remove button */}
                    <button
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => { e.stopPropagation(); removeSig(sig.id); }}
                      style={{ position: 'absolute', top: -10, right: -10, width: 20, height: 20, background: '#ef4444', border: 'none', borderRadius: '50%', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    >×</button>
                    {/* Resize handle */}
                    <div
                      onMouseDown={e => handleResizeMouseDown(e, sig.id)}
                      style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, background: '#f97316', borderRadius: '4px 0 0 0', cursor: 'se-resize' }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocConverterModal;

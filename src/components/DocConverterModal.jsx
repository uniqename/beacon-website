import React, { useState, useRef } from 'react';

const loadedScripts = new Set();
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (loadedScripts.has(src)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { loadedScripts.add(src); resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });

const buildHTMLPage = (bodyHTML, title = 'Document') => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #222; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  td, th { border: 1px solid #ccc; padding: 8px 12px; }
  th { background: #f5f5f5; font-weight: bold; }
  pre { background: #f8f8f8; padding: 16px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; }
  @media print { .toolbar { display: none; } }
</style>
</head>
<body>
<div class="toolbar" style="margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;">
  <button onclick="window.print()" style="padding:10px 24px;background:#ea580c;color:#fff;border:none;border-radius:24px;cursor:pointer;font-size:14px;">Print / Save PDF</button>
  <button onclick="document.execCommand('selectAll')" style="padding:10px 24px;background:#374151;color:#fff;border:none;border-radius:24px;cursor:pointer;font-size:14px;">Select All</button>
</div>
<div contenteditable="true" style="outline:none; min-height:400px;">
${bodyHTML}
</div>
</body>
</html>`;

const DocConverterModal = ({ onClose }) => {
  const [status, setStatus] = useState('idle'); // idle | converting | done | error
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStatus('converting');
    setMessage('Converting...');

    const ext = file.name.split('.').pop().toLowerCase();
    try {
      let bodyHTML = '';

      if (ext === 'docx' || ext === 'doc') {
        await loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js');
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        bodyHTML = result.value;

      } else if (ext === 'xlsx' || ext === 'xls') {
        await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
        const arrayBuffer = await file.arrayBuffer();
        const workbook = window.XLSX.read(arrayBuffer, { type: 'array' });
        bodyHTML = workbook.SheetNames.map((name) => {
          const sheet = workbook.Sheets[name];
          const html = window.XLSX.utils.sheet_to_html(sheet);
          return `<h2 style="margin-top:24px;font-size:18px;">${name}</h2>${html}`;
        }).join('');

      } else if (ext === 'csv') {
        const text = await file.text();
        const rows = text.split('\n').map((r) => r.split(','));
        const tableRows = rows.map((cells, i) =>
          `<tr>${cells.map((c) => i === 0 ? `<th>${c.trim()}</th>` : `<td>${c.trim()}</td>`).join('')}</tr>`
        ).join('');
        bodyHTML = `<table>${tableRows}</table>`;

      } else if (ext === 'txt') {
        const text = await file.text();
        bodyHTML = `<pre>${text}</pre>`;

      } else if (ext === 'pdf') {
        const url = URL.createObjectURL(file);
        const html = buildHTMLPage(`<iframe src="${url}" style="width:100%;height:80vh;border:none;"></iframe>`, file.name);
        const blob = new Blob([html], { type: 'text/html' });
        window.open(URL.createObjectURL(blob), '_blank');
        setStatus('done');
        setMessage('Opened in new tab');
        return;

      } else {
        throw new Error('Unsupported file type');
      }

      const html = buildHTMLPage(bodyHTML, file.name);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setStatus('done');
      setMessage('Opened in new tab — edit and print/save as PDF');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Conversion failed');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="bg-gray-900 px-6 py-5 rounded-t-2xl text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none">&times;</button>
          <h2 className="text-xl font-serif font-bold">Document Converter</h2>
          <p className="text-gray-400 text-sm mt-1">Convert to editable HTML — PDF, DOCX, XLSX, CSV, TXT</p>
        </div>

        <div className="p-6">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all"
          >
            <div className="text-4xl mb-3">📄</div>
            <p className="text-gray-700 font-medium">Drop your file here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-3">PDF · DOCX · XLSX · CSV · TXT</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {status !== 'idle' && (
            <div className={`mt-4 p-4 rounded-xl text-sm ${
              status === 'converting' ? 'bg-blue-50 text-blue-700' :
              status === 'done' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {status === 'converting' && <span className="animate-pulse">⏳ </span>}
              {status === 'done' && '✅ '}
              {status === 'error' && '❌ '}
              <strong>{fileName}</strong> — {message}
            </div>
          )}

          <button onClick={onClose} className="w-full mt-4 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:border-gray-400 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocConverterModal;

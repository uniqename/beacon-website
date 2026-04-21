import { useState } from 'react';

const FORMATS = [
  {
    id: 'long',
    label: 'Long form',
    fmt: (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  },
  {
    id: 'us',
    label: 'US form',
    fmt: (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  },
  {
    id: 'ordinal',
    label: 'Ordinal',
    fmt: (d) => {
      const n = d.getDate();
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      const ord = s[(v - 20) % 10] || s[v] || s[0];
      return `${n}${ord} ${d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
    },
  },
  {
    id: 'short',
    label: 'Short (DD/MM/YYYY)',
    fmt: (d) => d.toLocaleDateString('en-GB'),
  },
  {
    id: 'iso',
    label: 'ISO 8601',
    fmt: (d) => d.toISOString().split('T')[0],
  },
  {
    id: 'month',
    label: 'Month + Year',
    fmt: (d) => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  },
];

const DateGenerator = ({ onClose }) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const [dateVal, setDateVal] = useState(todayIso);
  const [copied, setCopied] = useState(null);

  const date = new Date(dateVal + 'T12:00:00');

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 px-7 pt-7 pb-5 border-b border-gray-100">
          <div className="bg-orange-100 text-orange-600 rounded-xl p-3 text-2xl">📅</div>
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900">Date Generator</h2>
            <p className="text-gray-500 text-sm">Pick a date · copy any format</p>
          </div>
        </div>

        <div className="px-7 py-6">
          <input
            type="date"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 mb-5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="space-y-2">
            {FORMATS.map(({ id, label, fmt }) => {
              const text = fmt(date);
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{text}</p>
                  </div>
                  <button
                    onClick={() => copy(text, id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      copied === id
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-700'
                    }`}
                  >
                    {copied === id ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 text-center mt-5">
            To stamp a date onto a document, use <strong>Document Converter</strong> → Place Date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateGenerator;

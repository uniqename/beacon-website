import React, { useState } from 'react';

const PAYMENT_METHODS = [
  { id: 'paypal', label: 'PayPal', icon: '💳' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'momo', label: 'Mobile Money', icon: '📱' },
];

const AMOUNTS = [10, 25, 50, 100, 250];

const DonateModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const selectedAmount = amount === 'custom' ? customAmount : amount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-orange-600 px-6 py-5 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none">&times;</button>
          <h2 className="text-2xl font-serif font-bold">Make a Donation</h2>
          <p className="text-orange-100 text-sm mt-1">Your gift transforms lives in Ghana</p>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-6">Your donation of <strong>${selectedAmount}</strong> will make a real difference for survivors in Ghana.</p>
              <button onClick={onClose} className="bg-orange-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-700 transition-colors duration-300">
                Close
              </button>
            </div>
          ) : step === 1 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select an amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(String(a)); setCustomAmount(''); }}
                    className={`py-3 rounded-xl font-semibold border-2 transition-all ${
                      amount === String(a)
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400'
                    }`}
                  >
                    ${a}
                  </button>
                ))}
                <button
                  onClick={() => setAmount('custom')}
                  className={`py-3 rounded-xl font-semibold border-2 transition-all ${
                    amount === 'custom'
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400'
                  }`}
                >
                  Custom
                </button>
              </div>
              {amount === 'custom' && (
                <div className="mb-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}
              <button
                onClick={() => selectedAmount && setStep(2)}
                disabled={!selectedAmount}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Continue → ${selectedAmount || '—'}
              </button>
            </>
          ) : step === 2 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment method</h3>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      method === m.id
                        ? 'bg-orange-50 border-orange-500'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-medium text-gray-800">{m.label}</span>
                    {method === m.id && <span className="ml-auto text-orange-600">✓</span>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:border-gray-400 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => method && setStep(3)}
                  disabled={!method}
                  className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
                />
                {method === 'momo' && (
                  <input
                    required
                    placeholder="Mobile number (e.g. +233...)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
                  />
                )}
                <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-700">
                  <div className="flex justify-between"><span>Amount</span><strong>${selectedAmount}</strong></div>
                  <div className="flex justify-between mt-1"><span>Method</span><strong className="capitalize">{method}</strong></div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:border-gray-400 transition-colors">
                    Back
                  </button>
                  <button type="submit" className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors">
                    Donate ${selectedAmount}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonateModal;

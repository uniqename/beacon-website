import React, { useState } from 'react';

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

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD', amounts: [10, 25, 50, 100, 250] },
  { code: 'GHS', symbol: '₵', label: 'GHS', amounts: [50, 100, 200, 500, 1000] },
];

const PAYMENT_METHODS = {
  GHS: [
    { id: 'momo', label: 'Mobile Money', sub: 'MTN, Vodafone, AirtelTigo', icon: '📱', flwOption: 'mobilemoneyghana', needsPhone: true },
    { id: 'card', label: 'Debit / Credit Card', sub: 'Visa, Mastercard', icon: '💳', flwOption: 'card', needsPhone: false },
    { id: 'bank', label: 'Bank Transfer', sub: 'Direct bank transfer', icon: '🏦', flwOption: 'banktransfer', needsPhone: false },
  ],
  USD: [
    { id: 'card', label: 'Debit / Credit Card', sub: 'Visa, Mastercard', icon: '💳', flwOption: 'card', needsPhone: false },
    { id: 'paypal', label: 'PayPal', sub: 'Pay with your PayPal account', icon: '🅿️', flwOption: null, needsPhone: false },
  ],
};

const DonateModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const selectedAmount = amount === 'custom' ? customAmount : amount;
  const displayAmount = selectedAmount ? `${currency.symbol}${selectedAmount}` : '—';
  const methods = PAYMENT_METHODS[currency.code];
  const selectedMethod = methods.find((m) => m.id === method);

  const handleCurrencyChange = (c) => {
    setCurrency(c);
    setAmount('');
    setCustomAmount('');
    setMethod('');
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      if (method === 'paypal') {
        const paypalEmail = import.meta.env.VITE_PAYPAL_EMAIL || '';
        const url = `https://www.paypal.com/donate?business=${encodeURIComponent(paypalEmail)}&amount=${selectedAmount}&currency_code=USD&item_name=${encodeURIComponent('Beacon of New Beginnings Donation')}`;
        window.open(url, '_blank');
        setProcessing(false);
        setSubmitted(true);
        return;
      }

      await loadScript('https://checkout.flutterwave.com/v3.js');

      window.FlutterwaveCheckout({
        public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
        tx_ref: `bnb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        amount: Number(selectedAmount),
        currency: currency.code,
        payment_options: selectedMethod.flwOption,
        customer: {
          email: form.email,
          name: form.name,
          ...(form.phone ? { phone_number: form.phone } : {}),
        },
        customizations: {
          title: 'Beacon of New Beginnings',
          description: 'Your donation transforms lives in Ghana',
          logo: 'https://beaconnewbeginnings.org/images/logo.png',
        },
        callback: (response) => {
          setProcessing(false);
          if (response.status === 'successful' || response.status === 'completed') {
            setSubmitted(true);
          } else {
            setError('Payment was not completed. Please try again.');
          }
        },
        onclose: () => {
          setProcessing(false);
        },
      });
    } catch {
      setProcessing(false);
      setError('Could not load payment gateway. Please check your connection and try again.');
    }
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
              <p className="text-gray-600 mb-6">
                {method === 'paypal'
                  ? "You've been redirected to PayPal to complete your donation. Thank you for your generosity."
                  : `Your donation of ${displayAmount} will make a real difference for survivors in Ghana.`}
              </p>
              <button onClick={onClose} className="bg-orange-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-700 transition-colors duration-300">
                Close
              </button>
            </div>

          ) : step === 1 ? (
            <>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-5">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCurrencyChange(c)}
                    className={`flex-1 py-2 text-sm font-semibold transition-colors ${currency.code === c.code ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    {c.symbol} {c.label}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select an amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {currency.amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(String(a)); setCustomAmount(''); }}
                    className={`py-3 rounded-xl font-semibold border-2 transition-all ${
                      amount === String(a)
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400'
                    }`}
                  >
                    {currency.symbol}{a}
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">{currency.symbol}</span>
                    <input
                      type="number"
                      min="1"
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
                Continue → {displayAmount}
              </button>
            </>

          ) : step === 2 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How would you like to pay?</h3>
              <div className="space-y-3 mb-6">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      method === m.id
                        ? 'bg-orange-50 border-orange-500'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.sub}</p>
                    </div>
                    {method === m.id && <span className="text-orange-600 font-bold">✓</span>}
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
              <form onSubmit={handleDonate} className="space-y-4">
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
                {selectedMethod?.needsPhone && (
                  <input
                    required
                    placeholder="Mobile number (e.g. 024 000 0000)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
                  />
                )}
                <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-700">
                  <div className="flex justify-between"><span>Amount</span><strong>{displayAmount} {currency.code}</strong></div>
                  <div className="flex justify-between mt-1"><span>Method</span><strong>{selectedMethod?.label}</strong></div>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => { setError(''); setStep(2); }} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:border-gray-400 transition-colors">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors disabled:opacity-60"
                  >
                    {processing ? 'Loading...' : method === 'paypal' ? 'Go to PayPal →' : `Donate ${displayAmount}`}
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

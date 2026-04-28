import React, { useState, useEffect, useRef } from 'react';
import { useRegion } from '../context/RegionContext';

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

// Mirrors enhanced_donation_screen.dart exactly
const CURRENCIES = {
  GHS: { symbol: '₵', label: 'Ghana Cedis',    amounts: [100, 200, 500, 1000, 2000, 5000] },
  USD: { symbol: '$', label: 'US Dollars',     amounts: [25, 50, 100, 250, 500, 1000] },
  EUR: { symbol: '€', label: 'Euros',          amounts: [10, 25, 50, 100, 250, 500] },
  GBP: { symbol: '£', label: 'British Pounds', amounts: [10, 25, 50, 100, 250, 500] },
};

const PAYMENT_METHODS = {
  GHS: [
    { id: 'card',         label: 'Card / Bank (Paystack)', channels: ['card', 'bank'] },
    { id: 'momo',         label: 'Mobile Money',           channels: ['mobile_money'] },
    { id: 'bank_transfer',label: 'Bank Transfer',          channels: ['bank_transfer'] },
  ],
  USD: [
    { id: 'card',  label: 'Card / Apple Pay / Google Pay', channels: ['card'] },
    { id: 'paypal',label: 'PayPal',                        channels: [] },
  ],
  EUR: [{ id: 'card', label: 'Card / Apple Pay / Google Pay', channels: ['card'] }],
  GBP: [{ id: 'card', label: 'Card / Apple Pay / Google Pay', channels: ['card'] }],
};

const ICONS = { card: '💳', momo: '📱', bank_transfer: '🏦', paypal: '🅿️' };
const ORANGE = '#F0562D';

const DonateModal = ({ onClose }) => {
  const { config } = useRegion();
  const [currency,     setCurrency]     = useState(config.defaultCurrency);
  const [amount,       setAmount]       = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency,    setFrequency]    = useState('one-time');
  const [method,       setMethod]       = useState('card');
  const [momoNetwork,  setMomoNetwork]  = useState('MTN');
  const [anonymous,    setAnonymous]    = useState(false);
  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [txRef,        setTxRef]        = useState('');
  const [processing,   setProcessing]   = useState(false);
  const [error,        setError]        = useState('');
  const paypalContainerRef = useRef(null);
  const paypalButtonsRef   = useRef(null);

  const cur     = CURRENCIES[currency];
  const methods = PAYMENT_METHODS[currency];
  const selMeth = methods.find((m) => m.id === method) ?? methods[0];
  const selAmt  = amount === 'custom' ? customAmount : amount;
  const display = selAmt ? `${cur.symbol}${Number(selAmt).toLocaleString()}` : '';

  const handleCurrencyChange = (c) => {
    setCurrency(c);
    setAmount('');
    setCustomAmount('');
    setMethod(PAYMENT_METHODS[c][0].id);
  };

  const isValid = () =>
    !!selAmt && Number(selAmt) > 0 &&
    !!email &&
    (anonymous || !!name) &&
    (method !== 'momo' || !!phone) &&
    agreeToTerms;

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!isValid()) return;
    setError('');
    setProcessing(true);

    if (method === 'paypal') {
      // PayPal buttons handle checkout — this submit path is unused for PayPal
      setProcessing(false);
      return;
    }

    try {
      await loadScript('https://js.paystack.co/v1/inline.js');
      const ref = `bnb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const handler = window.PaystackPop.setup({
        key:      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email:    anonymous ? 'anonymous@beaconnewbeginnings.org' : email,
        amount:   Math.round(Number(selAmt) * 100),
        currency,
        ref,
        channels: selMeth.channels,
        metadata: {
          custom_fields: [
            { display_name: 'Donor Name', variable_name: 'donor_name', value: anonymous ? 'Anonymous' : name },
            { display_name: 'Frequency',  variable_name: 'frequency',  value: frequency },
            ...(method === 'momo'
              ? [{ display_name: 'MoMo Network', variable_name: 'momo_network', value: momoNetwork }]
              : []),
          ],
        },
        callback: (response) => {
          setProcessing(false);
          setTxRef(response.reference ?? ref);
          setSubmitted(true);
        },
        onClose: () => setProcessing(false),
      });

      handler.openIframe();
    } catch {
      setProcessing(false);
      setError('Could not load payment gateway. Please check your connection and try again.');
    }
  };

  // Render PayPal SDK buttons whenever PayPal is selected and an amount is entered
  useEffect(() => {
    if (method !== 'paypal') return;
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId || !selAmt || Number(selAmt) <= 0) return;

    const renderButtons = () => {
      if (!paypalContainerRef.current) return;
      if (paypalButtonsRef.current) {
        paypalButtonsRef.current.close?.();
        paypalButtonsRef.current = null;
      }
      paypalContainerRef.current.innerHTML = '';

      paypalButtonsRef.current = window.paypal.Buttons({
        style: { layout: 'horizontal', color: 'gold', shape: 'pill', height: 48 },
        createOrder: (_data, actions) =>
          actions.order.create({
            purchase_units: [{
              amount: { value: Number(selAmt).toFixed(2), currency_code: 'USD' },
              description: `${config.orgName} Donation`,
            }],
            application_context: { shipping_preference: 'NO_SHIPPING' },
          }),
        onApprove: async (_data, actions) => {
          setProcessing(true);
          const details = await actions.order.capture();
          setTxRef(details.id);
          setSubmitted(true);
          setProcessing(false);
        },
        onError: () => setError('PayPal payment failed. Please try again.'),
        onCancel: () => setProcessing(false),
      });

      if (paypalButtonsRef.current.isEligible()) {
        paypalButtonsRef.current.render(paypalContainerRef.current);
      }
    };

    const sdkSrc = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    loadScript(sdkSrc).then(renderButtons).catch(() =>
      setError('Could not load PayPal. Please check your connection.')
    );

    return () => {
      paypalButtonsRef.current?.close?.();
      paypalButtonsRef.current = null;
    };
  }, [method, selAmt, config.orgName]);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="px-6 py-5 text-white rounded-t-2xl" style={{ background: ORANGE }}>
            <h2 className="text-2xl font-serif font-bold">Thank You!</h2>
          </div>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Donation Received</h3>
            <p className="text-gray-600 mb-2">
              {method === 'paypal'
                ? "You've been redirected to PayPal to complete your donation. Thank you for your generosity."
                : `Your ${frequency === 'monthly' ? 'monthly ' : ''}donation of ${display} will make a real difference for survivors in ${config.country}.`}
            </p>
            {txRef && <p className="text-xs text-gray-400 mb-4">Reference: {txRef}</p>}
            <p className="text-sm text-gray-500 mb-6">A receipt has been sent to your email.</p>
            <button
              onClick={onClose}
              className="text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
              style={{ background: ORANGE }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-5 text-white rounded-t-2xl flex-shrink-0 relative" style={{ background: ORANGE }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none">&times;</button>
          <h2 className="text-2xl font-serif font-bold">Donate to Beacon</h2>
          <p className="text-white/80 text-sm mt-1">Your gift transforms lives in {config.country}</p>
        </div>

        <form onSubmit={handleDonate} className="overflow-y-auto flex-1">
          <div className="p-4 space-y-4">

            {/* Currency */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: ORANGE }}>Currency</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CURRENCIES).map(([code, c]) => {
                  const sel = currency === code;
                  return (
                    <button
                      type="button" key={code}
                      onClick={() => handleCurrencyChange(code)}
                      className="flex flex-col items-center py-3 rounded-xl border-2 transition-all"
                      style={{ borderColor: sel ? ORANGE : '#e5e7eb', background: sel ? 'rgba(240,86,45,0.08)' : '#f9fafb' }}
                    >
                      <span className="text-xl font-bold" style={{ color: sel ? ORANGE : '#6b7280' }}>{c.symbol}</span>
                      <span className="text-xs mt-0.5" style={{ color: sel ? ORANGE : '#6b7280' }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: ORANGE }}>Donation Amount</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {cur.amounts.map((a) => {
                  const sel = amount === String(a);
                  return (
                    <button
                      type="button" key={a}
                      onClick={() => { setAmount(String(a)); setCustomAmount(''); }}
                      className="px-4 py-2 rounded-full border-2 font-bold text-sm transition-all"
                      style={{ borderColor: sel ? ORANGE : '#d1d5db', background: sel ? ORANGE : '#f3f4f6', color: sel ? '#fff' : '#374151' }}
                    >
                      {cur.symbol}{a.toLocaleString()}
                    </button>
                  );
                })}
              </div>
              <input
                type="number" min="1"
                placeholder={`Custom amount (${cur.symbol})`}
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount('custom'); }}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: amount === 'custom' && customAmount ? ORANGE : undefined }}
              />
            </div>

            {/* Frequency */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: ORANGE }}>Donation Frequency</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'one-time', label: 'One-time', icon: '💳' }, { value: 'monthly', label: 'Monthly', icon: '🔄' }].map((f) => {
                  const sel = frequency === f.value;
                  return (
                    <button
                      type="button" key={f.value}
                      onClick={() => setFrequency(f.value)}
                      className="flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all"
                      style={{ borderColor: sel ? ORANGE : '#e5e7eb', background: sel ? 'rgba(240,86,45,0.08)' : '#f9fafb' }}
                    >
                      <span className="text-2xl">{f.icon}</span>
                      <span className="font-bold text-sm" style={{ color: sel ? ORANGE : '#6b7280' }}>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: ORANGE }}>Payment Method</h3>
              <div className="space-y-2">
                {methods.map((m) => {
                  const sel = method === m.id;
                  return (
                    <button
                      type="button" key={m.id}
                      onClick={() => setMethod(m.id)}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left"
                      style={{ borderColor: sel ? ORANGE : '#e5e7eb', background: sel ? 'rgba(240,86,45,0.08)' : '#f9fafb' }}
                    >
                      <span className="text-xl">{ICONS[m.id]}</span>
                      <span className="flex-1 font-medium text-sm" style={{ color: sel ? ORANGE : '#374151' }}>{m.label}</span>
                      {sel && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: ORANGE }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* MoMo network */}
              {method === 'momo' && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Select Network</p>
                  <div className="flex gap-2">
                    {['MTN', 'Vodafone', 'AirtelTigo'].map((n) => {
                      const sel = momoNetwork === n;
                      return (
                        <button
                          type="button" key={n}
                          onClick={() => setMomoNetwork(n)}
                          className="flex-1 py-2 rounded-lg border-2 text-xs font-bold transition-all"
                          style={{ borderColor: sel ? ORANGE : '#d1d5db', background: sel ? 'rgba(240,86,45,0.1)' : '#f9fafb', color: sel ? ORANGE : '#6b7280' }}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: ORANGE }}>Donor Information</h3>
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox" checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ accentColor: ORANGE }}
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-800">Donate anonymously</span>
                  <span className="block text-xs text-gray-500">Your name will not be displayed publicly</span>
                </span>
              </label>
              <div className="space-y-3">
                {!anonymous && (
                  <input
                    required={!anonymous} placeholder="Full Name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-orange-400"
                  />
                )}
                <input
                  required type="email" placeholder="Email Address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-orange-400"
                />
                {method === 'momo' && (
                  <input
                    required placeholder="Mobile Money Number (e.g. 0241234567)" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-orange-400"
                  />
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: ORANGE }}>Terms &amp; Agreement</h3>
              <div className="bg-gray-50 rounded-xl p-3 mb-3 text-xs text-gray-600 space-y-1 leading-relaxed">
                <p>• Your donation goes directly to support {config.orgName}</p>
                <p>• Donations are processed securely via Paystack</p>
                <p>• You will receive an email receipt</p>
                <p>• Monthly donations can be cancelled anytime</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ accentColor: ORANGE }}
                />
                <span className="text-xs text-gray-600">
                  I agree to the donation{' '}
                  <a href="/terms" target="_blank" className="underline" style={{ color: ORANGE }}>terms and conditions</a>
                </span>
              </label>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          {/* Sticky donate button — matches app bottom bar */}
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            {method === 'paypal' ? (
              <div>
                {!selAmt || Number(selAmt) <= 0 ? (
                  <p className="text-center text-sm text-gray-400 py-2">Enter an amount above to see PayPal options</p>
                ) : !email || (!anonymous && !name) || !agreeToTerms ? (
                  <p className="text-center text-sm text-gray-400 py-2">Complete the form above to continue with PayPal</p>
                ) : (
                  <div ref={paypalContainerRef} className="min-h-[52px]" />
                )}
              </div>
            ) : (
            <button
              type="submit"
              disabled={!isValid() || processing}
              className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: ORANGE }}
            >
              <span>♥</span>
              <span>
                {processing
                  ? 'Processing...'
                  : display
                    ? `Donate ${display}${frequency === 'monthly' ? ' /month' : ''}`
                    : 'Donate Now'}
              </span>
            </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateModal;

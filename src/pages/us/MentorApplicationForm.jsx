import React, { useState } from 'react';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, US_CONTACT } from '../../config/usContent';

// Online mentor application for SheBelongs.
// Writes one row to public.mentor_applications with the publishable key.
// The database only accepts complete website applications from the public key
// and does not allow the public to read them.

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  county: '',
  age21: false,
  availability: 'Weekdays',
  canCommitOneYear: false,
  experience: '',
  motivation: '',
  referenceName: '',
  referenceContact: '',
  agreeBackground: false,
  agreeConduct: false,
};

const input =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300';
const label = 'block text-sm font-semibold text-gray-800 mb-1';

const MentorApplicationForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const configured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.age21 || !form.agreeBackground || !form.agreeConduct) {
      setErrorMsg('Please confirm the age, background check and code of conduct boxes to apply.');
      return;
    }
    if (!configured) {
      setErrorMsg(`The online form is not connected yet. Please email ${US_CONTACT.email} to apply.`);
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/mentor_applications`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          source: 'website',
          status: 'submitted',
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          city: form.city.trim() || null,
          county: form.county.trim() || null,
          age_21_plus: form.age21,
          availability: form.availability,
          can_commit_one_year: form.canCommitOneYear,
          experience: form.experience.trim() || null,
          motivation: form.motivation.trim() || null,
          reference_name: form.referenceName.trim() || null,
          reference_contact: form.referenceContact.trim() || null,
          agreed_background_check: form.agreeBackground,
          agreed_code_of_conduct: form.agreeConduct,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('done');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setErrorMsg(`Something went wrong and your application was not sent (${err.message}). Please try again or email ${US_CONTACT.email}.`);
    }
  };

  if (status === 'done') {
    return (
      <div id="apply" className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-serif text-gray-900 mb-3">Thank you for applying</h2>
        <p className="text-gray-700 text-lg">
          Your application has been received. The program coordinator will contact you to schedule an interview.
        </p>
      </div>
    );
  }

  return (
    <form id="apply" onSubmit={submit} className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-gray-900 mb-2">Apply to be a mentor</h2>
        <p className="text-gray-600">This is your interest form too. It takes about ten minutes. Fields marked * are required.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="fullName">Full name *</label>
          <input id="fullName" required className={input} value={form.fullName} onChange={set('fullName')} />
        </div>
        <div>
          <label className={label} htmlFor="email">Email *</label>
          <input id="email" type="email" required className={input} value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone</label>
          <input id="phone" type="tel" className={input} value={form.phone} onChange={set('phone')} />
        </div>
        <div>
          <label className={label} htmlFor="city">City *</label>
          <input id="city" required className={input} value={form.city} onChange={set('city')} />
        </div>
        <div>
          <label className={label} htmlFor="county">County *</label>
          <select id="county" required className={input} value={form.county} onChange={set('county')}>
            <option value="">Choose a county</option>
            <option>Franklin</option>
            <option>Fairfield</option>
            <option>Licking</option>
            <option>Delaware</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="availability">Usual availability</label>
          <select id="availability" className={input} value={form.availability} onChange={set('availability')}>
            <option>Weekdays</option>
            <option>Weekends</option>
            <option>Evenings</option>
            <option>Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="experience">Experience with teenagers, mentoring or teaching</label>
        <textarea id="experience" rows={3} className={input} value={form.experience} onChange={set('experience')} />
      </div>
      <div>
        <label className={label} htmlFor="motivation">Why do you want to walk beside a girl?</label>
        <textarea id="motivation" rows={3} className={input} value={form.motivation} onChange={set('motivation')} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="referenceName">Reference name</label>
          <input id="referenceName" className={input} value={form.referenceName} onChange={set('referenceName')} />
        </div>
        <div>
          <label className={label} htmlFor="referenceContact">Reference email or phone</label>
          <input id="referenceContact" className={input} value={form.referenceContact} onChange={set('referenceContact')} />
        </div>
      </div>

      <div className="space-y-3 text-gray-800">
        <label className="flex gap-3 items-start">
          <input type="checkbox" className="mt-1" checked={form.age21} onChange={set('age21')} />
          <span>I am 21 or older and live in or near Franklin, Fairfield, Licking or Delaware County, Ohio. *</span>
        </label>
        <label className="flex gap-3 items-start">
          <input type="checkbox" className="mt-1" checked={form.canCommitOneYear} onChange={set('canCommitOneYear')} />
          <span>I can commit to at least one school year, with about three contacts a month.</span>
        </label>
        <label className="flex gap-3 items-start">
          <input type="checkbox" className="mt-1" checked={form.agreeBackground} onChange={set('agreeBackground')} />
          <span>I agree to a background check, which Beacon will guide me through. *</span>
        </label>
        <label className="flex gap-3 items-start">
          <input type="checkbox" className="mt-1" checked={form.agreeConduct} onChange={set('agreeConduct')} />
          <span>I agree to the Child Protection Policy, Code of Conduct and Confidentiality Policy. *</span>
        </label>
      </div>

      {errorMsg && <p className="text-red-700 bg-red-50 rounded-lg p-3">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-orange-600 text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Submit application'}
      </button>
    </form>
  );
};

export default MentorApplicationForm;

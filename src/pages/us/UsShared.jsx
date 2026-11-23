import React from 'react';
import { Link } from 'react-router-dom';
import URLS from '../../config/urls.config';
import { MENTOR_APPLICATION_URL, MENTOR_PAPER_FORM_URL } from '../../config/usContent';

const primaryBtn =
  'bg-orange-600 text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 inline-block text-center';
const secondaryBtn =
  'bg-gray-100 text-gray-800 font-semibold py-3 px-7 rounded-full hover:bg-gray-200 transition-colors duration-300 inline-block text-center';

// Primary "Apply to be a mentor" button. Uses the online form when the link is set,
// otherwise falls back to an email to the program inbox.
export const ApplyButton = ({ label = 'Apply to be a mentor', className = primaryBtn }) => {
  if (MENTOR_APPLICATION_URL) {
    return (
      <a href={MENTOR_APPLICATION_URL} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  // Online form lives on the Become a Mentor page.
  return (
    <a href="/become-a-mentor#apply" className={className}>
      {label}
    </a>
  );
};

// Paper option. Shown only when the printable Google Doc link is set.
export const PaperFormLink = () => {
  if (!MENTOR_PAPER_FORM_URL) return null;
  return (
    <p className="text-gray-600 mt-4">
      Prefer paper?{' '}
      <a href={MENTOR_PAPER_FORM_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600">
        Open the printable application form
      </a>{' '}
      and return it to the program coordinator.
    </p>
  );
};

export const ContactButton = ({ label = 'Request a conversation', className = secondaryBtn }) => (
  <Link to={URLS.CONTACT} className={className}>
    {label}
  </Link>
);

export const btnStyles = { primaryBtn, secondaryBtn };

// Shared "Our vision" block: future focus areas, labelled honestly.
export const VisionCards = ({ areas }) => (
  <div className="grid sm:grid-cols-2 gap-6">
    {areas.map((a) => (
      <div key={a.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-2">{a.status}</p>
        <h3 className="text-xl font-serif text-gray-900 mb-2">{a.title}</h3>
        <p className="text-gray-700">{a.text}</p>
      </div>
    ))}
  </div>
);

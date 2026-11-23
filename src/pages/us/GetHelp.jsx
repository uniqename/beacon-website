import React from 'react';
import Sectionwraper from '../../main/Sectionwraper';
import Footer from '../../main/Footer';
import { CRISIS_RESOURCES, US_CONTACT } from '../../config/usContent';

// Replaces the old "Emergency SOS" section. Beacon does not run a crisis line or shelter,
// so this page points people to services that do exist.
const GetHelp = () => (
  <>
    <Sectionwraper>
      <section className="pt-32 md:pt-40 pb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">Need help now?</h1>
        <p className="text-lg text-gray-700 mb-8">
          Beacon of New Beginnings is not an emergency or crisis service. If you or someone you know needs help right
          now, please use one of these trusted resources.
        </p>
        <ul className="space-y-4">
          {CRISIS_RESOURCES.map((r) => (
            <li key={r.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="font-semibold text-gray-900">{r.label}</p>
              <a href={r.href} className="text-gray-700 text-lg hover:text-orange-600">
                {r.detail}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-lg text-gray-700 mt-10">
          To reach Beacon about our programs, call{' '}
          <a href={`tel:${US_CONTACT.phone.replace(/[^+\d]/g, '')}`} className="underline hover:text-orange-600">
            {US_CONTACT.phone}
          </a>{' '}
          or{' '}
          <a href={`mailto:${US_CONTACT.email}`} className="underline hover:text-orange-600">
            email us
          </a>
          .
        </p>
      </section>
    </Sectionwraper>
    <Footer />
  </>
);

export default GetHelp;

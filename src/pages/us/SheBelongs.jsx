import React from 'react';
import Sectionwraper from '../../main/Sectionwraper';
import Footer from '../../main/Footer';
import { PROGRAM } from '../../config/usContent';
import { ApplyButton, ContactButton, btnStyles } from './UsShared';

const SheBelongs = () => (
  <>
    <Sectionwraper>
      <section className="pt-32 md:pt-40 pb-16 text-center">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-3">{PROGRAM.name}</p>
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">
          No girl should walk alone into a new country.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          A free, long term mentoring program for newly arrived immigrant girls in grades 6 to 12, from Beacon of
          New Beginnings and Faith Klinik Ministries.
        </p>
        <p className="italic text-gray-700 max-w-2xl mx-auto mb-10">{PROGRAM.tagline}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <ApplyButton className={btnStyles.primaryBtn} label="Become a Mentor" />
          <ContactButton label="Partner With Us" />
        </div>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">What it is</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Moving to a new country is a big change. A girl may be learning a new language, a new school and a new
          way of life, often while her parents work long hours and settle in themselves. {PROGRAM.name} pairs her
          with a caring woman mentor who has walked a similar road. Each mentor builds a one to one relationship
          with a girl, with her family's blessing and her school's support.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Who it is for</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Girls in grades 6 to 12 who recently arrived in the United States, from Ghana and from every other country.
          Girls are referred by their schools or families. We never ask about immigration status.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">What mentors do</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg">
          <li>Share meals, outings and everyday life skills.</li>
          <li>Practice English together.</li>
          <li>Help with school and introduce the community.</li>
          <li>Share their own stories of adjusting.</li>
          <li>Help her see a future that includes college and career.</li>
          <li>Stay with her for as long as the mentor's strength allows, hoping to walk with her through high school and beyond.</li>
        </ul>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Working with families and schools</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Parents and guardians stay in charge. Mentors never replace or overstep them. Every activity is approved in
          writing by the family, and the program works hand in hand with the girl's school.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">How we keep girls safe</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Every mentor completes an application with a reference, an interview, a background check and online training
          before meeting a girl, and signs a code of conduct. Meetings take place in open settings, with a parent or
          another approved adult present. We follow all child protection reporting requirements. We never share a
          girl's story or photo without written permission.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Where we are starting</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We are launching with a first group of mentors across Franklin, Fairfield, Licking and Delaware Counties in
          Ohio, and will grow carefully as more mentors are screened and trained.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Faith and inclusion</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Beacon and Faith Klinik Ministries are faith-based organizations. Faith is an open invitation and never a
          condition. Girls and families of every faith, or none, are welcome.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">How you can help</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg mb-6">
          <li>Become a mentor.</li>
          <li>Connect us with a school or community partner.</li>
          <li>Give, to fund screening, training, welcome kits and monthly gatherings.</li>
        </ul>
        <div className="flex flex-wrap gap-4">
          <ApplyButton className={btnStyles.primaryBtn} label="Become a Mentor" />
          <ContactButton label="Partner With Us" />
        </div>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto text-gray-700 text-lg">
        <p>
          <span className="font-semibold">Contact:</span> Enam, Program Coordinator, Beacon of New Beginnings.{' '}
          <a href="mailto:info@beaconnewbeginnings.org" className="underline hover:text-orange-600">
            info@beaconnewbeginnings.org
          </a>
        </p>
      </section>
    </Sectionwraper>
    <Footer />
  </>
);

export default SheBelongs;

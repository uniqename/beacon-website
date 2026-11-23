import React from 'react';
import Sectionwraper from '../../main/Sectionwraper';
import Footer from '../../main/Footer';
import { MENTOR_FAQ, SHEBELONGS_STEPS, PROGRAM } from '../../config/usContent';
import { ApplyButton, PaperFormLink, btnStyles } from './UsShared';
import MentorApplicationForm from './MentorApplicationForm';

const BecomeMentor = () => (
  <>
    <Sectionwraper>
      <section className="pt-32 md:pt-40 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">
          Walk beside a girl who is new here.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          You know what it is to start over. A girl in central Ohio needs someone who does.
        </p>
        <ApplyButton className={btnStyles.primaryBtn} label="Apply to Be a Mentor" />
        <PaperFormLink />
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Who we are looking for</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg">
          <li>Women aged 21 or older who live in or near Franklin, Fairfield, Licking or Delaware County, Ohio.</li>
          <li>Women who can commit to at least one school year, hoping for two, with about three contacts a month (visits, calls or outings).</li>
          <li>Patient, reliable, respectful listeners who are comfortable working with teenage girls and their families.</li>
          <li>You do not need to be an immigrant, a teacher or a counselor. Many of our first mentors have their own experience of adjusting to life in the United States, and that is a gift.</li>
        </ul>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">What you will do</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Be one steady, caring adult for one girl, with a backup mentor beside you. Spend time together, practice
          English, help with school, share what you have learned, and help her see her future. You work with her
          family and her school, never around them.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Five steps to become a mentor</h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 text-lg">
          {SHEBELONGS_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="text-gray-700 text-lg mt-4">Only after all five steps are you matched with a girl.</p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">How you are supported</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          A program coordinator and a Faith Klinik liaison, a backup mentor, monthly mentor gatherings, ongoing
          training, and a secure app for your notes and reminders.
        </p>
      </section>

      <section className="py-12 border-t-2 border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Frequently asked questions</h2>
        <div className="space-y-6">
          {MENTOR_FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.q}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto">
        <MentorApplicationForm />
        <PaperFormLink />
      </section>

      <section className="py-16 text-center">
        <p className="text-2xl font-serif text-gray-900 mb-6">Welcome. You belong. We are with you.</p>
        <ApplyButton className={btnStyles.primaryBtn} label={`Apply for ${PROGRAM.name}`} />
      </section>
    </Sectionwraper>
    <Footer />
  </>
);

export default BecomeMentor;

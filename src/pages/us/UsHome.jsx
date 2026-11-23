import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sectionwraper from '../../main/Sectionwraper';
import Footer from '../../main/Footer';
import DonateModal from '../../components/DonateModal';
import URLS from '../../config/urls.config';
import { PROGRAM, VISION_AREAS } from '../../config/usContent';
import { ApplyButton, ContactButton, VisionCards, btnStyles } from './UsShared';

const UsHome = () => {
  const [showDonate, setShowDonate] = useState(false);
  return (
    <>
      <Sectionwraper>
        {/* Headline */}
        <section className="bg-gray-50 py-16 md:pb-24 md:pt-40">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 leading-tight mb-6">
              Healing, hope and belonging, beginning in Ohio
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Beacon of New Beginnings is a faith-based nonprofit launching its first US program in
              central Ohio, with a vision to grow into a national network of care for girls, women and
              families starting over.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <ApplyButton className={btnStyles.primaryBtn} label="Become a Mentor" />
              <button
                onClick={() => setShowDonate(true)}
                className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-700 transition-colors duration-300 text-lg"
              >
                Donate
              </button>
              <ContactButton label="Volunteer" />
            </div>
          </div>
        </section>

        {/* Our first US program */}
        <section className="md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left max-w-lg md:max-w-none mx-auto md:mx-0">
              <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Our First US Program</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                Welcoming newcomer girls
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8">
                Our {PROGRAM.name} mentorship program pairs newly arrived girls in grades 6 to 12 with caring
                women mentors, working with their families and schools, so no girl walks alone into a new
                country.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link to={URLS.SHEBELONGS} className={btnStyles.primaryBtn}>
                  Learn more
                </Link>
                <ApplyButton label="Become a mentor" className="text-gray-700 hover:text-orange-600 font-medium" />
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-16 md:py-24 border-t-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Our Vision</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight mb-4">Where we are going</h2>
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-3xl">
            We are building step by step. {PROGRAM.name} is our first program. As we grow, we hope to offer more
            ways to walk with people starting over.
          </p>
          <VisionCards areas={VISION_AREAS} />
        </section>

        {/* Partner */}
        <section className="py-16 md:py-24 border-t-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Partner With Us</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight mb-6">
            Schools, churches and community partners
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl">
            We would love to work with you. Our first program is built around what schools and families need,
            with their approval at every step.
          </p>
          <ContactButton />
        </section>
      </Sectionwraper>

      <Footer />
      {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}
    </>
  );
};

export default UsHome;

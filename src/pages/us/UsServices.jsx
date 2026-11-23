import React from 'react';
import Sectionwraper from '../../main/Sectionwraper';
import Footer from '../../main/Footer';
import URLS from '../../config/urls.config';
import { Link } from 'react-router-dom';
import { PROGRAM, VISION_AREAS } from '../../config/usContent';
import { VisionCards, btnStyles } from './UsShared';

// US services page: our one current program, then the vision areas labelled as future work.
const UsServices = () => (
  <>
    <Sectionwraper>
      <section className="pt-32 md:pt-40 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">Our Program and Vision</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          We are building carefully. Today we run one program in central Ohio, and we hope to grow from there.
        </p>
      </section>

      <section className="pb-16">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">Current program</p>
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-serif text-gray-900 mb-3">{PROGRAM.name}</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            A free, long term mentoring program that pairs newly arrived immigrant girls in grades 6 to 12 with caring
            women mentors, working with their families and schools. {PROGRAM.tagline}
          </p>
          <Link to={URLS.SHEBELONGS} className={btnStyles.primaryBtn}>
            Learn more
          </Link>
        </div>
      </section>

      <section className="pb-24">
        <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Our vision</p>
        <h2 className="text-3xl font-serif text-gray-900 mb-8">Future focus areas</h2>
        <VisionCards areas={VISION_AREAS} />
      </section>
    </Sectionwraper>
    <Footer />
  </>
);

export default UsServices;

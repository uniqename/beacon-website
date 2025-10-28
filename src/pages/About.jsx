import React from 'react';
import Footer2 from '../main/Footer2';
import URLS from '../config/urls.config';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <>
       
            <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 '>
                {/* === WHO ARE WE === */}
                <section className="py-16 text-gray-800 font-serif">
                    <div>
                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl text-center font-semibold my-10">
                            Who Are we?
                        </h2>

                        {/* Description */}
                        <p className="text-gray-700 text-center max-w-2xl mx-auto leading-relaxed text-base md:text-lg mb-16">
                            Beacon of New Beginnings is a Ghana-based non-profit organization dedicated
                            to supporting survivors of abuse and exploitation. We provide holistic recovery
                            services that restore safety, dignity, and independence for women and children
                            who have experienced trauma. Through our integrated approach, we help survivors
                            rebuild their lives and reintegrate into society with confidence.
                        </p>

                        {/* Subheading */}
                        <h3 className="text-2xl md:text-3xl text-orange-600 text-center font-semibold mb-6 mt-20 md:mt-40">
                            Our Story
                        </h3>

                        {/* Story Content */}
                        <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed  text-center md:text-left sm:px-0">
                            <p className='px-0 md:px-28'>
                                Beacon of New Beginnings was founded on a simple yet powerful belief:
                                every survivor deserves a chance to reclaim their life, rebuild their dignity,
                                and rediscover their strength. In Ghana, countless individuals face the devastating
                                aftermath of trauma, abuse, and violence, often with nowhere to turn and no one to walk
                                alongside them on their journey to healing.
                            </p>

                            <p className='px-0 md:px-28'>
                                We started this work because we saw the gaps in support systems and the silence surrounding
                                survivors' struggles. We witnessed the courage it takes to seek help and the transformation
                                that happens when compassion meets action. Today, we stand as a beacon of hope, offering
                                comprehensive support that addresses not just immediate needs, but the long-term healing
                                and empowerment every survivor deserves.
                            </p>
                        </div>
                    </div>
                </section>

                {/* === EMERGENCY SOS SECTION === */}
               

                {/* === IMAGES SECTION === */}
                <section className="">
                    {/* Row 1 */}
                    <div className="flex flex-col md:flex-row w-full h-auto md:h-[550px]">
                        <img
                            src="/images/about1.png"
                            alt="About"
                            className="rounded-tl-2xl rounded-bl-2xl w-full md:w-1/2 h-64 md:h-auto object-cover"
                        />
                        <img
                            src="/images/about2.png"
                            alt="About"
                            className="rounded-tr-2xl rounded-br-2xl w-full md:w-1/2 h-64 md:h-auto object-cover"
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-col md:flex-row w-full h-auto md:h-[550px] mt-10 md:mt-20">
                        <img
                            src="/images/about3.png"
                            alt="About"
                            className="rounded-tl-2xl rounded-bl-2xl w-full md:w-1/2 h-64 md:h-auto object-cover"
                        />
                        <img
                            src="/images/about4.png"
                            alt="About"
                            className="rounded-tr-2xl rounded-br-2xl w-full md:w-1/2 h-64 md:h-auto object-cover"
                        />
                    </div>
                </section>

                {/* === FAQ SECTION === */}
                <section className="py-16 md:py-36">
                    <div className="container mx-auto">
                        {/* Main Heading and Subtitle */}
                        <div className="mb-12 md:mb-16 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                                Questions
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
                                Learn more about our mission and how we support survivors in Ghana
                            </p>
                        </div>

                        {/* FAQ Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center md:text-left gap-8 mb-16">
                            {/* Question 1 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    What services do you provide?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We offer comprehensive support including safe shelter, counseling,
                                    legal assistance, and economic empowerment programs. Our holistic
                                    approach addresses immediate safety and long-term recovery.
                                </p>
                            </div>

                            {/* Question 2 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    How can I help?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    You can support our mission through donations, volunteering, or
                                    spreading awareness. Every contribution helps survivors rebuild
                                    their lives with dignity and hope.
                                </p>
                            </div>

                            {/* Question 3 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    Are donations tax-deductible?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We are a registered nonprofit organization. All donations are
                                    tax-deductible and directly support our programs for survivors in
                                    Ghana.
                                </p>
                            </div>

                            {/* Question 4 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    Who do you help?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We support survivors of abuse and homelessness in Ghana, focusing
                                    on women and children who have experienced trauma and need
                                    comprehensive support.
                                </p>
                            </div>

                            {/* Question 5 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    How do you ensure survivor privacy?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Survivor confidentiality is our highest priority. We implement
                                    strict protocols to protect identities and personal information
                                    throughout our support process.
                                </p>
                            </div>

                            {/* Question 6 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    Can I volunteer?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We welcome volunteers with skills in counseling, legal support,
                                    fundraising, and community outreach. Background checks and
                                    training are required.
                                </p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-12 text-center md:text-left">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                Need more information?
                            </h3>
                            <p className="text-lg text-gray-700 mb-6 max-w-lg mx-auto md:mx-0">
                                Our team is ready to answer any additional questions you might have.
                            </p>
                            <Link
                        to={URLS.CONTACT}
                        className="bg-orange-600 text-white cursor-pointer font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                      >
                        Contact us
                      </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer2/>
        </>
    );
};

export default About;

import React from 'react'
import Footer2 from '../main/Footer2'
import URLS from '../config/urls.config';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <>

      <div className=''>
        <section className="py-16 md:py-24 ">
          <div className="">
            {/* Section Heading and Subtitle */}
            <div className="text-center mb-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ">
              <h2 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">
                Our Services and <br /> Programs
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                We provide integrated recovery and empowerment programs that support
                survivors on their path to safety, healing, and independence.
              </p>
            </div>

            <section className='bg-gray-100 py-20'>
              <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 '>
                {/* Featured Service Block */}
                <div className=" rounded-lg shadow-sm border bg-white border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Image */}
                  <div className="order-2 lg:order-1">
                    <img
                      src="/images/service1.png" // Placeholder image URL
                      alt="Adult and children building something together"
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="order-1 lg:order-2 text-center p-6 lg:text-left">
                    <h3 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight mb-6">
                      Building new paths for <br className="hidden sm:inline" />{' '}
                      survivors
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                      We provide safe and secure temporary housing for survivors and
                      their children. Each space is designed to offer comfort, dignity,
                      and a sense of belonging as they begin to rebuild their lives.
                    </p>
                    <div className="flex justify-center lg:justify-start space-x-6">
                      <Link
                        to={URLS.CONTACT}
                        className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                      >
                        Contact us
                      </Link>
                      <a
                        href="#"
                        className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                      >
                        Donate
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>


                {/* 2 */}
                <div className=" rounded-lg shadow-sm border mt-16 bg-white border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Text Content */}
                  <div className="text-center p-10 lg:text-left">
                    <h3 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight mb-6">
                      Counseling and Emotional  <br className="hidden sm:inline" />{' '}
                      Recovery
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                      Our trained counselors provide trauma-informed therapy and emotional support to help survivors process their experiences and regain inner strength.
                    </p>
                    <div className="flex justify-center lg:justify-start space-x-6">
                      <Link
                        to={URLS.CONTACT}
                        className="bg-orange-600 text-white cursor-pointer font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                      >
                        Contact us
                      </Link>
                      <a
                        href="#"
                        className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                      >
                        Donate
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="">
                    <img
                      src="/images/service2.png" // Placeholder image URL
                      alt="Adult and children building something together"
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                </div>

                {/* 3 */}
                <div className=" rounded-lg shadow-sm border mt-16 bg-white border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Image */}
                  <div className="order-2 lg:order-1">
                    <img
                      src="/images/service3.png" // Placeholder image URL
                      alt="Adult and children building something together"
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="order-1 lg:order-2 text-center p-6 lg:text-left">
                    <h3 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight mb-6">
                      Legal and Advocacy Support
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                      We connect survivors with legal professionals and social workers who help them seek justice, understand their rights, and navigate legal processes with confidence.
                    </p>
                    <div className="flex justify-center lg:justify-start space-x-6">
                      <Link
                        to={URLS.CONTACT}
                        className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                      >
                        Contact us
                      </Link>
                      <a
                        href="#"
                        className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                      >
                        Donate
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4 */}
                <div className=" rounded-lg shadow-sm border mt-16 bg-white border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Text Content */}
                  <div className="text-center p-10 lg:text-left">
                    <h3 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight mb-6">
                      Livelihood and Empowerment   <br className="hidden sm:inline" />{' '}
                      Programs
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                      We offer skill-building workshops and economic empowerment initiatives that help survivors achieve independence and create sustainable sources of income.
                    </p>
                    <div className="flex justify-center lg:justify-start space-x-6">
                      <Link
                        to={URLS.CONTACT}
                        className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                      >
                        Contact us
                      </Link>
                      <a
                        href="#"
                        className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                      >
                        Donate
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="">
                    <img
                      src="/images/service4.png" // Placeholder image URL
                      alt="Adult and children building something together"
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
      <Footer2/>
    </>
  )
}

export default Services

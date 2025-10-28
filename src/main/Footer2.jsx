import React from 'react';
import { FaFacebookF, FaInstagramSquare, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import URLS from '../config/urls.config';

const Footer2 = () => {
    return (
        <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 '>
            <footer className="pt-16 pb-8 font-sans bg-white">
                <div className="container mx-auto">
                    {/* Main Footer Grid */}
                    <div className="bg-gray-200 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
                        {/* Column 1: Logo & Newsletter */}
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            {/* Logo */}
                            <Link to={URLS.HOME} className="flex items-center justify-center sm:justify-start mb-3">
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    className="h-16 sm:h-20 w-auto mx-auto sm:mx-0"
                                />
                            </Link>

                            {/* Description */}
                            <p className="text-gray-700 text-sm sm:text-md mb-4 max-w-xs sm:max-w-none">
                                Stay connected with stories of hope and progress
                            </p>

                            {/* Email input + Subscribe button */}
                            <div className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-sm mb-3 gap-2 sm:gap-0">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full sm:flex-grow p-3 rounded-full sm:rounded-l-full sm:rounded-r-none bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-800 text-sm"
                                />
                                <button className="bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full sm:rounded-r-full sm:rounded-l-none hover:bg-gray-300 transition-colors duration-200">
                                    Subscribe
                                </button>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-gray-500 text-xs leading-relaxed max-w-xs sm:max-w-sm">
                                By subscribing, you agree to our{' '}
                                <a href="#" className="underline hover:text-orange-600">
                                    privacy policy
                                </a>{' '}
                                and consent to receive updates.
                            </p>
                        </div>


                        {/* Column 2: Quick Links */}
                        <div className="lg:text-center sm:text-left lg:ml-20">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">Quick Links</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li>
                                    <Link to={URLS.HOME} className="hover:text-orange-600 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to={URLS.SERVICES} className="hover:text-orange-600 transition-colors">
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link to={URLS.ABOUT} className="hover:text-orange-600 transition-colors">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link to={URLS.CONTACT} className="hover:text-orange-600 transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-600 transition-colors">
                                        Donate
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Resources */}
                        <div className="lg:text-center sm:text-left lg:ml-10">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">Resources</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li>
                                    <a href="#" className="hover:text-orange-600 transition-colors">
                                        DOVVSU
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-600 transition-colors">
                                        WILDAF
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-600 transition-colors">
                                        Ministry of Health
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-600 transition-colors">
                                        Emergency: 911
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-600 transition-colors">
                                        Partners
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Connect */}
                        <div className="lg:text-center sm:text-left lg:ml-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">Connect</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center lg:justify-center sm:justify-start hover:text-orange-600 transition-colors"
                                    >
                                        <FaFacebookF className="w-5 h-5 mr-3" />
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center lg:justify-center sm:justify-start hover:text-orange-600 transition-colors"
                                    >
                                        <FaInstagramSquare className="w-5 h-5 mr-3" />
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center lg:justify-center sm:justify-start hover:text-orange-600 transition-colors"
                                    >
                                        <FaXTwitter className="w-5 h-5 mr-3" />
                                        X
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center lg:justify-center sm:justify-start hover:text-orange-600 transition-colors"
                                    >
                                        <FaLinkedinIn className="w-5 h-5 mr-3" />
                                        LinkedIn
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center lg:justify-center sm:justify-start hover:text-orange-600 transition-colors"
                                    >
                                        <FaYoutube className="w-5 h-5 mr-3" />
                                        YouTube
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm border-t border-gray-200 pt-6 text-center sm:text-left">
                        <p className="mb-4 sm:mb-0">
                            &copy; {new Date().getFullYear()} Beacon of New Beginnings
                        </p>
                        {/* <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                            <a href="#" className="hover:text-orange-600 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-orange-600 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-orange-600 transition-colors">
                                Cookies Settings
                            </a>
                        </div> */}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer2;

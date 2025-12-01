import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from '../config/urls.config';
import Sectionwraper from './Sectionwraper';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b-2 border-gray-200 '>
    <Sectionwraper>
      <nav className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to={URLS.HOME} className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Navigation Links (Desktop only) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to={URLS.HOME}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to={URLS.SERVICES}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
              >
                Services
              </Link>
              <Link
                to={URLS.ABOUT}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to={URLS.CONTACT}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
              >
                Get involved
              </Link>
            </div>
          </div>

          {/* Right Section (Buttons + Toggle) */}
          <div className="flex items-center space-x-3">
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to={URLS.CONTACT}
                className=" bg-orange-600 cursor-pointer text-white  font-semibold py-2 px-5 rounded-full hover:bg-gray-200 transition-colors duration-300 inline-block text-center"
              >
                Donate
              </Link>
              <Link
                to={URLS.CONTACT}
                className="bg-gray-100 cursor-pointer text-gray-800 font-semibold py-2 px-5 rounded-full hover:bg-orange-700 transition-colors duration-300 inline-block text-center"
              >
                Volunteer
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3">
            <Link
              to={URLS.HOME}
              className="block text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to={URLS.SERVICES}
              className="block text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              to={URLS.ABOUT}
              className="block text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to={URLS.CONTACT}
              className="block text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              Get involved
            </Link>

            <div className="flex flex-col gap-2 pt-3">
              <button className="bg-gray-100 text-gray-800 font-semibold py-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
                Donate
              </button>
              <button className="bg-orange-600 text-white font-semibold py-2 rounded-full hover:bg-orange-700 transition-colors duration-300">
                Volunteer
              </button>
            </div>
          </div>
        )}
      </nav>
    </Sectionwraper>
    </div>
  );
};

export default Navbar;

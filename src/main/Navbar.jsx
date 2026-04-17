import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from '../config/urls.config';
import Sectionwraper from './Sectionwraper';
import DonateModal from '../components/DonateModal';
import { useRegion } from '../context/RegionContext';
import { allConfigs } from '../config/siteConfig';

const RegionToggle = () => {
  const { regionKey, switchRegion } = useRegion();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors px-2 py-1 rounded-full border border-gray-200 hover:border-orange-300"
      >
        <span>{allConfigs[regionKey].flag}</span>
        <span className="hidden sm:inline">{allConfigs[regionKey].label}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {Object.values(allConfigs).map((cfg) => (
            <button
              key={cfg.key}
              onClick={() => { switchRegion(cfg.key); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-orange-50 transition-colors ${regionKey === cfg.key ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700'}`}
            >
              <span className="text-base">{cfg.flag}</span>
              <span>{cfg.label}</span>
              {regionKey === cfg.key && <span className="ml-auto text-orange-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

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
            <RegionToggle />
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setShowDonate(true)}
                className=" bg-orange-600 cursor-pointer text-white  font-semibold py-2 px-5 rounded-full hover:bg-orange-700 transition-colors duration-300 inline-block text-center"
              >
                Donate
              </button>
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
              <button onClick={() => setShowDonate(true)} className="bg-orange-600 text-white font-semibold py-2 rounded-full hover:bg-orange-700 transition-colors duration-300">
                Donate
              </button>
              <Link to={URLS.CONTACT} className="text-center bg-gray-100 text-gray-800 font-semibold py-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
                Volunteer
              </Link>
            </div>
          </div>
        )}
      </nav>
    </Sectionwraper>
    {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}
    </div>
  );
};

export default Navbar;

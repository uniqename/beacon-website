import React from 'react'
import { FaLeaf, FaUser, FaUsers } from 'react-icons/fa';
import Navbar from '../main/Navbar';
import Footer from '../main/Footer';
import Sectionwraper from '../main/Sectionwraper';
import URLS from '../config/urls.config';
import { Link } from 'react-router-dom';

const Home = () => {
    const items = [
        { icon: <FaUser className="w-5 h-5 text-gray-700" />, text: 'Individual therapy' },
        { icon: <FaUsers className="w-5 h-5 text-gray-700" />, text: 'Group support sessions' },
        { icon: <FaLeaf className="w-5 h-5 text-gray-700" />, text: 'Personal growth' },
    ];
    return (
        <>
            <Sectionwraper>
                <section className="bg-gray-50 py-16 md:pb-24 md:pt-40">
                    <div className="text-center">
                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 leading-tight mb-6">
                            Healing hope for <br /> survivors in Ghana
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            We stand with survivors of abuse and homelessness, offering a beacon
                            of light and support. Our mission is to transform lives through
                            compassionate care and empowerment.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4 mb-16">
                            <button className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-700 transition-colors duration-300 text-lg">
                                Donate
                            </button>
                            <button className="bg-gray-100 cursor-pointer text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors duration-300 text-lg">
                                Volunteer
                            </button>
                        </div>

                        {/* Hero Image */}
                        <div className=" mx-auto rounded-lg overflow-hidden shadow-xl">
                            <img
                                src="/images/hero.png" // Placeholder image URL
                                alt="Three children from Ghana smiling"
                                className="w-full h-[327px] md:h-[700px] object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* section 2 */}
                <section className=" md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content Area */}
                        <div className="text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                            <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                                Safety
                            </p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                                Shelter that restores dignity
                            </h2>
                            <p className="text-base md:text-lg text-gray-600 mb-8">
                                We provide secure and nurturing spaces where survivors can find
                                immediate protection and begin their healing journey. Our shelters
                                offer more than just a roof.
                            </p>
                            <div className="flex items-center space-x-6">
                                <Link
                                    to={URLS.SERVICES}
                                    className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                                >
                                    Learn more
                                </Link>
                                 <Link
                                    to={URLS.CONTACT}
                                    className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                                >
                                    Contact us
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
                                    </Link>
                            </div>
                        </div>

                        {/* Right Image Area */}
                        <div className="relative justify-self-center md:justify-self-end">
                            <img
                                src="/images/home2.png" // Placeholder image URL
                                alt="People embracing on a yellow blanket"
                                className="w-full max-w-md md:max-w-full h-auto rounded-lg object-cover shadow-lg"
                                style={{ aspectRatio: '1/1' }} // To ensure the image maintains a square aspect ratio
                            />
                        </div>
                    </div>
                </section>

                {/* section 3 */}
                <section className=" py-16 md:py-24">

                    <div className="mx-auto grid md:grid-cols-2 gap-12 items-center">

                        {/* left Image Area */}
                        <div className="">
                            <img
                                src="/images/home3.png" // Placeholder image URL
                                alt="People embracing on a yellow blanket"
                                className="w-full max-w-md md:max-w-full h-auto rounded-lg object-cover shadow-lg"
                                style={{ aspectRatio: '1/1' }} // To ensure the image maintains a square aspect ratio
                            />
                        </div>
                        {/* right Content Area */}
                        <div className="text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                            <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                                Healing
                            </p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                                Counseling for emotional recovery
                            </h2>
                            <p className="text-base md:text-lg text-gray-600 mb-4">
                                Our professional counselors provide trauma-informed support to help survivors rebuild their emotional strength and resilience.
                            </p>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={i} className="flex items-center space-x-2 mb-3 text-gray-400">
                                        {item.icon}
                                        <span className="text-[15px] font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-6 mt-6">
                                <Link
                                    to={URLS.SERVICES}
                                    className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                                >
                                    Learn more
                                </Link>
                                <Link
                                    to={URLS.CONTACT}
                                    className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                                >
                                    Contact us
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
                                    </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </Sectionwraper>


            <div className='border-t-2 border-gray-200'>
                <Sectionwraper>
                    <p className='pt-5 font-semibold'><span className='pr-5'>01</span>Legal support</p>
                    {/* section 4 */}
                    <section className=" py-16 md:py-16">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Left Content Area */}
                            <div className="text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                                <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                                    Justice
                                </p>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                                    Empowering survivors through legal advocacy
                                </h2>
                                <p className="text-base md:text-lg text-gray-600 mb-8">
                                    We provide comprehensive legal support to help survivors navigate their rights and seek justice. Our team stands beside them every step of the way.
                                </p>
                                <div className="flex items-center space-x-6">
                                    <Link
                                        to={URLS.SERVICES}
                                        className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                                    >
                                        Learn more
                                    </Link>
                                    <Link
                                    to={URLS.CONTACT}
                                    className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                                >
                                    Contact us
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
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image Area */}
                            <div className="">
                                <img
                                    src="/images/home2.png" // Placeholder image URL
                                    alt="People embracing on a yellow blanket"
                                    className="w-full max-w-md md:max-w-full h-auto rounded-lg object-cover shadow-lg"
                                    style={{ aspectRatio: '1/1' }} // To ensure the image maintains a square aspect ratio
                                />
                            </div>
                        </div>
                    </section>
                </Sectionwraper>
            </div>

            <div className='border-t-2 border-gray-200'>
                <Sectionwraper>
                    <p className='pt-5 font-semibold'><span className='pr-5'>02</span>Livelihood programs</p>
                    {/* section 4 */}
                    <section className=" py-16 md:py-16">
                        <div className=" grid md:grid-cols-2 gap-12 items-center">
                            {/* Left Content Area */}
                            <div className="text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                                <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                                    Empowerment
                                </p>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                                    Building economic independence
                                </h2>
                                <p className="text-base md:text-lg text-gray-600 mb-8">
                                    Our skills training and economic support programs help survivors create sustainable futures and break cycles of vulnerability.
                                </p>
                                <div className="flex items-center space-x-6">
                                    <Link
                                        to={URLS.SERVICES}
                                        className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                                    >
                                        Learn more
                                    </Link>
                                    <Link
                                    to={URLS.CONTACT}
                                    className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                                >
                                    Contact us
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
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image Area */}
                            <div className="">
                                <img
                                    src="/images/home4.png" // Placeholder image URL
                                    alt="People embracing on a yellow blanket"
                                    className="w-full max-w-md md:max-w-full h-auto rounded-lg object-cover shadow-lg"
                                    style={{ aspectRatio: '1/1' }} // To ensure the image maintains a square aspect ratio
                                />
                            </div>
                        </div>
                    </section>
                </Sectionwraper>
            </div>

            <div className='border-t-2 border-gray-200'>
                <Sectionwraper>
                    <p className='pt-5 font-semibold'><span className='pr-5'>03</span>Community support</p>
                    {/* section 4 */}
                    <section className=" py-16 md:py-16">
                        <div className=" grid md:grid-cols-2 gap-12 items-center">
                            {/* Left Content Area */}
                            <div className="text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                                <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                                    Connection
                                </p>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                                    Creating networks of support
                                </h2>
                                <p className="text-base md:text-lg text-gray-600 mb-8">
                                    We build strong community connections that provide ongoing support, reducing isolation and fostering collective healing.
                                </p>
                                <div className="flex items-center space-x-6">
                                    <Link
                                        to={URLS.SERVICES}
                                        className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300 text-md inline-block text-center"
                                    >
                                        Learn more
                                    </Link>
                                    <Link
                                    to={URLS.CONTACT}
                                    className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-md"
                                >
                                    Contact us
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
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image Area */}
                            <div className="">
                                <img
                                    src="/images/home5.png" // Placeholder image URL
                                    alt="People embracing on a yellow blanket"
                                    className="w-full max-w-md md:max-w-full h-auto rounded-lg object-cover shadow-lg"
                                    style={{ aspectRatio: '1/1' }} // To ensure the image maintains a square aspect ratio
                                />
                            </div>
                        </div>
                    </section>
                </Sectionwraper>
            </div>

            <Sectionwraper>
                <section className="md:pb-24 md:pt-40">
                    <div className=" text-center">
                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 leading-tight mb-6">
                            Healing hope for <br /> survivors in Ghana
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            We stand with survivors of abuse and homelessness, offering a beacon
                            of light and support. Our mission is to transform lives through
                            compassionate care and empowerment.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4 mb-16">
                            <button className="bg-orange-600 cursor-pointer text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-700 transition-colors duration-300 text-lg">
                                Donate
                            </button>
                            <button className="bg-gray-100 cursor-pointer text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors duration-300 text-lg">
                                Volunteer
                            </button>
                        </div>

                        {/* Hero Image */}
                        <div className=" mx-auto rounded-lg overflow-hidden shadow-xl">
                            <img
                                src="/images/home6.png" // Placeholder image URL
                                alt="Three children from Ghana smiling"
                                className="w-full h-[200px] lg:h-[700px]  object-cover"
                            />
                        </div>
                    </div>
                </section>
            </Sectionwraper>

            {/* Download App Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
                        Download the app
                    </h2>
                    
                    {/* App Preview Image */}
                    <div className="mb-8 gap-6 flex justify-center">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.beaconghana.supportapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:opacity-90 transition-opacity duration-300"
                        >
                            <img
                                src="https://res.cloudinary.com/djlpb1ld5/image/upload/v1761348798/f68794f88d7a6e7a27d2d7d82e4bd4046ce46ec6_jgwcei.png"
                                alt="App preview showing download options"
                                className="lg:max-w-md  h-auto rounded-lg shadow-lg"
                            />
                        </a>
                   
                        <a
                            href="https://apps.apple.com/us/app/beacon-of-new-beginnings/id6747919151"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:opacity-90 transition-opacity duration-300"
                        >
                            <img
                                src="https://res.cloudinary.com/djlpb1ld5/image/upload/v1761348789/a39a3d4506b7bd04e7cca870620f49a9d54c2175_svk5gn.png"
                                alt="App preview showing download options"
                                className="lg:max-w-md h-auto rounded-lg shadow-lg"
                            />
                        </a>
                       
                    </div>
                </div>
            </div>

            <section className="py-16 md:py-24 bg-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <div className="flex text-center items-center justify-center mb-4">
                                <h2 className="text-3xl text-center md:text-4xl font-bold text-gray-900 mr-3">
                                    Emergency SOS
                                </h2>
                        <img
                      
                            src="https://res.cloudinary.com/djlpb1ld5/image/upload/v1761399069/Group_b4m7z1.png"
                            alt="Emergency SOS - Call Police, Crisis Hotline, Safe Shelter, Anonymous Support"
                            className="w-[40px] h-auto rounded-lg shadow-lg"
                        />
                   
               
                            </div>
                        </div>

                        {/* Emergency Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Call Police Now */}
                            <Link
                                to={URLS.CONTACT}
                                className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 block cursor-pointer"
                            >
                                <h3 className="lg:text-lg text-md font-semibold text-gray-900 mb-4">
                                    Call Police Now!
                                </h3>
                                <div className="mb-4">
                                    <svg className="lg:w-12 lg:h-12 h-6 w-6 mx-auto text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="lg:text-2xl text-sm font-bold text-black ">
                                    911
                                </div>
                            </Link>

                            {/* Crisis Hotline */}
                            <Link
                                to={URLS.CONTACT}
                                className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 block cursor-pointer"
                            >
                                <h3 className="lg:text-lg text-md font-semibold text-gray-900 mb-4">
                                    Crisis Hotline
                                </h3>
                                <div className="mb-4">
                                    <svg className="lg:w-12 lg:h-12 h-6 w-6 mx-auto text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="lg:text-lg text-sm font-bold text-black">
                                    +233 50 123 4567
                                </div>
                            </Link>

                            {/* Safe Shelter */}
                            <Link
                                to={URLS.CONTACT}
                                className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 block cursor-pointer"
                            >
                                <h3 className="lg:text-lg text-md font-semibold text-gray-900 mb-4">
                                    Safe Shelter
                                </h3>
                                <div className="mb-4">
                                    <svg className="lg:w-12 lg:h-12 h-6 w-6 mx-auto text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <p className="lg:text-lg text-sm text-gray-700">
                                    Call for immediate placement
                                </p>
                            </Link>

                            {/* Anonymous Support */}
                            <Link
                                to={URLS.CONTACT}
                                className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 block cursor-pointer"
                            >
                                <h3 className="lg:text-lg text-md font-semibold text-gray-900 mb-4">
                                    Anonymous Support
                                </h3>
                                <div className="mb-4">
                                    <svg className="lg:w-12 lg:h-12 h-6 w-6 mx-auto text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="lg:text-lg text-sm text-gray-700">
                                    Get help while protecting your privacy
                                </p>
                            </Link>
                        </div>

                        {/* Additional Emergency Info */}
                        <div className="mt-12 text-center">
                            <p className="text-gray-600 text-lg">
                                If you're in immediate danger, don't wait. Call emergency services now.
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                All calls are confidential and free of charge.
                            </p>
                        </div>
                    </div>
                </section> 

        

            <Footer/>
        </>
    );
};

export default Home

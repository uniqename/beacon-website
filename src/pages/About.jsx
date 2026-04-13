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

                {/* === BOARD OF DIRECTORS SECTION === */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
                            Board of Directors
                        </h2>

                        {/* Board Members Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            {/* Chairperson */}
                            <div className="flex flex-col items-center md:items-start">
                                <img
                                    src="/images/EAdarquah.jpg"
                                    alt="Ebenezer Adarquah"
                                    className="w-64 h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-1">Chairperson</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">Ebenezer Adarquah</h4>
                                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                                    Rev. Ebenezer Adarquah is a devoted pastor and community leader whose ministry is grounded in compassion, service, and the belief that everyone deserves safety and dignity. With years of pastoral experience, he has walked alongside individuals and families through hardship, healing, and restoration. Beyond the church, Rev. Adarquah champions justice and empowerment for vulnerable communities. As a board member of Beacon of New Beginnings, he supports initiatives that help women and families in Ghana transition from abusive situations to lives of hope, stability, and purpose. Grounded in faith and guided by empathy, he brings both spiritual insight and practical leadership to advancing the organization's mission of healing, growth, and empowerment.
                                </p>
                            </div>

                            {/* Vice Chair */}
                            <div className="flex flex-col items-center md:items-start">
                                <img
                                    src="/images/EPetra.jpg"
                                    alt="Ed Petra"
                                    className="w-64 h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-1">Vice Chair</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">Ed Petra</h4>
                                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                                    Ed-Petra Adarquah is an Associate Attorney specializing in employment law, with a deep commitment to justice and community advocacy. A graduate of Spelman College and the University of Cincinnati College of Law, she brings both legal expertise and compassion to her role as a board member. Ed-Petra focuses on protecting workers' rights and advancing safety, healing, and empowerment for survivors of abuse, homelessness, and trauma. Beyond her professional work, she enjoys exploring new cultures and communities through travel, finding inspiration in diverse experiences. Her dedication to service, combined with her legal background, enables her to contribute meaningfully to Beacon of New Beginnings' mission of transforming lives and building stronger, more resilient communities.
                                </p>
                            </div>

                            {/* Treasurer */}
                            <div className="flex flex-col items-center md:items-start">
                                <img
                                    src="/images/JYiadom2.jpg"
                                    alt="Jedidiah Adarquah-Yiadom"
                                    className="w-64 h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-1">Treasurer</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">Jedidiah Adarquah-Yiadom</h4>
                                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                                    Jedidiah Adarquah-Yiadom is a financial advisor at J.P. Morgan and a lifelong advocate for education and community empowerment. Born in Ghana and a graduate of Cornell University, he has dedicated himself to mentoring youth, guiding students through challenges, and helping them achieve academic and personal success. Today, he combines his expertise in finance with a passion for teaching financial literacy, goal-setting, and long-term stability to individuals and families. Beyond his professional work, Jedidiah is a devoted musician, reader, and fitness enthusiast, bringing creativity, curiosity, and discipline to all he does. As a board member, he supports Beacon of New Beginnings' mission of fostering hope, opportunity, and sustainable growth for vulnerable communities in Ghana.
                                </p>
                            </div>

                            {/* Board Secretary */}
                            <div className="flex flex-col items-center md:items-start">
                                <img
                                    src="/images/EAbadjivor.png"
                                    alt="Enyah Abadjivor"
                                    className="w-64 h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-1">Board Secretary</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">Enyah Abadjivor</h4>
                                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                                    Enyah Abadjivor brings over 15 years of experience in business development, international partnerships, and program management. As the founder of The Volta Co., she helps organizations turn vision into sustainable impact through strategic planning, operational systems, and leadership support. Her background spans nonprofit leadership, entrepreneurship, and corporate strategy, including managing large-scale initiatives across the U.S. and Africa. Enyah specializes in business strategy, operations, hiring, and marketing, guiding startups and nonprofits to build strong foundations, scale intentionally, and achieve measurable results. Her passion for empowering communities and supporting mission-driven enterprises aligns seamlessly with Beacon of New Beginnings' goal of transforming lives and fostering resilience in vulnerable populations.
                                </p>
                            </div>
                        </div>

                        {/* Board Member - Full Width */}
                        <div className="flex flex-col items-center max-w-4xl mx-auto">
                            <img
                                src="/images/FEgyir.jpg"
                                alt="Frederick Egyir"
                                className="w-64 h-64 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-1">Board Member</h3>
                            <h4 className="text-xl font-semibold text-gray-800 mb-3">Frederick Egyir</h4>
                            <p className="text-gray-700 leading-relaxed text-center">
                                Frederick Egyir is a Senior IT Applications Analyst at Siemens Digital Industries Software, bringing over six years of technology and strategic problem-solving experience to his work with the board. Based in Ohio, he specializes in solutions architecture, digital transformation, and quality assurance, helping organizations operate more efficiently. Frederick has collaborated with leading companies such as Siemens, The Wendy's Company, and Huntington National Bank, gaining insights across multiple industries. Committed to community service, he leverages technology to advance social good and empower others. Recognized for his collaborative approach and problem-solving skills, Frederick brings both technical expertise and a genuine passion for nonprofit initiatives, supporting Beacon of New Beginnings' mission to create lasting, positive change for vulnerable communities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* === STAFF SECTION === */}
                <section className="py-16 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
                            Staff
                        </h2>

                        {/* Staff Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Executive Director */}
                            <div className="flex flex-col items-center md:items-start">
                                <img
                                    src="/images/EEgyir.jpg"
                                    alt="Enam Egyir"
                                    className="w-64 h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-1">Executive Director</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">Enam Egyir</h4>
                                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                                    Enam Egyir is a purpose-driven leader dedicated to empowering communities and creating meaningful impact. Guided by faith, resilience, and service, she blends strategic leadership, project management, and community engagement to address critical needs. Enam is spearheading initiatives that connect individuals with trusted services and launching a nonprofit to support survivors of abuse and homelessness. Her approach combines empathy-driven leadership with practical execution, consistently turning vision into measurable outcomes. With experience leading teams and managing complex projects, Enam fosters collaboration and sustainable solutions. Through her work with Beacon of New Beginnings, she remains committed to uplifting communities, bridging gaps, and creating long-term opportunities for growth, healing, and empowerment.
                                </p>
                            </div>

                            {/* Program Assistant Intern */}
                            <div className="flex flex-col items-center md:items-start">
                                <img
                                    src="/images/JAhorlu.jpg"
                                    alt="Jeremiah Ahorlu"
                                    className="w-64 h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-1">Program Assistant Intern</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">Jeremiah Ahorlu</h4>
                                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                                    Jeremiah Ahorlu is a motivated professional with a strong background in project management and user experience, committed to supporting nonprofit missions. A former student of the University of Ghana, he has a proven track record of coordinating teams, managing logistics, and ensuring tasks are completed efficiently. Jeremiah is particularly passionate about organizations dedicated to social causes and strives to apply his skills to build strong foundations and maximize impact. His dedication is driven by a desire to contribute to lasting change in communities, helping organizations create meaningful programs that support vulnerable populations. As a board member of Beacon of New Beginnings, Jeremiah brings reliability, organization, and a heart for service to advance the mission of hope, healing, and empowerment.
                                </p>
                            </div>
                        </div>
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
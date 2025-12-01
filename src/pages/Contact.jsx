import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer2 from '../main/Footer2';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual form submission logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      toast.success('Message sent successfully! We will get back to you soon.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

    } catch (error) {
      // Show error message
      toast.error('Failed to send message. Please try again later.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 '>
        <div className="text-center py-24">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">
            Join Our Mission
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Together, we can create lasting change for survivors across Ghana. Join us in restoring hope, rebuilding lives, and empowering those on their journey to healing.
          </p>
        </div>
      </div>

      <section className="bg-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Section Heading and Description */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-6">
              Why Reach Out to Us?
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              At Beacon of New Beginnings, we are committed to providing
              responsive and compassionate support to everyone we serve. Whether
              you are a survivor seeking help, a donor wishing to contribute, a
              volunteer looking to get involved, or a partner exploring
              collaboration, our team is here to offer guidance and assistance
              every step of the way.
            </p>
          </div>

          {/* Contact Form */}
           <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">

                {/* Name Field */}
                <div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    required
                  />
                </div>

                {/* Phone Field (Optional) */}
                <div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Message"
                    className="w-full p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 cursor-pointer text-white font-semibold py-4 px-8 rounded-lg hover:bg-orange-700 transition-colors duration-300 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Address Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-orange-600 mb-4"
                fill="currentColor"
                viewBox="0 0 384 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
              <p className="text-gray-700">123 Hope Street, East Legon, Accra</p>
            </div>

            {/* Phone Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-orange-600 mb-4"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
              <p className="text-gray-700">(+233) 50 123 4567</p>
            </div>

            {/* Email Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-orange-600 mb-4"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.65-134.587 106.48-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717-.231 80.509-37.199 103.062-54.955 49.529-38.783 82.024-64.395 104.938-82.646V400H48z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">E-mail</h3>
              <p className="text-gray-700">info@beaconnewbeginnings.org</p>
            </div>
          </div>
        </div>
      </section>

      <Footer2 />
      
      {/* Toast Container */}
      <ToastContainer />
    </>
  )
}

export default Contact;


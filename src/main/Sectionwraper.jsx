// src/components/PageWrapper.jsx
import React from "react";

const Sectionwraper = ({ children }) => {
  return <div className="bg-gray-50"><div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ">{children}</div></div>
}

export default Sectionwraper;

import React, { useState } from 'react';
import SignatureModal from '../components/SignatureModal';
import DocConverterModal from '../components/DocConverterModal';

const Tools = () => {
  const [showSignature, setShowSignature] = useState(false);
  const [showConverter, setShowConverter] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Tools</h1>
          <p className="text-gray-500 mb-12">Internal tools for Beacon of New Beginnings staff.</p>

          {/* Document Converter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-start gap-5">
              <div className="bg-orange-100 text-orange-600 rounded-xl p-4 text-3xl">📄</div>
              <div className="flex-1">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Document Converter</h2>
                <p className="text-gray-600 mb-5">
                  Upload any PDF, Word, Excel, CSV, or text file and convert it into an editable, printable HTML document. Edit directly in your browser and save as PDF.
                </p>
                <button
                  onClick={() => setShowConverter(true)}
                  className="bg-orange-600 text-white font-semibold py-3 px-7 rounded-full hover:bg-orange-700 transition-colors duration-300"
                >
                  Upload & Convert
                </button>
              </div>
            </div>
          </div>

          {/* Signature Generator */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start gap-5">
              <div className="bg-gray-100 text-gray-700 rounded-xl p-4 text-3xl">✍️</div>
              <div className="flex-1">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Signature Generator</h2>
                <p className="text-gray-600 mb-5">
                  Select from pre-made digital signatures or draw your own. Generate a signed HTML document ready to print or save as PDF.
                </p>
                <button
                  onClick={() => setShowSignature(true)}
                  className="bg-gray-900 text-white font-semibold py-3 px-7 rounded-full hover:bg-gray-700 transition-colors duration-300"
                >
                  Open Signature Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConverter && <DocConverterModal onClose={() => setShowConverter(false)} />}
      {showSignature && <SignatureModal onClose={() => setShowSignature(false)} />}
    </>
  );
};

export default Tools;

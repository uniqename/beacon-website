import React, { useState } from 'react';
import SignatureModal from '../components/SignatureModal';
import DocConverterModal from '../components/DocConverterModal';

const DOC_CATEGORIES = [
  {
    label: 'Templates',
    icon: '📋',
    docs: [
      { name: 'Letterhead Template', file: 'BNB_Letterhead_Template.html' },
      { name: 'Email Template', file: 'BNB_Email_Template.html' },
      { name: 'Memo Template', file: 'BNB_Memo_Template.html' },
    ],
  },
  {
    label: 'DSW Legal',
    icon: '⚖️',
    docs: [
      { name: 'DSW Letter 1 — Application', file: 'BNB_DSW_Letter1_Application.html' },
      { name: 'DSW Letter 2 — Board Authorisation', file: 'BNB_DSW_Letter2_Board_Authorisation.html' },
    ],
  },
  {
    label: 'MOUs',
    icon: '🤝',
    docs: [
      { name: 'MOU — Agape House Church', file: 'BNB_MOU_AgapeHouseChurch.html' },
      { name: 'MOU — LEKMA Polyclinic', file: 'BNB_MOU_LEKMAPolyclinic.html' },
      { name: 'MOU — Brain & Sleep (BNB)', file: 'BNB_MOU_BrainAndSleep.html' },
      { name: 'MOU — Brain & Sleep (BPG)', file: 'BPG_MOU_BrainAndSleep.html' },
    ],
  },
  {
    label: 'Agreements',
    icon: '📝',
    docs: [
      { name: 'Collab Agreement — LEKMA Polyclinic', file: 'BNB_CollabAgreement_LEKMA.html' },
    ],
  },
  {
    label: 'Referral Documents',
    icon: '🔗',
    docs: [
      { name: 'Referral Form — Brain & Sleep (BNB)', file: 'BNB_ReferralForm_BrainAndSleep.html' },
      { name: 'Referral Pathway — Brain & Sleep (BNB)', file: 'BNB_ReferralPathway_BrainAndSleep.html' },
      { name: 'Referral Pathway — LEKMA (BNB)', file: 'BNB_ReferralPathway_LEKMA.html' },
      { name: 'Referral Form — Brain & Sleep (BPG)', file: 'BPG_ReferralForm_BrainAndSleep.html' },
      { name: 'Referral Pathway — Brain & Sleep (BPG)', file: 'BPG_ReferralPathway_BrainAndSleep.html' },
    ],
  },
  {
    label: 'Pilot Frameworks',
    icon: '🧪',
    docs: [
      { name: 'Pilot Framework — Brain & Sleep (BPG)', file: 'BPG_PilotFramework_BrainAndSleep.html' },
    ],
  },
  {
    label: 'Proposals',
    icon: '📄',
    docs: [
      { name: 'Proposal — Agape House', file: 'BNB_Proposal_AgapeHouse.html' },
      { name: 'Proposal — Brain & Sleep', file: 'BNB_Proposal_BrainAndSleep.html' },
      { name: 'Proposal — Church Partnership', file: 'BNB_Proposal_ChurchPartnership.html' },
      { name: 'Proposal — Clubhouse Ghana', file: 'BNB_Proposal_ClubhouseGhana.html' },
      { name: 'Proposal — ICGC Shalom Temple', file: 'BNB_Proposal_ICGC_ShalomTemple.html' },
      { name: 'Proposal — JAkuBoye Methodist', file: 'BNB_Proposal_JAkuBoye.html' },
      { name: 'Proposal — Jesus Generation Ministry', file: 'BNB_Proposal_JesusGenerationMinistry.html' },
      { name: 'Proposal — LEKMA Polyclinic', file: 'BNB_Proposal_LEKMA.html' },
      { name: 'Proposal — PsyPro Ghana', file: 'BNB_Proposal_PsyProGhana.html' },
      { name: 'Proposal — Psychomatters', file: 'BNB_Proposal_Psychomatters.html' },
    ],
  },
  {
    label: 'Letters',
    icon: '✉️',
    docs: [
      { name: 'Reply Letter — Brain & Sleep (BNB)', file: 'BNB_ReplyLetter_BrainAndSleep.html' },
      { name: 'Reply Letter — Brain & Sleep (BPG)', file: 'BPG_ReplyLetter_BrainAndSleep.html' },
    ],
  },
];

const Tools = () => {
  const [showSignature, setShowSignature] = useState(false);
  const [showConverter, setShowConverter] = useState(false);

  const openDoc = (file) => {
    window.open(`/docs/${file}`, '_blank');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Staff Tools</h1>
          <p className="text-gray-500 mb-12">Internal tools and documents for Beacon of New Beginnings staff.</p>

          {/* Utilities row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Document Converter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 text-orange-600 rounded-xl p-3 text-2xl">📄</div>
                <div className="flex-1">
                  <h2 className="text-lg font-serif font-bold text-gray-900 mb-1">Document Converter</h2>
                  <p className="text-gray-500 text-sm mb-4">Upload any PDF, Word, Excel, CSV, or text file and convert to editable HTML.</p>
                  <button
                    onClick={() => setShowConverter(true)}
                    className="bg-orange-600 text-white text-sm font-semibold py-2 px-5 rounded-full hover:bg-orange-700 transition-colors"
                  >
                    Upload & Convert
                  </button>
                </div>
              </div>
            </div>

            {/* Signature Generator */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 text-gray-700 rounded-xl p-3 text-2xl">✍️</div>
                <div className="flex-1">
                  <h2 className="text-lg font-serif font-bold text-gray-900 mb-1">Signature Generator</h2>
                  <p className="text-gray-500 text-sm mb-4">Select a preset or draw your signature, then apply it to any document.</p>
                  <button
                    onClick={() => setShowSignature(true)}
                    className="bg-gray-900 text-white text-sm font-semibold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Open Signature Tool
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Document Library */}
          <h2 className="text-2xl font-serif text-gray-900 mb-1">Document Library</h2>
          <p className="text-gray-500 mb-8 text-sm">Open any document to edit it in your browser, then print or save as PDF. Use the Signature tool to sign before printing.</p>

          <div className="space-y-8">
            {DOC_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{cat.label}</h3>
                  <span className="text-xs text-gray-400">({cat.docs.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.docs.map((doc) => (
                    <div
                      key={doc.file}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-3 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-gray-400 text-lg flex-shrink-0">🗒️</span>
                        <span className="text-sm font-medium text-gray-800 truncate">{doc.name}</span>
                      </div>
                      <button
                        onClick={() => openDoc(doc.file)}
                        className="flex-shrink-0 bg-orange-50 text-orange-700 text-xs font-semibold py-1.5 px-4 rounded-full hover:bg-orange-100 transition-colors border border-orange-200"
                      >
                        Open & Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showConverter && <DocConverterModal onClose={() => setShowConverter(false)} />}
      {showSignature && <SignatureModal onClose={() => setShowSignature(false)} />}
    </>
  );
};

export default Tools;

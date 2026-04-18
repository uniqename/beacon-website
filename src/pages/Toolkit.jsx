import React, { useState } from 'react';
import Footer2 from '../main/Footer2';
import PasswordGate from '../components/PasswordGate';

// ─── Document data ───────────────────────────────────────────────────────────
// type: 'form' | 'template' | 'guide' | 'doc'
// ready: true = file exists; false = coming soon

const MODULES = [
  {
    id: 'start',
    label: 'Start Here',
    icon: '📖',
    color: 'orange',
    description: 'Read these first — the complete guide and launch roadmap.',
    docs: [
      { name: 'How to Use This Toolkit', sub: 'Instructions for every module, form & template', path: '/toolkit/guides/how_to_use.html', type: 'guide', ready: true },
      { name: '90-Day Action Plan', sub: 'Month-by-month launch roadmap with form references', path: '/toolkit/guides/action_plan.html', type: 'guide', ready: true },
      { name: 'Strategic Plan 2026–2031', sub: '1-year & 5-year roadmap with budget & milestones', path: '/toolkit/docs/strategic_plan.html', type: 'doc', ready: true },
      { name: 'Replication Toolkit Overview', sub: 'Summary of the full model & partner tiers', path: '/toolkit/docs/replication_overview.html', type: 'doc', ready: true },
    ],
  },
  {
    id: 'mod01',
    label: 'Module 01 — Organizational Setup',
    icon: '🏛️',
    color: 'blue',
    description: 'Legal foundation, governance, and formal Beacon partnership.',
    docs: [
      { name: 'Site Readiness Assessment', sub: 'Confirm minimum conditions before applying', path: '/toolkit/forms/site_readiness.html', type: 'form', ready: true },
      { name: 'Partner Application', sub: 'Apply to become Affiliate, Partner, or Hub Site', path: '/toolkit/forms/partner_application.html', type: 'form', ready: true },
      { name: 'Partner MOU', sub: 'Memorandum of Understanding with Beacon HQ', path: '/toolkit/templates/partner_mou.html', type: 'template', ready: true },
      { name: 'Staff Job Descriptions', sub: 'Case Manager, Coordinator & Livelihood roles', path: '/toolkit/templates/staff_job_description.html', type: 'template', ready: true },
    ],
  },
  {
    id: 'mod02',
    label: 'Module 02 — Shelter Operations',
    icon: '🏠',
    color: 'green',
    description: 'Day-to-day shelter management, intake, and resident welfare.',
    docs: [
      { name: 'Shelter Operations Manual', sub: 'Setup, house rules, intake process & crisis protocol', path: '/toolkit/docs/operations_manual.html', type: 'doc', ready: true },
      { name: 'Shelter Setup Checklist', sub: 'Verify the physical space before opening', path: '/toolkit/forms/shelter_checklist.html', type: 'form', ready: true },
      { name: 'Resident Intake Form', sub: 'Complete within 2 hours of arrival', path: '/toolkit/forms/resident_intake.html', type: 'form', ready: true },
      { name: 'Incident Report', sub: 'Document safety or operational incidents', path: '/toolkit/forms/incident_report.html', type: 'form', ready: true },
      { name: 'Discharge & Transition Plan', sub: 'Collaborative exit plan for every resident', path: '/toolkit/forms/discharge_plan.html', type: 'form', ready: true },
    ],
  },
  {
    id: 'mod03',
    label: 'Module 03 — Case Management',
    icon: '📋',
    color: 'purple',
    description: 'Assessment, care planning, progress tracking, and case closure.',
    docs: [
      { name: 'Case Management Training', sub: '3-day trauma-informed case management curriculum', path: '/toolkit/docs/training_case_management.html', type: 'doc', ready: true },
      { name: 'Survivor Intake Assessment', sub: 'Deeper assessment 48–72 hrs after arrival', path: '/toolkit/forms/survivor_assessment.html', type: 'form', ready: true },
      { name: 'Risk & Safety Assessment', sub: 'Lethality indicators and safety planning', path: '/toolkit/forms/risk_safety_assessment.html', type: 'form', ready: true },
      { name: '90-Day Individual Care Plan', sub: 'Goal-setting across housing, legal, health & work', path: '/toolkit/forms/care_plan_90day.html', type: 'form', ready: true },
      { name: 'Progress Tracking Form', sub: 'Bi-weekly / monthly check-in against care plan', path: '/toolkit/forms/progress_tracking.html', type: 'form', ready: true },
      { name: 'Case Closure Form', sub: 'Exit outcomes, referrals & follow-up schedule', path: '/toolkit/forms/case_closure.html', type: 'form', ready: true },
    ],
  },
  {
    id: 'mod04',
    label: 'Module 04 — Legal Advocacy',
    icon: '⚖️',
    color: 'red',
    description: 'Evidence documentation, legal referrals, rights guides, and partner MOUs.',
    docs: [
      { name: 'Legal Advocacy Pack', sub: 'Staff guide: evidence, referrals & confidentiality', path: '/toolkit/docs/legal_pack.html', type: 'doc', ready: true },
      { name: 'Evidence Documentation Log', sub: 'Court-admissible evidence tracking', path: '/toolkit/forms/evidence_log.html', type: 'form', ready: true },
      { name: 'Legal Referral Form', sub: 'Refer survivors to your legal aid partner', path: '/toolkit/forms/legal_referral.html', type: 'form', ready: true },
      { name: 'Legal Aid MOU', sub: 'Formal agreement with legal aid partners', path: '/toolkit/templates/legal_aid_mou.html', type: 'template', ready: true },
      { name: 'Survivor Legal Rights — Ghana', sub: 'Know your rights guide (Ghana version)', path: '/toolkit/templates/legal_rights_ghana.html', type: 'guide', ready: true },
      { name: 'Survivor Legal Rights — U.S.', sub: 'Know your rights guide (U.S. version)', path: '/toolkit/templates/legal_rights_us.html', type: 'guide', ready: true },
    ],
  },
  {
    id: 'mod05',
    label: 'Module 05 — Counseling & Mental Health',
    icon: '💙',
    color: 'teal',
    description: 'Psychological support, group sessions, peer mentorship, and staff care.',
    docs: [
      { name: 'Counseling Curriculum', sub: 'Individual & group psychosocial support framework', path: '/toolkit/docs/training_counseling.html', type: 'doc', ready: true },
      { name: 'Mental Health Referral Form', sub: 'Refer to healthcare / counseling partner', path: '/toolkit/forms/mh_referral.html', type: 'form', ready: true },
      { name: 'Group Session Log', sub: 'Attendance and notes for group sessions', path: '/toolkit/forms/group_session_log.html', type: 'form', ready: true },
      { name: 'Peer Mentor Application', sub: 'Apply to become a peer mentor', path: '/toolkit/forms/peer_mentor_application.html', type: 'form', ready: true },
      { name: 'Staff Wellbeing Check-in', sub: 'Monthly burnout & wellbeing self-assessment', path: '/toolkit/forms/staff_wellbeing.html', type: 'form', ready: true },
    ],
  },
  {
    id: 'mod06',
    label: 'Module 06 — Livelihood & Employment',
    icon: '💼',
    color: 'amber',
    description: 'Skills assessment, workshops, job placements, and employer partnerships.',
    docs: [
      { name: 'Livelihood Workshop Curriculum', sub: '8-week skills, business & job-readiness program', path: '/toolkit/docs/training_livelihood.html', type: 'doc', ready: true },
      { name: 'Skills Assessment Form', sub: 'Map survivor skills, interests & work history', path: '/toolkit/forms/skills_assessment.html', type: 'form', ready: true },
      { name: 'Job Placement Tracker', sub: 'Track applications, interviews & outcomes', path: '/toolkit/forms/job_placement_tracker.html', type: 'form', ready: true },
      { name: 'Workshop Feedback Form', sub: 'Participant feedback on livelihood workshops', path: '/toolkit/forms/workshop_feedback.html', type: 'form', ready: true },
      { name: 'Employer Partnership Agreement', sub: 'Formal agreement with hiring employers', path: '/toolkit/templates/employer_agreement.html', type: 'template', ready: true },
    ],
  },
  {
    id: 'mod07',
    label: 'Module 07 — App & Digital Tools',
    icon: '📱',
    color: 'indigo',
    description: 'Beacon app setup, digital safety for survivors, and admin guides.',
    docs: [
      { name: 'Digital Safety Assessment', sub: "Check if survivor's devices are being monitored", path: '/toolkit/forms/digital_safety_assessment.html', type: 'form', ready: true },
      { name: 'App & Digital Tools Guide', sub: 'Deploy and configure the Beacon app locally', path: '/toolkit/guides/digital_training.html', type: 'guide', ready: true },
    ],
  },
  {
    id: 'mod08',
    label: 'Module 08 — Fundraising & Sustainability',
    icon: '📊',
    color: 'orange',
    description: 'Grant tracking, donor management, budget planning, and impact reporting.',
    docs: [
      { name: 'Fundraising & Sustainability Playbook', sub: 'How to fund, diversify, and sustain your program', path: '/toolkit/guides/fundraising_playbook.html', type: 'guide', ready: true },
      { name: 'Grant Tracker', sub: 'Pipeline of funders, deadlines & application status', path: '/toolkit/forms/grant_tracker.html', type: 'form', ready: true },
      { name: 'Donor Log', sub: 'Contact history, giving records & follow-up dates', path: '/toolkit/forms/donor_log.html', type: 'form', ready: true },
      { name: 'Annual Budget Template', sub: 'Scalable from $85K to $500K+', path: '/toolkit/templates/budget_template.html', type: 'template', ready: true },
      { name: 'Impact Report Template', sub: 'Annual impact statement for donors & funders', path: '/toolkit/templates/impact_report_template.html', type: 'template', ready: true },
    ],
  },
];

// ─── Tag styling helpers ──────────────────────────────────────────────────────
const TYPE_STYLES = {
  form:     { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  label: 'Form' },
  template: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Template' },
  guide:    { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200',   label: 'Guide' },
  doc:      { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  label: 'Document' },
};

const TypeTag = ({ type }) => {
  const s = TYPE_STYLES[type] || TYPE_STYLES.form;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const allDocs = MODULES.flatMap(m => m.docs);
const totalReady = allDocs.filter(d => d.ready).length;
const totalDocs = allDocs.length;

// ─── Component ────────────────────────────────────────────────────────────────
const Toolkit = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const FILTERS = [
    { id: 'all',      label: 'All documents' },
    { id: 'form',     label: 'Forms' },
    { id: 'template', label: 'Templates' },
    { id: 'guide',    label: 'Guides' },
    { id: 'ready',    label: 'Available now' },
  ];

  const openDoc = (doc) => {
    if (!doc.ready) return;
    window.open(doc.path, '_blank');
  };

  const filteredModules = MODULES.map(mod => ({
    ...mod,
    docs: mod.docs.filter(doc => {
      const matchesFilter =
        activeFilter === 'all' ? true :
        activeFilter === 'ready' ? doc.ready :
        doc.type === activeFilter;
      const matchesSearch = search.trim() === '' ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.sub.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    }),
  })).filter(mod => mod.docs.length > 0);

  return (
    <PasswordGate>
    <>
      <div className="min-h-screen bg-gray-50">

        {/* ── Hero ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-2xl">
              <span className="inline-block bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-orange-200 mb-5">
                NGO Replication Toolkit
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-5">
                Everything you need to replicate Beacon's model.
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                All forms, templates, guides, and strategic documents — organized by module.
                Open any document to edit it directly in your browser, then print or save as PDF.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-orange-600">{totalReady}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Available now</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-gray-900">{totalDocs}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Total documents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-gray-900">8</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Core modules</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-gray-900">3–4</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Months to launch</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors border ${
                    activeFilter === f.id
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        {/* ── Document library ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {filteredModules.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-lg">No documents match your search.</p>
              <button onClick={() => { setSearch(''); setActiveFilter('all'); }} className="mt-4 text-orange-600 text-sm font-semibold hover:underline">Clear filters</button>
            </div>
          )}

          <div className="space-y-12">
            {filteredModules.map(mod => (
              <div key={mod.id}>
                {/* Module header */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{mod.icon}</span>
                  <h2 className="text-xl font-serif font-bold text-gray-900">{mod.label}</h2>
                  <span className="text-xs text-gray-400 ml-1">({mod.docs.length})</span>
                </div>
                <p className="text-sm text-gray-500 mb-5 ml-9">{mod.description}</p>

                {/* Doc cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-0">
                  {mod.docs.map(doc => (
                    <div
                      key={doc.path}
                      className={`bg-white rounded-xl border shadow-sm px-5 py-4 flex items-start justify-between gap-4 transition-colors group ${
                        doc.ready
                          ? 'border-gray-100 hover:border-orange-200 cursor-pointer'
                          : 'border-dashed border-gray-200 opacity-60'
                      }`}
                      onClick={() => openDoc(doc)}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="text-gray-300 text-xl flex-shrink-0 mt-0.5">
                          {doc.type === 'form' ? '📄' : doc.type === 'template' ? '📝' : doc.type === 'guide' ? '📖' : '📊'}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`text-sm font-semibold text-gray-800 group-hover:text-orange-700 transition-colors ${doc.ready ? '' : 'text-gray-500'}`}>
                              {doc.name}
                            </span>
                            <TypeTag type={doc.type} />
                          </div>
                          <p className="text-xs text-gray-400 leading-snug">{doc.sub}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 mt-0.5">
                        {doc.ready ? (
                          <span className="bg-orange-50 text-orange-700 text-xs font-semibold py-1.5 px-3 rounded-full border border-orange-200 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors whitespace-nowrap">
                            Open & Edit
                          </span>
                        ) : (
                          <span className="bg-gray-50 text-gray-400 text-xs font-semibold py-1.5 px-3 rounded-full border border-gray-200 whitespace-nowrap">
                            Coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-16 bg-orange-600 rounded-2xl p-8 md:p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2">Ready to replicate the Beacon model?</h3>
                <p className="text-orange-100 text-sm leading-relaxed max-w-lg">
                  Start with the Site Readiness Assessment, then submit your Partner Application to Beacon HQ.
                  Our team will respond within 10 business days.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => window.open('/toolkit/forms/site_readiness.html', '_blank')}
                  className="bg-white text-orange-700 font-semibold py-2.5 px-6 rounded-full hover:bg-orange-50 transition-colors text-sm"
                >
                  Start Assessment
                </button>
                <a
                  href="mailto:ename@beaconnewbeginnings.org?subject=Beacon Partner Inquiry"
                  className="border border-orange-300 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-orange-700 transition-colors text-sm text-center"
                >
                  Contact Beacon HQ
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Toolkit v1.0 · 2026 · <a href="mailto:ename@beaconnewbeginnings.org" className="hover:text-orange-600">ename@beaconnewbeginnings.org</a> · beaconnewbeginnings.org
          </p>
        </div>
      </div>

      <Footer2 />
    </>
    </PasswordGate>
  );
};

export default Toolkit;

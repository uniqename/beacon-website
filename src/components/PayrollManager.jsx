import { useState } from 'react';

// ── Ghana PAYE 2024 (Monthly Brackets) ───────────────────────────────────────
const PAYE_BRACKETS = [
  { limit: 490,      rate: 0     },
  { limit: 110,      rate: 0.05  },
  { limit: 130,      rate: 0.10  },
  { limit: 3000,     rate: 0.175 },
  { limit: 16400,    rate: 0.25  },
  { limit: Infinity, rate: 0.35  },
];

function calcPAYE(gross) {
  let remaining = Math.max(0, gross), tax = 0;
  for (const { limit, rate } of PAYE_BRACKETS) {
    if (remaining <= 0) break;
    const chunk = Math.min(remaining, limit);
    tax += chunk * rate;
    remaining -= chunk;
  }
  return Math.round(tax * 100) / 100;
}

function calcSSNIT(gross) {
  return {
    employee: Math.round(gross * 0.055 * 100) / 100,
    employer: Math.round(gross * 0.13  * 100) / 100,
  };
}

function ghs(n) {
  return `GHS ${Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function monthLabel(ym) {
  return new Date(ym + '-15').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function currentYM() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ── Local storage ─────────────────────────────────────────────────────────────
const EMP_KEY  = 'bnb_payroll_employees';
const RUNS_KEY = 'bnb_payroll_runs';
const load = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ── Employee type labels ──────────────────────────────────────────────────────
const TYPE_LABELS = { intern: 'Intern Stipend', staff: 'Staff Salary', director: 'Director Allowance', volunteer: 'Volunteer Stipend' };

// ── Print helpers ─────────────────────────────────────────────────────────────
const SHARED_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; }
  .wrap { padding: 40px; max-width: 700px; margin: auto; }
  .hdr { background: #1e3a5f; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }
  .hdr-left h1 { font-size: 15px; letter-spacing: 3px; font-weight: 700; }
  .hdr-left p  { font-size: 10px; color: rgba(255,255,255,0.65); margin-top: 3px; letter-spacing: 1px; }
  .badge { background: #f97316; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; white-space:nowrap; }
  .body  { border: 1px solid #e5e7eb; border-top: none; padding: 18px 24px 24px; }
  .grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 14px; }
  .field label { display: block; font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
  .field span  { font-size: 12px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  th { background: #f9fafb; padding: 7px 10px; text-align: left; font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
  td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
  .net td { background: #f0fdf4; font-weight: 700; color: #166534; font-size: 14px; border-top: 2px solid #bbf7d0; }
  .note { margin-top: 12px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 8px 12px; font-size: 10px; color: #92400e; }
  .footer { margin-top: 18px; font-size: 10px; color: #9ca3af; text-align: center; }
  @media print { .no-print { display: none !important; } @page { margin: 0.5in; } }
`;

function payslipSection(emp, entry, month) {
  const deductTotal = entry.paye + entry.ssnit_e;
  const lbl = TYPE_LABELS[emp.type] || 'Payment';
  return `
  <div class="wrap">
    <div class="hdr">
      <div class="hdr-left">
        <h1>BEACON OF NEW BEGINNINGS</h1>
        <p>PAYSLIP · ${monthLabel(month).toUpperCase()}</p>
      </div>
      <span class="badge">${lbl.toUpperCase()}</span>
    </div>
    <div class="body">
      <div class="grid">
        <div class="field"><label>Employee</label><span>${emp.name}</span></div>
        <div class="field"><label>Role</label><span>${emp.role}</span></div>
        <div class="field"><label>Employee ID</label><span>BNB-${String(emp.id).slice(-4).toUpperCase()}</span></div>
        <div class="field"><label>Pay Period</label><span>${monthLabel(month)}</span></div>
        ${emp.bankName    ? `<div class="field"><label>Bank</label><span>${emp.bankName}</span></div>`    : ''}
        ${emp.bankAccount ? `<div class="field"><label>Account No.</label><span>${emp.bankAccount}</span></div>` : ''}
      </div>
      <table>
        <thead><tr><th>Description</th><th style="text-align:right">Earnings</th><th style="text-align:right">Deductions</th></tr></thead>
        <tbody>
          <tr><td>${lbl}</td><td style="text-align:right">${ghs(entry.gross)}</td><td></td></tr>
          ${entry.paye    > 0 ? `<tr><td>PAYE Tax</td><td></td><td style="text-align:right;color:#dc2626">${ghs(entry.paye)}</td></tr>`          : ''}
          ${entry.ssnit_e > 0 ? `<tr><td>SSNIT (Employee 5.5%)</td><td></td><td style="text-align:right;color:#dc2626">${ghs(entry.ssnit_e)}</td></tr>` : ''}
          ${deductTotal   > 0 ? `<tr><td><strong>Total Deductions</strong></td><td></td><td style="text-align:right;color:#dc2626"><strong>${ghs(deductTotal)}</strong></td></tr>` : ''}
          <tr class="net"><td>NET PAY</td><td></td><td style="text-align:right">${ghs(entry.net)}</td></tr>
        </tbody>
      </table>
      ${(entry.ssnit_employer || 0) > 0 ? `<div class="note">Employer SSNIT contribution (13%): ${ghs(entry.ssnit_employer)} — remitted directly to SSNIT by employer, not deducted from employee pay.</div>` : ''}
      ${entry.notes ? `<p style="margin-top:10px;font-size:11px;color:#6b7280"><strong>Note:</strong> ${entry.notes}</p>` : ''}
    </div>
    <p class="footer">This payslip was generated by Beacon of New Beginnings internal payroll system.</p>
  </div>`;
}

function openPayslips(employees, run) {
  const sections = run.entries.map(e => {
    const emp = employees.find(em => em.id === e.employeeId);
    return emp ? payslipSection(emp, e, run.month) : '';
  }).join('<div style="page-break-after:always"></div>');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Payslips — ${monthLabel(run.month)}</title>
<style>${SHARED_CSS}</style></head>
<body>${sections}
<div class="no-print" style="padding:24px;text-align:center">
  <button onclick="window.print()" style="padding:10px 28px;background:#1e3a5f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">🖨 Print All Payslips / Save as PDF</button>
</div></body></html>`;
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write(html); win.document.close();
  return true;
}

function openSummary(employees, run) {
  const totals = run.entries.reduce((a, e) => ({
    gross: a.gross + e.gross, paye: a.paye + e.paye,
    ssnit_e: a.ssnit_e + e.ssnit_e, ssnit_er: a.ssnit_er + (e.ssnit_employer || 0),
    net: a.net + e.net,
  }), { gross: 0, paye: 0, ssnit_e: 0, ssnit_er: 0, net: 0 });

  const rows = run.entries.map(e => {
    const emp = employees.find(em => em.id === e.employeeId);
    return `<tr>
      <td>${emp?.name || 'Unknown'}</td>
      <td>${emp?.role || ''}</td>
      <td><span style="background:#e0f2fe;color:#0369a1;font-size:10px;padding:2px 7px;border-radius:10px;font-weight:700;">${TYPE_LABELS[emp?.type] || ''}</span></td>
      <td style="text-align:right">${ghs(e.gross)}</td>
      <td style="text-align:right;color:#dc2626">${e.paye > 0 ? ghs(e.paye) : '—'}</td>
      <td style="text-align:right;color:#dc2626">${e.ssnit_e > 0 ? ghs(e.ssnit_e) : '—'}</td>
      <td style="text-align:right;color:#0369a1">${(e.ssnit_employer || 0) > 0 ? ghs(e.ssnit_employer) : '—'}</td>
      <td style="text-align:right;font-weight:700;color:#166534">${ghs(e.net)}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Payroll Summary — ${monthLabel(run.month)}</title>
<style>${SHARED_CSS}
  .wrap { padding: 40px; }
  .sum-hdr { background:#1e3a5f;color:#fff;padding:20px 28px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center; }
  .sum-hdr h1 { font-size:15px;letter-spacing:3px;font-weight:700; }
  .sum-hdr p  { font-size:11px;color:rgba(255,255,255,0.65);margin-top:2px; }
  .sum-hdr .mo { font-size:20px;font-weight:700; }
  .sum-body { border:1px solid #e5e7eb;border-top:none;padding:0; }
  .total-row td { background:#1e3a5f;color:#fff;font-weight:700;font-size:13px;border-top:2px solid #1e3a5f;padding:10px 10px; }
</style></head>
<body><div class="wrap">
  <div class="sum-hdr">
    <div><h1>BEACON OF NEW BEGINNINGS</h1><p>PAYROLL SUMMARY REPORT</p></div>
    <div class="mo">${monthLabel(run.month)}</div>
  </div>
  <div class="sum-body">
    <table>
      <thead><tr>
        <th>Employee</th><th>Role</th><th>Type</th>
        <th style="text-align:right">Gross</th>
        <th style="text-align:right">PAYE</th>
        <th style="text-align:right">SSNIT (Emp.)</th>
        <th style="text-align:right">SSNIT (Emplr.)</th>
        <th style="text-align:right">Net Pay</th>
      </tr></thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="3">TOTALS (${run.entries.length} employee${run.entries.length !== 1 ? 's' : ''})</td>
          <td style="text-align:right">${ghs(totals.gross)}</td>
          <td style="text-align:right">${totals.paye > 0 ? ghs(totals.paye) : '—'}</td>
          <td style="text-align:right">${totals.ssnit_e > 0 ? ghs(totals.ssnit_e) : '—'}</td>
          <td style="text-align:right">${totals.ssnit_er > 0 ? ghs(totals.ssnit_er) : '—'}</td>
          <td style="text-align:right">${ghs(totals.net)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  ${totals.ssnit_er > 0 ? `<div class="note" style="margin-top:14px">⚠ Employer SSNIT obligation of ${ghs(totals.ssnit_er)} must be remitted to SSNIT by the 14th of the following month.</div>` : ''}
  <p style="margin-top:16px;font-size:10px;color:#9ca3af">Generated ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })} · Beacon of New Beginnings Internal Payroll System</p>
</div>
<div class="no-print" style="padding:20px 40px">
  <button onclick="window.print()" style="padding:10px 28px;background:#1e3a5f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">🖨 Print Summary / Save as PDF</button>
</div></body></html>`;
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write(html); win.document.close();
  return true;
}

// ── Component ─────────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', role: '', type: 'staff', grossAmount: '', enablePAYE: false, enableSSNIT: false, bankName: '', bankAccount: '', active: true };

const PayrollManager = ({ onClose }) => {
  const [employees, setEmployees] = useState(() => load(EMP_KEY));
  const [runs,      setRuns]      = useState(() => load(RUNS_KEY));
  const [tab,       setTab]       = useState('employees');
  const [empForm,   setEmpForm]   = useState(null);
  const [runMonth,  setRunMonth]  = useState(currentYM);
  const [runNotes,  setRunNotes]  = useState({});
  const [notif,     setNotif]     = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const notify = (msg, ok = true) => { setNotif({ msg, ok }); setTimeout(() => setNotif(null), 3500); };

  const persistEmp  = (d) => { setEmployees(d); save(EMP_KEY,  d); };
  const persistRuns = (d) => { setRuns(d);      save(RUNS_KEY, d); };

  const computeEntries = () =>
    employees.filter(e => e.active).map(emp => {
      const gross = parseFloat(emp.grossAmount) || 0;
      const paye      = emp.enablePAYE  ? calcPAYE(gross)   : 0;
      const ssnit     = emp.enableSSNIT ? calcSSNIT(gross)   : { employee: 0, employer: 0 };
      const net = Math.round((gross - paye - ssnit.employee) * 100) / 100;
      return { employeeId: emp.id, gross, paye, ssnit_e: ssnit.employee, ssnit_employer: ssnit.employer, net, notes: runNotes[emp.id] || '' };
    });

  const existingRun = runs.find(r => r.month === runMonth);
  const preview     = computeEntries();
  const previewTotals = preview.reduce((a, e) => ({ gross: a.gross + e.gross, net: a.net + e.net }), { gross: 0, net: 0 });

  const saveEmployee = () => {
    if (!empForm?.name?.trim() || !empForm?.role?.trim() || !empForm?.grossAmount) {
      notify('Name, role, and amount are required', false); return;
    }
    if (empForm.id) {
      persistEmp(employees.map(e => e.id === empForm.id ? { ...empForm } : e));
      notify('Employee updated');
    } else {
      persistEmp([...employees, { ...empForm, id: Date.now() }]);
      notify('Employee added');
    }
    setEmpForm(null);
  };

  const finalizeRun = () => {
    if (existingRun) { notify('Payroll already run for this month', false); return; }
    const entries = computeEntries();
    if (!entries.length) { notify('No active employees to process', false); return; }
    const run = { id: Date.now(), month: runMonth, entries, createdAt: new Date().toISOString() };
    persistRuns([run, ...runs]);
    setRunNotes({});
    notify('Payroll finalised!');
    setTab('history');
  };

  const exportBackup = () => {
    const data = { employees, runs, exportedAt: new Date().toISOString() };
    const a = document.createElement('a');
    a.download = `beacon_payroll_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.click(); notify('Backup downloaded');
  };

  const importBackup = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.employees) { persistEmp(data.employees); }
        if (data.runs)      { persistRuns(data.runs); }
        notify('Backup restored successfully');
      } catch { notify('Invalid backup file', false); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Type badge ───────────────────────────────────────────────────────────
  const typeBadge = (type) => {
    const colors = { intern: 'bg-blue-100 text-blue-700', staff: 'bg-green-100 text-green-700', director: 'bg-purple-100 text-purple-700', volunteer: 'bg-gray-100 text-gray-600' };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[type] || colors.staff}`}>{TYPE_LABELS[type] || type}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-3xl max-h-[94vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: '#1e3a5f' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Payroll Manager</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Employees · Run Payroll · Payslips · Summaries</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportBackup} title="Export backup" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">⬇ Backup</button>
            <label title="Import backup" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              ⬆ Restore <input type="file" accept=".json" className="hidden" onChange={importBackup} />
            </label>
            <button onClick={onClose} className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">✕</button>
          </div>
        </div>

        {/* Notification */}
        {notif && (
          <div className={`mx-6 mt-3 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0 ${notif.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {notif.ok ? '✓' : '✕'} {notif.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 shrink-0">
          {[
            { id: 'employees', label: `Employees (${employees.length})` },
            { id: 'run',       label: 'Run Payroll' },
            { id: 'history',   label: `History (${runs.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${tab === t.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── EMPLOYEES TAB ──────────────────────────────────────────────── */}
          {tab === 'employees' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">Manage employee records. PAYE and SSNIT can be enabled per employee once accounts are set up.</p>
                <button onClick={() => setEmpForm({ ...EMPTY_FORM })}
                  className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors"
                  style={{ background: '#1e3a5f' }}>
                  + Add Employee
                </button>
              </div>

              {/* Add / Edit form */}
              {empForm && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-4 space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">{empForm.id ? 'Edit Employee' : 'New Employee'}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
                      <input value={empForm.name} onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="e.g. Ama Mensah" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Role / Title *</label>
                      <input value={empForm.role} onChange={e => setEmpForm(f => ({ ...f, role: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="e.g. Programme Officer" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Employment Type *</label>
                      <select value={empForm.type} onChange={e => setEmpForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                        <option value="staff">Staff (Salary)</option>
                        <option value="intern">Intern (Stipend)</option>
                        <option value="director">Director (Allowance)</option>
                        <option value="volunteer">Volunteer (Stipend)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Monthly Amount (GHS) *</label>
                      <input type="number" min="0" step="0.01" value={empForm.grossAmount}
                        onChange={e => setEmpForm(f => ({ ...f, grossAmount: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="1500.00" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Bank Name</label>
                      <input value={empForm.bankName} onChange={e => setEmpForm(f => ({ ...f, bankName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="e.g. Ecobank Ghana" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Account Number</label>
                      <input value={empForm.bankAccount} onChange={e => setEmpForm(f => ({ ...f, bankAccount: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="0123456789" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={empForm.enablePAYE}
                        onChange={e => setEmpForm(f => ({ ...f, enablePAYE: e.target.checked }))}
                        className="w-4 h-4 accent-orange-500" />
                      <span className="text-xs font-semibold text-gray-700">Apply PAYE Tax</span>
                      <span className="text-[10px] text-gray-400">(Ghana Income Tax)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={empForm.enableSSNIT}
                        onChange={e => setEmpForm(f => ({ ...f, enableSSNIT: e.target.checked }))}
                        className="w-4 h-4 accent-orange-500" />
                      <span className="text-xs font-semibold text-gray-700">Apply SSNIT</span>
                      <span className="text-[10px] text-gray-400">(5.5% Emp. / 13% Emplr.)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none ml-auto">
                      <input type="checkbox" checked={empForm.active}
                        onChange={e => setEmpForm(f => ({ ...f, active: e.target.checked }))}
                        className="w-4 h-4 accent-orange-500" />
                      <span className="text-xs font-semibold text-gray-700">Active</span>
                    </label>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEmployee}
                      className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-colors"
                      style={{ background: '#1e3a5f' }}>
                      {empForm.id ? 'Save Changes' : 'Add Employee'}
                    </button>
                    <button onClick={() => setEmpForm(null)}
                      className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {employees.length === 0 && !empForm && (
                <div className="text-center py-14 text-gray-400">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="text-sm font-medium">No employees yet.</p>
                  <p className="text-xs mt-1">Click "Add Employee" to get started.</p>
                </div>
              )}

              <div className="space-y-3">
                {employees.map(emp => {
                  const gross = parseFloat(emp.grossAmount) || 0;
                  const paye   = emp.enablePAYE  ? calcPAYE(gross) : 0;
                  const ssnit  = emp.enableSSNIT ? calcSSNIT(gross).employee : 0;
                  const net    = gross - paye - ssnit;
                  return (
                    <div key={emp.id}
                      className={`border rounded-2xl p-4 transition-all ${emp.active ? 'border-gray-100 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-bold text-gray-900">{emp.name}</span>
                            {typeBadge(emp.type)}
                            {!emp.active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">INACTIVE</span>}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{emp.role}</p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>{ghs(gross)}<span className="text-xs font-normal text-gray-400"> /mo gross</span></span>
                            {(paye > 0 || ssnit > 0) && (
                              <span className="text-xs text-red-500">−{ghs(paye + ssnit)} deductions</span>
                            )}
                            <span className="text-sm font-bold text-green-700">{ghs(net)}<span className="text-xs font-normal text-gray-400"> net</span></span>
                          </div>
                          <div className="flex gap-3 mt-2">
                            {emp.enablePAYE   && <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">PAYE</span>}
                            {emp.enableSSNIT  && <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">SSNIT</span>}
                            {emp.bankName     && <span className="text-[10px] text-gray-400">{emp.bankName}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setEmpForm({ ...emp })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => setConfirmDel(emp.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                      {confirmDel === emp.id && (
                        <div className="mt-3 pt-3 border-t border-red-100 flex items-center gap-3">
                          <p className="text-xs text-red-600 flex-1">Delete <strong>{emp.name}</strong>? This cannot be undone.</p>
                          <button onClick={() => { persistEmp(employees.filter(e => e.id !== emp.id)); setConfirmDel(null); notify('Employee deleted'); }}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                            Delete
                          </button>
                          <button onClick={() => setConfirmDel(null)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RUN PAYROLL TAB ─────────────────────────────────────────────── */}
          {tab === 'run' && (
            <div>
              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Payroll Month</label>
                  <input type="month" value={runMonth} onChange={e => setRunMonth(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                {existingRun && (
                  <div className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-50 border border-amber-200 text-amber-700">
                    ⚠ Payroll already run for {monthLabel(runMonth)}. View it in History.
                  </div>
                )}
              </div>

              {employees.filter(e => e.active).length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">No active employees.</p>
                  <p className="text-xs mt-1">Add employees in the Employees tab first.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                          <th className="px-4 py-3 text-left">Employee</th>
                          <th className="px-4 py-3 text-right">Gross</th>
                          <th className="px-4 py-3 text-right">PAYE</th>
                          <th className="px-4 py-3 text-right">SSNIT (Emp.)</th>
                          <th className="px-4 py-3 text-right font-bold text-green-700">Net Pay</th>
                          <th className="px-4 py-3 text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map(entry => {
                          const emp = employees.find(e => e.id === entry.employeeId);
                          return (
                            <tr key={entry.employeeId} className="border-t border-gray-50 hover:bg-gray-50/50">
                              <td className="px-4 py-3">
                                <div className="font-semibold text-gray-900">{emp?.name}</div>
                                <div className="text-xs text-gray-400">{emp?.role}</div>
                              </td>
                              <td className="px-4 py-3 text-right font-medium">{ghs(entry.gross)}</td>
                              <td className="px-4 py-3 text-right text-red-500">{entry.paye > 0 ? ghs(entry.paye) : <span className="text-gray-300">—</span>}</td>
                              <td className="px-4 py-3 text-right text-red-500">{entry.ssnit_e > 0 ? ghs(entry.ssnit_e) : <span className="text-gray-300">—</span>}</td>
                              <td className="px-4 py-3 text-right font-bold text-green-700">{ghs(entry.net)}</td>
                              <td className="px-4 py-3">
                                <input
                                  value={runNotes[entry.employeeId] || ''}
                                  onChange={e => setRunNotes(n => ({ ...n, [entry.employeeId]: e.target.value }))}
                                  placeholder="Optional note…"
                                  className="w-full border border-gray-100 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-300"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-200 bg-gray-50">
                          <td className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Total ({preview.length} staff)</td>
                          <td className="px-4 py-3 text-right font-bold" style={{ color: '#1e3a5f' }}>{ghs(previewTotals.gross)}</td>
                          <td colSpan={2} />
                          <td className="px-4 py-3 text-right font-bold text-green-700">{ghs(previewTotals.net)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {preview.some(e => (e.ssnit_employer || 0) > 0) && (
                    <div className="mt-3 px-4 py-3 rounded-xl text-xs font-medium bg-blue-50 border border-blue-100 text-blue-700">
                      Employer SSNIT obligation this month: <strong>{ghs(preview.reduce((a, e) => a + (e.ssnit_employer || 0), 0))}</strong> — remit to SSNIT by the 14th.
                    </div>
                  )}

                  <div className="mt-5 flex gap-3 flex-wrap">
                    <button onClick={finalizeRun} disabled={!!existingRun}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: '#1e3a5f' }}>
                      ✓ Finalise Payroll for {monthLabel(runMonth)}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ────────────────────────────────────────────────── */}
          {tab === 'history' && (
            <div>
              {runs.length === 0 ? (
                <div className="text-center py-14 text-gray-400">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm font-medium">No payroll runs yet.</p>
                  <p className="text-xs mt-1">Go to Run Payroll to process your first month.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {runs.map(run => {
                    const totals = run.entries.reduce((a, e) => ({ gross: a.gross + e.gross, net: a.net + e.net }), { gross: 0, net: 0 });
                    return (
                      <div key={run.id} className="border border-gray-100 rounded-2xl p-4 bg-white">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{monthLabel(run.month)}</span>
                              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">FINALISED</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">{run.entries.length} employee{run.entries.length !== 1 ? 's' : ''}</span>
                              <span className="text-xs font-medium" style={{ color: '#1e3a5f' }}>Gross {ghs(totals.gross)}</span>
                              <span className="text-xs font-bold text-green-700">Net {ghs(totals.net)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => { if (!openPayslips(employees, run)) notify('Allow pop-ups to open payslips', false); }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                              style={{ background: '#1e3a5f' }}>
                              🖨 Payslips
                            </button>
                            <button
                              onClick={() => { if (!openSummary(employees, run)) notify('Allow pop-ups to open summary', false); }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border text-gray-600 hover:bg-gray-50 transition-colors"
                              style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}>
                              📊 Summary
                            </button>
                            <button
                              onClick={() => {
                                if (!window.confirm(`Delete payroll for ${monthLabel(run.month)}? This cannot be undone.`)) return;
                                persistRuns(runs.filter(r => r.id !== run.id));
                                notify('Payroll run deleted');
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                        {/* Mini breakdown */}
                        <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {run.entries.map(e => {
                            const emp = employees.find(em => em.id === e.employeeId);
                            return (
                              <div key={e.employeeId} className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">{emp?.name || 'Unknown'}</span>
                                <span className="ml-1 text-green-600 font-medium">{ghs(e.net)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollManager;

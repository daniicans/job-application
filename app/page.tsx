'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  linkedinOrPortfolio: string;
  roleApplyingFor: string;
  howDidYouHear: string;
  engagementType: string;
  availableStartDate: string;
  compensationExpectation: string;
  hoursPerWeek: string;
  workAuthorization: string;
  requiresSponsorship: string;
  yearsOfExperience: string;
  relevantSkills: string;
  whyICANS: string;
  resumeLink: string;
  equityOpenness: string;
  reference1: string;
  reference2: string;
  additionalComments: string;
}

const empty: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  streetAddress: '', city: '', state: '', zipCode: '', country: 'United States',
  linkedinOrPortfolio: '', roleApplyingFor: '', howDidYouHear: '',
  engagementType: '', availableStartDate: '', compensationExpectation: '',
  hoursPerWeek: '', workAuthorization: '', requiresSponsorship: '',
  yearsOfExperience: '', relevantSkills: '', whyICANS: '', resumeLink: '',
  equityOpenness: '', reference1: '', reference2: '', additionalComments: '',
};

const requiredFields = new Set<keyof FormData>([
  'firstName', 'lastName', 'email', 'roleApplyingFor',
  'engagementType', 'workAuthorization', 'whyICANS',
]);

export default function Home() {
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Set<keyof FormData>>(new Set());
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors.has(field)) {
      setErrors(prev => { const s = new Set(prev); s.delete(field); return s; });
    }
  };

  const validate = (): boolean => {
    const newErrors = new Set<keyof FormData>();
    for (const field of requiredFields) {
      if (!form[field].trim()) newErrors.add(field);
    }
    setErrors(newErrors);
    return newErrors.size === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm(empty);
    } catch {
      setStatus('error');
    }
  };

  const err = (field: keyof FormData) => errors.has(field);

  const inputClass = (field: keyof FormData) =>
    `w-full px-3 py-2 rounded-md border text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
      err(field) ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

  const fieldLabel = (text: string, field: keyof FormData, req = false) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {text}{req && <span className="text-red-500 ml-1">*</span>}
      {err(field) && <span className="text-red-500 text-xs ml-2">Required</span>}
    </label>
  );

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Thank you for applying to iCANS. We&apos;ll review your application and be in touch soon.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="px-6 py-2 bg-[#1e2a4a] text-white rounded-lg text-sm font-medium hover:bg-[#2a3a63] transition"
          >
            Submit another application
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#1e2a4a]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-white tracking-tight">iCANS</span>
            <span className="w-px h-6 bg-white/20" />
            <span className="text-green-400 font-medium">Careers</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Join Our Team</h1>
          <p className="text-gray-300 mt-2 text-sm">
            Fields marked <span className="text-red-400">*</span> are required.
          </p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Personal Info */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('First name', 'firstName', true)}
              <input className={inputClass('firstName')} value={form.firstName} onChange={set('firstName')} placeholder="Jane" />
            </div>
            <div>
              {fieldLabel('Last name', 'lastName', true)}
              <input className={inputClass('lastName')} value={form.lastName} onChange={set('lastName')} placeholder="Smith" />
            </div>
            <div>
              {fieldLabel('Email', 'email', true)}
              <input type="email" className={inputClass('email')} value={form.email} onChange={set('email')} placeholder="jane@example.com" />
            </div>
            <div>
              {fieldLabel('Phone', 'phone')}
              <input type="tel" className={inputClass('phone')} value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="sm:col-span-2">
              {fieldLabel('Street address', 'streetAddress')}
              <input className={inputClass('streetAddress')} value={form.streetAddress} onChange={set('streetAddress')} placeholder="123 Main St" />
            </div>
            <div>
              {fieldLabel('City', 'city')}
              <input className={inputClass('city')} value={form.city} onChange={set('city')} placeholder="Austin" />
            </div>
            <div>
              {fieldLabel('State', 'state')}
              <input className={inputClass('state')} value={form.state} onChange={set('state')} placeholder="TX" />
            </div>
            <div>
              {fieldLabel('ZIP code', 'zipCode')}
              <input className={inputClass('zipCode')} value={form.zipCode} onChange={set('zipCode')} placeholder="78701" />
            </div>
            <div>
              {fieldLabel('Country', 'country')}
              <input className={inputClass('country')} value={form.country} onChange={set('country')} placeholder="United States" />
            </div>
            <div className="sm:col-span-2">
              {fieldLabel('LinkedIn or Portfolio URL', 'linkedinOrPortfolio')}
              <input type="url" className={inputClass('linkedinOrPortfolio')} value={form.linkedinOrPortfolio} onChange={set('linkedinOrPortfolio')} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        </section>

        {/* Role & Availability */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">Role & Availability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              {fieldLabel('Role applying for', 'roleApplyingFor', true)}
              <input className={inputClass('roleApplyingFor')} value={form.roleApplyingFor} onChange={set('roleApplyingFor')} placeholder="e.g. Senior Full-Stack Engineer" />
            </div>
            <div>
              {fieldLabel('How did you hear about us?', 'howDidYouHear')}
              <select className={inputClass('howDidYouHear')} value={form.howDidYouHear} onChange={set('howDidYouHear')}>
                <option value="">Select one</option>
                <option>Referral</option>
                <option>LinkedIn</option>
                <option>Job board</option>
                <option>iCANS website</option>
                <option>Social</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              {fieldLabel('Engagement type', 'engagementType', true)}
              <select className={inputClass('engagementType')} value={form.engagementType} onChange={set('engagementType')}>
                <option value="">Select one</option>
                <option>Contractor (independent)</option>
                <option>Contractor (corp-to-corp)</option>
                <option>Part-time</option>
                <option>Open to discussion</option>
              </select>
            </div>
            <div>
              {fieldLabel('Available start date', 'availableStartDate')}
              <input type="date" className={inputClass('availableStartDate')} value={form.availableStartDate} onChange={set('availableStartDate')} />
            </div>
            <div>
              {fieldLabel('Hours per week', 'hoursPerWeek')}
              <select className={inputClass('hoursPerWeek')} value={form.hoursPerWeek} onChange={set('hoursPerWeek')}>
                <option value="">Select one</option>
                <option>&lt;10</option>
                <option>10-20</option>
                <option>20-30</option>
                <option>30-40</option>
                <option>40+</option>
              </select>
            </div>
          </div>
        </section>

        {/* Compensation */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">Compensation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Compensation expectation', 'compensationExpectation')}
              <input className={inputClass('compensationExpectation')} value={form.compensationExpectation} onChange={set('compensationExpectation')} placeholder="e.g. $4,000/week" />
            </div>
            <div>
              {fieldLabel('Equity openness', 'equityOpenness')}
              <div className="space-y-2 pt-1">
                {['Equity important', 'Combo (cash + equity)', 'Cash only', 'Open to discussing'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="equityOpenness" value={opt} checked={form.equityOpenness === opt} onChange={set('equityOpenness')} className="accent-green-500" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Work Authorization */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">Work Authorization</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Work authorization', 'workAuthorization', true)}
              <select className={inputClass('workAuthorization')} value={form.workAuthorization} onChange={set('workAuthorization')}>
                <option value="">Select one</option>
                <option>US Citizen</option>
                <option>Green Card</option>
                <option>H-1B current</option>
                <option>H-1B transfer</option>
                <option>OPT</option>
                <option>TN</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              {fieldLabel('Requires sponsorship?', 'requiresSponsorship')}
              <div className="space-y-2 pt-1">
                {['No', 'Yes — now', 'Not now, but future'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="requiresSponsorship" value={opt} checked={form.requiresSponsorship === opt} onChange={set('requiresSponsorship')} className="accent-green-500" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">Experience & Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Years of experience', 'yearsOfExperience')}
              <select className={inputClass('yearsOfExperience')} value={form.yearsOfExperience} onChange={set('yearsOfExperience')}>
                <option value="">Select one</option>
                <option>&lt;1</option>
                <option>1-3</option>
                <option>4-6</option>
                <option>7-10</option>
                <option>10+</option>
              </select>
            </div>
            <div>
              {fieldLabel('Resume link', 'resumeLink')}
              <input type="url" className={inputClass('resumeLink')} value={form.resumeLink} onChange={set('resumeLink')} placeholder="https://drive.google.com/..." />
            </div>
            <div className="sm:col-span-2">
              {fieldLabel('Relevant skills', 'relevantSkills')}
              <input className={inputClass('relevantSkills')} value={form.relevantSkills} onChange={set('relevantSkills')} placeholder="e.g. React, Node.js, AWS, Python..." />
            </div>
            <div className="sm:col-span-2">
              {fieldLabel('Why iCANS?', 'whyICANS', true)}
              <textarea rows={4} className={inputClass('whyICANS')} value={form.whyICANS} onChange={set('whyICANS')} placeholder="Tell us what excites you about iCANS and why you'd be a great fit." />
            </div>
          </div>
        </section>

        {/* References */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">References</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Reference 1', 'reference1')}
              <input className={inputClass('reference1')} value={form.reference1} onChange={set('reference1')} placeholder="Name, email or phone" />
            </div>
            <div>
              {fieldLabel('Reference 2', 'reference2')}
              <input className={inputClass('reference2')} value={form.reference2} onChange={set('reference2')} placeholder="Name, email or phone" />
            </div>
          </div>
        </section>

        {/* Additional */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1e2a4a] border-b border-gray-100 pb-3">Anything else?</h2>
          {fieldLabel('Additional comments', 'additionalComments')}
          <textarea rows={4} className={inputClass('additionalComments')} value={form.additionalComments} onChange={set('additionalComments')} placeholder="Optional — anything else you'd like us to know." />
        </section>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            Something went wrong. Please try again or email <a href="mailto:onboarding@icans.ai" className="underline">onboarding@icans.ai</a>.
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pb-10">
          <p className="text-xs text-gray-400">Fields marked <span className="text-red-400">*</span> are required.</p>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3 bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm shadow-sm"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </span>
            ) : 'Submit Application'}
          </button>
        </div>
      </form>
    </main>
  );
}

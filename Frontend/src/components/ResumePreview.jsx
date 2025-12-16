import React from 'react';
import { useSelector } from 'react-redux';

function SkillPill({ name, level = 80, variant = 'indigo' }) {
  return (
    <div className="mb-3">
      <div className={`skill-pill ${variant} mr-2`}>{name}</div>
      <div className="w-full mt-2 skill-bar"><i style={{ width: `${level}%` }} /></div>
    </div>
  );
}

export default function ResumePreview() {
  const resumeData = useSelector((s) => s.editResume?.resumeData || {});

  const skills = (resumeData?.skills && resumeData.skills.length)
    ? resumeData.skills.map(s => ({ name: s.name || s }))
    : [
      { name: 'Prompt Engineering', level: 92 },
      { name: 'Generative AI', level: 90 },
      { name: 'LLM Fine-tuning', level: 85 },
      { name: 'Python', level: 88 },
    ];

  return (
    <div className="resume-shell">
      <div className="resume-card">
        <aside className="resume-sidebar">
          <div className="mb-6">
            <div className="text-sm contact-item">{resumeData?.email}</div>
            {resumeData?.phone && <div className="text-sm contact-item mt-2">{resumeData.phone}</div>}
            {resumeData?.address && <div className="text-sm contact-item mt-2">{resumeData.address}</div>}
          </div>

          <div className="mb-6">
            <div className="section-heading text-white text-lg">Skills</div>
            <div className="mt-3 space-y-2">
              {skills.map((sk, i) => (
                <SkillPill key={i} name={sk.name} level={sk.level || 80} variant={i % 3 === 0 ? 'indigo' : (i % 3 === 1 ? 'green' : 'gray')} />
              ))}
            </div>
          </div>

          <div>
            <div className="section-heading text-white text-lg">Contact</div>
            <div className="mt-3 text-sm text-gray-300">
              {resumeData?.linkedin && <div><a className="underline" href={resumeData.linkedin}>{resumeData.linkedin}</a></div>}
              {resumeData?.website && <div><a className="underline" href={resumeData.website}>{resumeData.website}</a></div>}
            </div>
          </div>
        </aside>

        <main className="resume-main">
          <header className="mb-4">
            <div className="text-center">
              <h1 className="elite-name">{resumeData?.firstName} {resumeData?.lastName}</h1>
              <div className="mt-3 text-sm text-gray-600">{resumeData?.jobTitle}</div>
            </div>
          </header>

          {resumeData?.summary && (
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="section-heading text-xl">Professional Summary</h2>
                <div className="section-title-accent" />
              </div>
              <div className="mt-3 text-sm text-gray-700">{resumeData.summary}</div>
            </section>
          )}

          {resumeData?.experience && resumeData.experience.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="section-heading text-xl">Experience</h2>
                <div className="section-title-accent" />
              </div>
              <div className="mt-4 space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <article key={idx} className="glass-card p-4">
                    <div className="job-line">
                      <div>
                        <div className="font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>{exp.title}</div>
                        <div className="job-company text-sm">{exp.companyName}</div>
                      </div>
                      <div className="text-sm text-gray-500">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : (exp.currentlyWorking ? ' – Present' : '')}</div>
                    </div>
                    {exp.workSummary && <div className="mt-2 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }} />}
                  </article>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="section-heading text-xl">Skills</h2>
                <div className="section-title-accent" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {skills.map((s, i) => (
                  <div key={i} className="p-3 glass-card">
                    <div className="font-medium">{s.name}</div>
                    <div className="mt-2 skill-bar"><i style={{ width: `${s.level || 80}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resumeData?.education && resumeData.education.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="section-heading text-xl">Education</h2>
                <div className="section-title-accent" />
              </div>
              <div className="mt-4 space-y-3">
                {resumeData.education.map((edu, i) => (
                  <div key={i} className="glass-card p-4">
                    <div className="font-bold">{edu.universityName}</div>
                    <div className="text-sm text-gray-600">{edu.degree} {edu.major ? `· ${edu.major}` : ''}</div>
                    <div className="text-sm text-gray-500 mt-2">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

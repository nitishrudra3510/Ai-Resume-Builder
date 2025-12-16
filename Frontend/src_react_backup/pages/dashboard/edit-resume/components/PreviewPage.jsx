import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  
  useEffect(() => {
    console.log("PreviewPage rendered");
  }, [resumeData]);

  return (
    <div className="w-full h-full p-14 bg-white" style={{ fontFamily: "Arial, Inter, sans-serif" }}>
      {/* Header - Name and Contact */}
      <div className="text-center mb-2">
        <h1 className="text-4xl font-bold" style={{ fontSize: "28pt", fontWeight: 700 }}>
          {resumeData?.firstName} {resumeData?.lastName}
        </h1>
        <div className="border-b-2 border-gray-900 my-2 mx-auto" style={{ width: "80%" }}></div>
      </div>

      {/* Contact Information */}
      <div className="text-center text-sm mb-4">
        <div className="inline-flex gap-4 justify-center text-xs">
          {resumeData?.email && <span>{resumeData.email}</span>}
          {resumeData?.phone && <span>|</span>}
          {resumeData?.phone && <span>{resumeData.phone}</span>}
          {resumeData?.address && <span>|</span>}
          {resumeData?.address && <span>{resumeData.address}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData?.summary && (
        <div className="mb-4">
          <h2 className="font-bold text-sm mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-xs leading-relaxed text-justify">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData?.experience && resumeData?.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-sm mb-2 uppercase tracking-wide">Professional Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs">{exp?.title}</span>
                <span className="text-xs">{exp?.startDate}{exp?.endDate ? ` – ${exp?.endDate}` : exp?.currentlyWorking ? " – Present" : ""}</span>
              </div>
              <div className="text-xs italic mb-1">
                {exp?.companyName}
                {exp?.city && `, ${exp.city}`}
                {exp?.state && `, ${exp.state}`}
              </div>
              {exp?.workSummary && (
                <div className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.workSummary }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData?.skills && resumeData?.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-sm mb-2 uppercase tracking-wide">Skills</h2>
          <div className="text-xs">
            {resumeData.skills.map((skill, index) => (
              <span key={index}>
                {skill.name}
                {index < resumeData.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData?.education && resumeData?.education.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-sm mb-2 uppercase tracking-wide">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs">{edu?.universityName}</span>
                <span className="text-xs">{edu?.startDate}{edu?.endDate ? ` – ${edu?.endDate}` : ""}</span>
              </div>
              <div className="text-xs">
                {edu?.degree}
                {edu?.major && ` in ${edu.major}`}
                {edu?.grade && ` | ${edu.gradeType}: ${edu.grade}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resumeData?.projects && resumeData?.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-sm mb-2 uppercase tracking-wide">Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="font-bold text-xs mb-1">{project?.projectName}</div>
              {project?.techStack && (
                <div className="text-xs italic mb-1">Tech: {project.techStack}</div>
              )}
              {project?.projectSummary && (
                <div className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: project.projectSummary }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PreviewPage;

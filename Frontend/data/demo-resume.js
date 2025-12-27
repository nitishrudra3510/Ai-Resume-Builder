// Demo resume data for testing the frontend
const demoResumeData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  address: "San Francisco, CA",
  jobTitle: "Senior Software Engineer",
  summary: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading development teams to deliver high-quality products.",
  experience: [
    {
      title: "Senior Software Engineer",
      companyName: "Tech Innovations Inc.",
      startDate: "Jan 2022",
      endDate: "Present",
      workSummary: "Lead a team of 4 developers in building scalable web applications. Implemented microservices architecture that improved system performance by 40%. Mentored junior developers and established coding standards."
    },
    {
      title: "Software Engineer",
      companyName: "Digital Solutions LLC",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      workSummary: "Developed and maintained React-based web applications serving 100K+ users. Collaborated with cross-functional teams to deliver features on time. Optimized database queries resulting in 30% faster load times."
    },
    {
      title: "Junior Developer",
      companyName: "StartupXYZ",
      startDate: "Aug 2019",
      endDate: "May 2020",
      workSummary: "Built responsive web interfaces using HTML, CSS, and JavaScript. Participated in agile development process and contributed to code reviews. Gained experience in modern development workflows."
    }
  ],
  skills: [
    { name: "JavaScript" },
    { name: "React" },
    { name: "Node.js" },
    { name: "Python" },
    { name: "AWS" },
    { name: "Docker" },
    { name: "MongoDB" },
    { name: "PostgreSQL" }
  ],
  education: [
    {
      universityName: "University of California, Berkeley",
      degree: "Bachelor of Science",
      major: "Computer Science",
      startDate: "Sep 2015",
      endDate: "May 2019"
    }
  ]
};

// Export for use in testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = demoResumeData;
}

// Make available globally for browser testing
if (typeof window !== 'undefined') {
  window.demoResumeData = demoResumeData;
}
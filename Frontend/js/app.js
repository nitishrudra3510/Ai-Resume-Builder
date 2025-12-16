// State management (simple vanilla JS state)
const appState = {
  currentUser: null,
  resumes: [],
  currentResume: null,
  isLoading: false
};

// DOM elements
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const navbar = document.getElementById('navbar');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormEl = document.getElementById('loginFormEl');
const registerFormEl = document.getElementById('registerFormEl');
const toggleToRegister = document.getElementById('toggleToRegister');
const toggleToLogin = document.getElementById('toggleToLogin');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardLink = document.getElementById('dashboardLink');
const createResumeBtn = document.getElementById('createResumeBtn');
const resumesList = document.getElementById('resumesList');
const editorModal = document.getElementById('editorModal');
const closeEditorBtn = document.getElementById('closeEditorBtn');
const cancelEditorBtn = document.getElementById('cancelEditorBtn');
const resumeForm = document.getElementById('resumeForm');
const resumePreview = document.getElementById('resumePreview');
const toast = document.getElementById('toast');

// Toast notification
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Toggle between login and register forms
toggleToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
});

toggleToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
});

// Login form submission
loginFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    appState.isLoading = true;
    const res = await AuthAPI.login(email, password);
    appState.currentUser = res.data.user;
    localStorage.setItem('user', JSON.stringify(res.data.user));
    showToast('Login successful!', 'success');
    switchToDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    appState.isLoading = false;
  }
});

// Register form submission
registerFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    appState.isLoading = true;
    const res = await AuthAPI.register(fullName, email, password);
    appState.currentUser = res.data.user;
    localStorage.setItem('user', JSON.stringify(res.data.user));
    showToast('Registration successful!', 'success');
    switchToDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    appState.isLoading = false;
  }
});

// Logout
logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  await AuthAPI.logout();
  appState.currentUser = null;
  appState.resumes = [];
  appState.currentResume = null;
  switchToAuth();
  showToast('Logged out successfully!', 'success');
});

// Dashboard link
dashboardLink.addEventListener('click', (e) => {
  e.preventDefault();
  switchToDashboard();
});

// Create resume button
createResumeBtn.addEventListener('click', () => {
  appState.currentResume = null;
  document.getElementById('editorTitle').textContent = 'Create Resume';
  resumeForm.reset();
  renderResumePreview({});
  editorModal.style.display = 'flex';
});

// Close editor
closeEditorBtn.addEventListener('click', () => {
  editorModal.style.display = 'none';
});

cancelEditorBtn.addEventListener('click', () => {
  editorModal.style.display = 'none';
});

// Save resume
resumeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    jobTitle: document.getElementById('jobTitle').value,
    summary: document.getElementById('summary').value,
    experience: getExperienceFromForm(),
    skills: getSkillsFromForm(),
    education: getEducationFromForm(),
  };

  try {
    appState.isLoading = true;
    if (appState.currentResume) {
      await ResumeAPI.updateResume(appState.currentResume._id, formData);
      showToast('Resume updated!', 'success');
    } else {
      const res = await ResumeAPI.createResume(formData.firstName + ' ' + formData.lastName);
      formData.title = res.data.resume.title;
      formData._id = res.data.resume._id;
      formData.themeColor = res.data.resume.themeColor;
      await ResumeAPI.updateResume(formData._id, formData);
      showToast('Resume created!', 'success');
    }
    editorModal.style.display = 'none';
    await loadResumes();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    appState.isLoading = false;
  }
});

// Switch views
function switchToAuth() {
  authContainer.style.display = 'flex';
  dashboardContainer.style.display = 'none';
  navbar.style.display = 'none';
}

function switchToDashboard() {
  authContainer.style.display = 'none';
  dashboardContainer.style.display = 'block';
  navbar.style.display = 'flex';
  loadResumes();
}

// Load resumes
async function loadResumes() {
  try {
    appState.isLoading = true;
    const res = await ResumeAPI.getAllResumes();
    appState.resumes = res.data || [];
    renderResumesList();
  } catch (error) {
    showToast(error.message, 'error');
    appState.resumes = [];
    renderResumesList();
  } finally {
    appState.isLoading = false;
  }
}

// Render resumes list
function renderResumesList() {
  resumesList.innerHTML = '';

  if (appState.resumes.length === 0) {
    resumesList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">No resumes yet. Create one to get started!</p>';
    return;
  }

  appState.resumes.forEach((resume) => {
    const card = document.createElement('div');
    card.className = 'resume-card';
    card.innerHTML = `
      <h3>${resume.title}</h3>
      <p>${resume.firstName || 'Untitled'}</p>
      <div class="resume-card-actions">
        <button class="btn btn-sm btn-primary edit-btn" data-id="${resume._id}">Edit</button>
        <button class="btn btn-sm btn-secondary view-btn" data-id="${resume._id}">View</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${resume._id}">Delete</button>
      </div>
    `;

    card.querySelector('.edit-btn').addEventListener('click', () => editResume(resume._id));
    card.querySelector('.view-btn').addEventListener('click', () => viewResume(resume._id));
    card.querySelector('.delete-btn').addEventListener('click', () => deleteResume(resume._id));

    resumesList.appendChild(card);
  });
}

// Edit resume
async function editResume(id) {
  try {
    const res = await ResumeAPI.getResume(id);
    appState.currentResume = res.data;
    document.getElementById('editorTitle').textContent = 'Edit Resume';
    
    // Populate form
    document.getElementById('firstName').value = res.data.firstName || '';
    document.getElementById('lastName').value = res.data.lastName || '';
    document.getElementById('email').value = res.data.email || '';
    document.getElementById('phone').value = res.data.phone || '';
    document.getElementById('address').value = res.data.address || '';
    document.getElementById('jobTitle').value = res.data.jobTitle || '';
    document.getElementById('summary').value = res.data.summary || '';

    renderExperienceForm(res.data.experience || []);
    renderSkillsForm(res.data.skills || []);
    renderEducationForm(res.data.education || []);

    renderResumePreview(res.data);
    editorModal.style.display = 'flex';
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Delete resume
async function deleteResume(id) {
  if (confirm('Are you sure you want to delete this resume?')) {
    try {
      await ResumeAPI.deleteResume(id);
      showToast('Resume deleted!', 'success');
      await loadResumes();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
}

// View resume (modal with full preview)
async function viewResume(id) {
  try {
    const res = await ResumeAPI.getResume(id);
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${res.data.firstName} ${res.data.lastName} - Resume</title>
        <style>
          ${getResumeStyles()}
        </style>
      </head>
      <body>
        ${renderResumeHTML(res.data)}
      </body>
      </html>
    `);
    printWindow.document.close();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Render form sections
function renderExperienceForm(experience) {
  const list = document.getElementById('experienceList');
  list.innerHTML = '';
  
  experience.forEach((exp, index) => {
    const div = document.createElement('div');
    div.className = 'form-section-item';
    div.innerHTML = `
      <input type="text" placeholder="Job Title" value="${exp.title || ''}" class="exp-title" data-index="${index}">
      <input type="text" placeholder="Company Name" value="${exp.companyName || ''}" class="exp-company" data-index="${index}">
      <input type="text" placeholder="Start Date" value="${exp.startDate || ''}" class="exp-start" data-index="${index}">
      <input type="text" placeholder="End Date" value="${exp.endDate || ''}" class="exp-end" data-index="${index}">
      <textarea placeholder="Work Summary" class="exp-summary" data-index="${index}">${exp.workSummary || ''}</textarea>
      <button type="button" class="btn btn-sm btn-danger remove-exp" data-index="${index}">Remove</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll('.remove-exp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = btn.dataset.index;
      const exp = getExperienceFromForm();
      exp.splice(index, 1);
      renderExperienceForm(exp);
    });
  });
}

function renderSkillsForm(skills) {
  const list = document.getElementById('skillsList');
  list.innerHTML = '';
  
  skills.forEach((skill, index) => {
    const div = document.createElement('div');
    div.className = 'form-section-item skill-item';
    div.innerHTML = `
      <input type="text" placeholder="Skill" value="${typeof skill === 'string' ? skill : skill.name || ''}" class="skill-name" data-index="${index}">
      <button type="button" class="btn btn-sm btn-danger remove-skill" data-index="${index}">Remove</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll('.remove-skill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = btn.dataset.index;
      const skills = getSkillsFromForm();
      skills.splice(index, 1);
      renderSkillsForm(skills);
    });
  });
}

function renderEducationForm(education) {
  const list = document.getElementById('educationList');
  list.innerHTML = '';
  
  education.forEach((edu, index) => {
    const div = document.createElement('div');
    div.className = 'form-section-item';
    div.innerHTML = `
      <input type="text" placeholder="University" value="${edu.universityName || ''}" class="edu-uni" data-index="${index}">
      <input type="text" placeholder="Degree" value="${edu.degree || ''}" class="edu-degree" data-index="${index}">
      <input type="text" placeholder="Major" value="${edu.major || ''}" class="edu-major" data-index="${index}">
      <input type="text" placeholder="Start Date" value="${edu.startDate || ''}" class="edu-start" data-index="${index}">
      <input type="text" placeholder="End Date" value="${edu.endDate || ''}" class="edu-end" data-index="${index}">
      <button type="button" class="btn btn-sm btn-danger remove-edu" data-index="${index}">Remove</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll('.remove-edu').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = btn.dataset.index;
      const edu = getEducationFromForm();
      edu.splice(index, 1);
      renderEducationForm(edu);
    });
  });
}

// Get form data helpers
function getExperienceFromForm() {
  const experience = [];
  document.querySelectorAll('.exp-title').forEach((el) => {
    const index = el.dataset.index;
    experience.push({
      title: el.value,
      companyName: document.querySelector(`.exp-company[data-index="${index}"]`).value,
      startDate: document.querySelector(`.exp-start[data-index="${index}"]`).value,
      endDate: document.querySelector(`.exp-end[data-index="${index}"]`).value,
      workSummary: document.querySelector(`.exp-summary[data-index="${index}"]`).value,
    });
  });
  return experience;
}

function getSkillsFromForm() {
  const skills = [];
  document.querySelectorAll('.skill-name').forEach((el) => {
    if (el.value.trim()) {
      skills.push({ name: el.value.trim() });
    }
  });
  return skills;
}

function getEducationFromForm() {
  const education = [];
  document.querySelectorAll('.edu-uni').forEach((el) => {
    const index = el.dataset.index;
    education.push({
      universityName: el.value,
      degree: document.querySelector(`.edu-degree[data-index="${index}"]`).value,
      major: document.querySelector(`.edu-major[data-index="${index}"]`).value,
      startDate: document.querySelector(`.edu-start[data-index="${index}"]`).value,
      endDate: document.querySelector(`.edu-end[data-index="${index}"]`).value,
    });
  });
  return education;
}

// Add buttons for adding more
document.getElementById('addExperienceBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const exp = getExperienceFromForm();
  exp.push({ title: '', companyName: '', startDate: '', endDate: '', workSummary: '' });
  renderExperienceForm(exp);
});

document.getElementById('addSkillBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const skills = getSkillsFromForm();
  skills.push({ name: '' });
  renderSkillsForm(skills);
});

document.getElementById('addEducationBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const edu = getEducationFromForm();
  edu.push({ universityName: '', degree: '', major: '', startDate: '', endDate: '' });
  renderEducationForm(edu);
});

// Render resume preview (Elite 2025 design)
function renderResumePreview(data) {
  const preview = document.getElementById('resumePreview');
  preview.innerHTML = renderResumeHTML(data);
  
  // Update on form changes
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('change', () => {
      const updated = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        jobTitle: document.getElementById('jobTitle').value,
        summary: document.getElementById('summary').value,
        experience: getExperienceFromForm(),
        skills: getSkillsFromForm(),
        education: getEducationFromForm(),
      };
      renderResumePreview(updated);
    });
  });
}

function renderResumeHTML(data) {
  const skills = (data.skills || []).slice(0, 6);
  const experience = data.experience || [];
  const education = data.education || [];

  return `
    <div class="elite-resume">
      <div class="resume-shell">
        <div class="resume-card">
          <aside class="resume-sidebar">
            <div class="sidebar-section">
              <div class="contact-item">${data.email || ''}</div>
              ${data.phone ? `<div class="contact-item">${data.phone}</div>` : ''}
              ${data.address ? `<div class="contact-item">${data.address}</div>` : ''}
            </div>

            ${skills.length > 0 ? `
              <div class="sidebar-section">
                <div class="section-heading-sidebar">Skills</div>
                <div class="skills-sidebar">
                  ${skills.map(s => `<div class="skill-pill">${s.name || ''}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </aside>

          <main class="resume-main">
            <header class="resume-header">
              <h1 class="elite-name">${data.firstName || ''} ${data.lastName || ''}</h1>
              ${data.jobTitle ? `<div class="job-title">${data.jobTitle}</div>` : ''}
            </header>

            ${data.summary ? `
              <section class="resume-section">
                <h2 class="section-heading">Professional Summary</h2>
                <p class="section-text">${data.summary}</p>
              </section>
            ` : ''}

            ${experience.length > 0 ? `
              <section class="resume-section">
                <h2 class="section-heading">Experience</h2>
                ${experience.map(exp => `
                  <div class="resume-item">
                    <div class="item-header">
                      <h3 class="item-title">${exp.title || ''}</h3>
                      <span class="item-date">${exp.startDate || ''} – ${exp.endDate || 'Present'}</span>
                    </div>
                    <p class="item-subtitle">${exp.companyName || ''}</p>
                    ${exp.workSummary ? `<p class="item-text">${exp.workSummary}</p>` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}

            ${education.length > 0 ? `
              <section class="resume-section">
                <h2 class="section-heading">Education</h2>
                ${education.map(edu => `
                  <div class="resume-item">
                    <div class="item-header">
                      <h3 class="item-title">${edu.universityName || ''}</h3>
                      <span class="item-date">${edu.startDate || ''} – ${edu.endDate || ''}</span>
                    </div>
                    <p class="item-subtitle">${edu.degree || ''} ${edu.major ? `in ${edu.major}` : ''}</p>
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </main>
        </div>
      </div>
    </div>
  `;
}

function getResumeStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Playfair+Display:wght@400;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui; background: #f9fafb; }
    .elite-resume { padding: 20px; }
    .resume-shell { background: white; margin: 0 auto; max-width: 1000px; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06); border-radius: 12px; }
    .resume-card { display: flex; gap: 30px; padding: 30px; }
    .resume-sidebar { width: 20%; background: #0f172a; color: white; padding: 20px; border-radius: 10px; }
    .resume-main { width: 80%; }
    .sidebar-section { margin-bottom: 25px; }
    .contact-item { font-size: 13px; color: rgba(255, 255, 255, 0.9); margin-bottom: 8px; }
    .section-heading-sidebar { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; color: white; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
    .skills-sidebar { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-pill { background: rgba(79, 70, 229, 0.15); color: #3730a3; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .resume-header { text-align: center; margin-bottom: 20px; }
    .elite-name { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 38pt; background: linear-gradient(90deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 5px; }
    .job-title { color: #666; font-size: 14px; }
    .resume-section { margin-bottom: 20px; }
    .section-heading { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 18px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 8px; border-bottom: 3px solid #4f46e5; }
    .section-text { font-size: 13px; color: #374151; line-height: 1.6; margin-top: 10px; }
    .resume-item { margin-bottom: 15px; }
    .item-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .item-title { font-weight: 700; color: #0f172a; }
    .item-subtitle { font-style: italic; color: #666; font-size: 13px; margin-top: 2px; }
    .item-text { font-size: 13px; color: #374151; margin-top: 6px; }
    .item-date { color: #999; font-size: 12px; }
    @media print { body { margin: 0; padding: 0; background: white; } }
  `;
}

// Check if already logged in
function initApp() {
  const user = localStorage.getItem('user');
  const tkn = localStorage.getItem('token');
  
  if (user && tkn) {
    AuthAPI.setToken(tkn);
    appState.currentUser = JSON.parse(user);
    switchToDashboard();
  } else {
    switchToAuth();
  }
}

// Initialize app
initApp();

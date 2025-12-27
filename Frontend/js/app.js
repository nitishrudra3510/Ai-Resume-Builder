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

// Toast notification with enhanced styling
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  
  // Auto-hide after 4 seconds
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
  
  // Add click to dismiss
  toast.onclick = () => {
    toast.style.display = 'none';
  };
}

// Toggle between login and register forms
toggleToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Switching to register form');
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
});

toggleToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Switching to login form');
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
});

// Login form submission
loginFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    setButtonLoading(submitBtn, true);
    appState.isLoading = true;
    const res = await AuthAPI.login(email, password);
    appState.currentUser = res.data.user;
    localStorage.setItem('user', JSON.stringify(res.data.user));
    showToast('Welcome back! Login successful.', 'success');
    switchToDashboard();
  } catch (error) {
    showToast(error.message || 'Login failed. Please try again.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
    appState.isLoading = false;
  }
});

// Register form submission
registerFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const fullName = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Basic validation first
  if (!fullName) {
    showToast('Please enter your name', 'error');
    return;
  }

  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters long', 'error');
    return;
  }

  // Split name more intelligently
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || ''; // Join remaining parts, can be empty

  try {
    setButtonLoading(submitBtn, true);
    appState.isLoading = true;
    const res = await AuthAPI.register(fullName, email, password);
    appState.currentUser = res.data.user;
    localStorage.setItem('user', JSON.stringify(res.data.user));
    showToast('Account created successfully! Welcome aboard.', 'success');
    switchToDashboard();
  } catch (error) {
    showToast(error.message || 'Registration failed. Please try again.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
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
  const submitBtn = e.target.querySelector('button[type="submit"]');

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

  // Basic validation - only require first name and email
  if (!formData.firstName?.trim()) {
    showToast('First name is required', 'error');
    return;
  }

  if (!formData.email?.trim()) {
    showToast('Email is required', 'error');
    return;
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  try {
    setButtonLoading(submitBtn, true);
    appState.isLoading = true;
    
    if (appState.currentResume) {
      await ResumeAPI.updateResume(appState.currentResume._id, formData);
      showToast('Resume updated successfully!', 'success');
    } else {
      const resumeTitle = `${formData.firstName} ${formData.lastName || ''}`.trim();
      const res = await ResumeAPI.createResume(resumeTitle);
      formData.title = res.data.resume.title;
      formData._id = res.data.resume._id;
      formData.themeColor = res.data.resume.themeColor;
      await ResumeAPI.updateResume(formData._id, formData);
      showToast('Resume created successfully!', 'success');
    }
    
    editorModal.style.display = 'none';
    await loadResumes();
  } catch (error) {
    showToast(error.message || 'Failed to save resume. Please try again.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
    appState.isLoading = false;
  }
});

// Switch views
function switchToAuth() {
  console.log('Switching to auth view');
  authContainer.style.display = 'flex';
  dashboardContainer.style.display = 'none';
  navbar.style.display = 'none';
  
  // Ensure login form is active by default
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  console.log('Login form should be visible now');
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
  
  // Update stats
  document.getElementById('totalResumes').textContent = appState.resumes.length;

  if (appState.resumes.length === 0) {
    resumesList.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">📄</div>
        <h3 style="color: var(--text-secondary); margin-bottom: 0.5rem;">No resumes yet</h3>
        <p style="color: var(--text-muted);">Create your first professional resume to get started!</p>
      </div>
    `;
    return;
  }

  appState.resumes.forEach((resume) => {
    const card = document.createElement('div');
    card.className = 'resume-card';
    card.innerHTML = `
      <h3>${resume.title || 'Untitled Resume'}</h3>
      <p>${resume.firstName ? `${resume.firstName} ${resume.lastName || ''}`.trim() : 'No name set'}</p>
      <div class="resume-card-actions">
        <button class="btn btn-sm btn-primary edit-btn" data-id="${resume._id}">
          <span class="btn-icon">✏️</span>
          Edit
        </button>
        <button class="btn btn-sm btn-secondary view-btn" data-id="${resume._id}">
          <span class="btn-icon">👁️</span>
          View
        </button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${resume._id}">
          <span class="btn-icon">🗑️</span>
          Delete
        </button>
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
  
  // Update on form changes with auto-save
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
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
      scheduleAutoSave();
    });
  });
}

// Check if already logged in
function initApp() {
  console.log('Initializing app...');
  const user = localStorage.getItem('user');
  const tkn = localStorage.getItem('token');
  
  console.log('User in localStorage:', user ? 'exists' : 'none');
  console.log('Token in localStorage:', tkn ? 'exists' : 'none');
  
  if (user && tkn) {
    AuthAPI.setToken(tkn);
    appState.currentUser = JSON.parse(user);
    console.log('User logged in, switching to dashboard');
    switchToDashboard();
  } else {
    console.log('No user found, switching to auth');
    switchToAuth();
  }
  
  // Add some welcome animations
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
  }, 100);
}

function renderResumeHTML(data) {
  const skills = (data.skills || []).slice(0, 8);
  const experience = data.experience || [];
  const education = data.education || [];

  return `
    <div class="elite-resume">
      <div class="resume-shell">
        <div class="resume-card">
          <aside class="resume-sidebar">
            <div class="sidebar-section">
              <div class="section-heading-sidebar">Contact</div>
              ${data.email ? `<div class="contact-item">📧 ${data.email}</div>` : ''}
              ${data.phone ? `<div class="contact-item">📱 ${data.phone}</div>` : ''}
              ${data.address ? `<div class="contact-item">📍 ${data.address}</div>` : ''}
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Poppins:wght@400;600;700;900&display=swap');
    
    :root {
      --primary: #6366f1;
      --secondary: #8b5cf6;
      --white: #ffffff;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-600: #4b5563;
      --gray-800: #1f2937;
      --gray-900: #111827;
      --text-primary: var(--gray-900);
      --text-secondary: var(--gray-600);
      --text-muted: #9ca3af;
      --radius-lg: 0.75rem;
      --radius-xl: 1rem;
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', system-ui; 
      background: var(--gray-50); 
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    .elite-resume { 
      padding: 2rem; 
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .resume-shell { 
      background: var(--white); 
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    
    .resume-card { 
      display: flex; 
      gap: 2rem; 
      padding: 2rem; 
    }
    
    .resume-sidebar { 
      width: 30%; 
      background: linear-gradient(135deg, var(--gray-800) 0%, var(--gray-900) 100%); 
      color: var(--white); 
      padding: 2rem; 
      border-radius: var(--radius-lg); 
    }
    
    .resume-main { 
      width: 70%; 
    }
    
    .sidebar-section { 
      margin-bottom: 2rem; 
    }
    
    .sidebar-section:not(:last-child) {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .contact-item { 
      font-size: 0.875rem; 
      color: rgba(255, 255, 255, 0.9); 
      margin-bottom: 0.5rem; 
      word-wrap: break-word; 
    }
    
    .section-heading-sidebar { 
      font-family: 'Poppins', sans-serif; 
      font-weight: 700; 
      font-size: 0.875rem; 
      color: var(--white); 
      text-transform: uppercase; 
      letter-spacing: 0.1em; 
      margin-bottom: 1rem; 
    }
    
    .skills-sidebar { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 0.5rem; 
    }
    
    .skill-pill { 
      background: rgba(99, 102, 241, 0.2); 
      color: #a5b4fc; 
      padding: 0.375rem 0.75rem; 
      border-radius: 1rem; 
      font-size: 0.75rem; 
      font-weight: 600; 
    }
    
    .resume-header { 
      text-align: center; 
      margin-bottom: 2rem; 
      padding-bottom: 1.5rem;
      border-bottom: 3px solid var(--primary);
    }
    
    .elite-name { 
      font-family: 'Poppins', sans-serif; 
      font-weight: 900; 
      font-size: 2.5rem; 
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); 
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent; 
      margin-bottom: 0.5rem; 
    }
    
    .job-title { 
      color: var(--text-secondary); 
      font-size: 1rem; 
      font-weight: 600;
    }
    
    .resume-section { 
      margin-bottom: 1.5rem; 
    }
    
    .section-heading { 
      font-family: 'Poppins', sans-serif; 
      font-weight: 700; 
      font-size: 1rem; 
      color: var(--text-primary); 
      text-transform: uppercase; 
      letter-spacing: 0.1em; 
      padding-bottom: 0.5rem; 
      border-bottom: 3px solid var(--primary); 
      margin-bottom: 1rem;
    }
    
    .section-text { 
      font-size: 0.875rem; 
      color: var(--text-secondary); 
      line-height: 1.6; 
    }
    
    .resume-item { 
      margin-bottom: 1rem; 
    }
    
    .item-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      gap: 1rem; 
      margin-bottom: 0.25rem;
    }
    
    .item-title { 
      font-weight: 700; 
      color: var(--text-primary); 
      font-size: 0.875rem;
    }
    
    .item-subtitle { 
      font-style: italic; 
      color: var(--text-secondary); 
      font-size: 0.8125rem; 
    }
    
    .item-text { 
      font-size: 0.8125rem; 
      color: var(--text-secondary); 
      margin-top: 0.5rem; 
      line-height: 1.5;
    }
    
    .item-date { 
      color: var(--text-muted); 
      font-size: 0.8125rem; 
      white-space: nowrap;
    }
    
    @media print { 
      body { margin: 0; padding: 0; background: var(--white); } 
      .elite-resume { padding: 0; }
      .resume-shell { box-shadow: none; }
    }
    
    @media (max-width: 768px) {
      .resume-card { flex-direction: column; }
      .resume-sidebar, .resume-main { width: 100%; }
      .elite-name { font-size: 2rem; }
    }
  `;
}

// Add loading states to buttons
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.style.opacity = '0.7';
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    button.innerHTML = `<span class="loader"></span> Loading...`;
  } else {
    button.disabled = false;
    button.style.opacity = '1';
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
    }
  }
}

// Enhanced form validation
function validateForm(formData) {
  const errors = [];
  
  if (!formData.firstName?.trim()) {
    errors.push('First name is required');
  }
  
  // Last name is optional - no validation needed
  
  if (!formData.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape key to close modals
  if (e.key === 'Escape') {
    if (editorModal.style.display === 'flex') {
      editorModal.style.display = 'none';
    }
  }
  
  // Ctrl/Cmd + N to create new resume
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    if (appState.currentUser && dashboardContainer.style.display !== 'none') {
      createResumeBtn.click();
    }
  }
});

// Add auto-save functionality
let autoSaveTimeout;
function scheduleAutoSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    if (appState.currentResume) {
      // Auto-save current resume
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
      
      ResumeAPI.updateResume(appState.currentResume._id, formData).catch(() => {
        // Silent fail for auto-save
      });
    }
  }, 2000); // Auto-save after 2 seconds of inactivity
}

// Initialize app
initApp();

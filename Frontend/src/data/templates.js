// Elite 2025 - single template export
const Elite2025 = {
  id: 'elite-2025',
  name: 'Elite 2025',
  description: 'Premium single-column ATS-aware resume template (2025).',
  settings: {
    fonts: { body: 'Inter', display: 'Playfair Display' },
    colors: { background: '#f9fafb', sidebar: '#0f172a', accentStart: '#4f46e5', accentEnd: '#7c3aed' },
    layout: 'single-column',
  },
  sections: [
    'contact',
    'summary',
    'experience',
    'skills',
    'education'
  ],
  defaults: {
    skillsOrder: [
      'Prompt Engineering',
      'Generative AI',
      'LLM Fine-tuning',
      'Python',
      'Machine Learning',
      'Data Engineering'
    ]
  }
};

export default [Elite2025];

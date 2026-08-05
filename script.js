const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const themeButton = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.setAttribute('aria-pressed', String(dark));
  themeColor.setAttribute('content', dark ? '#141511' : '#fffdf8');
  if (persist) {
    try { localStorage.setItem('theme', theme); } catch (_) { /* Theme still applies for this visit. */ }
  }
}

applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));

themeButton.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

systemTheme.addEventListener('change', (event) => {
  try {
    if (!localStorage.getItem('theme')) applyTheme(event.matches ? 'dark' : 'light');
  } catch (_) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navigation.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
});

const newsList = document.querySelector('.news-list');
const newsToggle = document.querySelector('#news-toggle');

newsToggle.addEventListener('click', () => {
  const expanded = newsList.classList.toggle('expanded');
  newsToggle.textContent = expanded ? 'Show less' : 'Show earlier news';
  newsToggle.setAttribute('aria-expanded', String(expanded));
});

document.querySelector('.filters').addEventListener('click', (event) => {
  const button = event.target.closest('.filter');
  if (!button) return;

  document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const selected = button.dataset.filter;

  document.querySelectorAll('.publication').forEach((publication) => {
    const tags = publication.dataset.tags.split(' ');
    publication.hidden = selected !== 'all' && !tags.includes(selected);
  });
});

const sections = [...document.querySelectorAll('.page-section')];
const navLinks = [...document.querySelectorAll('#site-nav a')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach((section) => observer.observe(section));
document.querySelector('#year').textContent = new Date().getFullYear();

const progressBar = document.querySelector('#scroll-progress');
let progressTicking = false;

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  progressTicking = false;
}

window.addEventListener('scroll', () => {
  if (progressTicking) return;
  progressTicking = true;
  window.requestAnimationFrame(updateScrollProgress);
}, { passive: true });

updateScrollProgress();

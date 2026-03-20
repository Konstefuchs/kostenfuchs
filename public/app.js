/* Socket-Pipeline-Logik bleibt aktiv (ohne sichtbare UI) */
const socket = io(window.location.origin, { path: '/socket.io' });

/* Dark Mode Toggle */
const THEME_KEY = 'kostenfuchs-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  localStorage.setItem(THEME_KEY, theme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
});

setTheme(getTheme());

/* Routing – #/auth = Auth-Seite, sonst Dashboard */
function updateRoute() {
  const isAuth = window.location.hash === '#/auth';
  document.getElementById('appContainer').style.display = isAuth ? 'none' : 'flex';
  document.getElementById('authPage').classList.toggle('active', isAuth);
}

window.addEventListener('hashchange', updateRoute);
updateRoute();

/* Auth UI – Tab-Wechsel, Formulare (noch keine echte Auth) */
document.querySelectorAll('.auth-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.auth-view').forEach((v) => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.view + 'View').classList.add('active');
  });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Login (UI only – Auth kommt später)');
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Signup (UI only – Auth kommt später)');
});

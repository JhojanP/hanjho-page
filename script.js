(function () {
  const data = window.PORTFOLIO || {};
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const savedTheme = localStorage.getItem('hanjho-theme');
  root.dataset.theme = savedTheme || 'dark';

  function updateThemeButton() {
    const light = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-label', light ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    themeButton.title = light ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
    themeButton.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
    document.querySelector('meta[name="theme-color"]').content = light ? '#f6f8fb' : '#0b1019';
  }
  updateThemeButton();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('hanjho-theme', root.dataset.theme);
    updateThemeButton();
  });

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navLinks.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open'); document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú');
  }));

  const links = {
    email: data.email ? `mailto:${data.email}` : '', linkedin: data.linkedin, github: data.github,
    whatsapp: data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : '', project: data.projectUrl
  };
  document.querySelectorAll('[data-link]').forEach(anchor => {
    const key = anchor.dataset.link, url = links[key];
    if (url) { anchor.href = url; if (!url.startsWith('mailto:')) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; } }
    else if (key === 'email') anchor.href = '#contacto';
    else { anchor.classList.add('link-placeholder'); anchor.title = 'Agrega el enlace en data.js'; }
  });
  if (data.email) {
    const emailLabel = document.querySelector('[data-value="emailLabel"]');
    if (emailLabel) emailLabel.textContent = data.email;
  }
  if (data.projectUrl) {
    const projectLink = document.querySelector('.project-link');
    projectLink.href = data.projectUrl; projectLink.target = '_blank'; projectLink.rel = 'noopener noreferrer';
    projectLink.innerHTML = 'Ver proyecto <span>↗</span>';
  }
  document.getElementById('year').textContent = data.currentYear || new Date().getFullYear();

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { 
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target); 
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.section, .stats, .final-cta').forEach(element => { element.classList.add('reveal'); observer.observe(element); });

  document.getElementById('contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!data.email) {
      form.querySelector('.form-status').textContent = 'Configura tu correo en data.js para activar el envío del formulario.';
      return;
    }
    const fields = new FormData(form);
    const subject = encodeURIComponent(fields.get('subject'));
    const body = encodeURIComponent(`Hola Jhojan,\n\n${fields.get('message')}\n\nNombre: ${fields.get('name')}\nCorreo: ${fields.get('email')}\nEmpresa: ${fields.get('company') || 'No indicada'}`);
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
    form.querySelector('.form-status').textContent = 'Se abrió tu aplicación de correo para completar el envío.';
  });
})();

/* Datos de ejemplo (puedes reemplazar por los tuyos o un JSON externo) */
let profiles = [];

const grid = document.getElementById('grid');

/* === CARGAR DATOS DESDE JSON === */
async function cargarDatos() {
  try {
    const respuesta = await fetch('Perfiles.json');
    profiles = await respuesta.json();
    renderGrid(profiles);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    grid.innerHTML = '<p style="padding:1rem;color:red;">Error al cargar los datos del anuario.</p>';
  }
}
cargarDatos();

/* Renderizar tarjetas */
function renderGrid(list) {
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<p style="padding:1rem;color:var(--muted)">No se encontraron resultados.</p>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement('button');
    card.className = 'card';
    card.setAttribute('aria-label', `Abrir perfil de ${p.name}`);
    card.innerHTML = `
      <img class="avatar" src="${p.avatar}" alt="Foto de ${p.name}">
      <div class="meta">
        <h3>${p.name}</h3>
        <p class="muted">${p.lema}</p>
      </div>
    `;
    card.addEventListener('click', () => openProfile(p.id));
    grid.appendChild(card);
  });
}
renderGrid(profiles);

/* Búsqueda y filtros */
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  const f = document.getElementById('filter').value;
  const filtered = profiles.filter(p => {
    const byText = (p.name + p.bio + p.proyectos.map(x => x.title).join(' ')).toLowerCase().includes(q);
    const byRole = f ? p.roles.includes(f) : true;
    return byText && byRole;
  });
  renderGrid(filtered);
});

document.getElementById('filter').addEventListener('change', () =>
  document.getElementById('search').dispatchEvent(new Event('input'))
);

/* Tema claro/oscuro */
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('tt_theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', current);
  localStorage.setItem('tt_theme', current);
});

/* Modal de perfil */
const modal = document.getElementById('modal');
const lb = document.getElementById('lightbox');

function openProfile(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return;

  document.getElementById('p-avatar').src = p.avatar;
  document.getElementById('p-avatar').alt = `Foto de ${p.name}`;
  document.getElementById('p-name').textContent = p.name;
  document.getElementById('p-lema').textContent = p.lema;
  document.getElementById('p-bio').textContent = p.bio;

  const logros = document.getElementById('p-logros');
  logros.innerHTML = '';
  p.logros.forEach(l => {
    const li = document.createElement('li');
    li.textContent = l;
    logros.appendChild(li);
  });

  const proy = document.getElementById('p-proyectos');
  proy.innerHTML = '';
  p.proyectos.forEach(pr => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${pr.link}" target="_blank" rel="noopener">${pr.title}</a>`;
    proy.appendChild(li);
  });

  const gallery = document.getElementById('p-gallery');
  gallery.innerHTML = '';
  p.gallery.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${p.name} - foto`;
    img.tabIndex = 0;
    img.addEventListener('click', () => openLightbox(src));
    img.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(src); });
    gallery.appendChild(img);
  });

  const vcont = document.getElementById('p-video');
  vcont.innerHTML = '';
  const acont = document.getElementById('p-audio');
  acont.innerHTML = '';

  if (p.videoEmbed) {
    vcont.innerHTML = `
      <iframe width="100%" height="360" src="${p.videoEmbed}" 
        title="Video de ${p.name}" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture ;
         web-share" "
        allowfullscreen></iframe>`;
  }

  if (p.audio) {
    if (p.audio.type === 'spotify' || p.audio.type === 'youtube') {
      acont.innerHTML = `<iframe src="${p.audio.src}" width="100%" height="90" frameborder="0" allow="encrypted-media"></iframe>`;
    } else if (p.audio.type === 'file') {
      acont.innerHTML = `<audio controls src="${p.audio.src}">Tu navegador no soporta audio.</audio>`;
    }
  }

  modal.setAttribute('open', '');
  modal.setAttribute('aria-hidden', 'false');
}

/* Cerrar modal */
document.getElementById('close').addEventListener('click', () => {
  modal.removeAttribute('open');
  modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.removeAttribute('open');
    modal.setAttribute('aria-hidden', 'true');
  }
});

/* Lightbox (galería) */
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  lb.style.display = 'flex';
  lb.setAttribute('aria-hidden', 'false');
}

lb.addEventListener('click', () => {
  lb.style.display = 'none';
  lb.setAttribute('aria-hidden', 'true');
});

/* Accesibilidad: cerrar con Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal.hasAttribute('open')) {
      modal.removeAttribute('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (lb.style.display === 'flex') {
      lb.style.display = 'none';
      lb.setAttribute('aria-hidden', 'true');
    }
  }
});

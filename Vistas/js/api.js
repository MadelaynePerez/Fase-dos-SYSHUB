
const API_BASE = 'http://localhost:3000';

//  helpers 
async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Error ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('json') ? res.json() : res.text();
}


const Auth = {
  login:    (email, password)         => apiFetch('/auth/login',    { method:'POST', body: JSON.stringify({email, password}) }),
  register: (nombre, email, password) => apiFetch('/auth/register', { method:'POST', body: JSON.stringify({nombre, email, password}) }),
};


const Proyectos = {
  listar: () => apiFetch('/proyectos'),
  crear:  (formData) => fetch(API_BASE + '/proyectos', { method:'POST', body: formData }).then(r => { if(!r.ok) throw new Error(); return r.text(); }),
  editar: (id, data) => apiFetch(`/proyectos/${id}`, { method:'PUT',    body: JSON.stringify(data) }),
  borrar: (id)       => apiFetch(`/proyectos/${id}`, { method:'DELETE' }),
  destacar: (id, val) => apiFetch(`/proyectos/${id}/destacar`, { method:'PUT', body: JSON.stringify({destacado: val}) }),
};


const Foros = {
  listar: ()           => apiFetch('/foros'),
  crear:  (data)       => apiFetch('/foros', { method:'POST', body: JSON.stringify(data) }),
  borrar: (id)         => apiFetch(`/foros/${id}`, { method:'DELETE' }),
};


const Comentarios = {
  listar: (id_foro)    => apiFetch(`/comentarios/${id_foro}`),
  crear:  (data)       => apiFetch('/comentarios', { method:'POST', body: JSON.stringify(data) }),
  borrar: (id)         => apiFetch(`/comentarios/${id}`, { method:'DELETE' }),
};

// voto
const Votos = {
  votar: (tipo, id_referencia, id_usuario, valor) =>
    apiFetch('/votos', { method:'POST', body: JSON.stringify({tipo, id_referencia, id_usuario, valor}) }),
};

// ── usario (admin) 
const Usuarios = {
   listar: ()         => apiFetch('/usuarios'),
  editar: (id, data) => apiFetch(`/usuarios/${id}`, { method:'PUT', body: JSON.stringify(data) }),
  borrar: (id)       => apiFetch(`/usuarios/${id}`, { method:'DELETE' }),
  cambiarRol: (id, id_rol) => apiFetch(`/usuarios/${id}`, { method:'PUT', body: JSON.stringify({id_rol}) }),
  suspender: (id, suspendido) => apiFetch(`/usuarios/${id}/suspender`, { method:'PUT', body: JSON.stringify({suspendido}) }),
};

// ── sesion local 
const Session = {
  get:    ()     => { try { return JSON.parse(localStorage.getItem('syshub_user')); } catch { return null; } },
  set:    (user) => localStorage.setItem('syshub_user', JSON.stringify(user)),
  clear:  ()     => localStorage.removeItem('syshub_user'),
  isLogged: ()   => !!Session.get(),
  rol:    ()     => Session.get()?.id_rol || 0,   // 1=estudiante 2=auxiliar 3=admin
  id:     ()     => Session.get()?.id_usuario,
  nombre: ()     => Session.get()?.nombre || 'Usuario',
};


function showToast(msg, type = '') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'show' + (type ? ' ' + type : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3000);
}

function timeSince(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)    return 'hace un momento';
  if (s < 3600)  return `hace ${Math.floor(s/60)} min`;
  if (s < 86400) return `hace ${Math.floor(s/3600)} h`;
  return new Date(d).toLocaleDateString('es-GT');
}

function initials(nombre) {
  return (nombre || 'US').trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function starsHTML(n, interactive = false, tipo = '', id = '') {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star ${i < n ? 'on' : ''}" ${interactive ? `onclick="votar('${tipo}',${id},${i+1})"` : ''}">★</span>`
  ).join('');
}

function stackTagsHTML(stack) {
  return (stack || '').split(',').filter(t => t.trim())
    .map(t => `<span class="stack-tag">${t.trim()}</span>`).join('');
}

function badgeRol(id_rol) {
  const map = {1:'badge-estudiante',2:'badge-auxiliar',3:'badge-admin'};
  const names = {1:'Estudiante',2:'Auxiliar',3:'Admin'};
  return `<span class="badge ${map[id_rol]||'badge-estudiante'}">${names[id_rol]||'?'}</span>`;
}

function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

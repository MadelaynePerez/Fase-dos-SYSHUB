const API = 'http://localhost:3000/proyectos';

function timeSince(fechaStr) {
  const diff = Math.floor((Date.now() - new Date(fechaStr)) / 1000);
  if (diff < 60)    return 'hace un momento';
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return new Date(fechaStr).toLocaleDateString('es-GT');
}

function starsHTML(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star ${i < n ? 'filled' : ''}">★</span>`
  ).join('');
}

function initials(nombre) {
  return (nombre || 'US')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function listar() {
  fetch(API)
    .then(res => {
      if (!res.ok) throw new Error('Error del servidor');
      return res.json();
    })
    .then(data => {
      const lista = document.getElementById('lista');

      if (!data || data.length === 0) {
        lista.innerHTML = `<p class="empty-msg">No hay proyectos publicados aún.</p>`;
        return;
      }

      lista.innerHTML = data.map(p => {
       
        const tags = (p.stack_tecnologico || '')
          .split(',')
          .filter(t => t.trim())
          .map(t => `<span class="stack-tag">${t.trim()}</span>`)
          .join('');

        
        const archivoHTML = p.archivo
          ? `<a class="file-link" href="http://localhost:3000/uploads/${p.archivo}" target="_blank">
               📄 ${p.archivo}
             </a>`
          : '';

        
        const rating = 3;

        return `
          <div class="post-card" data-id="${p.id_proyecto}">
            <div class="post-header">
              <div class="post-avatar">${initials(p.nombre_usuario || 'Estudiante')}</div>
              <div class="post-meta">
                <div class="post-user">USER: ${p.nombre_usuario || 'Estudiante'}</div>
                <div class="post-time">${timeSince(p.fecha_creacion)}</div>
              </div>
              <span class="badge-proyecto">PROYECTO</span>
            </div>

            <div class="post-body">"${p.descripcion}"</div>

            ${tags ? `<div class="stack-tags">${tags}</div>` : ''}

            <div class="post-footer">
              <div class="post-actions">
                <button class="post-action-btn" onclick="comentar(${p.id_proyecto})">
                   Comentar
                </button>
                <button class="post-action-btn">👍</button>
                <button class="post-action-btn">👎</button>
                ${archivoHTML}
              </div>
              <div class="stars">${starsHTML(rating)}</div>
            </div>
          </div>
        `;
      }).join('');
    })
    .catch(err => {
      console.error('Error al listar proyectos:', err);
      document.getElementById('lista').innerHTML =
        `<p class="empty-msg">Error cargando proyectos. ¿Está corriendo el servidor?</p>`;
    });
}

function comentar(id_proyecto) {
  const texto = prompt('Escribe tu comentario:');
  if (!texto) return;
  
  alert('Comentario guardado (próximamente)');
}
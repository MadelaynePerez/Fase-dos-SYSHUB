function requireAuth(roles = []) {
  const user = Session.get();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  if (roles.length && !roles.includes(user.id_rol)) {
    window.location.href = 'feed.html';
    return null;
  }
  
  const av = document.getElementById('topbar-avatar');
  if (av) av.textContent = initials(user.nombre);
  const nm = document.getElementById('topbar-nombre');
  if (nm) nm.textContent = user.nombre;
  
  document.querySelectorAll('[data-rol]').forEach(el => {
    const allowed = el.dataset.rol.split(',').map(Number);
    el.style.display = allowed.includes(user.id_rol) ? '' : 'none';
  });
  return user;
}

function logout() {
  Session.clear();
  window.location.href = 'index.html';
}

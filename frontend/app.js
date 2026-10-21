const state = { token: localStorage.getItem('access_token') };
const $ = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const headers = { ...(options.body ? {'Content-Type': 'application/json'} : {}), ...(state.token ? {Authorization: `Bearer ${state.token}`} : {}) };
  const response = await fetch(`/api${path}`, {...options, headers});
  if (!response.ok) throw new Error((await response.json()).detail || 'Error en la solicitud');
  return response.status === 204 ? null : response.json();
}

async function loadApp() {
  if (!state.token) return;
  try { const user = await api('/me'); $('login-card').classList.add('hidden'); $('app-card').classList.remove('hidden'); $('welcome').textContent = `${user.username} · ${user.role}`; if (user.role === 'editor') $('editor').classList.remove('hidden'); await loadItems(); }
  catch { logout(); }
}
async function loadItems() { const items = await api('/items'); $('items').innerHTML = items.length ? items.map(item => `<article class="item"><strong>${item.name}</strong><p>${item.description || 'Sin descripción'}</p></article>`).join('') : '<p class="muted">Todavía no hay elementos.</p>'; }
function logout() { localStorage.removeItem('access_token'); state.token = null; location.reload(); }

$('login-form').addEventListener('submit', async (event) => { event.preventDefault(); $('login-error').textContent = ''; const form = new FormData(event.target); const body = new URLSearchParams(form); try { const result = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body}); if (!result.ok) throw new Error('Usuario o contraseña incorrectos'); state.token = (await result.json()).access_token; localStorage.setItem('access_token', state.token); await loadApp(); } catch (error) { $('login-error').textContent = error.message; } });
$('item-form').addEventListener('submit', async (event) => { event.preventDefault(); const form = new FormData(event.target); try { await api('/items', {method:'POST', body: JSON.stringify(Object.fromEntries(form))}); event.target.reset(); await loadItems(); } catch (error) { $('app-error').textContent = error.message; } });
$('logout').addEventListener('click', logout); loadApp();

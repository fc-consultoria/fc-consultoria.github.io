/* FC Consultoria · Catálogo 3D instalável (08/11/2026)
   Guarda o catálogo no aparelho para abrir sem internet.
   - Páginas e dados (html/json/js): busca na rede primeiro (sempre a versão nova) e,
     sem sinal, usa a cópia guardada.
   - Imagens, fontes e biblioteca 3D: usa a cópia guardada (mais rápido) e só baixa se faltar.
   - "Baixar tudo": quando o app está instalado, guarda todos os perfis (cerca de 11 MB).
   © FC Consultoria em Esquadria · uso exclusivo */
const VERSAO = 'cat3d-v1';
const CACHE = 'fc-' + VERSAO;
const ESSENCIAL = ['/perfis/', '/perfis/?o=app', '/perfis/offline.json', '/perfis/manifest.webmanifest'];
const CDN = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ESSENCIAL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('fc-cat3d') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function ehRecurso(url) {
  return /\.(webp|png|jpe?g|gif|svg|woff2?|ttf)$/i.test(url.pathname) || CDN.test(url.href);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const mesmaOrigem = url.origin === location.origin;
  if (!mesmaOrigem && !CDN.test(url.href)) return; // Supabase, WhatsApp etc. seguem normal

  if (ehRecurso(url)) {
    // Cache primeiro
    e.respondWith(caches.match(req, { ignoreSearch: mesmaOrigem }).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return res;
    })));
    return;
  }

  // Rede primeiro, cópia guardada sem sinal
  e.respondWith(fetch(req).then(res => {
    if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit =>
    hit || (req.mode === 'navigate' ? caches.match('/perfis/', { ignoreSearch: true }) : Response.error())
  )));
});

// "Baixar tudo para usar sem internet"
self.addEventListener('message', e => {
  if (!e.data || e.data.tipo !== 'baixar-tudo') return;
  const avisar = msg => self.clients.matchAll().then(cs => cs.forEach(c => c.postMessage(msg)));
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    const lista = await fetch('/perfis/offline.json', { cache: 'no-cache' }).then(r => r.json());
    const todos = lista.base.map(u => /^(https?:)?\//.test(u) ? u : '/perfis/' + u.replace(/^\.\//, ''))
      .concat(lista.arquivos.map(u => '/perfis/' + u));
    let feitos = 0, i = 0;
    const trab = async () => {
      while (i < todos.length) {
        const u = todos[i++];
        try {
          if (!(await c.match(u, { ignoreSearch: true }))) { const r = await fetch(u); if (r.ok) await c.put(u, r); }
        } catch (_) {}
        feitos++;
        if (feitos % 40 === 0 || feitos === todos.length) avisar({ tipo: 'progresso', feitos, total: todos.length });
      }
    };
    await Promise.all([trab(), trab(), trab(), trab(), trab(), trab()]);
    avisar({ tipo: 'pronto', versao: lista.v });
  })());
});

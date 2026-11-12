/* Plataforma FC 3D · app instalável no celular (11/11/2026)
   Só existe para a plataforma poder ser instalada como app.
   Não guarda nada no aparelho: tudo vem sempre da internet (login e dados conferidos no servidor).
   © FC Consultoria em Esquadria · uso exclusivo */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* passa direto para a internet */ });

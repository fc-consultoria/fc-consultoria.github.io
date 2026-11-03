/* ===== Plataforma FC 3D · Registro de uso da equipe (03/11/2026) =====
   Alimenta a aba Equipe do Gestor: quem está on-line, quanto tempo e o que cada pessoa abriu.
   Vale para todas as empresas. Não registra a FC (gestor mestre) nem o demonstrativo (o servidor ignora).
   Avisa a tela atual a cada 30 s com a página aberta, ao trocar de aba e ao sair da página. */
(function(){
  if(window.top!==window||window.FCUso)return;window.FCUso=1;
  const RPC='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_uso_ping',KEY='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
  const lg=k=>{try{return localStorage.getItem(k);}catch(_){return null;}};
  const tk=lg('pfc-token');if(!tk||lg('pfc-papel')==='demo')return;
  const q=new URLSearchParams(location.search),pg=location.pathname,hs=()=>location.hash.slice(1);
  const tela=()=>{
    if(/\/mostruario\//.test(pg))return 'Orientativo 3D · '+(q.get('t')||'jcr200').toUpperCase()+(q.get('vento')?' · vento':'');
    if(/\/orientativo\//.test(pg))return /^cat/i.test(hs())?'Catálogo 3D':'Orientativo · módulos'+(hs()?' · '+hs().toUpperCase().slice(0,20):'');
    if(/\/montagens\//.test(pg))return 'Montagens 3D'+(q.get('m')?' · '+q.get('m').toUpperCase():'');
    if(/\/tecnico\//.test(pg))return 'Desenho técnico';
    if(/\/ambientes\//.test(pg))return 'Ambientes · Monte sua Casa';
    if(/\/obra\//.test(pg))return 'Ambientes · Obra';
    if(/\/demo\//.test(pg))return 'Demonstrativo';
    const m=document.querySelector('#menu [aria-current]');
    return m?(m.textContent||'').replace(/^[^A-Za-zÀ-ú]+/,'').trim()||'Início':'Início';};
  let parar=false;
  async function ping(){if(parar)return;try{const r=await fetch(RPC,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({p_token:tk,p_tela:tela()}),keepalive:true});if(r.ok){const j=await r.json();if(j&&j.ok===false)parar=true;}}catch(_){}}
  setInterval(()=>{if(!document.hidden)ping();},30000);setTimeout(ping,1200);
  document.addEventListener('visibilitychange',()=>{ping();});
  /* fecha o tempo da tela atual antes de trocar de aba e depois avisa a nova tela */
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#menu [data-tab],[data-ir]')){ping();setTimeout(ping,400);}},true);
  addEventListener('hashchange',()=>{ping();});
  addEventListener('pagehide',()=>{ping();});
})();

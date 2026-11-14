/* ===== Plataforma FC 3D · Convite automático do demonstrativo (01/11/2026) =====
   Só roda para quem entrou pelo link de 3 dias. Não muda nada da plataforma: só acrescenta o card no canto.
   - avisa o Painel da Matriz que a pessoa está on-line (a cada 30 s, com a tela aberta)
   - mostra 1 card por vez, cada etapa uma vez só, e nunca enquanto a pessoa mexe no 3D
   Para mudar os textos, edite TXT abaixo. */
(function(){
  if(window.top!==window||window.FCConvite)return;window.FCConvite=1;
  const RPC='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_demo_ping',KEY='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
  const ZAP='https://wa.me/5566999867984?text='+encodeURIComponent('Oi, Fernando! Estou testando a Plataforma FC 3D e quero saber mais.');
  const TXT={
    dica:{t:'Dica',p:'Clique nas peças para ver o código de cada perfil e os cortes das junções.',zap:false},
    convite:{t:'Sua equipe de vendas com a fábrica na mão',p:'Quer ver como a Plataforma FC 3D fica para a sua empresa?',zap:true},
    ultimo:{t:'Seu demonstrativo termina {ate}',p:'Fale com a FC para continuar usando com a sua equipe.',zap:true}};
  const MIN_DICA=180,MIN_CONVITE=600,TIP_CONVITE=3,PARADO=4000; /* segundos de uso · tipologias abertas · ms sem mexer */
  const lg=k=>{try{return localStorage.getItem(k);}catch(_){return null;}},ls=(k,v)=>{try{localStorage.setItem(k,v);}catch(_){}};
  const tk=lg('pfc-token');if(!tk)return;
  const q=new URLSearchParams(location.search),pg=location.pathname;
  const eh3d=/\/(mostruario|orientativo|montagens)\//.test(pg),tip=/\/mostruario\//.test(pg)?(q.get('t')||'jcr200'):'';
  const tela=()=>{if(tip)return 'Orientativo 3D · '+tip.toUpperCase();if(/\/orientativo\//.test(pg))return 'Tipologias'+(location.hash.length>1?' · '+location.hash.slice(1).toUpperCase():'');
    if(/\/montagens\//.test(pg))return 'Montagens';if(/\/tecnico\//.test(pg))return 'Desenho técnico';
    const m=document.querySelector('#menu [aria-current]');return m?(m.textContent||'').replace(/^[^A-Za-zÀ-ú]+/,'').trim()||'Início':'Início';};
  let tips=[];try{tips=JSON.parse(lg('pfc-cv-tips'))||[];}catch(_){}
  if(tip&&!tips.includes(tip)){tips.push(tip);ls('pfc-cv-tips',JSON.stringify(tips.slice(-50)));}
  let mexeu=Date.now(),aberto=null,mostrou=false,ST=null;
  ['pointerdown','pointermove','wheel','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>{mexeu=Date.now();},{passive:true,capture:true}));
  async function ping(evento){try{const r=await fetch(RPC,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({p_token:tk,p_tela:tela(),p_evento:evento||null}),keepalive:true});return r.ok?await r.json():null;}catch(_){return null;}}
  const viu=(k)=>{const c=(ST&&ST.convites)||{};return !!(c[k]&&c[k].visto)||lg('pfc-cv-'+k)==='1';};
  function etapa(){if(!ST||!ST.demo||ST.fim)return null;const falta=new Date(ST.expira)-Date.now(),uso=ST.uso_seg||0;
    if(falta>0&&falta<24*36e5&&!viu('ultimo'))return 'ultimo';
    if((uso>=MIN_CONVITE||tips.length>=TIP_CONVITE)&&!viu('convite'))return 'convite';
    if(eh3d&&(uso>=MIN_DICA||tip)&&!viu('dica'))return 'dica';return null;}
  const ate=()=>{const t=new Date(ST.expira),am=new Date();am.setDate(am.getDate()+1);
    const h=t.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return (t.toDateString()===new Date().toDateString()?'hoje':t.toDateString()===am.toDateString()?'amanhã':t.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}))+' às '+h;};
  function css(){if(document.getElementById('cvCss'))return;const s=document.createElement('style');s.id='cvCss';s.textContent=`
#fcCv{position:fixed;right:16px;bottom:16px;z-index:2147483000;width:310px;max-width:calc(100vw - 32px);box-sizing:border-box;background:#fff;color:#1d2a2c;border:1px solid #d5e1e2;border-radius:14px;padding:14px 16px 15px;box-shadow:0 10px 30px #0003;font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;animation:fcCvIn .35s ease-out}
#fcCv .cvH{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:700;color:#02717d;letter-spacing:.2px}
#fcCv .cvX{all:unset;cursor:pointer;font-size:20px;line-height:1;color:#7a8a8c;padding:0 2px}
#fcCv .cvT{margin:0 0 4px;font-size:15.5px;font-weight:700;color:#1d2a2c}#fcCv .cvP{margin:0;color:#4b5b5d}
#fcCv .cvZ{display:inline-flex;align-items:center;gap:8px;margin-top:12px;background:#1d9e75;color:#fff;border-radius:10px;padding:9px 14px;font-weight:700;text-decoration:none}
#fcCv .cvOk{all:unset;cursor:pointer;display:inline-block;margin-top:10px;color:#02717d;font-weight:700}
@keyframes fcCvIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (prefers-color-scheme:dark){#fcCv{background:#1f2a2c;color:#e8f0f0;border-color:#354547}#fcCv .cvT{color:#e8f0f0}#fcCv .cvP{color:#b7c6c8}#fcCv .cvH,#fcCv .cvOk{color:#5fc4ce}}
@media (max-width:520px){#fcCv{left:12px;right:12px;bottom:12px;width:auto;max-width:none}}`;document.head.appendChild(s);}
  function fecha(k,ev){if(!aberto)return;aberto.remove();aberto=null;ls('pfc-cv-'+k,'1');if(ev)ping(ev+':'+k);}
  function mostra(k){const x=TXT[k];if(!x||aberto)return;css();mostrou=true;ls('pfc-cv-'+k,'1');
    const d=document.createElement('div');d.id='fcCv';d.setAttribute('role','dialog');d.setAttribute('aria-label',x.t.replace('{ate}',''));
    d.innerHTML=`<div class="cvH"><span>FC Consultoria e Representação</span><button class="cvX" type="button" aria-label="Fechar">×</button></div>
      <p class="cvT">${x.t.replace('{ate}',ate())}</p><p class="cvP">${x.p}</p>
      ${x.zap?`<a class="cvZ" href="${ZAP}" target="_blank" rel="noopener">💬 Falar com a FC no WhatsApp</a>`:'<button class="cvOk" type="button">Entendi</button>'}`;
    if(tip)d.style.bottom='66px'; /* acima do botão Voltar às tipologias */
    document.body.appendChild(d);aberto=d;ping('visto:'+k);
    d.querySelector('.cvX').onclick=()=>fecha(k,'fechou');
    const ok=d.querySelector('.cvOk');if(ok)ok.onclick=()=>fecha(k,'fechou');
    const z=d.querySelector('.cvZ');if(z)z.onclick=()=>{ping('clicou:'+k);setTimeout(()=>fecha(k,null),300);};}
  function tenta(){if(mostrou||aberto||document.hidden)return;const k=etapa();if(!k)return;
    if(Date.now()-mexeu<PARADO){setTimeout(tenta,1500);return;}mostra(k);}
  async function ciclo(){if(document.hidden)return;const r=await ping();if(!r)return;ST=r;if(!r.demo||r.fim){clearInterval(T);return;}tenta();}
  const T=setInterval(ciclo,30000);setTimeout(ciclo,1500);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)ciclo();});
  /* registra o tempo da tela atual antes de trocar de tela ou de página (relatório de uso no Painel de Licenças) */
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#menu [data-tab]'))ping();},true);
  addEventListener('pagehide',()=>{ping();});
})();

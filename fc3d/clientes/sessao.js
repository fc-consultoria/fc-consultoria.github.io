/* ===== Plataforma FC 3D · Controle de sessão (06/11/2026) =====
   1) Um aparelho por colaborador: se o mesmo login entrar em outro computador, este aqui cai na hora
      (confere a cada 20 s, ao voltar para a aba e quando outra aba sai).
   2) Modo apresentação (marcado no login, "computador de outra pessoa"): barra "Encerrar apresentação"
      em todas as telas, saída automática após 10 min sem uso e o acesso vale no máximo 3 h no servidor.
   Ao cair, a tela fica coberta (o cliente não continua navegando com o login do colaborador). */
(function(){
  if(window.top!==window||window.FCSessao)return;window.FCSessao=1;
  const API='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/',KEY='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
  const LS={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}},del(k){try{localStorage.removeItem(k)}catch(_){}}};
  const INATIVO=10*60e3,AVISO=60e3;
  const raiz=(location.pathname.match(/^(.*\/fc3d\/clientes\/)/)||[,'/fc3d/clientes/'])[1];
  const rpc=(fn,a)=>fetch(API+fn,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify(a),keepalive:true});
  let fim=false,pill=null;

  function cobrir(titulo,texto){
    if(document.getElementById('pfcFim'))return;
    const d=document.createElement('div');d.id='pfcFim';
    d.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#0f1d24;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,Segoe UI,sans-serif';
    d.innerHTML='<div style="max-width:420px;text-align:center"><div style="font-size:40px;margin-bottom:8px">🔒</div>'+
      '<h2 style="margin:0 0 10px;font-size:21px">'+titulo+'</h2><p style="margin:0 0 20px;color:#c9d6db;line-height:1.5;font-size:15px">'+texto+'</p>'+
      '<a href="'+raiz+'" style="display:inline-block;background:#02717d;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">Entrar de novo</a>'+
      '<p style="margin:18px 0 0;font-size:12px;color:#8aa0a8">Plataforma FC 3D · FC Consultoria</p></div>';
    document.body.appendChild(d);document.documentElement.style.overflow='hidden';
  }
  function limpar(){['pfc-token','pfc-papel','pfc-apres','pfc-apres-ativo'].forEach(LS.del);}
  async function encerrar(titulo,texto,avisarServidor){
    if(fim)return;fim=true;const t=LS.get('pfc-token');
    if(avisarServidor&&t){try{await rpc('pfc_sair',{p_token:t});}catch(_){}}
    limpar();if(pill)pill.remove();cobrir(titulo,texto);
  }
  window.FCSessaoEncerrar=()=>encerrar('Apresentação encerrada','O acesso saiu deste computador. Para usar de novo, entre com o seu login.',true);

  /* ---- 1) confere se o acesso continua valendo ---- */
  let ligado=false;
  async function conferir(){
    if(fim||document.hidden)return;const t=LS.get('pfc-token');if(!t)return;
    try{const r=await fetch(API+'pfc_sessao',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({p_token:t})});
      if(r.ok)return;const j=await r.json().catch(()=>({}));const m=String(j.message||'');
      if(/outro aparelho/i.test(m))encerrar('Acesso aberto em outro aparelho',m,false);
      else if(/expirada|pausado|terminou/i.test(m))encerrar('Acesso encerrado',m,false);
    }catch(_){/* sem internet: não derruba */}
  }
  function iniciar(){
    if(ligado||!LS.get('pfc-token'))return;ligado=true;fim=false;
    setInterval(conferir,20000);setTimeout(conferir,2500);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)conferir();});addEventListener('focus',conferir);
    if(LS.get('pfc-apres')==='1')apresentacao();
  }
  /* a tela inicial chama de novo logo depois do login */
  window.FCSessaoIniciar=iniciar;
  /* saiu em outra aba (botão Sair ou Encerrar) → esta aba também fecha */
  addEventListener('storage',e=>{if(e.key==='pfc-token'&&!e.newValue&&e.oldValue)encerrar('Acesso encerrado','O acesso foi encerrado em outra aba deste computador.',false);});

  /* ---- 2) modo apresentação ---- */
  function apresentacao(){
  const marcar=()=>LS.set('pfc-apres-ativo',String(Date.now()));
  if(!LS.get('pfc-apres-ativo'))marcar();
  let ult=0;const mexeu=()=>{const n=Date.now();if(n-ult>5000){ult=n;marcar();}};
  ['pointerdown','pointermove','keydown','wheel','touchstart'].forEach(ev=>addEventListener(ev,mexeu,{passive:true,capture:true}));
  function montar(){
    pill=document.createElement('div');
    pill.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:2147482000;display:flex;align-items:center;gap:10px;background:#0f1d24;color:#fff;border-radius:99px;padding:7px 8px 7px 14px;box-shadow:0 6px 20px #0004;font:600 13px system-ui,-apple-system,Segoe UI,sans-serif;max-width:calc(100vw - 24px)';
    pill.innerHTML='<span id="pfcApTx">🖥️ Modo apresentação</span><button type="button" style="border:0;background:#c2410c;color:#fff;font:700 13px inherit;font-family:inherit;padding:7px 12px;border-radius:99px;cursor:pointer">Encerrar apresentação</button>';
    pill.querySelector('button').onclick=()=>{if(confirm('Encerrar a apresentação e sair deste computador?'))window.FCSessaoEncerrar();};
    document.body.appendChild(pill);
  }
  if(document.body)montar();else addEventListener('DOMContentLoaded',montar);
  setInterval(()=>{
    if(fim)return;const parado=Date.now()-Number(LS.get('pfc-apres-ativo')||Date.now()),tx=document.getElementById('pfcApTx');
    if(parado>=INATIVO)encerrar('Apresentação encerrada','Ficou 10 minutos sem uso e o acesso saiu sozinho deste computador.',true);
    else if(tx)tx.textContent=parado>=INATIVO-AVISO?'⏳ Sai em '+Math.ceil((INATIVO-parado)/1000)+' s · toque na tela para continuar':'🖥️ Modo apresentação';
  },1000);
  }
  iniciar();
})();

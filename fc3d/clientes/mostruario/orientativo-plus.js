/* ===== Orientativo 3D · melhorias dentro do Mostruário (06/11/2026) =====
   Fica dentro do Orientativo 3D atual (card da correr 2 folhas), sem página nova.
   Fase de aprovação: só Acesso FC (matriz) e só a SUP JCR 200 (tipologia jcr200).
   1) Cortes 01 a 05 em 3D: a janela fica transparente e só a seção real dos perfis aparece em creme.
   2) Montar peça por peça com Anterior / Próxima / Ver de perto / Fechar.
   3) Ver de perto: a peça sai da janela, de frente para a seção, com as cotas e o detalhe do catálogo.
   4) Tela cheia com barra única no topo, fundo escuro com piso.
   Regras: "a conferir" quando o catálogo não traz a fórmula · marca d'água FC sempre.
   © FC Consultoria em Esquadria · criação da FC, uso exclusivo de empresas licenciadas. */
(function(){
'use strict';
if(window.FCOrientPlus)return;window.FCOrientPlus=1;

/* ---------- o que vale em cada tipologia (por enquanto só a correr 2 folhas Suprema) ---------- */
/* tipologia do Mostruário → montagem (pelo código do catálogo, ex. SUP PGR 200) */
const chaveDe=t=>{try{const T=(typeof TYPOS!=='undefined'&&TYPOS[t])||null;if(!T||!window.FCM)return null;
 const k=Object.keys(window.FCM.MONT).find(k=>window.FCM.MONT[k].cd===T.code);return k||null;}catch(_){return null;}};
const CORTES=[
   {id:'01',n:'inferior',pl:'v',zona:'baixo'},
   {id:'02',n:'superior',pl:'v',zona:'cima'},
   {id:'03',n:'lateral esquerda',pl:'h',zona:'esq'},
   {id:'04',n:'centro',pl:'h',zona:'meio'},
   {id:'05',n:'lateral direita',pl:'h',zona:'dir'}];
/* o que o catálogo informa além da base (só onde foi conferido); o resto fica "a conferir" */
function especDe(k){const e=ESPEC[k]||{};return {pg:e.pg||null,nm:e.nm||{},kg:e.kg||{},f:e.f||{},vid:e.vid||null,ordemMarco:e.ordemMarco||null,cortes:e.cortes||CORTES};}
const ESPEC={
 jc2:{pg:117,
  nm:{'SU-001':'Marco superior','SU-002':'Marco inferior','SU-003':'Marco lateral','SU-039':'Montante lateral',
      'SU-040':'Montante mão de amigo','SU-041':'Montante mão de amigo','SU-053':'Travessa da folha','SU-102':'Baguete'},
  /* peso do catálogo (kg/m): SU-002 = 0,707 e SU-003 = 0,523 (a base de seções estava errada/sem) */
  kg:{'SU-001':.762,'SU-002':.707,'SU-003':.523,'SU-039':.520,'SU-040':.480,'SU-041':.507,'SU-053':.507,'SU-102':.111},
  /* só o que o catálogo escreve; o resto fica "a conferir" */
  f:{'SU-039':{t:'H − 50',v:(L,H)=>H-50},'SU-040':{t:'H − 50',v:(L,H)=>H-50},'SU-041':{t:'H − 50',v:(L,H)=>H-50}},
  vid:{t:'(L − 143,2) / 2 × (H − 134)',v:(L,H)=>[(L-143.2)/2,H-134],esp:6},
  ordemMarco:['SU-002','SU-003','SU-001'],
  cortes:[
   {id:'01',n:'inferior',pl:'v',zona:'baixo'},
   {id:'02',n:'superior',pl:'v',zona:'cima'},
   {id:'03',n:'lateral esquerda',pl:'h',zona:'esq'},
   {id:'04',n:'encontro das folhas',pl:'h',zona:'meio'},
   {id:'05',n:'lateral direita',pl:'h',zona:'dir'}]}
};

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=v=>(Math.round(v*10)/10).toLocaleString('pt-BR',{maximumFractionDigits:1});
const mm=v=>v==null?'':num(v)+' mm';
const kgf=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:3});
const PEND='<span class="oxpend">a conferir</span>';
const RAIZ=(location.pathname.match(/^(.*\/fc3d\/clientes\/)/)||[,'../'])[1];

/* ---------- estilos (todos com prefixo ox, para não mexer no resto do Mostruário) ---------- */
const css=`
.oxents{position:absolute;left:12px;bottom:12px;z-index:3;display:flex;gap:6px;flex-wrap:wrap;max-width:calc(100% - 24px)}
.oxents[hidden]{display:none!important}
.oxents .oxent{font:600 13px Inter,system-ui,sans-serif;border:1px solid #02717d;border-radius:8px;padding:7px 11px;cursor:pointer;box-shadow:0 3px 10px rgba(2,113,125,.25);background:#02717d;border-color:#02717d;color:#fff;position:relative}
.oxents .oxent:hover{background:#025a67}
.oxents .oxent i{font-style:normal;font-size:9.5px;letter-spacing:.06em;background:#ffd58a;color:#3a2600;border-radius:4px;padding:0 4px;margin-left:5px;vertical-align:1px}
#oxL{position:absolute;inset:0;z-index:40;background:radial-gradient(120% 90% at 50% 25%,#1d3236,#0b1414 70%);color:#e6efed;overflow:hidden;font-family:Inter,"Barlow Semi Condensed",system-ui,sans-serif;font-size:14px;line-height:1.45}
#oxL.fx{position:fixed;z-index:2147480000}
#oxL *{box-sizing:border-box}
#oxL [hidden]{display:none!important}
#oxCv{position:absolute;inset:0;touch-action:none}
#oxCv canvas{display:block;width:100%;height:100%}
#oxL .oxbtn{appearance:none;font:600 13px Inter,system-ui,sans-serif;border:1px solid transparent;background:transparent;color:#e6efed;border-radius:10px;padding:7px 9px;min-height:36px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
#oxL .oxbtn:hover{background:rgba(255,255,255,.08)}
#oxL .oxbtn:focus-visible{outline:2px solid #22c3c9;outline-offset:1px}
#oxL .oxbtn[aria-pressed="true"]{background:rgba(34,195,201,.18);color:#7fe3e6;border-color:rgba(34,195,201,.5)}
#oxL .oxbtn.cut[aria-pressed="true"]{background:#e9dcc0;color:#2a1d05;border-color:#e9dcc0}
#oxL .oxbtn:disabled{opacity:.4;cursor:default}
#oxTop{position:absolute;left:0;right:0;top:0;z-index:7;display:flex;align-items:center;gap:4px;padding:8px 10px;background:rgba(8,16,16,.78);backdrop-filter:blur(8px);border-bottom:1px solid #2a3d40;flex-wrap:wrap;row-gap:2px}
#oxTop::-webkit-scrollbar{display:none}
#oxTop .sep{width:1px;align-self:stretch;background:#2a3d40;margin:4px 3px;flex:none}
#oxTop .sp{flex:1 0 8px}
#oxTop .oxaj{flex:1 0 100%;font-size:12.5px;color:#f0c87a;background:rgba(232,176,74,.12);border-radius:8px;padding:5px 10px;margin-top:4px}
#oxTop .tag{flex:none;font:700 10.5px Inter,system-ui;letter-spacing:.08em;text-transform:uppercase;color:#ffd58a;background:rgba(255,213,138,.12);border-radius:999px;padding:3px 8px;margin-right:4px}
#oxHint{position:absolute;right:12px;bottom:44px;z-index:5;font-size:12px;color:#9db3b0;background:rgba(0,0,0,.3);padding:4px 10px;border-radius:999px;pointer-events:none}
.oxwm{position:absolute;inset:0;pointer-events:none;z-index:6;overflow:hidden}
.oxwm i{position:absolute;left:-20%;right:-20%;font:700 15px Inter,system-ui;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.05);white-space:nowrap;transform:rotate(-18deg);font-style:normal}
.oxwm b{position:absolute;right:12px;bottom:10px;font:600 11px Inter,system-ui;letter-spacing:.04em;color:rgba(255,255,255,.6);background:rgba(0,0,0,.32);padding:4px 9px;border-radius:999px}
/* cartão embaixo à esquerda (corte e montagem) */
.oxcard{position:absolute;left:14px;bottom:14px;z-index:8;width:min(420px,calc(100% - 28px));background:rgba(10,20,20,.88);backdrop-filter:blur(8px);border:1px solid #2a3d40;border-radius:14px;padding:12px 14px;box-shadow:0 14px 40px rgba(0,0,0,.45)}
.oxcard .k{font:700 11px Inter,system-ui;letter-spacing:.07em;text-transform:uppercase;color:#7fe3e6}
.oxcard .v{font:600 16px "Space Grotesk",Inter,system-ui;color:#fff;margin-top:2px}
.oxcard .p{font-size:13px;color:#c9d6d4;margin-top:4px;font-variant-numeric:tabular-nums}
.oxcard .acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
#oxL .oxcard .acts .oxbtn{border-color:#2a3d40;background:rgba(255,255,255,.05)}
#oxL .oxcard .acts .oxbtn.pri{background:#02717d;border-color:#02717d;color:#fff}
.oxcard .bar{height:3px;border-radius:3px;background:rgba(255,255,255,.1);margin-top:10px;overflow:hidden}
.oxcard .bar i{display:block;height:100%;background:#22c3c9;transition:width .3s}
.oxpend{font-weight:700;color:#f0c87a;background:rgba(232,176,74,.16);border-radius:6px;padding:1px 6px;font-size:12px;white-space:nowrap}
/* ver de perto */
#oxPalco{position:absolute;inset:0;z-index:9;display:grid;grid-template-columns:1fr minmax(280px,360px);background:rgba(6,12,12,.6);backdrop-filter:blur(3px);opacity:0;transition:opacity .25s}
#oxPalco.on{opacity:1}
#oxPcv{position:relative;min-height:0}
#oxPcv canvas{display:block;width:100%;height:100%}
#oxPinfo{background:#f7f9f9;color:#14212a;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:-10px 0 30px rgba(0,0,0,.3)}
#oxPinfo h3{font:700 19px "Space Grotesk",Inter,system-ui;margin:0}
#oxPinfo .cd{font:700 12px Inter,system-ui;letter-spacing:.06em;color:#02717d;text-transform:uppercase}
#oxPinfo dl{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:0;font-size:13.5px}
#oxPinfo dt{color:#5a6872}
#oxPinfo dd{margin:0;font-weight:600;font-variant-numeric:tabular-nums}
#oxPinfo img,#oxPinfo svg{display:block;width:100%;height:auto;background:#fff;border:1px solid #dbe3e6;border-radius:12px;padding:8px}
#oxPinfo .fonte{font-size:11.5px;color:#5a6872;margin:0}
#oxL #oxPinfo .oxbtn{color:#14212a;border:1px solid #cfd9dd;background:#fff}
#oxL #oxPinfo .oxbtn.pri{background:#02717d;border-color:#02717d;color:#fff}
#oxMsg{position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#c9d6d4}
#oxL .oxdw{position:relative;display:inline-flex}
#oxL .oxdd{position:absolute;top:calc(100% + 6px);left:0;z-index:12;min-width:230px;background:#0f1d1d;border:1px solid #2a3d40;border-radius:12px;padding:6px;display:flex;flex-direction:column;gap:2px;box-shadow:0 14px 40px rgba(0,0,0,.5)}
#oxL .oxdd .oxbtn{justify-content:flex-start;width:100%}
#oxJ{position:absolute;inset:0;z-index:4;pointer-events:none}
#oxJ button{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:2px solid #fff;background:#1f6f9a;color:#fff;font:700 16px/1 system-ui;cursor:pointer;pointer-events:auto;box-shadow:0 2px 8px rgba(0,0,0,.45);display:grid;place-items:center;padding:0}
#oxJ button:hover,#oxJ button:focus-visible{background:#e8b04a;color:#2a1a00;outline:none}
#oxMed{position:absolute;right:12px;z-index:6;font:600 12px Inter,system-ui;color:#c9d6d4;background:rgba(0,0,0,.35);border:1px solid #2a3d40;border-radius:999px;padding:5px 10px;cursor:pointer}
#oxMed:hover{border-color:#22c3c9;color:#fff}
#oxMedP{position:absolute;right:12px;z-index:11;background:#0f1d1d;border:1px solid #2a3d40;border-radius:12px;padding:10px;display:flex;gap:8px;align-items:flex-end;box-shadow:0 14px 40px rgba(0,0,0,.5)}
#oxMedP label{display:flex;flex-direction:column;gap:3px;font-size:11.5px;color:#9db3b0}
#oxMedP input{width:86px;background:#162a2a;border:1px solid #2a3d40;border-radius:8px;color:#fff;padding:6px 8px;font:600 14px Inter,system-ui}
#oxL.cls{background:transparent;pointer-events:none}
#oxL.cls>*:not(#oxTop){display:none!important}
#oxL.cls #oxTop{pointer-events:auto}
#stage.oxfx{position:fixed!important;inset:0!important;z-index:2147480000!important;border-radius:0!important;aspect-ratio:auto!important;max-width:none!important;width:auto!important;height:auto!important;min-height:0!important;margin:0!important}
body.oxnovo #stage .views,body.oxnovo #btFlu,body.oxnovo #padFlu,body.oxnovo #dicaFlu,body.oxnovo #stage>#hint{display:none!important}
body.oxnovo #side>details.card{display:none!important}
body.oxnovo #side>details.card.oxsel{display:block!important}
body.oxnovo #side>details.card.oxsel>summary{display:none!important}
#oxTabs{display:flex;flex-wrap:wrap;gap:2px;background:var(--panel,#fff);border:1px solid var(--line,#d5dce1);border-radius:10px;padding:4px}
#oxTabs button{flex:1 1 auto;font:600 13px var(--f-display,system-ui);border:0;background:transparent;color:var(--muted,#5d6b76);padding:8px 10px;border-radius:7px;cursor:pointer;white-space:nowrap}
#oxTabs button[aria-selected="true"]{background:#02717d;color:#fff}
#oxTabs button:focus-visible{outline:2px solid #02717d;outline-offset:1px}
#oxPane{background:var(--panel,#fff);border:1px solid var(--line,#d5dce1);border-radius:10px;padding:12px 14px}
#oxPane .lin{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid var(--line,#d5dce1);padding:8px 2px;cursor:pointer;color:var(--fg,#1b232a);font:500 14px var(--f-body,system-ui)}
#oxPane .lin:hover{background:var(--accent-soft,#e1eef5)}
#oxPane .lin b{font-family:var(--f-mono,monospace);font-size:12.5px;min-width:64px}
#oxPane .lin span{flex:1}
#oxPane .lin i{font-style:normal;color:var(--muted,#5d6b76);font-size:12px}
#oxPane .nt{font-size:12.5px;color:var(--muted,#5d6b76);margin:0 0 8px}
#oxPane img{display:block;width:100%;height:auto;border:1px solid var(--line,#d5dce1);border-radius:8px;background:#fff}
#oxPane input{width:100%;margin-bottom:6px}
@media (max-width:760px){
 #oxPalco{grid-template-columns:1fr;grid-template-rows:1fr auto}
 #oxPinfo{max-height:55%}
 #oxHint{display:none}
 .oxcard{left:8px;bottom:8px;width:calc(100% - 16px);padding:10px 12px}
 .oxcard .v{font-size:15px}
}
@media (prefers-reduced-motion:reduce){#oxPalco{transition:none}}`;

let ACESSO=null; /* true = Acesso FC */
let ent=null,L0=null;

/* ---------- botões de entrada no Orientativo atual (só aparecem para o Acesso FC na jcr200) ---------- */
function estado(){try{return (typeof S!=='undefined'&&S)||null;}catch(_){return null;}}
function podeMostrar(){const st=estado();if(!ACESSO||!st)return false;
 return !!chaveDe(st.typo)&&st.mode==='exp'&&!st.wvOn&&!st.diaOn;}
function criaEntrada(){
 const v=document.getElementById('stage');if(!v||ent)return;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 ent=document.createElement('div');ent.className='oxents';ent.setAttribute('role','group');ent.setAttribute('aria-label','Novo no Orientativo 3D');
 ent.innerHTML='<button type="button" class="oxent" data-ox="montar" title="Novo · em aprovação (só Acesso FC)">🧩 Montar peça por peça<i>NOVO</i></button>'
  +'<button type="button" class="oxent" data-ox="cortes" title="Cortes 01 a 05 com a seção real dos perfis · só Acesso FC">✂ Cortes 01 a 05</button>'
  +'<button type="button" class="oxent" data-ox="cheia" title="Tela cheia com barra única · só Acesso FC">⛶ Tela cheia</button>';
 v.appendChild(ent);
 ent.querySelectorAll('[data-ox]').forEach(b=>b.onclick=()=>abrir(b.dataset.ox));
 sync();setInterval(sync,450);}
function sync(){if(!ent)return;const ok=podeMostrar(),nv=querNovo();ent.hidden=!ok||nv;
 if(nv&&!NOVO)ligaNovo();else if(!nv&&NOVO)desligaNovo();
 else if(!ok&&L0&&!L0.hidden)fecharCamada();
 if(NOVO&&APP){const st=estado();if(st&&(APP.L!==st.w||APP.H!==st.h)&&!medindo)abrir('novo');}}

/* ===== Orientativo reorganizado (aprovação: JCR 200, só Acesso FC) =====
   O 3D novo vira o principal no palco, com uma barra só; o painel da direita vira abas.
   Componentes, Trocar perfil, Usinagens e Vento usam o 3D clássico enquanto a aba está aberta. */
const NOVO_TIPOS=['jcr200'];
let NOVO=false,medindo=false,abaAt='p',confCasa=null;
function querNovo(){const st=estado();return !!(ACESSO&&st&&NOVO_TIPOS.includes(st.typo)&&st.mode==='exp'&&!st.wvOn&&!st.diaOn);}
const ABAS=[['p','Peças',null],['c','Componentes','c-comp'],['s','Trocar perfil','c-swap'],['u','Usinagens','c-us'],['v','Vento','c-conf'],['b','Base técnica',null]];
function ligaNovo(){NOVO=true;document.body.classList.add('oxnovo');
 const side=document.getElementById('side');
 if(side&&!document.getElementById('oxTabs')){
  const t=document.createElement('div');t.id='oxTabs';t.setAttribute('role','tablist');t.setAttribute('aria-label','Painel da esquadria');
  t.innerHTML=ABAS.map(([k,n])=>`<button type="button" role="tab" data-aba="${k}" aria-selected="false">${n}</button>`).join('');
  const pn=document.createElement('div');pn.id='oxPane';pn.setAttribute('role','tabpanel');
  side.insertBefore(pn,side.firstChild);side.insertBefore(t,pn);
  t.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>aba(b.dataset.aba));
  const cf=document.getElementById('c-conf');
  if(cf&&cf.parentNode!==side){confCasa={pai:cf.parentNode,prox:cf.nextSibling,flu:cf.classList.contains('cf-flu')};cf.classList.remove('cf-flu');cf.style.top=cf.style.maxHeight='';side.insertBefore(cf,pn.nextSibling);}}
 abaAt='p';abrir('novo');}
function desligaNovo(){NOVO=false;document.body.classList.remove('oxnovo');
 ['oxTabs','oxPane'].forEach(i=>{const e=document.getElementById(i);if(e)e.remove();});
 document.querySelectorAll('#side>details.oxsel').forEach(e=>e.classList.remove('oxsel'));
 const cf=document.getElementById('c-conf');if(cf&&confCasa){if(confCasa.flu)cf.classList.add('cf-flu');confCasa.pai.insertBefore(cf,confCasa.prox);confCasa=null;}
 if(APP){APP.novo=false;APP.classico(false);}fecharCamada();}
function aba(k){if(abaAt==='v'&&k!=='v'&&typeof window.FC_VT_END==='function'){try{window.FC_VT_END();}catch(_){}}abaAt=k;const def=ABAS.find(a=>a[0]===k);
 document.querySelectorAll('#oxTabs [data-aba]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.aba===k)));
 document.querySelectorAll('#side>details.oxsel').forEach(e=>e.classList.remove('oxsel'));
 const pn=document.getElementById('oxPane');if(!pn)return;
 if(def[2]){const el=document.getElementById(def[2]);pn.hidden=true;if(el){el.classList.add('oxsel');el.open=true;}if(APP)APP.classico(true);return;}
 pn.hidden=false;if(APP)APP.classico(false);
 if(k==='b'){pn.innerHTML='<p class="nt">Desenho do catálogo técnico que serviu de base para o 3D.</p><img src="base/jcr200.webp" alt="Folha de montagem da SUP JCR 200 com elevação e cortes" loading="lazy"><p class="nt" style="margin-top:8px">Folha de montagem · elevação e cortes · catálogo p. 117. Fonte técnica: catálogo da Linha Suprema, SUP JCR 200.</p>';return;}
 pecasPane();}
function pecasPane(){const pn=document.getElementById('oxPane');if(!pn||abaAt!=='p')return;
 if(!APP){pn.innerHTML='<p class="nt">Abrindo as peças…</p>';return;}
 const L=APP.lista(),n=L.reduce((a,x)=>a+x.q,0);
 pn.innerHTML=`<p class="nt">${n} peças · toque para ver de perto</p><input type="search" id="oxBusca" placeholder="Buscar: código ou nome, ex. 053" autocomplete="off" aria-label="Buscar peça"><div id="oxLis"></div>`;
 const pinta=f=>{const q=(f||'').toLowerCase();document.getElementById('oxLis').innerHTML=L.map((x,i)=>({x,i})).filter(({x})=>!q||(x.c+' '+x.nm).toLowerCase().includes(q))
  .map(({x,i})=>`<button type="button" class="lin" data-i="${i}"><b>${esc(x.c)}</b><span>${esc(x.nm)}</span><i>${x.q}×</i> 🔍</button>`).join('')||'<p class="nt">Nenhuma peça com esse nome.</p>';
  document.querySelectorAll('#oxLis [data-i]').forEach(b=>b.onclick=()=>APP.verDePerto(L[+b.dataset.i].hd));};
 pinta('');document.getElementById('oxBusca').oninput=e=>pinta(e.target.value);}

function liga(){ACESSO=true;carregarMotor().then(criaEntrada).catch(()=>{});}
document.addEventListener('pfc:acesso',e=>{if(e.detail&&e.detail.matriz)liga();});
if(window.PFC_MATRIZ){if(document.readyState!=='loading')setTimeout(liga,0);else document.addEventListener('DOMContentLoaded',liga);}

/* ---------- carga sob demanda: motor das montagens + seções reais ---------- */
let motor=null;
function carregarMotor(){if(window.FCM)return Promise.resolve();if(motor)return motor;
 motor=new Promise((ok,erro)=>{const s=document.createElement('script');s.src=RAIZ+'tecnico/montagens.js?v=3';s.onload=()=>ok();s.onerror=()=>{motor=null;erro();};document.head.appendChild(s);});return motor;}
let carga=null;
function carregar(){if(carga)return carga;
 carga=new Promise((ok,erro)=>{
  const go=()=>Promise.all([window.FCM.carregarAjustes?window.FCM.carregarAjustes().catch(()=>null):null,
    fetch(RAIZ+'tecnico/secoes.json?v=3').then(r=>{if(!r.ok)throw 0;return r.json();})]).then(([,S])=>ok(S)).catch(erro);
  carregarMotor().then(go,erro);});
 carga.catch(()=>{carga=null;});return carga;}

/* ---------- camada dentro do palco do Orientativo ---------- */
let APP=null;
function abrir(acao){const st=estado();if(!st)return;
 if(!L0){L0=document.createElement('div');L0.id='oxL';L0.setAttribute('role','region');L0.setAttribute('aria-label','Orientativo 3D · peças e cortes');
  document.getElementById('stage').appendChild(L0);}
 L0.hidden=false;
 const key=chaveDe(st.typo);if(!key)return;
 const Lw=Math.max(400,Math.min(6000,+st.w||1500)),Hh=Math.max(300,Math.min(3500,+st.h||1000));
 if(APP&&APP.key===key&&APP.L===Lw&&APP.H===Hh){liga2();APP.acao(acao);return;}
 if(APP){APP.destruir();APP=null;}
 L0.innerHTML='<div id="oxMsg">Abrindo as peças com a seção real do catálogo…</div>';
 carregar().then(SEC=>{if(L0.hidden)return;APP=montaApp(SEC,key,Lw,Hh);liga2();APP.acao(acao);})
  .catch(()=>{L0.innerHTML='<div id="oxMsg">Não foi possível abrir agora. Confira a internet e tente de novo.<br><br><button class="oxbtn" type="button" id="oxErrX" style="border-color:#2a3d40">Voltar</button></div>';
   document.getElementById('oxErrX').onclick=fecharCamada;});}
function liga2(){if(!APP)return;APP.novo=NOVO;
 APP.aoVoltar=()=>{if(NOVO&&abaAt!=='p'&&abaAt!=='b')aba('p');};
 APP.aoMedir=()=>{medindo=true;setTimeout(()=>{medindo=false;abrir('novo');},80);};
 if(NOVO){aba(abaAt);}}
function fecharCamada(){if(!L0)return;if(APP)APP.pausar();
 const st=document.getElementById('stage');if(document.fullscreenElement===st&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});
 if(st)st.classList.remove('oxfx');L0.hidden=true;}

function montaApp(SEC,KEY,L,H){
const M=window.FCM.MONT[KEY],E=especDe(KEY);
const vDim=o=>E.vid?E.vid.v(L,H):[o.w,o.h],vTxt=E.vid?E.vid.t:(M.vtx||null),vEsp=o=>o.d||(E.vid&&E.vid.esp)||6;
const fonte=()=>`Fonte técnica: catálogo da ${esc(M.linha)}, ${esc(M.cd)}${E.pg?', p. '+E.pg:''}.`;
const V=a=>new THREE.Vector3(a[0],a[1],a[2]);
const $=id=>document.getElementById(id);
L0.innerHTML=`<div id="oxCv"></div>
 <div class="oxwm" aria-hidden="true" id="oxWm"><b>© FC Consultoria em Esquadria · Plataforma FC 3D</b></div>
 <div id="oxTop" role="toolbar" aria-label="Comandos do Orientativo 3D">
  <span class="tag" title="Novo · só o Acesso FC vê, até a aprovação">Só FC</span>
  <button class="oxbtn" type="button" data-v="ext" aria-pressed="true">Externa</button><button class="oxbtn" type="button" data-v="int" aria-pressed="false">Interna</button><button class="oxbtn" type="button" data-v="lat" aria-pressed="false">Lateral</button><span class="sep"></span>
  <button class="oxbtn" id="oxAbr" type="button" aria-pressed="false" title="Abre e fecha as folhas">↔ Abrir</button>
  <button class="oxbtn" id="oxMont" type="button" aria-pressed="false">🧩 Peça por peça</button>
  <button class="oxbtn" id="oxDesm" type="button" aria-pressed="false">💥 Desmontar</button>
  <span class="oxdw"><button class="oxbtn" id="oxCor" type="button" aria-expanded="false" aria-pressed="false">✂ Cortes ▾</button>
   <div class="oxdd" id="oxDD" hidden role="menu">${E.cortes.map(c=>`<button class="oxbtn cut" type="button" role="menuitem" data-corte="${c.id}" aria-pressed="false">Corte ${c.id} · ${esc(c.n)}</button>`).join('')}</div></span><span class="sep"></span>
  <button class="oxbtn" id="oxJun" type="button" aria-pressed="true" title="Mostra os + das junções: tocou, abre o corte daquele ponto">⊕ Junções</button>
  <button class="oxbtn" id="oxVolta" type="button" hidden title="A aba aberta usa o 3D clássico">↩ Voltar ao 3D novo</button>
  <span class="sp"></span>
  <button class="oxbtn" id="oxFull" type="button" title="Tela cheia" aria-label="Tela cheia">⛶</button>
  ${M.aj?'<a class="oxbtn" id="oxAjB" href="'+RAIZ+'tecnico/?m='+encodeURIComponent(KEY)+'" target="_blank" rel="noopener" title="Abre o Ajuste técnico desta montagem para corrigir a posição dos perfis" style="text-decoration:none;color:#ffd58a">🔧 Ajustar encaixes</a>':''}
  <button class="oxbtn" id="oxX" type="button" title="Volta ao 3D do Orientativo">✕ Fechar</button>
  ${M.aj?'<div class="oxaj">⚠ <b>Ajuste pendente:</b> '+esc(M.aj)+'. Corrija no 🔧 Ajustar encaixes e salve; ao reabrir aqui, as peças já vêm na posição salva.</div>':''}
 </div>
 <div id="oxJ" aria-label="Junções"></div>
 <button id="oxMed" type="button" title="Mudar a medida">${L} × ${H} mm ✎</button>
 <div id="oxMedP" hidden><label>Largura (mm)<input id="oxMw" type="number" inputmode="numeric" value="${L}"></label><label>Altura (mm)<input id="oxMh" type="number" inputmode="numeric" value="${H}"></label><button class="oxbtn" id="oxMok" type="button" style="background:#02717d;color:#fff">Aplicar</button></div>
 <div id="oxHint">Toque numa peça para ver de perto · arraste para girar</div>
 <div class="oxcard" id="oxCard" hidden aria-live="polite"></div>
 <div id="oxPalco" hidden><div id="oxPcv"></div><div id="oxPinfo"></div></div>`;
(function(){const w=$('oxWm');for(let i=0;i<9;i++){const s=document.createElement('i');s.style.top=(i*13-6)+'%';s.textContent=Array(8).fill('FC Consultoria · Plataforma FC 3D').join('     ');w.appendChild(s);}})();

/* ---------- cena ---------- */
const host=$('oxCv'),RN=new THREE.WebGLRenderer({antialias:true,alpha:true});
RN.setPixelRatio(Math.min(2,devicePixelRatio||1));RN.outputEncoding=THREE.sRGBEncoding;host.appendChild(RN.domElement);
const SC=new THREE.Scene(),CAM=new THREE.PerspectiveCamera(36,1,10,40000),CT=new THREE.OrbitControls(CAM,RN.domElement);
CT.enableDamping=true;CT.dampingFactor=.09;CT.screenSpacePanning=true;CT.maxPolarAngle=Math.PI*.56;
SC.add(new THREE.HemisphereLight('#ffffff','#2c3c3c',.8));
const DL=new THREE.DirectionalLight('#ffffff',.9);DL.position.set(900,1500,-1700);SC.add(DL);
const DL2=new THREE.DirectionalLight('#cfeeea',.55);DL2.position.set(-1300,500,1500);SC.add(DL2);
const DL3=new THREE.DirectionalLight('#ffffff',.25);DL3.position.set(0,-900,-600);SC.add(DL3);
const MAT=new THREE.MeshStandardMaterial({color:'#c6ccd0',metalness:.6,roughness:.34,side:THREE.DoubleSide});
const MVID=new THREE.MeshStandardMaterial({color:'#9fd0e0',metalness:.05,roughness:.05,transparent:true,opacity:.26,side:THREE.DoubleSide,depthWrite:false});
const MHOV=new THREE.MeshStandardMaterial({color:'#e8b04a',metalness:.35,roughness:.4,side:THREE.DoubleSide,emissive:'#3a2600'});
/* transparentes: peças já montadas e janela no corte */
const MGH=new THREE.MeshStandardMaterial({color:'#aeb9bd',metalness:.2,roughness:.6,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false});
const MCUR=new THREE.MeshStandardMaterial({color:'#dfe6ea',metalness:.55,roughness:.3,emissive:'#14383c',side:THREE.DoubleSide});
const MGC=new THREE.MeshStandardMaterial({color:'#7f9599',metalness:0,roughness:.9,transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false});
const MGV=new THREE.MeshStandardMaterial({color:'#9fd0e0',roughness:.1,transparent:true,opacity:.035,side:THREE.DoubleSide,depthWrite:false});
const MCAP=new THREE.MeshStandardMaterial({color:'#ecd29c',emissive:'#5a4214',metalness:.05,roughness:.6,side:THREE.DoubleSide});
const MCAPV=new THREE.MeshStandardMaterial({color:'#bfe3ee',roughness:.1,transparent:true,opacity:.6,side:THREE.DoubleSide});

/* piso: disco escuro com grade suave */
const PISO=new THREE.Group();SC.add(PISO);
(function(){const c=document.createElement('canvas');c.width=c.height=512;const k=c.getContext('2d'),g=k.createRadialGradient(256,256,10,256,256,256);
 g.addColorStop(0,'rgba(60,92,96,.55)');g.addColorStop(.6,'rgba(30,52,55,.35)');g.addColorStop(1,'rgba(11,20,20,0)');k.fillStyle=g;k.fillRect(0,0,512,512);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
 const d=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));d.rotation.x=-Math.PI/2;PISO.add(d);
 const gr=new THREE.GridHelper(2,24,'#3d5c5f','#26403f');gr.material.transparent=true;gr.material.opacity=.45;gr.position.y=.5;PISO.add(gr);})();

function geoSec(c,len,ex,ey,ez,sc){const k=sc||[1,1],d=SEC[c]||SEC[{'US-285':'VZ-006'}[c]];
 const shapes=d.s.map(sh=>{const s=new THREE.Shape(sh.o.map(([a,b])=>new THREE.Vector2(a*k[0],b*k[1])));(sh.h||[]).forEach(h=>s.holes.push(new THREE.Path(h.map(([a,b])=>new THREE.Vector2(a*k[0],b*k[1])))));return s;});
 const g=new THREE.ExtrudeGeometry(shapes,{depth:len,bevelEnabled:false,curveSegments:2});g.translate(0,0,-len/2);
 if(ex)g.applyMatrix4(new THREE.Matrix4().makeBasis(V(ex),V(ey),V(ez)));g.computeVertexNormals();return g;}

function info(o){
 if(o.vid){const [w,h]=vDim(o);return {nm:'Vidro '+vEsp(o)+' mm',ft:vTxt,w,h};}
 const f=E.f[o.c],d=SEC[o.c]||{},kn=v=>{const x=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(x)&&x>0?x:null;},kgm=E.kg[o.c]!=null?E.kg[o.c]:kn(d.kg);
 return {nm:E.nm[o.c]||(d.n&&d.n!==o.c?d.n:'Perfil'),nmc:d.n&&d.n!==o.c?d.n:'',ft:f?f.t:null,len:f?f.v(L,H):null,kgm,secW:d.w,secH:d.h};}
const grupoDe=o=>o.g<0?'Marco':R.folhas[o.g].n;

/* ---------- monta a esquadria ---------- */
let R=null,PECAS=[],FOL=[],ROOT=null,GEO=[];
function montar(){
 ROOT=new THREE.Group();SC.add(ROOT);PECAS=[];FOL=[];
 R=window.FCM.pecas(SEC,M,L,H);const GR=[ROOT];
 R.folhas.forEach(f=>{const F=new THREE.Group();F.position.set(f.ox,f.oy||0,f.z);F.userData={ox:f.ox,ab:(f.dir||0)*(f.curso||0)};ROOT.add(F);FOL.push(F);GR.push(F);});
 R.P.forEach((o,ix)=>{if(o.vz||o.oc)return;let ms;
  if(o.vid){const vv=vDim(o);ms=new THREE.Mesh(new THREE.BoxGeometry(vv[0],vv[1],vEsp(o)),MVID);ms.position.set(o.p[0],o.p[1],o.p[2]);}
  else{if(!SEC[o.c]&&!SEC[{'US-285':'VZ-006'}[o.c]])return;ms=new THREE.Mesh(geoSec(o.c,o.len,o.ex,o.ey,o.ez,o.sc),MAT);ms.position.set(o.p[0],o.p[1],o.p[2]);}
  GEO.push(ms.geometry);
  const hd=new THREE.Group();hd.add(ms);GR[o.g+1].add(hd);
  const k=o.g<0?260:150,zf=o.g>=0?(R.folhas[o.g].z>0?420:-420):0;
  hd.userData={o,ix,ms,t:0,tt:0,ex:new THREE.Vector3(o.x[0]*k,o.x[1]*k,o.x[2]*k+zf)};
  ms.userData.hd=hd;PECAS.push(hd);});
 const om=E.ordemMarco;
 PECAS.sort((a,b)=>{const A=a.userData.o,B=b.userData.o;if(A.g!==B.g)return A.g-B.g;if(A.g<0&&om)return (om.indexOf(A.c)+1||99)-(om.indexOf(B.c)+1||99)||a.userData.ix-b.userData.ix;return a.userData.ix-b.userData.ix;});
 const r=Math.max(L,H)*1.6+900;PISO.scale.set(r,1,r);PISO.position.y=-H/2-1;
 enquadra(false);}
const matBase=hd=>hd.userData.o.vid?MVID:MAT;
function materiais(fn){PECAS.forEach(p=>{p.userData.ms.material=fn(p);});}

let VISTA='ext',voo=null;
function enquadra(anim){const d=(Math.max(L,H)*1.55+700)/Math.min(1,(CAM.aspect||1)*1.15),ext=VISTA==='ext';if(!anim)CT.target.set(0,0,0);
 const p=VISTA==='lat'?new THREE.Vector3(d*.97,d*.12,-d*.2):new THREE.Vector3(ext?-d*.22:d*.22,d*.12,ext?-d:d);if(anim)voa(p,new THREE.Vector3());else{CAM.position.copy(p);CT.update();}}
function voa(p,alvo){voo={a:CAM.position.clone(),b:p,ta:CT.target.clone(),tb:(alvo||CT.target).clone(),t:0};}

/* ---------- cartão embaixo à esquerda ---------- */
function card(html){const c=$('oxCard');if(html==null){c.hidden=true;c.innerHTML='';return c;}c.innerHTML=html;c.hidden=false;return c;}
function hint(t){$('oxHint').textContent=t||'';$('oxHint').hidden=!t;}

/* ---------- montar peça por peça (manual) ---------- */
let seq=-1,desm=false;
function corteTxt(o){const inf=info(o);
 if(o.vid){const [w,h]=vDim(o);return 'Corte do catálogo: '+(vTxt?esc(vTxt)+' → ':'')+num(w)+' × '+num(h)+' mm';}
 const kg=inf.kgm!=null?kgf(inf.kgm)+' kg/m':PEND;
 return 'Corte do catálogo: '+(inf.ft?esc(inf.ft)+' → '+mm(inf.len):PEND)+' · '+kg;}
function seqInicio(){fechaFolhas();sairCorte(true);fechaPalco(true);desm=false;$('oxDesm').setAttribute('aria-pressed','false');
 PECAS.forEach(p=>{p.userData.t=p.userData.tt=0;});seq=0;seqAplica(true);$('oxMont').setAttribute('aria-pressed','true');}
function seqAplica(anima){
 PECAS.forEach((p,i)=>{const u=p.userData;
  if(i<seq){p.visible=true;u.ms.material=u.o.vid?MGV:MGH;u.tt=0;}
  else if(i===seq){p.visible=true;u.ms.material=u.o.vid?MVID:MCUR;if(anima){u.t=1;}u.tt=0;}
  else{p.visible=false;u.t=u.tt=0;}});
 const p=PECAS[seq],o=p.userData.o,inf=info(o),N=PECAS.length;
 card(`<div class="k">Peça ${seq+1} de ${N} · ${esc(inf.nm)} · ${esc(grupoDe(o))}</div>
  <div class="v">${o.vid?esc(inf.nm):esc(o.c)+(inf.nmc||inf.nm!=='Perfil'?' · '+esc(inf.nmc||inf.nm):'')}</div>
  <div class="p">${corteTxt(o)}</div>
  <div class="bar"><i style="width:${(seq+1)/N*100}%"></i></div>
  <div class="acts"><button class="oxbtn" type="button" id="oxAnt"${seq===0?' disabled':''}>‹ Anterior</button>
   <button class="oxbtn pri" type="button" id="oxProx">${seq===N-1?'Concluir ✓':'Próxima ›'}</button>
   <button class="oxbtn" type="button" id="oxPerto">🔍 Ver de perto</button>
   <button class="oxbtn" type="button" id="oxSeqX">Fechar</button></div>`);
 $('oxAnt').onclick=()=>seqVai(-1);$('oxProx').onclick=()=>seqVai(1);$('oxPerto').onclick=()=>abrePalco(PECAS[seq]);$('oxSeqX').onclick=seqFim;
 hint('As peças já montadas ficam transparentes · arraste para girar');}
function seqVai(d){if(seq<0)return;const n=seq+d;if(n<0)return;if(n>=PECAS.length){seqFim();return;}seq=n;seqAplica(d>0);}
function seqFim(){if(seq<0)return;seq=-1;fechaPalco(true);PECAS.forEach(p=>{p.visible=true;p.userData.tt=0;});materiais(matBase);card(null);
 $('oxMont').setAttribute('aria-pressed','false');hint('Toque numa peça para ver de perto · arraste para girar');}

/* ---------- toque na peça ---------- */
const RC=new THREE.Raycaster(),PT=new THREE.Vector2();let down=null,hov=null;
function pick(ev){const r=RN.domElement.getBoundingClientRect();PT.set((ev.clientX-r.left)/r.width*2-1,-(ev.clientY-r.top)/r.height*2+1);RC.setFromCamera(PT,CAM);
 const hits=RC.intersectObjects(PECAS.filter(p=>p.visible).map(p=>p.userData.ms),false);
 const h=hits.find(x=>!x.object.userData.hd.userData.o.vid)||hits[0];return h?h.object.userData.hd:null;}
RN.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
RN.domElement.addEventListener('pointerup',e=>{if(!down)return;const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(mv>6||seq>=0||cAt)return;const p=pick(e);if(p)abrePalco(p);});
RN.domElement.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||down||seq>=0||cAt)return;const p=pick(e);if(p===hov)return;
 if(hov)hov.userData.ms.material=matBase(hov);hov=p&&!p.userData.o.vid?p:null;if(hov)hov.userData.ms.material=MHOV;RN.domElement.style.cursor=p?'pointer':'grab';});
function tiraHover(){if(hov){hov.userData.ms.material=matBase(hov);hov=null;}}

/* ---------- ver de perto: a peça sai da janela, de frente para a seção, com as cotas ---------- */
let PR=null,PS=null,PC=null,PG=null,PSPIN=null,palcoHd=null,palcoT0=0,pFrom=null;
function palcoInit(){if(PR)return;PR=new THREE.WebGLRenderer({antialias:true,alpha:true});PR.setPixelRatio(Math.min(2,devicePixelRatio||1));PR.outputEncoding=THREE.sRGBEncoding;$('oxPcv').appendChild(PR.domElement);
 PS=new THREE.Scene();PC=new THREE.PerspectiveCamera(32,1,1,40000);
 PS.add(new THREE.HemisphereLight('#ffffff','#2c3c3c',.9));const a=new THREE.DirectionalLight('#ffffff',1);a.position.set(500,900,1200);PS.add(a);const b=new THREE.DirectionalLight('#bfe8e4',.5);b.position.set(-900,-200,-700);PS.add(b);
 const wm=document.createElement('div');wm.className='oxwm';wm.innerHTML='<b>© FC Consultoria em Esquadria · Plataforma FC 3D</b>';$('oxPcv').appendChild(wm);}
function sprite(txt,cor,fundo){const c=document.createElement('canvas'),k=c.getContext('2d');k.font='700 44px Inter,system-ui';const w=Math.ceil(k.measureText(txt).width)+44;c.width=w;c.height=80;
 k.fillStyle=fundo||'rgba(15,26,25,.9)';k.beginPath();if(k.roundRect)k.roundRect(0,4,w,72,20);else k.rect(0,4,w,72);k.fill();k.font='700 44px Inter,system-ui';k.fillStyle=cor||'#ffd58a';k.textBaseline='middle';k.fillText(txt,22,42);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));s.renderOrder=20;s.userData.ar=w/80;return s;}
function cotaSeg(A,B,n,txt){const g=new THREE.Group(),m=new THREE.LineBasicMaterial({color:'#ffd58a',depthTest:false,transparent:true}),a=V(A),b=V(B),N=V(n),dl=Math.max(2,a.distanceTo(b)*.06);
 const pts=[a,b,a.clone().addScaledVector(N,-dl),a.clone().addScaledVector(N,dl),b.clone().addScaledVector(N,-dl),b.clone().addScaledVector(N,dl)];
 const l=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),m);l.renderOrder=19;g.add(l);
 const s=sprite(txt);s.position.copy(a.clone().add(b).multiplyScalar(.5)).addScaledVector(N,-dl*2.2);g.add(s);g.userData.s=s;return g;}
function abrePalco(hd){if(palcoHd)fechaPalco(true);palcoInit();tiraHover();
 const u=hd.userData,o=u.o;palcoHd=hd;
 const wp=new THREE.Vector3();u.ms.getWorldPosition(wp);wp.project(CAM);pFrom={x:wp.x,y:wp.y};
 hd.visible=false;
 if(PG){PS.remove(PG);PG.traverse(c=>{if(c.geometry)c.geometry.dispose();if(c.material&&c.material.map)c.material.map.dispose();});}
 PG=new THREE.Group();PSPIN=new THREE.Group();PG.add(PSPIN);PS.add(PG);
 let len,sw,sh;const cotas=[];
 if(o.vid){const [w,h]=vDim(o);len=w;sw=h;sh=vEsp(o);const mt=MVID.clone();mt.opacity=.45;PSPIN.add(new THREE.Mesh(new THREE.BoxGeometry(w,h,sh),mt));
  cotas.push(cotaSeg([-w/2,-h/2-50,0],[w/2,-h/2-50,0],[0,1,0],mm(w)),cotaSeg([w/2+50,-h/2,0],[w/2+50,h/2,0],[1,0,0],mm(h)));}
 else{const d=SEC[o.c],k=o.sc||[1,1];let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;d.s.forEach(q=>q.o.forEach(([a,b])=>{a*=k[0];b*=k[1];x0=Math.min(x0,a);x1=Math.max(x1,a);y0=Math.min(y0,b);y1=Math.max(y1,b);}));
  sw=x1-x0;sh=y1-y0;const M2=Math.max(sw,sh);len=M2*1.5;
  const g=geoSec(o.c,len,null,null,null,o.sc);g.translate(-(x0+x1)/2,-(y0+y1)/2,0);PSPIN.add(new THREE.Mesh(g,MAT));
  const zf=len/2+.5,of=M2*.16,ax=sw/2,ay=sh/2;
  cotas.push(cotaSeg([-ax,-ay-of,zf],[ax,-ay-of,zf],[0,1,0],mm(sw)),cotaSeg([ax+of,-ay,zf],[ax+of,ay,zf],[1,0,0],mm(sh)));}
 cotas.forEach(c=>PG.add(c));PG.userData={len,vid:!!o.vid};
 $('oxPinfo').innerHTML=ficha(o);$('oxPalco').hidden=false;tamPalco();
 {const box=$('oxPcv').getBoundingClientRect(),asp=Math.max(.5,box.width/Math.max(1,box.height));
  const span=o.vid?Math.max(len,sw*asp)*1.25+160:Math.max(sw,sh)*3,dist=span/2/Math.tan(THREE.MathUtils.degToRad(16))/Math.min(1,asp);
  PC.position.set(0,dist*.1,dist);PC.lookAt(0,0,0);PG.userData.dist=dist;const sz=dist*.034;cotas.forEach(c=>{const sp=c.userData.s;sp.scale.set(sz*sp.userData.ar,sz,1);});}
 requestAnimationFrame(()=>$('oxPalco').classList.add('on'));palcoT0=performance.now();
 $('oxPX').onclick=()=>fechaPalco();}
/* ficha enxuta: seção e desenho de detalhe; sem comprimento, fórmula, ângulo e peso da peça */
function ficha(o){const inf=info(o),gr=grupoDe(o);
 if(o.vid)return `<div class="cd">${esc(gr)}</div><h3>${esc(inf.nm)}</h3>
  <dl><dt>Medida</dt><dd>${mm(inf.w)} × ${mm(inf.h)}</dd><dt>Espessura</dt><dd>${vEsp(o)} mm</dd></dl>
  <p class="fonte">Para L ${L} × H ${H} mm. ${fonte()}</p>
  <div><button class="oxbtn pri" id="oxPX" type="button">↩ Voltar a peça</button></div>`;
 const det=o.c==='SU-003'?RAIZ+'orientativo/img2d/SU-003.webp':RAIZ+'../../perfis/med/'+encodeURIComponent(o.c)+'.webp';
 return `<div class="cd">${esc(o.c)} · ${esc(gr)}</div><h3>${esc(inf.nm)}</h3>
  <dl><dt>Seção</dt><dd>${inf.secW!=null?mm(inf.secW)+' × '+mm(inf.secH):PEND}</dd></dl>
  <div><div class="cd" style="margin-bottom:6px">Detalhe do perfil · medidas do catálogo</div>
  <img src="${det}" data-alt="${RAIZ}orientativo/img2d/${encodeURIComponent(o.c)}.webp" alt="Detalhe do perfil ${esc(o.c)} com as medidas" onerror="if(this.dataset.alt&&this.src.indexOf(this.dataset.alt)<0){this.src=this.dataset.alt;this.dataset.alt='';}else{this.hidden=true;this.nextElementSibling.hidden=false}"><div hidden>${secSVG(o.c)}</div></div>
  <p class="fonte">${fonte()}</p>
  <div><button class="oxbtn pri" id="oxPX" type="button">↩ Voltar a peça</button></div>`;}
function secSVG(c){const d=SEC[c];if(!d)return '';const pad=Math.max(d.w,d.h)*.22,W2=d.w/2,H2=d.h/2;
 const path=d.s.map(s=>[s.o].concat(s.h||[]).map(r=>'M'+r.map(([a,b])=>a.toFixed(2)+' '+(-b).toFixed(2)).join('L')+'Z').join('')).join('');
 const fs=Math.max(d.w,d.h)*.075;
 return `<svg viewBox="${-W2-pad} ${-H2-pad} ${d.w+2*pad} ${d.h+2*pad+fs*1.2}" role="img" aria-label="Seção do ${esc(c)}">
  <path d="${path}" fill="#c6ccd0" fill-rule="evenodd" stroke="#14212a" stroke-width="${(Math.max(d.w,d.h)/260).toFixed(3)}"/>
  <g stroke="#02717d" stroke-width="${(Math.max(d.w,d.h)/300).toFixed(3)}" fill="none"><path d="M${-W2} ${H2+pad*.45}H${W2}M${-W2} ${H2+pad*.25}v${pad*.4}M${W2} ${H2+pad*.25}v${pad*.4}M${W2+pad*.45} ${-H2}V${H2}M${W2+pad*.25} ${-H2}h${pad*.4}M${W2+pad*.25} ${H2}h${pad*.4}"/></g>
  <text x="0" y="${H2+pad*.45+fs*1.15}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#02717d" font-family="Inter,system-ui">${mm(d.w)}</text>
  <text x="${W2+pad*.62}" y="0" font-size="${fs}" font-weight="700" fill="#02717d" font-family="Inter,system-ui" transform="rotate(90 ${W2+pad*.62} 0)" text-anchor="middle">${mm(d.h)}</text></svg>`;}
function fechaPalco(rapido){if(!palcoHd)return;const hd=palcoHd;palcoHd=null;hd.visible=true;$('oxPalco').classList.remove('on');
 const fim=()=>{if(!palcoHd)$('oxPalco').hidden=true;};if(rapido)fim();else setTimeout(fim,250);}
function tamPalco(){if(!PR)return;const b=$('oxPcv').getBoundingClientRect();PR.setSize(Math.max(1,b.width),Math.max(1,b.height),false);PC.aspect=Math.max(1,b.width)/Math.max(1,b.height);PC.updateProjectionMatrix();}

/* ---------- cortes 01 a 05: janela transparente, só a seção em creme ---------- */
function wpt(o,a,b){const k=o.sc||[1,1];a*=k[0];b*=k[1];let x=o.p[0]+a*o.ex[0]+b*o.ey[0],y=o.p[1]+a*o.ex[1]+b*o.ey[1],z=o.p[2]+a*o.ex[2]+b*o.ey[2];
 if(o.g>=0){const f=R.folhas[o.g];x+=f.ox;y+=f.oy||0;z+=f.z;}return [x,y,z];}
function planoDe(c){return c.pl==='h'?{eixo:1,v:0}:{eixo:0,v:-L*.2};}
function zona(c){const m=190;
 if(c.pl==='h'){const y0=-60,y1=60;return c.zona==='esq'?[-L/2-30,y0,-L/2+m,y1]:c.zona==='dir'?[L/2-m,y0,L/2+30,y1]:[-120,y0,120,y1];}
 const x0=-60,x1=60,mv=125;return c.zona==='baixo'?[x0,H/2-mv,x1,H/2+30]:[x0,-H/2-30,x1,-H/2+mv];}
function secCorte(c){const P=planoDe(c),out=[];
 R.P.forEach(o=>{if(o.vz||o.oc)return;
  const fo=o.g>=0?[R.folhas[o.g].ox,R.folhas[o.g].oy||0,R.folhas[o.g].z]:[0,0,0];
  if(o.vid){const vv=vDim(o),cx=o.p[0]+fo[0],cy=o.p[1]+fo[1],cz=o.p[2]+fo[2],w=vv[0],h=vv[1],d=vEsp(o);
   if(P.eixo===1&&Math.abs(cy-P.v)<h/2)out.push({vid:1,r:[-(cx+w/2),-(cz+d/2),w,d]});
   if(P.eixo===0&&Math.abs(cx-P.v)<w/2)out.push({vid:1,r:[cz-d/2,-(cy+h/2),d,h]});return;}
  if(Math.abs(o.ez[P.eixo])<.9)return;
  const cen=o.p[P.eixo]+fo[P.eixo];if(Math.abs(cen-P.v)>o.len/2)return;
  const d=SEC[o.c];if(!d)return;
  const map=([a,b])=>{const w=wpt(o,a,b);return P.eixo===1?[-w[0],-w[2]]:[w[2],-w[1]];};
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;d.s.forEach(s=>s.o.forEach(p=>{const q=map(p);x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}));
  out.push({c:o.c,shp:d.s.map(q=>({o:q.o.map(map),h:(q.h||[]).map(hh=>hh.map(map))})),bb:[x0,y0,x1,y1]});});
 const z=zona(c);return out.filter(s=>{const b=s.vid?[s.r[0],s.r[1],s.r[0]+s.r[2],s.r[1]+s.r[3]]:s.bb;return b[2]>z[0]&&b[0]<z[2]&&b[3]>z[1]&&b[1]<z[3];});}
let cAt=null,CAPS=null;
function alvoDe(c){const P=planoDe(c),z=zona(c),Xc=(z[0]+z[2])/2,Yc=(z[1]+z[3])/2,d=Math.max(z[2]-z[0],z[3]-z[1])*1.7+120,ext=VISTA==='int'?1:-1;let alvo,pos;
 if(P.eixo===1){alvo=new THREE.Vector3(-Xc,P.v,-Yc);pos=new THREE.Vector3(alvo.x+(c.zona==='esq'?-1:c.zona==='dir'?1:.3)*d*.14,P.v+d*.93,alvo.z+ext*d*.34);}
 else{alvo=new THREE.Vector3(P.v,-Yc,Xc);pos=new THREE.Vector3(P.v-d*.93,alvo.y+(c.zona==='baixo'?1:-1)*d*.16,alvo.z+ext*d*.32);}
 return {alvo,pos};}
function limpaCaps(){if(CAPS){SC.remove(CAPS);CAPS.traverse(o=>{if(o.geometry)o.geometry.dispose();});CAPS=null;}}
function abreCorte(id){const c=E.cortes.find(x=>x.id===id);if(!c)return;
 if(cAt&&cAt.id===id){sairCorte();return;} /* tocar de novo no corte sai do corte */
 fechaPalco(true);if(seq>=0)seqFim();tiraHover();desm=false;$('oxDesm').setAttribute('aria-pressed','false');
 PECAS.forEach(p=>{p.visible=true;p.userData.t=p.userData.tt=0;});
 fechaFolhas();cAt=c;const P=planoDe(c),z=zona(c),S=secCorte(c);
 materiais(p=>p.userData.o.vid?MGV:MGC);PISO.visible=false;
 limpaCaps();CAPS=new THREE.Group();SC.add(CAPS);
 const B=P.eixo===1?new THREE.Matrix4().makeBasis(new THREE.Vector3(-1,0,0),new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0)).setPosition(0,P.v,0)
                   :new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,1),new THREE.Vector3(0,-1,0),new THREE.Vector3(1,0,0)).setPosition(P.v,0,0);
 S.forEach(q=>{let shp;
  if(q.vid){const r=q.r.slice();if(P.eixo===1){const a=Math.max(r[0],z[0]-40),b=Math.min(r[0]+r[2],z[2]+40);r[0]=a;r[2]=b-a;}else{const a=Math.max(r[1],z[1]-40),b=Math.min(r[1]+r[3],z[3]+40);r[1]=a;r[3]=b-a;}if(r[2]<=0||r[3]<=0)return;shp=[new THREE.Shape([new THREE.Vector2(r[0],r[1]),new THREE.Vector2(r[0]+r[2],r[1]),new THREE.Vector2(r[0]+r[2],r[1]+r[3]),new THREE.Vector2(r[0],r[1]+r[3])])];}
  else shp=q.shp.map(t=>{const sh=new THREE.Shape(t.o.map(([a,b])=>new THREE.Vector2(a,b)));t.h.forEach(hh=>sh.holes.push(new THREE.Path(hh.map(([a,b])=>new THREE.Vector2(a,b)))));return sh;});
  /* fatia fina (3 mm) para a seção aparecer de qualquer ângulo */
  const g=new THREE.ExtrudeGeometry(shp,{depth:5,bevelEnabled:false,curveSegments:3});g.translate(0,0,-2.5);g.applyMatrix4(B);g.computeVertexNormals();
  const m=new THREE.Mesh(g,q.vid?MCAPV:MCAP);m.renderOrder=5;CAPS.add(m);});
 const {alvo,pos}=alvoDe(c);
 voa(pos,alvo);marcaCortes();
 card(`<div class="k">Corte ${c.id} · ${esc(c.n)}</div>
  <div class="p">Seção real dos perfis, na mesma posição do desenho ${E.pg?'da pág. '+E.pg:'do catálogo · '+esc(M.cd)}.</div>
  <div class="acts"><button class="oxbtn" type="button" id="oxCX">Fechar</button></div>`);
 $('oxCX').onclick=()=>sairCorte();hint('Arraste para girar · toque de novo no corte para sair');}
function sairCorte(semCamera){if(!cAt)return;cAt=null;limpaCaps();materiais(matBase);PISO.visible=true;card(null);marcaCortes();
 if(!semCamera)enquadra(true);hint('Toque numa peça para ver de perto · arraste para girar');}
function marcaCortes(){L0.querySelectorAll('[data-corte]').forEach(b=>b.setAttribute('aria-pressed',String(!!cAt&&b.dataset.corte===cAt.id)));const b=$('oxCor');if(b){b.setAttribute('aria-pressed',String(!!cAt));b.textContent=cAt?'✂ Corte '+cAt.id+' ▾':'✂ Cortes ▾';}}

/* ---------- barra do topo ---------- */
let ab=0,abT=0,jun=true,CLS=false;
function aplicaFolhas(){FOL.forEach(F=>{F.position.x=F.userData.ox+F.userData.ab*ab;});}
function fechaFolhas(){ab=abT=0;aplicaFolhas();$('oxAbr').setAttribute('aria-pressed','false');}
/* qualquer comando da barra volta do 3D clássico (abas Componentes, Trocar perfil, Usinagens, Vento) */
function usa(){if(CLS&&API.aoVoltar)API.aoVoltar();classico(false);fechaDD();}
function classico(on){CLS=!!on;L0.classList.toggle('cls',CLS);$('oxVolta').hidden=!CLS;
 if(CLS){fechaPalco(true);if(seq>=0)seqFim();sairCorte(true);fechaMed();}else{tam();retoma();}}
const vista=v=>{usa();VISTA=v;L0.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));
 if(cAt){const id=cAt.id;cAt=null;abreCorte(id);}else enquadra(true);};
L0.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>vista(b.dataset.v));
$('oxAbr').onclick=()=>{usa();sairCorte(true);if(seq>=0)seqFim();if(desm){desm=false;PECAS.forEach(p=>p.userData.tt=0);$('oxDesm').setAttribute('aria-pressed','false');}
 abT=abT?0:1;$('oxAbr').setAttribute('aria-pressed',String(!!abT));};
$('oxMont').onclick=()=>{usa();if(seq>=0)seqFim();else seqInicio();};
$('oxDesm').onclick=()=>{usa();fechaFolhas();sairCorte(true);if(seq>=0)seqFim();fechaPalco(true);desm=!desm;PECAS.forEach(p=>{p.visible=true;p.userData.tt=desm?1:0;});
 $('oxDesm').setAttribute('aria-pressed',String(desm));if(!cAt)enquadra(true);};
function fechaDD(){$('oxDD').hidden=true;$('oxCor').setAttribute('aria-expanded','false');}
$('oxCor').onclick=e=>{e.stopPropagation();const d=$('oxDD');if(CLS)usa();d.hidden=!d.hidden;$('oxCor').setAttribute('aria-expanded',String(!d.hidden));};
L0.querySelectorAll('[data-corte]').forEach(b=>b.onclick=()=>{usa();abreCorte(b.dataset.corte);});
const fora=e=>{if(!e.target.closest||!e.target.closest('.oxdw'))fechaDD();if(!e.target.closest||(!e.target.closest('#oxMedP')&&!e.target.closest('#oxMed')))fechaMed();};
document.addEventListener('pointerdown',fora);
$('oxJun').onclick=()=>{usa();jun=!jun;$('oxJun').setAttribute('aria-pressed',String(jun));};
$('oxVolta').onclick=()=>usa();
$('oxX').onclick=fecharCamada;
/* junções: os + ficam nos pontos dos cortes; tocou, abre o corte daquele ponto */
$('oxJ').innerHTML=E.cortes.map(c=>`<button type="button" data-j="${c.id}" title="Corte ${c.id} · ${esc(c.n)}" aria-label="Abrir o corte ${c.id}, ${esc(c.n)}">+</button>`).join('');
const JP={};E.cortes.forEach(c=>{const P=planoDe(c),z=zona(c),Xc=(z[0]+z[2])/2,Yc=(z[1]+z[3])/2;
 JP[c.id]=P.eixo===1?new THREE.Vector3(c.zona==='esq'?-L/2:c.zona==='dir'?L/2:0,P.v,0):new THREE.Vector3(P.v,c.zona==='baixo'?-H/2:H/2,0);});
$('oxJ').querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>abreCorte(b.dataset.j));
const tmpV=new THREE.Vector3();
function juncoes(){const box=$('oxJ'),on=jun&&!CLS&&seq<0&&!cAt&&!desm&&!palcoHd&&!ab&&!abT;box.style.display=on?'':'none';if(!on)return;
 const r=host.getBoundingClientRect();box.querySelectorAll('[data-j]').forEach(b=>{tmpV.copy(JP[b.dataset.j]).project(CAM);
  b.style.left=((tmpV.x+1)/2*r.width)+'px';b.style.top=((1-tmpV.y)/2*r.height)+'px';b.style.visibility=tmpV.z<1?'visible':'hidden';});}
/* medida: tocou no selo, muda L × H (vale para o 3D novo e para o clássico) */
function posMed(){const t=$('oxTop').offsetHeight+10;$('oxMed').style.top=t+'px';$('oxMedP').style.top=(t+34)+'px';}
function fechaMed(){$('oxMedP').hidden=true;}
$('oxMed').onclick=()=>{usa();const p=$('oxMedP');p.hidden=!p.hidden;if(!p.hidden)$('oxMw').focus();};
$('oxMok').onclick=()=>{const w=Math.round(+$('oxMw').value),h=Math.round(+$('oxMh').value);if(!(w>0&&h>0))return;fechaMed();
 const iw=document.getElementById('in-w'),ih=document.getElementById('in-h');
 if(iw&&ih){iw.value=w;iw.dispatchEvent(new Event('change',{bubbles:true}));ih.value=h;ih.dispatchEvent(new Event('change',{bubbles:true}));}
 if(API.aoMedir)API.aoMedir();};
['oxMw','oxMh'].forEach(i=>$(i).onkeydown=e=>{if(e.key==='Enter')$('oxMok').click();});
/* tela cheia: o palco inteiro (o 3D novo e, nas abas que usam, o clássico) */
const ST=document.getElementById('stage');
function emCheia(){return document.fullscreenElement===ST||document.webkitFullscreenElement===ST||ST.classList.contains('oxfx');}
function telaCheia(){if(emCheia()){if(ST.classList.contains('oxfx'))ST.classList.remove('oxfx');else if(document.exitFullscreen)document.exitFullscreen().catch(()=>{});else if(document.webkitExitFullscreen)document.webkitExitFullscreen();setTimeout(syncCheia,60);return;}
 const rq=ST.requestFullscreen||ST.webkitRequestFullscreen;
 if(rq){const r=rq.call(ST);if(r&&r.catch)r.catch(()=>{ST.classList.add('oxfx');syncCheia();});}else ST.classList.add('oxfx');setTimeout(syncCheia,60);}
function syncCheia(){const on=emCheia();$('oxFull').textContent=on?'⛶ Sair':'⛶';$('oxFull').title=on?'Sair da tela cheia':'Tela cheia';$('oxX').hidden=on||!!API.novo;tam();}
$('oxFull').onclick=telaCheia;
const onFs=()=>{if(!L0.isConnected)return;syncCheia();};
document.addEventListener('fullscreenchange',onFs);document.addEventListener('webkitfullscreenchange',onFs);
const onKey=e=>{if(L0.hidden)return;
 if(e.key==='Escape'){if(!$('oxDD').hidden)fechaDD();else if(!$('oxMedP').hidden)fechaMed();else if(palcoHd)fechaPalco();else if(cAt)sairCorte();else if(seq>=0)seqFim();else if(ST.classList.contains('oxfx')){ST.classList.remove('oxfx');syncCheia();}}
 else if(seq>=0&&!palcoHd&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();seqVai(e.key==='ArrowRight'?1:-1);}};
document.addEventListener('keydown',onKey);

/* ---------- laço ---------- */
function tam(){posMed();const b=host.getBoundingClientRect();RN.setSize(Math.max(1,b.width),Math.max(1,b.height),false);CAM.aspect=Math.max(1,b.width)/Math.max(1,b.height);CAM.updateProjectionMatrix();tamPalco();}
const ro=window.ResizeObserver?new ResizeObserver(tam):null;if(ro)ro.observe(L0);else addEventListener('resize',tam);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
let last=performance.now(),raf=0,vivo=true;
function loop(now){raf=0;if(!vivo||L0.hidden||CLS)return;raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 PECAS.forEach(p=>{const u=p.userData;if(u.t!==u.tt){const sp=seq>=0?1.6:1.8;u.t=u.tt>u.t?Math.min(u.tt,u.t+dt*sp):Math.max(u.tt,u.t-dt*sp);}
  const e=ease(u.t);p.position.set(u.ex.x*e,u.ex.y*e,u.ex.z*e);});
 if(ab!==abT){ab=abT>ab?Math.min(abT,ab+dt*.9):Math.max(abT,ab-dt*.9);aplicaFolhas();}
 if(voo){voo.t=Math.min(1,voo.t+dt*1.6);CAM.position.lerpVectors(voo.a,voo.b,ease(voo.t));CT.target.lerpVectors(voo.ta,voo.tb,ease(voo.t));if(voo.t>=1)voo=null;}
 CT.update();RN.render(SC,CAM);juncoes();
 if(palcoHd&&PR){const t=(now-palcoT0)/1000,k=Math.min(1,t/.7),e=ease(k),u=PG.userData;
  PG.position.set(pFrom.x*(1-e)*u.dist*.35,pFrom.y*(1-e)*u.dist*.25,-(1-e)*u.dist*.8);PG.scale.setScalar(.35+.65*e);
  if(u.vid)PSPIN.rotation.y=Math.sin(t*.7)*.5;else{PG.rotation.y=Math.sin(t*.55)*.6;PG.rotation.x=.14+Math.sin(t*.37)*.08;}
  PR.render(PS,PC);}}
function retoma(){if(!raf&&vivo){last=performance.now();raf=requestAnimationFrame(loop);}}

const API={key:KEY,L,H,novo:false,aoVoltar:null,aoMedir:null,
 acao(a){L0.hidden=false;tam();retoma();
  if(a==='montar'){usa();if(seq<0)seqInicio();}
  else if(a==='cheia'){if(!emCheia())telaCheia();}
  else if(a==='cortes'){usa();sairCorte(true);if(seq>=0)seqFim();enquadra(true);hint('Escolha um corte no botão ✂ Cortes ou toque num + das junções');}
  syncCheia();},
 classico,
 lista(){const g={};PECAS.forEach(p=>{const o=p.userData.o,k=o.vid?'vidro':o.c;if(!g[k]){const inf=info(o);g[k]={c:o.vid?'Vidro':o.c,nm:inf.nm,q:0,vid:!!o.vid,hd:p};}g[k].q++;});return Object.values(g);},
 verDePerto(hd){usa();if(seq>=0)seqFim();sairCorte(true);fechaFolhas();abrePalco(hd);},
 pausar(){if(raf){cancelAnimationFrame(raf);raf=0;}},
 destruir(){vivo=false;this.pausar();if(ro)ro.disconnect();document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',fora);
  document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  GEO.forEach(g=>g.dispose());limpaCaps();RN.dispose();if(PR)PR.dispose();}};
montar();tam();retoma();
return API;
}
})();

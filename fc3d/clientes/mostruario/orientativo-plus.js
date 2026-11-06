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
body:not(.oxfc) .oxsofc{display:none!important}
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
#oxPane .cmp img{width:46px;height:46px;object-fit:contain;border-radius:6px;background:#fff;flex:none}
#oxPane .cmp small{display:block;font:400 12px var(--f-mono,monospace);color:var(--muted,#5b6770);margin-top:2px}
#oxPane .cmp[aria-pressed="true"]{background:#fff1e0;box-shadow:inset 3px 0 0 #ff8a00}
#oxPane .swr{border-bottom:1px solid var(--line,#d5dce1);padding:10px 0}
#oxPane .swr.on{background:linear-gradient(90deg,#e1f3f1,transparent);box-shadow:inset 3px 0 0 #02717d;padding-left:8px}
#oxPane .swh{display:flex;gap:8px;align-items:baseline;cursor:pointer;margin-bottom:6px}
#oxPane .swh b{font:600 13px var(--f-mono,monospace)}#oxPane .swh span{font-size:13px;color:var(--muted,#5b6770)}
#oxPane .swo{display:flex;flex-wrap:wrap;gap:6px}
#oxPane .swo button{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:74px;padding:6px;border:1px solid var(--line,#d5dce1);border-radius:8px;background:#fff;cursor:pointer;font:600 12px var(--f-mono,monospace);color:#1b232a}
#oxPane .swo button img{width:52px;height:38px;object-fit:contain}
#oxPane .swo button small{font:400 10.5px var(--f-body,system-ui);color:var(--muted,#5b6770)}
#oxPane .swo button[aria-pressed="true"]{border-color:#02717d;box-shadow:0 0 0 2px #02717d inset;background:#eef8f7}
#oxPane .swc{margin-top:8px;font-size:12.5px}#oxPane .swc svg{width:100%;height:auto;max-height:130px;background:#f6f8f9;border-radius:6px}
#oxPane .swc table{width:100%;border-collapse:collapse;margin-top:6px}#oxPane .swc th,#oxPane .swc td{padding:3px 4px;border-bottom:1px solid #eef1f3;text-align:right;font-weight:500}#oxPane .swc th{text-align:left;color:var(--muted,#5b6770);font-weight:400}
#oxPane .swc .up{color:#b45309}#oxPane .swc .dn{color:#047857}
#oxPane .sw3{margin:6px 0;position:relative}#oxPane .sw3o{position:absolute;left:0;top:0;width:100%;height:170px;pointer-events:none}#oxPane .swc .sw3o svg{position:absolute;inset:0;width:100%;height:100%;max-height:none;background:none;border-radius:0;overflow:visible}#oxPane .sw3o line{stroke:#24313a;stroke-width:1.4}#oxPane .sw3o b{position:absolute;font:600 12px var(--f-mono,monospace);padding:3px 7px;border-radius:5px;white-space:nowrap}#oxPane .sw3o .t0{left:8px;top:8px;background:#fff;border:1.5px solid #24313a;color:#24313a}#oxPane .sw3o .t1{right:8px;top:8px;background:#6fd6cb;color:#08332f}#oxPane .sw3l{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:5px;font-size:11.5px;color:var(--muted,#5b6770)}#oxPane .sw3l i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}#oxPane .sw3l .dc{margin-left:auto;opacity:.8}
#oxPane .us small{display:block;font:400 12px var(--f-mono,monospace);color:var(--muted,#5b6770);margin-top:2px}#oxPane .us[aria-pressed="true"]{background:#fff1e0;box-shadow:inset 3px 0 0 #ff8a00}
#oxPane .oxlnk{background:none;border:0;color:#02717d;font:600 13px var(--f-body,system-ui);cursor:pointer;padding:4px 0 8px}
#oxPinfo dl.cmpf{display:block}#oxPinfo dl.cmpf dt{margin-top:8px}#oxPinfo dl.cmpf dd{text-align:left;font:400 13.5px/1.45 var(--f-body,system-ui);margin:2px 0 0}
#oxPinfo img{max-width:100%;max-height:120px;object-fit:contain;display:block;margin:6px 0;background:#fff;border-radius:6px}
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

let ACESSO=null,FCM=false; /* ACESSO: entrou na plataforma (cliente ou FC) · FCM: Acesso FC */
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
function sync(){semDiagrama();if(!ent)return;const ok=podeMostrar(),nv=querNovo();ent.hidden=!ok||nv;
 if(nv&&!NOVO)ligaNovo();else if(!nv&&NOVO)desligaNovo();
 else if(!ok&&L0&&!L0.hidden)fecharCamada();
 if(NOVO&&APP){const st=estado();if(st&&(APP.L!==st.w||APP.H!==st.h)&&!medindo)abrir('novo');}}

/* ===== Orientativo reorganizado (aprovação: JCR 200, só Acesso FC) =====
   O 3D novo vira o principal no palco, com uma barra só; o painel da direita vira abas.
   Componentes, Trocar perfil, Usinagens e Vento usam o 3D clássico enquanto a aba está aberta. */
const NOVO_TIPOS=['jcr200'];
/* layout novo em todas as tipologias Suprema e Gold que têm montagem */
const tipoNovo=t=>!!chaveDe(t);
/* no layout novo o Vento (dentro da tipologia) substitui o Diagrama de dimensões: o botão some nas tipologias do layout novo */
function semDiagrama(){const st=estado(),on=!!(ACESSO&&st&&tipoNovo(st.typo)),bt=document.getElementById('m-dia');if(!bt)return;
 if(on&&st.diaOn){try{const f=(0,eval)('setMode');if(typeof f==='function')f('exp');}catch(_){}}
 if(bt.dataset.oxdia!==String(on)){bt.dataset.oxdia=String(on);bt.style.display=on?'none':'';}}
let NOVO=false,medindo=false,abaAt='p',confCasa=null;
function querNovo(){const st=estado();return !!(ACESSO&&st&&tipoNovo(st.typo)&&st.mode==='exp'&&!st.wvOn&&!st.diaOn);}
const ABAS=[['p','Peças',null],['c','Componentes',null],['s','Trocar perfil',null],['u','Usinagens',null],['v','Vento','c-conf'],['b','Base técnica',null]];
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
function aba(k){if(abaAt==='v'&&k!=='v'&&typeof window.FC_VT_END==='function'){try{window.FC_VT_END();}catch(_){}}abaAt=k;if(APP&&APP.comps&&k!=='c')APP.comps(false);if(APP&&APP.trocas&&k!=='s')APP.trocas(false);if(APP&&APP.vento&&k!=='v')APP.vento(false);if(APP&&APP.usin&&k!=='u')APP.usin(false);const def=ABAS.find(a=>a[0]===k);
 document.querySelectorAll('#oxTabs [data-aba]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.aba===k)));
 document.querySelectorAll('#side>details.oxsel').forEach(e=>e.classList.remove('oxsel'));
 const pn=document.getElementById('oxPane');if(!pn)return;
 if(def[2]){const el=document.getElementById(def[2]);pn.hidden=true;if(el){el.classList.add('oxsel');el.open=true;}if(APP){if(k==='v'&&APP.vento)APP.vento(true);else APP.classico(true);}return;}
 pn.hidden=false;if(APP)APP.classico(false);
 if(k==='c'){compPane();return;}
 if(k==='s'){trocaPane();return;}
 if(k==='u'){usinPane();return;}
 if(k==='b'){pn.innerHTML='<p class="nt">Desenho do catálogo técnico que serviu de base para o 3D.</p><img src="base/jcr200.webp" alt="Folha de montagem da SUP JCR 200 com elevação e cortes" loading="lazy"><p class="nt" style="margin-top:8px">Folha de montagem · elevação e cortes · catálogo p. 117. Fonte técnica: catálogo da Linha Suprema, SUP JCR 200.</p>';return;}
 pecasPane();}
function compPane(){const pn=document.getElementById('oxPane');if(!pn||abaAt!=='c')return;
 if(!APP){pn.innerHTML='<p class="nt">Abrindo os componentes…</p>';return;}
 if(!APP.comps(true)){pn.innerHTML='<p class="nt">Os componentes desta tipologia ainda não estão disponíveis no 3D novo.</p>';return;}
 const L=APP.compLista();
 pn.innerHTML='<p class="nt">Passe o mouse para localizar · toque para aproximar e ver o componente de perto</p><div id="oxCmp">'
  +L.map(x=>`<button type="button" class="lin cmp" data-c="${esc(x.c)}" aria-pressed="false">${x.img?`<img src="${x.img}" alt="">`:''}<span>${esc(x.n)}<small>${esc(x.c)} · ${esc(x.q)}</small></span></button>`).join('')+'</div>';
 const box=document.getElementById('oxCmp');
 box.querySelectorAll('[data-c]').forEach(b=>{b.onmouseenter=()=>APP.compHover(b.dataset.c);b.onclick=()=>{const c=APP.compAtual()===b.dataset.c?null:b.dataset.c;APP.compSel(c);if(c&&innerWidth<900){const st=document.getElementById('stage');if(st)st.scrollIntoView({behavior:'smooth',block:'start'});}};});
 box.onmouseleave=()=>APP.compHover(null);
 APP.aoComp=c=>box.querySelectorAll('[data-c]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===c)));}
function trocaPane(){const pn=document.getElementById('oxPane');if(!pn||abaAt!=='s')return;
 if(!APP){pn.innerHTML='<p class="nt">Abrindo os perfis…</p>';return;}
 APP.trocas(true);const L=APP.trocaLista();
 if(!L.length){pn.innerHTML='<p class="nt">Esta tipologia não tem perfis alternativos no catálogo.</p>';return;}
 pn.innerHTML='<p class="nt">Toque numa opção para trocar o perfil na janela · o perfil trocado fica destacado</p>'+(L.some(r=>r.cur!==r.b)?'<button type="button" class="oxlnk" id="oxSwR">↺ Voltar todos aos originais</button>':'')
  +L.map(r=>`<div class="swr${r.cur!==r.b?' on':''}" data-b="${esc(r.b)}"><div class="swh"><b>${esc(r.b)}</b><span>${esc(r.nm)}</span></div>
  <div class="swo">${r.opts.map(o=>`<button type="button" data-o="${esc(o.o)}" aria-pressed="${o.o===r.cur}">${o.img?`<img src="${o.img}" alt="">`:''}<span>${esc(o.o.replace('+',' + '))}</span><small>${esc(o.sub)}</small></button>`).join('')}</div>
  ${r.cmp?`<div class="swc">${r.cmp}</div>`:''}</div>`).join('');
 pn.querySelectorAll('.swr').forEach(row=>{const b=row.dataset.b;
  row.onmouseenter=()=>APP.trocaFoco(b,false);
  row.querySelector('.swh').onclick=()=>APP.trocaFoco(b,true);
  row.querySelectorAll('[data-o]').forEach(x=>x.onclick=()=>{APP.troca(b,x.dataset.o);trocaPane();if(innerWidth<900){const st=document.getElementById('stage');if(st)st.scrollIntoView({behavior:'smooth',block:'start'});}});});
 const rz=document.getElementById('oxSwR');if(rz)rz.onclick=()=>{APP.trocaZera();trocaPane();};
 const s3=[...pn.querySelectorAll('.sw3')],at=s3.find(x=>x.dataset.b===APP.trocaAtiva())||s3[0];
 s3.forEach(x=>{const bt=x.querySelector('.sw3b');if(bt)bt.onclick=()=>{APP.trocaFoco(x.dataset.b,true);APP.miniComp(x,x.dataset.b);};});
 if(at)requestAnimationFrame(()=>APP.miniComp(at,at.dataset.b));
 pn.onmouseleave=()=>APP.trocaFoco(null,false);
 APP.aoTroca=trocaPane;APP.aoTrocaFoco=b=>pn.querySelectorAll('.swr').forEach(r=>{if(r.dataset.b===b)r.scrollIntoView({block:'nearest',behavior:'smooth'});});}
function usinPane(){const pn=document.getElementById('oxPane');if(!pn||abaAt!=='u')return;
 if(!APP){pn.innerHTML='<p class="nt">Abrindo as usinagens…</p>';return;}
 APP.usin(true);const L=APP.usinLista();
 if(!L.length){pn.innerHTML='<p class="nt">Esta tipologia não tem usinagens cadastradas no catálogo.</p>';return;}
 pn.innerHTML='<p class="nt">Toque numa usinagem para ver no 3D onde ela é feita · o ponto laranja marca o lugar</p><div id="oxUs">'
  +L.map(u=>`<button type="button" class="lin us" data-u="${esc(u.id)}" aria-pressed="false"><b>${esc(u.id)}</b><span>${esc(u.s)}<small>${esc(u.p.join(' · '))}</small></span></button>`).join('')+'</div>';
 const box=document.getElementById('oxUs');
 box.querySelectorAll('[data-u]').forEach(b=>{b.onmouseenter=()=>APP.usinHover(b.dataset.u);b.onclick=()=>{const u=APP.usinAtual()===b.dataset.u?null:b.dataset.u;APP.usinSel(u);if(u&&innerWidth<900){const st=document.getElementById('stage');if(st)st.scrollIntoView({behavior:'smooth',block:'start'});}};});
 box.onmouseleave=()=>APP.usinHover(null);
 APP.aoUsin=u=>box.querySelectorAll('[data-u]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.u===u)));}
function pecasPane(){const pn=document.getElementById('oxPane');if(!pn||abaAt!=='p')return;
 if(!APP){pn.innerHTML='<p class="nt">Abrindo as peças…</p>';return;}
 const L=APP.lista(),n=L.reduce((a,x)=>a+x.q,0);
 pn.innerHTML=`<p class="nt">${n} peças · toque para ver de perto</p><input type="search" id="oxBusca" placeholder="Buscar: código ou nome, ex. 053" autocomplete="off" aria-label="Buscar peça"><div id="oxLis"></div>`;
 const pinta=f=>{const q=(f||'').toLowerCase();document.getElementById('oxLis').innerHTML=L.map((x,i)=>({x,i})).filter(({x})=>!q||(x.c+' '+x.nm).toLowerCase().includes(q))
  .map(({x,i})=>`<button type="button" class="lin" data-i="${i}"><b>${esc(x.c)}</b><span>${esc(x.nm)}</span><i>${x.q}×</i> 🔍</button>`).join('')||'<p class="nt">Nenhuma peça com esse nome.</p>';
  document.querySelectorAll('#oxLis [data-i]').forEach(b=>b.onclick=()=>APP.verDePerto(L[+b.dataset.i].hd));};
 pinta('');document.getElementById('oxBusca').oninput=e=>pinta(e.target.value);}

/* liberado aos clientes: o layout novo vale para quem entrou na plataforma; o que é de conferência fica só no Acesso FC */
function liga(fc){if(fc)FCM=true;if(ACESSO){document.body.classList.toggle('oxfc',FCM);return;}ACESSO=true;document.body.classList.toggle('oxfc',FCM);carregarMotor().then(criaEntrada).catch(()=>{});}
document.addEventListener('pfc:acesso',e=>{liga(!!(e.detail&&e.detail.matriz));});
if(window.PFC_MATRIZ){const f=()=>liga(true);if(document.readyState!=='loading')setTimeout(f,0);else document.addEventListener('DOMContentLoaded',f);}

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
  <span class="tag oxsofc" title="Visão do Acesso FC">FC</span>
  <button class="oxbtn" type="button" data-v="ext" aria-pressed="true">Externa</button><button class="oxbtn" type="button" data-v="int" aria-pressed="false">Interna</button><button class="oxbtn" type="button" data-v="lat" aria-pressed="false">Lateral</button><span class="sep"></span>
  <button class="oxbtn" id="oxAbr" type="button" aria-pressed="false" title="Abre e fecha as folhas">↔ Abrir</button>
  <button class="oxbtn" id="oxMJ" type="button" title="Monta a janela inteira de uma vez">🔧 Montar janela</button>
  <button class="oxbtn" id="oxMont" type="button" aria-pressed="false">🧩 Peça por peça</button>
  <button class="oxbtn" id="oxDesm" type="button" aria-pressed="false">💥 Desmontar</button>
  <span class="oxdw"><button class="oxbtn" id="oxCor" type="button" aria-expanded="false" aria-pressed="false">✂ Cortes ▾</button>
   <div class="oxdd" id="oxDD" hidden role="menu">${E.cortes.map(c=>`<button class="oxbtn cut" type="button" role="menuitem" data-corte="${c.id}" aria-pressed="false">Corte ${c.id} · ${esc(c.n)}</button>`).join('')}</div></span><span class="sep"></span>
  <button class="oxbtn" id="oxJun" type="button" aria-pressed="true" title="Mostra os + das junções: tocou, abre o corte daquele ponto">⊕ Junções</button>
  <button class="oxbtn" id="oxVolta" type="button" hidden title="A aba aberta usa o 3D clássico">↩ Voltar ao 3D novo</button>
  <span class="sp"></span>
  <button class="oxbtn" id="oxFull" type="button" title="Tela cheia" aria-label="Tela cheia">⛶</button>
  ${M.aj&&FCM?'<a class="oxbtn" id="oxAjB" href="'+RAIZ+'tecnico/?m='+encodeURIComponent(KEY)+'" target="_blank" rel="noopener" title="Abre o Ajuste técnico desta montagem para corrigir a posição dos perfis" style="text-decoration:none;color:#ffd58a">🔧 Ajustar encaixes</a>':''}
  <button class="oxbtn" id="oxX" type="button" title="Volta ao 3D do Orientativo">✕ Fechar</button>
  ${M.aj&&FCM?'<div class="oxaj">⚠ <b>Ajuste pendente:</b> '+esc(M.aj)+'. Corrija no 🔧 Ajustar encaixes e salve; ao reabrir aqui, as peças já vêm na posição salva.</div>':''}
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
const MCAPL=new THREE.LineBasicMaterial({color:'#7a5a1c',transparent:true,opacity:.55});
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
 {const sw=trocasAtuais();R.P.forEach(o=>{if(o.vid||!o.c)return;const n=sw[o.c];if(n){const n0=n.split('+')[0];if(secDe(n0)){o.c0=o.c;o.c=n0;}}});}
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
RN.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};arrastaIni(e);});
RN.domElement.addEventListener('pointerup',e=>{if(!down)return;const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(mv>6||seq>=0||cAt)return;
 if(CMODO){const c=pickComp(e);if(c)compSel(c);return;}const p=pick(e);if(UMODO){if(p&&!p.userData.o.vid){const u=usinLista().find(x=>x.p.includes(doB(p))||x.p.includes(p.userData.o.c));if(u)usinSel(u.id);}return;}if(TMODO){if(p&&!p.userData.o.vid){tFoco=doB(p);trocaPinta();trocaCard(tFoco);if(API.aoTrocaFoco)API.aoTrocaFoco(tFoco);}return;}
 if(!p)return;const agora=performance.now();
 if(toque&&toque.p===p&&agora-toque.t<330){clearTimeout(toque.tm);toque=null;if(p.userData.solto)devolve(p);else solta(p);return;}
 if(toque)clearTimeout(toque.tm);toque={p,t:agora,tm:setTimeout(()=>{toque=null;if(!p.userData.solto)abrePalco(p);else soltoCard(p);},300)};});
RN.domElement.addEventListener('pointermove',e=>{if(arrasto){arrastaMove(e);return;}if(e.pointerType!=='mouse'||down||seq>=0||cAt)return;
 if(NSOLTO){const q=pick(e);sobreJanela=!!(q&&!q.userData.solto);CT.enableZoom=!(q&&q.userData.solto);}
 if(CMODO){const c=pickComp(e);if(c!==cHov){cHov=c;compPinta();}RN.domElement.style.cursor=c?'pointer':'grab';return;}const p=pick(e);if(p===hov)return;
 if(TMODO||UMODO){RN.domElement.style.cursor=p?'pointer':'grab';return;}if(hov)hov.userData.ms.material=matBase(hov);hov=p&&!p.userData.o.vid?p:null;if(hov)hov.userData.ms.material=MHOV;RN.domElement.style.cursor=p?'pointer':'grab';});
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
  if(q.vid){const r=q.r.slice();if(P.eixo===1){const a=Math.max(r[0],z[0]+30),b=Math.min(r[0]+r[2],z[2]-30);r[0]=a;r[2]=b-a;}else{const a=Math.max(r[1],z[1]+30),b=Math.min(r[1]+r[3],z[3]-30);r[1]=a;r[3]=b-a;}if(r[2]<=0||r[3]<=0)return;shp=[new THREE.Shape([new THREE.Vector2(r[0],r[1]),new THREE.Vector2(r[0]+r[2],r[1]),new THREE.Vector2(r[0]+r[2],r[1]+r[3]),new THREE.Vector2(r[0],r[1]+r[3])])];}
  else shp=q.shp.map(t=>{const sh=new THREE.Shape(t.o.map(([a,b])=>new THREE.Vector2(a,b)));t.h.forEach(hh=>sh.holes.push(new THREE.Path(hh.map(([a,b])=>new THREE.Vector2(a,b)))));return sh;});
  /* pedaço sólido em 3D: a peça cortada aparece com volume, a face do corte voltada para a câmera */
  const DEP=q.vid?60:90,g=new THREE.ExtrudeGeometry(shp,{depth:DEP,bevelEnabled:false,curveSegments:3});g.translate(0,0,P.eixo===1?-DEP:0);g.applyMatrix4(B);g.computeVertexNormals();
  const m=new THREE.Mesh(g,q.vid?MCAPV:MCAP);m.renderOrder=5;CAPS.add(m);
  if(!q.vid){const ln=new THREE.LineSegments(new THREE.EdgesGeometry(g,35),MCAPL);ln.renderOrder=6;CAPS.add(ln);}});
 const {alvo,pos}=alvoDe(c);
 voa(pos,alvo);marcaCortes();
 card(`<div class="k">Corte ${c.id} · ${esc(c.n)}</div>
  <div class="p">Seção real dos perfis, na mesma posição do desenho ${E.pg?'da pág. '+E.pg:'do catálogo · '+esc(M.cd)}.</div>
  <div class="acts"><button class="oxbtn" type="button" id="oxCX">Fechar</button></div>`);
 $('oxCX').onclick=()=>sairCorte();hint('Arraste para girar · toque de novo no corte para sair');}
function sairCorte(semCamera){if(!cAt)return;cAt=null;limpaCaps();materiais(matBase);PISO.visible=true;card(null);marcaCortes();
 if(TMODO){tCorte=false;trocaPinta();if(tFoco)trocaCard(tFoco);if(!semCamera&&tFoco){trocaVoa(tFoco);return;}}
 if(!semCamera)enquadra(true);hint('Toque numa peça para ver de perto · arraste para girar');}
function marcaCortes(){L0.querySelectorAll('[data-corte]').forEach(b=>b.setAttribute('aria-pressed',String(!!cAt&&b.dataset.corte===cAt.id)));const b=$('oxCor');if(b){b.setAttribute('aria-pressed',String(!!cAt));b.textContent=cAt?'✂ Corte '+cAt.id+' ▾':'✂ Cortes ▾';}}

/* ---------- barra do topo ---------- */
let ab=0,abT=0,jun=true,CLS=false,CMODO=false;
function aplicaFolhas(){FOL.forEach(F=>{F.position.x=F.userData.ox+F.userData.ab*ab;});}
function fechaFolhas(){ab=abT=0;aplicaFolhas();$('oxAbr').setAttribute('aria-pressed','false');}
/* qualquer comando da barra volta do 3D clássico (abas Componentes, Trocar perfil, Usinagens, Vento) */
function usa(){devolveTodas(true);if((CLS||CMODO||TMODO||VMODO||UMODO)&&API.aoVoltar)API.aoVoltar();classico(false);fechaDD();}
function classico(on){CLS=!!on;L0.classList.toggle('cls',CLS);$('oxVolta').hidden=!CLS;
 if(CLS){fechaPalco(true);if(seq>=0)seqFim();sairCorte(true);fechaMed();}else{tam();retoma();}}
const vista=v=>{if(CMODO||TMODO||VMODO||UMODO)classico(false);else usa();VISTA=v;L0.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));
 if(cAt){const id=cAt.id;cAt=null;abreCorte(id);}else if(CMODO&&cSel)compVoa(cSel);else if(TMODO&&tFoco)trocaVoa(tFoco);else if(UMODO&&uSel)usinVoa(usinDe(uSel));else enquadra(true);};
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
function juncoes(){const box=$('oxJ'),on=jun&&!CLS&&!CMODO&&!TMODO&&!VMODO&&!UMODO&&!NSOLTO&&!PECAS.some(p=>p.userData.t>.01)&&seq<0&&!cAt&&!desm&&!palcoHd&&!ab&&!abT;box.style.display=on?'':'none';if(!on)return;
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

/* ---------- componentes dentro do 3D novo (aba Componentes) ----------
   As peças e posições vêm do 3D clássico (mesmo catálogo), trazidas para a escala e o lugar da janela nova. */
const G=n=>{try{return (0,eval)(n);}catch(_){return null;}};
const MALT=new THREE.MeshStandardMaterial({color:'#c6ccd0',metalness:.35,roughness:.5,transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false});
const MCMPH=new THREE.MeshStandardMaterial({color:'#ff6a00',emissive:'#6a2600',emissiveIntensity:.6,roughness:.5,side:THREE.DoubleSide});
let CG=null,CIT={},cSel=null,cHov=null;
function compsLimpa(){if(CG){SC.remove(CG);CG=null;}CIT={};}
function mapaCls(){const prof=G('profMeshes')||[];if(!prof.length)return null;
 const bc=new THREE.Box3();prof.forEach(m=>{m.updateWorldMatrix(true,false);bc.expandByObject(m);});
 FOL.forEach(F=>{F.position.x=F.userData.ox;});const bn=new THREE.Box3();PECAS.forEach(p=>{if(!p.userData.o.vid){p.updateWorldMatrix(true,true);bn.expandByObject(p);}});aplicaFolhas();
 if(bc.isEmpty()||bn.isEmpty())return null;const cc=bc.getCenter(new THREE.Vector3()),cs=bc.getSize(new THREE.Vector3()),nc=bn.getCenter(new THREE.Vector3()),ns=bn.getSize(new THREE.Vector3());
 const k=new THREE.Vector3(ns.x/cs.x,ns.y/cs.y,ns.z/cs.z);return {cc,nc,k,p:v=>new THREE.Vector3(nc.x+(v.x-cc.x)*k.x,nc.y+(v.y-cc.y)*k.y,nc.z+(v.z-cc.z)*k.z)};}
function compsMonta(){compsLimpa();const objs=(G('compObjs')||[]).filter(m=>m&&m.userData&&m.userData.comp),prof=G('profMeshes')||[];
 if(!objs.length||!prof.length)return false;
 const bc=new THREE.Box3();prof.forEach(m=>{m.updateWorldMatrix(true,false);bc.expandByObject(m);});
 FOL.forEach(F=>{F.position.x=F.userData.ox;});const bn=new THREE.Box3();PECAS.forEach(p=>{if(!p.userData.o.vid){p.updateWorldMatrix(true,true);bn.expandByObject(p);}});aplicaFolhas();
 if(bc.isEmpty()||bn.isEmpty())return false;
 const cc=bc.getCenter(new THREE.Vector3()),cs=bc.getSize(new THREE.Vector3()),nc=bn.getCenter(new THREE.Vector3()),ns=bn.getSize(new THREE.Vector3());
 const k=new THREE.Vector3(ns.x/cs.x,ns.y/cs.y,ns.z/cs.z),pos=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();
 CG=new THREE.Group();CG.visible=false;SC.add(CG);
 objs.forEach(m=>{const c=m.userData.comp;m.updateWorldMatrix(true,true);m.matrixWorld.decompose(pos,q,sc);
  const cl=m.clone(true);cl.matrixAutoUpdate=true;cl.position.set(nc.x+(pos.x-cc.x)*k.x,nc.y+(pos.y-cc.y)*k.y,nc.z+(pos.z-cc.z)*k.z);cl.quaternion.copy(q);cl.scale.copy(sc).multiplyScalar(1000);
  const ms=[];cl.traverse(o=>{o.visible=true;if(o.isMesh){o.userData={mat0:o.material,cmp:c};ms.push(o);}});
  CG.add(cl);const it=CIT[c]||(CIT[c]={c,obj:[],ms:[],lbl:null});it.obj.push(cl);it.ms.push(...ms);if(m.userData.lbl&&!it.lbl)it.lbl=cl;});
 return Object.keys(CIT).length>0;}
function compInfo(c){const L=G('COMP')||[],x=L.find(z=>z.c===c)||{},I=G('CIMG')||{},it=CIT[c],n=it?it.obj.length:0;
 return {c,n:x.n||c,d:x.d||'',m:x.m||'',img:I[c]||'',q:x.lin?'por metro':((c==='FEC-636'||c==='FEC-645')?Math.max(1,n/2):n)+' nesta tipologia'};}
function compPinta(){Object.values(CIT).forEach(it=>{const on=it.c===cSel||it.c===cHov;it.ms.forEach(o=>{o.material=on?MCMPH:o.userData.mat0;});});}
function pickComp(ev){if(!CG)return null;const r=RN.domElement.getBoundingClientRect();PT.set((ev.clientX-r.left)/r.width*2-1,-(ev.clientY-r.top)/r.height*2+1);RC.setFromCamera(PT,CAM);
 const h=RC.intersectObjects(CG.children,true)[0];return h?h.object.userData.cmp||null:null;}
function compVoa(c){const it=CIT[c];if(!it)return;const o=it.lbl||it.obj[0],p=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
 const dir=CAM.position.clone().sub(CT.target).normalize();voa(p.clone().addScaledVector(dir,520),p);}
function compSel(c){cSel=c||null;compPinta();if(API.aoComp)API.aoComp(cSel);
 if(!cSel){fechaPalco(true);card(null);hint('Passe o mouse num componente para localizar · toque para aproximar');return;}
 const x=compInfo(cSel);compVoa(cSel);
 card(`<div class="k">Componente · ${esc(x.c)}</div><div class="v">${esc(x.n)}</div>
  <div class="p">${x.d?esc(x.d)+' · ':''}${esc(x.q)}${x.m?' · Medida: '+esc(x.m):''}</div>
  <div class="acts"><button class="oxbtn pri" type="button" id="oxCpP">🔍 Ver de perto</button><button class="oxbtn" type="button" id="oxCpX">Fechar</button></div>`);
 $('oxCpP').onclick=()=>abrePalcoComp(cSel);$('oxCpX').onclick=()=>compSel(null);
 hint('O componente fica em laranja · arraste para girar');}
function abrePalcoComp(c){const CM=G('compModel');if(typeof CM!=='function')return;if(palcoHd)fechaPalco(true);palcoInit();
 const SZ=G('COMP_SIZE')||{},MA=G('MA')||{},sz=SZ[MA[c]||c]||[.05,.05,.05],x=compInfo(c);
 let m;try{m=CM(c,sz[0],sz[1],sz[2],false,true);}catch(_){return;}
 if(PG){PS.remove(PG);PG.traverse(o=>{if(o.material&&o.material.map&&o.isSprite)o.material.map.dispose();});}
 PG=new THREE.Group();PSPIN=new THREE.Group();PG.add(PSPIN);PS.add(PG);
 const bx=new THREE.Box3().setFromObject(m),v=bx.getSize(new THREE.Vector3());bx.getCenter(m.position).negate();
 const g=new THREE.Group();g.add(m);g.scale.setScalar(110/Math.max(v.x,v.y,v.z,1e-6));{const R0={'ROL-426':[-.55,.5,0],'ROL-439':[-.55,.5,0],'NYL-332':[.2,-.75,0],'NYL-414':[.4,-.5,0]}[MA[c]||c]||[.3,.5,0];g.rotation.set(R0[0],R0[1],R0[2]);}PSPIN.add(g);
 palcoHd={visible:true};pFrom={x:0,y:0};
 $('oxPinfo').innerHTML=`<div class="cd">${esc(x.c)} · Componente</div><h3>${esc(x.n)}</h3>
  ${x.img?`<img src="${x.img}" alt="${esc(x.n)}">`:''}
  <dl class="cmpf">${x.d?`<dt>Aplicação</dt><dd>${esc(x.d)}</dd>`:''}${x.m?`<dt>Medida</dt><dd>${esc(x.m)}</dd>`:''}<dt>Quantidade</dt><dd>${esc(x.q)}</dd></dl>
  <p class="fonte">Fontes: catálogo técnico Suprema e catálogo MettallFleck (foto e cotas).</p>
  <div><button class="oxbtn pri" id="oxPX" type="button">↩ Voltar à janela</button></div>`;
 $('oxPalco').hidden=false;tamPalco();
 {const box=$('oxPcv').getBoundingClientRect(),asp=Math.max(.5,box.width/Math.max(1,box.height)),dist=160*1.9/2/Math.tan(THREE.MathUtils.degToRad(16))/Math.min(1,asp);
  PC.position.set(0,dist*.12,dist);PC.lookAt(0,0,0);PG.userData={len:160,vid:false,dist};}
 requestAnimationFrame(()=>$('oxPalco').classList.add('on'));palcoT0=performance.now();$('oxPX').onclick=()=>fechaPalco();}
function comps(on){on=!!on;if(on===CMODO)return on?!!CG:true;
 if(on){devolveTodas(true);classico(false);fechaPalco(true);if(seq>=0)seqFim();sairCorte(true);fechaFolhas();
  if(desm){desm=false;PECAS.forEach(p=>{p.userData.tt=0;});$('oxDesm').setAttribute('aria-pressed','false');}
  if(!compsMonta())return false;CMODO=true;CG.visible=true;tiraHover();materiais(p=>p.userData.o.vid?MGV:MALT);cSel=cHov=null;compPinta();
  hint('Passe o mouse num componente para localizar · toque para aproximar');enquadra(true);return true;}
 CMODO=false;cSel=cHov=null;fechaPalco(true);card(null);if(CG)CG.visible=false;compsLimpa();materiais(matBase);RN.domElement.style.cursor='grab';enquadra(true);
 hint('Toque numa peça para ver de perto · arraste para girar');return true;}

/* ---------- trocar perfil dentro do 3D novo (aba Trocar perfil) ----------
   A troca é a mesma do 3D clássico (mesma lista do catálogo); aqui a janela é remontada com a seção nova no lugar. */
function trocasAtuais(){const f=G('SWP');try{return (typeof f==='function'&&f())||{};}catch(_){return {};}}
function secDe(c){if(SEC[c])return SEC[c];const SH=G('SHAPES')||{},d=SH[c];if(!d)return null;const KG=G('KG')||{},TI=G('TIT')||{};
 SEC[c]={n:TI[c]||c,w:d.w,h:d.h,kg:KG[c]!=null?KG[c]:null,s:d.s};return SEC[c];}
let TMODO=false,tFoco=null;
function remonta(){const p=CAM.position.clone(),t=CT.target.clone();
 devolveTodas(true);if(ROOT){SC.remove(ROOT);}GEO.forEach(g=>g.dispose());GEO=[];PECAS=[];FOL=[];VFOL=null;hov=null;montar();swSig=JSON.stringify(trocasAtuais());CAM.position.copy(p);CT.target.copy(t);CT.update();aplicaFolhas();}
const doB=hd=>hd.userData.o.c0||hd.userData.o.c;
const MTRC=new THREE.MeshStandardMaterial({color:'#6fd6cb',emissive:'#0b4e49',metalness:.4,roughness:.35,side:THREE.DoubleSide});
function trocaPinta(){if(!TMODO)return;materiais(p=>{const o=p.userData.o;if(o.vid)return MGV;const b=doB(p);
 if(tFoco&&b===tFoco)return MTRC;return o.c0?MAT:MALT;});}
function trocaVoa(b){if(ROOT)ROOT.updateMatrixWorld(true);const box=new THREE.Box3();PECAS.forEach(p=>{if(!p.userData.o.vid&&doB(p)===b)box.expandByObject(p);});if(box.isEmpty())return;
 const c=box.getCenter(new THREE.Vector3()),sph=box.getBoundingSphere(new THREE.Sphere()),asp=Math.min(1,(CAM.aspect||1)),r=Math.max(420,sph.radius/Math.sin(THREE.MathUtils.degToRad(17))/asp*1.05);
 const dir=CAM.position.clone().sub(CT.target).normalize();voa(c.clone().addScaledVector(dir,r),c);}
function trocaCorte(n){for(const c of E.cortes){if(secCorte(c).some(q=>q.c===n))return c.id;}return null;}
function trocaCard(b){const sw=trocasAtuais(),n=sw[b];if(!b||!n){card(null);return;}
 const n0=n.split('+')[0],cp=n.split('+')[1],da=secDe(b),db=secDe(n0),TI=G('TIT')||{},f=v=>(v>0?'+':'')+String(Math.round(v*10)/10).replace('.',',');
 const cid=trocaCorte(n0);
 card(`<div class="k">Perfil trocado · ${esc(b)} → ${esc(n.replace('+',' + '))}</div><div class="v">${esc(TI[n0]||(db&&db.n)||n0)}</div>
  <div class="p">${da&&db?f(db.w-da.w)+' mm na largura e '+f(db.h-da.h)+' mm na espessura da seção.':''}${cp?' O '+esc(cp)+' encaixa por cima do '+esc(n0)+' como complemento.':''} Confira o encaixe no corte.</div>
  <div class="acts">${cid?`<button class="oxbtn pri" type="button" id="oxSwC">✂ Ver no corte ${esc(cid)}</button>`:''}<button class="oxbtn" type="button" id="oxSwU">↩ Voltar ao ${esc(b)}</button><button class="oxbtn" type="button" id="oxSwX">Fechar</button></div>`);
 if(cid)$('oxSwC').onclick=()=>{const keep=TMODO;TMODO=false;abreCorte(cid);TMODO=keep;tCorte=true;};
 $('oxSwU').onclick=()=>{troca(b,b);if(API.aoTroca)API.aoTroca();};$('oxSwX').onclick=()=>{card(null);tFoco=null;trocaPinta();};}
let tCorte=false;
function troca(b,o){const f=G('SWP'),sw=typeof f==='function'?f():null;if(!sw)return;
 if(o===b)delete sw[b];else{sw[b]=o;try{const tk=G('trk');if(typeof tk==='function')tk('troca',{t:API.key,de:b,para:o});}catch(_){}}
 try{const rf=G('refreshSwap');if(typeof rf==='function')rf(null);}catch(_){}
 if(cAt)sairCorte(true);tCorte=false;remonta();tFoco=b;trocaPinta();trocaVoa(b);trocaCard(b);}
function trocas(on){on=!!on;if(on===TMODO)return true;
 if(on){devolveTodas(true);classico(false);fechaPalco(true);if(seq>=0)seqFim();sairCorte(true);fechaFolhas();
  if(desm){desm=false;PECAS.forEach(p=>{p.userData.tt=0;});$('oxDesm').setAttribute('aria-pressed','false');}
  TMODO=true;tFoco=null;tiraHover();trocaPinta();hint('Os perfis já trocados ficam em alumínio · o destacado é o da linha escolhida');return true;}
 TMODO=false;tFoco=null;if(cAt)sairCorte(true);tCorte=false;card(null);materiais(matBase);enquadra(true);hint('Toque numa peça para ver de perto · arraste para girar');return true;}
function trocaLista(){const OR=G('ORIGC')||[],AL=G('ALT')||{},TH=G('THUMB')||{},KG=G('KG')||{},TI=G('TIT')||{},PN=G('PN')||{},sw=trocasAtuais(),fmt=(v,d)=>v.toFixed(d).replace('.',',');
 return [...new Set(OR)].filter(c=>AL[c]&&AL[c].length).map(b=>{const cur=sw[b]||b;let cmp='';
  if(sw[b]){cmp=`<div class="sw3" data-b="${esc(b)}"><button type="button" class="oxlnk sw3b">🔍 Comparar em 3D</button></div>`;
   const n0=sw[b].split('+')[0],da=secDe(b),dn=secDe(n0),kb=KG[b]||0,kn=KG[n0]||0,cls=v=>v>0?'up':v<0?'dn':'';
   if(da&&dn)cmp+=`<table><tr><th></th><td>${esc(b)}</td><td>${esc(n0)}</td></tr><tr><th>Seção (mm)</th><td>${fmt(da.w,1)} × ${fmt(da.h,1)}</td><td>${fmt(dn.w,1)} × ${fmt(dn.h,1)}</td></tr><tr><th>Peso (kg/m)</th><td>${fmt(kb,3)}</td><td class="${cls(kn-kb)}">${fmt(kn,3)}</td></tr></table>`;}
  return {b,cur,nm:(PN[b]&&PN[b].n)||TI[b]||'',cmp,opts:[b,...AL[b]].map(o=>{const o0=o.split('+')[0];return {o,img:TH[o0]||'',sub:o===b?'original':o.includes('+')?'marco + complemento':(KG[o]?fmt(KG[o],3)+' kg/m':'')};})};});}
function trocaFoco(b,voar){if(!TMODO)return;if(!b&&!voar){if(!card_on())tFoco=null;trocaPinta();return;}tFoco=b;trocaPinta();if(voar&&b){trocaVoa(b);trocaCard(b);}}
function card_on(){return !$('oxCard').hidden;}

/* ---------- vento dentro do 3D novo (aba Vento) ----------
   O painel e as contas são os do Simular pressão de vento (diagramas do catálogo); o palco mostra o vento,
   o encontro central curvando (verde aprova, vermelho não aprova) e as folhas abrindo quando rompe. */
let VMODO=false,VG=null,VBEND=null,VROT=0,VFOL=null,VT0=performance.now(),vMsg='';
const MVB=new THREE.MeshStandardMaterial({color:'#1f8a4c',emissive:'#0a3a1e',roughness:.45,metalness:.1});
function ventoMonta(){ventoLimpa();VG=new THREE.Group();SC.add(VG);
 const cone=new THREE.ConeGeometry(16,46,10),haste=new THREE.CylinderGeometry(3.5,3.5,150,6);cone.rotateX(Math.PI/2);cone.translate(0,0,23);haste.rotateX(Math.PI/2);haste.translate(0,0,-75);
 for(let i=0;i<28;i++){const m=new THREE.MeshBasicMaterial({color:'#8fd3ff',transparent:true,opacity:0,depthWrite:false}),g=new THREE.Group();g.add(new THREE.Mesh(cone,m),new THREE.Mesh(haste,m));
  g.userData={x:((i*37)%28)/27-.5,y:((i*11)%28)/27-.5,ph:(i*.137)%1,m};VG.add(g);}
 VG.userData.geo=[cone,haste];VG.visible=false;}
function ventoLimpa(){if(VG){SC.remove(VG);(VG.userData.geo||[]).forEach(g=>g.dispose());VG.children.forEach(g=>g.userData.m.dispose());VG=null;}
 if(VBEND){SC.remove(VBEND);VBEND.geometry.dispose();VBEND=null;}VROT=0;VFOL=null;FOL.forEach(F=>{F.rotation.y=0;F.position.z=F.userData.z0!=null?F.userData.z0:F.position.z;});aplicaFolhas();}
function ventoBend(){if(VBEND){SC.remove(VBEND);VBEND.geometry.dispose();VBEND=null;}const D=G('DIA');if(!D||!D.k)return;
 const mp=mapaCls(),mx=G('meetX');let x=0;try{x=typeof mx==='function'?mx(+D.k.slice(1)):0;}catch(_){x=0;}
 const X=mp?mp.p(new THREE.Vector3(x,0,0)).x:x*1000,h=H-120,g=new THREE.CylinderGeometry(11,11,h,10,40);g.translate(X,0,75);
 VBEND=new THREE.Mesh(g,MVB);VBEND.userData={b:g.attributes.position.array.slice(),h,k:D.k,X};SC.add(VBEND);
 /* folhas do encontro: as duas mais próximas do ponto, uma de cada lado */
 FOL.forEach(F=>{if(F.userData.z0==null)F.userData.z0=F.position.z;});ROOT.updateMatrixWorld(true);
 const fs=FOL.map(F=>{const b=new THREE.Box3().setFromObject(F);return {F,x0:b.min.x,x1:b.max.x,c:(b.min.x+b.max.x)/2};});
 const esq=fs.filter(f=>f.c<X).sort((a,b)=>b.c-a.c)[0],dir=fs.filter(f=>f.c>=X).sort((a,b)=>a.c-b.c)[0];VFOL=[esq,dir].filter(Boolean);}
function ventoTick(){if(!VMODO||!VG)return;const on=!!(G('S')||{}).vtOn&&!!G('DIA');VG.visible=on;
 if(on&&(!VBEND||VBEND.userData.k!==G('DIA').k))ventoBend();if(VBEND)VBEND.visible=on;
 if(!on){if(VROT){VROT=0;VFOL&&VFOL.forEach(f=>{f.F.rotation.y=0;f.F.position.z=f.F.userData.z0;});aplicaFolhas();}if(!$('oxCard').hidden&&vMsg){card(null);vMsg='';}return;}
 const t=(performance.now()-VT0)/1000,P=+G('DIAP')||100,sp=.25+P/400,sc=.8+P/250;
 VG.children.forEach(g=>{const u=g.userData,ph=(u.ph+t*sp)%1;g.position.set(u.x*L*.92,u.y*H*.92,-1500+ph*1400);u.m.opacity=Math.sin(ph*Math.PI)*.85;g.scale.setScalar(sc);});
 const ok=!!G('DIA_OK'),R0=+G('DIA_R')||0,B=(+G('DIABOW')||0)*1000;
 if(VBEND){const b=B*(1+.12*Math.sin(t*3.1)+.06*Math.sin(t*7.3)),p=VBEND.geometry.attributes.position.array,O=VBEND.userData.b,h=VBEND.userData.h;
  for(let j=0;j<p.length;j+=3)p[j+2]=O[j+2]+b*Math.sin(Math.PI*Math.min(1,Math.max(0,(O[j+1]+h/2)/h)));VBEND.geometry.attributes.position.needsUpdate=true;VBEND.geometry.computeVertexNormals();
  MVB.color.set(ok?'#1f8a4c':'#c0392b');MVB.emissive.set(ok?'#0a3a1e':'#4a120c');}
 const tg=R0>1.12?Math.min(.5,.22+(R0-1.12)*1.2):0;VROT+=(tg-VROT)*(tg>VROT?.06:.15);if(Math.abs(VROT)<1e-4)VROT=0;if(VBEND)VBEND.visible=VROT<.02;
 if(VFOL){const sh=VROT*(1+.06*Math.sin(t*5)),X=VBEND?VBEND.userData.X:0;
  VFOL.forEach(f=>{const F=f.F,left=f.c<X,px=left?f.x0:f.x1,th=left?-sh:sh,cx=F.userData.ox-px;F.rotation.y=th;F.position.x=px+cx*Math.cos(th);F.position.z=F.userData.z0-cx*Math.sin(th);});}
 const vv=document.getElementById('vtVer'),txt=vv&&!document.getElementById('vtRes').hidden?vv.textContent:'';
 if(txt&&txt!==vMsg){vMsg=txt;card(`<div class="k">Simular pressão de vento · ${P} kgf/m²</div><div class="p">${esc(txt)}</div><div class="p" style="opacity:.75">Apenas demonstrativo · valores lidos do Diagrama de dimensões do catálogo.</div>`);hint('Arraste para girar · mude a pressão, a mão de amigo ou a medida no painel ao lado');}}
function vento(on){on=!!on;if(on===VMODO)return true;
 if(on){devolveTodas(true);classico(false);fechaPalco(true);if(seq>=0)seqFim();sairCorte(true);fechaFolhas();
  if(desm){desm=false;PECAS.forEach(p=>{p.userData.tt=0;});$('oxDesm').setAttribute('aria-pressed','false');}
  VMODO=true;tiraHover();ventoMonta();vMsg='';VISTA='ext';L0.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v==='ext')));enquadra(true);
  hint('Escolha a mão de amigo e a pressão no painel ao lado e toque em Avaliar');return true;}
 VMODO=false;ventoLimpa();card(null);vMsg='';enquadra(true);hint('Toque numa peça para ver de perto · arraste para girar');return true;}
/* trocas feitas em outro lugar (Vento, Diagrama) remontam a janela com os perfis certos */
let swSig=JSON.stringify(trocasAtuais()),swN=0;
function confereTrocas(){if(++swN<20)return;swN=0;const sg=JSON.stringify(trocasAtuais());if(sg===swSig)return;swSig=sg;
 const vb=!!VBEND;if(VMODO){VROT=0;if(VBEND){SC.remove(VBEND);VBEND.geometry.dispose();VBEND=null;}}remonta();if(TMODO)trocaPinta();if(VMODO&&vb)ventoBend();}

/* ---------- comparação em 3D no painel da troca: original transparente × novo em verde-água ---------- */
let MR=null,MS=null,MC=null,MG=null,mBox=null,mDrag=null,mRot={x:-.18,y:0},mAuto=true,mT0=performance.now();
const MOG=new THREE.MeshStandardMaterial({color:'#9aa6ae',transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide,metalness:.2,roughness:.6});
const MOS=new THREE.MeshStandardMaterial({color:'#c4ccd2',metalness:.45,roughness:.4,side:THREE.DoubleSide}),MOE=new THREE.LineBasicMaterial({color:'#5d6b75',transparent:true,opacity:.5});
const MOL=new THREE.LineBasicMaterial({color:'#24313a',transparent:true,opacity:.95,depthTest:false});
function miniComp(box,b){const sw=trocasAtuais(),n=sw[b];if(!box||!n)return;const n0=n.split('+')[0];if(!secDe(b)||!secDe(n0))return;
 if(!MR){MR=new THREE.WebGLRenderer({antialias:true,alpha:true});MR.setPixelRatio(Math.min(2,devicePixelRatio||1));MR.outputEncoding=THREE.sRGBEncoding;
  MS=new THREE.Scene();MS.add(new THREE.HemisphereLight('#ffffff','#6f7f89',.95));const dl=new THREE.DirectionalLight('#ffffff',.85);dl.position.set(2,3,4);MS.add(dl);
  MC=new THREE.PerspectiveCamera(28,1.6,1,8000);const el=MR.domElement;el.style.cssText='display:block;width:100%;height:170px;border-radius:8px;background:radial-gradient(circle at 50% 40%,#f4f7f8,#dde4e8);cursor:grab;touch-action:none';
  el.addEventListener('pointerdown',e=>{mDrag={x:e.clientX,y:e.clientY,rx:mRot.x,ry:mRot.y};mAuto=false;el.setPointerCapture(e.pointerId);el.style.cursor='grabbing';});
  el.addEventListener('pointermove',e=>{if(!mDrag)return;mRot.y=mDrag.ry+(e.clientX-mDrag.x)*.012;mRot.x=Math.max(-1.4,Math.min(1.4,mDrag.rx+(e.clientY-mDrag.y)*.012));});
  el.addEventListener('pointerup',()=>{mDrag=null;el.style.cursor='grab';});}
 if(MG){MS.remove(MG);MG.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
 MG=new THREE.Group();const len=26,ga=geoSec(b,len),gn=geoSec(n0,len);
 /* lado a lado, mesma escala: original à esquerda (alumínio), novo à direita (verde-água) */
 const gA=new THREE.Group(),gB=new THREE.Group();gA.add(new THREE.Mesh(ga,MOS),new THREE.LineSegments(new THREE.EdgesGeometry(ga,30),MOE));gB.add(new THREE.Mesh(gn,MTRC));
 const cp=n.split('+')[1];if(cp&&secDe(cp))gB.add(new THREE.Mesh(geoSec(cp,len),MTRC));
 const ctr=g=>{const bb=new THREE.Box3().setFromObject(g),cc=bb.getCenter(new THREE.Vector3());g.children.forEach(o=>o.position.sub(cc));return bb.getSize(new THREE.Vector3());};
 const sa=ctr(gA),sb=ctr(gB),gap=Math.max(sa.x,sb.x)*.35+8;gA.position.x=-(gap/2+sa.x/2);gB.position.x=gap/2+sb.x/2;MG.add(gA,gB);MS.add(MG);
 const topo=(g,gr)=>{const p=g.attributes.position,v=new THREE.Vector3(),c=new THREE.Box3().setFromBufferAttribute(p).getCenter(new THREE.Vector3());let best=null,bd=-Infinity;
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);if(v.z<len/2-1)continue;const d=v.y-Math.abs(v.x-c.x)*.35;if(d>bd){bd=d;best=v.clone();}}return best.sub(c).add(gr.position);};
 MG.userData.an=[topo(ga,gA),topo(gn,gB)];
 box.innerHTML='';box.appendChild(MR.domElement);
 const ov=document.createElement('div');ov.className='sw3o';ov.innerHTML=`<svg><defs><marker id="sw3m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#24313a"/></marker></defs><line id="sw3a" marker-end="url(#sw3m)"/><line id="sw3b2" marker-end="url(#sw3m)"/></svg><b class="t0">${esc(b)} · original</b><b class="t1">${esc(n.replace('+',' + '))} · novo</b>`;box.appendChild(ov);
 const lg=document.createElement('div');lg.className='sw3l';lg.innerHTML=`<span class="dc">arraste para girar</span>`;box.appendChild(lg);
 const w=Math.max(200,box.clientWidth||300),h=170;MR.setSize(w,h,false);MC.aspect=w/h;MC.updateProjectionMatrix();
 const totW=sa.x+sb.x+gap,totH=Math.max(sa.y,sb.y)*1.9;const fv=THREE.MathUtils.degToRad(14);
 const oy=Math.max(sa.y,sb.y)*.32;MC.position.set(0,oy,Math.max(totH/2/Math.tan(fv),totW/2/Math.tan(fv)/MC.aspect)*1.5);MC.lookAt(0,oy,0);
 mBox=box;mAuto=true;mT0=performance.now();}
function miniTick(){if(!mBox||!MR)return;if(!mBox.isConnected||mBox.offsetParent===null){if(!mBox.isConnected)mBox=null;return;}
 if(mAuto){const t=(performance.now()-mT0)/1000;mRot.y=Math.sin(t*.5)*.45;mRot.x=-.18+Math.sin(t*.37)*.08;}
 MG.rotation.set(mRot.x,mRot.y,0);MR.render(MS,MC);
 const ov=mBox.querySelector('.sw3o'),an=MG.userData.an;if(!ov||!an)return;MG.updateMatrixWorld(true);
 const cv=MR.domElement,W=cv.clientWidth,H=cv.clientHeight,pr=v=>{const q=v.clone().applyMatrix4(MG.matrixWorld).project(MC);return [(q.x+1)/2*W,(1-q.y)/2*H];};
 const t0=ov.querySelector('.t0'),t1=ov.querySelector('.t1'),la=ov.querySelector('#sw3a'),lb=ov.querySelector('#sw3b2');
 const [ax,ay]=pr(an[0]),[bx,by]=pr(an[1]);
 const s0=[t0.offsetLeft+t0.offsetWidth/2,t0.offsetTop+t0.offsetHeight],s1=[t1.offsetLeft+t1.offsetWidth/2,t1.offsetTop+t1.offsetHeight];
 la.setAttribute('x1',s0[0]);la.setAttribute('y1',s0[1]+1);la.setAttribute('x2',ax);la.setAttribute('y2',ay);
 lb.setAttribute('x1',s1[0]);lb.setAttribute('y1',s1[1]+1);lb.setAttribute('x2',bx);lb.setAttribute('y2',by);}

/* ---------- Montar janela (de uma vez) ---------- */
$('oxMJ').onclick=()=>{usa();devolveTodas(true);fechaFolhas();sairCorte(true);if(seq>=0)seqFim();fechaPalco(true);desm=false;$('oxDesm').setAttribute('aria-pressed','false');
 PECAS.forEach((p,i)=>{const u=p.userData;p.visible=true;u.mk=2.4;u.t=1;u.tt=0;u.dl=.15+Math.random()*.55;});enquadra(true);hint('Montando a janela…');setTimeout(()=>hint('Toque numa peça para ver de perto · duplo clique tira a peça da janela'),1800);};

/* ---------- tirar peça com duplo clique: arrasta, aumenta na roda do mouse, a janela gira devagar ---------- */
let NSOLTO=0,toque=null,arrasto=null,sobreJanela=false,giro=0,ultSolta=null;
const PL=new THREE.Plane(),PQ=new THREE.Vector3(),POF=new THREE.Vector3();
function solta(p){if(seq>=0||cAt||palcoHd)return;const u=p.userData;if(u.solto)return;fechaPalco(true);tiraHover();
 u.pai=p.parent;SC.attach(p);u.solto=true;NSOLTO++;
 const w=p.getWorldPosition(new THREE.Vector3()),dir=CAM.position.clone().sub(w).normalize(),d=CAM.position.distanceTo(w);
 u.anim={a:p.position.clone(),b:p.position.clone().addScaledVector(dir,d*.28),sa:p.scale.x,sb:p.scale.x*1.25,t:0};
 u.ms.material=u.o.vid?MVID:MCUR;ultSolta=p;soltoCard(p);}
function devolve(p){const u=p.userData;if(!u.solto)return;u.volta={t:0,a:p.position.clone(),sa:p.scale.x,q:p.quaternion.clone()};u.anim=null;}
function devolveTodas(ja){PECAS.forEach(p=>{const u=p.userData;if(!u.solto)return;if(ja){fixa(p);}else devolve(p);});}
function fixa(p){const u=p.userData;(u.pai||ROOT).attach(p);p.scale.setScalar(1);p.quaternion.identity();const e=ease(u.t)*(u.mk||1);p.position.set(u.ex.x*e,u.ex.y*e,u.ex.z*e);
 u.solto=false;u.volta=u.anim=null;u.ms.material=matBase(p);NSOLTO=Math.max(0,NSOLTO-1);if(!NSOLTO){card(null);CT.enableZoom=true;}else if(ultSolta===p)card(null);}
function soltoTick(dt){
 PECAS.forEach(p=>{const u=p.userData;if(!u.solto)return;
  if(u.anim){u.anim.t=Math.min(1,u.anim.t+dt*2.2);const e=ease(u.anim.t);p.position.lerpVectors(u.anim.a,u.anim.b,e);p.scale.setScalar(u.anim.sa+(u.anim.sb-u.anim.sa)*e);if(u.anim.t>=1)u.anim=null;}
  if(u.volta){const V=u.volta;V.t=Math.min(1,V.t+dt*1.8);const e=ease(V.t),pai=u.pai||ROOT,k=ease(u.t)*(u.mk||1),alvo=pai.localToWorld(new THREE.Vector3(u.ex.x*k,u.ex.y*k,u.ex.z*k)),qa=pai.getWorldQuaternion(new THREE.Quaternion());
   p.position.lerpVectors(V.a,alvo,e);p.scale.setScalar(V.sa+(1-V.sa)*e);p.quaternion.copy(V.q).slerp(qa,e);if(V.t>=1)fixa(p);}});
 /* a janela gira devagar enquanto houver peça solta; para quando o mouse está sobre ela */
 if(NSOLTO&&!sobreJanela&&!arrasto)giro+=dt*.14;
 const alvo=NSOLTO?giro:0;if(!NSOLTO){giro+=(0-giro)*Math.min(1,dt*3);if(Math.abs(giro)<1e-3)giro=0;}
 ROOT.rotation.y=NSOLTO?giro:giro;}
function soltoCard(p){const u=p.userData,o=u.o;
 card(`<div class="k">Peça solta · ${esc(o.c||'Vidro')}</div><div class="v">${esc(o.n||o.c||'Vidro')}</div>
  <div class="p">Arraste para mover · roda do mouse sobre a peça aumenta ou diminui · duplo clique devolve. A janela gira devagar; passe o mouse sobre ela para parar.</div>
  <div class="acts"><button class="oxbtn" type="button" id="oxSlM">＋</button><button class="oxbtn" type="button" id="oxSlN">－</button><button class="oxbtn" type="button" id="oxSlV">↩ Devolver esta</button><button class="oxbtn pri" type="button" id="oxSlT">↩ Devolver todas</button></div>`);
 $('oxSlM').onclick=()=>escala(p,1.2);$('oxSlN').onclick=()=>escala(p,1/1.2);$('oxSlV').onclick=()=>devolve(p);$('oxSlT').onclick=()=>devolveTodas(false);}
function escala(p,f){const u=p.userData;if(!u.solto||u.volta)return;u.anim=null;p.scale.setScalar(Math.max(.3,Math.min(8,p.scale.x*f)));}
function arrastaIni(e){if(!NSOLTO||seq>=0||cAt)return;const q=pick(e);if(!q||!q.userData.solto||q.userData.volta)return;
 q.userData.anim=null;CT.enabled=false;const n=CAM.getWorldDirection(new THREE.Vector3());PL.setFromNormalAndCoplanarPoint(n,q.position);
 const r=RN.domElement.getBoundingClientRect();PT.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);RC.setFromCamera(PT,CAM);
 if(RC.ray.intersectPlane(PL,PQ))POF.copy(q.position).sub(PQ);else POF.set(0,0,0);arrasto={p:q,id:e.pointerId};ultSolta=q;soltoCard(q);
 try{RN.domElement.setPointerCapture(e.pointerId);}catch(_){}RN.domElement.style.cursor='grabbing';}
function arrastaMove(e){const r=RN.domElement.getBoundingClientRect();PT.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);RC.setFromCamera(PT,CAM);
 if(RC.ray.intersectPlane(PL,PQ))arrasto.p.position.copy(PQ).add(POF);}
function arrastaFim(){if(!arrasto)return;try{RN.domElement.releasePointerCapture(arrasto.id);}catch(_){}arrasto=null;CT.enabled=true;RN.domElement.style.cursor='grab';down=null;}
RN.domElement.addEventListener('pointerup',arrastaFim,true);RN.domElement.addEventListener('pointercancel',arrastaFim,true);
RN.domElement.addEventListener('pointerleave',()=>{sobreJanela=false;});
RN.domElement.addEventListener('wheel',e=>{if(!NSOLTO)return;const q=pick(e);if(!q||!q.userData.solto)return;e.preventDefault();e.stopImmediatePropagation();escala(q,e.deltaY<0?1.1:1/1.1);},{capture:true,passive:false});

/* ---------- usinagens dentro do 3D novo (aba Usinagens) ----------
   Lista do catálogo (a mesma do clássico). Os perfis da usinagem ficam em verde-água e um ponto laranja marca o lugar,
   a partir da ponta da peça (a medida em mm vem do texto do catálogo quando houver). */
let UMODO=false,uSel=null,uHov=null,UG=null;
const MUS=new THREE.MeshBasicMaterial({color:'#ff7a00',depthTest:false,transparent:true,opacity:.95}),MUSR=new THREE.MeshBasicMaterial({color:'#ffd8a8',depthTest:false,transparent:true,opacity:.55});
const GUS=new THREE.SphereGeometry(14,16,12),GUSR=new THREE.RingGeometry(20,26,28);
function usinLista(){return ((G('USE')||[]).filter(u=>u&&u.id)).map(u=>({id:u.id,s:u.s||u.n,n:u.n,p:u.p||[],c:u.c||'',m:u.m||'',o:u.o||''}));}
function usinDe(id){return usinLista().find(u=>u.id===id)||null;}
function usinPecas(u){return PECAS.filter(p=>!p.userData.o.vid&&u.p.includes(doB(p))||(!p.userData.o.vid&&u.p.includes(p.userData.o.c)));}
function usinPinta(){if(!UMODO)return;const a=usinDe(uSel||uHov),set=new Set(a?usinPecas(a):[]);materiais(p=>p.userData.o.vid?MGV:set.has(p)?MTRC:MALT);}
function usinMarcas(u){if(UG){SC.remove(UG);UG=null;}if(!u)return;UG=new THREE.Group();SC.add(UG);ROOT.updateMatrixWorld(true);
 const mm=(u.m.match(/a\s*([\d.,]+)\s*mm\s*da\s*ponta/i)||[])[1],off=mm?parseFloat(mm.replace(',','.')):35;
 usinPecas(u).forEach(p=>{const o=p.userData.o,bx=new THREE.Box3().setFromObject(p),c=bx.getCenter(new THREE.Vector3()),ez=new THREE.Vector3(o.ez[0],o.ez[1],o.ez[2]).normalize(),h=(o.len||0)/2;
  [1,-1].forEach(sg=>{const pt=c.clone().addScaledVector(ez,sg*Math.max(0,h-off)),m=new THREE.Mesh(GUS,MUS),r=new THREE.Mesh(GUSR,MUSR);m.position.copy(pt);r.position.copy(pt);r.userData.anel=1;m.renderOrder=r.renderOrder=9;UG.add(m,r);});});}
function usinVoa(u){const box=new THREE.Box3();usinPecas(u).forEach(p=>box.expandByObject(p));if(box.isEmpty())return;
 const c=box.getCenter(new THREE.Vector3()),sph=box.getBoundingSphere(new THREE.Sphere()),asp=Math.min(1,CAM.aspect||1),r=Math.max(500,sph.radius/Math.sin(THREE.MathUtils.degToRad(17))/asp*1.05),dir=CAM.position.clone().sub(CT.target).normalize();voa(c.clone().addScaledVector(dir,r),c);}
function usinSel(id){uSel=id||null;usinPinta();if(API.aoUsin)API.aoUsin(uSel);const u=usinDe(uSel);usinMarcas(u);
 if(!u){card(null);hint('Toque numa usinagem para ver onde ela é feita');return;}usinVoa(u);
 card(`<div class="k">Usinagem ${esc(u.id)} · ${esc(u.p.join(' · '))}</div><div class="v">${esc(u.n)}</div>
  <div class="p">${u.c?esc(u.c)+' ':''}${u.m?'<br><b>Medida:</b> '+esc(u.m):''}${u.o?'<br><span style="opacity:.8">'+esc(u.o)+'</span>':''}</div>
  <div class="acts"><button class="oxbtn pri" type="button" id="oxUsP">🔍 Ver o perfil de perto</button><button class="oxbtn" type="button" id="oxUsX">Fechar</button></div>`);
 $('oxUsP').onclick=()=>{const p=usinPecas(u)[0];if(p)abrePalco(p);};$('oxUsX').onclick=()=>usinSel(null);
 hint('O ponto laranja marca onde a usinagem é feita · arraste para girar');}
function usin(on){on=!!on;if(on===UMODO)return true;
 if(on){devolveTodas(true);classico(false);fechaPalco(true);if(seq>=0)seqFim();sairCorte(true);fechaFolhas();
  if(desm){desm=false;PECAS.forEach(p=>{p.userData.tt=0;});$('oxDesm').setAttribute('aria-pressed','false');}
  UMODO=true;uSel=uHov=null;tiraHover();usinPinta();hint('Toque numa usinagem para ver onde ela é feita');enquadra(true);return true;}
 UMODO=false;uSel=uHov=null;usinMarcas(null);card(null);materiais(matBase);enquadra(true);hint('Toque numa peça para ver de perto · arraste para girar');return true;}
function usinTick(){if(!UG)return;const k=1+.25*Math.sin(performance.now()/260);UG.children.forEach(o=>{if(o.userData.anel){o.scale.setScalar(k);o.lookAt(CAM.position);}});}

/* ---------- laço ---------- */
function tam(){posMed();const b=host.getBoundingClientRect();RN.setSize(Math.max(1,b.width),Math.max(1,b.height),false);CAM.aspect=Math.max(1,b.width)/Math.max(1,b.height);CAM.updateProjectionMatrix();tamPalco();}
const ro=window.ResizeObserver?new ResizeObserver(tam):null;if(ro)ro.observe(L0);else addEventListener('resize',tam);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
let last=performance.now(),raf=0,vivo=true;
function loop(now){raf=0;if(!vivo||L0.hidden||CLS)return;raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 PECAS.forEach(p=>{const u=p.userData;if(u.solto)return;if(u.dl>0){u.dl-=dt;}else if(u.t!==u.tt){const sp=seq>=0?1.6:(u.mk>1?.9:1.8);u.t=u.tt>u.t?Math.min(u.tt,u.t+dt*sp):Math.max(u.tt,u.t-dt*sp);if(u.t===0&&u.mk>1)u.mk=1;}
  const e=ease(u.t)*(u.mk||1);p.position.set(u.ex.x*e,u.ex.y*e,u.ex.z*e);});
 soltoTick(dt);
 if(ab!==abT){ab=abT>ab?Math.min(abT,ab+dt*.9):Math.max(abT,ab-dt*.9);aplicaFolhas();}
 if(voo){voo.t=Math.min(1,voo.t+dt*1.6);CAM.position.lerpVectors(voo.a,voo.b,ease(voo.t));CT.target.lerpVectors(voo.ta,voo.tb,ease(voo.t));if(voo.t>=1)voo=null;}
 ventoTick();confereTrocas();miniTick();usinTick();CT.update();RN.render(SC,CAM);juncoes();
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
 comps,aoComp:null,
 compLista(){return Object.keys(CIT).map(compInfo);},
 compHover(c){cHov=c||null;compPinta();},
 compSel(c){compSel(c);},
 compAtual(){return cSel;},
 vento,usin,usinLista,aoUsin:null,usinSel(u){usinSel(u);},usinHover(u){uHov=u||null;usinPinta();},usinAtual(){return uSel;},
 trocas,trocaLista,aoTroca:null,aoTrocaFoco:null,
 troca(b,o){troca(b,o);},
 miniComp(box,b){miniComp(box,b);},
 trocaAtiva(){return tFoco;},
 trocaFoco(b,v){trocaFoco(b,v);},
 trocaZera(){const f=G('SWP'),sw=typeof f==='function'?f():null;if(sw)Object.keys(sw).forEach(k=>delete sw[k]);try{G('refreshSwap')(null);}catch(_){}remonta();tFoco=null;card(null);trocaPinta();},
 lista(){const g={};PECAS.forEach(p=>{const o=p.userData.o,k=o.vid?'vidro':o.c;if(!g[k]){const inf=info(o);g[k]={c:o.vid?'Vidro':o.c,nm:inf.nm,q:0,vid:!!o.vid,hd:p};}g[k].q++;});return Object.values(g);},
 verDePerto(hd){usa();if(seq>=0)seqFim();sairCorte(true);fechaFolhas();abrePalco(hd);},
 pausar(){if(raf){cancelAnimationFrame(raf);raf=0;}},
 destruir(){vivo=false;this.pausar();if(ro)ro.disconnect();document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',fora);
  document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  GEO.forEach(g=>g.dispose());limpaCaps();compsLimpa();ventoLimpa();usinMarcas(null);RN.dispose();if(PR)PR.dispose();}};
montar();tam();retoma();
return API;
}
})();

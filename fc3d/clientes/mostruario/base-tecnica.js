/* Plataforma FC 3D Clientes · Mostruário 3D · Base técnica
   Painel flutuante fixo no canto do 3D (abaixo dos botões de vista): mostra o desenho do catálogo técnico
   que serviu de base para o 3D da tipologia, com a fonte.
   Desenhos em base/<tipologia>.webp (ex.: base/jcr200.webp).
   Tipologia sem desenho: some para os clientes; o Acesso FC vê o aviso do que falta.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
/* tipologias que já têm o desenho do catálogo · página impressa do catálogo técnico
   (folha de montagem inteira: elevação + cortes horizontais e verticais) */
const BASE={
  jcr200:117, jcr200a:118, jcr300:119, jcr205:122, pvz300:129, pcr200:130, pgr100:135, max800:137,
  gjc2f:151, gjc4f:152, gpc2fpe:156, gpc3fvz:157
};
const LEG=p=>'Folha de montagem · elevação e cortes · catálogo p. '+p;
let MATRIZ=false;
const A=window.PFC_AJ;
if(A&&A.matriz){const m0=A.matriz;A.matriz=function(v){MATRIZ=!!v;m0.call(A,v);atualiza();};}

const css=document.createElement('style');
css.textContent=`
#btFlu{position:absolute;top:58px;left:12px;z-index:8;width:150px;background:var(--panel,#fff);border:1px solid var(--line,#d9e0e0);border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.14);padding:8px;font-family:system-ui,sans-serif}
#btFlu .bf-top{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:6px}
#btFlu .bf-t{font:700 11px system-ui;letter-spacing:.06em;text-transform:uppercase;color:var(--fg,#16202a)}
#btFlu .bf-x{border:0;background:transparent;color:var(--muted,#5b6b6b);font:700 15px system-ui;line-height:1;cursor:pointer;padding:2px 4px;border-radius:6px}
#btFlu .bf-x:hover{background:var(--accent-soft,#e6f2f3)}
#btFlu .bf-img{display:block;width:100%;padding:0;border:1px solid var(--line,#d9e0e0);border-radius:8px;background:#fff;cursor:zoom-in;overflow:hidden}
#btFlu .bf-img img{display:block;width:100%;height:150px;object-fit:contain}
#btFlu .bf-leg{margin:6px 0 0;font:600 11px/1.3 system-ui;color:var(--fg,#16202a)}
#btFlu .bf-src{margin:2px 0 0;font:500 10.5px/1.3 system-ui;color:var(--muted,#5b6b6b)}
#btFlu .bf-falta{margin:0;font:600 11px/1.35 system-ui;color:#b45309}
#btFlu.min{width:auto;padding:0;border-radius:999px}
#btFlu.min .bf-corpo,#btFlu.min .bf-top{display:none}
#btFlu .bf-chip{display:none;border:0;background:transparent;padding:7px 12px;font:600 12.5px system-ui;color:var(--fg,#16202a);cursor:pointer;border-radius:999px}
#btFlu.min .bf-chip{display:block}
@media (max-width:700px){#btFlu{width:130px;top:auto;bottom:-6px;left:0}#btFlu .bf-img img{height:110px}}
#btZoom{position:fixed;inset:0;z-index:99990;background:rgba(10,20,22,.88);display:flex;flex-direction:column}
#btZoom .bz-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;color:#fff;font:600 14px system-ui}
#btZoom .bz-bar button{background:#fff;color:#0a4f4b;border:0;border-radius:8px;padding:7px 12px;font:600 14px system-ui;cursor:pointer}
#btZoom .bz-area{flex:1;overflow:auto;display:grid;place-items:center;padding:10px}
#btZoom .bz-area img{background:#fff;border-radius:6px;max-width:100%;max-height:calc(100vh - 130px);cursor:zoom-in}
#btZoom .bz-area.z img{max-width:none;max-height:none;width:auto;height:240vh;cursor:zoom-out}
#btZoom .bz-acoes{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
#btZoom .bz-bar button.bz-rot{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.35)}
#btZoom .bz-bar button.bz-rot:hover{background:rgba(255,255,255,.26)}
#btZoom .bz-fonte{color:#d7e3e1;font:500 12px system-ui;padding:0 14px 12px;margin:0}`;
document.head.appendChild(css);

/* girar o desenho (90° por clique) · guarda o giro escolhido por tipologia neste aparelho */
const RK='fc3d-bt-rot';
const rotLe=t=>{try{return (+JSON.parse(localStorage.getItem(RK)||'{}')[t])||0;}catch(_){return 0;}};
const rotGrava=(t,r)=>{try{const o=JSON.parse(localStorage.getItem(RK)||'{}');if(r)o[t]=r;else delete o[t];localStorage.setItem(RK,JSON.stringify(o));}catch(_){}};
const ROT={};
function srcGirado(src,r){
  r=((r%360)+360)%360;if(!r)return Promise.resolve(src);
  const k=src+'|'+r;if(ROT[k])return Promise.resolve(ROT[k]);
  return new Promise(res=>{const im=new Image();
    im.onload=()=>{const w=im.naturalWidth,h=im.naturalHeight,s=r%180!==0,c=document.createElement('canvas');
      c.width=s?h:w;c.height=s?w:h;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);
      g.translate(c.width/2,c.height/2);g.rotate(r*Math.PI/180);g.drawImage(im,-w/2,-h/2);
      try{ROT[k]=c.toDataURL('image/webp',.92);}catch(_){ROT[k]=src;}res(ROT[k]);};
    im.onerror=()=>res(src);im.src=src;});
}

/* painel flutuante fixo no canto do 3D, logo abaixo dos botões de vista (Perspectiva…) */
const stage=document.getElementById('stage');
if(!stage)return;
const card=document.createElement('div');
card.id='btFlu';card.hidden=true;card.setAttribute('role','complementary');card.setAttribute('aria-label','Base técnica');
stage.appendChild(card);
const MK='fc3d-bt-min';
/* no celular começa recolhido (só o botão), para não cobrir o 3D */
let MIN=innerWidth<700,salvo=null;try{salvo=localStorage.getItem(MK);}catch(_){}
if(salvo==='1')MIN=true;else if(salvo==='0'&&innerWidth>=700)MIN=false;

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tipo=()=>{try{return S.typo;}catch(_){return null;}};
const dados=t=>{let TY=null;try{TY=TYPOS[t];}catch(_){}
  const cd=TY&&TY.code||'',linha=/^SUP/i.test(cd)?'Suprema':'Gold';
  return {cd,linha,n:TY&&TY.n||''};};
const fonte=(d)=>`📘 <b>Fonte técnica:</b> desenho do catálogo técnico oficial da Linha ${d.linha} (Alcoa)${d.cd?' · '+esc(d.cd):''}. O 3D desta tipologia foi montado a partir deste desenho. Medidas e pesos são demonstrativos: confirme sempre com o seu fornecedor. Marcas pertencem aos seus titulares.`;

let ultimo=null;
function atualiza(){
  const t=tipo();if(!t)return;
  const tem=!!BASE[t],d=dados(t);
  ultimo=t;
  if(!tem&&!MATRIZ){card.hidden=true;card.innerHTML='';return;}
  card.innerHTML=`<div class="bf-top"><span class="bf-t">📐 Base técnica</span><button type="button" class="bf-x" title="Recolher" aria-label="Recolher a base técnica">–</button></div>
   <div class="bf-corpo">`+
    (tem?`<button type="button" class="bf-img" title="Abrir o desenho do catálogo em tela cheia"><img src="base/${t}.webp?v=2" alt="Desenho técnico do catálogo · ${esc(d.cd)}"></button>
     <p class="bf-leg">${esc(d.cd)} · catálogo p. ${BASE[t]}</p><p class="bf-src">Fonte: catálogo técnico ${d.linha} (Alcoa) · clique para ampliar</p>`
    :`<p class="bf-falta">⚠ Só a FC vê: falta o desenho do catálogo (${esc(d.cd)}). Oculto para os clientes.</p>`)+
   `</div><button type="button" class="bf-chip" title="Mostrar a base técnica">📐 Base técnica</button>`;
  card.classList.toggle('min',MIN);
  card.querySelector('.bf-x').onclick=()=>poeMin(true);
  card.querySelector('.bf-chip').onclick=()=>poeMin(false);
  const b=card.querySelector('.bf-img');if(b)b.onclick=()=>zoom(t,d);
  miniGiro();
  segueModo();
}
function miniGiro(){const t=tipo(),im=card.querySelector('.bf-img img');if(!t||!im)return;
  srcGirado('base/'+t+'.webp?v=2',rotLe(t)).then(u=>{if(tipo()===t)im.src=u;});}
function poeMin(v){MIN=v;card.classList.toggle('min',v);try{localStorage.setItem(MK,v?'1':'0');}catch(_){}}
function zoom(t,d){
  const z=document.createElement('div');z.id='btZoom';z.setAttribute('role','dialog');z.setAttribute('aria-modal','true');z.setAttribute('aria-label','Desenho técnico');
  z.innerHTML=`<div class="bz-bar"><span>${esc(d.n)} · ${esc(d.cd)}</span><div class="bz-acoes"><button type="button" class="bz-rot" data-r="-90" title="Girar para a esquerda">⟲ Girar</button><button type="button" class="bz-rot" data-r="90" title="Girar para a direita">Girar ⟳</button><button type="button" class="bz-fecha">Fechar</button></div></div>
   <div class="bz-area"><img src="base/${t}.webp?v=2" alt="Desenho técnico do catálogo · ${esc(d.cd)}"></div>
   <p class="bz-fonte">${fonte(d)} Toque no desenho para ampliar.</p>`;
  document.body.appendChild(z);
  const fecha=()=>{z.remove();document.removeEventListener('keydown',k);},k=e=>{if(e.key==='Escape')fecha();};
  const b=z.querySelector('.bz-fecha');b.onclick=fecha;b.focus();
  z.querySelector('.bz-area img').onclick=e=>{e.stopPropagation();z.querySelector('.bz-area').classList.toggle('z');};
  z.querySelector('.bz-area').onclick=e=>{if(e.target===e.currentTarget)fecha();};
  const zi=z.querySelector('.bz-area img');let r=rotLe(t);
  const aplica=()=>srcGirado('base/'+t+'.webp?v=2',r).then(u=>{zi.src=u;});
  if(r)aplica();
  z.querySelectorAll('.bz-rot').forEach(x=>x.onclick=e=>{e.stopPropagation();r=(r+(+x.dataset.r)+360)%360;rotGrava(t,r);aplica();if(typeof miniGiro==='function')miniGiro();});
  document.addEventListener('keydown',k);
}
/* aparece junto com os outros itens do modo "Conhecer a esquadria" (some no teste e no diagrama) */
const guia=document.getElementById('c-comp');
function segueModo(){if(!BASE[tipo()]&&!MATRIZ)return;card.hidden=!!(guia&&guia.hidden);}
if(guia)new MutationObserver(segueModo).observe(guia,{attributes:true,attributeFilter:['hidden']});

/* acompanha a troca de tipologia */
if(typeof window.setTypo==='function'){const s0=window.setTypo;window.setTypo=function(t){const r=s0.apply(this,arguments);atualiza();return r;};}
setInterval(()=>{if(tipo()!==ultimo)atualiza();},800);
atualiza();
})();

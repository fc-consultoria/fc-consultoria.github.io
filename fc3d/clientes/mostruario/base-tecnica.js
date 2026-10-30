/* Plataforma FC 3D Clientes · Mostruário 3D · Base técnica
   Item fechado no fim do painel lateral: mostra o desenho do catálogo técnico
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
#c-base .bt-img{display:block;width:100%;padding:0;border:1px solid var(--line);border-radius:8px;background:#fff;cursor:zoom-in;overflow:hidden}
#c-base .bt-img img{display:block;width:100%;max-height:260px;object-fit:contain}
#c-base .bt-leg{font-size:12px;font-weight:600;margin:0}
#c-base .bt-falta{font-size:12px;color:#b45309;margin:0}
#btZoom{position:fixed;inset:0;z-index:99990;background:rgba(10,20,22,.88);display:flex;flex-direction:column}
#btZoom .bz-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;color:#fff;font:600 14px system-ui}
#btZoom .bz-bar button{background:#fff;color:#0a4f4b;border:0;border-radius:8px;padding:7px 12px;font:600 14px system-ui;cursor:pointer}
#btZoom .bz-area{flex:1;overflow:auto;display:grid;place-items:center;padding:10px}
#btZoom .bz-area img{background:#fff;border-radius:6px;max-width:100%;max-height:100%;cursor:zoom-in}
#btZoom .bz-area.z img{max-width:none;max-height:none;width:auto;height:240vh;cursor:zoom-out}
#btZoom .bz-fonte{color:#d7e3e1;font:500 12px system-ui;padding:0 14px 12px;margin:0}`;
document.head.appendChild(css);

const ref=document.getElementById('c-dims');
if(!ref)return;
const card=document.createElement('details');
card.className='card';card.id='c-base';card.hidden=true;
ref.parentNode.insertBefore(card,ref.nextSibling);

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tipo=()=>{try{return S.typo;}catch(_){return null;}};
const dados=t=>{let TY=null;try{TY=TYPOS[t];}catch(_){}
  const cd=TY&&TY.code||'',linha=/^SUP/i.test(cd)?'Suprema':'Gold';
  return {cd,linha,n:TY&&TY.n||''};};
const fonte=(d)=>`📘 <b>Fonte técnica:</b> desenho do catálogo técnico oficial da Linha ${d.linha} (Alcoa)${d.cd?' · '+esc(d.cd):''}. O 3D desta tipologia foi montado a partir deste desenho. Medidas e pesos são demonstrativos: confirme sempre com o seu fornecedor. Marcas pertencem aos seus titulares.`;

let ultimo=null;
function atualiza(){
  const t=tipo();if(!t)return;
  const tem=!!BASE[t],d=dados(t),aberto=card.open&&ultimo===t;
  ultimo=t;
  if(!tem&&!MATRIZ){card.hidden=true;card.innerHTML='';return;}
  card.innerHTML=`<summary><h2>Base técnica</h2></summary>`+
    (tem?`<button type="button" class="bt-img" title="Abrir o desenho em tela cheia"><img src="base/${t}.webp?v=2" alt="Desenho técnico do catálogo · ${esc(d.cd)}" loading="lazy"></button>
     <p class="bt-leg">${esc(d.cd)} · ${LEG(BASE[t])}</p>`
    :`<p class="bt-falta">⚠ Só a FC vê: falta o desenho do catálogo desta tipologia (${esc(d.cd)}). Para os clientes este item fica oculto.</p>`)+
    `<p class="note">${fonte(d)}</p>`;
  card.open=aberto;
  segueModo();
  const b=card.querySelector('.bt-img');if(b)b.onclick=()=>zoom(t,d);
}
function zoom(t,d){
  const z=document.createElement('div');z.id='btZoom';z.setAttribute('role','dialog');z.setAttribute('aria-modal','true');z.setAttribute('aria-label','Desenho técnico');
  z.innerHTML=`<div class="bz-bar"><span>${esc(d.n)} · ${esc(d.cd)}</span><button type="button">Fechar</button></div>
   <div class="bz-area"><img src="base/${t}.webp?v=2" alt="Desenho técnico do catálogo · ${esc(d.cd)}"></div>
   <p class="bz-fonte">${fonte(d)} Toque no desenho para ampliar.</p>`;
  document.body.appendChild(z);
  const fecha=()=>{z.remove();document.removeEventListener('keydown',k);},k=e=>{if(e.key==='Escape')fecha();};
  z.querySelector('.bz-bar button').onclick=fecha;z.querySelector('.bz-bar button').focus();
  z.querySelector('.bz-area img').onclick=e=>{e.stopPropagation();z.querySelector('.bz-area').classList.toggle('z');};
  z.querySelector('.bz-area').onclick=e=>{if(e.target===e.currentTarget)fecha();};
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

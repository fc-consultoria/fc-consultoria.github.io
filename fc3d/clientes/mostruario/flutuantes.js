/* Plataforma FC 3D Clientes · Mostruário 3D · Comandos flutuantes
   Cada caixinha tem o botão – (ocultar) na alça; oculta, fica só a alça com "mostrar ▸".
   O controle de giro (com a medida) e a caixinha "Dois cliques" ganham uma alça ⠿ para arrastar
   por cima do 3D. A posição fica guardada neste aparelho; duplo clique na alça volta ao lugar.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
const $=id=>document.getElementById(id);
const st=$('stage');if(!st)return;
const css=document.createElement('style');
css.textContent=`
.flu{position:absolute;z-index:30;display:flex;flex-direction:column;align-items:center;gap:6px;touch-action:none}
.flu .alca{align-self:stretch;display:flex;justify-content:center;align-items:center;height:14px;border-radius:7px;cursor:grab;color:var(--muted,#6b7a7a);
  font:700 12px system-ui;letter-spacing:2px;background:var(--panel,#fff);border:1px solid var(--line,#d9e0e0);user-select:none;opacity:.85}
.flu .alca:hover{opacity:1;color:var(--accent,#1f6f9a);border-color:var(--accent,#1f6f9a)}
.flu.arr .alca{cursor:grabbing}
#padFlu .angw,#padFlu .dimtag{position:static!important;inset:auto!important}
#padFlu{right:12px;bottom:12px;align-items:stretch}
.flu .alca{position:relative;padding:0 20px}
.flu .ocl{position:absolute;right:3px;top:50%;transform:translateY(-50%);border:0;background:none;color:inherit;font:700 12px system-ui;line-height:12px;cursor:pointer;padding:1px 4px;border-radius:4px;letter-spacing:0}
.flu .ocl:hover{background:rgba(127,127,127,.18)}
.flu.min>*:not(.alca){display:none!important}
.flu.min .alca{height:22px;opacity:1}
.flu.min .ocl{position:static;transform:none;margin-left:8px;font-size:11.5px}
#dicaFlu{left:10px;bottom:10px;align-items:stretch}
#dicaFlu .alca{background:rgba(16,32,31,.9);border-color:rgba(255,255,255,.2);color:#9fd8d1}
#dicaFlu #pfcMv{position:static!important;max-height:none}
#dicaFlu:has(#pfcMv[hidden]){display:none}
@media (max-width:640px){#padFlu{right:8px;bottom:8px}}`;
document.head.appendChild(css);

function arrastavel(box,chave,padrao){
  const al=document.createElement('div');al.className='alca';al.textContent='⠿⠿';al.title='Arraste para mover · duplo clique volta ao lugar';al.setAttribute('aria-label','Mover');
  box.insertBefore(al,box.firstChild);
  const oc=document.createElement('button');oc.type='button';oc.className='ocl';al.appendChild(oc);
  const kMin=chave+'-min',setMin=m=>{box.classList.toggle('min',m);oc.textContent=m?'mostrar ▸':'–';oc.title=m?'Mostrar':'Ocultar';oc.setAttribute('aria-label',oc.title);
    try{m?localStorage.setItem(kMin,'1'):localStorage.removeItem(kMin);}catch(_){}};
  let m0=false;try{m0=localStorage.getItem(kMin)==='1';}catch(_){}setMin(m0);
  ['pointerdown','dblclick'].forEach(t=>oc.addEventListener(t,e=>e.stopPropagation()));
  oc.addEventListener('click',e=>{e.stopPropagation();setMin(!box.classList.contains('min'));});
  const poe=(x,y)=>{const W=st.clientWidth,H=st.clientHeight,w=box.offsetWidth,h=box.offsetHeight;
    x=Math.max(0,Math.min(W-w,x));y=Math.max(0,Math.min(H-h,y));
    box.style.left=x+'px';box.style.top=y+'px';box.style.right='auto';box.style.bottom='auto';return [x,y];};
  const grava=p=>{try{localStorage.setItem(chave,JSON.stringify(p));}catch(_){}};
  const volta=()=>{try{localStorage.removeItem(chave);}catch(_){}box.style.left=box.style.top=box.style.right=box.style.bottom='';padrao&&padrao(box);};
  let salvo=null;try{salvo=JSON.parse(localStorage.getItem(chave)||'null');}catch(_){}
  if(salvo)requestAnimationFrame(()=>poe(salvo[0],salvo[1]));else padrao&&padrao(box);
  let ini=null;
  al.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();al.setPointerCapture(e.pointerId);
    const r=box.getBoundingClientRect(),s=st.getBoundingClientRect();ini={dx:e.clientX-r.left,dy:e.clientY-r.top,s};box.classList.add('arr');});
  al.addEventListener('pointermove',e=>{if(!ini)return;e.stopPropagation();poe(e.clientX-ini.s.left-ini.dx,e.clientY-ini.s.top-ini.dy);});
  const fim=e=>{if(!ini)return;ini=null;box.classList.remove('arr');if(box.style.left)grava([parseFloat(box.style.left),parseFloat(box.style.top)]);};
  al.addEventListener('pointerup',fim);al.addEventListener('pointercancel',fim);
  al.addEventListener('dblclick',e=>{e.stopPropagation();volta();});
  addEventListener('resize',()=>{if(box.style.left)poe(parseFloat(box.style.left),parseFloat(box.style.top));});
}

/* 1 · controle de giro + medida */
const ang=$('angw'),dim=$('dimtag');
if(ang&&dim){const pad=document.createElement('div');pad.id='padFlu';pad.className='flu';st.appendChild(pad);pad.appendChild(ang);pad.appendChild(dim);
  arrastavel(pad,'fc3d-flu-giro',null);}

/* 2 · caixinha "Dois cliques" (painel de ajuste de peça) · começa ao lado do painel de vento */
function dica(){
  const P=$('pfcMv');if(!P){setTimeout(dica,400);return;}
  const box=document.createElement('div');box.id='dicaFlu';box.className='flu';st.appendChild(box);box.appendChild(P);
  arrastavel(box,'fc3d-flu-dica',b=>{const c=$('c-conf');if(c&&c.classList.contains('cf-flu')&&c.parentNode===st){b.style.left=(c.offsetLeft+c.offsetWidth+12)+'px';}});
}
setTimeout(dica,700);
})();

/* Plataforma FC 3D Clientes · Mostruário 3D · Configuração compacta
   Cor do alumínio e do vidro viram bolinhas de cor (mesmo espaço de um ícone);
   os sliders de abrir as folhas saem da Configuração (abrir pelo mouse no 3D continua).
   Os selects originais ficam ocultos e continuam sendo a fonte da escolha (WVetro/CEM seguem iguais).
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
const $=id=>document.getElementById(id);
const cor=$('in-cor'),vid=$('in-vidro');if(!cor||!vid)return;
const row=cor.closest('.row');if(!row)return;
const FUNDO={branco:'#eceeed',preto:'#3d4044',bronze:'#5a4433',natural:'linear-gradient(135deg,#d3d7da,#9ea4a8)',
  cerejeira:'repeating-linear-gradient(100deg,#7a3a22 0 4px,#5c2914 4px 7px)',corten:'radial-gradient(circle at 30% 30%,#a85d2f,#5e2c14)',
  linheiro:'repeating-linear-gradient(100deg,#b8956a 0 4px,#8c6a43 4px 7px)',
  incolor:'linear-gradient(135deg,#e8f7f9,#bfe3ea)',verde:'linear-gradient(135deg,#a6dcc1,#5fb48a)',fume:'linear-gradient(135deg,#7a8286,#3f4649)'};

const css=document.createElement('style');
css.textContent=`
#openCtl{display:none!important}
.cfg-cores{display:flex;flex-direction:column;gap:8px}
.cfg-cores .cc{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.cfg-cores .cc>span{font-size:12px;color:var(--muted);min-width:58px}
.cfg-cores .cc em{font-style:normal;font-size:12px;font-weight:600;color:var(--fg);flex-basis:100%;margin:-2px 0 0 66px}
.cfg-cores .sw{width:24px;height:24px;border-radius:50%;border:2px solid var(--panel,#fff);box-shadow:0 0 0 1px var(--line,#cfd8dc);cursor:pointer;padding:0}
.cfg-cores .sw[aria-pressed=true]{box-shadow:0 0 0 2px var(--accent,#1f6f9a)}
.cfg-cores .sw:focus-visible{outline:2px solid var(--accent);outline-offset:2px}`;
document.head.appendChild(css);

const box=document.createElement('div');box.className='cfg-cores';
function grupo(sel,rot){
  const g=document.createElement('div');g.className='cc';
  g.innerHTML=`<span>${rot}</span>`+[...sel.options].map(o=>`<button type="button" class="sw" data-v="${o.value}" title="${o.textContent}" aria-label="${rot}: ${o.textContent}" style="background:${FUNDO[o.value]||'#ccc'}"></button>`).join('')+'<em></em>';
  const sync=()=>{g.querySelectorAll('.sw').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===sel.value));const o=sel.selectedOptions[0];g.querySelector('em').textContent=o?o.textContent:'';};
  g.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{if(sel.value===b.dataset.v)return;sel.value=b.dataset.v;sel.dispatchEvent(new Event('change',{bubbles:true}));sync();});
  sel.addEventListener('change',sync);setInterval(sync,1500);sync();
  return g;
}
box.appendChild(grupo(cor,'Alumínio'));box.appendChild(grupo(vid,'Vidro'));
row.hidden=true;row.style.display='none';
/* botão "🎨 Cores" com a escolha atual; as bolinhas abrem num balão ao lado (não ocupa espaço no painel) */
const st2=document.createElement('style');st2.textContent=`
.cfg-btn{display:flex;align-items:center;gap:8px;width:100%;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:10px;padding:7px 10px;cursor:pointer;font:600 13px var(--f-body,system-ui);text-align:left}
.cfg-btn:hover{border-color:var(--accent)}
.cfg-btn i{width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 1px var(--line,#cfd8dc);flex:none}
.cfg-btn small{font-weight:500;color:var(--muted);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cfg-btn b{margin-left:auto;color:var(--muted);font-weight:500}
.cfg-pop{position:fixed;z-index:99980;width:270px;background:var(--panel,#fff);border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.18);padding:12px}
.cfg-pop .cfg-cores .cc>span{min-width:0;flex-basis:100%;margin-bottom:-2px}
.cfg-pop .cfg-cores .cc em{flex-basis:auto;margin:0 0 0 2px}`;document.head.appendChild(st2);
const btn=document.createElement('button');btn.type='button';btn.className='cfg-btn';btn.setAttribute('aria-expanded','false');
const pop=document.createElement('div');pop.className='cfg-pop';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Cores do alumínio e do vidro');
pop.appendChild(box);document.body.appendChild(pop);
const nome=sel=>{const o=sel.selectedOptions[0];return o?o.textContent:'';};
function rotulo(){btn.innerHTML=`🎨 Cores <i style="background:${FUNDO[cor.value]||'#ccc'}"></i><i style="background:${FUNDO[vid.value]||'#ccc'}"></i><small>${nome(cor)} · ${nome(vid)}</small><b>▸</b>`;}
cor.addEventListener('change',rotulo);vid.addEventListener('change',rotulo);setInterval(rotulo,1500);rotulo();
function abre(v){pop.hidden=!v;btn.setAttribute('aria-expanded',v);if(!v)return;
  const r=btn.getBoundingClientRect(),W=270;let x=r.right+10,y=r.top;
  if(x+W>innerWidth-8){x=Math.max(8,Math.min(r.left,innerWidth-W-8));y=r.bottom+6;}
  pop.style.left=x+'px';pop.style.top=Math.max(8,Math.min(y,innerHeight-pop.offsetHeight-8))+'px';}
btn.onclick=e=>{e.stopPropagation();abre(pop.hidden);};
document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&e.target!==btn)abre(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pop.hidden)abre(false);});
addEventListener('resize',()=>abre(false));
row.parentNode.insertBefore(btn,row.nextSibling);
})();

/* ===== Painel "Simular pressão de vento" à esquerda do 3D, abaixo da Base técnica =====
   (no computador; no celular continua no painel lateral). Título "Configuração" só quando
   a tipologia não tem diagrama de mão de amigo. */
(function(){
const $=id=>document.getElementById(id);
const st=$('stage'),conf=$('c-conf');if(!st||!conf)return;
const h2=conf.querySelector('summary h2');
const casa={p:conf.parentNode,n:conf.nextSibling};
const css=document.createElement('style');
css.textContent=`
#c-conf.cf-flu{position:absolute;left:12px;width:262px;z-index:8;margin:0;padding:12px 13px;gap:10px;overflow:auto;overscroll-behavior:contain;
  border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.14);font-size:13px}
#c-conf.cf-flu summary h2{font-size:12.5px}
#c-conf.cf-flu .row label{font-size:12px}
#c-conf.cf-flu #c-vt .vt>.note:first-child{display:none}
#c-conf.cf-flu #c-vt .vt-cb button{padding:5px 9px}
#c-conf.cf-flu #c-vt .vt-cb button small{font-size:10.5px}
#c-dims{display:none!important}
#c-vt>summary{display:none!important}
#c-vt{border-top:1px solid var(--line);padding-top:8px}`;
document.head.appendChild(css);
let aberto=false;
function posiciona(){
  const desk=innerWidth>=900;
  if(desk&&conf.parentNode!==st){st.appendChild(conf);conf.classList.add('cf-flu');if(!aberto){conf.open=false;aberto=true;}}
  else if(!desk&&conf.parentNode===st){casa.p.insertBefore(conf,casa.n&&casa.n.parentNode===casa.p?casa.n:null);conf.classList.remove('cf-flu');conf.style.top=conf.style.maxHeight='';}
  const vt=$('c-vt');
  if(vt){if(!vt.open)vt.open=true;}
  if(h2){const t=vt&&!vt.hidden?'🌬 Simular pressão de vento':'Configuração';if(h2.textContent!==t)h2.textContent=t;}
  if(conf.parentNode===st){
    const b=$('btFlu');const top=b&&!b.hidden&&b.offsetParent?b.offsetTop+b.offsetHeight+10:58;
    conf.style.top=top+'px';conf.style.maxHeight=Math.max(160,st.clientHeight-top-12)+'px';
  }
}
addEventListener('resize',posiciona);setInterval(posiciona,500);setTimeout(posiciona,0);
})();

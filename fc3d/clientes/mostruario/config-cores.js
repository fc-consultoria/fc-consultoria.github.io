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
row.parentNode.insertBefore(box,row.nextSibling);
})();

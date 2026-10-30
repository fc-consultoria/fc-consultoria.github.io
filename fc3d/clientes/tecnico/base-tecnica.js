/* Plataforma FC 3D Clientes · 3D e Desenho Técnico · Base técnica
   Item fechado no painel lateral: a folha de montagem do catálogo técnico que serviu
   de base para esta tipologia, com a fonte. Desenhos em base/<montagem>.webp.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
/* montagem · página impressa do catálogo técnico (Suprema ou Gold) */
const PAG={jc2:117,jc2a:118,jc3:119,jc4:120,jc4a:121,jcb:122,jc4p:123,jc4pa:124,jvz3:125,jc4v:126,jvc7:127,jvz6:128,
  pvz3:129,pc2:130,pc2a:131,pc4:132,pc4a:133,pc3:134,pg1:135,pg2:136,mx1:137,mx2p:138,
  g_jc2:151,g_jc4:152,g_jc6:153,g_jvz3:154,g_jcb:155,g_pc2pe:156,g_pvz3:157,g_pc4b:158,g_pg1v:159,g_pg2:160,
  g_mxa:161,g_mxb:163,g_cjp:165,g_cju:166};
const V=1;
const KEY=new URLSearchParams(location.search).get('m')||'jc2';
const M=(window.FCM&&FCM.MONT&&FCM.MONT[KEY])||null;
if(!PAG[KEY]||!M)return;
const lat=document.querySelector('aside.lat');if(!lat)return;

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cd=M.cd||'',linha=/^SUP/i.test(cd)?'Suprema':'Gold',img=`base/${KEY}.webp?v=${V}`;
const fonte=`📘 <b>Fonte técnica:</b> folha de montagem do catálogo técnico oficial da Linha ${linha} (Alcoa) · ${esc(cd)}, p. ${PAG[KEY]}. O 3D e o desenho desta tipologia foram montados a partir dela. Medidas e pesos são demonstrativos: confirme sempre com o seu fornecedor. Marcas pertencem aos seus titulares.`;

const css=document.createElement('style');
css.textContent=`
details.bt{display:block!important}
details.bt summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}
details.bt summary::-webkit-details-marker{display:none}
details.bt summary h3{margin:0!important}
details.bt summary::after{content:'+';font-size:18px;color:var(--mute);line-height:1}
details.bt[open] summary::after{content:'−'}
details.bt[open] summary{margin-bottom:10px}
details.bt .bt-img{display:block;width:100%;padding:0;border:1px solid var(--line);border-radius:10px;background:#fff;cursor:zoom-in;overflow:hidden}
details.bt .bt-img img{display:block;width:100%;max-height:300px;object-fit:contain}
details.bt .bt-leg{font-size:12px;font-weight:600;margin:8px 0 4px}
details.bt .bt-f{font-size:12px;color:var(--mute);line-height:1.45;margin:0}
#btZoom{position:fixed;inset:0;z-index:99990;background:rgba(10,20,22,.9);display:flex;flex-direction:column}
#btZoom .bz-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;color:#fff;font:600 14px system-ui}
#btZoom .bz-bar button{background:#fff;color:#025a67;border:0;border-radius:8px;padding:7px 12px;font:600 14px system-ui;cursor:pointer}
#btZoom .bz-area{flex:1;overflow:auto;display:grid;place-items:center;padding:10px}
#btZoom .bz-area img{background:#fff;border-radius:6px;max-width:100%;max-height:100%;cursor:zoom-in}
#btZoom .bz-area.z img{max-width:none;max-height:none;height:240vh;cursor:zoom-out}
#btZoom .bz-fonte{color:#d7e3e1;font:500 12px system-ui;padding:0 14px 12px;margin:0}`;
document.head.appendChild(css);

const box=document.createElement('details');box.className='box bt';
box.innerHTML=`<summary><h3>📐 Base técnica</h3></summary>
  <button type="button" class="bt-img" title="Abrir em tela cheia"><img src="${img}" alt="Folha de montagem do catálogo · ${esc(cd)}" loading="lazy"></button>
  <p class="bt-leg">${esc(cd)} · Folha de montagem · catálogo p. ${PAG[KEY]}</p>
  <p class="bt-f">${fonte}</p>`;
const av=lat.querySelector('.aviso');lat.insertBefore(box,av||null);

box.querySelector('.bt-img').onclick=()=>{
  const z=document.createElement('div');z.id='btZoom';z.setAttribute('role','dialog');z.setAttribute('aria-modal','true');z.setAttribute('aria-label','Base técnica');
  z.innerHTML=`<div class="bz-bar"><span>${esc(M.n)} · ${esc(cd)}</span><button type="button">Fechar</button></div>
   <div class="bz-area"><img src="${img}" alt="Folha de montagem do catálogo · ${esc(cd)}"></div>
   <p class="bz-fonte">${fonte} Toque no desenho para ampliar.</p>`;
  document.body.appendChild(z);
  const fecha=()=>{z.remove();document.removeEventListener('keydown',k);},k=e=>{if(e.key==='Escape')fecha();};
  const b=z.querySelector('.bz-bar button');b.onclick=fecha;b.focus();
  z.querySelector('.bz-area img').onclick=e=>{e.stopPropagation();z.querySelector('.bz-area').classList.toggle('z');};
  z.querySelector('.bz-area').onclick=e=>{if(e.target===e.currentTarget)fecha();};
  document.addEventListener('keydown',k);
};
})();

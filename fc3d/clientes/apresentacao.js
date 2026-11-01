/* Plataforma FC 3D Clientes · tela Apresentação
   Miniaturas geradas pelo próprio 3D (mostruario/mini/*.webp). Ao clicar, a esquadria "sai da tela"
   e o 3D real abre em modo miniatura (mostruario/?lite=1). No "+", o 3D aproxima no ponto e aparece a prévia;
   "Mais detalhes" abre o 3D completo direto naquele corte (mostruario/?t=..&corte=..).
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
const MO='mostruario/';
const C=()=>window.PFCaprCtx,TIPS_=()=>C().TIPS,h=x=>C().h(x),papel=()=>C().papel(),render=()=>C().render();
let filtro='todas',atual=null,fly=null,fr=null,hot=null;
const css=`
.ap-fl{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 6px}
.ap-fl button{font:500 14px var(--f-b);padding:7px 14px;border-radius:20px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer}
.ap-fl button[aria-pressed=true]{background:var(--teal);border-color:var(--teal);color:#fff}
.ap-h{font:600 15px var(--f-h);margin:22px 0 10px}
.ap-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.ap-c{all:unset;box-sizing:border-box;cursor:pointer;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:4px;transition:border-color .2s,transform .25s}
.ap-c:hover,.ap-c:focus-visible{border-color:var(--teal);transform:translateY(-3px)}
.ap-c:focus-visible{outline:2px solid var(--teal);outline-offset:2px}
.ap-th{height:170px;border-radius:12px;background:var(--soft);display:grid;place-items:center;perspective:800px;overflow:hidden;margin-bottom:6px}
.ap-th img{max-width:88%;max-height:150px;transition:transform .45s cubic-bezier(.2,.9,.3,1.1)}
.ap-c:hover .ap-th img{transform:rotateY(10deg) scale(1.07)}
.ap-c b{font:600 15px/1.3 var(--f-h);color:var(--ink)}
.ap-c span{font-size:13px;color:var(--mute)}
.ap-c i{font-style:normal;font-size:12px;font-weight:600;color:var(--teal);margin-top:4px}
.ap-ov{position:fixed;inset:0;z-index:900;background:rgba(9,22,28,.66);opacity:0;transition:opacity .35s}
.ap-ov.on{opacity:1}
.ap-fly{position:fixed;z-index:901;will-change:transform;pointer-events:none}
.ap-fly img{width:100%;height:100%;object-fit:contain;display:block}
.ap-fr{position:fixed;z-index:902;border:0;background:transparent;opacity:0;transition:opacity .35s}
.ap-fr.vis{opacity:1}
.ap-fr.zoom{background:var(--panel);border-radius:18px;outline:2px solid var(--teal);outline-offset:-2px}
.ap-fr.full{background:var(--bg)}
.ap-hd{position:fixed;z-index:903;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));top:calc(14px + env(safe-area-inset-top,0px));display:flex;align-items:center;gap:10px;color:#fff;pointer-events:none}
.ap-hd b{font:600 18px var(--f-h)}.ap-hd small{font-size:12px;color:#b9d3d8;margin-left:6px}
.ap-hd button{pointer-events:auto;font:600 14px var(--f-b);border:0;border-radius:8px;padding:8px 14px;cursor:pointer;background:#fff;color:#14212a}
.ap-hd .ap-x{margin-left:auto}
.ap-ld,.ap-dc{position:fixed;z-index:903;left:50%;transform:translateX(-50%);color:#fff;font-size:12px;pointer-events:none;white-space:nowrap}
.ap-ld{bottom:46px;background:rgba(0,0,0,.4);padding:4px 10px;border-radius:20px}
.ap-dc{bottom:calc(16px + env(safe-area-inset-bottom,0px));color:#d6e6ea;font-size:13px}
.ap-pv{position:fixed;z-index:910;width:280px;background:var(--panel);color:var(--ink);border-radius:14px;border:1px solid var(--line);padding:14px;opacity:0;transform:translateY(8px) scale(.97);transition:opacity .22s,transform .22s;pointer-events:none}
.ap-pv.on{opacity:1;transform:none;pointer-events:auto}
.ap-pv small{font-size:11px;font-weight:600;letter-spacing:.05em;color:var(--teal)}
.ap-pv b{display:block;font:600 17px var(--f-h);margin:2px 0 4px}
.ap-pv p{margin:0 0 12px;font-size:14px;color:var(--mute)}
.ap-pv div{display:flex;gap:8px}
.ap-pv button{font:600 14px var(--f-b);border-radius:8px;padding:9px 12px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--ink)}
.ap-pv .ap-m{flex:1;border:0;background:var(--teal);color:#fff}
img.mini3d{max-width:88%;max-height:150px;object-fit:contain;cursor:zoom-in;transition:transform .45s cubic-bezier(.2,.9,.3,1.1)}
.card:hover img.mini3d{transform:rotateY(10deg) scale(1.06)}
.des:has(img.mini3d){perspective:800px;display:grid;place-items:center}
[class^="ap-"][hidden]{display:none!important}
.ap-hd.baixo{top:auto;bottom:calc(16px + env(safe-area-inset-bottom,0px))}.ap-hd.baixo div{display:none}.ap-hd.baixo .ap-v{margin-left:auto}.ap-hd.baixo .ap-x{margin-left:0}
.ap-hd.baixo button{box-shadow:0 2px 10px rgba(0,0,0,.25)}
@media (max-width:600px){.ap-hd b{font-size:15px}.ap-dc{display:none}.ap-pv{left:16px!important;right:16px;width:auto;top:auto!important;bottom:16px}}
@media (prefers-reduced-motion:reduce){.ap-th img,.ap-c{transition:none}}`;
function estilo(){if(document.getElementById('apCss'))return;const s=document.createElement('style');s.id='apCss';s.textContent=css;document.head.appendChild(s);}
const lista=()=>TIPS_().filter(t=>t.mo&&(!t.aj||(C().sessao()||{}).matriz)&&(filtro==='todas'||t.g===filtro));
const podeCompleto=()=>papel()!=='arquiteto'&&papel()!=='demo';
function tela(){estilo();
  const L=lista(),bt=(f,n)=>`<button type="button" data-apf="${f}" aria-pressed="${filtro===f}">${n}</button>`;
  const bloco=l=>{const it=L.filter(t=>t.l===l);if(!it.length)return'';
    return `<h3 class="ap-h">${h(C().LINHAS[l].n)}</h3><div class="ap-g">${it.map(t=>`<button type="button" class="ap-c" data-apt="${t.mo}"><div class="ap-th"><img loading="lazy" alt="" src="${MO}mini/${t.mo}.webp?v=1"></div><b>${h(t.n)}</b><span>${t.cd?h(t.cd)+' · ':''}${h(t.uso||'')}</span><i>Abrir em 3D</i></button>`).join('')}</div>`;};
  return `<div class="cab"><div><h2>Apresentação</h2><p class="mute">Toque na esquadria para ela sair da tela e girar em 3D. Nos <b>+</b> aparece a prévia de cada ponto${podeCompleto()?'; em “Mais detalhes” abre o 3D completo':''}.</p></div></div>
  <div class="ap-fl">${bt('todas','Todas')}${bt('jan','Janelas')}${bt('por','Portas')}</div>${bloco('res')}${bloco('gld')}
  <p class="mute" style="font-size:13px;margin-top:18px">A fachada continua em <a href="#" data-ir="tip">Tipologias → Fachadas</a>, com as medidas da obra.</p>`;}
function ligar(){estilo();
  /* Tipologias: a miniatura 3D do card abre a esquadria saindo da tela; o resto do card continua abrindo o detalhe */
  document.querySelectorAll('[data-ap3d]').forEach(i=>{i.onclick=e=>{e.preventDefault();e.stopPropagation();abrir(i.dataset.ap3d,i);};});
  document.querySelectorAll('[data-apf]').forEach(b=>b.onclick=()=>{filtro=b.dataset.apf;render();});
  document.querySelectorAll('[data-apt]').forEach(c=>c.onclick=()=>abrir(c.dataset.apt,c.querySelector('img')));
}
const area=()=>{const W=innerWidth,H=innerHeight,m=W<600?12:60;return{x:m,y:70,w:W-2*m,h:H-140};};
const poe=(el,A)=>Object.assign(el.style,{left:A.x+'px',top:A.y+'px',width:A.w+'px',height:A.h+'px'});
let ov,hd,ld,dc,pv;
function monta(){
  ov=document.createElement('div');ov.className='ap-ov';ov.onclick=fechar;
  hd=document.createElement('div');hd.className='ap-hd';hd.innerHTML='<button type="button" class="ap-v" hidden>← Voltar à prévia</button><div><b></b><small></small></div><button type="button" class="ap-x">Fechar ✕</button>';
  ld=document.createElement('div');ld.className='ap-ld';ld.textContent='carregando o 3D…';
  dc=document.createElement('div');dc.className='ap-dc';dc.textContent='Arraste para girar · toque nos + para ver cada ponto';
  pv=document.createElement('div');pv.className='ap-pv';pv.setAttribute('role','dialog');pv.setAttribute('aria-live','polite');
  pv.innerHTML='<small></small><b></b><p></p><div><button type="button" class="ap-m">Mais detalhes →</button><button type="button" class="ap-f">Fechar</button></div>';
  document.body.append(ov,hd,ld,dc,pv);
  hd.querySelector('.ap-x').onclick=fechar;hd.querySelector('.ap-v').onclick=voltar;
  pv.querySelector('.ap-f').onclick=fechaPv;pv.querySelector('.ap-m').onclick=completo;
}
function abrir(t,img){
  atual=TIPS_().find(x=>x.mo===t);if(!atual)return;if(!ov)monta();
  hd.querySelector('b').textContent=atual.n;hd.querySelector('small').textContent=atual.cd||'';hd.querySelector('.ap-v').hidden=true;hd.classList.remove('baixo');
  pv.querySelector('.ap-m').hidden=!podeCompleto();
  [ov,hd,ld,dc].forEach(e=>e.hidden=false);void ov.offsetWidth;ov.classList.add('on');document.body.style.overflow='hidden';
  /* 1) a miniatura voa do card para o centro, girando como se saísse da tela */
  const r=img.getBoundingClientRect(),A=area(),ar=img.naturalWidth/img.naturalHeight||1.4;
  const w=Math.min(A.w*.78,A.h*.82*ar),hh=w/ar,fx=A.x+(A.w-w)/2,fy=A.y+(A.h-hh)/2;
  fly=document.createElement('div');fly.className='ap-fly';fly.innerHTML='<img alt="" src="'+img.src+'">';poe(fly,{x:fx,y:fy,w,h:hh});document.body.appendChild(fly);
  const tx=r.left+r.width/2-(fx+w/2),ty=r.top+r.height/2-(fy+hh/2),sx=r.width/w;
  fly.animate([{transform:`perspective(1400px) translate(${tx}px,${ty}px) scale(${sx})`},
    {offset:.55,transform:'perspective(1400px) scale(1.06) translateZ(80px) rotateY(-16deg) rotateX(5deg)'},
    {transform:'perspective(1400px) scale(1) rotateY(-6deg) rotateX(2deg)'}],
    {duration:matchMedia('(prefers-reduced-motion: reduce)').matches?1:850,easing:'cubic-bezier(.2,.8,.25,1)',fill:'forwards'});
  /* 2) o 3D real, em modo miniatura, carrega por trás e entra quando fica pronto */
  fr=document.createElement('iframe');fr.className='ap-fr';fr.title='Esquadria em 3D';poe(fr,A);
  fr.src=MO+'?t='+t+'&lite=1';document.body.appendChild(fr);
}
addEventListener('message',e=>{const m=e.data;if(!m||!m.fc3d||!fr||e.source!==fr.contentWindow)return;
  if(m.ev==='pronto'){fr.classList.add('vis');ld.hidden=true;if(fly){const f=fly;fly=null;setTimeout(()=>{f.style.transition='opacity .35s';f.style.opacity=0;setTimeout(()=>f.remove(),400);},150);}}
  if(m.ev==='hot')mostraPv(m);
});
function mostraPv(m){
  hot=m;fr.classList.add('zoom');const fb=fr.getBoundingClientRect();
  pv.querySelector('small').textContent=(atual.cd?atual.cd+' · ':'')+'PRÉVIA DO PONTO';pv.querySelector('b').textContent=m.n;pv.querySelector('p').textContent=m.d;
  /* o 3D aproxima no ponto; a prévia fica no canto, sem cobrir a peça */
  let L=fb.right-300,T=fb.bottom-220;if(L<12)L=12;if(T<70)T=70;pv.style.left=L+'px';pv.style.top=T+'px';
  pv.classList.remove('on');void pv.offsetWidth;pv.classList.add('on');
}
function fechaPv(){if(!pv)return;const on=pv.classList.contains('on');pv.classList.remove('on');
  if(fr){fr.classList.remove('zoom');if(on&&fr.src.includes('lite=1'))fr.contentWindow.postMessage({fc3d:'sair'},'*');}}
/* 3) Mais detalhes: o 3D completo já configurado, direto no corte do ponto */
function completo(){if(!hot||!fr||!podeCompleto())return;pv.classList.remove('on');fr.classList.remove('vis','zoom');fr.classList.add('full');
  ld.hidden=false;dc.hidden=true;poe(fr,{x:0,y:0,w:innerWidth,h:innerHeight});
  fr.onload=()=>{fr.classList.add('vis');ld.hidden=true;};fr.src=MO+'?t='+atual.mo+'&corte='+encodeURIComponent(hot.k);
  hd.querySelector('.ap-v').hidden=false;hd.classList.add('baixo');ov.classList.remove('on');}
function voltar(){hd.classList.remove('baixo');ov.classList.add('on');fr.classList.remove('vis','full');fr.onload=null;poe(fr,area());ld.hidden=false;dc.hidden=false;hd.querySelector('.ap-v').hidden=true;fr.src=MO+'?t='+atual.mo+'&lite=1';}
function fechar(){fechaPv();if(fr){fr.remove();fr=null;}if(fly){fly.remove();fly=null;}if(ov){ov.classList.remove('on');[ov,hd,ld,dc].forEach(e=>e.hidden=true);}document.body.style.overflow='';}
addEventListener('keydown',e=>{if(e.key!=='Escape'||!fr)return;if(pv.classList.contains('on'))fechaPv();else fechar();});
window.PFCapr={tela:()=>C()?tela():'',ligar:()=>{if(C())ligar();}};
})();

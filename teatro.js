/* ===== Modo teatro: abre a demonstração grande na tela, sem sair do site ===== */
(function(){
  const ACOMP='https://fc-consultoria.github.io/treinamento/acompanhamento/?demo=1&play=1';
  const css=`#thM{position:fixed;inset:0;z-index:9995;background:rgba(4,12,18,0);display:grid;place-items:center;padding:14px;transition:background .35s}
#thM.on{background:rgba(4,12,18,.86)}
#thM .thb{position:relative;transform:scale(.55);opacity:0;transition:transform .45s cubic-bezier(.2,1.2,.3,1),opacity .3s}
#thM.on .thb{transform:scale(1);opacity:1}
#thM .thf{width:min(430px,94vw);height:min(880px,calc(100vh - 90px));border-radius:42px;background:#0b1419;padding:12px;box-shadow:0 30px 90px rgba(0,0,0,.6),0 0 0 2px #22394a}
#thM .thf iframe{width:100%;height:100%;border:0;border-radius:32px;background:#fff}
#thM .thw{width:min(1240px,96vw);height:min(820px,calc(100vh - 90px));border-radius:16px;overflow:hidden;background:#eef1f3;box-shadow:0 30px 90px rgba(0,0,0,.6)}
#thM .thw iframe{width:100%;height:100%;border:0}
#thM .thx{all:unset;position:absolute;top:-14px;right:-14px;width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:#fff;color:#0b1419;font:700 20px system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4)}
#thM .thl{position:absolute;left:0;right:0;bottom:-34px;text-align:center;color:#cfe6ec;font:600 13px system-ui,sans-serif}
#thM .thl a{color:#5fd3e6}
@media(max-width:700px){#thM{padding:0}#thM .thf{width:100vw;height:100vh;border-radius:0;padding:0}#thM .thf iframe{border-radius:0}#thM .thw{width:100vw;height:100vh;border-radius:0}#thM .thx{top:10px;right:10px}#thM .thl{display:none}}
.thpulse{animation:thp 1.6s ease-in-out infinite}@keyframes thp{0%,100%{box-shadow:0 0 0 0 rgba(31,183,204,.55)}50%{box-shadow:0 0 0 12px rgba(31,183,204,0)}}
.fone{position:relative}.fone .thov{position:absolute;left:0;right:0;top:0;bottom:30px;z-index:3;display:grid;place-items:center;cursor:pointer;border-radius:40px;background:linear-gradient(180deg,rgba(6,20,28,.05),rgba(6,20,28,.45));transition:background .2s}.fone .thov:hover{background:linear-gradient(180deg,rgba(6,20,28,.1),rgba(6,20,28,.6))}.fone .thz{font:700 16px var(--f-d,system-ui);padding:14px 22px;border-radius:14px;border:0;background:#1fb7cc;color:#06222a;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.35)}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  function hit(ref){try{fetch('https://cpkjphodruyxfouirhpd.supabase.co/rest/v1/rpc/site_hit',{method:'POST',keepalive:true,headers:{apikey:'sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg','Content-Type':'application/json'},body:JSON.stringify({p_s:sessionStorage.getItem('fc_s')||'x',p_pag:'site',p_ev:'teatro',p_o:sessionStorage.getItem('fc_o')||'direto',p_ref:ref})}).catch(()=>{});}catch(_){}}
  function fechar(){const m=document.getElementById('thM');if(!m)return;m.classList.remove('on');setTimeout(()=>m.remove(),350);document.removeEventListener('keydown',esc);document.documentElement.style.overflow='';}
  function esc(e){if(e.key==='Escape')fechar();}
  function abrir(qual){fechar();hit(qual);const m=document.createElement('div');m.id='thM';
    const acomp=qual==='acomp';
    m.innerHTML=`<div class="thb">${acomp?`<div class="thf"><iframe src="${ACOMP}" title="Demonstração do acompanhamento da implantação" allow="clipboard-write"></iframe></div>`:`<div class="thw"><iframe src="demo.html" title="Demonstração Orientativo FC 3D"></iframe></div>`}
      <button type="button" class="thx" aria-label="Fechar">✕</button>
      <div class="thl">${acomp?'Demonstração com cliente fictício · os dias avançam sozinhos':'Gire, abra as folhas e desmonte peça por peça'} · <a href="#" data-thx>fechar</a></div></div>`;
    document.body.appendChild(m);document.documentElement.style.overflow='hidden';requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('on')));
    m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.thx')||e.target.closest('[data-thx]')){e.preventDefault();fechar();}});document.addEventListener('keydown',esc);}
  window.FCTH={abrir,fechar};
  function ligar(){
    const d=document.getElementById('acDemo');if(d){d.textContent='▶ Ver funcionando aqui';d.removeAttribute('target');d.href='#acompanhamento';d.classList.add('thpulse');d.addEventListener('click',e=>{e.preventDefault();abrir('acomp');});}
    const f=document.querySelector('.fone');if(f&&!f.querySelector('.thov')){const o=document.createElement('div');o.className='thov';o.title='Abrir em tela grande';o.innerHTML='<button type="button" class="thz thpulse">▶ Reproduzir em tela grande</button>';o.onclick=()=>abrir('acomp');f.appendChild(o);}
    const p=document.getElementById('dplay');if(p){p.onclick=e=>{e.preventDefault();abrir('3d');};p.classList.add('thpulse');}
    document.querySelectorAll('a[href="#demo"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();abrir('3d');}));
    if(location.hash==='#ver-acomp')abrir('acomp');if(location.hash==='#ver-3d')abrir('3d');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ligar);else ligar();
})();

/* ===== Destaque do Instagram da FC =====
   Tela larga: cartão fixo no canto DIREITO (espelho do cartão de folders, que fica à esquerda).
   Pode ser minimizado (vira uma aba redonda). Tela menor/celular: só o ícone no topo do site. */
(function(){
  const URL_IG='https://www.instagram.com/fc__consultoria/';
  const BASE=(document.currentScript&&document.currentScript.src||location.href).replace(/[^/]*$/,'');
  const SS={g(k){try{return sessionStorage.getItem(k);}catch(_){return null;}},s(k,v){try{sessionStorage.setItem(k,v);}catch(_){}}};
  const GR='radial-gradient(circle at 30% 107%,#fdf497 0,#fd5949 45%,#d6249f 60%,#285aeb 90%)';
  const ICO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
  const css=`#igC{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:60;width:var(--igw,200px);background:#fff;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.35);overflow:hidden;color:#13232e;font:400 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
#igC .igh{display:flex;align-items:center;justify-content:space-between;padding:7px 8px 6px 11px;background:#0f2a36;color:#fff;font:700 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.04em}
#igC .igh button{all:unset;cursor:pointer;width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.14);font-size:13px}
#igC .igtop{background:${GR};padding:18px 12px 14px;display:flex;flex-direction:column;align-items:center;gap:8px;color:#fff;text-align:center}
#igC .igav{width:calc(var(--igw,200px)*.38);height:calc(var(--igw,200px)*.38);border-radius:50%;padding:3px;background:#fff}
#igC .igav img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
#igC .igtop b{font:800 calc(12px + var(--igw,200px)*.02)/1.15 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}#igC .igtop span{font-size:11.5px;opacity:.92}
#igC ul{list-style:none;margin:0;padding:12px 12px 2px;display:flex;flex-direction:column;gap:7px}#igC li{display:flex;gap:7px;align-items:flex-start;font-size:12.5px;color:#34464f}
#igC .igbt{all:unset;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:7px;width:calc(100% - 20px);margin:10px 10px 6px;cursor:pointer;background:${GR};color:#fff;border-radius:9px;padding:9px 6px;font:700 13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center}
#igC .igbt svg{width:16px;height:16px}#igC .igbt:hover{filter:brightness(1.08)}
#igC small{display:block;text-align:center;color:#7a8b94;font-size:11px;padding:0 10px 10px}
#igT{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:60;width:48px;height:48px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;background:${GR};color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.3)}#igT svg{width:24px;height:24px}`;
  function espaco(){const hw=document.querySelector('.hero .w')||document.querySelector('.w');if(!hw)return 0;const r=hw.getBoundingClientRect();return window.innerWidth-r.right+(parseFloat(getComputedStyle(hw).paddingRight)||0);}
  function desenhar(){['igC','igT'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});
    const esp=espaco();if(window.innerWidth<1300||esp<190)return;
    if(SS.g('ig_min')==='1'){const t=document.createElement('button');t.type='button';t.id='igT';t.title='Siga a FC no Instagram';t.setAttribute('aria-label','Abrir destaque do Instagram');t.innerHTML=ICO;t.onclick=()=>{SS.s('ig_min','0');desenhar();};document.body.appendChild(t);return;}
    const w=Math.max(160,Math.min(240,esp-40));
    const c=document.createElement('aside');c.id='igC';c.style.setProperty('--igw',w+'px');c.setAttribute('aria-label','Instagram da FC');
    c.innerHTML=`<div class="igh"><span>📸 SIGA A FC</span><button type="button" id="igMin" title="Minimizar" aria-label="Minimizar">–</button></div>
      <div class="igtop"><div class="igav"><img src="${BASE}img/logo-fc-160.jpg" alt="FC Consultoria"></div><b>@fc__consultoria</b><span>FC Consultoria em Esquadria</span></div>
      <ul><li>💡<span>Dicas de custo e preço para esquadria</span></li><li>🧊<span>Novidades da Plataforma FC 3D</span></li><li>📣<span>Lançamentos das representadas</span></li></ul>
      <a class="igbt" href="${URL_IG}" target="_blank" rel="noopener">${ICO}Seguir no Instagram</a><small>Segue lá e acompanha a FC 👊</small>`;
    document.body.appendChild(c);document.getElementById('igMin').onclick=()=>{SS.s('ig_min','1');desenhar();};}
  function montar(){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);desenhar();
    addEventListener('resize',()=>{clearTimeout(window.__igR);window.__igR=setTimeout(desenhar,200);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
})();

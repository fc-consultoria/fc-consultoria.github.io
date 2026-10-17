/* ===== Vitrine de folders (representadas) =====
   Ligada e escolhida no Painel da Matriz → Marketing do catálogo → "Vitrine de folders no site".
   Tela larga: cartão fixo no canto esquerdo, troca a cada N segundos (pausa com o mouse em cima).
   Tela menor/celular: aba pequena no canto inferior esquerdo. Clique abre o folder com "Pedir orçamento". */
(function(){
  const SB='https://cpkjphodruyxfouirhpd.supabase.co',KEY='sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg';
  const BASE=(document.currentScript&&document.currentScript.src||location.href).replace(/[^/]*$/,'');
  const esc=v=>String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const SS={g(k){try{return sessionStorage.getItem(k);}catch(_){return null;}},s(k,v){try{sessionStorage.setItem(k,v);}catch(_){}}};
  let L=[],i=0,seg=6,tm=null,pausa=false;
  function hit(ref){try{if(localStorage.getItem('fc_eu')==='1')return;fetch(SB+'/rest/v1/rpc/site_hit',{method:'POST',keepalive:true,headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({p_s:SS.g('fc_s')||'x',p_pag:'site',p_ev:'vitrine',p_o:SS.g('fc_o')||'direto',p_ref:ref||''})}).catch(()=>{});}catch(_){}}
  const css=`#vtC{position:fixed;left:18px;top:50%;transform:translateY(-50%);z-index:60;width:var(--vtw,190px);background:#fff;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.35);overflow:hidden;font-family:inherit;color:#13232e}
#vtC .vtzh{font-size:11.5px!important;line-height:1.2;display:flex;align-items:center;justify-content:space-between;padding:7px 8px 6px 11px;background:#0f2a36;color:#fff;font:700 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.04em}
#vtC .vtzh button{all:unset;cursor:pointer;width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.14);font-size:13px}
#vtC .vtzi{position:relative;display:block;width:100%;aspect-ratio:600/849;background:#eef2f4;cursor:pointer;border:0;padding:0}
#vtC .vtzi img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .5s}
#vtC .vtzt{background:none;color:#13232e;padding:8px 10px 4px;font:700 13.5px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}#vtC .vtzm{padding:0 10px;font-size:11.5px;color:#5d6f7a}
#vtC .vtzb{all:unset;box-sizing:border-box;display:block;width:calc(100% - 20px);margin:8px 10px 6px;text-align:center;cursor:pointer;background:#1f9d55;color:#fff;border-radius:9px;padding:7px 6px;font:700 12.5px system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
#vtC .vtzd{display:flex;gap:4px;justify-content:center;padding:0 0 9px;flex-wrap:wrap}#vtC .vtzd i{width:5px;height:5px;border-radius:50%;background:#cfd8de}#vtC .vtzd i.on{background:#1f9d55;width:12px;border-radius:3px}
#vtT{position:fixed;left:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:8px;background:#0f2a36;color:#fff;border:0;border-radius:14px;padding:6px 12px 6px 6px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.3);font:700 13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
#vtT img{width:40px;height:56px;object-fit:cover;border-radius:7px;background:#fff}#vtT small{display:block;font-weight:500;opacity:.8;font-size:11px}
#vtM{position:fixed;inset:0;z-index:9990;background:rgba(6,16,24,.82);display:grid;place-items:center;padding:14px}
#vtM .vc{background:#fff;color:#13232e;border-radius:18px;max-width:min(860px,100%);width:100%;max-height:calc(100vh - 28px);overflow:auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);box-shadow:0 24px 60px rgba(0,0,0,.45)}
#vtM .vimg{background:#eef2f4;position:relative}#vtM .vimg img{display:block;width:100%;height:auto}
#vtM .vtx{padding:20px;display:flex;flex-direction:column;gap:10px}#vtM .vtx small{font:700 11px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#5d6f7a}
#vtM h3{margin:0;font:800 22px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#13232e}#vtM p{margin:0;color:#4a5b66;font-size:14.5px;line-height:1.45}
#vtM .va{display:flex;flex-direction:column;gap:8px;margin-top:auto}#vtM .va a,#vtM .va button{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;border-radius:11px;padding:11px 12px;font:700 14.5px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #cfd8de;color:#13232e}
#vtM .va .pri{background:#1f9d55;border-color:#1f9d55;color:#fff}#vtM .vn{display:flex;gap:8px}#vtM .vn button{flex:1}
#vtM .vx{all:unset;position:absolute;top:10px;right:10px;cursor:pointer;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:18px}
@media(max-width:700px){#vtM .vc{grid-template-columns:1fr}#vtM .vimg img{max-height:52vh;width:auto;margin:0 auto}#vtT{bottom:12px;padding:5px 10px 5px 5px}#vtT small{display:none}#vtT img{width:32px;height:45px}}`;
  function largo(){return window.innerWidth>=1480&&SS.g('vt_min')!=='1';}
  function montar(){
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);desenhar();
    window.addEventListener('resize',()=>{clearTimeout(window.__vtR);window.__vtR=setTimeout(desenhar,200);});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)parar();else rodar();});}
  function desenhar(){['vtC','vtT'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});
    const x=L[i];if(!x)return;
    if(largo()){const w=Math.max(150,Math.min(210,(window.innerWidth-1180)/2-30));
      const c=document.createElement('aside');c.id='vtC';c.style.setProperty('--vtw',w+'px');c.setAttribute('aria-label','Folders das representadas');
      c.innerHTML=`<div class="vtzh"><span>📣 FOLDERS · ORÇAMENTO</span><button type="button" id="vtMin" title="Minimizar" aria-label="Minimizar">–</button></div>
        <button type="button" class="vtzi" id="vtI" aria-label="Abrir folder"><img id="vtImg" src="${esc(BASE+x.img)}" alt="${esc(x.t)}"></button>
        <div class="vtzt" id="vtTt">${esc(x.t)}</div><div class="vtzm" id="vtMc">${esc(x.marca)}</div>
        <button type="button" class="vtzb" id="vtB">${rotB(x)}</button><div class="vtzd" id="vtD">${L.length<=24?L.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join(''):''}</div>`;
      document.body.appendChild(c);
      c.addEventListener('mouseenter',()=>{pausa=true;});c.addEventListener('mouseleave',()=>{pausa=false;});
      document.getElementById('vtI').onclick=()=>clicar(i);document.getElementById('vtB').onclick=()=>{const y=L[i];y.acao?clicar(i):orcar(y);};
      document.getElementById('vtMin').onclick=()=>{SS.s('vt_min','1');desenhar();};}
    else{const t=document.createElement('button');t.type='button';t.id='vtT';t.setAttribute('aria-label','Ver folders e pedir orçamento');
      t.innerHTML=`<img id="vtImg" src="${esc(BASE+x.img)}" alt=""><span>📣 Folders<small id="vtTt">${esc(x.t)}</small></span>`;document.body.appendChild(t);t.onclick=()=>clicar(i);}
    rodar();}
  function trocar(){if(pausa||document.getElementById('vtM')||L.length<2)return;i=(i+1)%L.length;const x=L[i],im=document.getElementById('vtImg');if(!im)return;
    const nova=new Image();nova.onload=()=>{im.style.opacity=0;setTimeout(()=>{im.src=nova.src;im.alt=x.t;im.style.opacity=1;},250);};nova.src=BASE+x.img;
    const t=document.getElementById('vtTt'),m=document.getElementById('vtMc'),d=document.getElementById('vtD'),bb=document.getElementById('vtB');if(bb)bb.textContent=rotB(x);if(t)t.textContent=x.t;if(m)m.textContent=x.marca;
    if(d)[...d.children].forEach((e,k)=>e.classList.toggle('on',k===i));}
  function clicar(k){const x=L[k];if(x&&x.acao&&window.FCTH){hit('acao:'+x.id);FCTH.abrir(x.acao);return;}abrir(k);}
  const rotB=x=>x&&x.acao?'▶ Ver agora':'💬 Pedir orçamento';
  function rodar(){parar();if(L.length>1)tm=setInterval(trocar,seg*1000);}function parar(){if(tm)clearInterval(tm);tm=null;}
  function orcar(x){hit('orc:'+x.id);const t='Quero orçamento de '+x.t+' ('+x.marca+'). Quantidade: ';fechar();if(window.FCRC){FCRC.abrir(t);}else{location.href='https://wa.me/5566999867984?text='+encodeURIComponent(t);}}
  function fechar(){const m=document.getElementById('vtM');if(m)m.remove();document.removeEventListener('keydown',tecla);}
  function tecla(e){if(e.key==='Escape')fechar();if(e.key==='ArrowRight')abrir((cur+1)%L.length);if(e.key==='ArrowLeft')abrir((cur-1+L.length)%L.length);}
  let cur=0;
  function abrir(k){cur=k;const x=L[k];if(!x)return;hit('ver:'+x.id);fechar();const m=document.createElement('div');m.id='vtM';
    m.innerHTML=`<div class="vc" role="dialog" aria-label="${esc(x.t)}"><div class="vimg"><img src="${esc(BASE+x.img)}" alt="${esc(x.t)}"><button type="button" class="vx" id="vtX" aria-label="Fechar">✕</button></div>
      <div class="vtx"><small>${esc(x.marca)} · representante FC Consultoria</small><h3>${esc(x.t)}</h3><p>Gostou? Peça o orçamento aqui mesmo: a FC responde pelo site e pelo WhatsApp, em horário comercial.</p>
      <div class="va"><button type="button" class="pri" id="vtO">💬 Pedir orçamento deste produto</button>${x.pdf?`<a href="${esc(BASE+x.pdf)}" target="_blank" rel="noopener">📄 Ver o folder em PDF</a>`:''}<a href="${esc(BASE+x.pag+'/')}">Ver tudo da ${esc(x.marca)} →</a>
      ${L.length>1?`<div class="vn"><button type="button" id="vtP">‹ Anterior</button><button type="button" id="vtN">Próximo ›</button></div>`:''}</div></div></div>`;
    document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)fechar();});document.getElementById('vtX').onclick=fechar;document.getElementById('vtO').onclick=()=>orcar(x);
    const p=document.getElementById('vtP'),n=document.getElementById('vtN');if(p)p.onclick=()=>abrir((k-1+L.length)%L.length);if(n)n.onclick=()=>abrir((k+1)%L.length);
    document.addEventListener('keydown',tecla);}
  async function iniciar(){try{
      const [rc,rj]=await Promise.all([fetch(SB+'/rest/v1/trein_eventos?select=detalhe&tipo=eq.site_vitrine&order=criado_em.desc&limit=1',{headers:{apikey:KEY}}),fetch(BASE+'vitrine.json',{cache:'no-cache'})]);
      if(!rc.ok||!rj.ok)return;const cfg=((await rc.json())[0]||{}).detalhe;if(!cfg||!cfg.on)return;const cat=(await rj.json()).itens||[];
      const ids=Array.isArray(cfg.ids)&&cfg.ids.length?cfg.ids:cat.map(x=>x.id),T=cfg.t||{};
      const OFF=cfg.off||[];cat.filter(x=>x.acao&&!OFF.includes(x.id)&&!ids.includes(x.id)).forEach(x=>ids.push(x.id));L=ids.map(id=>cat.find(x=>x.id===id)).filter(Boolean).map(x=>Object.assign({},x,{t:T[x.id]||x.t}));if(!L.length)return;
      seg=Math.max(3,Math.min(20,+cfg.seg||6));const AC=L.filter(x=>x.acao),FO=L.filter(x=>!x.acao);if(cfg.mist!==false){for(let a=FO.length-1;a>0;a--){const b=Math.floor(Math.random()*(a+1));[FO[a],FO[b]]=[FO[b],FO[a]];}}
      L=[];let ia=0;if(AC.length)L.push(AC[ia++%AC.length]);FO.forEach((x,k)=>{L.push(x);if(AC.length&&(k+1)%5===0)L.push(AC[ia++%AC.length]);});if(!FO.length)L=AC.slice();
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
    }catch(_){}}
  window.FCVT={abrir:k=>abrir(k||0)};
  iniciar();
})();

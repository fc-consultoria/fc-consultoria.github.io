/* Catálogo Virtual FC · vitrine lateral do cliente (destaques e ofertas do próprio cliente)
   FC Consultoria em Esquadria · Sinop-MT · fc-consultoria.github.io */
(function(){
  const nz=s=>String(s).toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[\s\-\/.]/g,'');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SS={g:k=>{try{return sessionStorage.getItem(k)}catch(_){return null}},s:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(_){}}};
  function init(o){
    const C=o.cli||{},V=C.vitrine||{};if(!V.on)return;
    const all=[];(o.ln||[]).forEach(l=>(l.p||[]).forEach(q=>all.push(Object.assign({lid:l.id},q))));
    const itens=(V.it||[]).map(x=>{if(x.k==='p'){const q=all.find(q=>q.c===x.c);if(!q||q.oc)return null;
        return {k:'p',c:q.c,lid:q.lid,t:x.t||q.cd||q.c,x:x.x||q.nd||q.n,img:o.img+(q.d3?q.i:'c'+q.i)+'.webp'};}
      if(x.k==='o'&&(x.t||x.img))return {k:'o',t:x.t||'',x:x.x||'',img:x.img||''};return null;}).filter(Boolean);
    if(!itens.length)return;
    const cor=C.cor||'#17606b',seg=Math.max(4,Math.min(12,+V.seg||6));
    const st=document.createElement('style');st.textContent=`
#cvz{position:fixed;left:16px;top:50%;transform:translateY(-50%);z-index:900;width:var(--cvw,300px);background:#fff;border-radius:16px;box-shadow:0 18px 44px rgba(10,25,35,.28);overflow:hidden;font:400 14px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1b232a;transition:opacity .3s,transform .3s}
#cvz .cvh{background:${cor};color:#fff;display:flex;align-items:center;gap:8px;padding:9px 12px;font:700 12.5px system-ui;letter-spacing:.06em;text-transform:uppercase}
#cvz .cvh span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#cvz .cvh button{all:unset;cursor:pointer;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;font-weight:800}
#cvz .cvi{position:relative;aspect-ratio:4/3;background:#eef2f4;overflow:hidden;cursor:pointer}
#cvz .cvi img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .45s}
#cvz .cvi img.of{object-fit:cover}
#cvz .cvt{padding:10px 12px 12px}#cvz .cvt b{display:block;font-size:16px;line-height:1.25}#cvz .cvt small{display:block;color:#5d6b76;margin:2px 0 9px;min-height:18px}
#cvz .cvg{display:block;width:100%;border:0;border-radius:9px;padding:9px;background:${cor};color:#fff;font:700 14px system-ui;cursor:pointer;text-align:center}
#cvz .cvd{display:flex;gap:4px;justify-content:center;padding:0 0 10px}#cvz .cvd i{width:6px;height:6px;border-radius:50%;background:#d0d8de}#cvz .cvd i.on{background:${cor}}
#cvz .cvo{position:absolute;left:8px;top:8px;background:#e8912d;color:#fff;font:800 11px system-ui;border-radius:99px;padding:2px 8px}
#cvtab{position:fixed;left:10px;bottom:10px;z-index:900;border:0;border-radius:14px;background:${cor};color:#fff;font:700 12.5px/1.2 system-ui;padding:5px 12px 5px 5px;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.3);display:none;align-items:center;gap:8px;max-width:min(240px,62vw);text-align:left}
#cvtab .ti{width:46px;height:46px;flex:none;border-radius:9px;background:#fff center/contain no-repeat;transition:opacity .4s}#cvtab .tt{min-width:0}#cvtab .tt small{display:block;font-weight:500;opacity:.88;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#cvz.inh{position:relative;left:auto;top:auto;transform:none;justify-self:end;align-self:center;width:min(300px,100%);z-index:1;box-shadow:0 14px 34px rgba(0,0,0,.35)}#cvz.inh .cvi{aspect-ratio:16/10}#cvz.inh [data-cv=min]{display:none}
#cvz.min{opacity:0;pointer-events:none;transform:translate(-30px,-50%)}
@media print{#cvz,#cvtab{display:none!important}}`;document.head.appendChild(st);
    const B=document.createElement('div');B.id='cvz';B.innerHTML=`<div class="cvh">📣 <span>Destaques · ${esc(C.nome||'')}</span><button type="button" title="Minimizar" data-cv="min">–</button></div><div class="cvi"><img alt=""></div><div class="cvt"><b></b><small></small><button type="button" class="cvg"></button></div><div class="cvd">${itens.map(()=>'<i></i>').join('')}</div>`;
    const T=document.createElement('button');T.id='cvtab';T.type='button';T.innerHTML='<span class="ti"></span><span class="tt">📣 Destaques<small></small></span>';T.title='Ver os destaques';
    document.body.append(B,T);
    let i=0,pausa=false,min=SS.g('cv_min')==='1';
    const im=B.querySelector('.cvi img'),tt=B.querySelector('.cvt b'),tx=B.querySelector('.cvt small'),go=B.querySelector('.cvg'),dots=[...B.querySelectorAll('.cvd i')];
    function mostra(){const x=itens[i],cvi=B.querySelector('.cvi');im.style.opacity=0;const sb=cvi.querySelector('.cvs');if(sb)sb.remove();
      if(x.img)setTimeout(()=>{im.src=x.img;im.className=x.k==='o'?'of':'';im.style.opacity=1;},180);
      else{const d=document.createElement('div');d.className='cvs';d.style.cssText='position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:18px;color:#fff;font:800 22px/1.2 system-ui;background:linear-gradient(135deg,'+cor+',#1b232a)';d.textContent=x.t;cvi.appendChild(d);}
      B.querySelector('.cvo')&&B.querySelector('.cvo').remove();if(x.k==='o'){const s=document.createElement('span');s.className='cvo';s.textContent='OFERTA';B.querySelector('.cvi').appendChild(s);}
      tt.textContent=x.t;tx.textContent=x.x;const ti=T.querySelector('.ti');ti.style.opacity=0;setTimeout(()=>{ti.style.backgroundImage=x.img?'url("'+x.img+'")':'';ti.style.backgroundColor=x.img?'#fff':cor;ti.style.opacity=1;},180);T.querySelector('.tt small').textContent=x.t;go.textContent=x.k==='p'?'↻ Ver em 3D':'💬 Quero esta oferta';dots.forEach((d,k)=>d.classList.toggle('on',k===i));}
    function abre(){const x=itens[i];const mm=document.getElementById('cvm');if(mm)mm.click();o.hit&&o.hit('vitrine_cli',(x.k==='p'?'p:':'o:')+(x.c||x.t).slice(0,40));
      if(x.k==='o'){location.href=o.zap('Olá! Vi no catálogo a oferta "'+x.t+'" e quero saber mais.');return;}
      const tb=document.querySelector('#tabs [data-l="'+x.lid+'"]');if(tb&&tb.getAttribute('aria-pressed')!=='true')tb.click();
      setTimeout(()=>{const a=document.getElementById('p-'+nz(x.c));if(a){a.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>a.click(),450);}},120);}
    go.onclick=abre;B.querySelector('.cvi').onclick=abre;
    B.addEventListener('mouseenter',()=>pausa=true);B.addEventListener('mouseleave',()=>pausa=false);
    setInterval(()=>{if(pausa||itens.length<2)return;i=(i+1)%itens.length;mostra();},seg*1000);
    const lugar=()=>{const w=document.querySelector('main .w')||document.querySelector('.w');const esq=w?w.getBoundingClientRect().left:0;const larg=Math.min(320,esq-32);
      const cabe=innerWidth>=1300&&larg>=200;const hw=document.querySelector('.hero .w');
      if(!cabe&&hw){if(B.parentNode!==hw)hw.appendChild(B);B.classList.add('inh');B.classList.remove('min');B.style.display='';T.style.display='none';return;}
      if(B.classList.contains('inh')){B.classList.remove('inh');document.body.appendChild(B);if(min)B.classList.add('min');}
      B.style.setProperty('--cvw',larg+'px');
      B.style.display=cabe?'':'none';T.style.display=cabe?(min?'flex':'none'):'flex';};
    B.querySelector('[data-cv=min]').onclick=()=>{const mm=document.getElementById('cvm');if(mm){mm.click();return;}min=true;SS.s('cv_min','1');B.classList.add('min');lugar();};
    T.onclick=()=>{if(innerWidth>=1300&&B.style.display!=='none'){min=false;SS.s('cv_min','0');B.classList.remove('min');lugar();return;}
      /* tela pequena: abre como janela */
      let m=document.getElementById('cvm');if(m){m.remove();return;}m=document.createElement('div');m.id='cvm';m.style.cssText='position:fixed;inset:0;z-index:9990;background:rgba(8,16,22,.6);display:grid;place-items:center;padding:16px';
      B.classList.remove('min');B.style.display='';B.style.position='static';B.style.transform='none';B.style.setProperty('--cvw','min(340px,92vw)');m.appendChild(B);document.body.appendChild(m);
      m.onclick=e=>{if(e.target===m){m.remove();B.style.position='';B.style.transform='';document.body.appendChild(B);lugar();}};};
    if(min)B.classList.add('min');addEventListener('resize',lugar);lugar();mostra();
  }
  window.CVIT={init};
})();

/* Páginas de apresentação do catálogo: capa (foto da empresa), quem somos (missão/valores/objetivo) e contato.
   Dados em cat_clientes.apres · editados no painel do gestor. */
(function(){
  const esc=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const br=t=>esc(t).replace(/\n/g,'<br>');
  const css=`
  .ap-capa{position:relative;color:#fff;min-height:min(78vh,620px);display:flex;align-items:flex-end;background:#0e1b22 center/cover no-repeat;overflow:hidden}
  .ap-capa:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,16,21,.15) 0,rgba(8,16,21,.55) 55%,rgba(8,16,21,.88) 100%)}
  .ap-capa .ap-band{position:absolute;left:0;top:0;bottom:0;width:10px;background:var(--cc,#17606b)}
  .ap-capa .w{position:relative;width:100%;padding-top:60px;padding-bottom:44px}
  .ap-logo{display:inline-grid;place-items:center;width:64px;height:64px;border-radius:14px;background:var(--cc,#17606b);font:800 28px var(--f-d);box-shadow:0 6px 18px rgba(0,0,0,.35);overflow:hidden}
  .ap-logo img{width:100%;height:100%;object-fit:contain;background:#fff}
  .ap-capa small{display:block;margin-top:16px;font:600 13px var(--f-b);letter-spacing:.2em;text-transform:uppercase;color:#ffd58a}
  .ap-capa h1{margin:6px 0 8px;font:800 clamp(40px,7vw,84px)/.95 var(--f-d);text-transform:uppercase;letter-spacing:.01em}
  .ap-capa p{margin:0;font-size:clamp(16px,2vw,21px);max-width:720px;color:#e7eff2}
  .ap-capa .ap-ct{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
  .ap-capa .ap-ct a{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);color:#fff;text-decoration:none;border-radius:10px;padding:10px 15px;font-weight:700;min-height:44px}
  .ap-capa .ap-ct a.or{background:var(--or,#f2a024);border-color:var(--or,#f2a024);color:#1d1400}
  .ap-sobre{background:#fff;border-bottom:1px solid var(--ln,#dfe5e8);padding:46px 0}
  .ap-sobre .eb2{font:700 13px var(--f-b);letter-spacing:.18em;text-transform:uppercase;color:var(--cc,#17606b)}
  .ap-sobre h2{font:800 clamp(30px,4vw,44px)/1 var(--f-d);margin:6px 0 12px;text-transform:uppercase}
  .ap-sobre .ap-txt{font-size:17.5px;max-width:860px;color:#33424b;margin:0 0 24px}
  .ap-mvo{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
  .ap-mvo div{border:1px solid var(--ln,#dfe5e8);border-radius:14px;padding:18px 18px 16px;background:#f8fafb;border-top:5px solid var(--cc,#17606b)}
  .ap-mvo b{display:flex;align-items:center;gap:8px;font:800 22px var(--f-d);text-transform:uppercase;color:var(--cc,#17606b)}
  .ap-mvo p{margin:8px 0 0;font-size:15.5px;color:#33424b}
  .ap-cont{background:var(--cc,#17606b);color:#fff;padding:40px 0;margin-top:40px}
  .ap-cont h2{font:800 clamp(28px,4vw,40px)/1 var(--f-d);margin:0 0 6px;text-transform:uppercase}
  .ap-cont .ap-sub{color:rgba(255,255,255,.82);margin:0 0 18px}
  .ap-cg{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}
  .ap-cg a,.ap-cg span{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:12px 14px;color:#fff;text-decoration:none;min-height:56px;word-break:break-word}
  .ap-cg i{font-style:normal;font-size:22px;width:28px;text-align:center}.ap-cg small{display:block;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.75}.ap-cg b{font-weight:700}
  .ap-cont+footer{margin-top:0}
  @media print{
   .ap-capa{min-height:0;height:248mm;break-after:page;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
   .ap-capa h1{font-size:64px}.ap-capa .ap-ct a{background:rgba(255,255,255,.14)!important}
   .ap-sobre{break-after:page;padding:20mm 0 0;border:0}.ap-mvo div,.ap-mvo{-webkit-print-color-adjust:exact;print-color-adjust:exact}
   .ap-cont{break-before:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}
   body.printing .hero{display:none}
  }`;
  function link(u){u=String(u||'').trim();if(!u)return '';return /^https?:\/\//i.test(u)?u:'https://'+u;}
  function rede(u,base){u=String(u||'').trim();if(!u)return '';if(/^https?:\/\//i.test(u))return u;if(/\./.test(u)&&/\//.test(u))return 'https://'+u;return base+u.replace(/^@/,'');}
  const arroba=u=>{u=String(u||'').trim();const m=u.match(/(?:instagram|facebook)\.com\/([^\/?#]+)/i);return m?'@'+m[1]:u.startsWith('@')?u:(/\./.test(u)?u:'@'+u);};
  window.CAPRES={init(o){const C=o.cli,A=(C&&C.apres)||{};if(!A.on)return;
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    const nome=C.nome||'',zap=C.zap?o.zap('Olá! Vi o catálogo de perfis e quero falar com vocês.'):'';
    const hero=document.querySelector('.hero');
    /* capa */
    const cp=document.createElement('section');cp.className='ap-capa';cp.id='apCapa';
    if(A.capa)cp.style.backgroundImage=`url("${A.capa.replace(/"/g,'%22')}")`;
    cp.innerHTML=`<span class="ap-band"></span><div class="w"><span class="ap-logo">${A.logo?`<img src="${esc(A.logo)}" alt="">`:esc(C.sigla||nome.slice(0,2).toUpperCase())}</span>
      <small>Catálogo de perfis de alumínio${C.cidade?' · '+esc(C.cidade):''}</small><h1>${esc(nome)}</h1>${A.frase?`<p>${br(A.frase)}</p>`:''}
      <div class="ap-ct noprint"><a href="#lst" class="or">📚 Ver os perfis</a>${zap?`<a href="${esc(zap)}" target="_blank" rel="noopener">💬 WhatsApp</a>`:''}${(A.missao||A.valores||A.objetivo||A.sobre)?'<a href="#apSobre">Quem somos</a>':''}${A.on?'<a href="#apCont">Contato</a>':''}</div></div>`;
    hero.parentNode.insertBefore(cp,hero);
    /* quem somos */
    const mvo=[['🎯','Missão',A.missao],['🤝','Valores',A.valores],['🚀','Objetivo',A.objetivo]].filter(x=>String(x[2]||'').trim());
    if(mvo.length||String(A.sobre||'').trim()){const s=document.createElement('section');s.className='ap-sobre';s.id='apSobre';
      s.innerHTML=`<div class="w"><span class="eb2">Quem somos</span><h2>${esc(nome)}</h2>${A.sobre?`<p class="ap-txt">${br(A.sobre)}</p>`:''}
       ${mvo.length?`<div class="ap-mvo">${mvo.map(([i,t,v])=>`<div><b>${i} ${t}</b><p>${br(v)}</p></div>`).join('')}</div>`:''}</div>`;
      hero.parentNode.insertBefore(s,hero);}
    /* contato */
    const it=[];
    if(C.zap)it.push(['💬','WhatsApp',C.zap,zap]);
    if(A.fone)it.push(['📞','Telefone',A.fone,'tel:'+String(A.fone).replace(/[^\d+]/g,'')]);
    if(A.email)it.push(['✉️','E-mail',A.email,'mailto:'+A.email]);
    if(A.site)it.push(['🌐','Site',String(A.site).replace(/^https?:\/\//i,''),link(A.site)]);
    if(A.insta)it.push(['📸','Instagram',arroba(A.insta),rede(A.insta,'https://instagram.com/')]);
    if(A.face)it.push(['👍','Facebook',arroba(A.face),rede(A.face,'https://facebook.com/')]);
    if(A.ender)it.push(['📍','Endereço',A.ender,'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(A.ender)]);
    if(A.horario)it.push(['🕘','Atendimento',A.horario,'']);
    if(it.length){const c=document.createElement('section');c.className='ap-cont';c.id='apCont';
      c.innerHTML=`<div class="w"><h2>Fale com a ${esc(nome)}</h2><p class="ap-sub">Orçamentos, prazos e disponibilidade de cores com a nossa equipe.</p>
       <div class="ap-cg">${it.map(([i,t,v,h])=>h?`<a href="${esc(h)}" target="_blank" rel="noopener"><i>${i}</i><span style="all:unset"><small>${t}</small><b>${esc(v)}</b></span></a>`:`<span><i>${i}</i><span style="all:unset"><small>${t}</small><b>${esc(v)}</b></span></span>`).join('')}</div></div>`;
      const f=document.querySelector('footer');f.parentNode.insertBefore(c,f);}
  }};
})();

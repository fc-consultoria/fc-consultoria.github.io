/* Modo loja de cotação (sem preço): o cliente monta a lista de perfis (cor + barras) e envia o pedido de cotação pelo WhatsApp da loja.
   Liga com ?loja=1 (demonstração) ou cat_clientes.vitrine.loja = true (painel do gestor). */
(function(){
  const esc=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const CORN={branco:'Branco',preto:'Preto fosco',bronze:'Bronze',natural:'Natural',champanhe:'Champanhe',amadeirado:'Amadeirado'};
  const CORH={branco:'#f4f5f6',preto:'#2f3236',bronze:'#5a4632',natural:'#b9bec3',champanhe:'#cbb28a',amadeirado:'#8a5a36'};
  let O=null,K='',CART=[],EU={};
  const ls={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(_){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}};
  const css=`
  .lj-add{margin-top:8px;align-self:stretch;border:0;background:var(--cc,#17606b);color:#fff;border-radius:9px;padding:8px 10px;font:700 14px var(--f-b);cursor:pointer;min-height:40px}
  .lj-add:hover{filter:brightness(1.08)}.lj-add.on{background:#fff;color:var(--cc,#17606b);box-shadow:inset 0 0 0 2px var(--cc,#17606b)}
  #ljFab{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:40;border:0;background:var(--cc,#17606b);color:#fff;border-radius:14px;padding:12px 16px;font:700 16px var(--f-b);box-shadow:0 10px 26px rgba(0,0,0,.28);cursor:pointer;display:flex;gap:10px;align-items:center}
  #ljFab i{font-style:normal;background:#fff;color:var(--cc,#17606b);border-radius:99px;min-width:26px;padding:1px 7px;text-align:center}
  .lj-bar{background:#fff7ec;border-bottom:1px solid #f2c98a;color:#5c3d00;font:500 14.5px var(--f-b)}
  .lj-bar .w{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding-block:9px}
  .lj-ov{position:fixed;inset:0;z-index:70;background:rgba(8,16,21,.6);display:flex;justify-content:flex-end}
  .lj-ov.c{justify-content:center;align-items:center;padding:16px}
  .lj-pn{background:#fff;color:#17222a;width:min(520px,100%);height:100%;overflow:auto;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px}
  .lj-md{background:#fff;color:#17222a;width:min(440px,100%);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:12px;max-height:100%;overflow:auto}
  .lj-h{display:flex;align-items:center;gap:10px}.lj-h b{font:800 26px/1 var(--f-d);text-transform:uppercase;flex:1}
  .lj-x{border:1px solid #dfe5e8;background:#fff;border-radius:9px;padding:6px 11px;font-weight:700;cursor:pointer}
  .lj-sub{color:#55636c;font-size:14px;margin:0}
  .lj-cores{display:flex;gap:6px;flex-wrap:wrap}
  .lj-cores button{border:1.5px solid #dfe5e8;background:#fff;border-radius:9px;padding:7px 11px;font:600 14px var(--f-b);display:flex;gap:7px;align-items:center;cursor:pointer}
  .lj-cores button[aria-pressed=true]{border-color:var(--cc,#17606b);box-shadow:0 0 0 2px rgba(23,96,107,.18)}
  .lj-cores i{width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 1px #c9d3d8;display:inline-block}
  .lj-q{display:flex;align-items:center;border:1.5px solid #dfe5e8;border-radius:9px;overflow:hidden;width:max-content}
  .lj-q button{border:0;background:#f3f6f7;width:40px;height:42px;font-size:20px;cursor:pointer}.lj-q input{width:70px;border:0;text-align:center;font:700 18px var(--f-b)}
  .lj-go{border:0;background:var(--cc,#17606b);color:#fff;border-radius:11px;padding:13px 16px;font:700 16px var(--f-b);cursor:pointer}
  .lj-zap{background:#1f9d55}
  .lj-it{display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;border-bottom:1px solid #eef1f3;padding:8px 0}
  .lj-it img{width:64px;height:48px;object-fit:contain;background:#fff}
  .lj-it b{font:800 18px var(--f-d);color:var(--cc,#17606b);display:block}.lj-it small{color:#55636c;font-size:13px;display:block}
  .lj-it .lj-q button{width:30px;height:32px;font-size:16px}.lj-it .lj-q input{width:46px;font-size:15px}
  .lj-rm{border:0;background:none;color:#a33;font-size:13px;cursor:pointer;padding:2px 0;text-align:left}
  .lj-f{display:flex;flex-direction:column;gap:9px}.lj-f label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600;color:#55636c}
  .lj-f input,.lj-f textarea{border:1.5px solid #dfe5e8;border-radius:9px;padding:9px 11px;font:500 15px var(--f-b);color:#17222a}
  .lj-msg{background:#f3f6f7;border-radius:10px;padding:10px 12px;font:500 13px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap}
  .lj-vz{color:#55636c;text-align:center;padding:30px 10px}
  .lj-tt{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));background:#17222a;color:#fff;padding:10px 16px;border-radius:10px;font-weight:600;z-index:80}
  @media print{.lj-add,#ljFab,.lj-bar{display:none!important}}`;
  function tt(t){let e=document.querySelector('.lj-tt');if(!e){e=document.createElement('div');e.className='lj-tt';document.body.appendChild(e);}e.textContent=t;e.hidden=false;clearTimeout(tt.t);tt.t=setTimeout(()=>e.hidden=true,2400);}
  const salva=()=>{ls.set(K,CART);fab();marca();};
  function fab(){let b=document.getElementById('ljFab');if(!b){b=document.createElement('button');b.id='ljFab';b.type='button';b.onclick=carrinho;document.body.appendChild(b);}
    const n=CART.reduce((s,i)=>s+i.q,0);b.innerHTML=`🧾 Minha cotação <i>${CART.length}</i>`;b.title=n+' barras';}
  function info(cd){const im=cd.querySelector('img.d2')||cd.querySelector('img');const cs=[...cd.querySelectorAll('.ccor i')].map(i=>Object.keys(CORN).find(k=>CORN[k]===i.title)).filter(Boolean);
    return {c:cd.dataset.c,cd:(cd.querySelector('b')||{}).textContent||cd.dataset.c,n:(cd.querySelector('span')||{}).textContent||cd.dataset.n||'',img:im?im.getAttribute('src'):'',cores:cs.length?cs:['branco','preto','natural'],sc:!!cd.querySelector('.scb')};}
  function marca(){document.querySelectorAll('#lst .cd[data-c]').forEach(cd=>{let b=cd.querySelector('.lj-add');if(!b){b=document.createElement('button');b.type='button';b.className='lj-add nov3';b.dataset.ljadd='1';cd.appendChild(b);}
    const n=CART.filter(i=>i.c===cd.dataset.c).reduce((s,i)=>s+i.q,0);b.classList.toggle('on',n>0);b.textContent=n?`✓ ${n} barras na cotação · alterar`:'＋ Adicionar à cotação';});}
  function escolher(cd){const p=info(cd);let cor=p.cores[0],q=10;
    const ov=document.createElement('div');ov.className='lj-ov c';
    const pinta=()=>{ov.innerHTML=`<div class="lj-md" role="dialog" aria-label="Adicionar à cotação"><div class="lj-h"><b>${esc(p.cd)}</b><button type="button" class="lj-x" data-x>✕</button></div>
      ${p.img?`<img src="${esc(p.img)}" alt="" style="height:90px;object-fit:contain;background:#fff">`:''}<p class="lj-sub">${esc(p.n)}</p>
      ${p.sc?'<p class="lj-sub" style="background:#fff7ec;color:#7a4a08;border-radius:9px;padding:8px 10px">Sob consulta: perfil fora do estoque de pronta entrega. A loja confirma o prazo.</p>':''}
      <div><b style="font-size:12.5px;letter-spacing:.1em;color:#55636c">COR</b><div class="lj-cores" style="margin-top:6px">${p.cores.map(k=>`<button type="button" data-cor="${k}" aria-pressed="${k===cor}"><i style="background:${CORH[k]}"></i>${CORN[k]}</button>`).join('')}</div></div>
      <div><b style="font-size:12.5px;letter-spacing:.1em;color:#55636c">BARRAS DE 6 M</b><div class="lj-q" style="margin-top:6px"><button type="button" data-d="-1">−</button><input id="ljQ" inputmode="numeric" value="${q}" aria-label="Quantidade de barras"><button type="button" data-d="1">+</button></div></div>
      <button type="button" class="lj-go" data-ok>＋ Adicionar à cotação</button><p class="lj-sub" style="text-align:center">Sem preço aqui: a loja responde a cotação com valores e prazo.</p></div>`;};
    pinta();document.body.appendChild(ov);
    ov.addEventListener('click',e=>{const t=e.target;if(t===ov||t.closest('[data-x]')){ov.remove();return;}
      const c=t.closest('[data-cor]');if(c){q=+ov.querySelector('#ljQ').value||q;cor=c.dataset.cor;pinta();return;}
      const d=t.closest('[data-d]');if(d){const i=ov.querySelector('#ljQ');i.value=Math.max(1,(+i.value||0)+(+d.dataset.d));return;}
      if(t.closest('[data-ok]')){q=Math.max(1,parseInt(ov.querySelector('#ljQ').value)||1);const ex=CART.find(i=>i.c===p.c&&i.cor===cor);if(ex)ex.q=q;else CART.push({c:p.c,cd:p.cd,n:p.n,img:p.img,cor,q});salva();ov.remove();tt(`${p.cd} · ${CORN[cor]} · ${q} barras na cotação`);O.hit&&O.hit('loja_add',p.c);}});}
  function texto(){const c=O.cli;return `Olá, ${c.nome}! Quero uma cotação de perfis:\n`+CART.map((i,k)=>`${k+1}. ${i.cd} · ${i.n} · ${CORN[i.cor]} · ${i.q} barras de 6 m`).join('\n')+
    `\n\nNome: ${EU.nome||''}\nEmpresa: ${EU.emp||''}\nCidade: ${EU.cid||''}${EU.obs?'\nObs.: '+EU.obs:''}\n\n(pedido montado no catálogo virtual)`;}
  function carrinho(){const ov=document.createElement('div');ov.className='lj-ov';
    const pinta=()=>{const n=CART.reduce((s,i)=>s+i.q,0);
      ov.innerHTML=`<div class="lj-pn" role="dialog" aria-label="Minha cotação"><div class="lj-h"><b>Minha cotação</b><button type="button" class="lj-x" data-x>✕ Fechar</button></div>
      <p class="lj-sub">${CART.length} ${CART.length===1?'perfil':'perfis'} · ${n} barras de 6 m. Sem preço: a ${esc(O.cli.nome)} responde com valores e prazo.</p>
      <div>${CART.length?CART.map((i,k)=>`<div class="lj-it">${i.img?`<img src="${esc(i.img)}" alt="">`:'<span></span>'}<div><b>${esc(i.cd)}</b><small>${esc(i.n)}</small><small><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${CORH[i.cor]};box-shadow:0 0 0 1px #c9d3d8"></i> ${CORN[i.cor]}</small><button type="button" class="lj-rm" data-rm="${k}">Tirar</button></div>
        <div class="lj-q"><button type="button" data-k="${k}" data-d="-1">−</button><input data-qi="${k}" inputmode="numeric" value="${i.q}" aria-label="Barras"><button type="button" data-k="${k}" data-d="1">+</button></div></div>`).join(''):'<p class="lj-vz">A cotação está vazia.<br>Clique em <b>＋ Adicionar à cotação</b> nos perfis.</p>'}</div>
      ${CART.length?`<form class="lj-f" id="ljF"><b style="font:800 20px var(--f-d);text-transform:uppercase">Seus dados</b>
        <label>Nome<input name="nome" value="${esc(EU.nome||'')}" required></label><label>Empresa<input name="emp" value="${esc(EU.emp||'')}"></label><label>Cidade<input name="cid" value="${esc(EU.cid||'')}"></label>
        <label>Observação<textarea name="obs" rows="2" placeholder="Ex.: entrega na obra, prazo">${esc(EU.obs||'')}</textarea></label>
        <b style="font-size:12.5px;letter-spacing:.1em;color:#55636c">MENSAGEM QUE A LOJA RECEBE</b><div class="lj-msg" id="ljM">${esc(texto())}</div>
        <button class="lj-go lj-zap">💬 Enviar cotação pelo WhatsApp</button><button type="button" class="lj-x" data-limpa>Limpar a cotação</button></form>`:''}</div>`;};
    pinta();document.body.appendChild(ov);
    ov.addEventListener('click',e=>{const t=e.target;if(t===ov||t.closest('[data-x]')){ov.remove();return;}
      const r=t.closest('[data-rm]');if(r){CART.splice(+r.dataset.rm,1);salva();pinta();return;}
      const d=t.closest('[data-d][data-k]');if(d){const i=CART[+d.dataset.k];i.q=Math.max(1,i.q+(+d.dataset.d));salva();pinta();return;}
      if(t.closest('[data-limpa]')){CART=[];salva();pinta();}});
    ov.addEventListener('input',e=>{const t=e.target;if(t.dataset.qi!=null){CART[+t.dataset.qi].q=Math.max(1,parseInt(t.value)||1);ls.set(K,CART);fab();marca();}
      else if(t.form&&t.form.id==='ljF'){EU[t.name]=t.value;ls.set('fc_loja_eu',EU);}const m=ov.querySelector('#ljM');if(m)m.textContent=texto();});
    ov.addEventListener('submit',e=>{e.preventDefault();if(!CART.length)return;O.hit&&O.hit('loja_enviar',String(CART.length));window.open(O.zap(texto()),'_blank','noopener');});}
  window.CLOJA={init(o){const C=o.cli||{},q=new URLSearchParams(location.search);if(!(q.get('loja')==='1'||(C.vitrine&&C.vitrine.loja)))return;
    O=o;K='fc_loja_'+(C.id||'x');CART=ls.get(K,[]);EU=ls.get('fc_loja_eu',{});
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    const bar=document.createElement('div');bar.className='lj-bar noprint';bar.innerHTML=`<div class="w">🧾 <span><b>Monte sua cotação:</b> escolha os perfis, a cor e a quantidade de barras e envie para a ${esc(C.nome)}. Os preços vêm na resposta.</span></div>`;
    const h=document.querySelector('.tools');if(h)h.parentNode.insertBefore(bar,h);
    document.addEventListener('click',e=>{const b=e.target.closest('[data-ljadd]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();escolher(b.closest('.cd'));},true);
    new MutationObserver(()=>marca()).observe(document.getElementById('lst'),{childList:true});
    fab();marca();}};
})();

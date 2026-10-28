/* Área do cliente no catálogo (sem preço): cadastro com senha, carrinho de cotação e conversa com o vendedor da rota (com anexos).
   Liga com ?loja=1 ou cat_clientes.vitrine.loja = true. Dados: RPCs loja_* (Supabase). */
(function(){
  const esc=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const CORN={branco:'Branco',preto:'Preto fosco',bronze:'Bronze',natural:'Natural',champanhe:'Champanhe',amadeirado:'Amadeirado',fosco:'Fosco',brilhante:'Brilhante',cromado:'Cromado',inox:'Inox',zincado:'Zincado'};
  const CORH={branco:'#f4f5f6',preto:'#2f3236',bronze:'#5a4632',natural:'#b9bec3',champanhe:'#cbb28a',amadeirado:'#8a5a36',fosco:'#aeb4b9',brilhante:'#e6e9ec',cromado:'#d5dade',inox:'#c3c8cc',zincado:'#9ea7ad'};
  let O=null,K='',CART=[],TOK='',EU=null,CHAT=null,POLL=null,BG=null;
  const ls={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(_){return d;}},set(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v));}catch(_){}}};
  async function rpc(fn,args){const r=await fetch(O.sbu+'rpc/'+fn,{method:'POST',headers:{apikey:O.sbk,'Content-Type':'application/json'},body:JSON.stringify(args||{})});
    const t=await r.text();if(!r.ok){let m=t;try{m=JSON.parse(t).message||t;}catch(_){}throw new Error(m);}return t?JSON.parse(t):null;}
  const hora=d=>{const x=new Date(d),h=new Date();return x.toDateString()===h.toDateString()?x.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):x.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+' '+x.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});};
  const css=`
  .lj-add{margin-top:8px;align-self:stretch;border:0;background:var(--cc,#17606b);color:#fff;border-radius:9px;padding:8px 10px;font:700 14px var(--f-b);cursor:pointer;min-height:40px}
  .lj-add:hover{filter:brightness(1.08)}.lj-add.on{background:#fff;color:var(--cc,#17606b);box-shadow:inset 0 0 0 2px var(--cc,#17606b)}
  .lj-fabs{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:40;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
  .lj-fab{border:0;background:var(--cc,#17606b);color:#fff;border-radius:14px;padding:12px 16px;font:700 16px var(--f-b);box-shadow:0 10px 26px rgba(0,0,0,.28);cursor:pointer;display:flex;gap:10px;align-items:center}
  .lj-fab.alt{background:#17222a}
  .lj-fab i{font-style:normal;background:#fff;color:var(--cc,#17606b);border-radius:99px;min-width:26px;padding:1px 7px;text-align:center}.lj-fab i.rd{background:#dc2626;color:#fff}
  .lj-bar{background:#fff7ec;border-bottom:1px solid #f2c98a;color:#5c3d00;font:500 14.5px var(--f-b)}
  .lj-bar .w{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding-block:9px}
  .lj-bar button{border:1px solid #c9a46a;background:#fff;color:#5c3d00;border-radius:9px;padding:5px 11px;font:700 14px var(--f-b);cursor:pointer}
  .lj-ov{position:fixed;inset:0;z-index:70;background:rgba(8,16,21,.6);display:flex;justify-content:flex-end}
  .lj-ov.c{justify-content:center;align-items:center;padding:max(12px,env(safe-area-inset-top,0px)) 12px max(12px,env(safe-area-inset-bottom,0px))}
  .lj-pn{background:#fff;color:#17222a;width:min(520px,100%);height:100%;overflow:auto;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px}
  .lj-md{background:#fff;color:#17222a;width:min(460px,100%);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:12px;max-height:100%;overflow:auto}
  .lj-h{display:flex;align-items:center;gap:10px}.lj-h b{font:800 26px/1 var(--f-d);text-transform:uppercase;flex:1}
  .lj-x{border:1px solid #dfe5e8;background:#fff;color:#17222a;border-radius:9px;padding:6px 11px;font:700 14px var(--f-b);cursor:pointer}
  .lj-sub{color:#55636c;font-size:14px;margin:0}
  .lj-err{background:#fdecec;color:#9b1c1c;border-radius:9px;padding:8px 10px;font-size:14px}
  .lj-okm{background:#e6f5ec;color:#1f6b3f;border-radius:9px;padding:10px 12px;font-size:14.5px}
  .lj-tabs{display:flex;gap:4px;background:#f3f6f7;border-radius:10px;padding:4px}.lj-tabs button{flex:1;border:0;background:none;border-radius:8px;padding:8px;font:700 14.5px var(--f-b);cursor:pointer;color:#17222a}
  .lj-tabs button[aria-pressed=true]{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)}
  .lj-cores{display:flex;gap:6px;flex-wrap:wrap}
  .lj-cores button{border:1.5px solid #dfe5e8;background:#fff;color:#17222a;border-radius:9px;padding:7px 11px;font:600 14px var(--f-b);display:flex;gap:7px;align-items:center;cursor:pointer}
  .lj-cores button[aria-pressed=true]{border-color:var(--cc,#17606b);box-shadow:0 0 0 2px rgba(23,96,107,.18)}
  .lj-dot{width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 1px #c9d3d8;display:inline-block;flex:none}
  .lj-q{display:flex;align-items:center;border:1.5px solid #dfe5e8;border-radius:9px;overflow:hidden;width:max-content}
  .lj-q button{border:0;background:#f3f6f7;color:#17222a;width:40px;height:42px;font-size:20px;cursor:pointer}.lj-q input{width:70px;border:0;text-align:center;font:700 18px var(--f-b);color:#17222a;background:#fff}
  .lj-go{border:0;background:var(--cc,#17606b);color:#fff;border-radius:11px;padding:13px 16px;font:700 16px var(--f-b);cursor:pointer}.lj-go:disabled{opacity:.55;cursor:wait}
  .lj-it{display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;border-bottom:1px solid #eef1f3;padding:8px 0}
  .lj-it img{width:64px;height:48px;object-fit:contain;background:#fff}
  .lj-it b{font:800 18px var(--f-d);color:var(--cc,#17606b);display:block}.lj-it small{color:#55636c;font-size:13px;display:block}
  .lj-it .lj-q button{width:30px;height:32px;font-size:16px}.lj-it .lj-q input{width:46px;font-size:15px}
  .lj-rm{border:0;background:none;color:#a33;font-size:13px;cursor:pointer;padding:2px 0;text-align:left}
  .lj-f{display:flex;flex-direction:column;gap:9px}.lj-f label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600;color:#55636c}
  .lj-f input,.lj-f textarea{border:1.5px solid #dfe5e8;border-radius:9px;padding:10px 11px;font:500 15px var(--f-b);color:#17222a;background:#fff}
  .lj-2{display:grid;grid-template-columns:1fr 1fr;gap:9px}@media(max-width:520px){.lj-2{grid-template-columns:1fr}}
  .lj-vd{display:flex;gap:12px;align-items:center;background:#eef6f2;border-radius:12px;padding:10px 12px}
  .lj-av{width:44px;height:44px;border-radius:50%;background:var(--cc,#17606b);color:#fff;display:grid;place-items:center;font:800 19px var(--f-d);flex:none}
  .lj-vd b{display:block;font-size:15.5px}.lj-vd small{color:#55636c;font-size:13px}
  .lj-vz{color:#55636c;text-align:center;padding:30px 10px}
  /* conversa */
  .lj-chat{background:#fff;color:#17222a;width:min(1120px,100%);height:min(88vh,860px);border-radius:18px;overflow:hidden;display:grid;grid-template-columns:300px 1fr;box-shadow:0 30px 80px rgba(0,0,0,.35)}
  @media(max-width:820px){.lj-chat{grid-template-columns:1fr;height:100%;border-radius:14px}.lj-cs{display:none}.lj-chat.sb .lj-cs{display:flex}.lj-chat.sb .lj-cv{display:none}}
  .lj-cs{border-right:1px solid #e3e9ec;padding:14px;overflow:auto;display:flex;flex-direction:column;gap:12px;background:#fafcfb}
  .lj-cs h4{margin:0;font:800 16px var(--f-d);text-transform:uppercase;letter-spacing:.06em;color:#55636c}
  .lj-li{display:flex;justify-content:space-between;gap:8px;font-size:14px;padding:5px 0;border-bottom:1px dashed #dfe5e8}
  .lj-at{display:block;width:100%;text-align:left;border:1px solid #dfe5e8;background:#fff;color:#17222a;border-radius:10px;padding:8px 10px;cursor:pointer;font:500 14px var(--f-b)}
  .lj-at[aria-current=true]{border-color:var(--cc,#17606b);box-shadow:0 0 0 2px rgba(23,96,107,.15)}.lj-at b{display:flex;justify-content:space-between}
  .lj-bd{background:#dc2626;color:#fff;border-radius:99px;padding:0 7px;font-size:12px}
  .lj-cv{display:flex;flex-direction:column;min-width:0;min-height:0}
  .lj-cvh{display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid #e3e9ec}
  .lj-cvh .lj-x{margin-left:auto}.lj-cvh .lj-vol{display:none}@media(max-width:820px){.lj-cvh .lj-vol{display:inline-block}}
  .lj-ms{flex:1;overflow:auto;background:#eef3f0;padding:18px;display:flex;flex-direction:column;gap:10px}
  .lj-m{max-width:74%;border-radius:12px;padding:9px 12px;font-size:15.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;box-shadow:0 1px 1px rgba(0,0,0,.06)}
  .lj-m small{display:block;font-size:11.5px;color:#6b7b86;margin-top:4px;text-align:right;white-space:normal}
  .lj-m.cli{align-self:flex-end;background:#dcf3e3}.lj-m.vend{align-self:flex-start;background:#fff}
  .lj-m.sys{align-self:center;background:#fff4df;color:#7a4a08;font-size:13px;max-width:92%}
  .lj-m .nm{display:block;font-size:12.5px;font-weight:700;color:var(--cc,#17606b);margin-bottom:2px}
  .lj-ax{display:flex;gap:10px;align-items:center;background:#fff;border:1px solid #dfe5e8;border-radius:10px;padding:7px 9px;margin-top:6px;cursor:pointer;white-space:normal;color:#17222a;font:inherit;text-align:left}
  .lj-ax img{width:120px;max-height:120px;object-fit:cover;border-radius:6px}.lj-ax i{font-style:normal;font-size:26px}
  .lj-cp{display:flex;gap:8px;align-items:flex-end;padding:10px 12px;border-top:1px solid #e3e9ec;flex-wrap:wrap}
  .lj-cp textarea{flex:1;min-width:180px;resize:none;border:1.5px solid #dfe5e8;border-radius:10px;padding:10px;font:500 15.5px var(--f-b);color:#17222a;background:#fff;max-height:140px}
  .lj-clip{border:1.5px solid #dfe5e8;background:#fff;color:#17222a;border-radius:10px;padding:11px 12px;font:700 14.5px var(--f-b);cursor:pointer}
  .lj-zp{font-size:13px;color:#55636c;padding:0 14px 10px}
  .lj-prev{display:flex;gap:8px;align-items:center;background:#f3f6f7;border-radius:9px;padding:6px 9px;font-size:13.5px;width:100%}
  .lj-lb{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.85);display:grid;place-items:center;padding:16px;cursor:zoom-out}.lj-lb img{max-width:100%;max-height:100%;border-radius:8px}
  .lj-tt{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));background:#17222a;color:#fff;padding:10px 16px;border-radius:10px;font-weight:600;z-index:95;max-width:90vw}
  @media print{.lj-add,.lj-fabs,.lj-bar{display:none!important}}`;
  function tt(t){let e=document.querySelector('.lj-tt');if(!e){e=document.createElement('div');e.className='lj-tt';document.body.appendChild(e);}e.textContent=t;e.hidden=false;clearTimeout(tt.t);tt.t=setTimeout(()=>e.hidden=true,2800);}
  const salva=()=>{ls.set(K,CART);fabs();marca();};
  const ini=n=>String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const vendTxt=()=>EU&&EU.vend?EU.vend.nome:'a equipe de vendas';
  /* ---------- botões flutuantes ---------- */
  function fabs(){let w=document.querySelector('.lj-fabs');if(!w){w=document.createElement('div');w.className='lj-fabs';document.body.appendChild(w);}
    const nl=EU&&EU.nao_lidas?`<i class="rd">${EU.nao_lidas}</i>`:'';
    w.innerHTML=`${EU?`<button type="button" class="lj-fab alt" data-lj="chat">💬 Minhas conversas ${nl}</button>`:''}<button type="button" class="lj-fab" data-lj="cart">🧾 Minha cotação <i>${CART.length}</i></button>`;
    document.querySelectorAll('[data-conta]').forEach(b=>b.textContent=EU?'👤 '+EU.nome.split(' ')[0]:'👤 Entrar');}
  /* ---------- cards ---------- */
  function info(cd){const im=cd.querySelector('img.d2')||cd.querySelector('img');const cs=[...cd.querySelectorAll('.ccor i')].map(i=>Object.keys(CORN).find(k=>CORN[k]===i.title)).filter(Boolean);
    return {c:cd.dataset.c,cd:(cd.querySelector('b')||{}).textContent||cd.dataset.c,n:(cd.querySelector('span')||{}).textContent||cd.dataset.n||'',img:im?im.getAttribute('src'):'',cores:cs.length?cs:['branco','preto','natural'],sc:!!cd.querySelector('.scb'),un:cd.dataset.un||''};}
  const UNI=i=>i&&i.un?'un.':'barras';
  function marca(){document.querySelectorAll('#lst .cd[data-c]').forEach(cd=>{let b=cd.querySelector('.lj-add');if(!b){b=document.createElement('button');b.type='button';b.className='lj-add nov3';b.dataset.ljadd='1';cd.appendChild(b);}
    const n=CART.filter(i=>i.c===cd.dataset.c).reduce((s,i)=>s+i.q,0);b.classList.toggle('on',n>0);b.textContent=n?`✓ ${n} ${cd.dataset.un?'un.':'barras'} na cotação · alterar`:'＋ Adicionar à cotação';});}
  function ov(cls,html){const o=document.createElement('div');o.className='lj-ov'+(cls?' '+cls:'');o.innerHTML=html;document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-x]'))fecha(o);});return o;}
  function fecha(o){if(o===BG){clearInterval(POLL);POLL=null;CHAT=null;BG=null;}o.remove();}
  function escolher(cd){const p=info(cd);let cor=p.cores[0],q=p.un?1:10;
    const o=ov('c','');const pinta=()=>{o.innerHTML=`<div class="lj-md" role="dialog" aria-label="Adicionar à cotação"><div class="lj-h"><b>${esc(p.cd)}</b><button type="button" class="lj-x" data-x>✕</button></div>
      ${p.img?`<img src="${esc(p.img)}" alt="" style="height:90px;object-fit:contain;background:#fff">`:''}<p class="lj-sub">${esc(p.n)}</p>
      ${p.sc?'<p class="lj-sub" style="background:#fff7ec;color:#7a4a08;border-radius:9px;padding:8px 10px">Sob consulta: perfil fora do estoque de pronta entrega. A loja confirma o prazo.</p>':''}
      <div><b style="font-size:12.5px;letter-spacing:.1em;color:#55636c">COR</b><div class="lj-cores" style="margin-top:6px">${p.cores.map(k=>`<button type="button" data-cor="${k}" aria-pressed="${k===cor}"><span class="lj-dot" style="background:${CORH[k]}"></span>${CORN[k]}</button>`).join('')}</div></div>
      <div><b style="font-size:12.5px;letter-spacing:.1em;color:#55636c">${p.un?'QUANTIDADE ('+esc(p.un)+')':'BARRAS DE 6 M'}</b><div class="lj-q" style="margin-top:6px"><button type="button" data-d="-1" aria-label="Menos">−</button><input id="ljQ" inputmode="numeric" value="${q}" aria-label="Quantidade de barras"><button type="button" data-d="1" aria-label="Mais">+</button></div></div>
      <button type="button" class="lj-go" data-ok>＋ Adicionar à cotação</button><p class="lj-sub" style="text-align:center">Sem preço aqui: o vendedor responde a cotação com valores e prazo.</p></div>`;};
    pinta();
    o.addEventListener('click',e=>{const t=e.target;
      const c=t.closest('[data-cor]');if(c){q=+o.querySelector('#ljQ').value||q;cor=c.dataset.cor;pinta();return;}
      const d=t.closest('[data-d]');if(d){const i=o.querySelector('#ljQ');i.value=Math.max(1,(+i.value||0)+(+d.dataset.d));return;}
      if(t.closest('[data-ok]')){q=Math.max(1,parseInt(o.querySelector('#ljQ').value)||1);const ex=CART.find(i=>i.c===p.c&&i.cor===cor);if(ex)ex.q=q;else CART.push({c:p.c,cd:p.cd,n:p.n,img:p.img,cor,q,un:p.un});salva();fecha(o);tt(`${p.cd} · ${CORN[cor]} · ${q} ${UNI(p)} na cotação`);O.hit&&O.hit('loja_add',p.c);}});}
  /* ---------- entrar / cadastro ---------- */
  let AUTO=null;async function auto(){if(AUTO===null){try{AUTO=!!(await rpc('loja_auto',{p_cli:O.cli.id}));}catch(_){AUTO=false;}}return AUTO;}
  async function conta(aba,depois){if(EU){minhaConta();return;}await auto();let A=aba||'entrar',msg='',err='';const o=ov('c','');
    const pinta=()=>{o.innerHTML=`<div class="lj-md" role="dialog" aria-label="Área do cliente"><div class="lj-h"><b>Área do cliente</b><button type="button" class="lj-x" data-x>✕</button></div>
      <p class="lj-sub">Com o seu acesso você monta a cotação e conversa direto com o vendedor da sua região na ${esc(O.cli.nome)}.</p>
      <div class="lj-tabs"><button type="button" data-ab="entrar" aria-pressed="${A==='entrar'}">Já tenho acesso</button><button type="button" data-ab="cad" aria-pressed="${A==='cad'}">Criar cadastro</button></div>
      ${err?`<div class="lj-err">${esc(err)}</div>`:''}${msg?`<div class="lj-okm">${msg}</div>`:''}
      ${A==='entrar'?`<form class="lj-f" id="ljE"><label>WhatsApp ou CNPJ<input name="l" autocomplete="username" inputmode="tel" required placeholder="(00) 9 0000-0000"></label><label>Senha<input name="s" type="password" autocomplete="current-password" required></label>
        <button class="lj-go">Entrar</button><p class="lj-sub">Esqueceu a senha? Peça uma nova para a ${esc(O.cli.nome)}.</p></form>`
      :`<form class="lj-f" id="ljC"><div class="lj-2"><label>Nome<input name="nome" required></label><label>Empresa<input name="empresa"></label></div>
        <div class="lj-2"><label>CNPJ ou CPF<input name="doc" inputmode="numeric"></label><label>WhatsApp (é o seu login)<input name="zap" inputmode="tel" autocomplete="tel" required placeholder="(00) 9 0000-0000"></label></div>
        <label>Cidade<input name="cidade" required placeholder="Ex.: Sinop - MT"></label>
        ${AUTO?`<div class="lj-2"><label>Crie uma senha<input name="senha" type="password" autocomplete="new-password" required minlength="6"></label><label>Repita a senha<input name="senha2" type="password" autocomplete="new-password" required minlength="6"></label></div>`:''}
        <button class="lj-go">${AUTO?'Criar meu acesso':'Pedir meu acesso'}</button><p class="lj-sub">${AUTO?'Seu acesso é liberado na hora. A cidade define o vendedor da sua região.':'A loja confere o cadastro e envia a senha no seu WhatsApp. A cidade define o vendedor da sua região.'}</p></form>`}</div>`;};
    pinta();
    o.addEventListener('click',e=>{const b=e.target.closest('[data-ab]');if(b){A=b.dataset.ab;err='';msg='';pinta();}});
    o.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,bt=f.querySelector('button.lj-go');bt.disabled=true;err='';
      try{if(f.id==='ljE'){const r=await rpc('loja_entrar',{p_cli:O.cli.id,p_login:f.l.value,p_senha:f.s.value});if(r.erro){err=r.erro;pinta();return;}
          TOK=r.tok;ls.set('fc_loja_tok_'+O.cli.id,TOK);await carregaEu();fecha(o);O.hit&&O.hit('loja_login','');
          if(r.troca){trocaSenha(depois);}else{tt('Bem-vindo, '+EU.nome.split(' ')[0]+'!');depois&&depois();}}
        else{const d={};['nome','empresa','doc','zap','cidade'].forEach(k=>d[k]=f[k].value);
          if(f.senha){if(f.senha.value.length<6){err='A senha precisa ter pelo menos 6 caracteres.';pinta();return;}if(f.senha.value!==f.senha2.value){err='As duas senhas estão diferentes.';pinta();return;}d.senha=f.senha.value;}
          const r=await rpc('loja_cadastrar',{p_cli:O.cli.id,p:d});
          if(r.erro){err=r.erro;pinta();return;}O.hit&&O.hit('loja_cadastro','');
          if(r.status==='ativo'){const r2=await rpc('loja_entrar',{p_cli:O.cli.id,p_login:d.zap,p_senha:d.senha});if(r2&&r2.tok){TOK=r2.tok;ls.set('fc_loja_tok_'+O.cli.id,TOK);await carregaEu();fecha(o);tt('Cadastro feito! Bem-vindo, '+EU.nome.split(' ')[0]+'!');depois&&depois();return;}}
          A='entrar';msg=r.status==='ativo'?'✅ Cadastro feito! Entre com o seu WhatsApp e a senha que você criou.':'✅ Cadastro enviado! A '+esc(O.cli.nome)+' vai conferir e mandar a sua senha no WhatsApp. Depois é só entrar aqui.';pinta();}}
      catch(x){err='Não consegui falar com o servidor. Tente de novo.';pinta();}});}
  function trocaSenha(depois){let err='';const o=ov('c','');const pinta=()=>{o.innerHTML=`<div class="lj-md"><div class="lj-h"><b>Crie a sua senha</b></div><p class="lj-sub">Você entrou com a senha enviada pela loja. Agora escolha uma senha sua (mínimo 6 caracteres).</p>${err?`<div class="lj-err">${esc(err)}</div>`:''}
      <form class="lj-f" id="ljS"><label>Nova senha<input name="a" type="password" autocomplete="new-password" required minlength="6"></label><label>Repita a senha<input name="b" type="password" autocomplete="new-password" required></label><button class="lj-go">Salvar senha</button></form></div>`;};
    pinta();o.onclick=null;
    o.addEventListener('submit',async e=>{e.preventDefault();const f=e.target;if(f.a.value!==f.b.value){err='As duas senhas estão diferentes.';pinta();return;}
      const r=await rpc('loja_senha',{p_tok:TOK,p_nova:f.a.value}).catch(()=>({erro:'Não consegui salvar. Tente de novo.'}));if(r.erro){err=r.erro;pinta();return;}fecha(o);tt('Senha salva.');depois&&depois();});}
  function minhaConta(){const o=ov('c',`<div class="lj-md"><div class="lj-h"><b>Minha conta</b><button type="button" class="lj-x" data-x>✕</button></div>
    <p style="margin:0"><b>${esc(EU.nome)}</b><br><span class="lj-sub">${esc(EU.empresa||'')} · ${esc(EU.cidade||'')}<br>${esc(EU.zap||EU.email||'')}</span></p>
    ${vendBox()}<button type="button" class="lj-go" data-c="chat">💬 Minhas conversas e cotações</button><button type="button" class="lj-x" data-c="senha">Trocar a senha</button><button type="button" class="lj-x" data-c="sair">Sair</button></div>`);
    o.addEventListener('click',async e=>{const b=e.target.closest('[data-c]');if(!b)return;fecha(o);if(b.dataset.c==='chat')conversas();else if(b.dataset.c==='senha')trocaSenha();else{await rpc('loja_sair',{p_tok:TOK}).catch(()=>{});TOK='';EU=null;ls.set('fc_loja_tok_'+O.cli.id,null);fabs();tt('Você saiu.');}});}
  function vendBox(v){v=v||(EU&&EU.vend);return v?`<div class="lj-vd"><span class="lj-av">${esc(ini(v.nome))}</span><div><b>${esc(v.nome)}</b><small>Seu vendedor${v.rota?' · '+esc(v.rota):''}</small></div></div>`
    :`<div class="lj-vd"><span class="lj-av">${esc(O.cli.sigla||'?')}</span><div><b>Equipe de vendas · ${esc(O.cli.nome)}</b><small>A loja indica o vendedor da sua região</small></div></div>`;}
  async function carregaEu(){if(!TOK){EU=null;return;}try{EU=await rpc('loja_eu',{p_tok:TOK});}catch(_){EU=null;}if(!EU){TOK='';ls.set('fc_loja_tok_'+O.cli.id,null);}fabs();}
  /* ---------- carrinho ---------- */
  function carrinho(){const o=ov('','');let obs='';
    const pinta=()=>{const n=CART.reduce((s,i)=>s+i.q,0);
      o.innerHTML=`<div class="lj-pn" role="dialog" aria-label="Minha cotação"><div class="lj-h"><b>Minha cotação</b><button type="button" class="lj-x" data-x>✕ Fechar</button></div>
      <p class="lj-sub">${CART.length} ${CART.length===1?'item':'itens'}${CART.some(i=>!i.un)?' · '+CART.filter(i=>!i.un).reduce((s,i)=>s+i.q,0)+' barras de 6 m':''}. Sem preço: o vendedor responde com valores e prazo.</p>
      <div>${CART.length?CART.map((i,k)=>`<div class="lj-it">${i.img?`<img src="${esc(i.img)}" alt="">`:'<span></span>'}<div><b>${esc(i.cd)}</b><small>${esc(i.n)}</small><small><span class="lj-dot" style="width:10px;height:10px;background:${CORH[i.cor]}"></span> ${CORN[i.cor]}</small><button type="button" class="lj-rm" data-rm="${k}">Tirar</button></div>
        <div class="lj-q"><button type="button" data-k="${k}" data-d="-1" aria-label="Menos">−</button><input data-qi="${k}" inputmode="numeric" value="${i.q}" aria-label="Quantidade"><button type="button" data-k="${k}" data-d="1" aria-label="Mais">+</button></div>${i.un?`<small style="display:block;text-align:center;color:#55636c">${esc(i.un)}</small>`:''}</div>`).join(''):'<p class="lj-vz">A cotação está vazia.<br>Clique em <b>＋ Adicionar à cotação</b> nos perfis.</p>'}</div>
      ${CART.length?`${EU?vendBox():''}<label class="lj-f"><span style="font-size:13px;font-weight:600;color:#55636c">Observação (opcional)</span><textarea id="ljObs" rows="2" placeholder="Ex.: entrega na obra, prazo, outra cor">${esc(obs)}</textarea></label>
        <button type="button" class="lj-go" data-env>💬 Solicitar orçamento ${EU&&EU.vend?'ao '+esc(EU.vend.nome.split(' ')[0]):''}</button>
        ${EU?'':'<p class="lj-sub" style="text-align:center">Para enviar, entre na área do cliente ou crie o seu cadastro.</p>'}<button type="button" class="lj-x" data-limpa>Limpar a cotação</button>`:''}</div>`;};
    pinta();
    o.addEventListener('click',async e=>{const t=e.target;
      const r=t.closest('[data-rm]');if(r){CART.splice(+r.dataset.rm,1);salva();pinta();return;}
      const d=t.closest('[data-d][data-k]');if(d){const i=CART[+d.dataset.k];i.q=Math.max(1,i.q+(+d.dataset.d));salva();pinta();return;}
      if(t.closest('[data-limpa]')){CART=[];salva();pinta();return;}
      const ev=t.closest('[data-env]');if(ev){obs=(o.querySelector('#ljObs')||{}).value||'';
        if(!EU){fecha(o);conta('entrar',()=>carrinho());return;}
        ev.disabled=true;ev.textContent='Enviando…';
        try{const r=await rpc('loja_cotar',{p_tok:TOK,p_itens:CART.map(i=>({c:i.c,cd:i.cd,n:i.un?i.n+' ('+i.un+')':i.n,cor:i.cor,corn:CORN[i.cor],q:i.q,u:i.un?'un':'barra'})),p_obs:obs});
          if(r.erro){tt(r.erro);ev.disabled=false;ev.textContent='💬 Solicitar orçamento';if(/Entre/.test(r.erro)){TOK='';EU=null;fabs();}return;}
          CART=[];salva();fecha(o);O.hit&&O.hit('loja_cotar',String(r.numero));conversas(r.id);}
        catch(x){tt('Não consegui enviar. Tente de novo.');ev.disabled=false;}}});
    o.addEventListener('input',e=>{const t=e.target;if(t.dataset.qi!=null){CART[+t.dataset.qi].q=Math.max(1,parseInt(t.value)||1);ls.set(K,CART);fabs();marca();}if(t.id==='ljObs')obs=t.value;});}
  /* ---------- conversa ---------- */
  async function conversas(abrir){if(!EU){conta('entrar',()=>conversas(abrir));return;}
    const o=ov('c','<div class="lj-chat" role="dialog" aria-label="Conversa com o vendedor"><div class="lj-vz" style="grid-column:1/-1;align-self:center">Carregando…</div></div>');BG=o;
    let L=[];try{L=await rpc('loja_atends',{p_tok:TOK})||[];}catch(_){}
    CHAT={id:abrir||(L[0]&&L[0].id)||null,L,msgs:[],ult:0,at:null,anexo:null};
    desenhaChat();if(CHAT.id)await puxa(true);
    clearInterval(POLL);POLL=setInterval(()=>{if(document.hidden)return;puxa(false);},6000);}
  function desenhaChat(){const o=BG;if(!o)return;const C=CHAT,a=C.at;
    const lista=C.L.map(x=>`<button type="button" class="lj-at" data-at="${x.id}" aria-current="${x.id===C.id}"><b><span>Cotação nº ${x.numero}</span>${x.nao_lidas&&x.id!==C.id?`<span class="lj-bd">${x.nao_lidas}</span>`:''}</b><span class="lj-sub">${(x.itens||[]).length} perfis · ${hora(x.atualizado)}</span></button>`).join('');
    const v=(a&&a.vend)||(EU&&EU.vend);
    o.innerHTML=`<div class="lj-chat${C.id?'':' sb'}"><aside class="lj-cs">${vendBox(v)}
      ${a?`<h4>Cotação nº ${a.numero}</h4><div>${(a.itens||[]).map(i=>`<div class="lj-li"><span><b>${esc(i.cd)}</b> ${esc(i.corn||'')}</span><span>${i.q} br</span></div>`).join('')}</div>`:''}
      ${C.msgs.some(m=>m.anexo&&m.anexo.id)?`<h4>Anexos</h4><div>${C.msgs.filter(m=>m.anexo&&m.anexo.id).map(m=>`<button type="button" class="lj-at" data-ax="${m.anexo.id}">📎 ${esc(m.anexo.nome)}</button>`).join('')}</div>`:''}
      <h4>Minhas cotações</h4><div style="display:flex;flex-direction:column;gap:6px">${lista||'<p class="lj-sub">Nenhuma cotação ainda. Monte o carrinho e clique em “Solicitar orçamento”.</p>'}</div>
      <button type="button" class="lj-x" data-x>✕ Fechar</button></aside>
     <section class="lj-cv">${C.id?`<div class="lj-cvh"><button type="button" class="lj-x lj-vol" data-sb style="margin:0">☰</button><span class="lj-av" style="width:40px;height:40px;font-size:17px">${esc(ini(v?v.nome:O.cli.nome))}</span><div><b>${esc(v?v.nome:'Equipe de vendas')}</b><br><span class="lj-sub">${esc(O.cli.nome)}${a?' · Cotação nº '+a.numero:''}</span></div><button type="button" class="lj-x" data-x>✕</button></div>
      <div class="lj-ms" id="ljMs">${C.msgs.map(msgHtml).join('')}</div>
      <form class="lj-cp" id="ljCp">${C.anexo?`<div class="lj-prev">📎 <b>${esc(C.anexo.nome)}</b> <span class="lj-sub">${Math.max(1,Math.round(C.anexo.tam/1024))} KB</span><button type="button" class="lj-rm" data-semax style="margin-left:auto">Tirar</button></div>`:''}
        <button type="button" class="lj-clip" data-clip title="Anexar foto, print ou PDF">📎 Anexar</button><textarea id="ljTx" rows="2" placeholder="Escreva para ${esc(v?v.nome.split(' ')[0]:'a loja')}…"></textarea><button class="lj-go">Enviar</button>
        <input type="file" id="ljFile" hidden accept="image/*,application/pdf"></form>
      ${v&&v.fone?`<div class="lj-zp">Prefere WhatsApp? Chame ${esc(v.nome.split(' ')[0])}: <b>${esc(v.fone)}</b></div>`:''}`
      :`<div class="lj-vz" style="margin:auto">Escolha uma cotação ao lado, ou monte o carrinho e clique em <b>Solicitar orçamento</b>.</div>`}</section></div>`;
    const ms=o.querySelector('#ljMs');if(ms)ms.scrollTop=ms.scrollHeight;
    const tx=o.querySelector('#ljTx');if(tx){tx.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();o.querySelector('#ljCp').requestSubmit();}});if(matchMedia('(min-width:821px)').matches)tx.focus();}}
  function msgHtml(m){if(m.autor==='sys')return `<div class="lj-m sys">${esc(m.texto)}</div>`;
    const ax=m.anexo&&m.anexo.id?`<button type="button" class="lj-ax" data-ax="${m.anexo.id}">${m.anexo.mini?`<img src="${esc(m.anexo.mini)}" alt="">`:'<i>📄</i>'}<span><b>${esc(m.anexo.nome)}</b><br><span class="lj-sub">${Math.max(1,Math.round((m.anexo.tam||0)/1024))} KB · abrir</span></span></button>`:'';
    return `<div class="lj-m ${m.autor}">${m.autor==='vend'&&m.nome?`<span class="nm">${esc(m.nome)}</span>`:''}${m.texto?esc(m.texto):''}${ax}<small>${hora(m.criado)}</small></div>`;}
  async function puxa(full){if(!CHAT||!CHAT.id)return;try{const r=await rpc('loja_msgs',{p_tok:TOK,p_atend:CHAT.id,p_desde:full?0:CHAT.ult});if(!r)return;
      CHAT.at=r.atend;const novas=r.msgs||[];if(full)CHAT.msgs=novas;else CHAT.msgs=CHAT.msgs.concat(novas);
      if(novas.length)CHAT.ult=novas[novas.length-1].id;
      const x=CHAT.L.find(y=>y.id===CHAT.id);if(x)x.nao_lidas=0;
      if(full||novas.length){const tx=BG&&BG.querySelector('#ljTx'),val=tx?tx.value:'';desenhaChat();const t2=BG&&BG.querySelector('#ljTx');if(t2)t2.value=val;}
      if(!full&&novas.some(m=>m.autor==='vend'))bip();}catch(_){}}
  function bip(){try{const c=new (window.AudioContext||window.webkitAudioContext)(),g=c.createGain(),s=c.createOscillator();s.frequency.value=880;g.gain.value=.06;s.connect(g);g.connect(c.destination);s.start();s.stop(c.currentTime+.15);}catch(_){}}
  async function arquivo(f){if(f.size>3*1024*1024&&!/^image\//.test(f.type)){tt('Arquivo grande demais (máximo 3 MB).');return null;}
    const dataUrl=b=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(b);});
    if(/^image\//.test(f.type)){const im=await new Promise((ok,er)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=er;i.src=URL.createObjectURL(f);});
      const cv=(mx,q)=>{const k=Math.min(1,mx/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/jpeg',q);};
      const d=cv(1800,.82);return {nome:f.name.replace(/\.[^.]+$/,'')+'.jpg',tipo:'image/jpeg',tam:Math.round(d.length*.75),dados:d,mini:cv(240,.7)};}
    return {nome:f.name,tipo:f.type||'application/octet-stream',tam:f.size,dados:await dataUrl(f)};}
  async function abreAnexo(id){tt('Abrindo o anexo…');try{const r=await rpc('loja_anexo',{p_tok:TOK,p_id:id});if(!r)return;
      if(/^image\//.test(r.tipo)){const l=document.createElement('div');l.className='lj-lb';l.innerHTML=`<img src="${r.dados}" alt="">`;l.onclick=()=>l.remove();document.body.appendChild(l);document.querySelector('.lj-tt').hidden=true;return;}
      const b=await (await fetch(r.dados)).blob();const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';a.download=r.nome;document.body.appendChild(a);a.click();a.remove();}catch(_){tt('Não consegui abrir o anexo.');}}
  /* ---------- eventos globais ---------- */
  function liga(){
    document.addEventListener('click',e=>{const b=e.target.closest('[data-ljadd]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();escolher(b.closest('.cd'));},true);
    document.addEventListener('click',async e=>{const t=e.target;
      const f=t.closest('[data-lj]');if(f){if(f.dataset.lj==='cart')carrinho();else conversas();return;}
      if(t.closest('[data-conta]')){conta();return;}
      if(!BG||!BG.contains(t))return;
      const at=t.closest('[data-at]');if(at){CHAT.id=at.dataset.at;CHAT.ult=0;CHAT.anexo=null;await puxa(true);return;}
      const ax=t.closest('[data-ax]');if(ax){abreAnexo(ax.dataset.ax);return;}
      if(t.closest('[data-sb]')){BG.querySelector('.lj-chat').classList.toggle('sb');return;}
      if(t.closest('[data-clip]')){BG.querySelector('#ljFile').click();return;}
      if(t.closest('[data-semax]')){CHAT.anexo=null;desenhaChat();}});
    document.addEventListener('change',async e=>{if(e.target.id!=='ljFile')return;const f=e.target.files[0];if(!f)return;const a=await arquivo(f);if(a){CHAT.anexo=a;const tx=BG.querySelector('#ljTx').value;desenhaChat();BG.querySelector('#ljTx').value=tx;}});
    document.addEventListener('submit',async e=>{if(e.target.id!=='ljCp')return;e.preventDefault();const tx=BG.querySelector('#ljTx'),bt=e.target.querySelector('.lj-go');const v=tx.value.trim();if(!v&&!CHAT.anexo)return;
      bt.disabled=true;try{const r=await rpc('loja_enviar',{p_tok:TOK,p_atend:CHAT.id,p_texto:v,p_anexo:CHAT.anexo});if(r&&r.erro){tt(r.erro);bt.disabled=false;return;}CHAT.anexo=null;tx.value='';await puxa(false);desenhaChat();}
      catch(x){tt(/grande/.test(x.message)?'Arquivo grande demais (máximo 3 MB).':'Não consegui enviar. Tente de novo.');bt.disabled=false;}});}
  window.CLOJA={init(o){const C=o.cli||{},q=new URLSearchParams(location.search);if(!(q.get('loja')==='1'||(C.vitrine&&C.vitrine.loja)))return;
    O=o;K='fc_loja_'+(C.id||'x');CART=ls.get(K,[]);TOK=ls.get('fc_loja_tok_'+C.id,'')||'';
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    const bar=document.createElement('div');bar.className='lj-bar noprint';bar.innerHTML=`<div class="w">🧾 <span><b>Monte sua cotação:</b> escolha os perfis, a cor e as barras e converse direto com o vendedor da sua região. Os preços vêm na resposta.</span><button type="button" data-conta>👤 Entrar</button></div>`;
    const h=document.querySelector('.tools');if(h)h.parentNode.insertBefore(bar,h);
    const nav=document.querySelector('header.top nav');if(nav){const b=document.createElement('button');b.type='button';b.className='btn b-or noprint';b.dataset.conta='1';b.textContent='👤 Entrar';nav.insertBefore(b,nav.firstChild);}
    liga();new MutationObserver(()=>marca()).observe(document.getElementById('lst'),{childList:true});
    fabs();marca();carregaEu().then(()=>{if(q.get('conversa')==='1'&&EU)conversas();});
    setInterval(()=>{if(TOK&&!BG&&!document.hidden)carregaEu();},45000);}};
})();

/* 08/11/2026 · Catálogo da loja dentro da Plataforma FC 3D (Guaporé Vidros e Guaporé Sinop)
   - Início: card bem visível com o link do catálogo para o colaborador enviar aos clientes (copiar / enviar no WhatsApp).
     O link do colaborador leva o código dele (?v=), assim os acessos contam para ele e o cliente já fica com ele no cadastro.
   - Aba "Clientes do Catálogo": acessos ao catálogo, clientes cadastrados, cotações enviadas e qual vendedor recebeu cada uma.
     Gestor vê a loja toda; colaborador vê só o dele; a FC vê qualquer loja (precisa do login do Painel da Matriz no navegador).
   Dados: Central do Cliente (função cat_acomp). Usa as variáveis de cor da plataforma. */
(function(){
  const CEN='https://cpkjphodruyxfouirhpd.supabase.co',KEY='sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg';
  const EMP={'guapore-vidros':{e:'gb',slug:'guapore-vidros'},'guapore-sinop':{e:'gs',slug:'guapore-sinop'}};
  const base=id=>String(id||'').replace(/^teste-/,'');
  const cfg=S=>EMP[base(S&&S.empresa)]||null;
  const h=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const n=v=>Number(v||0).toLocaleString('pt-BR');
  const dt=d=>{if(!d)return '—';const x=new Date(d);return x.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+' '+x.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});};
  const zapNum=z=>{let d=String(z||'').replace(/\D/g,'');if(d.length===10||d.length===11)d='55'+d;return d;};
  let D=null,dias=30,ver={},erro='',busy=false,ultS=null;

  const css=`.catl{border:2px solid var(--teal);background:var(--panel);border-radius:16px;padding:16px 18px;margin:16px 0 4px;display:grid;gap:12px}
  .catl-t{display:flex;gap:12px;align-items:flex-start}.catl-ic{font-size:26px;line-height:1}.catl-t b{font-size:17px;display:block}.catl-t small{color:var(--mute);font-size:14px;line-height:1.4;display:block;margin-top:2px}
  .catl-u{display:flex;gap:8px;align-items:center;background:var(--soft);border:1px solid var(--line);border-radius:11px;padding:10px 12px;min-width:0}
  .catl-u code{font:600 14px ui-monospace,Menlo,Consolas,monospace;color:var(--ink);overflow-wrap:anywhere;flex:1;min-width:0}
  .catl-b{display:flex;flex-wrap:wrap;gap:8px}.catl-b .btn{min-height:44px}
  .cat-zap{background:#1f9d55;color:#fff}.cat-cl{background:var(--soft);color:var(--ink);border:1px solid var(--line)}.cat-pr{background:var(--teal);color:#fff}
  .catl-m{font-size:13px;color:var(--ok)}.catl-m:empty{display:none}
  .catk{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:14px 0}
  .catk>div{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px}
  .catk b{display:block;font-size:30px;font-variant-numeric:tabular-nums;line-height:1.1}.catk span{color:var(--mute);font-size:13px}
  .catw{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:auto;margin:10px 0 18px}
  .catw table{width:100%;border-collapse:collapse;font-size:14px}.catw th,.catw td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
  .catw th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mute);font-weight:600}.catw .nu{text-align:right;font-variant-numeric:tabular-nums}
  .catw tr:last-child td{border-bottom:0}.catw .vz{color:var(--mute);padding:18px 12px}
  .cat-it{margin:8px 0 0;padding:0;list-style:none;font-size:13px;color:var(--mute)}.cat-it li{padding:2px 0}
  .cat-ln{appearance:none;border:0;background:none;color:var(--teal);font-weight:600;font-size:13px;font-family:inherit;cursor:pointer;padding:4px 0;min-height:32px}
  .cat-av{background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:13px;color:var(--mute);margin:8px 0 14px;line-height:1.45}
  .cat-h3{margin:18px 0 4px;font-size:16px}`;
  function estilo(){if(document.getElementById('catLojaCss'))return;const s=document.createElement('style');s.id='catLojaCss';s.textContent=css;document.head.appendChild(s);}

  function pode(S,p){return !!(S&&!S.demo&&cfg(S)&&(p==='gestor'||p==='vendedor'));}
  function linkDe(S,d){const c=cfg(S);const u=(d&&d.link)||('https://fc-consultoria.github.io/catalogo/'+c.slug);return d&&d.vcode?u+'?v='+d.vcode:u;}
  function msgDe(S,d,p){const loja=(d&&d.loja)||S.empresa_nome||'loja';
    return p==='vendedor'&&d&&d.vcode
      ?`Olá! Este é o catálogo de perfis da ${loja}. Você vê os perfis em 3D, monta a sua cotação e me envia direto pelo WhatsApp: ${linkDe(S,d)}`
      :`Olá! Este é o catálogo de perfis da ${loja}. Você vê os perfis em 3D, monta a sua cotação e envia para um dos nossos vendedores pelo WhatsApp: ${linkDe(S,d)}`;}

  async function post(fn,args,jwt){const r=await fetch(CEN+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Authorization:'Bearer '+(jwt||KEY)},body:JSON.stringify(args)});
    const t=await r.text();if(!r.ok)throw new Error('Não foi possível carregar agora. Tente de novo em instantes.');return t?JSON.parse(t):null;}
  function jwtFC(){try{const x=JSON.parse(localStorage.getItem('trein-fc-auth')||'null');return (x&&(x.access_token||(x.currentSession&&x.currentSession.access_token)))||null;}catch(_){return null;}}
  /* token da Central preso a esta sessão da plataforma (não serve para outra pessoa no mesmo computador) */
  async function tokCentral(S,rpc,novo){const k='pfc-cat-tok';
    if(!novo){try{const x=JSON.parse(localStorage.getItem(k)||'null');if(x&&x.pt===S.token&&x.t)return x.t;}catch(_){}}
    const p=await rpc('pfc_central_passe',{p_token:S.token});
    const r=await post('emp_passe_entrar',{p_pid:p.pid,p_exp:p.exp,p_sig:p.sig,p_ua:navigator.userAgent});
    if(!r||r.erro||!r.token)throw new Error(r&&r.erro==='pessoa_inativa'?'Seu cadastro está pausado. Fale com o gestor ou com a FC.':'Não foi possível abrir o acompanhamento agora.');
    try{localStorage.setItem(k,JSON.stringify({pt:S.token,t:r.token}));}catch(_){}
    return r.token;}

  async function buscar(S,rpc){const c=cfg(S);
    if(S.matriz||String(S.empresa||'').startsWith('teste-')){const j=jwtFC();
      if(!j)throw new Error('Para ver os números no acesso da FC, entre no Painel da Matriz neste navegador e volte aqui.');
      const r=await post('cat_acomp',{p_tok:null,p_emp:c.e,p_dias:dias},j);if(r&&r.erro)throw new Error(r.erro==='sessao'?'O login do Painel da Matriz venceu. Entre de novo no Painel da Matriz e volte aqui.':r.erro);return r;}
    let t=await tokCentral(S,rpc,false);let r=await post('cat_acomp',{p_tok:t,p_emp:null,p_dias:dias});
    if(r&&r.erro==='sessao'){t=await tokCentral(S,rpc,true);r=await post('cat_acomp',{p_tok:t,p_emp:null,p_dias:dias});}
    if(r&&r.erro)throw new Error(r.erro==='sem_vendedor'?'Seu acesso ainda não está ligado a um vendedor. Fale com a FC Consultoria.':r.erro==='sem_catalogo'?'O catálogo da loja ainda não está ligado.':'Não foi possível carregar agora.');
    return r;}

  /* ---------- card do Início ---------- */
  function card(S,p,naTela){if(!pode(S,p))return '';estilo();const u=linkDe(S,D&&ultS===S.token+'|'+S.empresa?D:null);
    return `<section class="catl" id="catLink" aria-label="Link do catálogo para os clientes">
      <div class="catl-t"><span class="catl-ic" aria-hidden="true">🔗</span><div><b>Link do catálogo para enviar aos seus clientes</b>
      <small>${p==='vendedor'?'Este link é seu: o cliente vê os perfis em 3D, monta a cotação e ela chega no seu WhatsApp. Os acessos e as cotações aparecem em Clientes do Catálogo.':'O cliente vê os perfis em 3D, monta a cotação e escolhe o vendedor da '+h(S.empresa_nome||'loja')+' para receber no WhatsApp. Cada colaborador tem o próprio link no Início dele.'}</small></div></div>
      <div class="catl-u"><code id="catUrl">${h(u)}</code></div>
      <div class="catl-b"><button type="button" class="btn cat-pr" data-catcp>📋 Copiar link</button><a class="btn cat-zap" id="catZap" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msgDe(S,D,p))}">💬 Enviar no WhatsApp</a><a class="btn cat-cl" id="catAbre" href="${h(u)}" target="_blank" rel="noopener">Abrir o catálogo</a>${naTela?'':'<button type="button" class="btn cat-cl" data-ir="catc">📊 Clientes do Catálogo</button>'}</div>
      <div class="catl-m" id="catMsg" role="status"></div></section>`;}
  function ligarCard(S,p){const b=document.querySelector('[data-catcp]');if(!b)return;
    b.onclick=async()=>{const u=document.getElementById('catUrl').textContent,m=document.getElementById('catMsg');
      try{await navigator.clipboard.writeText(u);m.textContent='Link copiado. É só colar na conversa com o cliente.';}
      catch(_){const r=document.createRange();r.selectNodeContents(document.getElementById('catUrl'));const sl=getSelection();sl.removeAllRanges();sl.addRange(r);m.textContent='Link selecionado: segure e toque em Copiar.';}};}
  function atualizaCard(S,p){const u=linkDe(S,D);const c=document.getElementById('catUrl');if(!c)return;c.textContent=u;
    const a=document.getElementById('catAbre');if(a)a.href=u;const z=document.getElementById('catZap');if(z)z.href='https://wa.me/?text='+encodeURIComponent(msgDe(S,D,p));}

  /* ---------- aba Clientes do Catálogo ---------- */
  function tela(S,p){estilo();
    return `<div class="cab"><div><h2>Clientes do Catálogo</h2><p class="mute">${p==='vendedor'?'Quem abriu o catálogo pelo seu link, os clientes que ficaram com você e as cotações que chegaram no seu WhatsApp.':'Acessos ao catálogo da '+h(S.empresa_nome||'loja')+', clientes cadastrados e as cotações que cada vendedor recebeu.'}</p></div>
      <div class="filtros" role="group" aria-label="Período">${[[7,'7 dias'],[30,'30 dias'],[90,'90 dias']].map(([d,t])=>`<button type="button" data-catd="${d}" aria-pressed="${dias===d}">${t}</button>`).join('')}<button type="button" data-catr title="Atualizar" aria-label="Atualizar">⟳</button></div></div>
      ${card(S,p,true)}
      <div id="catBox"><p class="mute">Carregando…</p></div>`;}
  function desenha(S,p){const box=document.getElementById('catBox');if(!box)return;
    if(erro){box.innerHTML=`<div class="aviso">${h(erro)}</div>`;return;}if(!D)return;
    const g=D.gestor,a=D.acessos||{};
    const kp=g?[[a.aberturas,'aberturas do catálogo',`${n(a.visitantes)} visitantes · ${n(a.por_vend)} vieram de link de vendedor`],[D.clientes,'clientes cadastrados',`${n(D.clientes_total)} no total`],[D.cotacoes,'cotações enviadas','pelo WhatsApp do vendedor']]
                :[[a.pelo_meu,'acessos pelo seu link',`${n(a.aberturas)} aberturas do catálogo da loja`],[D.clientes,'clientes seus cadastrados',`${n(D.clientes_total)} no total`],[D.cotacoes,'cotações para você','enviadas no seu WhatsApp']];
    let s=`<div class="catk">${kp.map(([v,t,sub])=>`<div><b>${n(v)}</b><span>${t}<br>${sub}</span></div>`).join('')}</div>`;
    if(D.fc||String(S.empresa||'').startsWith('teste-'))s+=`<div class="cat-av">Acesso FC: mostrando os números da loja ${h(D.loja||'')} como o gestor vê.</div>`;
    if(g){const V=(D.vends||[]).slice().sort((x,y)=>(y.cotacoes-x.cotacoes)||(y.acessos-x.acessos)||String(x.nome).localeCompare(y.nome));
      s+=`<h3 class="cat-h3">Por vendedor</h3><div class="catw"><table><thead><tr><th>Vendedor</th><th class="nu">Acessos pelo link</th><th class="nu">Clientes</th><th class="nu">Cotações</th><th>Última cotação</th></tr></thead><tbody>
      ${V.length?V.map(v=>`<tr><td>${h(v.nome)}</td><td class="nu">${n(v.acessos)}</td><td class="nu">${n(v.clientes)}</td><td class="nu">${n(v.cotacoes)}</td><td>${dt(v.ultima)}</td></tr>`).join(''):'<tr><td colspan="5" class="vz">Nenhum vendedor ativo.</td></tr>'}</tbody></table></div>`;}
    const L=D.lista||[];
    s+=`<h3 class="cat-h3">Cotações</h3><div class="catw"><table><thead><tr><th>Nº</th><th>Data</th><th>Cliente</th>${g?'<th>Vendedor</th>':''}<th>Itens</th></tr></thead><tbody>
      ${L.length?L.map((c,i)=>{const it=Array.isArray(c.itens)?c.itens:[];const k='c'+i;
        return `<tr><td>${h(c.numero)}</td><td>${dt(c.criado)}</td><td><b>${h(c.cli)}</b>${c.empresa?'<br><span class="mute">'+h(c.empresa)+'</span>':''}${c.cidade?'<br><span class="mute">'+h(c.cidade)+'</span>':''}<br>${contato(c,k,g)}</td>${g?`<td>${h(c.vend||'—')}</td>`:''}
        <td>${it.length} ${it.length===1?'item':'itens'}<br><button type="button" class="cat-ln" data-catv="${k}i" aria-expanded="${!!ver[k+'i']}">${ver[k+'i']?'Ocultar':'Ver itens'}</button>${ver[k+'i']?`<ul class="cat-it">${it.map(x=>`<li>${h(x.cd||x.c)} · ${h(x.n||'')}${x.corn?' · '+h(x.corn):''} · <b>${h(x.q)}</b> ${x.u==='un'?'un.':'barras'}</li>`).join('')}</ul>`:''}</td></tr>`;}).join('')
      :`<tr><td colspan="${g?5:4}" class="vz">Nenhuma cotação neste período.</td></tr>`}</tbody></table></div>`;
    const N=D.novos||[];
    s+=`<h3 class="cat-h3">Clientes cadastrados</h3><div class="catw"><table><thead><tr><th>Data</th><th>Cliente</th><th>Cidade</th>${g?'<th>Vendedor</th>':''}</tr></thead><tbody>
      ${N.length?N.map((c,i)=>`<tr><td>${dt(c.criado)}</td><td><b>${h(c.nome)}</b>${c.empresa?'<br><span class="mute">'+h(c.empresa)+'</span>':''}<br>${contato(c,'n'+i,g)}</td><td>${h(c.cidade||'—')}</td>${g?`<td>${h(c.vend||'ainda sem vendedor')}</td>`:''}</tr>`).join('')
      :`<tr><td colspan="${g?4:3}" class="vz">Nenhum cliente cadastrado neste período.</td></tr>`}</tbody></table></div>`;
    s+=`<div class="cat-av">A cotação fica registrada quando o cliente toca em “Enviar no WhatsApp” no catálogo, antes de abrir a conversa. Os acessos por vendedor contam a partir de 08/11/2026, pelos links novos do Início.</div>`;
    box.innerHTML=s;
    box.querySelectorAll('[data-catv]').forEach(b=>b.onclick=()=>{ver[b.dataset.catv]=!ver[b.dataset.catv];desenha(S,p);});}
  /* contato: o vendedor vê direto o dele; o gestor abre para ver */
  function contato(c,k,g){if(!c.zap)return '';const z=zapNum(c.zap);
    if(g&&!ver[k+'z'])return `<button type="button" class="cat-ln" data-catv="${k}z">Ver contato</button>`;
    return `<a class="cat-ln" href="https://wa.me/${z}" target="_blank" rel="noopener">💬 ${h(c.zap)}</a>`;}

  async function carregar(S,rpc,p,onde){if(!pode(S,p)||busy)return;{const k=S.token+'|'+S.empresa;if(ultS!==k){D=null;ver={};}ultS=k;}
    if(onde==='card')ligarCard(S,p);
    if(onde==='tela'){ligarCard(S,p);document.querySelectorAll('[data-catd]').forEach(b=>b.onclick=()=>{dias=+b.dataset.catd;document.querySelectorAll('[data-catd]').forEach(x=>x.setAttribute('aria-pressed',x===b));carregar(S,rpc,p,'tela');});
      const r0=document.querySelector('[data-catr]');if(r0)r0.onclick=()=>carregar(S,rpc,p,'tela');}
    busy=true;erro='';
    try{D=await buscar(S,rpc);}catch(e){erro=e.message||'Não foi possível carregar agora.';if(onde==='card')erro='';}
    finally{busy=false;}
    atualizaCard(S,p);if(onde==='tela')desenha(S,p);}

  window.PFCcat={pode,card,tela,carregar};
})();

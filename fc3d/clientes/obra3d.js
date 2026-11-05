/* FC Consultoria em Esquadria · Plataforma FC 3D · Simulador de Obra 3D (teste)
   Etapas: Em filtro FC → Liberado para sua avaliação → Aprovado (só então o link pode ir ao cliente final); Pedir ajuste volta para a FC.
   A empresa anexa o orçamento em PDF, o pedido chega ao card Obra em 3D do Painel da Matriz,
   a FC faz os ajustes e o link 3D (sem preço) aparece aqui pronto para encaminhar ao cliente.
   Liga por empresa: o Acesso FC cola o código do link de envio (Painel da Matriz → Obra em 3D → Código p/ Plataforma).
   Plano (teste de 3 dias ou pacote de projetos) é controlado no Painel da Matriz. Nenhum preço aparece aqui.
   © FC Consultoria em Esquadria (FC Desenvolvimento de Projetos de Compra e Venda LTDA · CNPJ 52.985.682/0001-32) · uso exclusivo */
(function(){
"use strict";
const BASE='https://fc-consultoria.github.io/treinamento/orcamentos/';
const ENVIO=t=>BASE+'obra3d-envio.html?t='+encodeURIComponent(t)+'&de=fc3d';/* de=fc3d: a página mostra Voltar para o painel */
const LINK=t=>BASE+'apresentacao.html?t='+encodeURIComponent(t);
const VER=t=>LINK(t)+'&de=fc3d';/* só para abrir daqui (com Voltar); o link copiado ou enviado ao cliente é o LINK limpo */
const ZAP='5566999867984';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dt=v=>v?new Date(v).toLocaleDateString('pt-BR'):'';
const ST={filtro:['Em filtro FC','a','O projeto está passando pelo filtro da FC. Assim que avaliado, será liberado para a sua avaliação.'],
 avaliar:['Liberado para sua avaliação','b','Abra, confira medidas e tipologias e aprove para liberar o envio ao seu cliente.'],
 ajuste:['Ajuste pedido','a','A FC recebeu o seu pedido de ajuste e vai liberar de novo para avaliação.'],
 aprovado:['Aprovado','o','Link liberado para encaminhar ao seu cliente.']};
let D=null,carregando=false,CEN=null,RE=null;

const CSS=`.o3p{margin:0 0 18px}.o3p .hero{margin-bottom:12px}
.o3p .pl{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
.o3p .pas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0 4px}
.o3p .pas div{border:1px solid var(--line,#dfe6e7);border-radius:12px;padding:10px 12px;background:var(--card,#fff)}
.o3p .pas b{display:block;font-size:13.5px;margin-bottom:2px}.o3p .pas span{font-size:12.5px;color:var(--mute,#5d6e73)}
.o3p .pas i{font-style:normal;display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#02717d;color:#fff;font:700 12px system-ui;margin-right:6px}
.o3p .lst{display:grid;gap:8px;margin-top:10px}
.o3p .pj{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid var(--line,#dfe6e7);border-radius:12px;padding:10px 12px;background:var(--card,#fff)}
.o3p .pj b{display:block;overflow-wrap:anywhere}.o3p .pj small{display:block;color:var(--mute,#5d6e73);font-size:12px}
.o3p .pj .ac{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.o3p .pj .ac .btn{padding:7px 11px;font-size:12.5px}
.o3p .fc{border:1px dashed #02717d;border-radius:12px;padding:12px;margin-top:12px}
.o3p .fc input{width:100%;padding:9px 10px;border:1px solid var(--line,#dfe6e7);border-radius:8px;font:inherit;margin:6px 0}
.o3p .chip.b{background:#dbeafe;color:#1e40af}
.o3p .nt{font-size:12.5px;background:#fff7e6;border:1px solid #f2d39b;border-radius:8px;padding:6px 8px;margin-top:6px;color:#6b4a0b}
.o3p .aj{grid-column:1/-1;display:grid;gap:6px}.o3p .aj textarea{width:100%;min-height:64px;padding:8px 10px;border:1px solid var(--line,#dfe6e7);border-radius:8px;font:inherit}
.o3p .msg{font-size:13px;color:var(--mute,#5d6e73);min-height:1em}
@media (max-width:900px){.o3p .pas{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.o3p .pas{grid-template-columns:1fr}.o3p .pj{grid-template-columns:1fr}.o3p .pj .ac{justify-content:flex-start}}`;
function css(){if(document.getElementById('o3p-css'))return;const s=document.createElement('style');s.id='o3p-css';s.textContent=CSS;document.head.appendChild(s);}

/* quem vê: gestor e colaborador da empresa, e a FC dentro da empresa. Fora do demonstrativo. */
/* 04/11/2026 · clientes que já usam a plataforma não veem o Simuladorr (nem o teste), a não ser que a FC ligue o código para eles */
const OCULTO=[];/* 04/11/2026 · todas as empresas da plataforma têm o Simulador; o Demonstrativo mostra a vitrine com o botão de testar */
function ehDemo(S,p){return !!S&&(S.demo||p==='demo');}
function pode(S,p){if(ehDemo(S,p))return true;return !!S&&!!S.empresa&&(S.matriz||S.papel==='gestor'||S.papel==='vendedor')&&(!OCULTO.includes(S.empresa)||!!S.obra3d);}
function planoTx(d){if(!d)return'';const us=+d.usados||0;
 if(d.plano==='teste'){const fim=d.validade&&new Date(d.validade)<new Date();return fim?{t:'Teste encerrado',c:'a',fim:true}:{t:'Teste até '+dt(d.validade),c:'o'};}
 if(d.limite!=null){const fim=us>=d.limite;return{t:`Pacote · ${us} de ${d.limite} projetos`,c:fim?'a':'o',fim};}
 return{t:'Liberado',c:'o'};}

function html(S,p){if(ehDemo(S,p)){css();const pedir=`https://wa.me/${ZAP}?text=${encodeURIComponent('Olá, FC! Conheci a Plataforma FC 3D pelo demonstrativo e quero saber do Simulador de Obra 3D para a '+(S.empresa_nome||'minha empresa')+'.')}`;
  return `<section class="o3p" id="o3p"><div class="hero"><div><span class="chip" style="background:#F2C14E;color:#4A3300">Novidade da plataforma</span><h2 style="margin-top:8px">Simulador de Obra 3D</h2><p>O orçamento da obra vira uma apresentação em 3D, com a marca da sua empresa, para o cliente abrir no celular. O link vai sem preço, e você aprova antes de enviar.</p></div><div class="bts"><a class="btn pri" href="${pedir}" target="_blank" rel="noopener">Quero conhecer</a></div></div>
  <div class="pas"><div><b><i>1</i>Anexe a Proposta comercial</b><span>O PDF da proposta gerada pelo sistema, com local, tipologia e medidas de cada item.</span></div><div><b><i>2</i>Anexe o Orientativo de Montagem</b><span>O PDF do Orientativo do mesmo orçamento, com a lista de corte. Sem os dois PDFs, o envio não segue.</span></div><div><b><i>3</i>Filtro FC</b><span>A FC confere e monta o 3D com a marca da sua empresa e libera para a sua avaliação.</span></div><div><b><i>4</i>Avalie e encaminhe</b><span>Você confere e aprova. O link, sem preço, fica liberado para o seu cliente.</span></div></div></section>`;}
 if(S&&S.matriz&&!S.empresa){css();return `<section class="o3p" id="o3p"><div class="hero"><div><span class="chip" style="background:#F2C14E;color:#4A3300">Novo · teste · só a FC vê esta orientação</span><h2 style="margin-top:8px">Simulador de Obra 3D</h2><p>Cada empresa tem o seu link de envio e o seu plano (teste de 3 dias ou pacote). Escolha a empresa em <b>Dentro de</b>, no topo, para ver como ela vê e ligar o Simulador com o código do Painel da Matriz → Obra em 3D.</p></div><div class="bts"><a class="btn pri" href="https://fc-consultoria.github.io/treinamento/orcamentos/obra3d.html" target="_blank" rel="noopener">Abrir Obra em 3D na Matriz</a></div></div></section>`;}
 if(!pode(S,p))return'';css();
 const pas=`<div class="pas"><div><b><i>1</i>Anexe a Proposta comercial</b><span>O PDF da proposta gerada pelo sistema, com local, tipologia e medidas de cada item.</span></div><div><b><i>2</i>Anexe o Orientativo de Montagem</b><span>O PDF do Orientativo do mesmo orçamento, com a lista de corte. Sem os dois PDFs, o envio não segue.</span></div><div><b><i>3</i>Filtro FC</b><span>A FC confere e monta o 3D com a marca da sua empresa e libera para a sua avaliação.</span></div><div><b><i>4</i>Avalie e encaminhe</b><span>Você confere e aprova. O link, sem preço, fica liberado para o seu cliente.</span></div></div>`;
 if(!S.obra3d){
  const pedir=`https://wa.me/${ZAP}?text=${encodeURIComponent('Olá, FC! Sou da '+(S.empresa_nome||'empresa')+' e quero testar o Simulador de Obra 3D por 3 dias na Plataforma FC 3D.')}`;
  return `<section class="o3p" id="o3p"><div class="hero"><div><span class="chip" style="background:#F2C14E;color:#4A3300">Novo · teste de 3 dias</span><h2 style="margin-top:8px">Simulador de Obra 3D</h2><p>Transforme o orçamento da obra numa apresentação em 3D, com a marca da sua empresa, para o cliente abrir no celular. Sem preço no link.</p></div><div class="bts"><a class="btn pri" href="${pedir}" target="_blank" rel="noopener">Quero testar por 3 dias</a></div></div>${pas}
  ${S.matriz?`<div class="fc"><b>Acesso FC · ligar o Simulador de Obra 3D desta empresa</b><p class="mute" style="font-size:13px;margin:4px 0 0">Crie o link de envio no Painel da Matriz (Obra em 3D → Links de envio, plano Teste ou Pacote), toque em <b>Código p/ Plataforma</b> e cole aqui.</p><input id="o3pCod" placeholder="Código do link de envio" autocomplete="off"><button class="btn pri" type="button" id="o3pSalvar">Ligar Simulador de Obra 3D</button> <span class="msg" id="o3pMsg" role="status"></span></div>`:''}</section>`;}
 return `<section class="o3p" id="o3p"><div class="hero"><div><span class="chip" style="background:#F2C14E;color:#4A3300">Novo</span><h2 style="margin-top:8px">Simulador de Obra 3D</h2><p>Anexe a Proposta comercial e o Orientativo de Montagem gerados pelo sistema. O projeto passa pelo filtro da FC e volta para a sua avaliação. Depois de aprovado, o link 3D, sem preço, fica liberado para o seu cliente.</p><div class="pl" id="o3pPl"><span class="chip">Carregando…</span></div></div><div class="bts"><a class="btn pri" id="o3pEnv" href="${ENVIO(S.obra3d)}">⬆ Anexar Proposta e Orientativo (PDF)</a></div></div>
  ${pas}<div class="cab" style="margin-top:14px"><div><h2 style="font-size:18px">Projetos enviados</h2></div><button class="btn sec" type="button" id="o3pAtu">↻ Atualizar</button></div><div class="lst" id="o3pLst"><p class="mute">Carregando…</p></div>
  ${S.matriz?`<div class="fc"><b>Acesso FC</b><p class="mute" style="font-size:13px;margin:4px 0 0">Plano e liberação de projetos ficam no Painel da Matriz → Obra em 3D. Para trocar o link desta empresa, cole outro código; deixe vazio para desligar.</p><input id="o3pCod" placeholder="Código do link de envio" autocomplete="off" value="${e(S.obra3d)}"><button class="btn sec" type="button" id="o3pSalvar">Salvar</button> <span class="msg" id="o3pMsg" role="status"></span></div>`:''}</section>`;}

function pinta(S){const pl=document.getElementById('o3pPl'),ls=document.getElementById('o3pLst');if(!pl||!ls)return;
 if(D===false){pl.innerHTML='<span class="chip a">Sem conexão</span>';ls.innerHTML='<p class="mute">Não foi possível carregar os projetos. Confira a internet e toque em Atualizar.</p>';return;}
 if(!D){pl.innerHTML='<span class="chip a">Link de envio desligado</span>';ls.innerHTML='<p class="mute">O Simulador de Obra 3D desta empresa está pausado. Fale com a FC Consultoria.</p>';const b=document.getElementById('o3pEnv');if(b){b.removeAttribute('href');b.classList.add('sec');b.classList.remove('pri');b.setAttribute('aria-disabled','true');}return;}
 const p=planoTx(D);const pedir=`https://wa.me/${ZAP}?text=${encodeURIComponent('Olá, FC! Sou da '+(S.empresa_nome||'empresa')+' e quero liberar o pacote de projetos do Simulador de Obra 3D.')}`;
 pl.innerHTML=`<span class="chip ${p.c}">${e(p.t)}</span>${p.fim?`<a class="btn sec" style="padding:6px 11px;font-size:12.5px" href="${pedir}" target="_blank" rel="noopener">Falar com a FC para liberar</a>`:''}`;
 const env=document.getElementById('o3pEnv');if(env&&p.fim){env.removeAttribute('href');env.classList.add('sec');env.classList.remove('pri');env.setAttribute('aria-disabled','true');env.title=p.t;}
 const P=D.projetos||[];
 ls.innerHTML=P.length?P.map(x=>{const st=ST[x.status]||ST.filtro;const u=x.link?LINK(x.link):'';
  const zap=u?`https://wa.me/?text=${encodeURIComponent('Segue a apresentação 3D da sua obra'+(x.obra?' ('+x.obra+')':'')+': '+u)}`:'';
  const ac=x.status==='avaliar'?`<a class="btn sec" href="${e(VER(x.link))}">Abrir para avaliar</a><button class="btn pri" type="button" data-o3ok="${e(x.id)}">✓ Aprovar</button><button class="btn sec" type="button" data-o3aj="${e(x.id)}">Pedir ajuste</button>`
   :x.status==='aprovado'?`<a class="btn sec" href="${e(VER(x.link))}">Abrir</a><button class="btn sec" type="button" data-o3c="${e(u)}">Copiar link</button><a class="btn pri" href="${e(zap)}" target="_blank" rel="noopener">WhatsApp</a>`:'';
  return `<div class="pj" data-pj="${e(x.id)}"><div><b>${e(x.obra||x.cliente||'Obra')}</b><small>${x.numero?'Orçamento '+e(x.numero)+' · ':''}${x.itens} ${x.itens===1?'item':'itens'} · enviado em ${dt(x.criado)}</small><small><span class="chip ${st[1]}" style="margin-top:4px">${st[0]}</span> ${st[2]}</small>${x.nota?`<div class="nt"><b>Seu pedido de ajuste:</b> ${e(x.nota)}</div>`:''}</div>
   <div class="ac">${ac}</div></div>`}).join('')
  :`<p class="mute">Nenhum orçamento enviado ainda. Toque em <b>Anexar Proposta e Orientativo (PDF)</b> para começar.</p>`;
 ls.querySelectorAll('[data-o3c]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.o3c);b.textContent='✓ Copiado';setTimeout(()=>{if(b.isConnected)b.textContent='Copiar link'},1800);}catch(_){prompt('Copie o link:',b.dataset.o3c);}});
 const avaliar=async(pid,ok,nota,msgEl)=>{try{await CEN('obra3d_envio_avaliar',{tok:S.obra3d,pid,ok,nota:nota||''});if(RE)RE();}catch(err){if(msgEl)msgEl.textContent='Não foi possível salvar. Confira a internet e tente de novo.';}};
 ls.querySelectorAll('[data-o3ok]').forEach(b=>b.onclick=()=>{if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Confirmar aprovação';setTimeout(()=>{if(b.isConnected){b.dataset.c='';b.textContent='✓ Aprovar'}},4000);return;}b.disabled=true;b.textContent='Salvando…';avaliar(b.dataset.o3ok,true,'',null);});
 ls.querySelectorAll('[data-o3aj]').forEach(b=>b.onclick=()=>{const card=b.closest('.pj');if(card.querySelector('.aj'))return;
  card.insertAdjacentHTML('beforeend',`<div class="aj"><label class="mute" style="font-size:13px">O que precisa ajustar? (item, medida, tipologia…)</label><textarea maxlength="800"></textarea><div><button class="btn pri" type="button">Enviar pedido de ajuste</button> <span class="msg" role="status"></span></div></div>`);
  const aj=card.querySelector('.aj'),ta=aj.querySelector('textarea'),m=aj.querySelector('.msg');ta.focus();
  aj.querySelector('button').onclick=()=>{if(ta.value.trim().length<3){m.textContent='Descreva o ajuste.';ta.focus();return;}m.textContent='Enviando…';avaliar(card.dataset.pj,false,ta.value,m);};});}

async function carregar(S,cen,rpc,refazer,p){if(ehDemo(S,p)||!pode(S,p)||!document.getElementById('o3p'))return;
 CEN=cen;RE=()=>carregar(S,cen,rpc,refazer,p);
 const sv=document.getElementById('o3pSalvar');
 if(sv)sv.onclick=async()=>{const m=document.getElementById('o3pMsg');m.textContent='Salvando…';try{const r=await rpc('pfc_obra3d_definir',{p_token:S.token,p_cod:document.getElementById('o3pCod').value});S.obra3d=r.obra3d;D=null;refazer();}catch(err){m.textContent=err.message||'Não foi possível salvar.';}};
 if(!S.obra3d||carregando)return;
 const at=document.getElementById('o3pAtu');if(at)at.onclick=()=>carregar(S,cen,rpc,refazer,p);
 carregando=true;try{D=await cen('obra3d_envio_meus',{tok:S.obra3d});}catch(_){D=false;}carregando=false;pinta(S);}

/* ao voltar da aba do envio, atualiza a lista sozinho */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&window.PFCo3d&&PFCo3d._re)PFCo3d._re();});
window.PFCo3d={html,carregar,pode};
})();

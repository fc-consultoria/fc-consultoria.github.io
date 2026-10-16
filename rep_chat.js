/* ===== Conversa de orçamento (páginas das representadas) ===== */
(function(){
const SB='https://cpkjphodruyxfouirhpd.supabase.co',KEY='sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg',WA='5566999867984';
const esc=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const LS={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:v;}catch(_){return d;}},s(k,v){try{localStorage.setItem(k,v);}catch(_){}}};
let S=LS.g('fc_cv','');if(!S||S.length<12){const a=new Uint8Array(16);(crypto.getRandomValues?crypto.getRandomValues(a):a.forEach((_,i)=>a[i]=Math.random()*256|0));S='cv'+[...a].map(b=>b.toString(36).padStart(2,'0')).join('').slice(0,26);LS.s('fc_cv',S);}
let CFG={pag:'site',marca:'FC Consultoria',cor:'#1f6f9a'},MSG=[],aberto=false,tm=null,enviando=false;
const perfil=()=>{try{return JSON.parse(LS.g('fc_cv_p','{}'))||{};}catch(_){return {};}};
const rpc=(fn,body)=>fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
function hit(ev,ref){try{if(LS.g('fc_eu','')==='1')return;let s=sessionStorage.getItem('fc_s')||'x';fetch(SB+'/rest/v1/rpc/site_hit',{method:'POST',keepalive:true,headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({p_s:s,p_pag:CFG.pag,p_ev:ev,p_o:sessionStorage.getItem('fc_o')||'direto',p_ref:ref||''})}).catch(()=>{});}catch(_){}}
async function ler(){try{const r=await rpc('site_conv_ler',{p_s:S,p_desde:null});if(!r.ok)return;const j=await r.json();if(Array.isArray(j)){const n0=MSG.length;MSG=j;if(MSG.length!==n0)desenha();badge();}}catch(_){}}
function naoLidas(){const v=+LS.g('fc_cv_visto','0');return MSG.filter(m=>m.de==='fc'&&m.id>v).length;}
function badge(){const b=document.getElementById('rcB');if(!b)return;const n=aberto?0:naoLidas();b.querySelector('i').textContent=n||'';b.querySelector('i').style.display=n?'flex':'none';if(n&&!aberto)b.classList.add('pulse');else b.classList.remove('pulse');}
function marcar(){const f=MSG.filter(m=>m.de==='fc');if(f.length)LS.s('fc_cv_visto',String(f[f.length-1].id));badge();}
function agenda(){clearTimeout(tm);if(!MSG.length&&LS.g('fc_cv_on','')!=='1'&&!aberto)return;tm=setTimeout(async()=>{await ler();agenda();},aberto?6000:25000);}
function hm(t){const d=new Date(t);return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}
function desenha(){const L=document.getElementById('rcL');if(!L)return;const p=perfil();
 L.innerHTML=(MSG.length?'':`<div class="rcI">${esc(CFG.ola||'Olá! Escreva o que você precisa (produto, medida, quantidade).')} O Fernando, da FC Consultoria, responde por aqui${p.fone?' e pelo seu WhatsApp':''}.</div>`)+MSG.map(m=>`<div class="rcM ${m.de==='fc'?'fc':'eu'}"><span>${esc(m.txt).replace(/\n/g,'<br>')}</span><small>${m.de==='fc'?'FC Consultoria · ':''}${hm(m.criado_em)}</small></div>`).join('');
 L.scrollTop=L.scrollHeight;const F=document.getElementById('rcF');if(F)F.style.display=(p.nome?'none':'grid');}
let ONL=null;const HOR='seg a sex, 8h às 11h e 13h às 17h';
async function onl(){try{const r=await fetch(SB+'/rest/v1/rpc/fc_online',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:'{}'});ONL=r.ok?!!(await r.json()):null;}catch(_){ONL=null;}
 const st=document.getElementById('rcSt');if(st&&ONL!==null)st.innerHTML=ONL?'<span style="color:#7be0a0">●</span> Suporte online agora':'<span style="color:#9aa9b1">●</span> Offline · '+HOR+'. Deixe a mensagem: respondemos no próximo horário.';
 const b=document.getElementById('rcB');if(b)b.classList.toggle('onl',!!ONL);}
setInterval(()=>{if(document.visibilityState==='visible'&&document.getElementById('rcB'))onl();},60000);
function abrir(txt){aberto=true;onl();const P=document.getElementById('rcP');P.classList.add('on');document.getElementById('rcB').setAttribute('aria-expanded','true');desenha();marcar();
 const T=document.getElementById('rcT');if(txt){T.value=txt;}setTimeout(()=>{const p=perfil();(p.nome?T:document.getElementById('rcN')).focus();},60);ler();agenda();hit('conv_abrir',txt?String(txt).slice(0,60):'');}
function fechar(){aberto=false;document.getElementById('rcP').classList.remove('on');document.getElementById('rcB').setAttribute('aria-expanded','false');agenda();badge();}
async function enviar(e){e.preventDefault();if(enviando)return;const T=document.getElementById('rcT'),M=document.getElementById('rcMsg'),txt=T.value.trim();let p=perfil();
 if(!p.nome){const nome=document.getElementById('rcN').value.trim(),fone=document.getElementById('rcW').value.trim(),cid=document.getElementById('rcC').value.trim();if(nome.length<2){M.textContent='Informe o seu nome.';document.getElementById('rcN').focus();return;}p={nome,fone,cidade:cid};LS.s('fc_cv_p',JSON.stringify(p));}
 if(!txt){M.textContent='Escreva a sua mensagem.';T.focus();return;}
 enviando=true;M.textContent='Enviando…';const B=document.getElementById('rcS');B.disabled=true;
 try{const r=await rpc('site_conv_env',{p_s:S,p_pag:CFG.pag,p_nome:p.nome,p_fone:p.fone||'',p_cidade:p.cidade||'',p_txt:txt,p_itens:null});
  if(!r.ok)throw 0;T.value='';M.textContent='✔ Enviado. O Fernando responde por aqui.';LS.s('fc_cv_on','1');hit('conv_env',CFG.marca);await ler();desenha();agenda();setTimeout(()=>{if(M.textContent.startsWith('✔'))M.textContent='';},5000);}
 catch(_){M.innerHTML='Não consegui enviar agora. <a href="https://wa.me/'+WA+'?text='+encodeURIComponent(txt)+'" target="_blank" rel="noopener">Mandar pelo WhatsApp</a>';}
 enviando=false;B.disabled=false;}
function montar(){if(document.getElementById('rcB'))return;const c=CFG.cor;const st=document.createElement('style');st.textContent=`
#rcB{position:fixed;right:18px;bottom:18px;z-index:70;display:flex;align-items:center;gap:8px;border:0;border-radius:30px;padding:13px 18px;min-height:48px;background:${c};color:#fff;font:700 15px system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.28)}
#rcB.onl::before{content:'';width:10px;height:10px;border-radius:50%;background:#3ddc7a;box-shadow:0 0 0 3px rgba(61,220,122,.3)}#rcB i{font-style:normal;display:none;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:11px;background:#e0372e;color:#fff;font-size:12px;padding:0 6px}
#rcB.pulse{animation:rcPu 1.6s infinite}@keyframes rcPu{0%{box-shadow:0 0 0 0 rgba(224,55,46,.55)}100%{box-shadow:0 0 0 16px rgba(224,55,46,0)}}
#rcP{position:fixed;right:18px;bottom:84px;z-index:75;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 110px));background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;font:400 15px/1.45 system-ui,sans-serif;color:#14231f}
#rcP.on{display:flex;animation:rcIn .25s ease}@keyframes rcIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.rcH{background:#0c161d;color:#fff;padding:12px 14px;display:flex;gap:10px;align-items:center}.rcH img{width:38px;height:38px;border-radius:9px}.rcH b{display:block;font-size:15.5px}.rcH small{color:#b5c7cf;font-size:12.5px}
.rcH button{margin-left:auto;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;font-size:22px;cursor:pointer}
#rcL{flex:1;overflow:auto;padding:12px;background:#eef2f4;display:flex;flex-direction:column;gap:8px}
.rcI{background:#fff;border:1px dashed #c9d3da;border-radius:12px;padding:10px 12px;font-size:14px;color:#41525c}
.rcM{max-width:85%;display:flex;flex-direction:column;gap:2px}.rcM span{padding:9px 12px;border-radius:14px;word-wrap:break-word;white-space:normal}.rcM small{font-size:11px;color:#7a8a93}
.rcM.eu{align-self:flex-end;align-items:flex-end}.rcM.eu span{background:${c};color:#fff;border-bottom-right-radius:4px}
.rcM.fc{align-self:flex-start}.rcM.fc span{background:#fff;border:1px solid #dbe3e7;border-bottom-left-radius:4px}
#rcForm{border-top:1px solid #e3e8ec;padding:10px;display:flex;flex-direction:column;gap:8px;background:#fff}
#rcF{display:grid;grid-template-columns:1fr 1fr;gap:6px}#rcF input{min-width:0}#rcF input:first-child{grid-column:1/-1}
#rcForm input,#rcForm textarea{font:400 15px system-ui,sans-serif;border:1px solid #c9d3da;border-radius:10px;padding:9px 10px;width:100%;box-sizing:border-box}
#rcForm textarea{resize:none;height:64px}.rcR{display:flex;gap:8px;align-items:center}
#rcS{border:0;border-radius:10px;background:${c};color:#fff;font:700 15px system-ui;padding:11px 16px;min-height:44px;cursor:pointer;margin-left:auto}
#rcMsg{font-size:12.5px;color:#56675f}#rcMsg a{color:#1f9d55;font-weight:700}
.rcWa{font-size:12.5px;color:#1f9d55;font-weight:700;text-decoration:none}
@media(max-width:560px){#rcP{right:0;left:0;bottom:0;width:100%;height:min(88vh,640px);border-radius:18px 18px 0 0}#rcB{right:12px;bottom:12px}}
@media(prefers-reduced-motion:reduce){#rcB.pulse,#rcP.on{animation:none}}`;document.head.appendChild(st);
 const b=document.createElement('button');b.type='button';b.id='rcB';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','rcP');b.innerHTML=(CFG.rotulo||'💬 Pedir orçamento pela conversa')+' <i></i>';b.onclick=()=>aberto?fechar():abrir();document.body.appendChild(b);setTimeout(onl,800);
 const p=document.createElement('div');p.id='rcP';p.setAttribute('role','dialog');p.setAttribute('aria-label','Conversa com a FC Consultoria');
 p.innerHTML=`<div class="rcH"><img src="${CFG.logo||'../img/logo-fc-160.jpg'}" alt=""><div><b>${CFG.marca==='FC Consultoria'?'FC Consultoria':'FC Consultoria · '+esc(CFG.marca)}</b><small id="rcSt">${esc(CFG.sub||'Orçamento pela conversa · respondemos por aqui')}</small></div><button type="button" id="rcX" aria-label="Fechar conversa">×</button></div>
  <div id="rcL" aria-live="polite"></div>
  <form id="rcForm"><div id="rcF"><input id="rcN" autocomplete="name" placeholder="Seu nome *" aria-label="Seu nome"><input id="rcW" autocomplete="tel" inputmode="tel" placeholder="WhatsApp (opcional)" aria-label="WhatsApp"><input id="rcC" placeholder="Cidade/UF" aria-label="Cidade"></div>
  <textarea id="rcT" placeholder="${esc(CFG.ph||'Ex.: preciso de 10 rolos da fita glazing 12 mm')}" aria-label="Mensagem"></textarea>
  <div class="rcR"><a class="rcWa" href="https://wa.me/${WA}" target="_blank" rel="noopener">ou chame no WhatsApp</a><button type="submit" id="rcS">Enviar</button></div><div id="rcMsg" role="status"></div></form>`;
 document.body.appendChild(p);document.getElementById('rcX').onclick=fechar;document.getElementById('rcForm').onsubmit=enviar;
 document.getElementById('rcT').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&window.innerWidth>700){e.preventDefault();document.getElementById('rcForm').requestSubmit();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&aberto)fechar();});
 p.querySelector('.rcWa').addEventListener('click',()=>hit('rep_whats','conversa'));
 ler().then(agenda);}
async function enviarDireto(p,txt,pag){if(!p||!p.nome||!txt)throw new Error('dados');LS.s('fc_cv_p',JSON.stringify({nome:p.nome,fone:p.fone||'',cidade:p.cidade||''}));
 const r=await rpc('site_conv_env',{p_s:S,p_pag:pag||CFG.pag,p_nome:p.nome,p_fone:p.fone||'',p_cidade:p.cidade||'',p_txt:txt,p_itens:null});if(!r.ok)throw new Error('envio');
 LS.s('fc_cv_on','1');hit('conv_env',pag||CFG.marca);await ler();return true;}
window.FCRC={init(o){CFG=Object.assign(CFG,o||{});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();},abrir(t){montar();abrir(t);},enviar:enviarDireto};
})();

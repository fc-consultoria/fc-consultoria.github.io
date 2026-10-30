/* Substituição de perfil · módulo independente (usado no catálogo da empresa)
   Só aparece para a equipe interna logada na Plataforma FC 3D. © FC Consultoria em Esquadria */
(function(){
const SPU='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/',SPK='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
const CBU='https://cpkjphodruyxfouirhpd.supabase.co/rest/v1/',CBK='sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg';
const EMP=['cde','cde-vidros','casa-bandeirante','guapore-vidros','guapore-sinop'],IMG='/perfis/img/';
const IGUAL=['mda','cen','ven','cam','max','bas','ptn','gir','vd','dup'];
const st={S:null,tk:null,P:{},IDX:{},it:{},temCat:false,ap:[],q:'',pick:null};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{const n=parseFloat(String(v||'').replace(',','.'));return isNaN(n)?null:n;};
const kg=n=>n==null?'':n.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:3});
const mm=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:1});
const F=c=>st.IDX[c]||null;
async function rpc(fn,b){const r=await fetch(SPU+fn,{method:'POST',headers:{apikey:SPK,'Content-Type':'application/json'},body:JSON.stringify(b)});const j=await r.json();if(!r.ok)throw new Error(j.message||'Erro');return j;}
function tok(n){const s=String(n||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');const f=new Set();
 [['mao de amigo','mda'],['interna','int'],['externa','ext'],['central','cen'],['duplo','dup'],['vidro duplo','vd'],['veneziana','ven'],['tela','tel'],['camarao','cam'],['maxim','max'],['basculante','bas'],['portinhola','ptn'],['giro','gir'],['parapeito','par'],['bandeira','ban'],['reforco','ref'],['largo','lar'],['puxador','pux'],['53 mm','m53'],['65 mm','m65'],['sequencia','seq'],['macarrao','mac']].forEach(([k,v])=>{if(s.includes(k))f.add(v);});
 const fo=s.match(/(\d)(?:\s*[e\/]\s*(\d))?\s*folhas/);if(fo){f.add('f'+fo[1]);if(fo[2])f.add('f'+fo[2]);}
 if(/\bporta\b/.test(s)&&!/janela/.test(s))f.add('porta');if(/janela/.test(s)&&!/porta/.test(s))f.add('janela');return f;}
const disp=c=>{if(!st.temCat)return true;const e=st.it[c];return !!(e&&!e.oc);};
const est=c=>{const e=st.it[c];return st.temCat&&e&&e.sc===false;};
function auto(b){const a=F(b);if(!a)return [];const ta=tok(a.n),pa=num(a.p),da=Array.isArray(a.d)?a.d:null;
 const nao=new Set(st.ap.filter(x=>x.b===b&&x.st==='nao').map(x=>x.s));
 return Object.values(st.P).filter(q=>q.k!==a.k&&q.l===a.l&&q.g===a.g&&disp(q.k)&&!nao.has(q.k)).map(q=>{const t=tok(q.n);
  if(IGUAL.some(k=>ta.has(k)!==t.has(k)))return null;
  if((ta.has('int')&&t.has('ext'))||(ta.has('ext')&&t.has('int')))return null;
  if((ta.has('porta')&&t.has('janela'))||(ta.has('janela')&&t.has('porta')))return null;
  const fa=[...ta].filter(k=>/^f\d/.test(k)),fb=[...t].filter(k=>/^f\d/.test(k));if(fa.length&&fb.length&&!fa.some(k=>fb.includes(k)))return null;
  let sc=0;ta.forEach(k=>{sc+=t.has(k)?2:-1;});t.forEach(k=>{if(!ta.has(k))sc-=1;});
  const db=Array.isArray(q.d)?q.d:null;if(da&&db)sc-=Math.abs(da[0]-db[0])/8;const pb=num(q.p);if(pa&&pb)sc-=Math.abs(pa-pb)*2;if(est(q.k))sc+=1.5;
  return {c:q.k,sc};}).filter(x=>x&&x.sc>-4).sort((x,y)=>y.sc-x.sc).slice(0,3).map(x=>x.c);}
function base(q){q=String(q||'').trim().toUpperCase().replace(/\s+/g,'');if(!q)return null;if(F(q))return F(q).k;
 const e=Object.values(st.it).find(x=>[x.c,x.cg].some(v=>v&&String(v).toUpperCase().replace(/\s+/g,'')===q));return e&&F(e.base)?F(e.base).k:null;}
const cod=c=>{const e=st.it[c];const cc=e&&(e.cg||e.c);return cc&&cc!==c?cc:c;};
function lin(c,tag,mat,b){const p=F(c);if(!p)return '';const img=p.img||IMG+(p.d3?p.i:'c'+p.i)+'.webp',peso=num(p.p);
 return `<div class="fsr"><button type="button" class="fsrow" data-fspick="${esc(cod(c))}" data-fsbase="${esc(c)}" title="Ver no catálogo"><img loading="lazy" src="${img}" alt=""><div><small>${esc(tag)}</small><b>${esc(cod(c))}</b><small>${esc(p.n)}</small>${Array.isArray(p.d)?`<small>📐 ${mm(p.d[0])} × ${mm(p.d[1])} mm</small>`:''}</div><div class="w">${peso!=null?kg(peso)+'<small> kg/m</small>':''}</div></button>
 <div class="fsm"><span class="fst">sob consulta</span>${mat&&tag!=='Sugestão'&&tag!=='Pesquisado'?`<button data-fsap="${esc(b)}|${esc(c)}|" title="Tirar esta indicação">desfazer</button>`:''}${mat&&tag==='Sugestão'?`<button data-fsap="${esc(b)}|${esc(c)}|ok">✓ aprovar</button><button data-fsap="${esc(b)}|${esc(c)}|nao" title="Não indicar">✕</button>`:''}</div></div>`;}
function res(){const box=document.getElementById('fsRes');const q=st.q.trim();
 if(!q){box.innerHTML='';return;}
 const b=base(q),mat=st.S&&st.S.matriz;if(!b){box.innerHTML='<p class="fsn fsw">Código não encontrado na base Suprema/Gold.<br><b>Confirme com o serralheiro ou com compras.</b></p>';return;}
 const d=disp(b),ok=st.ap.filter(x=>x.b===b&&x.st==='ok'&&F(x.s)).map(x=>F(x.s).k),au=auto(b).filter(c=>!ok.includes(c)),okD=ok.filter(disp);
 let h=`<div class="fsh"><span class="fst ${d?'ok':'no'}">${d?'Trabalhamos com este perfil':'Não trabalhamos com este perfil'}</span></div>${lin(b,'Pesquisado',false)}`;
 if(okD.length)h+='<h4>Indicado para substituir</h4>'+okD.map(c=>lin(c,'Indicação',mat,b)).join('');
 if(au.length)h+=`<h4>${okD.length?'Outras opções':'Possível substituição'}</h4>`+au.map(c=>lin(c,'Sugestão',mat,b)).join('');
 
 if(mat)h+=`<form id="fsAdd" class="fsadd"><input name="c" placeholder="Indicar outro código para ${esc(b)}"><button>+ indicar</button></form>`;
 if(!okD.length&&!au.length)h+=`<p class="fsn fsw">Sem indicação de substituição para ${esc(b)}.<br><b>Verifique com o serralheiro ou com compras qual perfil usar.</b></p>`;
 h+='<p class="fsn fsw">⚠ Substituição é sugestão. <b>Confirme com o serralheiro</b> antes de fechar o pedido.<br>📸 <b>Faça um print desta tela e encaminhe ao cliente para ele confirmar.</b></p>';box.innerHTML=h;}
function ui(abrir,alvo){const css=document.createElement('style');css.textContent=`#fsBt{position:fixed;left:16px;bottom:16px;z-index:9990;border:0;border-radius:99px;background:#02717d;color:#fff;font:700 14px system-ui,sans-serif;padding:10px 15px;box-shadow:0 6px 18px #0003;cursor:pointer}
#fsPn{position:fixed;left:16px;bottom:16px;z-index:9991;width:min(380px,calc(100vw - 32px));max-height:min(72vh,640px);display:flex;flex-direction:column;background:#fff;color:#1d2a30;border:1px solid #dde3e6;border-radius:16px;box-shadow:0 14px 40px #0003;overflow:hidden;font:14px system-ui,sans-serif}
#fsPn[hidden]{display:none}#fsPn .hd{display:flex;align-items:center;gap:8px;padding:12px 14px 8px}#fsPn .hd b{flex:1;font-weight:800;font-size:15px}#fsPn .hd button{border:0;background:none;font-size:18px;cursor:pointer;color:#5d6b72}
#fsQ{margin:0 14px 8px;font:600 16px system-ui,sans-serif;padding:9px 12px;border:1px solid #dde3e6;border-radius:10px;text-transform:uppercase}#fsRes{overflow:auto;padding:0 14px 14px}
#fsRes h4{font:800 12px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#5d6b72;margin:12px 0 4px}.fsr{margin-bottom:6px}
.fsrow{display:grid;grid-template-columns:96px 1fr auto;gap:10px;align-items:center;border:1px solid #dde3e6;border-radius:10px;padding:5px 8px;background:#fff;cursor:pointer;text-align:left;width:100%;font:inherit;color:inherit}.fsrow:hover{background:#eef7f8}
.fsrow img{width:96px;height:70px;object-fit:contain;background:#f3f6f7;border-radius:6px}.fsrow b{font-weight:800;font-size:16px}.fsrow small{display:block;color:#5d6b72;font-size:12.5px;line-height:1.25}.fsrow .w{font-weight:700;font-size:13px;text-align:right;white-space:nowrap}
.fsm{display:flex;gap:6px;align-items:center;justify-content:flex-end;margin-top:3px}.fsm button,.fsx button,.fsadd button{border:1px solid #dde3e6;background:#fff;border-radius:99px;font:700 12px system-ui,sans-serif;padding:3px 9px;cursor:pointer}
.fst{font:700 11.5px system-ui,sans-serif;padding:2px 8px;border-radius:99px;background:#eef1f3;color:#55636b}.fst.ok{background:#e1f4ea;color:#17683f}.fst.no{background:#fde8e6;color:#9b2c22}
.fsh{margin:2px 0 6px}.fsn{font-size:13.5px;line-height:1.45;color:#5d6b72;margin:8px 0}.fsw{background:#fff6e0;border:1px solid #f1d38a;color:#5c3d00;border-radius:10px;padding:8px 10px}.fsx{font-weight:600;font-size:13px;margin:3px 0}.fsadd{display:flex;gap:6px;margin-top:10px}.fsadd input{flex:1;font:600 13px system-ui,sans-serif;padding:6px 9px;border:1px solid #dde3e6;border-radius:8px}
#fsPn{width:min(300px,calc(100vw - 32px))}#fsPn .hd{padding:10px 12px 6px;gap:6px}#fsPn .hd b{font-size:14px}#fsQ{margin:0 12px 8px;font-size:15px;padding:8px 10px}#fsRes{padding:0 12px 12px}
.fsrow{grid-template-columns:64px 1fr auto;gap:8px;padding:4px 6px}.fsrow img{width:64px;height:50px}.fsrow b{font-size:14.5px}.fsrow small{font-size:11.5px}.fsrow .w{font-size:12px}
.fsv{border:1px solid #dde3e6!important;background:#fff!important;border-radius:99px;font:700 12px system-ui,sans-serif!important;padding:4px 9px;cursor:pointer;color:#02717d!important;white-space:nowrap}
#fsPn.fs{left:0!important;top:0!important;bottom:0!important;right:0;width:100vw;max-height:none;height:100vh;border-radius:0;border:0}
#fsPn.fs .hd{max-width:1180px;width:100%;margin:0 auto;padding:16px 20px 10px}#fsPn.fs .hd b{font-size:18px}#fsPn.fs #fsQ{max-width:1140px;width:calc(100% - 40px);margin:0 auto 12px;font-size:17px}
#fsPn.fs #fsRes{max-width:1180px;width:100%;margin:0 auto;padding:0 20px 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;align-content:start}
#fsPn.fs #fsRes>h4,#fsPn.fs #fsRes>.fsh,#fsPn.fs #fsRes>.fsn,#fsPn.fs #fsRes>.fsadd{grid-column:1/-1}
#fsPn.fs .fsrow{grid-template-columns:1fr;gap:6px;padding:10px}#fsPn.fs .fsrow img{width:100%;height:190px}#fsPn.fs .fsrow b{font-size:19px}#fsPn.fs .fsrow small{font-size:13px}#fsPn.fs .fsrow .w{text-align:left;font-size:15px}
#fsQ::placeholder{text-transform:none}#fsPn .hd{cursor:grab;touch-action:none}#fsPn .hd:active{cursor:grabbing}.fsg{color:#9aa8b0;font-size:16px;line-height:1;user-select:none}#fsPn.fs .hd{cursor:default}#fsPn.fs .fsg,#fsPn.fs #fsVt{display:none}
#fsPn.mv{position:fixed!important;z-index:9991;max-height:min(80vh,680px)}#fsPn.mv #fsRes{max-height:min(60vh,560px)}#fsPn.fs.mv{max-height:none}#fsPn.fs.mv #fsRes{max-height:none}#fsPn p,#fsPn .fsn{color:#5d6b72!important;margin:8px 0!important;font-size:13.5px!important;line-height:1.45!important;max-width:none!important}#fsPn .fsw,#fsPn .fsw b{color:#5c3d00!important}#fsPn h4{color:#5d6b72!important}#fsPn.inl{position:relative;left:auto;bottom:auto;width:100%;max-width:400px;justify-self:end;max-height:none;z-index:5;color:#1d2a30}#fsPn.inl #fsRes{max-height:min(55vh,520px)}#fsPn.inl #fsRes:empty{display:none}
#fsPn.inl.fs{position:fixed;max-width:none;z-index:9991}#fsPn.inl.fs #fsRes{max-height:none}@media print{#fsBt,#fsPn{display:none!important}}`;document.head.appendChild(css);
 const bt=document.createElement('button');bt.id='fsBt';bt.type='button';bt.textContent='🔁 Substituir perfil';
 const pn=document.createElement('div');pn.id='fsPn';pn.hidden=true;pn.innerHTML='<div class="hd"><button type="button" id="fsVolta" class="fsv" hidden>← Voltar</button><span class="fsg" title="Arraste para mudar o painel de lugar" aria-hidden="true">⠿</span><b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🔁 Substituir perfil</b><button type="button" id="fsVt" class="fsv" title="Voltar o painel para o lugar original" hidden>↺</button><button type="button" id="fsTc" class="fsv" title="Ver em tela cheia">⛶ Tela cheia</button><button type="button" id="fsX" aria-label="Fechar">✕</button></div><input id="fsQ" placeholder="Código do perfil · ex.: SU-041" autocomplete="off"><div id="fsRes"></div>';
 document.body.append(bt);if(alvo){pn.classList.add('inl');alvo.appendChild(pn);}else document.body.append(pn);const tog=(v,sem)=>{pn.hidden=!v;bt.hidden=v;try{localStorage.setItem('fcsub_fechado',v?'0':'1');}catch(_){}if(v){res();if(!sem)document.getElementById('fsQ').focus();try{repoe();}catch(_){}}};
 const cheia=v=>{pn.classList.toggle('fs',v);document.getElementById('fsVolta').hidden=!v;document.getElementById('fsTc').hidden=v;};
 document.getElementById('fsTc').onclick=()=>cheia(true);document.getElementById('fsVolta').onclick=()=>cheia(false);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pn.classList.contains('fs'))cheia(false);});
 bt.onclick=()=>tog(pn.hidden);document.getElementById('fsX').onclick=()=>{cheia(false);tog(false);};
 document.getElementById('fsQ').addEventListener('input',e=>{st.q=e.target.value;clearTimeout(st.t);st.t=setTimeout(res,250);});
 pn.addEventListener('submit',async e=>{if(e.target.id!=='fsAdd')return;e.preventDefault();const c=base(e.target.c.value)||e.target.c.value.trim().toUpperCase(),b=base(st.q);if(!b||!c)return;
  try{st.ap=await rpc('pfc_subst_salvar',{p_token:st.tk,p_base:b,p_sub:c,p_status:'ok'});res();}catch(er){alert(er.message);}});
 pn.addEventListener('click',async e=>{const a=e.target.closest('[data-fsap]');if(a){e.stopPropagation();const [b,c,s]=a.dataset.fsap.split('|');try{st.ap=await rpc('pfc_subst_salvar',{p_token:st.tk,p_base:b,p_sub:c,p_status:s||null});res();}catch(er){alert(er.message);}return;}
  const p=e.target.closest('[data-fspick]');if(p&&st.pick){if(pn.classList.contains('fs'))pn.classList.remove('fs');st.pick(p.dataset.fspick,p.dataset.fsbase);}},true);
 /* arrastar pelo topo do painel e soltar onde quiser (fica fixo na tela e o lugar é lembrado) */
 const hd=pn.querySelector('.hd'),vt=document.getElementById('fsVt'),K='fcsub_pos';
 const solto=(x,y)=>{const w=pn.offsetWidth,h=pn.offsetHeight;x=Math.max(4,Math.min(innerWidth-w-4,x));y=Math.max(4,Math.min(innerHeight-Math.min(h,120),y));
  if(pn.parentElement!==document.body)document.body.appendChild(pn);pn.classList.add('mv');pn.classList.remove('inl');pn.style.left=x+'px';pn.style.top=y+'px';pn.style.bottom='auto';vt.hidden=false;bt.hidden=true;return [x,y];};
 const original=()=>{try{localStorage.removeItem(K);}catch(_){}pn.classList.remove('mv');pn.style.left=pn.style.top=pn.style.bottom='';vt.hidden=true;if(alvo){pn.classList.add('inl');alvo.appendChild(pn);}};
 vt.onclick=original;
 hd.addEventListener('pointerdown',e=>{if(e.target.closest('button')||pn.classList.contains('fs')||e.button>0)return;const r=pn.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;let ult=null;
  hd.setPointerCapture(e.pointerId);document.body.style.userSelect='none';
  const mv=ev=>{ult=solto(ev.clientX-dx,ev.clientY-dy);};const up=()=>{hd.removeEventListener('pointermove',mv);hd.removeEventListener('pointerup',up);hd.removeEventListener('pointercancel',up);document.body.style.userSelect='';
   if(ult)try{localStorage.setItem(K,JSON.stringify({x:ult[0]/innerWidth,y:ult[1]/innerHeight}));}catch(_){}};
  hd.addEventListener('pointermove',mv);hd.addEventListener('pointerup',up);hd.addEventListener('pointercancel',up);});
 const repoe=()=>{try{const p=JSON.parse(localStorage.getItem(K));if(p&&!pn.hidden)solto(p.x*innerWidth,p.y*innerHeight);}catch(_){}};
 addEventListener('resize',()=>{if(pn.classList.contains('mv'))repoe();});
 if(alvo){/* no topo do catálogo: sempre aberto; ao rolar a página aparece o botão que volta para a pesquisa */
  document.getElementById('fsX').hidden=true;pn.hidden=false;res();bt.hidden=true;
  bt.onclick=()=>{alvo.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>document.getElementById('fsQ').focus({preventScroll:true}),450);};
  try{new IntersectionObserver(es=>{bt.hidden=es[0].isIntersecting||pn.classList.contains('fs')||pn.classList.contains('mv');}).observe(pn);}catch(_){}
  repoe();if(abrir)document.getElementById('fsQ').focus();return;}
 let fech=false;try{fech=localStorage.getItem('fcsub_fechado')==='1';}catch(_){}
 if(abrir||!fech){tog(true,!abrir);repoe();}}
window.FCSUB={async init(o){o=o||{};try{st.tk=localStorage.getItem('pfc-token');}catch(_){}if(!st.tk)return false;
 try{st.S=await rpc('pfc_sessao',{p_token:st.tk});}catch(_){return false;}const S=st.S;
 if(!S||S.demo||!(S.matriz||((S.papel==='gestor'||S.papel==='vendedor')&&EMP.includes(S.empresa))))return false;
 if(o.slug&&!S.matriz&&S.catalogo!==o.slug)return false;
 st.pick=o.pick||null;const slug=o.slug||S.catalogo;
 try{const j=await fetch('/fc3d/clientes/orientativo/perfis.json?v=1',{cache:'no-cache'}).then(r=>r.json());Object.entries(j.P).forEach(([k,v])=>{const x=Object.assign({k},v);st.P[k]=x;st.IDX[k]=x;});}catch(_){return false;}
 try{st.ap=await rpc('pfc_subst_lista',{p_token:st.tk})||[];}catch(_){}
 if(slug){try{const H={apikey:CBK};const c=(await fetch(CBU+'cat_clientes?select=id,linhas&slug=eq.'+encodeURIComponent(slug),{headers:H}).then(r=>r.json()))[0];
  if(c){const it=await fetch(CBU+'cat_itens?select=base,c,cg,oc,sc&cliente_id=eq.'+encodeURIComponent(c.id),{headers:H}).then(r=>r.json());st.temCat=true;const L=c.linhas||[];
   Object.values(st.P).forEach(q=>{if((q.l==='sup'&&L.includes('sup'))||(q.l==='gold'&&L.includes('gold')))st.it[q.k]={base:q.k,oc:false,sc:true};});
   it.forEach(x=>{const k=F(x.base)?F(x.base).k:x.base;if(st.it[k]||F(x.base))st.it[k]=Object.assign({},st.it[k]||{},x,{oc:!!x.oc,sc:x.sc!==false});});}}catch(_){}}
 ui(!!o.abrir,(typeof o.alvo==='function'?o.alvo():o.alvo)||null);return true;}};
})();

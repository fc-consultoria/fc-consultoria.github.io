/* Aplicação dos perfis nas tipologias · módulo do Catálogo 3D (site, Matriz e catálogos dos clientes)
   Mostra o perfil destacado dentro da tipologia montada com as seções reais do catálogo técnico.
   Conteúdo orientativo: a confirmação é sempre do serralheiro. © FC Consultoria em Esquadria */
(function(){
const BASE='/fc3d/clientes/';
const L3=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'];
/* base única: as mesmas montagens e seções da Plataforma FC 3D (desenho técnico e Montagens em 3D) */
let DADOS=null,SEC=null,AM=null,LIBS=null;
/* Completo: Matriz (window.FCAPL_FULL) e equipe logada na Plataforma FC 3D (mesma regra do Substituir perfil).
   Amostra: site aberto e link que as empresas mandam aos clientes. Só a janela de correr 2 folhas fica liberada; o resto vira convite para a plataforma. */
const FULL=(()=>{if(window.FCAPL_FULL)return true;try{return !!localStorage.getItem('pfc-token');}catch(_){return false;}})();
const ZAP='5566999867984';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dados=()=>DADOS||(DADOS=fetch(BASE+'aplicacao.json?v=3',{cache:'no-cache'}).then(r=>r.json()).catch(()=>({modelos:{},perfis:{}})));
const sc=u=>new Promise((ok,er)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=er;document.head.appendChild(s);});
const libs=()=>LIBS||(LIBS=(window.THREE&&THREE.REVISION==='128'?Promise.resolve():sc(L3[0])).then(()=>THREE.OrbitControls?null:sc(L3[1]))
 .then(()=>FULL?(window.FCM?null:sc(BASE+'tecnico/montagens.js?v=3')).then(()=>Promise.all([fetch(BASE+'tecnico/secoes.json?v=3').then(r=>r.json()).then(j=>{SEC=j;}),FCM.carregarAjustes()]))
  :fetch(BASE+'aplicacao-amostra.json?v=1').then(r=>r.json()).then(j=>{AM=j;})).catch(e=>{LIBS=null;throw e;}));
const livre=(D,k)=>FULL||(D.amostra||[]).includes(k);
/* código do card pode vir composto ("LG-024 / LG-115") */
const partes=c=>String(c||'').toUpperCase().split('/').map(x=>x.trim()).filter(Boolean);
const usos=(D,c)=>{const v=[],k={};partes(c).forEach(p=>((D.perfis||{})[p]||[]).forEach(a=>{if(!k[a.m]){k[a.m]=1;v.push(a);}}));return v;};

let css=false;
function estilo(){if(css)return;css=true;const s=document.createElement('style');s.textContent=`
#v3 .wr{position:relative}
#v3 .vb button.apb{border-color:#f2a024!important;font-weight:700}
#v3 .vb button.apb[aria-pressed="true"]{background:#f2a024!important;color:#1b1206!important;border-color:#f2a024!important}
.apl{position:absolute;inset:0;z-index:7;background:#fff;display:grid;grid-template-columns:minmax(0,1fr) 300px;color:#17222a;font-family:Barlow,system-ui,sans-serif;text-align:left}
.apl[hidden]{display:none!important}
.apl .ast{position:relative;min-height:260px;background:radial-gradient(circle at 50% 35%,#fff,#e9eef0);overflow:hidden}
.apl .acv{position:absolute;inset:0}.apl .acv canvas{display:block}
.apl svg{position:absolute;inset:0;pointer-events:none}
.apl .alb{position:absolute;font:700 14px ui-monospace,Menlo,monospace;background:#f2a024;color:#1b1206;padding:4px 9px;border-radius:6px;box-shadow:0 4px 12px #0003;white-space:nowrap;pointer-events:none;transform:translate(-50%,-50%)}
.apl .alg{position:absolute;right:10px;top:10px;display:flex;gap:10px;font-size:12px;color:#55636c;background:#fff;border:1px solid #dfe5e8;border-radius:9px;padding:5px 9px}
.apl .alg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.apl .act{position:absolute;left:10px;bottom:10px;display:flex;gap:6px;flex-wrap:wrap;padding-right:10px}
.apl .act button,.apl .avt{font:700 12.5px Barlow,system-ui,sans-serif;border:1px solid #dfe5e8;background:#fff;color:#17222a;border-radius:99px;padding:6px 11px;cursor:pointer;box-shadow:0 2px 8px #0001}
.apl .avt{position:absolute;left:10px;top:10px;z-index:2}
.apl .atp{position:absolute;font:600 12.5px Barlow,system-ui,sans-serif;background:#0e1b22;color:#fff;padding:5px 9px;border-radius:7px;pointer-events:none;white-space:nowrap}
.apl .aload{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#55636c;font-size:14px}
.apl aside{border-left:1px solid #dfe5e8;padding:14px 16px;display:grid;gap:10px;align-content:start;overflow:auto}
.apl aside h3{font:800 18px 'Barlow Condensed',Barlow,sans-serif;margin:0;letter-spacing:.03em;text-transform:uppercase;color:#17222a}
.apl .aap{border:1.5px solid #ddd;border-radius:11px;padding:10px 11px;display:grid;gap:3px;background:#fff;cursor:pointer;text-align:left;font:inherit;color:inherit;width:100%}
.apl .aap[aria-pressed="true"]{border-color:#f2a024}
.apl .aap small{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#55636c;font-weight:700}
.apl .aap b{font-size:15px}.apl .aap span{font-size:13.5px;line-height:1.35}.apl .aap em{font-style:normal;font-size:11.5px;color:#55636c}
.apl .apr{border:1.5px dashed #dfe5e8;border-radius:11px;padding:10px 11px;font-size:13px;color:#55636c;line-height:1.4}
.apl .apr b{color:#17222a}
.apl .aav{font-size:13px;line-height:1.45;color:#7a4a00;background:#fff4e1;border:1.5px solid #f2a024;border-radius:10px;padding:8px 10px}
.apl .aav b{color:#5c3600}
.apl .aap.lk{background:#f7f9fa}.apl .aap.lk b::after{content:' 🔒';font-size:13px}
.apl .aap .alk{font-size:11.5px;font-weight:700;color:#17606b}
.apl .ams{font-size:12.5px;line-height:1.4;color:#17606b;background:#e8f4f5;border-radius:9px;padding:7px 9px}
.apl .acta{position:absolute;inset:0;z-index:3;display:grid;place-items:center;padding:18px;text-align:center;background:radial-gradient(circle at 50% 35%,#fff,#e9eef0)}
.apl .acta[hidden]{display:none}.apl .acta>div{max-width:400px;display:grid;gap:10px;justify-items:center}
.apl .acta .ic{font-size:34px}.apl .acta>div>b{font:800 21px/1.15 'Barlow Condensed',Barlow,sans-serif;text-transform:uppercase;letter-spacing:.02em}
.apl .acta p{margin:0;font-size:14.5px;line-height:1.45;color:#3a4a52}
.apl .acta a.z{display:inline-flex;align-items:center;gap:6px;background:#f2a024;color:#1b1206;font-weight:800;font-size:15px;text-decoration:none;border-radius:99px;padding:11px 18px;box-shadow:0 6px 16px #f2a02455}
.apl .acta a.v{font-size:13.5px;font-weight:700;color:#17606b}
.apl .acta small{font-size:12px;color:#55636c}
@media (max-width:720px){.apl{grid-template-columns:1fr;grid-template-rows:minmax(240px,58%) auto;overflow:auto}.apl aside{border-left:0;border-top:1px solid #dfe5e8}}`;document.head.appendChild(s);}

/* ---------- montagem 3D: qualquer tipologia liberada, gerada pela base da plataforma (mm) ---------- */
function montagem(SC,mats,key){let W,H,R,secOf;if(FULL){const M=FCM.MONT[key];W=M.def[0];H=M.def[1];R=FCM.pecas(SEC,M,W,H);secOf=c=>FCM.secOf(SEC,c);}
 else{const A=AM.m[key];W=A.W;H=A.H;R=A;secOf=c=>AM.sec[c];}
 const V=a=>new THREE.Vector3(a[0],a[1],a[2]);
 const ROOT=new THREE.Group();SC.add(ROOT);const GR=[ROOT],FOL=[],MS=[],GEO=[];
 R.folhas.forEach(f=>{const F=new THREE.Group();ROOT.add(F);F.userData={ox:f.ox,oy:f.oy||0,z:f.z,abre:(f.dir||0)*(f.curso||0),rot:f.rot||null,n:f.n};F.position.set(f.ox,f.oy||0,f.z);FOL.push(F);GR.push(F);});
 R.P.forEach(o=>{if(o.vz||o.oc)return;const par=GR[o.g+1]||ROOT;let m;
  if(o.vid){m=new THREE.Mesh(new THREE.BoxGeometry(o.w,o.h,o.d),mats.vd);m.userData.nm=o.nm||'Vidro';}
  else{const k=o.sc||[1,1],sec=secOf(o.c);if(!sec)return;
   const sh=sec.s.map(x=>{const q=new THREE.Shape(x.o.map(([a,b])=>new THREE.Vector2(a*k[0],b*k[1])));(x.h||[]).forEach(h=>q.holes.push(new THREE.Path(h.map(([a,b])=>new THREE.Vector2(a*k[0],b*k[1])))));return q;});
   const g=new THREE.ExtrudeGeometry(sh,{depth:o.len,bevelEnabled:false,curveSegments:1});g.translate(0,0,-o.len/2);g.applyMatrix4(new THREE.Matrix4().makeBasis(V(o.ex),V(o.ey),V(o.ez)));g.computeVertexNormals();
   m=new THREE.Mesh(g,mats.gr);m.userData.code=o.c;const fn=o.g>=0&&R.folhas[o.g]?R.folhas[o.g].n:'Marco';m.userData.nm=o.c+' · '+(sec.n||'')+' · '+fn;MS.push(m);}
  GEO.push(m.geometry);m.position.set(o.p[0],o.p[1],o.p[2]);par.add(m);});
 const pos=t=>FOL.forEach(F=>{const u=F.userData;F.position.set(u.ox+u.abre*t,u.oy,u.z);F.rotation.set(0,0,0);
  if(u.rot){const r=u.rot,an=r.ang*t,pv=new THREE.Vector3(r.px||0,r.py||0,r.pz||0);F.rotation.set(r.eixo==='x'?an:0,r.eixo==='y'?an:0,0);const q=pv.clone().applyEuler(F.rotation);F.position.add(pv.sub(q));
   if(r.ch){const a=Math.abs(r.ang)*t;F.position.x+=r.ch.sx*r.ch.w*(Math.cos(a)-1);F.position.z+=-r.ch.w*Math.sin(a);}}});
 const move=FOL.some(F=>F.userData.abre||F.userData.rot);
 return {MS,W,H,pos,move,fim:()=>GEO.forEach(g=>g.dispose())};}

/* ---------- cena ---------- */
function cena(pn,codes,key,onDone){const st=pn.querySelector('.ast'),cv=pn.querySelector('.acv');cv.innerHTML='';const tem=c=>codes.includes(c);
 const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(2,devicePixelRatio));R.localClippingEnabled=true;cv.appendChild(R.domElement);
 const SC=new THREE.Scene(),CAM=new THREE.PerspectiveCamera(35,1,10,30000);
 SC.add(new THREE.HemisphereLight(0xffffff,0x8a9399,.85));const d1=new THREE.DirectionalLight(0xffffff,.75);d1.position.set(2000,3000,4000);SC.add(d1);const d2=new THREE.DirectionalLight(0xffffff,.35);d2.position.set(-3000,1000,-2000);SC.add(d2);
 const OC=new THREE.OrbitControls(CAM,R.domElement);OC.enableDamping=true;
 const PL=new THREE.Plane(new THREE.Vector3(0,-1,0),0);
 const mats={gr:new THREE.MeshStandardMaterial({color:0xa7b1b6,metalness:.45,roughness:.45,side:THREE.DoubleSide}),
  or:new THREE.MeshStandardMaterial({color:0xf2a024,metalness:.25,roughness:.4,side:THREE.DoubleSide,emissive:0x5a3000,emissiveIntensity:.25}),
  vd:new THREE.MeshStandardMaterial({color:0x9fd3dc,transparent:true,opacity:.22,roughness:.1,metalness:0,side:THREE.DoubleSide,depthWrite:false})};
 const MG=montagem(SC,mats,key),MS=MG.MS;MS.forEach(m=>{if(tem(m.userData.code))m.material=mats.or;});
 const corte=on=>Object.values(mats).forEach(m=>{m.clippingPlanes=on?[PL]:[];m.needsUpdate=true;});
 let anim=null;const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const voa=(pos,tgt,ms=900)=>{const p0=CAM.position.clone(),t0=OC.target.clone(),s=performance.now(),red=matchMedia('(prefers-reduced-motion: reduce)').matches;
  anim=n=>{let k=red?1:Math.min(1,(n-s)/ms);k=ease(k);CAM.position.lerpVectors(p0,pos,k);OC.target.lerpVectors(t0,tgt,k);if(k>=1)anim=null;};};
 const D=Math.max(MG.W,MG.H),casa=()=>new THREE.Vector3(MG.W*.55,MG.H*.25,D*1.75);
 const inteira=()=>{corte(false);voa(casa(),new THREE.Vector3(0,0,0));};
 /* ver o encaixe: corta a esquadria atravessando o perfil e mostra as seções encaixadas */
 const encaixe=()=>{const L=MS.filter(m=>tem(m.userData.code));if(!L.length)return;let b=null,bd=1e12;
  L.forEach(m=>{const x=new THREE.Box3().setFromObject(m),d=x.getCenter(new THREE.Vector3()).distanceTo(CAM.position);if(d<bd){bd=d;b=x;}});
  const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());let t,off;
  if(s.y>=s.x){const y=c.y+120;PL.normal.set(0,-1,0);PL.constant=y;t=new THREE.Vector3(c.x,y,c.z);off=new THREE.Vector3(160,200,260);}
  else{const sg=c.x>0?1:-1,x=c.x-sg*150;PL.normal.set(sg,0,0);PL.constant=-sg*x;t=new THREE.Vector3(x,c.y,c.z);off=new THREE.Vector3(-sg*220,120,240);}
  corte(true);voa(t.clone().add(off),t);};
 CAM.position.copy(casa());OC.target.set(0,0,0);
 let aberta=false,abA=0;
 const ab=pn.querySelector('[data-a="ab"]');ab.hidden=!MG.move;ab.textContent='↔ Abrir as folhas';
 ab.onclick=()=>{aberta=!aberta;ab.textContent=aberta?'↔ Fechar as folhas':'↔ Abrir as folhas';};
 pn.querySelector('[data-a="enc"]').onclick=encaixe;pn.querySelector('[data-a="td"]').onclick=inteira;
 /* etiqueta com seta */
 const lb=pn.querySelector('.alb'),ar=pn.querySelector('line'),ov=pn.querySelector('svg');lb.textContent=codes.join(' / ');
 const etiqueta=()=>{const W=st.clientWidth,H=st.clientHeight;let best=null,bd=1e12;
  MS.forEach(m=>{if(!tem(m.userData.code))return;const b=new THREE.Box3().setFromObject(m);let c=b.getCenter(new THREE.Vector3());
   if(m.material.clippingPlanes&&m.material.clippingPlanes.length&&PL.distanceToPoint(c)<0){const s=b.getSize(new THREE.Vector3());c=s.y>=s.x?new THREE.Vector3(c.x,Math.min(c.y,PL.constant-30),c.z):c;}
   const p=c.clone().project(CAM),d=c.distanceTo(CAM.position);if(p.z<1&&Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1&&d<bd){bd=d;best=p;}});
  if(!best){lb.hidden=true;ar.style.display='none';return;}lb.hidden=false;ar.style.display='';
  const x=(best.x+1)/2*W,y=(1-best.y)/2*H,lx=Math.min(W-60,Math.max(60,x<W/2?x+140:x-140)),ly=Math.max(28,y-80);
  lb.style.left=lx+'px';lb.style.top=ly+'px';ar.setAttribute('x1',lx);ar.setAttribute('y1',ly+12);ar.setAttribute('x2',x);ar.setAttribute('y2',y);};
 /* clique: nome e código da peça */
 const rc=new THREE.Raycaster(),tip=pn.querySelector('.atp');let dn=null;
 R.domElement.addEventListener('pointerdown',e=>dn=[e.clientX,e.clientY]);
 R.domElement.addEventListener('pointerup',e=>{if(!dn||Math.hypot(e.clientX-dn[0],e.clientY-dn[1])>5)return;const r=R.domElement.getBoundingClientRect();
  rc.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-(e.clientY-r.top)/r.height*2+1},CAM);const h=rc.intersectObjects(MS,false)[0];
  if(!h){tip.hidden=true;return;}tip.textContent=h.object.userData.nm;tip.style.left=(e.clientX-r.left+12)+'px';tip.style.top=(e.clientY-r.top-30)+'px';tip.hidden=false;});
 OC.addEventListener('start',()=>{tip.hidden=true;anim=null;});
 const rs=()=>{const W=st.clientWidth,H=st.clientHeight;if(!W||!H)return;R.setSize(W,H);CAM.aspect=W/H;CAM.updateProjectionMatrix();ov.setAttribute('width',W);ov.setAttribute('height',H);};
 const ro=new ResizeObserver(rs);ro.observe(st);rs();
 let vivo=true;const loop=n=>{if(!vivo)return;if(!document.body.contains(pn)){fim();return;}requestAnimationFrame(loop);if(pn.hidden)return;if(anim)anim(n);
  const t=aberta?1:0;if(Math.abs(abA-t)>.001){abA+=(t-abA)*.12;MG.pos(abA);}OC.update();R.render(SC,CAM);etiqueta();};
 const fim=()=>{vivo=false;ro.disconnect();OC.dispose();R.dispose();MG.fim();};
 requestAnimationFrame(loop);onDone&&onDone();return fim;}

/* ---------- liga o botão na janela do perfil ---------- */
async function liga(o,code){if(!o||!code)return;let D;try{D=await dados();}catch(_){return;}const L=usos(D,code),CODES=partes(code);if(!L.length)return;
 const vb=o.querySelector('.vb'),wr=o.querySelector('.wr');if(!vb||!wr)return;estilo();
 const bt=document.createElement('button');bt.type='button';bt.className='apb';bt.textContent='🧩 Aplicação';bt.title='Onde este perfil é aplicado na tipologia';bt.setAttribute('aria-pressed','false');vb.appendChild(bt);
 const pn=document.createElement('div');pn.className='apl';pn.hidden=true;
 const LV=L.map(a=>livre(D,a.m)),k0=Math.max(0,LV.indexOf(true)),nLk=LV.filter(v=>!v).length;
 const lista=L.map((a,k)=>{const m=(D.modelos||{})[a.m]||{};return `<button type="button" class="aap${LV[k]?'':' lk'}" data-k="${k}" aria-pressed="${k===k0}"><small>Tipologia · ${esc(m.linha||'')}</small><b>${esc(m.n||a.m)}</b><span>${esc(a.pos)}</span>${m.ref?`<em>Referência: ${esc(m.ref)}</em>`:''}${LV[k]?'':'<span class="alk">Montagem em 3D na Plataforma FC 3D</span>'}</button>`;}).join('');
 const ams=FULL||!nLk?'':`<div class="ams">🧩 Aqui você testa a <b>janela de correr 2 folhas</b> em 3D. ${nLk>1?`As outras ${nLk} tipologias deste perfil estão`:'A outra tipologia deste perfil está'} na <b>Plataforma FC 3D</b>.</div>`;
 pn.innerHTML=`<div class="ast"><div class="acv"></div><svg><defs><marker id="apMk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#f2a024"/></marker></defs><line stroke="#f2a024" stroke-width="2.5" marker-end="url(#apMk)"/></svg><div class="alb" hidden></div><div class="atp" hidden></div><div class="aload">Montando a tipologia…</div><div class="acta" hidden></div>
  <button type="button" class="avt">↺ Voltar ao 3D</button>
  <div class="alg"><span><i style="background:#f2a024"></i>Este perfil</span><span><i style="background:#a7b1b6"></i>Demais perfis</span></div>
  <div class="act"><button type="button" data-a="enc">🔍 Ver o encaixe</button><button type="button" data-a="td">↺ Esquadria inteira</button><button type="button" data-a="ab">↔ Abrir a folha</button></div></div>
  <aside><h3>Onde é aplicado</h3>${ams}${lista}<div class="apr"><b>Outras tipologias</b><br>Aplicação em preparação. Entra quando a montagem for conferida e liberada na Plataforma FC 3D.</div>
  <div class="aav">⚠ <b>Aplicação orientativa.</b> Mostra onde o perfil costuma ser usado, conforme o catálogo técnico. <b>A confirmação é sempre do serralheiro</b> antes de comprar, cortar ou usinar.</div></aside>`;
 wr.appendChild(pn);let fim=null,atual=-1;
 const cta=pn.querySelector('.acta'),vis=on=>['.act','.alg','.alb','svg','.acv'].forEach(q=>{const e=pn.querySelector(q);if(e)e.style.visibility=on?'':'hidden';});
 const mostra=k=>{if(k===atual&&(fim||!LV[k]))return;atual=k;pn.querySelectorAll('.aap').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k==k));if(fim){fim();fim=null;}
  const ld=pn.querySelector('.aload');
  if(!LV[k]){const m=(D.modelos||{})[L[k].m]||{},onde=(window.CAT_SLUG||new URLSearchParams(location.search).get('c')||(location.pathname.match(/\/catalogo\/([^\/?#]+)/)||[])[1]||'');
   const msg='Olá! Vi a aplicação do perfil '+code+' na '+(m.n||'tipologia')+' ('+(m.ref||'')+')'+(onde?' no catálogo '+onde:' no catálogo da FC')+' e quero conhecer a Plataforma FC 3D.';
   pn.querySelector('.acv').innerHTML='';ld.hidden=true;vis(false);
   cta.innerHTML=`<div><span class="ic">🔒</span><b>${esc(m.n||'')}</b><p>A montagem em 3D desta tipologia, com o perfil <b>${esc(code)}</b> destacado, o encaixe e a abertura das folhas, faz parte da <b>Plataforma FC 3D</b>.</p><a class="z" target="_blank" rel="noopener" href="https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}">💬 Quero conhecer a Plataforma FC 3D</a><a class="v" target="_blank" rel="noopener" href="/fc3d/">Ver o que a plataforma oferece ↗</a><small>FC Consultoria em Esquadria</small></div>`;
   cta.hidden=false;cta.querySelector('a.z').addEventListener('click',()=>{try{window.hit&&hit('perfis_aplicacao_cta',code+' '+L[k].m);}catch(_){}});
   try{window.hit&&hit('perfis_aplicacao_lk',code+' '+L[k].m);}catch(_){}return;}
  cta.hidden=true;vis(true);ld.hidden=false;ld.textContent='Montando a tipologia…';
  libs().then(()=>{fim=cena(pn,CODES,L[k].m,()=>{ld.hidden=true;});}).catch(()=>{ld.textContent='Não foi possível abrir a aplicação agora. Atualize a página.';});};
 const abre=v=>{pn.hidden=!v;bt.setAttribute('aria-pressed',v);if(v){vb.querySelectorAll('button[aria-pressed="true"]').forEach(b=>{if(b!==bt)b.dataset.apw='1';});mostra(atual<0?k0:atual);try{window.hit&&hit('perfis_aplicacao',code);}catch(_){}}};
 bt.addEventListener('click',()=>abre(pn.hidden));
 pn.querySelector('.avt').onclick=()=>abre(false);
 vb.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b!==bt&&!pn.hidden)abre(false);});
 pn.querySelector('aside').addEventListener('click',e=>{const b=e.target.closest('.aap');if(b)mostra(+b.dataset.k);});
 if(PEND&&PEND.c===String(code).toUpperCase()&&Date.now()-PEND.t<180000){PEND=null;abre(true);}}

/* ---------- "Usa em: …" nos cards do catálogo (lê o mesmo aplicacao.json) ---------- */
let PEND=null;
function cssCard(){if(document.getElementById('aplUsaCss'))return;const s=document.createElement('style');s.id='aplUsaCss';s.textContent=`
.cd .usa{margin-top:7px;align-self:flex-start;max-width:100%;font:700 12px/1.3 Barlow,system-ui,sans-serif;color:#7a4a00;background:#fff4e1;border:1px solid #f2c27a;border-radius:9px;padding:4px 9px;cursor:pointer;text-align:left}
.cd .usa:hover{background:#ffe9c4;border-color:#f2a024}.cd .usa:focus-visible{outline:2px solid #f2a024;outline-offset:2px}
.cd .usa small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#a0661a;margin-bottom:1px}
@media(max-width:560px){.cd .usa{font-size:11.5px;padding:3px 7px}}
@media print{.cd .usa{border:0;background:none;padding:0;color:#55636c}}`;document.head.appendChild(s);}
function usaEm(){const lst=document.getElementById('lst');if(!lst)return;
 dados().then(D=>{const P=D.perfis||{},M=D.modelos||{};if(!Object.keys(P).length)return;cssCard();
  const nomes=c=>{const v=[];usos(D,c).forEach(a=>{const m=M[a.m]||{},n=m.n||a.m;if(!v.includes(n))v.push(n);});return v;};
  const marca=()=>lst.querySelectorAll('.cd[data-c]:not([data-usa])').forEach(cd=>{cd.dataset.usa='1';const c=String(cd.dataset.c).toUpperCase(),v=nomes(c);if(!v.length)return;
   const tx=v.length>2?v.slice(0,2).join(' · ')+' +'+(v.length-2):v.join(' · ');
   const b=document.createElement('button');b.type='button';b.className='usa nov3';b.title='Ver onde este perfil é aplicado';b.setAttribute('aria-label','Usa em: '+v.join(', ')+'. Ver a aplicação');
   b.innerHTML='<small>🧩 Usa em</small>'+esc(tx);
   b.addEventListener('click',e=>{e.stopPropagation();PEND={c,t:Date.now()};try{window.hit&&hit('perfis_usaem',c);}catch(_){}cd.click();});
   cd.appendChild(b);});
  marca();let q=0;new MutationObserver(()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;marca();});}).observe(lst,{childList:true,subtree:true});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',usaEm);else usaEm();

window.FCAPL={liga};
})();

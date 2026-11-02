/* Aplicação dos perfis nas tipologias · módulo do Catálogo 3D (site, Matriz e catálogos dos clientes)
   Mostra o perfil destacado dentro da tipologia montada com as seções reais do catálogo técnico.
   Conteúdo orientativo: a confirmação é sempre do serralheiro. © FC Consultoria em Esquadria */
(function(){
const BASE='/fc3d/clientes/';
const L3=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'];
let DADOS=null,JSH=null,LIBS=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dados=()=>DADOS||(DADOS=fetch(BASE+'aplicacao.json?v=1',{cache:'no-cache'}).then(r=>r.json()).catch(()=>({modelos:{},perfis:{}})));
const sc=u=>new Promise((ok,er)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=er;document.head.appendChild(s);});
const libs=()=>LIBS||(LIBS=(window.THREE&&THREE.REVISION==='128'?Promise.resolve():sc(L3[0])).then(()=>THREE.OrbitControls?null:sc(L3[1]))
 .then(()=>fetch(BASE+'orientativo/jan_shapes.json?v=1').then(r=>r.json())).then(j=>{JSH=j;}));

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
@media (max-width:720px){.apl{grid-template-columns:1fr;grid-template-rows:minmax(240px,58%) auto;overflow:auto}.apl aside{border-left:0;border-top:1px solid #dfe5e8}}`;document.head.appendChild(s);}

/* ---------- montagem 3D: janela de correr 2 folhas (mesma do Orientativo FC 3D) ---------- */
function jcr2(SC,mats){const MS=[],FOL=[];const esd=new THREE.Group();SC.add(esd);const fw=1.2,fh=1.0;
 const jr=new THREE.Group();jr.rotation.y=Math.PI;esd.add(jr);
 const X=new THREE.Vector3(1,0,0),Y=new THREE.Vector3(0,1,0),Z=new THREE.Vector3(0,0,1),N=v=>v.clone().negate();
 const PW=c=>JSH[c].w*.001,PH=c=>JSH[c].h*.001;
 const pf=(par,c,len,ex,ey,ez,x,y,z,nm)=>{const d=JSH[c];const sh=d.s.map(o=>{const q=new THREE.Shape(o.o.map(([a,b])=>new THREE.Vector2(a*.001,b*.001)));o.h.forEach(h=>q.holes.push(new THREE.Path(h.map(([a,b])=>new THREE.Vector2(a*.001,b*.001)))));return q;});
  const g=new THREE.ExtrudeGeometry(sh,{depth:len,bevelEnabled:false,curveSegments:1});g.translate(0,0,-len/2);g.applyMatrix4(new THREE.Matrix4().makeBasis(ex,ey,ez));g.computeVertexNormals();
  const ms=new THREE.Mesh(g,mats.gr);ms.position.set(x,y,z);ms.userData.code=c;ms.userData.nm=nm;par.add(ms);MS.push(ms);return ms;};
 const W=fw,H=fh,FT=PH('SU-001'),FB=PH('SU-002'),FS=PH('SU-003'),TL=W-2*.013;
 pf(jr,'SU-001',TL,Z,Y,X,0,H/2-FT/2,0,'Marco superior SU-001');
 pf(jr,'SU-002',TL,Z,Y,X,0,-H/2+FB/2,0,'Trilho inferior SU-002');
 pf(jr,'SU-003',H,Z,X,N(Y),-W/2+FS/2,0,0,'Marco lateral SU-003');
 pf(jr,'SU-003',H,N(Z),N(X),N(Y),W/2-FS/2,0,0,'Marco lateral SU-003');
 const EDGE=.0144,OV=.03,Wi=W-2*EDGE,sW=(Wi+OV)/2,step=sW-OV,sH=H-.05,SDs=.025,gwC=(W-.1432)/2;
 const mz=c=>c==='SU-040'?SDs/2-PH(c)/2:c==='SU-041'?-SDs/2+PH(c)/2:0,exF=(c,t)=>c==='SU-041'?N(t):t;
 const OB=JSH['SU-102'].off053||[2.98,18.02],oz=OB[0]/1000,inset=PH('SU-053')/2-OB[1]/1000;
 [{z:.0175,L:'SU-039',R:'SU-040',nm:'Folha interna'},{z:-.0175,L:'SU-041',R:'SU-039',nm:'Folha externa'}].forEach((sd,i)=>{
  const f=new THREE.Group(),Lc=sd.L,Rc=sd.R,RW=PH('SU-053');
  const xL=-sW/2+PW(Lc),xR=sW/2-PW(Rc),xLc=-sW/2+PW(Lc)/2,xRc=sW/2-PW(Rc)/2,LFZ=i===0;
  pf(f,Lc,sH,exF(Lc,X),LFZ?N(Z):Z,Y,xLc,0,LFZ?-mz(Lc):mz(Lc),'Montante '+Lc+' · '+sd.nm);
  pf(f,Rc,sH,exF(Rc,N(X)),Z,Y,xRc,0,mz(Rc),(Rc==='SU-040'||Lc==='SU-041'&&Rc!=='SU-039'?'Mão de amigo ':'Montante ')+Rc+' · '+sd.nm);
  const tl=xR-xL+.004,tx=(xL+xR)/2;
  pf(f,'SU-053',tl,Z,N(Y),X,tx,sH/2-RW/2,0,'Travessa SU-053 · '+sd.nm);pf(f,'SU-053',tl,Z,Y,X,tx,-sH/2+RW/2,0,'Travessa SU-053 · '+sd.nm);
  const yTi=sH/2-RW,yBi=-sH/2+RW,v=new THREE.Mesh(new THREE.BoxGeometry(gwC,yTi-yBi+.012,.006),mats.vd);v.position.set(tx,(yTi+yBi)/2,-.0035);v.userData.nm='Vidro';f.add(v);
  const bxL=xL-inset,bxR=xR+inset,bl=bxR-bxL,yT=yTi+inset,yB=yBi-inset,bh=yT-yB,yc=(yT+yB)/2;
  pf(f,'SU-102',bl,Z,N(Y),X,tx,yT,oz,'Baguete SU-102 · '+sd.nm);pf(f,'SU-102',bl,Z,Y,X,tx,yB,oz,'Baguete SU-102 · '+sd.nm);
  pf(f,'SU-102',bh,Z,X,Y,bxL,yc,oz,'Baguete SU-102 · '+sd.nm);pf(f,'SU-102',bh,Z,N(X),Y,bxR,yc,oz,'Baguete SU-102 · '+sd.nm);
  const x=-Wi/2+sW/2+i*(sW-OV);f.position.set(x,0,sd.z);f.userData.x0=x;f.userData.dx=(i?-1:1)*step*.55;jr.add(f);FOL.push(f);});
 return {MS,FOL};}
const MODELOS={jcr2};

/* ---------- cena ---------- */
function cena(pn,code,modelo,onDone){const st=pn.querySelector('.ast'),cv=pn.querySelector('.acv');cv.innerHTML='';
 const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(2,devicePixelRatio));R.localClippingEnabled=true;cv.appendChild(R.domElement);
 const SC=new THREE.Scene(),CAM=new THREE.PerspectiveCamera(35,1,.01,50);
 SC.add(new THREE.HemisphereLight(0xffffff,0x8a9399,.85));const d1=new THREE.DirectionalLight(0xffffff,.75);d1.position.set(2,3,4);SC.add(d1);const d2=new THREE.DirectionalLight(0xffffff,.35);d2.position.set(-3,1,-2);SC.add(d2);
 const OC=new THREE.OrbitControls(CAM,R.domElement);OC.enableDamping=true;
 const PL=new THREE.Plane(new THREE.Vector3(0,-1,0),0);
 const mats={gr:new THREE.MeshStandardMaterial({color:0xa7b1b6,metalness:.45,roughness:.45,side:THREE.DoubleSide}),
  or:new THREE.MeshStandardMaterial({color:0xf2a024,metalness:.25,roughness:.4,side:THREE.DoubleSide,emissive:0x5a3000,emissiveIntensity:.25}),
  vd:new THREE.MeshStandardMaterial({color:0x9fd3dc,transparent:true,opacity:.22,roughness:.1,metalness:0,side:THREE.DoubleSide,depthWrite:false})};
 const {MS,FOL}=MODELOS[modelo](SC,mats);MS.forEach(m=>{if(m.userData.code===code)m.material=mats.or;});
 const corte=on=>Object.values(mats).forEach(m=>{m.clippingPlanes=on?[PL]:[];m.needsUpdate=true;});
 let anim=null;const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const voa=(pos,tgt,ms=900)=>{const p0=CAM.position.clone(),t0=OC.target.clone(),s=performance.now(),red=matchMedia('(prefers-reduced-motion: reduce)').matches;
  anim=n=>{let k=red?1:Math.min(1,(n-s)/ms);k=ease(k);CAM.position.lerpVectors(p0,pos,k);OC.target.lerpVectors(t0,tgt,k);if(k>=1)anim=null;};};
 const inteira=()=>{corte(false);voa(new THREE.Vector3(1.25,.55,1.9),new THREE.Vector3(0,0,0));};
 /* ver o encaixe: corta a esquadria atravessando o perfil e mostra as seções encaixadas */
 const encaixe=()=>{const L=MS.filter(m=>m.userData.code===code);if(!L.length)return;let b=null,bd=1e9;
  L.forEach(m=>{const x=new THREE.Box3().setFromObject(m),d=x.getCenter(new THREE.Vector3()).distanceTo(CAM.position);if(d<bd){bd=d;b=x;}});
  const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());let t,off;
  if(s.y>=s.x){const y=c.y+.12;PL.normal.set(0,-1,0);PL.constant=y;t=new THREE.Vector3(c.x,y,c.z);off=new THREE.Vector3(.16,.2,.26);}
  else{const sg=c.x>0?1:-1,x=c.x-sg*.15;PL.normal.set(sg,0,0);PL.constant=-sg*x;t=new THREE.Vector3(x,c.y,c.z);off=new THREE.Vector3(-sg*.22,.12,.24);}
  corte(true);voa(t.clone().add(off),t);};
 CAM.position.set(1.25,.55,1.9);OC.target.set(0,0,0);
 let aberta=false;
 const ab=pn.querySelector('[data-a="ab"]');ab.textContent='↔ Abrir a folha';
 ab.onclick=()=>{aberta=!aberta;ab.textContent=aberta?'↔ Fechar a folha':'↔ Abrir a folha';};
 pn.querySelector('[data-a="enc"]').onclick=encaixe;pn.querySelector('[data-a="td"]').onclick=inteira;
 /* etiqueta com seta */
 const lb=pn.querySelector('.alb'),ar=pn.querySelector('line'),ov=pn.querySelector('svg');lb.textContent=code;
 const etiqueta=()=>{const W=st.clientWidth,H=st.clientHeight;let best=null,bd=1e9;const v=new THREE.Vector3();
  MS.forEach(m=>{if(m.userData.code!==code)return;const b=new THREE.Box3().setFromObject(m);let c=b.getCenter(v.clone());
   if(m.material.clippingPlanes&&m.material.clippingPlanes.length&&PL.distanceToPoint(c)<0){const s=b.getSize(new THREE.Vector3());c=s.y>=s.x?new THREE.Vector3(c.x,Math.min(c.y,PL.constant-.03),c.z):c;}
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
  FOL.forEach(f=>{const t=f.userData.x0+(aberta&&f===FOL[0]?f.userData.dx:0);f.position.x+=(t-f.position.x)*.12;});OC.update();R.render(SC,CAM);etiqueta();};
 const fim=()=>{vivo=false;ro.disconnect();OC.dispose();R.dispose();MS.forEach(m=>m.geometry.dispose());};
 requestAnimationFrame(loop);onDone&&onDone();return fim;}

/* ---------- liga o botão na janela do perfil ---------- */
async function liga(o,code){if(!o||!code)return;let D;try{D=await dados();}catch(_){return;}const L=(D.perfis||{})[String(code).toUpperCase()];if(!L||!L.length)return;
 const vb=o.querySelector('.vb'),wr=o.querySelector('.wr');if(!vb||!wr)return;estilo();
 const bt=document.createElement('button');bt.type='button';bt.className='apb';bt.textContent='🧩 Aplicação';bt.title='Onde este perfil é aplicado na tipologia';bt.setAttribute('aria-pressed','false');vb.appendChild(bt);
 const pn=document.createElement('div');pn.className='apl';pn.hidden=true;
 const lista=L.map((a,k)=>{const m=(D.modelos||{})[a.m]||{};return `<button type="button" class="aap" data-k="${k}" aria-pressed="${k===0}"><small>Tipologia · ${esc(m.linha||'')}</small><b>${esc(m.n||a.m)}</b><span>${esc(a.pos)}</span>${m.ref?`<em>Referência: ${esc(m.ref)}</em>`:''}</button>`;}).join('');
 pn.innerHTML=`<div class="ast"><div class="acv"></div><svg><defs><marker id="apMk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#f2a024"/></marker></defs><line stroke="#f2a024" stroke-width="2.5" marker-end="url(#apMk)"/></svg><div class="alb" hidden></div><div class="atp" hidden></div><div class="aload">Montando a tipologia…</div>
  <button type="button" class="avt">↺ Voltar ao 3D</button>
  <div class="alg"><span><i style="background:#f2a024"></i>Este perfil</span><span><i style="background:#a7b1b6"></i>Demais perfis</span></div>
  <div class="act"><button type="button" data-a="enc">🔍 Ver o encaixe</button><button type="button" data-a="td">↺ Esquadria inteira</button><button type="button" data-a="ab">↔ Abrir a folha</button></div></div>
  <aside><h3>Onde é aplicado</h3>${lista}<div class="apr"><b>Outras tipologias</b><br>Aplicação em preparação. Entra só depois de conferida no índice de montagens do catálogo.</div>
  <div class="aav">⚠ <b>Aplicação orientativa.</b> Mostra onde o perfil costuma ser usado, conforme o catálogo técnico. <b>A confirmação é sempre do serralheiro</b> antes de comprar, cortar ou usinar.</div></aside>`;
 wr.appendChild(pn);let fim=null,atual=-1;
 const mostra=k=>{if(k===atual&&fim)return;atual=k;pn.querySelectorAll('.aap').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k==k));if(fim)fim();
  const ld=pn.querySelector('.aload');ld.hidden=false;ld.textContent='Montando a tipologia…';
  libs().then(()=>{fim=cena(pn,String(code).toUpperCase(),L[k].m,()=>{ld.hidden=true;});}).catch(()=>{ld.textContent='Não foi possível abrir a aplicação agora. Atualize a página.';});};
 const abre=v=>{pn.hidden=!v;bt.setAttribute('aria-pressed',v);if(v){vb.querySelectorAll('button[aria-pressed="true"]').forEach(b=>{if(b!==bt)b.dataset.apw='1';});mostra(atual<0?0:atual);try{window.hit&&hit('perfis_aplicacao',code);}catch(_){}}};
 bt.addEventListener('click',()=>abre(pn.hidden));
 pn.querySelector('.avt').onclick=()=>abre(false);
 vb.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b!==bt&&!pn.hidden)abre(false);});
 pn.querySelector('aside').addEventListener('click',e=>{const b=e.target.closest('.aap');if(b)mostra(+b.dataset.k);});}

window.FCAPL={liga};
})();

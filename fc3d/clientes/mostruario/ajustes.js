/* Plataforma FC 3D Clientes · Mostruário 3D
   1) Mover e girar peças (todos): dois cliques numa peça; arraste para mover ou, no modo Girar, arraste para girar 360°;
      "Voltar ao original" encaixa tudo de novo.
   2) Ajuste técnico (só a Matriz): corrige posição (mm) e giro (graus) de uma peça; fica salvo para todas as empresas.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
const SP='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/',SPK='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
const tok=()=>{try{return localStorage.getItem('pfc-token');}catch(_){return null;}};
const rpc=(fn,b)=>fetch(SP+fn,{method:'POST',headers:{apikey:SPK,'Content-Type':'application/json'},body:JSON.stringify(b)}).then(async r=>{const j=await r.json().catch(()=>null);if(!r.ok)throw new Error(j&&j.message||'Falha');return j;});
let AJ={},MV={},MR={},SEL=null,SELMAT=null,MATRIZ=false,MODO='mover';
window.PFC_AJ={carregar(){return rpc('pfc_ajustes_3d_ler',{p_token:tok()}).then(j=>{AJ=j||{};}).catch(()=>{AJ={};});},matriz(v){MATRIZ=!!v;}};
const V3=(x,y,z)=>new THREE.Vector3(x||0,y||0,z||0),R=Math.PI/180;
const qDe=v=>new THREE.Quaternion().setFromEuler(new THREE.Euler(v.x*R,v.y*R,v.z*R,'XYZ'));

/* peças selecionáveis: perfis e acessórios do EX + acessórios sem grupo (guardam a posição de origem aqui) */
let XA=[];const todas=()=>EX.concat(XA);window.PFC_AJ.todas=()=>{chaves();return todas();};
/* identificação estável de cada peça: tipologia | grupo | código | ordem */
function chaves(){const n={};const emEX=new Set(EX.map(x=>x.o));XA=(typeof compObjs!=='undefined'?compObjs:[]).filter(o=>o&&!emEX.has(o)&&o.parent).map(o=>({o,b:o.position.clone(),k:'C'}));todas().forEach(x=>{const u=x.o.userData||{},c=u.code||u.comp||u.zone||'peca',b=x.k+'|'+c;n[b]=(n[b]||0)+1;x.pid=b+'|'+n[b];});}
const kAJ=x=>S.typo+'|'+x.pid;
const testando=()=>S.mode==='test';

/* depois de montar: guarda o giro de origem e aplica os ajustes técnicos salvos */
const _build=build;
build=function(){SEL=null;SELMAT=null;MV={};MR={};_build.apply(this,arguments);chaves();
  todas().forEach(x=>{x.q0=x.o.quaternion.clone();const a=AJ[kAJ(x)];
    x.aj=a?V3(a[0]/1000,a[1]/1000,a[2]/1000):V3();x.ar=a?V3(a[3],a[4],a[5]):V3();x.oc=!!(a&&a[6]);x.b.add(x.aj);if(x.k==='C')x.o.position.copy(x.b);});
  applyEx();painel();};
/* depois de posicionar: soma o giro do ajuste e o que foi mexido à mão */
let _tm=null;
const _applyEx=applyEx;
applyEx=function(){_applyEx.apply(this,arguments);if(_tm!==testando()){_tm=testando();painel();}
  const t=testando();XA.forEach(x=>{if(x.b)x.o.position.copy(x.b);});todas().forEach(x=>{if(!x.q0)return;oculta(x);const q=x.q0.clone();if(x.ar&&(x.ar.x||x.ar.y||x.ar.z))q.multiply(qDe(x.ar));
    if(!t){const r=MR[x.pid];if(r)q.multiply(qDe(r));const v=MV[x.pid];if(v)x.o.position.add(v);}x.o.quaternion.copy(q);});};

/* peça oculta na plataforma */
const MOC=new THREE.MeshStandardMaterial({color:0xd04a3a,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide});
function oculta(x){if(!x.oc){if(x.o.userData.__ocm){x.o.traverse(m=>{if(m.isMesh&&m.userData.__m0){m.material=m.userData.__m0;delete m.userData.__m0;}});delete x.o.userData.__ocm;}if(!testando()&&x.o.userData.__ocv){x.o.visible=true;delete x.o.userData.__ocv;}return;}
  if(MATRIZ){if(!x.o.userData.__ocm){x.o.traverse(m=>{if(m.isMesh&&m!==SEL?.o){m.userData.__m0=m.material;m.material=MOC;}});x.o.userData.__ocm=1;}}
  else{x.o.visible=false;x.o.userData.__ocv=1;}}
/* destaque da peça escolhida */
const MSEL=new THREE.MeshStandardMaterial({color:0x2bb3a6,metalness:.25,roughness:.4,emissive:0x0b4f4a,emissiveIntensity:.55,side:THREE.DoubleSide});
function marca(x){if(SEL&&SEL.o&&SELMAT){SEL.o.material=SELMAT;}const ant=SEL;SEL=x;SELMAT=null;if(ant){delete ant.o.userData.__ocm;ant.o.traverse(m=>{delete m.userData.__m0;});oculta(ant);}
  if(x){if(x.o.isMesh){SELMAT=x.o.userData.__m0||x.o.material;x.o.material=MSEL;}else{x.o.traverse(m=>{if(m.isMesh){m.userData.__s0=m.material;m.material=MSEL;}});}}
  if(ant&&ant!==x&&!ant.o.isMesh)ant.o.traverse(m=>{if(m.isMesh&&m.userData.__s0){m.material=m.userData.__s0;delete m.userData.__s0;}});MSG='';painel();}
function acha(ev){setRay(ev.clientX,ev.clientY);const L=todas();const h=ray.intersectObjects(L.map(x=>x.o).filter(o=>o.visible),true)[0];if(!h)return null;
  let o=h.object;const set=new Map(L.map(x=>[x.o,x]));while(o&&!set.has(o))o=o.parent;return o?{x:set.get(o),p:h.point}:null;}

/* dois cliques escolhem a peça; segurar e arrastar move ou gira a peça escolhida */
const el=document.getElementById('evl')||cv;
el.addEventListener('dblclick',ev=>{if(testando())return;const r=acha(ev);ev.preventDefault();ev.stopPropagation();marca(r?r.x:null);},true);
let drag=null;
el.addEventListener('pointerdown',ev=>{if(!SEL||testando()||ev.button!==0)return;const r=acha(ev);if(!r||r.x!==SEL)return;
  ev.stopPropagation();ev.preventDefault();controls.enabled=false;el.setPointerCapture&&el.setPointerCapture(ev.pointerId);
  const n=new THREE.Vector3();camera.getWorldDirection(n);
  drag={pl:new THREE.Plane().setFromNormalAndCoplanarPoint(n,r.p),p0:r.p.clone(),v0:(MV[SEL.pid]||V3()).clone(),r0:(MR[SEL.pid]||V3()).clone(),x0:ev.clientX,y0:ev.clientY,par:SEL.o.parent,gira:MODO==='girar'||ev.shiftKey};},true);
el.addEventListener('pointermove',ev=>{if(!drag)return;ev.stopPropagation();
  if(drag.gira){const dx=ev.clientX-drag.x0,dy=ev.clientY-drag.y0;MR[SEL.pid]=V3(drag.r0.x+dy*.6,drag.r0.y+dx*.6,drag.r0.z);applyEx();painel(true);return;}
  setRay(ev.clientX,ev.clientY);const p=new THREE.Vector3();if(!ray.ray.intersectPlane(drag.pl,p))return;
  const a=drag.par.worldToLocal(drag.p0.clone()),b=drag.par.worldToLocal(p.clone());MV[SEL.pid]=drag.v0.clone().add(b.sub(a));applyEx();},true);
const solta=ev=>{if(!drag)return;drag=null;controls.enabled=true;if(ev)ev.stopPropagation();painel();};
el.addEventListener('pointerup',solta,true);el.addEventListener('pointercancel',solta,true);
addEventListener('keydown',e=>{if(e.key==='Escape'&&SEL)marca(null);});

function voltar(){MV={};MR={};applyEx();marca(null);}
function gira90(e,s){if(!SEL)return;const r=(MR[SEL.pid]||V3()).clone();r[e]+=90*s;MR[SEL.pid]=r;applyEx();painel();}
/* ajuste técnico: posição em mm (X largura, Y altura, Z profundidade) e giro em graus */
function ajusta(e,mm){if(!SEL)return;const v=V3();v[e]=mm/1000;SEL.b.add(v);SEL.aj.add(v);applyEx();painel();}
function ajGira(e,g){if(!SEL)return;let a=((SEL.ar[e]+g)%360+360)%360;if(a>180)a-=360;SEL.ar[e]=a;applyEx();painel();}
const r1=v=>Math.round(v*10)/10;
function ajMM(){const a=SEL.aj;return [a.x,a.y,a.z].map(v=>r1(v*1000));}
function ajG(){const a=SEL.ar;return [a.x,a.y,a.z].map(r1);}
let PASSO=1,PASSOG=5,MSG='',MSG2='';
function salvar(oc){if(!SEL)return;if(oc!==undefined)SEL.oc=oc;const o=!!SEL.oc,[dx,dy,dz]=ajMM(),[rx,ry,rz]=ajG(),k=kAJ(SEL),i=k.indexOf('|');MSG='Salvando…';painel();
  rpc('pfc_ajuste_3d_salvar',{p_token:tok(),p_tipologia:k.slice(0,i),p_peca:k.slice(i+1),p_dx:dx,p_dy:dy,p_dz:dz,p_rx:rx,p_ry:ry,p_rz:rz,p_oculto:o})
   .then(()=>{if(dx||dy||dz||rx||ry||rz||o)AJ[k]=[dx,dy,dz,rx,ry,rz,o];else delete AJ[k];MSG=oc===true?'🙈 Peça oculta para todas as empresas':oc===false?'👁 Peça visível de novo para todas as empresas':'✓ Ajuste salvo para todas as empresas';const x=SEL;marca(null);applyEx();if(x&&x.oc)MSG2='Peça oculta: aparece transparente só para a Matriz. Dois cliques nela para mostrar de novo.';painel();})
   .catch(e=>{MSG='Não foi possível salvar: '+e.message;painel();});}
function zerar(){if(!SEL)return;SEL.b.sub(SEL.aj);SEL.aj=V3();SEL.ar=V3();applyEx();MSG='Ajuste zerado: clique em Salvar para gravar';painel();}

/* painel sobre o 3D */
const st=document.createElement('style');st.textContent=`#pfcMv{position:absolute;left:10px;bottom:10px;z-index:30;width:max-content;max-width:min(292px,calc(100% - 20px));max-height:calc(100% - 20px);overflow:auto;background:rgba(16,32,31,.9);color:#fff;border-radius:11px;padding:7px 8px;font:500 12px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.22)}
#pfcMv b{color:#f2c063}#pfcMv .r{display:flex;gap:4px;flex-wrap:wrap;margin-top:5px;align-items:center}
#pfcMv .hd{display:flex;gap:4px;align-items:center}#pfcMv .hd .nm{flex:1;white-space:nowrap;margin-right:4px}
#pfcMv select{width:auto!important;display:inline-block!important}
#pfcMv button,#pfcMv select{border:1px solid rgba(255,255,255,.26);background:transparent;color:#fff;border-radius:7px;padding:3px 7px;font:600 11.5px system-ui;cursor:pointer;line-height:1.3}
#pfcMv button:hover{background:rgba(255,255,255,.1)}#pfcMv button.p{background:#2bb3a6;border-color:#2bb3a6;color:#062b28}#pfcMv button.on{background:#fff;color:#0a4f4b;border-color:#fff}
#pfcMv button.x{border:0;padding:2px 5px;font-size:13px;opacity:.8}
#pfcMv .lb{font-size:11px;color:#bfe3df}
#pfcMv details{border-top:1px solid rgba(255,255,255,.16);margin-top:6px;padding-top:4px}#pfcMv summary{cursor:pointer;font:700 11px system-ui;color:#9fd8d1;letter-spacing:.03em;list-style:none}#pfcMv summary::-webkit-details-marker{display:none}
#pfcMv .g{display:grid;grid-template-columns:auto 22px 38px 22px 8px auto 22px 34px 22px;gap:3px 3px;align-items:center;margin-top:5px}
#pfcMv .g button{padding:1px 0;width:22px}#pfcMv .g span{font:600 11px ui-monospace,monospace;color:#cfe9e5;text-align:center}#pfcMv .g .t{text-align:left;color:#9fd8d1}
#pfcMv .m{font-size:11px;color:#bfe3df;margin-top:4px}#pfcMv .dica{color:#bfe3df;font-size:11.5px}`;document.head.appendChild(st);
const P=document.createElement('div');P.id='pfcMv';let AJOPEN=false;
P.addEventListener('toggle',e=>{if(e.target.tagName==='DETAILS'){AJOPEN=e.target.open;const sm=e.target.querySelector('summary');if(sm)sm.textContent='🔧 Ajuste técnico · só a Matriz '+(AJOPEN?'▴':'▾');}},true);
const nf=v=>String(v).replace('.',',');
function painel(soVal){const h=document.getElementById('stage');if(!h)return;if(!P.parentNode)h.appendChild(P);
  if(testando()){P.hidden=true;return;}P.hidden=false;
  const algum=Object.keys(MV).length||Object.keys(MR).length;
  if(!SEL){const noc=MATRIZ?todas().filter(x=>x.oc).length:0;P.innerHTML=`<span class="dica">🖐 <b>Dois cliques</b> numa peça ou acessório para escolher, mover e girar.</span>${noc?`<div class="m">🙈 ${noc} peça${noc>1?'s':''} oculta${noc>1?'s':''} nesta tipologia (transparentes, só a Matriz vê).</div>`:''}${MSG2?`<div class="m">${MSG2}</div>`:''}${algum?'<div class="r"><button class="p" data-a="volta">↺ Voltar ao original</button></div>':''}`;MSG2='';return;}
  if(soVal&&P.querySelector('[data-v="giro"]')){const r=MR[SEL.pid]||V3();P.querySelector('[data-v="giro"]').textContent=`${nf(r1(r.x))}°·${nf(r1(r.y))}°·${nf(r1(r.z))}°`;return;}
  const u=SEL.o.userData||{},nome=(u.code||u.comp||u.zone||'Peça'),r=MR[SEL.pid]||V3();
  let s=`<div class="hd"><span class="nm">Peça <b>${nome}</b></span><button data-a="modo" data-m="mover" class="${MODO==='mover'?'on':''}" title="Segure e arraste para mover">✥ Mover</button><button data-a="modo" data-m="girar" class="${MODO==='girar'?'on':''}" title="Segure e arraste para girar 360°">⟳ Girar</button><button class="x" data-a="solta" title="Soltar peça">✕</button></div>
   <div class="r"><span class="lb">90°</span><button data-a="g90" data-e="x">X</button><button data-a="g90" data-e="y">Y</button><button data-a="g90" data-e="z">Z</button><button class="p" data-a="volta" title="Voltar ao original">↺ Original</button><span class="lb" data-v="giro">${nf(r1(r.x))}°·${nf(r1(r.y))}°·${nf(r1(r.z))}°</span></div>`;
  if(MATRIZ){const [dx,dy,dz]=ajMM(),[rx,ry,rz]=ajG();
    s+=`<details ${AJOPEN?'open':''}><summary>🔧 Ajuste técnico · só a Matriz ${AJOPEN?'▴':'▾'}</summary>
     <div class="r"><span class="lb">Passo</span><select data-a="passo">${[0.5,1,2,5,10].map(v=>`<option value="${v}" ${v===PASSO?'selected':''}>${nf(v)} mm</option>`).join('')}</select><select data-a="passog">${[1,5,15,45,90].map(v=>`<option value="${v}" ${v===PASSOG?'selected':''}>${v}°</option>`).join('')}</select></div>
     <div class="g">${[['x',dx,rx],['y',dy,ry],['z',dz,rz]].map(([e,v,g])=>`<span class="t">${e.toUpperCase()}</span><button data-a="aj" data-e="${e}" data-s="-1">−</button><span>${nf(v)}</span><button data-a="aj" data-e="${e}" data-s="1">+</button><i></i><span class="t">G${e.toUpperCase()}</span><button data-a="ajg" data-e="${e}" data-s="-1">⟲</button><span>${nf(g)}°</span><button data-a="ajg" data-e="${e}" data-s="1">⟳</button>`).join('')}</div>
     <div class="r"><button class="p" data-a="salvar">💾 Salvar</button><button data-a="zerar">Zerar</button>${SEL.oc?'<button data-a="mostra">👁 Mostrar</button>':'<button data-a="oculta">🙈 Ocultar</button>'}</div>${MSG?`<div class="m">${MSG}</div>`:''}</details>`;}
  P.innerHTML=s;}
P.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.stopPropagation();const a=b.dataset.a;
  if(a==='volta')voltar();if(a==='solta')marca(null);if(a==='modo'){MODO=b.dataset.m;painel();}if(a==='g90')gira90(b.dataset.e,1);
  if(a==='aj'){MSG='';ajusta(b.dataset.e,+b.dataset.s*PASSO);}if(a==='ajg'){MSG='';ajGira(b.dataset.e,+b.dataset.s*PASSOG);}
  if(a==='salvar')salvar();if(a==='zerar')zerar();if(a==='oculta')salvar(true);if(a==='mostra')salvar(false);});
P.addEventListener('change',e=>{if(e.target.dataset.a==='passo')PASSO=+e.target.value;if(e.target.dataset.a==='passog')PASSOG=+e.target.value;});
['pointerdown','dblclick','wheel'].forEach(t=>P.addEventListener(t,e=>e.stopPropagation()));
})();

/* ===== Substituições possíveis: só indicação do catálogo (não troca a peça no 3D) ===== */
(function(){
const card=document.getElementById('c-swap');if(!card)return;
const sm=card.querySelector('summary h2');if(sm)sm.textContent='Substituições possíveis';
const nt=card.querySelector('.note');if(nt)nt.innerHTML='Indicação do catálogo: perfis que podem substituir o original na mesma posição. <b>A montagem em 3D continua com o original.</b> Passe o mouse para ver o perfil.';
const st=document.createElement('style');st.textContent=`.sbi{border:1px solid #d8e2e6;border-radius:12px;padding:10px 12px;margin-bottom:10px;background:#fff}
.sbi .h{display:flex;align-items:center;gap:8px;font:600 14px var(--f-body,system-ui)}.sbi .h i{width:12px;height:12px;border-radius:3px;display:inline-block}.sbi .h b{font-family:var(--f-mono,monospace)}.sbi .h span{color:#5a6b75;font-weight:500}
.sbi .p{font-size:13px;color:#5a6b75;margin:8px 0 6px}.sbi .o{display:flex;gap:6px;flex-wrap:wrap}
.sbi .o span{display:inline-flex;flex-direction:column;border:1px dashed #9fb3bf;border-radius:10px;padding:6px 10px;font:600 13px var(--f-mono,monospace);cursor:help;background:#f6f9fa}
.sbi .o span small{font:500 11.5px var(--f-body,system-ui);color:#5a6b75}`;document.head.appendChild(st);
renderSwap=function(){try{S.swaps[S.typo]={};}catch(_){}
  const list=ORIGC.filter(c=>ALT[c]);swreset.hidden=true;
  if(!list.length){swl.innerHTML='<p class="note">Esta tipologia não tem substituições indicadas no catálogo.</p>';return;}
  swl.innerHTML=list.map(b=>`<div class="sbi"><div class="h"><i style="background:${css(zcol(b))}"></i><b>${b}</b><span>${PN[b]?PN[b].n:TIT[b]||''}</span></div>
    <div class="p">Pode ser substituído por:</div>
    <div class="o">${ALT[b].map(o=>`<span data-p="${o.split('+')[0]}">${o.replace('+',' + ')}<small>${o.includes('+')?'marco + complemento':(KG[o]?fmt(KG[o],3)+' kg/m':'')}</small></span>`).join('')}</div></div>`).join('');
  swl.querySelectorAll('[data-p]').forEach(x=>x.addEventListener('mouseenter',()=>{try{showProfile(x.dataset.p);}catch(_){}}));};
})();

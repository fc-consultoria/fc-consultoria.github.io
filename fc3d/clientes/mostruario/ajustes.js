/* Plataforma FC 3D Clientes · Mostruário 3D
   1) Mover peças (todos): dois cliques numa peça e arraste para separar; "Voltar ao original" encaixa tudo de novo.
   2) Ajuste técnico (só a Matriz): corrige a posição de uma peça em mm; fica salvo para todas as empresas.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
const SP='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/',SPK='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
const tok=()=>{try{return localStorage.getItem('pfc-token');}catch(_){return null;}};
const rpc=(fn,b)=>fetch(SP+fn,{method:'POST',headers:{apikey:SPK,'Content-Type':'application/json'},body:JSON.stringify(b)}).then(async r=>{const j=await r.json().catch(()=>null);if(!r.ok)throw new Error(j&&j.message||'Falha');return j;});
let AJ={},MV={},SEL=null,SELMAT=null,MATRIZ=false;
window.PFC_AJ={carregar(){return rpc('pfc_ajustes_3d_ler',{p_token:tok()}).then(j=>{AJ=j||{};}).catch(()=>{AJ={};});},matriz(v){MATRIZ=!!v;}};

/* identificação estável de cada peça: tipologia | grupo | código | ordem */
function chaves(){const n={};EX.forEach(x=>{const c=(x.o.userData&&(x.o.userData.code||x.o.userData.zone))||'peca',b=x.k+'|'+c;n[b]=(n[b]||0)+1;x.pid=b+'|'+n[b];});}
const kAJ=x=>S.typo+'|'+x.pid;
const testando=()=>S.mode==='test';

/* depois de montar: aplica os ajustes técnicos na posição de origem de cada peça */
const _build=build;
build=function(){SEL=null;SELMAT=null;MV={};_build.apply(this,arguments);chaves();
  EX.forEach(x=>{const a=AJ[kAJ(x)];if(a){x.aj=new THREE.Vector3(a[0]/1000,a[1]/1000,a[2]/1000);x.b.add(x.aj);}else x.aj=null;});
  applyEx();painel();};
/* depois de posicionar: soma o deslocamento feito à mão */
const _applyEx=applyEx;
let _tm=null;
applyEx=function(){_applyEx.apply(this,arguments);if(_tm!==testando()){_tm=testando();painel();}if(testando())return;EX.forEach(x=>{const v=MV[x.pid];if(v)x.o.position.add(v);});};

/* destaque da peça escolhida */
const MSEL=new THREE.MeshStandardMaterial({color:0x2bb3a6,metalness:.25,roughness:.4,emissive:0x0b4f4a,emissiveIntensity:.55});
function marca(x){if(SEL&&SEL.o&&SELMAT)SEL.o.material=SELMAT;SEL=x;SELMAT=x?x.o.material:null;if(x)x.o.material=MSEL;painel();}
function acha(ev){setRay(ev.clientX,ev.clientY);const h=ray.intersectObjects(EX.map(x=>x.o).filter(o=>o.visible),true)[0];if(!h)return null;
  let o=h.object;const set=new Map(EX.map(x=>[x.o,x]));while(o&&!set.has(o))o=o.parent;return o?{x:set.get(o),p:h.point}:null;}

/* dois cliques escolhem a peça; segurar e arrastar move a peça escolhida */
const el=document.getElementById('evl')||cv;
el.addEventListener('dblclick',ev=>{if(testando())return;const r=acha(ev);ev.preventDefault();ev.stopPropagation();marca(r?r.x:null);},true);
let drag=null;
el.addEventListener('pointerdown',ev=>{if(!SEL||testando()||ev.button!==0)return;const r=acha(ev);if(!r||r.x!==SEL)return;
  ev.stopPropagation();ev.preventDefault();controls.enabled=false;el.setPointerCapture&&el.setPointerCapture(ev.pointerId);
  const n=new THREE.Vector3();camera.getWorldDirection(n);drag={pl:new THREE.Plane().setFromNormalAndCoplanarPoint(n,r.p),p0:r.p.clone(),v0:(MV[SEL.pid]||new THREE.Vector3()).clone(),par:SEL.o.parent};},true);
el.addEventListener('pointermove',ev=>{if(!drag)return;ev.stopPropagation();setRay(ev.clientX,ev.clientY);const p=new THREE.Vector3();if(!ray.ray.intersectPlane(drag.pl,p))return;
  const a=drag.par.worldToLocal(drag.p0.clone()),b=drag.par.worldToLocal(p.clone());MV[SEL.pid]=drag.v0.clone().add(b.sub(a));applyEx();},true);
const solta=ev=>{if(!drag)return;drag=null;controls.enabled=true;if(ev)ev.stopPropagation();painel();};
el.addEventListener('pointerup',solta,true);el.addEventListener('pointercancel',solta,true);
addEventListener('keydown',e=>{if(e.key==='Escape'&&SEL)marca(null);});

function voltar(){MV={};applyEx();marca(null);}
/* ajuste técnico: soma mm na origem da peça (eixo X largura, Y altura, Z profundidade) */
function ajusta(eixo,mm){if(!SEL)return;const v=new THREE.Vector3();v[eixo]=mm/1000;SEL.b.add(v);SEL.aj=(SEL.aj||new THREE.Vector3()).add(v);applyEx();painel(true);}
function ajMM(){const a=SEL&&SEL.aj||new THREE.Vector3();return [a.x,a.y,a.z].map(v=>Math.round(v*10000)/10);}
let PASSO=1,MSG='';
function salvar(){if(!SEL)return;const [dx,dy,dz]=ajMM(),k=kAJ(SEL),i=k.indexOf('|');MSG='Salvando…';painel();
  rpc('pfc_ajuste_3d_salvar',{p_token:tok(),p_tipologia:k.slice(0,i),p_peca:k.slice(i+1),p_dx:dx,p_dy:dy,p_dz:dz})
   .then(()=>{if(dx||dy||dz)AJ[k]=[dx,dy,dz];else delete AJ[k];MSG='✓ Ajuste salvo para todas as empresas';painel();})
   .catch(e=>{MSG='Não foi possível salvar: '+e.message;painel();});}
function zerar(){if(!SEL||!SEL.aj)return;SEL.b.sub(SEL.aj);SEL.aj=null;applyEx();MSG='Ajuste zerado: clique em Salvar para gravar';painel();}

/* painel sobre o 3D */
const st=document.createElement('style');st.textContent=`#pfcMv{position:absolute;left:12px;bottom:12px;z-index:30;max-width:min(380px,calc(100% - 24px));background:rgba(16,32,31,.93);color:#fff;border-radius:14px;padding:10px 12px;font:500 13px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)}
#pfcMv b{color:#f2c063}#pfcMv .r{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center}
#pfcMv select{width:auto!important;display:inline-block!important}
#pfcMv button,#pfcMv select{border:1px solid rgba(255,255,255,.28);background:transparent;color:#fff;border-radius:9px;padding:6px 10px;font:600 12.5px system-ui;cursor:pointer}
#pfcMv button:hover{background:rgba(255,255,255,.1)}#pfcMv button.p{background:#2bb3a6;border-color:#2bb3a6;color:#062b28}
#pfcMv .aj{border-top:1px solid rgba(255,255,255,.18);margin-top:9px;padding-top:8px}#pfcMv .aj h4{margin:0;font:700 12.5px system-ui;color:#9fd8d1;letter-spacing:.04em}
#pfcMv .g{display:grid;grid-template-columns:auto 1fr 1fr auto;gap:5px 6px;align-items:center;margin-top:6px}#pfcMv .g span{font:600 12px ui-monospace,monospace;color:#cfe9e5}
#pfcMv .m{font-size:12px;color:#bfe3df;margin-top:6px}#pfcMv .dica{color:#bfe3df}`;document.head.appendChild(st);
const P=document.createElement('div');P.id='pfcMv';
function host(){return document.getElementById('stage');}
function painel(){const h=host();if(!h)return;if(!P.parentNode)h.appendChild(P);
  const algum=Object.keys(MV).length>0;
  if(testando()){P.hidden=true;return;}P.hidden=false;
  if(!SEL){P.innerHTML=`<span class="dica">🖐 <b>Dois cliques</b> numa peça para escolher e arrastar.</span>${algum?'<div class="r"><button class="p" data-a="volta">↺ Voltar ao original</button></div>':''}`;return;}
  const u=SEL.o.userData||{},nome=(u.code||u.zone||'Peça')+(u.lbl&&typeof u.lbl==='string'?' · '+u.lbl:'');
  let s=`<div>Peça: <b>${nome}</b> · segure e arraste para mover</div><div class="r"><button class="p" data-a="volta">↺ Voltar ao original</button><button data-a="solta">✕ Soltar peça</button></div>`;
  if(MATRIZ){const [dx,dy,dz]=ajMM();
    s+=`<div class="aj"><h4>🔧 AJUSTE TÉCNICO · SÓ A MATRIZ</h4><div class="r">Passo <select data-a="passo">${[0.5,1,2,5,10].map(v=>`<option value="${v}" ${v===PASSO?'selected':''}>${String(v).replace('.',',')} mm</option>`).join('')}</select></div>
     <div class="g">${[['x','X (largura)',dx],['y','Y (altura)',dy],['z','Z (profundidade)',dz]].map(([e,t,v])=>`<span>${t}</span><button data-a="aj" data-e="${e}" data-s="-1">−</button><button data-a="aj" data-e="${e}" data-s="1">+</button><span>${String(v).replace('.',',')} mm</span>`).join('')}</div>
     <div class="r"><button class="p" data-a="salvar">💾 Salvar ajuste</button><button data-a="zerar">Zerar ajuste</button></div>${MSG?`<div class="m">${MSG}</div>`:''}</div>`;}
  P.innerHTML=s;}
P.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.stopPropagation();const a=b.dataset.a;
  if(a==='volta')voltar();if(a==='solta')marca(null);if(a==='aj'){MSG='';ajusta(b.dataset.e,+b.dataset.s*PASSO);}if(a==='salvar')salvar();if(a==='zerar')zerar();});
P.addEventListener('change',e=>{if(e.target.dataset.a==='passo')PASSO=+e.target.value;});
['pointerdown','dblclick','wheel'].forEach(t=>P.addEventListener(t,e=>e.stopPropagation()));
})();

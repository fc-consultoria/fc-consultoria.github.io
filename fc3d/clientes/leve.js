/* ===== Plataforma FC 3D · Modo leve automático (06/11/2026) =====
   Em computador fraco ou sem aceleração gráfica, o 3D trava. Este arquivo detecta isso e deixa o 3D mais leve
   (resolução 1x, sem suavização de bordas e sem sombras) sem mudar nada do que aparece na tela.
   Também mede a fluidez no próprio aparelho: se ficar abaixo de ~20 quadros por segundo, liga o modo leve.
   Escolha manual guardada no aparelho: localStorage 'fc3d-leve' = '1' (sempre leve), '0' (nunca), vazio (automático). */
(function(){
  if(window.FC3DLeve!==undefined)return;
  const LS={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
  const q=new URLSearchParams(location.search);
  if(q.has('leve'))LS.set('fc3d-leve',q.get('leve')==='0'?'0':'1');
  const escolha=LS.get('fc3d-leve');
  let motivo='',semGPU=false;
  try{
    const c=document.createElement('canvas'),g=c.getContext('webgl')||c.getContext('experimental-webgl');
    if(!g)motivo='sem 3D no navegador';
    else{const x=g.getExtension('WEBGL_debug_renderer_info'),r=String(x?g.getParameter(x.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER)||'');
      if(/swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i.test(r)){semGPU=true;motivo='aceleração gráfica desligada';}
      const l=g.getExtension('WEBGL_lose_context');if(l)l.loseContext();}
  }catch(_){}
  if(!motivo&&(navigator.hardwareConcurrency||8)<=2)motivo='processador fraco';
  if(!motivo&&navigator.deviceMemory&&navigator.deviceMemory<=2)motivo='pouca memória';
  let leve=escolha==='1'||(escolha!=='0'&&!!motivo);
  window.FC3DLeve=leve;

  /* ---- deixa o 3D leve: vale para todos os renderizadores criados nas telas ---- */
  let feito=false;
  function aplicar(){
    const T=window.THREE;if(!T||!T.WebGLRenderer||feito)return!!feito;feito=true;
    const P=T.WebGLRenderer.prototype,spr=P.setPixelRatio,rnd=P.render;
    P.setPixelRatio=function(v){return spr.call(this,window.FC3DLeve?Math.min(1,v||1):v);};
    P.render=function(){
      if(window.FC3DLeve&&!this.__fcLeve){this.__fcLeve=1;try{this.shadowMap.enabled=false;if(this.getPixelRatio()>1){const s=this.getSize(new T.Vector2());spr.call(this,1);this.setSize(s.x,s.y,false);}}catch(_){}}
      return rnd.apply(this,arguments);};
    const O=T.WebGLRenderer;
    function R(p){return new O(window.FC3DLeve?Object.assign({},p,{antialias:false,powerPreference:'low-power'}):p);}
    R.prototype=O.prototype;try{T.WebGLRenderer=R;}catch(_){}
    return true;
  }
  if(!aplicar()){const iv=setInterval(()=>{if(aplicar())clearInterval(iv);},150);setTimeout(()=>clearInterval(iv),120000);}

  /* ---- aviso discreto (uma vez por sessão do navegador) ---- */
  function aviso(txt){
    try{if(sessionStorage.getItem('fc3d-leve-av'))return;sessionStorage.setItem('fc3d-leve-av','1');}catch(_){}
    const go=()=>{const d=document.createElement('div');
      d.style.cssText='position:fixed;right:14px;top:14px;z-index:2147481000;max-width:330px;background:#fff;color:#1d2b31;border:1px solid #d7e0e3;border-radius:12px;padding:12px 14px;box-shadow:0 8px 24px #0002;font:13.5px/1.45 system-ui,-apple-system,Segoe UI,sans-serif';
      d.innerHTML='<b>⚡ Modo leve ligado</b><br>'+txt+(semGPU?'<br><span style="color:#5b6d74">Para melhorar: no Chrome, abra <b>chrome://settings/system</b> e ligue "Usar aceleração gráfica".</span>':'')+
        '<div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end"><button type="button" data-n style="border:1px solid #d7e0e3;background:#fff;border-radius:8px;padding:5px 10px;cursor:pointer;font:inherit">Usar qualidade máxima</button><button type="button" data-ok style="border:0;background:#02717d;color:#fff;border-radius:8px;padding:5px 12px;cursor:pointer;font:600 13px inherit;font-family:inherit">Ok</button></div>';
      d.querySelector('[data-ok]').onclick=()=>d.remove();
      d.querySelector('[data-n]').onclick=()=>{LS.set('fc3d-leve','0');location.reload();};
      document.body.appendChild(d);setTimeout(()=>d.remove(),14000);};
    document.body?go():addEventListener('DOMContentLoaded',go);
  }
  if(leve&&escolha!=='1')aviso('Este computador tem '+motivo+'. O 3D foi ajustado para não travar.');

  /* ---- mede a fluidez de verdade enquanto o 3D roda (só no automático) ---- */
  if(!leve&&escolha!=='0'){
    let n=0,t0=0,ruins=0;
    const passo=ts=>{
      if(window.FC3DLeve)return;
      if(!document.hidden&&document.querySelector('canvas')){if(!t0)t0=ts;n++;
        if(ts-t0>=3000){const fps=n*1000/(ts-t0);n=0;t0=ts;ruins=fps<20?ruins+1:0;
          if(ruins>=2){window.FC3DLeve=true;LS.set('fc3d-leve','1');aviso('O 3D estava travando neste computador. A partir de agora ele abre no modo leve.');return;}}}
      else{n=0;t0=0;}
      requestAnimationFrame(passo);};
    requestAnimationFrame(passo);
  }
})();

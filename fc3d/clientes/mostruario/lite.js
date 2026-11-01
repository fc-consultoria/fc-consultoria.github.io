/* Plataforma FC 3D · modo miniatura (lite) para a tela de Apresentação
   ?lite=1            só a janela 3D + os "+", sem menus, fundo transparente
   ?lite=1&foto=1     igual, sem os "+" (usado para gerar a miniatura)
   ?corte=<k>         no 3D completo, já abre no corte escolhido
   O clique num "+" no modo lite avisa a página de fora (postMessage) em vez de abrir o corte. */
(function(){
const q=new URLSearchParams(location.search),lite=q.get('lite')==='1',foto=q.get('foto')==='1',corte=q.get('corte');
const tq=q.get('t');/* espera a tipologia pedida já montada (a entrada da plataforma monta depois de conferir o acesso) */
const pronto=f=>{let n=0;const t=setInterval(()=>{n++;const ok=typeof S!=='undefined'&&S.typo&&(!tq||typeof TYPOS==='undefined'||!TYPOS[tq]||S.typo===tq)&&typeof hotList!=='undefined'&&hotList.length;if(ok||n>400){clearInterval(t);setTimeout(f,60);}},50);};
if(corte&&!lite)pronto(()=>{try{setCut(corte);}catch(_){}});
if(!lite)return;
const st=document.createElement('style');
st.textContent='html,body,.wrap,.grid{background:transparent!important;overflow:hidden!important}'+
 'body *{visibility:hidden!important;pointer-events:none}'+
 '#stage,#stage>canvas,#evl,#hots,#hots *{visibility:visible!important;pointer-events:auto}'+
 '#stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;min-height:0!important;max-width:none!important;aspect-ratio:auto!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;--mx:0px!important;--my:0px!important;overflow:hidden!important;z-index:9999!important}'+
 '#cutbar{visibility:hidden!important}#labels,#labels *{visibility:visible!important}#labels [visibility="hidden"],#labels [visibility="hidden"] *{visibility:hidden!important}'+
 '#pfcGate,#pfcGate *{visibility:visible!important;pointer-events:auto}'+
 '#hots .apSel{background:#e8a33d!important;transform:translate(-50%,-50%) scale(1.25)!important;box-shadow:0 0 0 6px rgba(232,163,61,.35)!important}'+
 '#stage::before,#stage::after{display:none!important}'+
 (foto?'#hots{display:none!important}':'');
document.head.appendChild(st);
const stg=document.getElementById('stage');stg.classList.remove('pop');
pronto(()=>{
  try{if(S.mode!=='exp')setMode('exp');}catch(_){}
  try{if(typeof setView==='function')setView('persp');}catch(_){}
  dispatchEvent(new Event('resize'));
  const avisa=m=>{try{parent.postMessage(Object.assign({fc3d:1,t:S.typo},m),'*');}catch(_){}};
  /* "+" avisa a página de fora com o nome e a descrição do corte (os mesmos do 3D completo) */
  document.getElementById('hots').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;e.stopImmediatePropagation();e.preventDefault();
    const it=hotList.find(x=>x.b===b);if(!it)return;const r=b.getBoundingClientRect();
    const xs=hotList.filter(x=>!x.b.hidden).map(x=>{const q=x.b.getBoundingClientRect();return q.left+q.width/2;});
    avisa({ev:'hot',k:it.c.k,n:it.c.n,d:it.c.d,x:r.left+r.width/2,y:r.top+r.height/2,x0:Math.min(...xs),x1:Math.max(...xs)});
    /* o 3D não aproxima mais: só marca o + escolhido e a página de fora mostra os detalhes ao lado */
    hotList.forEach(x=>x.b.classList.toggle('apSel',x.b===b));
  },true);
  /* giro 360°: a esquadria gira sozinha; ao arrastar ou tocar num +, para e avisa a página de fora */
  const giro=on=>{try{controls.autoRotate=!!on;controls.autoRotateSpeed=9;camTarget=null;}catch(_){}avisa({ev:'giro',on:!!on});};
  const evl=document.getElementById('evl');if(evl)evl.addEventListener('pointerdown',()=>{try{if(controls.autoRotate)giro(false);}catch(_){}});
  addEventListener('message',e=>{const m=e.data;if(!m)return;if(m.fc3d==='sair'){hotList.forEach(x=>x.b.classList.remove('apSel'));}if(m.fc3d==='giro')giro(m.on);});
  if(!foto)giro(true);/* já começa girando, sem esperar a página de fora */
  setTimeout(()=>avisa({ev:'pronto',n:TYPOS[S.typo].n||''}),60);
});
})();

/* Plataforma FC 3D · tela da planta mais simples (17/11/2026)
   Só reorganiza o que já existe na tela (não apaga nada, não muda o banco):
   - topo: casa, Planta/3D, "Mais" e Apresentação; o resto vai para o menu "Mais"
   - painel da esquerda: passos 1-2 no topo; Linha, base e cor recolhidos
   - painel da obra (direita): vira um contador; abre ao clicar
   Para voltar como estava: tirar a linha que carrega este arquivo no porta.html. */
(function(){
  'use strict';
  if(window.__fcSimples)return;window.__fcSimples=1;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var css=document.createElement('style');
  css.textContent=[
    'header .tt span{display:none!important}',
    '#fcMaisW{position:relative;display:inline-flex}',
    '#fcMaisB{display:inline-flex;align-items:center;gap:6px}',
    '#fcMaisB[aria-expanded="true"]{border-color:#c9a66b!important}',
    '#fcMaisM{position:absolute;right:0;top:calc(100% + 8px);z-index:60;min-width:250px;background:#1a1b1e;border:1px solid #34353a;border-radius:14px;padding:8px;display:none;flex-direction:column;gap:6px;box-shadow:0 12px 32px rgba(0,0,0,.45)}',
    '#fcMaisM.on{display:flex}',
    '#fcMaisM .fcG{display:flex;flex-direction:column;gap:6px;padding:4px}',
    '#fcMaisM .fcG+.fcG{border-top:1px solid #2c2d31;padding-top:10px}',
    '#fcMaisM .fcK{font:600 10.5px ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#8b8d92}',
    '#fcMaisM .fcG>*:not(.fcK){position:static!important;inset:auto!important;transform:none!important;margin:0!important;box-shadow:none!important}',
    '#fcMaisM .fcG>button{width:100%!important;justify-content:flex-start!important;text-align:left!important}',
    '#fcMaisM label.hr{display:flex!important;align-items:center;gap:8px}',
    '#fcMaisM label.hr input{flex:1}',
    '#fcPas{display:flex;flex-direction:column;gap:6px;margin:0 0 10px;font-size:13px;color:#b9b6af}',
    '#fcPas span{display:flex;align-items:center;gap:8px}',
    '#fcPas i{font-style:normal;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:#c9a66b;color:#141416;flex:none}',
    '#fcOpc{margin-top:12px;border:1px solid #2c2d31;border-radius:12px;padding:0 12px}',
    '#fcOpc summary{cursor:pointer;list-style:none;padding:11px 0;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:13.5px;font-weight:600}',
    '#fcOpc summary::-webkit-details-marker{display:none}',
    '#fcOpc summary small{font-weight:400;color:#8b8d92;font-size:12px;text-align:right}',
    '#fcOpc[open]{padding-bottom:12px}',
    '#fcObraB{position:fixed;right:16px;bottom:46px;z-index:30;display:none;align-items:center;gap:12px;background:#1a1b1e;color:#f0efec;border:1px solid #34353a;border-radius:14px;padding:10px 14px;font:inherit;cursor:pointer;text-align:left}',
    '#fcObraB b{font-size:17px;display:block}#fcObraB small{color:#8b8d92;font-size:11.5px;display:block}',
    '#fcObraB em{font-style:normal;color:#c9a66b;font-size:13px;font-weight:600}',
    '#fcObraX{background:none;border:1px solid #34353a;color:#d8d6d0;border-radius:99px;width:30px;height:30px;cursor:pointer;flex:none}',
    '@media (min-width:761px){#fcObraB{display:flex}body:not(.fcObra) #pr{display:none!important}body.fcObra #fcObraB{display:none}}',
    '@media (max-width:760px){#fcObraX{display:none}}',
    'body.pres #fcMaisW,body.pres #fcObraB{display:none!important}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---- menu "Mais" ---- */
  var tools=$('header .tools'),pres=$('#bPres');
  if(!tools||!pres)return;
  var W=document.createElement('div');W.id='fcMaisW';
  W.innerHTML='<button type="button" class="bt" id="fcMaisB" aria-haspopup="true" aria-expanded="false">Mais <span aria-hidden="true">▾</span></button>'+
    '<div id="fcMaisM" role="menu"><div class="fcG" id="fcGv"><div class="fcK">Visual</div></div><div class="fcG" id="fcGa"><div class="fcK">Mostrar</div></div><div class="fcG" id="fcGo"><div class="fcK">Outros</div></div></div>';
  tools.insertBefore(W,pres);
  var B=$('#fcMaisB'),M=$('#fcMaisM'),Gv=$('#fcGv'),Ga=$('#fcGa'),Go=$('#fcGo');
  function abre(on){M.classList.toggle('on',on);B.setAttribute('aria-expanded',on?'true':'false')}
  B.addEventListener('click',function(e){e.stopPropagation();abre(!M.classList.contains('on'))});
  document.addEventListener('click',function(e){if(M.classList.contains('on')&&!W.contains(e.target))abre(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')abre(false)});
  M.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&!b.closest('.seg'))setTimeout(function(){abre(false)},50)});

  function poe(el,g){if(el&&el.parentNode!==g){g.appendChild(el);atualizaGrupos()}}
  function atualizaGrupos(){[Gv,Ga,Go].forEach(function(g){g.style.display=g.children.length>1?'':'none'})}
  function arruma(){
    var rx=$('#vCasa');if(rx&&rx.parentNode&&rx.parentNode.classList.contains('seg'))poe(rx.parentNode,Gv);
    poe($('header label.hr'),Gv);
    $$('header .tools > button, header .tools > .bt').forEach(function(b){
      if(b===pres||b.id==='fcMaisB'||b.id==='bTut')return;poe(b,Ga)});
    var qr=$('#fcQrB');if(qr)poe(qr,Ga);
    poe($('#bMarca'),Go);
    var tu=$('#bTut');if(tu){if(!tu.dataset.fc){tu.dataset.fc=1;tu.textContent='? Como usar';tu.style.width='auto';tu.style.padding='';tu.classList.remove('novo')}poe(tu,Go)}
  }
  arruma();atualizaGrupos();
  var n=0,t=setInterval(function(){arruma();if(++n>40)clearInterval(t)},500);
  new MutationObserver(arruma).observe(tools,{childList:true});

  /* ---- painel da esquerda: passos + opções recolhidas ---- */
  var pb=$('#pl .pb'),typs=$('#typs');
  if(pb&&typs&&!$('#fcPas')){
    var ps=document.createElement('div');ps.id='fcPas';
    ps.innerHTML='<span><i>1</i>Escolha a esquadria</span><span><i>2</i>Clique num vão dourado da casa</span>';
    pb.insertBefore(ps,typs);
    var h=$('#hint');if(h)h.style.display='none';
    var d=document.createElement('details');d.id='fcOpc';
    d.innerHTML='<summary><span>Linha, base e cor</span><small id="fcOpcS"></small></summary>';
    var lbls=$$('.lbl',pb),ini=lbls[0],fim=$('#sw');
    if(ini&&fim){pb.insertBefore(d,ini);var x=ini;while(x){var nx=x.nextElementSibling;d.appendChild(x);if(x===fim)break;x=nx}}
    var S=$('#fcOpcS');
    function resumo(){var a=$('#sLin .on'),b=$('#sBas .on');if(S)S.textContent=[a&&a.textContent,b&&b.textContent].filter(Boolean).join(' · ')}
    resumo();d.addEventListener('click',function(){setTimeout(resumo,30)});
  }

  /* ---- painel da obra vira contador ---- */
  var pr=$('#pr'),cnt=$('#sCnt');
  if(pr&&cnt){
    var ob=document.createElement('button');ob.type='button';ob.id='fcObraB';
    ob.innerHTML='<span><small>Esquadrias na obra</small><b id="fcObraN"></b></span><em>Ver obra</em>';
    document.body.appendChild(ob);
    var N=$('#fcObraN');function sync(){N.textContent=cnt.textContent}
    sync();new MutationObserver(sync).observe(cnt,{childList:true,characterData:true,subtree:true});
    ob.addEventListener('click',function(){document.body.classList.add('fcObra')});
    var ph=$('.ph',pr);if(ph){var xb=document.createElement('button');xb.type='button';xb.id='fcObraX';xb.setAttribute('aria-label','Fechar painel da obra');xb.textContent='✕';
      xb.addEventListener('click',function(){document.body.classList.remove('fcObra')});ph.appendChild(xb)}
  }
})();

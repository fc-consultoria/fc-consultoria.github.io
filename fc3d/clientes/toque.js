/* Plataforma FC 3D © FC Consultoria em Esquadria — uso exclusivo.
   Em tablet e celular (tela de toque), troca as dicas escritas para mouse por dicas de toque. */
(function(){
  if(!window.matchMedia||!matchMedia('(hover: none) and (pointer: coarse)').matches)return;
  document.documentElement.classList.add('toque');
  var R=[
    [/[Pp]asse o mouse numa folha para abrir/g,'Toque numa folha para abrir'],
    [/entre no vão para fechar/g,'toque de novo para fechar'],
    [/[Pp]asse o mouse sobre (o|a|um|uma) /g,function(m,a){return (m[0]==='P'?'Toque n':'toque n')+a+' ';}],
    [/[Pp]asse o mouse (numa|num|nas|nos|na|no) /g,function(m,a){return (m[0]==='P'?'Toque ':'toque ')+a+' ';}],
    [/[Pp]asse o mouse para /g,function(m){return m[0]==='P'?'Toque para ':'toque para ';}],
    [/[Pp]asse o mouse/g,function(m){return m[0]==='P'?'Toque':'toque';}],
    [/Arraste com o mouse para girar/g,'Arraste com o dedo para girar'],
    [/use a rodinha para aproximar/g,'abra dois dedos para aproximar'],
    [/role para aproximar/g,'abra dois dedos para aproximar'],
    [/roda do mouse aproxima/g,'dois dedos aproximam'],
    [/gire a rodinha do mouse para aumentar ou diminuir o zoom/g,'abra dois dedos para aumentar ou diminuir o zoom'],
    [/Segure o mouse e aponte para onde andar · ou setas \/ W A S D · /g,''],
    [/segure o botão do mouse e aponte para onde ir, ou use as setas \/ W A S D\. /g,''],
    [/Clique para /g,'Toque para '],[/[Cc]lique de novo/g,function(m){return m[0]==='C'?'Toque de novo':'toque de novo';}],
    [/clique no /g,'toque no ']
  ];
  function troca(t){if(!t||t.indexOf('ouse')<0&&t.indexOf('lique')<0&&t.indexOf('role')<0&&t.indexOf('vão')<0)return t;for(var i=0;i<R.length;i++)t=t.replace(R[i][0],R[i][1]);return t;}
  function passa(raiz){
    var w=document.createTreeWalker(raiz,NodeFilter.SHOW_TEXT,null),n,v;
    while((n=w.nextNode())){if(n.parentNode&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName))continue;v=troca(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;}
    if(raiz.querySelectorAll)raiz.querySelectorAll('[title]').forEach(function(e){var t=troca(e.title);if(t!==e.title)e.title=t;});
  }
  var ag=0;function tudo(){ag=0;passa(document.body);}
  function inicia(){tudo();new MutationObserver(function(){if(!ag)ag=requestAnimationFrame(tudo);}).observe(document.body,{childList:true,subtree:true,characterData:true});}
  if(document.body)inicia();else document.addEventListener('DOMContentLoaded',inicia);
})();

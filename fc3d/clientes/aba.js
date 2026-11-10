/* FC Consultoria · Plataforma FC 3D · "Ver como cliente" (08/11/2026)
   Aba de teste da FC: o login fica só nesta aba (sessionStorage), então a aba do Acesso FC não cai.
   Carregado no <head> de cada página antes de qualquer leitura do 'pfc-token'.
   © FC Consultoria em Esquadria · uso exclusivo */
(function(){
  var ss;try{ss=window.sessionStorage;if(!ss||ss.getItem('pfc-aba')!=='1')return;}catch(_){return;}
  var K=/^pfc-(token|papel|apres|apres-ativo)$/,P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem;
  P.getItem=function(k){return(this===window.localStorage&&K.test(k))?g.call(ss,k):g.apply(this,arguments);};
  P.setItem=function(k,v){return(this===window.localStorage&&K.test(k))?s.call(ss,k,v):s.apply(this,arguments);};
  P.removeItem=function(k){return(this===window.localStorage&&K.test(k))?r.call(ss,k):r.apply(this,arguments);};
  window.PFC_ABA_TESTE=true;
  if(window.top!==window)return;/* selo só na página de cima */
  if(g.call(ss,'pfc-aba-ab')){/* apresentação desde a abertura: sem selo de teste. Nas telas abertas pela plataforma (Catálogo, Orientativo…),
       botão discreto que volta para a tela da plataforma de onde veio. Na própria plataforma não aparece (ela tem o menu e o Sair). */
    var pl=/^\/fc3d\/clientes\/(index\.html)?$/.test(location.pathname);
    if(pl)return;
    var volta=function(){if(document.getElementById('pfcAbaVolta')||!document.body)return;
      var v=document.createElement('button');v.type='button';v.id='pfcAbaVolta';v.textContent='↩ Voltar para o painel';
      v.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:12px;z-index:2147483000;border:1px solid rgba(0,0,0,.12);border-radius:10px;background:rgba(255,255,255,.9);color:#33494c;font:600 12.5px system-ui,sans-serif;padding:7px 12px;cursor:pointer;opacity:.6;box-shadow:0 4px 12px rgba(0,0,0,.12)';
      v.onmouseenter=function(){v.style.opacity='1'};v.onmouseleave=function(){v.style.opacity='.6'};
      v.onclick=function(){var ref='';try{ref=document.referrer?new URL(document.referrer).pathname:'';}catch(_){}
        if(/^\/fc3d\/clientes\/(index\.html)?$/.test(ref)&&history.length>1)history.back();else location.href='/fc3d/clientes/';};
      document.body.appendChild(v);};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',volta);else volta();
    return;}
  var selo=function(){if(document.getElementById('pfcAbaSelo')||!document.body)return;
    var d=document.createElement('div');d.id='pfcAbaSelo';
    d.style.cssText='position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;gap:8px;align-items:center;background:#4A3300;color:#fff;font:600 13px system-ui,sans-serif;padding:7px 8px 7px 12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.28)';
    var n=(g.call(ss,'pfc-aba-nome')||'cliente');
    d.innerHTML='<span>🧪 Teste FC · vendo como <b></b></span><button type="button" style="border:0;border-radius:8px;background:#F2C14E;color:#4A3300;font:700 12px system-ui;padding:5px 9px;cursor:pointer">Fechar teste</button>';
    d.querySelector('b').textContent=n;
    d.querySelector('button').onclick=function(){try{['pfc-token','pfc-papel','pfc-apres','pfc-apres-ativo','pfc-aba','pfc-aba-nome','pfc-aba-ab','pfc-aba-capa','pfc-aba-in','pfc-aba-tab'].forEach(function(k){r.call(ss,k);});}catch(_){}
      window.close();setTimeout(function(){location.href='/fc3d/clientes/';},300);};
    document.body.appendChild(d);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',selo);else selo();
})();

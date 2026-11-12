/* Plataforma FC 3D · Instalar no celular (11/11/2026)
   - Liga o manifesto e o ícone do app em qualquer tela da plataforma que carregar este arquivo.
   - No celular/tablet, fora do app, mostra o botão "📲 Instalar no celular".
     Android: abre o pedido de instalação do navegador. iPhone: mostra o passo a passo do Safari.
   - Dentro do app instalado o botão não aparece.
   © FC Consultoria em Esquadria · uso exclusivo */
(function(){
  if(window.top!==window||window.FCApp)return;window.FCApp=1;
  var R='/fc3d/clientes/',h=document.head||document.documentElement;
  function tag(n,a){var e=document.createElement(n);for(var k in a)e.setAttribute(k,a[k]);h.appendChild(e);}
  if(!document.querySelector('link[rel="manifest"]'))tag('link',{rel:'manifest',href:R+'manifest.webmanifest'});
  tag('link',{rel:'apple-touch-icon',href:'/img/app-icone-192.png'});
  tag('meta',{name:'apple-mobile-web-app-capable',content:'yes'});
  tag('meta',{name:'mobile-web-app-capable',content:'yes'});
  tag('meta',{name:'apple-mobile-web-app-title',content:'FC 3D'});
  if('serviceWorker' in navigator)navigator.serviceWorker.register(R+'sw.js',{scope:R}).catch(function(){});

  var app=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(app)return;
  var ua=navigator.userAgent;
  var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var movel=ios||/android|mobile/i.test(ua);
  var dentroApp=/Instagram/i.test(ua)?'Instagram':/FBAN|FBAV|FB_IAB/i.test(ua)?'Facebook':/WhatsApp/i.test(ua)?'WhatsApp':/; wv\)/.test(ua)?'aplicativo':'';
  var pedido=null,btn=null;
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();pedido=e;mostrar();});
  addEventListener('appinstalled',function(){if(btn)btn.remove();});

  function caixa(titulo,html){
    var d=document.createElement('div');
    d.style.cssText='position:fixed;inset:0;z-index:2147482000;background:rgba(8,16,20,.72);display:flex;align-items:flex-end;justify-content:center;padding:16px;font:400 15px/1.5 Inter,system-ui,sans-serif';
    d.innerHTML='<div style="background:#fff;color:#14212a;border-radius:16px;max-width:420px;width:100%;padding:20px 20px 16px">'+
      '<b style="font-size:19px;display:block;margin-bottom:8px">'+titulo+'</b>'+html+
      '<button type="button" style="margin-top:14px;width:100%;border:0;border-radius:11px;background:#02717d;color:#fff;font-weight:700;padding:12px;font-size:15px">Entendi</button></div>';
    d.querySelector('button').onclick=function(){d.remove();};
    d.onclick=function(e){if(e.target===d)d.remove();};
    document.body.appendChild(d);
  }
  function mostrar(){
    if(btn||!document.body)return;
    try{if(sessionStorage.getItem('fc-app-oculto'))return;}catch(_){}
    if(!movel&&!pedido)return;
    btn=document.createElement('button');btn.type='button';btn.id='fcAppBtn';
    btn.innerHTML='📲 Instalar no celular';btn.title='Instalar a Plataforma FC 3D no aparelho';
    btn.style.cssText='position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147481000;border:0;border-radius:999px;background:#02717d;color:#fff;font:600 14px Inter,system-ui,sans-serif;padding:10px 16px;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer';
    var x=document.createElement('span');x.textContent=' ×';x.title='Esconder';x.style.cssText='margin-left:6px;opacity:.75;padding:0 2px';
    x.onclick=function(e){e.stopPropagation();btn.remove();try{sessionStorage.setItem('fc-app-oculto','1');}catch(_){}};
    btn.appendChild(x);
    btn.onclick=function(){
      if(pedido){pedido.prompt();pedido.userChoice.then(function(r){if(r.outcome==='accepted')btn.remove();pedido=null;});}
      else if(ios)caixa('Instalar no iPhone / iPad','<ol style="margin:0;padding-left:20px"><li>Abra este link no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> (quadrado com a seta).</li><li>Escolha <b>Adicionar à Tela de Início</b> e toque em <b>Adicionar</b>.</li></ol><p style="margin:10px 0 0;color:#5a6872">O ícone FC 3D fica na tela do celular. Ao abrir, entre com o seu login.</p>');
      else if(dentroApp)caixa('Abra no navegador','Este link abriu dentro do '+dentroApp+'. Toque nos <b>⋮</b> (ou <b>⋯</b>) e escolha <b>Abrir no navegador</b> (Chrome). Lá aparece a opção de instalar.');
      else caixa('Instalar no Android','<ol style="margin:0;padding-left:20px"><li>Abra este link no <b>Chrome</b>.</li><li>Toque nos <b>⋮</b> (canto de cima).</li><li>Escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</li></ol><p style="margin:10px 0 0;color:#5a6872">O ícone FC 3D fica na tela do celular. Ao abrir, entre com o seu login.</p>');
    };
    document.body.appendChild(btn);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mostrar);else mostrar();
})();

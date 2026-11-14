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
  /* 14/11/2026 · o app só pode ser instalado por quem está logado numa empresa cadastrada
     e com a instalação liberada pela FC (Empresas e acessos). Link do cliente final (?ver=) nunca oferece o app. */
  var app=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(app){if('serviceWorker' in navigator)navigator.serviceWorker.register(R+'sw.js',{scope:R}).catch(function(){});return;}
  var Q=new URLSearchParams(location.search);
  if(Q.get('ver')||Q.get('cliente')||/\/(ver|obra)\//.test(location.pathname))return;
  var liberado=false,MEDIDOR=['parceiro-obras','teste-medidor-obras'];
  /* 14/11/2026 · Medidor de Obras: app próprio (nome e ícone separados do FC 3D) para as empresas do Medidor */
  function ligar(emp){
    if(liberado)return;liberado=true;
    var med=MEDIDOR.indexOf(emp)>=0;
    if(med){NOME_APP='Medidor de Obras';}
    if(!document.querySelector('link[rel="manifest"]'))tag('link',{rel:'manifest',href:R+(med?'manifest-medidor.webmanifest':'manifest.webmanifest')});
    tag('link',{rel:'apple-touch-icon',href:'/img/app-icone-192.png'});
    tag('meta',{name:'apple-mobile-web-app-capable',content:'yes'});
    tag('meta',{name:'mobile-web-app-capable',content:'yes'});
    tag('meta',{name:'apple-mobile-web-app-title',content:med?'Medidor de Obras':'FC 3D'});
    if('serviceWorker' in navigator)navigator.serviceWorker.register(R+'sw.js',{scope:R}).catch(function(){});
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mostrar);else mostrar();
  }
  var tkVisto=null;
  function conferir(){
    var tk=null;try{tk=localStorage.getItem('pfc-token');}catch(_){}
    if(!tk||tk===tkVisto)return;tkVisto=tk;
    fetch('https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_sessao',{method:'POST',headers:{apikey:'sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs','Content-Type':'application/json'},body:JSON.stringify({p_token:tk})})
      .then(function(r){return r.ok?r.json():null;}).then(function(d){if(d&&d.app===true)ligar(d.empresa);}).catch(function(){});
  }
  conferir();var iv=setInterval(function(){if(liberado)clearInterval(iv);else conferir();},4000);
  var ua=navigator.userAgent;
  var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var movel=ios||/android|mobile/i.test(ua);
  var dentroApp=/Instagram/i.test(ua)?'Instagram':/FBAN|FBAV|FB_IAB/i.test(ua)?'Facebook':/WhatsApp/i.test(ua)?'WhatsApp':/; wv\)/.test(ua)?'aplicativo':'';
  var pedido=null,btn=null,NOME_APP='Plataforma FC 3D';
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();if(!liberado)return;pedido=e;mostrar();});
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
    if(!liberado||btn||!document.body)return;
    try{if(sessionStorage.getItem('fc-app-oculto'))return;}catch(_){}
    if(!movel&&!pedido)return;
    btn=document.createElement('button');btn.type='button';btn.id='fcAppBtn';
    btn.innerHTML='📲 Instalar '+(NOME_APP==='Medidor de Obras'?'o Medidor de Obras':'no celular');btn.title='Instalar '+NOME_APP+' no aparelho';
    btn.style.cssText='position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147481000;border:0;border-radius:999px;background:#02717d;color:#fff;font:600 14px Inter,system-ui,sans-serif;padding:10px 16px;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer';
    var x=document.createElement('span');x.textContent=' ×';x.title='Esconder';x.style.cssText='margin-left:6px;opacity:.75;padding:0 2px';
    x.onclick=function(e){e.stopPropagation();btn.remove();try{sessionStorage.setItem('fc-app-oculto','1');}catch(_){}};
    btn.appendChild(x);
    btn.onclick=function(){
      if(pedido){pedido.prompt();pedido.userChoice.then(function(r){if(r.outcome==='accepted')btn.remove();pedido=null;});}
      else if(ios)caixa('Instalar no iPhone / iPad','<ol style="margin:0;padding-left:20px"><li>Abra este link no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> (quadrado com a seta).</li><li>Escolha <b>Adicionar à Tela de Início</b> e toque em <b>Adicionar</b>.</li></ol><p style="margin:10px 0 0;color:#5a6872">O ícone '+NOME_APP+' fica na tela do celular. Ao abrir, entre com o seu login.</p>');
      else if(dentroApp)caixa('Abra no navegador','Este link abriu dentro do '+dentroApp+'. Toque nos <b>⋮</b> (ou <b>⋯</b>) e escolha <b>Abrir no navegador</b> (Chrome). Lá aparece a opção de instalar.');
      else caixa('Instalar no Android','<ol style="margin:0;padding-left:20px"><li>Abra este link no <b>Chrome</b>.</li><li>Toque nos <b>⋮</b> (canto de cima).</li><li>Escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</li></ol><p style="margin:10px 0 0;color:#5a6872">O ícone '+NOME_APP+' fica na tela do celular. Ao abrir, entre com o seu login.</p>');
    };
    document.body.appendChild(btn);
  }
})();

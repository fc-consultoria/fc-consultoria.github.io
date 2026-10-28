/* WhatsApp automático · FC Consultoria
   Celular: o link wa.me abre direto o aplicativo do WhatsApp.
   Computador: troca o link pelo WhatsApp Web (web.whatsapp.com), que abre a conversa já com a mensagem,
   sem a página intermediária do wa.me. Vale para links <a> e para window.open. */
(function(){
  if(window.__fcWa)return;window.__fcWa=1;
  var ua=navigator.userAgent||'';
  var celular=/Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|Silk/i.test(ua)||(navigator.maxTouchPoints>1&&/Macintosh/.test(ua));
  function webLink(u){
    if(celular||typeof u!=='string')return null;
    try{
      var x=new URL(u,location.href),fone='',h=x.hostname.toLowerCase();
      if(h==='wa.me')fone=x.pathname.replace(/\D/g,'');
      else if((h==='api.whatsapp.com'||h==='whatsapp.com'||h==='www.whatsapp.com')&&/^\/send/.test(x.pathname))fone=(x.searchParams.get('phone')||'').replace(/\D/g,'');
      else return null;
      var t=x.searchParams.get('text')||'';
      return 'https://web.whatsapp.com/send?'+(fone?'phone='+fone+'&':'')+'text='+encodeURIComponent(t);
    }catch(e){return null}
  }
  window.fcWhats=function(u){return webLink(u)||u};
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey)return;
    var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var n=webLink(a.href);if(!n)return;
    e.preventDefault();window.open(n,'fc-whatsapp');
  },false);
  var wo=window.open;
  window.open=function(u){var n=webLink(u);if(n){var r=[].slice.call(arguments);r[0]=n;r[1]='fc-whatsapp';return wo.apply(window,r)}return wo.apply(window,arguments)};
})();

/* Plataforma FC 3D · Cofre (09/11/2026)
   As telas e a base técnica da plataforma ficam cifradas no site (arquivos .enc).
   A chave só é entregue pelo servidor para quem está com login válido na plataforma (pfc_cofre_chave).
   Sem login, os arquivos baixados não servem para nada.
   © FC Consultoria em Esquadria · criação da FC, uso exclusivo de empresas licenciadas. */
(function(){
  if(window.FCCofre)return;
  var API='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_cofre_chave',KEY='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
  var RAIZ='/fc3d/clientes/';
  var K=null,txt={};
  function token(){try{return localStorage.getItem('pfc-token');}catch(_){return null;}}
  function chave(){
    if(K)return K;
    K=(async function(){
      var t=token();if(!t)throw new Error('sem-login');
      var r=await fetch(API,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({p_token:t})});
      var j=null;try{j=await r.json();}catch(_){}
      if(!r.ok||typeof j!=='string')throw new Error((j&&j.message)||'sem-acesso');
      var b=Uint8Array.from(atob(j),function(c){return c.charCodeAt(0);});
      return crypto.subtle.importKey('raw',b,'AES-GCM',false,['decrypt']);
    })();
    K.catch(function(){K=null;});
    return K;
  }
  function limpa(u){return String(u).split('?')[0].split('#')[0];}
  function texto(u){
    var url=new URL(limpa(u),location.href).href;
    if(txt[url])return txt[url];
    txt[url]=(async function(){
      var k=await chave();
      var r=await fetch(url+'.enc',{cache:'no-cache'});if(!r.ok)throw new Error('arquivo '+r.status);
      var buf=new Uint8Array(await r.arrayBuffer());
      var plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:buf.slice(0,12)},k,buf.slice(12));
      return await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    })();
    txt[url].catch(function(){delete txt[url];});
    return txt[url];
  }
  function aviso(semLogin){
    var d=document.getElementById('cofreMsg')||document.body;
    d.innerHTML='<div style="max-width:420px;margin:12vh auto;text-align:center;font:500 16px system-ui,-apple-system,Segoe UI,sans-serif;color:#16302e;padding:20px">'+
      '<div style="font-size:40px">🔒</div><h2 style="margin:8px 0 10px;font-size:21px">'+(semLogin?'Entre na Plataforma FC 3D':'Acesso não liberado')+'</h2>'+
      '<p style="color:#5a6b69;line-height:1.5">'+(semLogin?'Esta tela é exclusiva das empresas licenciadas. Entre com o seu login para abrir.':'Seu acesso terminou ou foi pausado. Entre de novo ou fale com a FC Consultoria.')+'</p>'+
      '<a href="'+RAIZ+'" style="display:inline-block;margin-top:8px;background:#02717d;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">Ir para a Plataforma FC 3D</a></div>';
  }
  window.FCCofre={
    chave:chave,
    texto:texto,
    json:function(u){return texto(u).then(JSON.parse);},
    /* executa um script cifrado (mesmo efeito de <script src>) */
    script:function(u){return texto(u).then(function(c){var s=document.createElement('script');s.textContent=c+'\n//# sourceURL='+limpa(u);document.head.appendChild(s);});},
    /* abre uma tela cifrada no lugar da página de entrada */
    pagina:async function(u){
      try{var h=await texto(u);document.open();document.write(h);document.close();}
      catch(e){aviso(/sem-login/.test(String(e&&e.message)));try{console.warn('Cofre FC:',e);}catch(_){}}
    }
  };
})();

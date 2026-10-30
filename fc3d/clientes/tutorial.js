/* Plataforma FC 3D · Como usar (tutorial guiado por painel)
   © FC Consultoria em Esquadria — criação da FC, uso exclusivo de empresas licenciadas.
   Cada painel tem o seu passo a passo, separado: cada pessoa vê só o guia do próprio painel.
   Hoje: Colaborador (chave interna "vendedor"), Gestor e Demonstrativo (curto, ~1 min). Portal do Cliente entra depois em GUIAS.
   1ª entrada: tela de boas-vindas (Ver agora / Depois); "Ver agora" passa sozinho com voz feminina (modo automático).
   Ao mudar a tela, revise os passos do painel aqui. Passo cujo alvo não existe na tela é pulado sozinho. */
(function(){
  if(window.PFCtut)return;
  var $=function(s){return document.querySelector(s);};
  var ls={get:function(k){try{return localStorage.getItem(k);}catch(_){return null;}},set:function(k,v){try{localStorage.setItem(k,v);}catch(_){}}};
  var porTexto=function(sel,txt){var L=document.querySelectorAll(sel);for(var i=0;i<L.length;i++)if(L[i].textContent.indexOf(txt)>-1)return L[i];return null;};
  var ehToque=function(){return document.documentElement.classList.contains('toque');};
  var fechaFicha=function(){var b=$('#detFecha');if(b&&!$('#det').hidden)b.click();};
  var cardHero=function(k){return $('.hero [data-ir="'+k+'"]');};

  /* ============ GUIAS POR PAINEL ============ */
  var GUIAS={
    /* ---------- COLABORADOR ---------- */
    vendedor:{nome:'Colaborador',passos:[
      {tab:'inicio',t:'Bem-vindo à Plataforma FC 3D',
       x:'Este é o seu painel de Colaborador. Aqui você escolhe a janela ou a porta, mostra em 3D e explica ao cliente como ela funciona. Vamos passar por cada parte da tela. Leva uns 3 minutos.'},
      {tab:'inicio',alvo:'#menu',t:'Menu do painel',
       x:'Por aqui você troca de tela: Início, Tipologias, Ambientes e Apresentação. A tela em que você está fica sublinhada.'},
      {tab:'inicio',alvo:function(){return cardHero('tip')&&cardHero('tip').parentNode;},t:'Atalhos rápidos',
       x:'Ver tipologias abre a lista de janelas e portas. Modo apresentação abre a tela preparada para TV e telão, para a reunião com o cliente.'},
      {tab:'inicio',alvo:'main .grid',t:'Cartões das ferramentas',
       x:'Cada cartão leva a uma ferramenta. O selo verde "Disponível" mostra o que já está pronto para usar.'},
      {tab:'inicio',alvo:function(){var c=porTexto('main .card','Catálogo de Perfis');return c;},t:'Catálogo de Perfis',
       x:'Todos os perfis da linha com código e desenho. Use na hora do atendimento para confirmar qual perfil vai na esquadria.'},
      {tab:'tip',alvo:'.filtros',t:'Filtrar as tipologias',
       x:'Escolha Janelas, Portas ou Fachadas para ver só o que o cliente procura. Todas mostra tudo de novo.'},
      {tab:'tip',alvo:'.ori',t:'Orientativo de Montagem 3D',
       x:'É o seu estudo. Toque em um assunto (Contramarco, Guarnições, Janelas de Correr…) para abrir só aquele módulo. A barra mostra quantos você já estudou. No fim, faça a Prova final.'},
      {tab:'tip',alvo:'.gtec',t:'Entenda o desenho técnico',
       x:'Toque nos números da folha para ver o que cada parte mostra: elevação, cortes e cotas. Em "Treinar montando o corte" você leva cada perfil até o lugar dele.',
       xToque:'Toque nos números da folha para ver o que cada parte mostra: elevação, cortes e cotas. Em "Treinar montando o corte" você arrasta cada perfil até o lugar dele.'},
      {tab:'tip',alvo:function(){return porTexto('.linha-tit','Linha Suprema');},t:'Linhas Suprema e Gold',
       x:'As tipologias ficam separadas por linha. Cada cartão mostra o desenho da esquadria, o código da montagem no catálogo (ex.: SUP JCR 200) e onde ela é indicada.'},
      {tab:'tip',alvo:'#det .cx',antes:function(){if($('#det').hidden){var b=$('[data-tip]');if(b)b.click();}},depois:fechaFicha,t:'Ficha da tipologia',
       x:'Ao tocar em um cartão, abre a ficha: abertura, número de folhas e onde usar. Os botões levam ao Mostruário 3D (conhecer e montar a janela peça por peça), ao Desenho técnico interativo e ao Orientativo daquele assunto. Fechar volta para a lista.'},
      {tab:'tip',alvo:function(){return porTexto('.linha-tit','Fachadas');},t:'Fachadas',
       x:'Fachada Cortina e Pele de Vidro Atlanta abrem em 3D a partir das medidas da obra. Bom para mostrar ao arquiteto e ao engenheiro.'},
      {tab:'amb',alvo:function(){return $('main a.card[href*="ambientes"]')||$('main .grid');},t:'Ambientes · Monte sua Casa',
       x:'Coloque as esquadrias na planta da casa, troque telhado, paredes e cor dos perfis e passeie pela casa com o cliente. Os outros ambientes aparecem como "Em construção" até serem liberados.'},
      {tab:'apr',alvo:'main .hero',t:'Modo apresentação',
       x:'Abra a Apresentação de Obra, coloque as medidas e mostre em tela cheia na TV ou no telão, sem menus atrapalhando.'},
      {tab:'apr',alvo:'main .aviso',t:'Sempre é simulação',
       x:'Tudo na plataforma é apresentação e simulação. Medidas, pesos e cálculo final são confirmados no sistema de cálculo da empresa e com o fornecedor. Fale isso ao cliente.'},
      {tab:'inicio',alvo:'#btTema',t:'Fundo claro ou escuro',
       x:'Troca o fundo da tela. O escuro é melhor para apresentar na TV.'},
      {tab:'inicio',alvo:'#btSair',t:'Sair',
       x:'Use ao terminar, principalmente em computador ou TV que outras pessoas usam.'},
      {tab:'inicio',alvo:'#btAjuda',t:'Pronto!',
       x:'Sempre que precisar, toque em "?" para ver este guia de novo. Dúvidas: fale com o gestor da sua empresa ou com a FC (segunda a sexta, 8h às 11h e 13h às 17h).'}
    ]}
  };

  /* ---------- GESTOR ----------
     Mesmas telas do Colaborador + Gestão. Reaproveita os passos comuns (pc) e troca o que muda para o gestor. */
  var C=GUIAS.vendedor.passos,pc=function(t){for(var k=0;k<C.length;k++)if(C[k].t===t)return C[k];};
  var mais=function(o,n){var r={};for(var k in o)r[k]=o[k];for(k in n)r[k]=n[k];return r;};
  GUIAS.gestor={nome:'Gestor',passos:[
    {tab:'inicio',t:'Bem-vindo, gestor',
     x:'Este é o painel do Gestor. Você tem tudo o que a equipe usa para apresentar as esquadrias ao cliente e, além disso, a área de Gestão. Vamos passar por cada parte. Leva uns 3 minutos.'},
    mais(pc('Menu do painel'),{x:'Por aqui você troca de tela: Início, Tipologias, Ambientes, Apresentação e Gestão. Gestão só aparece para o gestor; a equipe não vê.'}),
    pc('Atalhos rápidos'),
    mais(pc('Cartões das ferramentas'),{x:'Cada cartão leva a uma ferramenta. O selo verde "Disponível" mostra o que já está pronto; "Em construção" é o que a FC ainda vai liberar.'}),
    pc('Catálogo de Perfis'),
    pc('Filtrar as tipologias'),
    mais(pc('Orientativo de Montagem 3D'),{x:'É o estudo da equipe: módulos por assunto e a Prova final. Oriente cada colaborador a estudar os módulos antes de atender. Assim todos explicam a esquadria do mesmo jeito.'}),
    pc('Entenda o desenho técnico'),
    pc('Linhas Suprema e Gold'),
    pc('Ficha da tipologia'),
    pc('Fachadas'),
    pc('Ambientes · Monte sua Casa'),
    pc('Modo apresentação'),
    mais(pc('Sempre é simulação'),{x:'Tudo na plataforma é apresentação e simulação. Medidas, pesos e cálculo final são confirmados no sistema de cálculo da empresa e com o fornecedor. Reforce isso com a equipe.'}),
    {tab:'ges',alvo:'main .vazio',t:'Gestão',
     x:'Aqui ficarão os acessos da equipe, o uso de cada pessoa (quem entrou e o que apresentou) e os dados da licença. Enquanto a área está em construção, para incluir, trocar ou tirar alguém da equipe, fale com a FC.'},
    {tab:'inicio',t:'Guia da equipe',
     x:'Cada colaborador tem o próprio guia "Como usar", que abre sozinho no primeiro acesso dele. Se alguém tiver dúvida, peça para tocar no "?" no topo da tela.'},
    pc('Fundo claro ou escuro'),
    pc('Sair'),
    mais(pc('Pronto!'),{x:'Sempre que precisar, toque em "?" para ver este guia de novo. Dúvidas sobre a plataforma ou sobre a licença: fale com a FC (segunda a sexta, 8h às 11h e 13h às 17h).'})
  ]};
  /* ---------- DEMONSTRATIVO (teste de 3 dias) ----------
     Curto (cerca de 1 minuto): o melhor da plataforma e o convite para falar com a FC. */
  GUIAS.demo={nome:'Demonstrativo',curto:true,passos:[
    {tab:'inicio',t:'Bem-vindo à Plataforma FC 3D',
     x:'Em um minuto eu mostro como funciona. Aqui a equipe da vidraçaria apresenta janelas e portas de alumínio em 3D para o cliente, no celular, no notebook ou na TV.'},
    {tab:'inicio',alvo:'.demo-bar',t:'O seu teste de 3 dias',
     x:'Aqui aparece quanto tempo falta do seu teste. Gostou? Por este botão você fala direto com a FC pelo WhatsApp.'},
    {tab:'inicio',alvo:'#menu',t:'Menu',
     x:'Por aqui você navega: Início, Tipologias e Apresentação.'},
    {tab:'tip',alvo:'#vit',t:'Linhas Suprema e Gold',
     x:'Escolha a linha e veja as janelas e portas de mercado, cada uma com o desenho e o código da montagem no catálogo.'},
    {tab:'tip',alvo:'#det .cx',antes:function(){if($('#det').hidden){var b=$('[data-tip]');if(b)b.click();}},depois:fechaFicha,t:'Ficha da tipologia',
     x:'Toque em uma tipologia para abrir a ficha: como ela abre, onde usar e o botão para ver em 3D, girando a janela e abrindo as folhas.'},
    {tab:'apr',alvo:'main .hero',t:'Apresentação na TV',
     x:'No modo apresentação a tela fica limpa, sem menus, para mostrar na TV ou no telão durante a reunião com o cliente.'},
    {tab:'inicio',alvo:'#btAjuda',t:'Pronto! Agora é com você',
     x:'Explore à vontade durante os 3 dias. Para ver este passo a passo de novo, toque em Como funciona. Quer a plataforma para a sua equipe? Fale com a FC pelo WhatsApp.'}
  ]};
  /* arquiteto (Portal do Cliente): próximo */

  /* ============ ESTILO ============ */
  var css=document.createElement('style');
  css.textContent=
  '#tutVeu{position:fixed;inset:0;z-index:1000;pointer-events:auto}'+
  '#tutFoco{position:fixed;border-radius:14px;box-shadow:0 0 0 3px var(--teal),0 0 0 9999px rgba(8,18,24,.62);transition:all .25s ease;pointer-events:none;z-index:1001}'+
  '#tutFoco.sem{box-shadow:0 0 0 9999px rgba(8,18,24,.62);width:0!important;height:0!important;left:50%!important;top:50%!important}'+
  '#tutCx{position:fixed;z-index:1002;width:min(380px,calc(100vw - 32px));background:var(--panel);color:var(--ink);border-radius:16px;padding:18px;box-shadow:0 14px 40px rgba(0,0,0,.35);border:1px solid var(--line)}'+
  '#tutCx h3{font-size:18px;margin:6px 0 6px}#tutCx p{font-size:14.5px;line-height:1.5;color:var(--ink)}'+
  '#tutCx .tq{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--mute)}'+
  '#tutCx .tq .sp{flex:1}#tutCx .tq button{all:unset;cursor:pointer;color:var(--teal);font-weight:600}'+
  '#tutCx .bar{height:4px;border-radius:9px;background:var(--soft);overflow:hidden;margin:10px 0 2px}#tutCx .bar s{display:block;height:100%;background:var(--teal);transition:width .25s}'+
  '#tutCx .bts{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}#tutCx .bts .btn{min-height:40px;padding:9px 14px}#tutCx .bts .sp{flex:1}'+
  '#tutCx ol{margin:10px 0 0;padding:0 0 0 20px;max-height:46vh;overflow:auto;font-size:14px}#tutCx ol li{padding:4px 0}#tutCx ol button{all:unset;cursor:pointer;color:var(--ink)}#tutCx ol li.at button{color:var(--teal);font-weight:700}'+
  '#tutCx .wm{margin-top:10px;font-size:10.5px;letter-spacing:.06em;color:var(--mute);text-transform:uppercase}'+
  '#btAjuda{font:700 17px var(--f-h)}'+
  '#btAjuda.txt{display:inline-flex;align-items:center;justify-content:center;width:auto;padding:0 12px;font:600 13.5px var(--f-h);gap:6px;white-space:nowrap}'+
  '@media(max-width:760px){#btAjuda.txt{width:40px;padding:0;font:700 15px var(--f-h)}#btAjuda.txt .tx{display:none}}'+
  '#tutCx .tq{flex-wrap:nowrap;white-space:nowrap}#tutCx .tq>span:first-child{overflow:hidden;text-overflow:ellipsis}'+
  '#tutBv{position:fixed;inset:0;z-index:1003;display:grid;place-items:center;background:rgba(8,18,24,.62);padding:16px}'+
  '#tutBv .cx{width:min(440px,100%);background:var(--panel);color:var(--ink);border-radius:20px;padding:26px 24px 20px;box-shadow:0 18px 50px rgba(0,0,0,.4);text-align:center}'+
  '#tutBv .ic{width:62px;height:62px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;font-size:28px;background:var(--tealSoft);color:var(--teal)}'+
  '#tutBv h2{font-size:22px;margin:0 0 8px}#tutBv p{font-size:15px;line-height:1.5;color:var(--mute);margin:0 0 18px}'+
  '#tutBv .bts{display:flex;flex-direction:column;gap:8px}#tutBv .btn{min-height:46px;font-size:15.5px}'+
  '#tutBv small{display:block;margin-top:12px;font-size:12px;color:var(--mute)}'+
  '#tutDica{position:fixed;z-index:1004;max-width:260px;background:var(--teal);color:#fff;font:600 13.5px var(--f-h);padding:10px 12px;border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.3)}'+
  '#tutCx #tutPlay{color:var(--teal)}'+
  '@media(max-width:600px){#tutCx{left:16px!important;right:16px;bottom:16px!important;top:auto!important;width:auto}}';
  document.head.appendChild(css);

  /* ============ VOZ (feminina, pt-BR, quando o aparelho tiver) ============ */
  var VZ='pfc-tut-voz',vozOn=ls.get(VZ)==='1',voz=null;
  function acharVoz(){if(!window.speechSynthesis)return;var V=speechSynthesis.getVoices().filter(function(v){return /pt[-_]BR/i.test(v.lang);});
    var fem=/francisca|luciana|maria|vit[oó]ria|raquel|helo[ií]sa|camila|google portugu[eê]s|female|feminina/i;
    voz=V.filter(function(v){return fem.test(v.name);})[0]||V[0]||null;}
  if(window.speechSynthesis){acharVoz();speechSynthesis.onvoiceschanged=acharVoz;}
  var falaN=0;
  function falar(t,fim){if(!window.speechSynthesis){if(fim)fim(false);return;}speechSynthesis.cancel();if(!vozOn||!t){if(fim)fim(false);return;}
    var n=++falaN,u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';if(voz)u.voice=voz;u.rate=1.02;
    var ok=false,feito=function(){if(ok||n!==falaN)return;ok=true;if(fim)fim(true);};
    u.onend=feito;u.onerror=function(){if(!ok&&n===falaN){ok=true;if(fim)fim(false);}};speechSynthesis.speak(u);}

  /* ============ MOTOR ============ */
  var guia=null,passos=[],i=0,aberto=false,lista=false,alvoAt=null,papelAt=null,auto=false,autoT=null;
  /* Modo automático: depois de falar o passo, vai para o próximo; sem voz, espera o tempo de leitura. */
  function agenda(p){clearTimeout(autoT);if(!auto||!aberto)return;var at=i,txt=p.t+'. '+texto(p);
    var segue=function(){clearTimeout(autoT);autoT=setTimeout(function(){if(auto&&aberto&&i===at&&!lista)ir(i+1,1);},900);};
    if(vozOn&&window.speechSynthesis){falar(txt,function(f){if(f)segue();else autoT=setTimeout(function(){if(auto&&aberto&&i===at&&!lista)ir(i+1,1);},Math.max(4500,txt.length*60));});
      /* rede de segurança: alguns aparelhos não avisam o fim da fala */
      setTimeout(function(){if(auto&&aberto&&i===at&&!lista&&!speechSynthesis.speaking)segue();},Math.max(6000,txt.length*95));}
    else autoT=setTimeout(function(){if(auto&&aberto&&i===at&&!lista)ir(i+1,1);},Math.max(4500,txt.length*60));}
  function alvoDe(p){if(!p.alvo)return null;var e=typeof p.alvo==='function'?p.alvo():$(p.alvo);if(!e)return null;var r=e.getBoundingClientRect();return (r.width||r.height)?e:null;}
  function irTab(k){if(window.PFC&&window.PFC.tab()!==k)window.PFC.ir(k);}

  function montar(){
    if($('#tutVeu'))return;
    var v=document.createElement('div');v.id='tutVeu';
    v.innerHTML='<div id="tutFoco" class="sem"></div><div id="tutCx" role="dialog" aria-modal="true" aria-labelledby="tutTit"></div>';
    document.body.appendChild(v);
    v.addEventListener('click',function(e){if(e.target===v)fechar();});
    document.addEventListener('keydown',tecla);
    addEventListener('resize',posicionar);addEventListener('scroll',posicionar,true);
  }
  function tecla(e){if(!aberto)return;if(e.key==='Escape')fechar();else if(e.key==='ArrowRight')ir(i+1,1);else if(e.key==='ArrowLeft')ir(i-1,-1);}

  function ir(n,dir){
    if(n<0)return;if(n>=passos.length){fechar(true);return;}
    var ant=passos[i];if(ant&&ant.depois&&n!==i)ant.depois();
    i=n;lista=false;var p=passos[i];
    if(p.tab)irTab(p.tab);
    if(p.antes)p.antes();
    setTimeout(function(){
      var e=alvoDe(p);
      if(p.alvo&&!e){ir(i+(dir||1),dir||1);return;} /* alvo não está na tela: pula */
      alvoAt=e;
      if(e&&!(e.closest&&e.closest('.topo')))e.scrollIntoView({block:'center',behavior:'smooth'});
      desenhar();setTimeout(posicionar,320);posicionar();
      if(auto)agenda(p);else falar(p.t+'. '+texto(p));
    },p.antes?140:40);
  }
  function texto(p){return ehToque()&&p.xToque?p.xToque:p.x;}

  function desenhar(){
    var p=passos[i],cx=$('#tutCx'),tot=passos.length,ult=i===tot-1,pri=i===0;
    var temVoz=!!window.speechSynthesis;
    if(lista){
      cx.innerHTML='<div class="tq"><span>Guia do '+guia.nome+'</span><span class="sp"></span><button type="button" id="tutVolta">Voltar</button></div>'+
        '<h3 id="tutTit">Todos os passos</h3><ol>'+passos.map(function(q,k){return '<li class="'+(k===i?'at':'')+'"><button type="button" data-tp="'+k+'">'+q.t+'</button></li>';}).join('')+'</ol>';
      $('#tutVolta').onclick=function(){lista=false;desenhar();posicionar();};
      cx.querySelectorAll('[data-tp]').forEach(function(b){b.onclick=function(){ir(+b.dataset.tp,1);};});
      return;}
    cx.innerHTML='<div class="tq"><span>'+(guia.curto?'Como funciona':'Guia do '+guia.nome)+' · '+(i+1)+' de '+tot+'</span><span class="sp"></span>'+
      '<button type="button" id="tutPlay" aria-pressed="'+auto+'" title="'+(auto?'Pausar':'Passar sozinho')+'" aria-label="'+(auto?'Pausar':'Passar sozinho')+'">'+(auto?'Pausar':'▶ Seguir')+'</button>'+'<button type="button" id="tutLista">Passos</button>'+(temVoz?'<button type="button" id="tutVoz" aria-pressed="'+vozOn+'">'+(vozOn?'🔊 Voz':'🔈 Ouvir')+'</button>':'')+'</div>'+
      '<div class="bar"><s style="width:'+((i+1)/tot*100)+'%"></s></div>'+
      '<h3 id="tutTit">'+p.t+'</h3><p>'+texto(p)+'</p>'+
      '<div class="bts">'+(pri?'<button class="btn sec" id="tutFim">Agora não</button>':'<button class="btn sec" id="tutAnt">Voltar</button>')+
      '<span class="sp"></span>'+(!pri&&!ult?'<button class="btn sec" id="tutFim">Sair do guia</button>':'')+
      '<button class="btn pri" id="tutProx">'+(pri?'Começar':ult?'Concluir':'Próximo')+'</button></div>'+
      '<div class="wm">© FC Consultoria em Esquadria · uso exclusivo</div>';
    var b;
    if((b=$('#tutAnt')))b.onclick=function(){ir(i-1,-1);};
    if((b=$('#tutFim')))b.onclick=function(){fechar(true);};
    $('#tutProx').onclick=function(){ir(i+1,1);};
    $('#tutLista').onclick=function(){clearTimeout(autoT);if(window.speechSynthesis)speechSynthesis.cancel();lista=true;desenhar();posicionar();};
    $('#tutPlay').onclick=function(){auto=!auto;desenhar();posicionar();if(auto)agenda(p);else{clearTimeout(autoT);if(window.speechSynthesis)speechSynthesis.cancel();}};
    if((b=$('#tutVoz')))b.onclick=function(){vozOn=!vozOn;ls.set(VZ,vozOn?'1':'0');desenhar();if(auto)agenda(p);else falar(vozOn?p.t+'. '+texto(p):'');};
    setTimeout(function(){var f=$('#tutProx');if(f)f.focus({preventScroll:true});},30);
  }

  function posicionar(){
    if(!aberto)return;var f=$('#tutFoco'),cx=$('#tutCx'),e=alvoAt;
    var W=innerWidth,H=innerHeight,cw=cx.offsetWidth,ch=cx.offsetHeight,m=16;
    if(!e||!document.contains(e)){f.className='sem';cx.style.left=Math.max(m,(W-cw)/2)+'px';cx.style.top=Math.max(m,(H-ch)/2)+'px';return;}
    var r=e.getBoundingClientRect(),pd=6;
    f.className='';f.style.left=(r.left-pd)+'px';f.style.top=(r.top-pd)+'px';f.style.width=(r.width+pd*2)+'px';f.style.height=(r.height+pd*2)+'px';
    if(W<=600)return; /* celular: caixa fica embaixo (CSS) */
    var top,left,cl=function(v,a,b){return Math.min(b,Math.max(a,v));};
    if(r.bottom+14+ch<=H-m){top=r.bottom+14;left=r.left+r.width/2-cw/2;}          /* embaixo */
    else if(r.top-14-ch>=m){top=r.top-14-ch;left=r.left+r.width/2-cw/2;}           /* em cima */
    else if(r.right+14+cw<=W-m){left=r.right+14;top=r.top+r.height/2-ch/2;}        /* à direita */
    else if(r.left-14-cw>=m){left=r.left-14-cw;top=r.top+r.height/2-ch/2;}         /* à esquerda */
    else{left=r.left+16;top=r.bottom-ch-16;}                                        /* alvo grande: canto esquerdo de baixo */
    top=cl(top,m,H-ch-m);left=cl(left,m,W-cw-m);
    cx.style.left=left+'px';cx.style.top=top+'px';
  }

  function chave(){var P=window.PFC;return 'pfc-tut-visto-'+papelAt+'-'+((P&&P.nome())||'');}
  function abrir(op){
    op=op||{};papelAt=window.PFC&&window.PFC.papel();guia=GUIAS[papelAt];if(!guia)return;
    if(op.voz&&window.speechSynthesis){vozOn=true;ls.set(VZ,'1');}
    auto=!!op.auto;passos=guia.passos;montar();aberto=true;$('#tutVeu').hidden=false;i=0;
    /* no modo automático o 1º passo já começa (sem o "Começar") */
    ir(0,1);
  }
  /* ===== Boas-vindas: 1ª entrada da pessoa no painel ===== */
  function boasVindas(){
    if($('#tutBv')||aberto)return;var pp=window.PFC.papel(),g=GUIAS[pp];if(!g)return;
    var nome=(window.PFC.nome()||'').split(' ')[0];
    var d=document.createElement('div');d.id='tutBv';
    d.innerHTML='<div class="cx" role="dialog" aria-modal="true" aria-labelledby="tutBvT"><div class="ic" aria-hidden="true">▶</div>'+
      '<h2 id="tutBvT">Bem-vindo'+(nome&&pp!=='demo'?', '+nome:'')+'!</h2>'+
      '<p>Quer ver agora como funciona a Plataforma FC 3D? '+(g.curto?'Em cerca de 1 minuto':'Em poucos minutos')+', uma narração mostra cada parte da tela.</p>'+
      '<div class="bts"><button type="button" class="btn pri" id="tutBvSim">▶ Ver agora como funciona</button><button type="button" class="btn sec" id="tutBvNao">Depois</button></div>'+
      '<small>Você pode ver a qualquer hora no botão "Como funciona", no topo da tela.</small></div>';
    document.body.appendChild(d);
    var sai=function(){d.remove();ls.set(chave(),'1');};
    $('#tutBvSim').onclick=function(){sai();abrir({auto:true,voz:true});};
    $('#tutBvNao').onclick=function(){sai();dica();};
    setTimeout(function(){var b=$('#tutBvSim');if(b)b.focus({preventScroll:true});},40);
  }
  /* "Depois": balão apontando o botão Como funciona */
  function dica(){var b=$('#btAjuda');if(!b||!b.offsetParent)return;var r=b.getBoundingClientRect(),t=document.createElement('div');t.id='tutDica';
    t.textContent='Quando quiser, toque aqui para ver como funciona.';document.body.appendChild(t);
    t.style.top=(r.bottom+10)+'px';t.style.left=Math.max(12,Math.min(innerWidth-t.offsetWidth-12,r.right-t.offsetWidth))+'px';
    var tira=function(){t.remove();document.removeEventListener('click',tira,true);};setTimeout(tira,6000);setTimeout(function(){document.addEventListener('click',tira,true);},50);}
  function fechar(marcar){
    if(!aberto)return;var p=passos[i];if(p&&p.depois)p.depois();
    aberto=false;alvoAt=null;var v=$('#tutVeu');if(v)v.hidden=true;
    clearTimeout(autoT);auto=false;if(window.speechSynthesis)speechSynthesis.cancel();
    if(marcar!==false)ls.set(chave(),'1');
    var b=$('#btAjuda');if(b)b.focus({preventScroll:true});
  }

  /* Botão "?" no topo: aparece só para o painel que tem guia. Chamado pela tela a cada troca. */
  function atualiza(){
    var P=window.PFC;if(!P)return;var pp=P.papel(),tem=!!GUIAS[pp],b=$('#btAjuda');
    if(!b){var ref=$('#btTema');if(!ref)return;b=document.createElement('button');b.className='ic-bt';b.id='btAjuda';b.type='button';
      b.title='Como funciona este painel';b.setAttribute('aria-label','Como funciona este painel');b.className='ic-bt txt';
      b.innerHTML='<span aria-hidden="true">▶</span><span class="tx">Como funciona</span>';
      b.onclick=function(){abrir({auto:true});};ref.parentNode.insertBefore(b,ref);}
    b.hidden=!tem;
    if(aberto&&pp!==papelAt)fechar(false);
    /* 1ª vez da pessoa neste painel: tela de boas-vindas (Ver agora / Depois). Não abre para a FC;
       a FC confere com ?boasvindas=1 no link. */
    var forca=/[?&]boasvindas=1/.test(location.search);
    if(tem&&!aberto&&(forca||!P.matriz())){papelAt=pp;if(forca||!ls.get(chave()))setTimeout(function(){if(!aberto&&!$('#app').hidden)boasVindas();},700);}
  }
  window.PFCtut={abrir:abrir,fechar:fechar,atualiza:atualiza,boasVindas:boasVindas,guias:GUIAS};
  if(window.PFC&&$('#app')&&!$('#app').hidden)atualiza();
})();

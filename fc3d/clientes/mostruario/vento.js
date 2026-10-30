/* Plataforma FC 3D Clientes · Mostruário 3D · Simular vento
   Painel dentro do "Conhecer a esquadria" (sem sair da tela): muda o tamanho, troca a mão de amigo
   do encontro central e avalia a pressão de vento com o 3D reagindo.
   Usa os MESMOS dados do Diagrama de dimensões (DIAG · curvas lidas do catálogo): só aparecem
   as combinações de mão de amigo que têm diagrama no catálogo. O Diagrama continua como referência.
   Apenas demonstrativo · © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
if(typeof DIAG==='undefined'||typeof diaHmax!=='function')return;
const $=id=>document.getElementById(id);
const conf=$('c-conf');if(!conf)return;
const NF=n=>Number(n).toLocaleString('pt-BR');
const RAJ={80:129,100:144,120:158,150:176};
S.vtOn=false;

const css=document.createElement('style');
css.textContent=`
#c-vt{border-top:1px solid var(--line);padding-top:10px}
#c-vt>summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font:600 13px var(--f-display,system-ui);text-transform:uppercase;letter-spacing:.05em;color:var(--fg)}
#c-vt>summary::-webkit-details-marker{display:none}
#c-vt>summary::after{content:'+';font:18px var(--f-mono,monospace);color:var(--muted)}
#c-vt[open]>summary::after{content:'−'}
#c-vt .vt{display:flex;flex-direction:column;gap:10px;margin-top:10px}
#c-vt .vt-step{font:600 12px var(--f-display,system-ui);text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
#c-vt .vt-cb{display:flex;flex-direction:column;gap:6px}
#c-vt .vt-cb button{display:flex;flex-direction:column;align-items:flex-start;gap:1px;text-align:left;border:1px solid var(--line);background:var(--panel);border-radius:10px;padding:7px 10px;cursor:pointer;color:var(--fg)}
#c-vt .vt-cb button b{font:600 13px var(--f-mono,monospace)}
#c-vt .vt-cb button small{font-size:11.5px;color:var(--muted)}
#c-vt .vt-cb button[aria-pressed=true]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);background:var(--accent-soft,#e6f2f3)}
#c-vt .vt-med{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
#c-vt .vt-med b{font:700 15px var(--f-mono,monospace)}
#c-vt .vt-lk{border:0;background:none;color:var(--accent);font-weight:600;font-size:12.5px;cursor:pointer;padding:0;text-decoration:underline}
#c-vt .vt-go{border:0;background:var(--accent);color:#fff;border-radius:10px;padding:10px 12px;font-weight:700;font-size:14px;cursor:pointer}
#c-vt .vt-sec{border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:10px;padding:7px 12px;font-weight:600;font-size:13px;cursor:pointer}
#c-vt .vt-ins{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center}
#c-vt .vt-ins b{display:block;font:700 14px var(--f-mono,monospace)}
#c-vt .vt-ins span{font-size:11px;color:var(--muted)}
#c-vt .vt-sug{font-size:13px;padding:8px 10px;border-radius:8px;background:#fff6e5;color:#7a4b00}
#c-vt .vt-sug button{border:0;background:none;color:inherit;font-weight:700;text-decoration:underline;cursor:pointer;padding:0}
#c-vt .vt-av{font-size:11.5px;color:var(--muted);line-height:1.45;margin:0}`;
document.head.appendChild(css);

const card=document.createElement('details');card.className='vt-sub';card.id='c-vt';card.hidden=true;
card.innerHTML=`<summary>🌬 Simular pressão de vento</summary>
<div class="vt">
  <p class="note" style="margin:0">Usa a Largura × Altura acima. Escolha a mão de amigo do encontro central e avalie a pressão de vento. Só aparecem as combinações que têm diagrama no catálogo.</p>
  <div class="vt-step">1 · Mão de amigo do encontro</div><div class="vt-cb" id="vtCb"></div>
  <p class="note" id="vtFx" style="margin:0"></p>
  <div class="vt-step">2 · Pressão de ensaio (kgf/m²)</div>
  <div class="dia-pr" id="vtPr">${[80,100,120,150].map(p=>`<button type="button" data-p="${p}" aria-pressed="${p===100}">${p}</button>`).join('')}</div>
  <button type="button" class="vt-go" id="vtGo">🌬 Avaliar pressão de vento</button>
  <div id="vtRes" hidden style="display:flex;flex-direction:column;gap:8px">
    <div class="dia-ver" id="vtVer"></div>
    <div><div class="dia-gau"><i id="vtGau"></i></div><div class="note" id="vtGauT" style="margin-top:3px"></div></div>
    <div class="vt-ins"><div><b id="vtF"></b><span>força do vento</span></div><div><b id="vtV"></b><span>rajada aprox.</span></div><div><b id="vtA"></b><span>área</span></div></div>
    <div class="vt-sug" id="vtSug" hidden></div>
    <table class="dia-tb" id="vtTb"></table>
    <p class="note" id="vtObs" hidden style="margin:0"></p>
    <button type="button" class="vt-sec" id="vtOff">↺ Encerrar simulação e voltar ao original</button>
  </div>
  <p class="vt-av">⚠ <b>Apenas demonstrativo.</b> Valores lidos dos gráficos do Diagrama de dimensões do catálogo, de forma aproximada. Não é base técnica para fabricação ou especificação: consulte sempre o catálogo oficial e o projeto técnico.</p>
</div>`;
conf.insertBefore(card,$('openCtl')||null);

let OPC=[],SEL=null,VP=100,SAVE=null,DIAP0=null;
const opcs=()=>Object.values(DIAG).flat().filter(d=>d.t&&d.t===S.typo);
const orig=d=>!Object.keys(d.sw||{}).length;
const L0=d=>d.LS[0],L1=d=>d.LS[d.LS.length-1];

function lista(){
  OPC=opcs().slice().sort((a,b)=>(orig(b)-orig(a))||(a.jxt-b.jxt));
  if(!OPC.includes(SEL))SEL=OPC[0]||null;
  $('vtCb').innerHTML=OPC.map((d,i)=>`<button type="button" data-i="${i}" aria-pressed="${d===SEL}"><b>${d.cods.join(' + ')}</b><small>${orig(d)?'Original da tipologia · ':''}Jx do conjunto ${NF(d.jxt)} mm⁴ · catálogo p. ${d.pag}</small></button>`).join('');
  $('vtCb').querySelectorAll('button').forEach(b=>b.onclick=()=>{SEL=OPC[+b.dataset.i];lista();faixa();if(S.vtOn)avalia();});
}
function faixa(){if(!SEL)return;$('vtFx').textContent=`Faixa do diagrama: L de ${NF(L0(SEL))} a ${NF(L1(SEL))} mm · H de ${NF(SEL.Hr[0])} a ${NF(SEL.Hr[1])} mm.`;}
function medidasAtuais(){}

function aplica3D(d){
  if(!SAVE){SAVE={sw:S.swaps[S.typo]||{},w:S.w,h:S.h,typo:S.typo};DIAP0=DIAP;}
  const mudou=DIA!==d;
  if(mudou)renderSwap(); /* o painel de substituições zera as trocas: chama antes */
  S.swaps[S.typo]=Object.assign({},d.sw);DIA=d;
  if(!S.vtOn){S.vtOn=true;if(typeof resetOpen==='function')resetOpen();}
  if(mudou){applyTypo();renderCuts();}
}
function verifica(d,L,H,p){
  if(L>L1(d))return {fora:1};
  const hm=diaHmax(d,p,L);return {hm,ok:H<=hm,r:H/hm};
}
function avalia(){
  const d=SEL;if(!d)return;
  const L=S.w,H=S.h;medidasAtuais();
  aplica3D(d);
  const v=verifica(d,L,H,VP);
  DIAP=VP;
  const ver=$('vtVer');
  if(v.fora){
    DIA_OK=false;DIA_R=1;DIABOW=.12;
    ver.className='dia-ver no';ver.textContent=`✖ Fora do diagrama: para ${d.cods.join(' + ')} o catálogo vai até L ${NF(L1(d))} mm. Consulte o catálogo ou divida o vão.`;
    $('vtGau').style.width='100%';$('vtGau').style.background='#b4372f';$('vtGauT').textContent='Largura acima da faixa do diagrama';
  }else{
    const {hm,ok,r}=v,hr=Math.round(hm/10)*10;
    DIA_OK=ok;DIA_R=r;DIABOW=ok?.012+.05*Math.pow(r,4):Math.min(.3,.09+.5*(r-1));
    ver.className='dia-ver '+(ok?'ok':'no');
    ver.textContent=ok?`✔ Aprova: com ${VP} kgf/m² e L ${NF(L)} mm, a altura máxima é cerca de ${NF(hr)} mm.`
      :r>1.12?`💥 Rompe: muito acima do limite. Com ${VP} kgf/m² e L ${NF(L)} mm, a altura máxima é cerca de ${NF(hr)} mm. O encontro central não aguenta e abre com o vento.`
      :`✖ Não aprova: com ${VP} kgf/m² e L ${NF(L)} mm, a altura máxima é cerca de ${NF(hr)} mm.`;
    const pc=Math.round(r*100);$('vtGau').style.width=Math.min(100,pc)+'%';$('vtGau').style.background=pc<=85?'#1f8a4c':pc<=100?'#e0972e':'#b4372f';
    $('vtGauT').textContent=`Uso do limite da mão de amigo: ${pc}%`+(pc>85&&pc<=100?' · no limite':'')+(L<L0(d)?` · largura abaixo da faixa: usado o limite de L ${NF(L0(d))} mm`:'');
  }
  const A=L*H/1e6;$('vtA').textContent=A.toFixed(2).replace('.',',')+' m²';$('vtF').textContent=NF(Math.round(A*VP))+' kgf';$('vtV').textContent='~'+RAJ[VP]+' km/h';
  /* sugestão: outra mão de amigo do catálogo que aprova esta medida */
  const sug=$('vtSug');
  if(!(v.ok)){const alt=OPC.filter(o=>o!==d).map(o=>[o,verifica(o,L,H,VP)]).filter(([,x])=>x.ok).sort((a,b)=>a[0].jxt-b[0].jxt)[0];
    if(alt){sug.hidden=false;sug.innerHTML=`💡 Com <b>${alt[0].cods.join(' + ')}</b> (catálogo p. ${alt[0].pag}) esta medida aprova. <button type="button" id="vtUse">Usar esta</button>`;
      $('vtUse').onclick=()=>{SEL=alt[0];lista();faixa();avalia();};}
    else{sug.hidden=false;sug.textContent='💡 Nenhuma mão de amigo com diagrama no catálogo aprova esta medida nesta pressão. Reduza a medida, divida o vão ou consulte o catálogo.';}}
  else sug.hidden=true;
  $('vtTb').innerHTML='<tr><th>Perfil</th><th>Jx (mm⁴)</th><th>Wx (mm³)</th></tr>'+d.pf.map(p=>`<tr><td><b>${p[0]}</b></td><td>${NF(p[1])}</td><td>${NF(p[2])}</td></tr>`).join('')+`<tr><td><b>Conjunto</b></td><td><b>${NF(d.jxt)}</b></td><td><b>${NF(d.wxt)}</b></td></tr>`;
  $('vtObs').hidden=!d.obs;$('vtObs').textContent=d.obs?'Obs. do catálogo: '+d.obs:'';
  $('vtRes').hidden=false;$('vtGo').textContent='🌬 Avaliar de novo';
  build();diaBend();if(typeof setView==='function')setView(typeof curView!=='undefined'&&curView?curView:'persp');
  if(typeof trk==='function')trk('vento',{t:S.typo,pag:d.pag,L,H,p:VP,ok:!!v.ok});
}
function encerra(rebuild){
  if(!S.vtOn&&!SAVE)return;
  S.vtOn=false;DIA=null;DIAROT=0;if(typeof diaBend==='function')diaBend();
  if(SAVE){if(SAVE.typo===S.typo){S.swaps[S.typo]=SAVE.sw;}
    if(DIAP0!=null)DIAP=DIAP0;SAVE=null;}
  $('vtRes').hidden=true;$('vtGo').textContent='🌬 Avaliar pressão de vento';
  if(rebuild!==false){applyTypo();renderSwap();renderCuts();build();if(typeof setView==='function')setView('persp');}
}
$('vtGo').onclick=avalia;
$('vtOff').onclick=()=>{encerra();medidasAtuais();};
$('vtPr').querySelectorAll('button').forEach(b=>b.onclick=()=>{VP=+b.dataset.p;$('vtPr').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));if(S.vtOn)avalia();});
/* o tamanho vem da Configuração (Largura e Altura): ao mudar lá, a simulação reavalia sozinha */
['in-w','in-h'].forEach(k=>{const el=$(k);if(el)el.addEventListener('change',()=>setTimeout(()=>{medidasAtuais();if(S.vtOn)avalia();},0));});
card.addEventListener('toggle',()=>{if(card.open){if(!S.vtOn)medidasAtuais();}else if(S.vtOn){encerra();}});

/* aparece só no Conhecer a esquadria, em tipologia que tem diagrama de mão de amigo */
let ult=null;
function visivel(){
  const pode=S.mode==='exp'&&!S.diaOn&&!S.wvOn&&opcs().length>0;
  card.hidden=!pode;
  if(S.typo!==ult){ult=S.typo;SEL=null;lista();faixa();medidasAtuais();}
}
if(typeof window.setMode==='function'){const m0=window.setMode;window.setMode=function(m){if(S.vtOn)encerra(false);const r=m0.apply(this,arguments);visivel();return r;};}
if(typeof window.setTypo==='function'){const t0=window.setTypo;window.setTypo=function(t){if(S.vtOn)encerra(false);SAVE=null;const r=t0.apply(this,arguments);visivel();return r;};}
setInterval(()=>{if(S.vtOn&&(S.mode!=='exp'||S.diaOn||S.wvOn))encerra(false);visivel();},800);
visivel();
})();

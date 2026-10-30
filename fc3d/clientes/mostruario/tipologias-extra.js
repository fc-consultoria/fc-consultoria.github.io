/* Plataforma FC 3D Clientes · Orientativo 3D · tipologias novas no formato completo
   Cada definição segue a folha de montagem do catálogo técnico (Linha Suprema) e usa
   o mesmo motor das tipologias originais: peças, componentes, cortes das junções,
   usinagens, desmontar, Monte a esquadria e Base técnica.
   Lote 1: SUP JCR 400, SUP JCR 400A, SUP PCR 300, SUP PCR 400.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
if(typeof TYPOS==='undefined'||typeof LINHAS==='undefined')return;
/* 4 folhas: fixas nas pontas (trilho externo), móveis no centro (trilho interno) */
const quatro=(L,M,X)=>[
  {id:'A',n:'Folha fixa esquerda',slot:0,z:-.0175,L:L,R:X,fixed:true},
  {id:'B',n:'Folha móvel esquerda',slot:1,z:.0175,L:M,R:L,dir:-1},
  {id:'C',n:'Folha móvel direita',slot:2,z:.0175,L:L,R:M,dir:1},
  {id:'D',n:'Folha fixa direita',slot:3,z:-.0175,L:X,R:L,fixed:true}];
const NOVAS={
  jcr400:{n:'Janela de correr 4 folhas',code:'SUP JCR 400',def:[2000,1200],fr:{t:'SU-026',b:'SU-251',s:'SU-028'},edge:.035,
    contra:'SU-291',contra2:true,ovs:[.03,0,.03],together:true,cz:[-.0175,-.0175],
    sashes:quatro('SU-039','SU-040','SU-041'),sh:H=>H-.062,sy:H=>.002,
    codes:['SU-026','SU-251','SU-028','SU-291','SU-053','SU-039','SU-040','SU-041','SU-102'],
    cutd:{sup:'Marco superior SU-026 com a travessa SU-053 das quatro folhas e o vedador de vento NYL-335 nos encontros.',inf:'Marco inferior SU-251 com a travessa SU-053 sobre as roldanas e a caixa de dreno NYL-329 nos encontros.'},
    meetd:'Nas laterais, a mão de amigo SU-040 da folha móvel encaixa na SU-041 da folha fixa. No centro, as duas folhas móveis se encontram no mesmo trilho pelos montantes SU-039, com o fecho concha FEC-636 e o contrafecho CON-280.',
    glass:(W,H)=>[(W-.2957)/4,H-.167],gtxt:'(L−295,7)/4 × (H−167)'},
  jcr400a:{n:'Janela de correr 4 folhas (marco liso)',code:'SUP JCR 400A',def:[2000,1200],fr:{t:'SU-001',b:'SU-002',s:'SU-003'},edge:.0144,
    ovs:[.03,0,.03],together:true,
    sashes:quatro('SU-039','SU-040','SU-041'),
    codes:['SU-001','SU-002','SU-003','SU-053','SU-039','SU-040','SU-041','SU-102'],
    cutd:{sup:'Trilho superior SU-001 com a travessa SU-053 das quatro folhas e o vedador de vento NYL-335 nos encontros.',inf:'Trilho inferior SU-002 com a travessa SU-053 sobre as roldanas e a caixa de dreno NYL-329 nos encontros.'},
    meetd:'Nas laterais, a mão de amigo SU-040 da folha móvel encaixa na SU-041 da folha fixa. No centro, as duas folhas móveis se encontram no mesmo trilho pelos montantes SU-039, com o fecho concha FEC-636 e o contrafecho CON-280.',
    glass:(W,H)=>[(W-.2575)/4,H-.134],gtxt:'(L−257,5)/4 × (H−134)'},
  pcr300:{n:'Porta de correr 3 folhas',code:'SUP PCR 300',seq:true,def:[2400,2100],fr:{t:'SU-010',b:'SU-230',s:'SU-012'},edge:.019,contra:'SU-291',contra2:true,
    sashes:[{id:'A',n:'Folha interna',z:.035,L:'SU-044',R:'SU-047',dir:1},{id:'C',n:'Folha central',z:0,L:'SU-049',R:'SU-047',dir:1},{id:'F',n:'Folha fixa',z:-.035,L:'SU-049',R:'SU-039',fixed:true}],
    rails:{bot:'SU-225',mid:'SU-227'},sh:H=>H-.04,sy:H=>-.005,comp:{rol:'ROL-439',fecho:'FEC-645'},
    codes:['SU-010','SU-230','SU-012','SU-291','SU-053','SU-225','SU-227','SU-044','SU-047','SU-049','SU-039','SU-102'],
    cutd:{sup:'Marco superior SU-010 (3 trilhos) com a travessa SU-053 de cada folha e o vedador de vento NYL-335.',inf:'Marco inferior SU-230 (3 trilhos) com o rodapé SU-225 sobre as roldanas ROL-439 e a caixa de dreno NYL-329.'},
    meetd:'Folhas em sequência: a mão de amigo SU-047 da folha mais interna encaixa na SU-049 da folha seguinte, com o recobrimento NYL-357 no topo.',
    glass:(W,H)=>[(W-.174)/3,(H-.212)/2],gtxt:'(L−174)/3 × (H−212)/2, 2 vidros por folha'},
  pcr400:{n:'Porta de correr 4 folhas',code:'SUP PCR 400',def:[2800,2100],fr:{t:'SU-001',b:'SU-228',s:'SU-003'},edge:.0144,
    ovs:[.03,0,.03],together:true,
    sashes:[{id:'A',n:'Folha fixa esquerda',slot:0,z:-.0175,L:'SU-039',R:'SU-049',fixed:true},
            {id:'B',n:'Folha móvel esquerda',slot:1,z:.0175,L:'SU-047',R:'SU-044',dir:-1},
            {id:'C',n:'Folha móvel direita',slot:2,z:.0175,L:'SU-044',R:'SU-047',dir:1},
            {id:'D',n:'Folha fixa direita',slot:3,z:-.0175,L:'SU-049',R:'SU-039',fixed:true}],
    rails:{bot:'SU-225',mid:'SU-227'},sh:H=>H-.04,sy:H=>-.005,comp:{rol:'ROL-439',fecho:'FEC-645'},
    codes:['SU-001','SU-228','SU-003','SU-053','SU-225','SU-227','SU-044','SU-047','SU-049','SU-039','SU-102'],
    cutd:{sup:'Trilho superior SU-001 com a travessa SU-053 das quatro folhas e o vedador de vento NYL-335.',inf:'Trilho inferior SU-228 com o rodapé SU-225 sobre as roldanas ROL-439 e a caixa de dreno NYL-329.'},
    meetd:'Nas laterais, a mão de amigo SU-047 da folha móvel encaixa na SU-049 da folha fixa. No centro, as folhas móveis se encontram no mesmo trilho pelos montantes SU-044, com o fecho FEC-645 e o contrafecho CON-280.',
    glass:(W,H)=>[(W-.2575)/4,(H-.212)/2],gtxt:'(L−257,5)/4 × (H−212)/2, 2 vidros por folha'}
};
const sup=LINHAS.find(l=>l.k==='sup');
Object.entries(NOVAS).forEach(([k,v])=>{if(TYPOS[k])return;TYPOS[k]=v;if(sup&&!sup.t.includes(k))sup.t.push(k);});
/* refaz a lista de tipologias da linha na próxima troca */
/* se a entrada já abriu antes deste arquivo carregar, abre a tipologia pedida no link */
const pedida=new URLSearchParams(location.search).get('t');
if(pedida&&NOVAS[pedida]){let n=0;const iv=setInterval(()=>{n++;try{if(!document.getElementById('pfcGate')&&S.typo!==pedida){clearInterval(iv);setTypo(pedida);}else if(S.typo===pedida||n>100)clearInterval(iv);}catch(_){clearInterval(iv);}},100);}
try{LINCUR=null;if(typeof linSync==='function'&&typeof S!=='undefined')linSync(S.typo);}catch(_){}
})();

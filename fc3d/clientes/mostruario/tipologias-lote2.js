/* Plataforma FC 3D Clientes · Mostruário 3D · tipologias novas no formato completo · Lote 2 em diante
   Cada definição segue a folha de montagem do catálogo técnico (Suprema e Gold) e usa o mesmo motor
   das tipologias originais: peças, componentes, cortes das junções, desmontar, Monte a esquadria e Base técnica.
   © FC Consultoria em Esquadria · uso exclusivo de empresas licenciadas. */
(function(){
if(typeof TYPOS==='undefined'||typeof LINHAS==='undefined')return;
const GD0={line:'gold',edge:.022,ov:.057,sds:.032,gcontra:true,bag:'BG-057',bagOff:[4.4,5.9],cmap:GOLD_CM,comp:{rol:'ROL-439'}};
const g=o=>Object.assign({},GD0,o);
const Q4=(L,M,X)=>[
  {id:'A',n:'Folha fixa esquerda',slot:0,z:-.0175,L:L,R:X,fixed:true},
  {id:'B',n:'Folha móvel esquerda',slot:1,z:.0175,L:M,R:L,dir:-1},
  {id:'C',n:'Folha móvel direita',slot:2,z:.0175,L:L,R:M,dir:1},
  {id:'D',n:'Folha fixa direita',slot:3,z:-.0175,L:X,R:L,fixed:true}];
const GMX={mar:'LG-068',lat:'LG-085',ping:'LG-091',bagH:'BG-057',bagV:'LG-026',MB:.032,IN:.014,fech:'FEC-493',gua:'GUA-239'};
/* veneziana camarão: 4 folhas articuladas no trilho externo (mostradas fechadas) */
function CAMARAO(A){const {group,prof,M,X,Y,Z,neg,PH,SY,sH,Wi,setRK}=A,z=-.035,w=Wi/4,slm=new THREE.MeshStandardMaterial({color:CORES[S.cor],metalness:.4,roughness:.45,side:THREE.DoubleSide});
  const ed=[['SU-072','SU-074'],['SU-074','SU-074'],['SU-074','SU-074'],['SU-074','SU-072']];
  for(let i=0;i<4;i++){const cx=-Wi/2+w/2+i*w,pg=new THREE.Group();pg.position.set(cx,SY,z);group.add(pg);
    setRK('K'+i+'-L');prof(pg,ed[i][0],sH,X,Z,Y,-w/2+.012,0,0,'camarao',ed[i][0],M.al,i===0);
    setRK('K'+i+'-R');prof(pg,ed[i][1],sH,neg(X),Z,Y,w/2-.012,0,0,'camarao',ed[i][1],M.al,i===1);
    const h3=PH('SU-073');setRK('K'+i+'-top');prof(pg,'SU-073',w-.03,Z,neg(Y),X,0,sH/2-h3/2,0,'camarao','SU-073',M.al,i===0);
    setRK('K'+i+'-bot');prof(pg,'SU-073',w-.03,Z,Y,X,0,-sH/2+h3/2,0,'camarao','SU-073',M.al,false);
    for(let y=-sH/2+h3+.02;y<sH/2-h3-.01;y+=.04){const sl=new THREE.Mesh(new THREE.BoxGeometry(w-.03,.042,.0015),slm);sl.rotation.x=-.75;sl.position.set(0,y,0);sl.userData={zone:null,part:'vidro'};pg.add(sl);}}
  setRK('F-left');prof(group,'SU-071',sH,X,Z,Y,-Wi/2-.004,SY,z,'camarao','SU-071',M.al,true);
  setRK('F-right');prof(group,'SU-071',sH,neg(X),Z,Y,Wi/2+.004,SY,z,'camarao','SU-071',M.al,false);}
const NOVAS={
  /* ===== Suprema ===== */
  pcr200a:{n:'Porta de correr 2 folhas (marco com contrafecho)',code:'SUP PCR 200A',def:[1600,2100],fr:{t:'SU-026',b:'SU-228',s:'SU-028'},edge:.035,
    contra:'SU-291',contra2:true,n357:true,
    sashes:[{id:'A',n:'Folha interna',z:.0175,L:'SU-044',R:'SU-047',dir:1},{id:'B',n:'Folha externa',z:-.0175,L:'SU-049',R:'SU-039',dir:-1}],
    rails:{bot:'SU-225',mid:'SU-227'},sh:H=>H-.0564,sy:H=>-.0132,comp:{rol:'ROL-439',fecho:'FEC-645'},
    codes:['SU-026','SU-228','SU-028','SU-291','SU-053','SU-225','SU-227','SU-044','SU-047','SU-049','SU-039','SU-102'],
    cutd:{sup:'Marco superior SU-026 com a travessa SU-053 das folhas e o vedador de vento NYL-335.',inf:'Marco inferior SU-228 com o rodapé SU-225 sobre as roldanas ROL-439 e a caixa de dreno NYL-329.'},
    meetd:'Mão de amigo SU-047 (folha interna) encaixando na SU-049 (folha externa), com o recobrimento NYL-357 no topo.',
    glass:(W,H)=>[(W-.1814)/2,(H-.2284)/2],gtxt:'(L−181,4)/2 × (H−228,4)/2, 2 vidros por folha'},
  pcr400a:{n:'Porta de correr 4 folhas (marco com contrafecho)',code:'SUP PCR 400A',def:[2800,2100],fr:{t:'SU-026',b:'SU-228',s:'SU-028'},edge:.035,
    contra:'SU-291',contra2:true,ovs:[.03,0,.03],together:true,n357:true,cz:[-.0175,-.0175],
    sashes:[{id:'A',n:'Folha fixa esquerda',slot:0,z:-.0175,L:'SU-039',R:'SU-049',fixed:true},
            {id:'B',n:'Folha móvel esquerda',slot:1,z:.0175,L:'SU-047',R:'SU-044',dir:-1},
            {id:'C',n:'Folha móvel direita',slot:2,z:.0175,L:'SU-044',R:'SU-047',dir:1},
            {id:'D',n:'Folha fixa direita',slot:3,z:-.0175,L:'SU-049',R:'SU-039',fixed:true}],
    rails:{bot:'SU-225',mid:'SU-227'},sh:H=>H-.0564,sy:H=>-.0132,comp:{rol:'ROL-439',fecho:'FEC-645'},
    codes:['SU-026','SU-228','SU-028','SU-291','SU-053','SU-225','SU-227','SU-044','SU-047','SU-049','SU-039','SU-102'],
    cutd:{sup:'Marco superior SU-026 com a travessa SU-053 das quatro folhas e o vedador de vento NYL-335.',inf:'Marco inferior SU-228 com o rodapé SU-225 sobre as roldanas ROL-439 e a caixa de dreno NYL-329.'},
    meetd:'Nas laterais, a mão de amigo SU-047 da folha móvel encaixa na SU-049 da folha fixa. No centro, as folhas móveis se encontram no mesmo trilho pelos montantes SU-044, com o fecho FEC-645 e o contrafecho SU-291.',
    glass:(W,H)=>[(W-.2957)/4,(H-.2285)/2],gtxt:'(L−295,7)/4 × (H−228,5)/2, 2 vidros por folha'},
  jvz300:{n:'Janela de correr 3 folhas com veneziana',code:'SUP JVZ 300',def:[1800,1200],slots:2,fr:{t:'SU-010',b:'SU-011',s:'SU-013',sl:'SU-013',sr:'SU-014'},edge:.019,
    sashes:[{id:'V',n:'Veneziana cega',slot:1,z:0,L:'SU-069',R:'SU-068',dir:-1,ven:true,top:'SU-187',bot:'SU-187',mid:null},
            {id:'A',n:'Folha de vidro',slot:0,z:.035,L:'SU-039',R:'SU-040',dir:1},
            {id:'W',n:'Veneziana ventilada',slot:0,z:-.035,L:'SU-068',R:'SU-070',dir:1,ven:true,top:'SU-187',bot:'SU-187',mid:null}],
    meetd:'No centro, a mão de amigo SU-040 da folha de vidro e a SU-070 da veneziana ventilada encontram a SU-069 da veneziana cega.',
    codes:['SU-010','SU-011','SU-013','SU-014','SU-053','SU-039','SU-040','SU-187','SU-068','SU-069','SU-070','SU-102'],
    cutd:{sup:'Marco superior SU-010 (3 trilhos) com a travessa SU-053 da folha de vidro e as travessas SU-187 das venezianas.',inf:'Marco inferior SU-011 (3 trilhos) com as travessas sobre as roldanas e a caixa de dreno NYL-329.'},
    glass:(W,H)=>[(W-.1432)/2,H-.134],gtxt:'(L−143,2)/2 × (H−134); veneziana (L−121,2)/2'},
  /* ===== Gold ===== */
  gjc6f:g({n:'Janela de correr 6 folhas',code:'GLD JC-6F',def:[2700,1200],fr:{t:'LG-062',b:'LG-066',s:'LG-064'},
    lock:'LG-051',ovs:[.057,.057,.0105,.057,.057],together:true,
    sashes:[{id:'A',n:'Folha fixa esquerda',slot:0,z:-.0446,L:'LG-050',R:'LG-049',fixed:true,top:'LG-006',bot:'LG-006'},
            {id:'B',n:'Folha 2',slot:1,z:0,L:'LG-048',R:'LG-049',dir:-1,top:'LG-006',bot:'LG-006'},
            {id:'C',n:'Folha 3',slot:2,z:.0446,L:'LG-048',R:'LG-051',dir:-1,top:'LG-006',bot:'LG-006'},
            {id:'D',n:'Folha 4',slot:3,z:.0446,L:'LG-050',R:'LG-048',dir:1,top:'LG-006',bot:'LG-006'},
            {id:'E',n:'Folha 5',slot:4,z:0,L:'LG-049',R:'LG-048',dir:1,top:'LG-006',bot:'LG-006'},
            {id:'F',n:'Folha fixa direita',slot:5,z:-.0446,L:'LG-049',R:'LG-050',fixed:true,top:'LG-006',bot:'LG-006'}],
    rails:{bot:'LG-006'},sh:H=>H-.051,sy:H=>-.0015,
    codes:['LG-062','LG-066','LG-064','LG-046','LG-050','LG-051','LG-048','LG-049','LG-006','BG-057','LG-026'],
    cutd:{sup:'Trilho superior LG-062 (3 trilhos) com a travessa LG-006 de cada folha e o vedador de vento CON-381.',inf:'Trilho inferior LG-066 (3 trilhos) com a travessa LG-006 sobre as roldanas ROL-413 e a vedação NYL-395.'},
    meetd:'No centro, as folhas 3 e 4 se encontram no mesmo trilho pelo montante central LG-051 com o fecho concha. Nos outros encontros, a mão-amigo LG-048 (folha mais interna) encaixa na LG-049 (folha mais externa).',
    glass:(W,H)=>[(W-.4034)/6,H-.1396],gtxt:'(L−403,4)/6 × (H−139,6)'}),
  gjc3fvz:g({n:'Janela de correr 3 folhas com veneziana',code:'GLD JC-3FVZ',def:[1600,1200],slots:2,fr:{t:'LG-062',b:'LG-066',s:'LG-064'},
    lock:'LG-050',cz:[-.0446,0],
    sashes:[{id:'V',n:'Veneziana cega fixa',slot:1,z:0,L:'LG-049',R:'LG-050',fixed:true,ven:true,top:'LG-006',bot:'LG-006',mid:null},
            {id:'A',n:'Folha de vidro',slot:0,z:.0446,L:'LG-050',R:'LG-048',dir:1,top:'LG-006',bot:'LG-006'},
            {id:'W',n:'Veneziana ventilada',slot:0,z:-.0446,L:'LG-050',R:'LG-049',dir:1,ven:true,top:'LG-006',bot:'LG-006',mid:null}],
    rails:{bot:'LG-006'},sh:H=>H-.051,sy:H=>-.0015,
    codes:['LG-062','LG-066','LG-064','LG-046','LG-006','LG-050','LG-048','LG-049','BG-057'],
    cutd:{sup:'Marco superior LG-062 (3 trilhos) com as travessas LG-006 e a vedação CON-381.',inf:'Marco inferior LG-066 com as travessas LG-006 sobre as roldanas ROL-413 e a vedação NYL-395.'},
    meetd:'Mão-amigo LG-048 (folha de vidro) encaixando na LG-049 da veneziana cega; a veneziana ventilada corre por fora com a LG-049.',
    glass:(W,H)=>[(W-.180)/2,H-.1396],gtxt:'(L−180)/2 × (H−139,6); veneziana (L−180)/2'}),
  /* ===== Portas de giro (Gold) ===== */
  gpgr2f:g({n:'Porta de giro 2 folhas',code:'GLD PGR-2F',kind:'giro',def:[1500,2100],fr:{t:'LG-056',b:'LG-056',s:'LG-056'},edge:0,gcontra:false,
    gp:{mar:'LG-056',mont:'LG-043',top:'LG-058',bot:'LG-007',mid:'LG-055',bag:'BG-057',fra:'FRA-823'},batente:'LG-016',
    sashes:[{id:'A',n:'Folha ativa',z:0,L:'LG-043',R:'LG-043',dir:1},{id:'B',n:'Folha passiva',z:0,L:'LG-043',R:'LG-043',dir:-1}],
    codes:['LG-056','LG-043','LG-058','LG-055','LG-007','LG-016','BG-057'],fz:['LG-043','LG-058','LG-055','LG-007'],
    cutd:{sup:'Marco LG-056 com a travessa superior LG-058 das folhas.',inf:'Travessa inferior LG-007 das folhas, a 10 mm do piso (sem marco embaixo).',trav:'Travessa central LG-055 dividindo os dois vidros de cada folha.'},
    meetd:'Encontro central: a folha ativa (fechadura e maçanetas) fecha sobre o batente interno LG-016 preso na folha passiva.',
    glass:(W,H)=>[(W-.3135)/2,(H-.2147)/2],gtxt:'(L−313,5)/2 × (H−214,7)/2, 2 vidros por folha'}),
  gpgr1fvz:g({n:'Porta de giro 1 folha com veneziana e vidro',code:'GLD PGR1-FVZ',kind:'giro',def:[900,2100],fr:{t:'LG-056',b:'LG-056',s:'LG-056'},edge:0,gcontra:false,
    gp:{mar:'LG-056',mont:'LG-043',top:'LG-058',bot:'LG-007',mid:'LG-055',bag:'BG-057',fra:'FRA-823'},
    sashes:[{id:'A',n:'Folha da porta',z:0,L:'LG-043',R:'LG-043',dir:1,vb:true}],
    codes:['LG-056','LG-043','LG-058','LG-055','LG-007','BG-057','VZ-006'],fz:['LG-043','LG-058','LG-055','LG-007'],
    cutd:{sup:'Marco LG-056 com a travessa superior LG-058 da folha.',inf:'Travessa inferior LG-007 da folha, a 10 mm do piso; acima dela a veneziana.',trav:'Travessa central LG-055: vidro em cima, veneziana embaixo.'},
    glass:(W,H)=>[W-.181,(H-.2087)/2],gtxt:'(L−181) × (H−208,7)/2 · veneziana embaixo (L−176)'}),
  /* ===== Correr com peitoril fixo (zona de baixo) ===== */
  jcr402a:{n:'Janela de correr 4 folhas com peitoril fixo (marco com contrafecho)',code:'SUP JCR 402A',def:[2000,1500],fr:{t:'SU-026',b:'SU-006',s:'SU-028'},edge:.035,
    contra:'SU-291',contra2:true,ovs:[.03,0,.03],together:true,cz:[-.0175,-.0175],sashes:Q4('SU-039','SU-040','SU-041'),
    peit:{h:(W,H)=>H*.3,s:'SU-028',b:'SU-029',ad:'SU-079',mont:'SU-086',n:4,bag:'SU-103',
      glass:(W,C)=>[(W-.2065)/4,C-.063],gtxt:'(L−206,5)/4 × (C−63)'},
    codes:['SU-026','SU-006','SU-028','SU-029','SU-291','SU-053','SU-039','SU-040','SU-041','SU-102','SU-079','SU-086','SU-103'],
    xparts:[{k:'peitoril',n:'Peitoril fixo',d:'Parte de baixo: quatro vidros fixos no marco SU-079, divididos pelas travessas SU-086, com a baguete SU-103. O trilho SU-006 separa o peitoril das folhas de correr.',z:['SU-079','SU-086','SU-103','SU-029','SU-006'],p:['marco','vidro','baguete']}],
    cutd:{sup:'Marco superior SU-026 com a travessa SU-053 das quatro folhas e o vedador de vento NYL-335.',inf:'Marco SU-029 embaixo do peitoril, com o SU-079 e o vidro fixo preso pela baguete SU-103.',trav:'Trilho SU-006: as folhas de correr em cima e o peitoril fixo embaixo.'},
    meetd:'Nas laterais, a mão de amigo SU-040 da folha móvel encaixa na SU-041 da folha fixa. No centro, as duas folhas móveis se encontram pelos montantes SU-039, com o fecho concha FEC-636 e o contrafecho SU-291.',
    glass:(W,H)=>[(W-.2957)/4,H-.134],gtxt:'correr (L−295,7)/4 × (A−134); peitoril (L−206,5)/4'},
  /* ===== Correr com venezianas ===== */
  jcr204:{n:'Janela de correr 4 folhas com veneziana',code:'SUP JCR 204',def:[1400,1200],slots:2,fr:{t:'SU-121',b:'SU-122',s:'SU-123'},edge:.019,
    contra:'SU-291',contra2:true,
    sashes:[{id:'A',n:'Folha de vidro interna',slot:0,z:.0525,L:'SU-039',R:'SU-040',dir:1},
            {id:'B',n:'Folha de vidro externa',slot:1,z:.0175,L:'SU-041',R:'SU-039',dir:-1},
            {id:'C',n:'Veneziana interna',slot:0,z:-.0175,L:'SU-068',R:'SU-070',dir:1,ven:true,top:'SU-187',bot:'SU-187',mid:null},
            {id:'D',n:'Veneziana externa',slot:1,z:-.0525,L:'SU-070',R:'SU-068',dir:-1,ven:true,top:'SU-187',bot:'SU-187',mid:null}],
    codes:['SU-121','SU-122','SU-123','SU-291','SU-053','SU-039','SU-040','SU-041','SU-187','SU-068','SU-070','SU-102'],
    cutd:{sup:'Marco superior SU-121 (4 trilhos): as duas folhas de vidro por dentro e as duas venezianas por fora.',inf:'Marco inferior SU-122 (4 trilhos) com as travessas SU-053 e SU-187 sobre as roldanas.'},
    meetd:'Vidros: mão de amigo SU-040 (folha interna) com a SU-041 (folha externa). Venezianas: as mãos de amigo SU-070 das duas folhas se encontram por fora.',
    glass:(W,H)=>[(W-.1496)/2,H-.134],gtxt:'vidro (L−149,6)/2 × (H−134); veneziana (L−123,6)/2'},
  jvz600:{n:'Janela de correr 6 folhas com veneziana',code:'SUP JVZ 600',def:[2400,1200],slots:4,fr:{t:'SU-010',b:'SU-011',s:'SU-012'},edge:.019,
    contra:'SU-291',contra2:true,cz:[0,0],ovs:[.03,0,.03],together:true,
    sashes:[{id:'V',n:'Veneziana cega esquerda',slot:0,z:0,L:'SU-068',R:'SU-069',fixed:true,ven:true,top:'SU-187',bot:'SU-187',mid:null},
            {id:'A',n:'Folha de vidro esquerda',slot:1,z:.035,L:'SU-040',R:'SU-039',dir:-1},
            {id:'B',n:'Folha de vidro direita',slot:2,z:.035,L:'SU-039',R:'SU-040',dir:1},
            {id:'W',n:'Veneziana ventilada esquerda',slot:1,z:-.035,L:'SU-070',R:'SU-068',dir:-1,ven:true,top:'SU-187',bot:'SU-187',mid:null},
            {id:'X',n:'Veneziana ventilada direita',slot:2,z:-.035,L:'SU-068',R:'SU-070',dir:1,ven:true,top:'SU-187',bot:'SU-187',mid:null},
            {id:'U',n:'Veneziana cega direita',slot:3,z:0,L:'SU-069',R:'SU-068',fixed:true,ven:true,top:'SU-187',bot:'SU-187',mid:null}],
    codes:['SU-010','SU-011','SU-012','SU-291','SU-053','SU-039','SU-040','SU-187','SU-068','SU-069','SU-070','SU-102'],
    cutd:{sup:'Marco superior SU-010 (3 trilhos): venezianas cegas fixas no trilho do meio, vidros por dentro e venezianas ventiladas por fora.',inf:'Marco inferior SU-011 (3 trilhos) com as travessas sobre as roldanas e a caixa de dreno NYL-329.'},
    meetd:'No centro, as folhas de vidro se encontram pelos montantes SU-039 (fecho concha) e as venezianas ventiladas pelos SU-068. Nas laterais, as folhas móveis encontram as venezianas cegas fixas pela SU-069.',
    glass:(W,H)=>[(W-.2399)/4,H-.134],gtxt:'vidro (L−239,9)/4 × (H−134); veneziana (L−211,9)/4'},
  jvc701:{n:'Janela de correr 2 folhas com veneziana camarão',code:'SUP JVC 701',def:[1400,1200],fr:{t:'SU-024',b:'SU-025',s:'SU-012'},edge:.019,
    contra:'SU-291',contra2:true,cz:[.035,0],
    sashes:[{id:'A',n:'Folha de vidro interna',z:.035,L:'SU-039',R:'SU-040',dir:1},{id:'B',n:'Folha de vidro externa',z:0,L:'SU-041',R:'SU-039',dir:-1}],
    post:CAMARAO,
    codes:['SU-024','SU-025','SU-012','SU-291','SU-053','SU-039','SU-040','SU-041','SU-102','SU-071','SU-072','SU-073','SU-074'],
    xparts:[{k:'camarao',n:'Veneziana camarão',d:'Por fora: quatro folhas de veneziana articuladas (SU-072 nas pontas e SU-074 nas dobras, travessas SU-073), que dobram para as laterais como sanfona; componente SU-071 no marco.',z:['SU-071','SU-072','SU-073','SU-074'],p:['camarao']}],
    cutd:{sup:'Marco superior SU-024 com as travessas SU-053 das folhas de vidro e o trilho da veneziana camarão por fora.',inf:'Marco inferior SU-025 com as travessas sobre as roldanas; por fora, a guia da veneziana camarão.'},
    meetd:'Mão de amigo SU-040 (folha interna) encaixando na SU-041 (folha externa); a veneziana camarão fica no trilho externo.',
    glass:(W,H)=>[(W-.1496)/2,H-.146],gtxt:'vidro (L−149,6)/2 × (H−146); camarão conforme a tabela do catálogo'},
  /* ===== Gold com bandeira (zona de cima) ===== */
  gjc2fbmf:g({n:'Janela de correr 2 folhas com bandeira móvel e fixa',code:'GLD JC-2FBMF',def:[1400,1600],fr:{t:'LG-004',b:'LG-024',s:'LG-002'},edge:.0256,lock:'LG-050',
    sashes:[{id:'A',n:'Folha interna',z:.0223,L:'LG-050',R:'LG-048',dir:1,top:'LG-006',bot:'LG-006'},{id:'B',n:'Folha externa',z:-.0223,L:'LG-049',R:'LG-050',dir:-1,top:'LG-006',bot:'LG-006'}],
    rails:{bot:'LG-006'},sh:H=>H-.051,sy:H=>-.0015,
    zt:(W,H)=>Math.min(.6,Math.max(.3,H*.28)),ztf:'LG-003',ztz:{tipo:'max',n:2,mont:'LG-076',marco:'LG-068',fixos:[1]},zsash:[{id:'C',n:'Bandeira maxim-ar'}],
    mx:GMX,mxglass:(W,H)=>[W-.1,H-.1],
    codes:['LG-003','LG-004','LG-024','LG-002','LG-046','LG-006','LG-050','LG-048','LG-049','BG-057','LG-068','LG-076','LG-085'],
    xparts:[{k:'bandeira',n:'Bandeira (maxim-ar + fixo)',d:'Parte de cima: marco LG-068 com a travessa LG-076; à esquerda uma folha maxim-ar LG-085, à direita um vidro fixo. O trilho LG-004 separa a bandeira das folhas de correr.',z:['LG-003','LG-004','LG-068','LG-076','LG-085'],p:['folhaC','marco','vidro']}],
    cutd:{sup:'Marco LG-003 em cima da bandeira; abaixo, o marco LG-068 e a folha maxim-ar LG-085.',inf:'Marco inferior LG-024 com a travessa LG-006 sobre as roldanas ROL-413.'},
    meetd:'Mão de amigo LG-048 (folha interna) encaixando na LG-049 (folha externa).',
    glass:(W,H)=>[(W-.186)/2,H-.1536],gtxt:'folhas (L−186)/2 × (J−153,6) · bandeira (L−180,5)/4'}),
  gpc4fbmf:g({n:'Porta de correr 4 folhas com bandeira móvel e fixa',code:'GLD PC4F-BMF',def:[3000,2700],fr:{t:'LG-004',b:'LG-047',s:'LG-002'},edge:.0256,lock:'LG-017',
    ovs:[.057,.0105,.057],together:true,
    sashes:[{id:'A',n:'Folha fixa esquerda',slot:0,z:-.0223,L:'LG-050',R:'LG-019',fixed:true,top:'LG-006',bot:'LG-007',mid:'LG-055'},
            {id:'B',n:'Folha móvel esquerda',slot:1,z:.0223,L:'LG-021',R:'LG-017',dir:-1,top:'LG-006',bot:'LG-007',mid:'LG-055'},
            {id:'C',n:'Folha móvel direita',slot:2,z:.0223,L:'LG-020',R:'LG-021',dir:1,top:'LG-006',bot:'LG-007',mid:'LG-055'},
            {id:'D',n:'Folha fixa direita',slot:3,z:-.0223,L:'LG-019',R:'LG-050',fixed:true,top:'LG-006',bot:'LG-007',mid:'LG-055'}],
    rails:{bot:'LG-007',mid:'LG-055'},sh:H=>H-.051,sy:H=>-.0015,
    zt:(W,H)=>Math.min(.7,Math.max(.35,H*.24)),ztf:'LG-003',ztz:{tipo:'max',n:4,mont:'LG-076',marco:'LG-068',fixos:[1,2]},zsash:[{id:'E',n:'Bandeira maxim-ar esquerda'},{id:'F',n:'Bandeira maxim-ar direita'}],
    mx:GMX,mxglass:(W,H)=>[W-.1,H-.1],
    codes:['LG-003','LG-004','LG-047','LG-002','LG-046','LG-006','LG-007','LG-055','LG-050','LG-019','LG-021','LG-017','LG-020','BG-057','LG-068','LG-076','LG-085'],
    xparts:[{k:'bandeira',n:'Bandeira (2 maxim-ar + 2 fixos)',d:'Parte de cima: marco LG-068 com as travessas LG-076; maxim-ar LG-085 nas pontas e vidros fixos no meio. O trilho LG-004 separa a bandeira das folhas de correr.',z:['LG-003','LG-004','LG-068','LG-076','LG-085'],p:['folhaE','folhaF','marco','vidro']}],
    cutd:{sup:'Marco LG-003 em cima da bandeira; abaixo, o marco LG-068 e as folhas maxim-ar LG-085.',inf:'Marco inferior LG-047 com a travessa LG-007 das folhas sobre as roldanas.'},
    meetd:'Nas laterais, a mão de amigo LG-021 da folha móvel encaixa na LG-019 da folha fixa. No centro, as folhas móveis se encontram pelo montante LG-017 e o central LG-020.',
    glass:(W,H)=>[(W-.3173)/4,(H-.1961)/2],gtxt:'folhas (L−317,3)/4 × (P−196,1)/2 · bandeira (L−306)/4'}),
  /* ===== Gold maxim-ar com peitoril e conjugada ===== */
  gmaxpf:g({n:'Janela maxim-ar com peitoril e painel fixo',code:'GLD MAXP FIXO',kind:'zonas',def:[2400,1600],fr:{t:'LG-082',b:'LG-083',s:'LG-083'},edge:0,gcontra:false,
    zonas:[{tipo:'fixo',h:(W,H)=>H*.38,n:3,mont:'LG-079'},{tipo:'max',h:'*',trav:'LG-076',n:3,mont:'LG-079',fixos:[0,2]}],
    sashes:[{id:'A',n:'Maxim-ar central',z:0,L:'LG-085',R:'LG-085',dir:1}],mx:GMX,mxglass:(W,H)=>[W-.1,H-.1],
    codes:['LG-082','LG-083','LG-076','LG-079','LG-085','BG-057'],fz:['LG-085'],
    xparts:[{k:'peitoril',n:'Peitoril e painéis fixos',d:'Embaixo três vidros fixos; em cima, vidros fixos nas pontas e a maxim-ar no centro. Montantes LG-079 e travessa LG-076.',z:['LG-076','LG-079','BG-057'],p:['marco','vidro','baguete']}],
    cutd:{sup:'Marco LG-082 em cima, com a folha maxim-ar LG-085.',inf:'Marco LG-083 embaixo do peitoril fixo, com a baguete BG-057.'},
    glass:(W,H)=>[W-.1,H-.1],gtxt:'conforme o sistema de cálculo (CC e cadeirinha)'}),
  gmaxpfcc:g({n:'Janela maxim-ar com peitoril fixo',code:'GLD MAXP FIXO-CC',kind:'zonas',def:[2000,1600],fr:{t:'LG-078',b:'LG-078',s:'LG-078'},edge:0,gcontra:false,
    zonas:[{tipo:'fixo',h:(W,H)=>H*.38,n:2,mont:'LG-075'},{tipo:'max',h:'*',trav:'LG-076',n:2,mont:'LG-075'}],
    sashes:[{id:'A',n:'Maxim-ar esquerda',z:0,L:'LG-085',R:'LG-085',dir:1},{id:'B',n:'Maxim-ar direita',z:0,L:'LG-085',R:'LG-085',dir:1}],mx:GMX,mxglass:(W,H)=>[W-.1,H-.1],
    codes:['LG-078','LG-075','LG-076','LG-085','BG-057'],fz:['LG-085'],
    xparts:[{k:'peitoril',n:'Peitoril fixo',d:'Embaixo dois vidros fixos; em cima duas maxim-ar. Montante LG-075 e travessa LG-076.',z:['LG-075','LG-076','BG-057'],p:['marco','vidro','baguete']}],
    cutd:{sup:'Marco LG-078 em cima, com as folhas maxim-ar LG-085.',inf:'Marco LG-078 embaixo do peitoril fixo.'},
    glass:(W,H)=>[W-.1,H-.1],gtxt:'conforme o sistema de cálculo (CC e cadeirinha)'}),
  gcjunit:g({n:'Janela maxim-ar conjugada com fixo',code:'GLD CJ-UNIT',kind:'zonas',def:[1200,2600],fr:{t:'LG-082',b:'LG-088',s:'LG-086'},edge:0,gcontra:false,
    zonas:[{tipo:'fixo',h:(W,H)=>H*.34,n:1},{tipo:'max',h:'*',trav:'LG-079',n:1},{tipo:'fixo',h:(W,H)=>H*.16,trav:'LG-079',n:1}],
    sashes:[{id:'A',n:'Maxim-ar',z:0,L:'LG-085',R:'LG-085',dir:1}],mx:GMX,mxglass:(W,H)=>[W-.1,H-.1],
    codes:['LG-082','LG-088','LG-086','LG-079','LG-085','BG-057'],fz:['LG-085'],
    xparts:[{k:'fixos',n:'Peitoril e bandeira fixos',d:'Um módulo da fachada: peitoril fixo embaixo, maxim-ar no meio e bandeira fixa em cima, separados pelas travessas LG-079; colunas LG-086.',z:['LG-079','LG-086','LG-088','BG-057'],p:['marco','vidro','baguete']}],
    cutd:{sup:'Marco LG-082 em cima da bandeira fixa.',inf:'Peitoril LG-088 embaixo do vidro fixo.'},
    glass:(W,H)=>[W-.1,H-.1],gtxt:'conforme o sistema de cálculo'})
};
const lin=k=>LINHAS.find(l=>l.k===k);
Object.entries(NOVAS).forEach(([k,v])=>{if(TYPOS[k])return;TYPOS[k]=v;const L=lin(v.line==='gold'?'gold':'sup');if(L&&!L.t.includes(k))L.t.push(k);});
window.FC_LOTE2=NOVAS;
/* nome e dica de cada perfil novo (Peças, etiquetas e cortes) */
if(typeof PN!=='undefined'){const cs=new Set();Object.values(NOVAS).forEach(v=>{(v.codes||[]).forEach(c=>cs.add(c));v.sashes.forEach(x=>{cs.add(x.L);cs.add(x.R);if(x.top)cs.add(x.top);if(x.bot)cs.add(x.bot);});Object.values(v.fr).forEach(c=>cs.add(c));if(v.gp)Object.values(v.gp).forEach(c=>{if(typeof c==='string'&&/^[A-Z]{2}-\d/.test(c))cs.add(c);});(v.zx||[]).forEach(c=>cs.add(c));});
  cs.forEach(c=>{if(c&&!PN[c]&&SHAPES[c]){const t=(typeof TIT!=='undefined'&&TIT[c])||'Perfil';PN[c]={n:t.charAt(0).toUpperCase()+t.slice(1),h:'Perfil conforme a folha de montagem do catálogo técnico.'};}});}
const pedida=new URLSearchParams(location.search).get('t');
if(pedida&&NOVAS[pedida]){let n=0;const iv=setInterval(()=>{n++;try{if(!document.getElementById('pfcGate')&&S.typo!==pedida){clearInterval(iv);setTypo(pedida);}else if(S.typo===pedida||n>100)clearInterval(iv);}catch(_){clearInterval(iv);}},100);}
try{LINCUR=null;if(typeof linSync==='function'&&typeof S!=='undefined')linSync(S.typo);}catch(_){}
})();

/* Montagens da Linha Suprema · Plataforma FC 3D Clientes
   Uma definição por montagem gera o 3D e os cortes do desenho técnico (seções em escala real, mm).
   © FC Consultoria em Esquadria · criação da FC, uso exclusivo de empresas licenciadas. */
(function(){
const MONT={
 jc2:{n:'Janela de correr 2 folhas',cd:'SUP JCR 200',linha:'Linha Suprema',def:[1200,1000],
  fr:{t:'SU-001',b:'SU-002',s:'SU-003'},edge:14.4,rotLat:true,
  folhas:[{n:'Folha interna',z:17.5,L:'SU-039',R:'SU-040',dir:1},{n:'Folha externa',z:-17.5,L:'SU-041',R:'SU-039',dir:-1}],
  vidro:(L,H)=>[(L-143.2)/2,H-134],vtx:'(L − 143,2) / 2 × (H − 134)',dw:460},
 jc3:{n:'Janela de correr 3 folhas',cd:'SUP JCR 300',linha:'Linha Suprema',def:[1800,1200],
  fr:{t:'SU-010',b:'SU-011',s:'SU-012'},edge:19,contra:'SU-291',contra2:true,web0:13,
  folhas:[{n:'Folha interna',z:35,L:'SU-039',R:'SU-040',dir:1},{n:'Folha central',z:0,L:'SU-041',R:'SU-040',dir:1},{n:'Folha fixa',z:-35,L:'SU-041',R:'SU-039',fixa:true}],
  vidro:(L,H)=>[(L-174)/3,H-134],vtx:'(L − 174) / 3 × (H − 134)',dw:660}
,
 jc2a:{n:'Janela de correr 2 folhas (marco com contrafecho)',cd:'SUP JCR 200A',linha:'Linha Suprema',def:[1200,1000],
  fr:{t:'SU-026',b:'SU-251',s:'SU-028'},edge:35,contra:'SU-291',contra2:true,web0:7,
  folhas:[{n:'Folha interna',z:17.5,L:'SU-039',R:'SU-040',dir:1},{n:'Folha externa',z:-17.5,L:'SU-041',R:'SU-039',dir:-1}],
  vidro:(L,H)=>[(L-181.4)/2,H-167],vtx:'(L − 181,4) / 2 × (H − 167)',dw:500},
 jc4:{n:'Janela de correr 4 folhas',cd:'SUP JCR 400',linha:'Linha Suprema',def:[2000,1200],
  fr:{t:'SU-026',b:'SU-251',s:'SU-028'},edge:35,contra:'SU-291',contra2:true,web0:7,ovs:[30,0,30],
  folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-041',fixa:true},{n:'Folha móvel esquerda',z:17.5,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},
          {n:'Folha móvel direita',z:17.5,L:'SU-039',R:'SU-040',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-17.5,L:'SU-041',R:'SU-039',fixa:true}],
  vidro:(L,H)=>[(L-295.7)/4,H-167],vtx:'(L − 295,7) / 4 × (H − 167)',dw:880},
 jc4a:{n:'Janela de correr 4 folhas (marco liso)',cd:'SUP JCR 400A',linha:'Linha Suprema',def:[2000,1200],
  fr:{t:'SU-001',b:'SU-002',s:'SU-003'},edge:14.4,ovs:[30,0,30],
  folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-041',fixa:true},{n:'Folha móvel esquerda',z:17.5,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},
          {n:'Folha móvel direita',z:17.5,L:'SU-039',R:'SU-040',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-17.5,L:'SU-041',R:'SU-039',fixa:true}],
  vidro:(L,H)=>[(L-257.5)/4,H-134],vtx:'(L − 257,5) / 4 × (H − 134)',dw:840},
 /* ===== montagens com zonas (motor genérico) ===== */
 jcb:{n:'Janela de correr 2 folhas com bandeira móvel',cd:'SUP JCR 205',linha:'Linha Suprema',def:[1200,1500],dw:520,hd:620,
  fr:{t:'SU-029',b:'SU-251',s:'SU-028'},zH:0,
  zonas:[{tipo:'correr',h:'*',edge:35,contra:'SU-291',contra2:true,web0:7,dt:46,
    folhas:[{n:'Folha interna',z:17.5,L:'SU-039',R:'SU-040',dir:1},{n:'Folha externa',z:-17.5,L:'SU-041',R:'SU-039',dir:-1}]},
   {tipo:'max',h:(W,H)=>H*0.3,trav:'SU-005',n:2,mont:'SU-085',marco:'SU-079',ping:'SU-276'}],
  vtx:'Folhas de correr: (L − 181,4) / 2 · bandeira: (L − 241,6) / 2 de largura por folha; alturas conforme o sistema de cálculo.'},
 jc4p:{n:'Janela de correr 4 folhas com peitoril fixo',cd:'SUP JCR 402',linha:'Linha Suprema',def:[2000,1500],dw:860,hd:620,
  fr:{t:'SU-001',b:'SU-004',s:'SU-007'},zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.3,n:4,mont:'SU-079',bag:'SU-103',ins:14},
   {tipo:'correr',h:'*',trav:'SU-006',edge:14.4,ovs:[30,0,30],db:'trav',contra:'SU-291',contra2:true,web0:7,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-041',fixa:true},{n:'Folha móvel esquerda',z:17.5,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},
     {n:'Folha móvel direita',z:17.5,L:'SU-039',R:'SU-040',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-17.5,L:'SU-041',R:'SU-039',fixa:true}]}],
  vtx:'Folhas de correr: (L − 263,9) / 4 · peitoril: (L − 174,8) / 4 de largura por painel; alturas conforme o sistema de cálculo.'},
 jc4pa:{n:'Janela de correr 4 folhas com peitoril fixo (marco com contrafecho)',cd:'SUP JCR 402A',linha:'Linha Suprema',def:[2000,1500],dw:860,hd:620,
  fr:{t:'SU-026',b:'SU-029',s:'SU-028'},zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.3,n:4,mont:'SU-079',bag:'SU-103',ins:14},
   {tipo:'correr',h:'*',trav:'SU-006',edge:35,ovs:[30,0,30],db:'trav',contra:'SU-291',contra2:true,web0:7,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-041',fixa:true},{n:'Folha móvel esquerda',z:17.5,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},
     {n:'Folha móvel direita',z:17.5,L:'SU-039',R:'SU-040',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-17.5,L:'SU-041',R:'SU-039',fixa:true}]}],
  vtx:'Folhas de correr: (L − 295,7) / 4 · peitoril: (L − 206,5) / 4 de largura por painel; alturas conforme o sistema de cálculo.'},
 jvz3:{n:'Janela de correr 3 folhas com veneziana',cd:'SUP JVZ 300',linha:'Linha Suprema',def:[1800,1200],dw:680,
  fr:{t:'SU-010',b:'SU-011',sl:'SU-013',sr:'SU-014',s:'SU-013'},
  zonas:[{tipo:'correr',h:'*',edge:19,
    folhas:[{n:'Folha de vidro',z:35,L:'SU-039',R:'SU-040',dir:1},
     {n:'Folha veneziana cega',z:0,L:'SU-069',R:'SU-068',dir:-1,inf:'vz',tt:'SU-187',tb:'SU-187'},
     {n:'Folha veneziana ventilada',z:-35,L:'SU-070',R:'SU-068',dir:-1,inf:'vzv',tt:'SU-187',tb:'SU-187'}]}],
  vtx:'Vidro: (L − 143,2) / 2 × (H − 134) · veneziana: (L − 121,2) / 2 de largura (simulação).'},
 jc4v:{n:'Janela de correr 4 folhas com veneziana',cd:'SUP JCR 204',linha:'Linha Suprema',def:[1400,1200],dw:600,
  fr:{t:'SU-121',b:'SU-122',s:'SU-123'},web:13,
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:0,
    camadas:[{folhas:[{n:'Folha de vidro interna',z:52.5,L:'SU-039',R:'SU-040',dir:1},{n:'Folha de vidro externa',z:17.5,L:'SU-041',R:'SU-039',dir:-1}]},
     {folhas:[{n:'Folha veneziana interna',z:-17.5,L:'SU-068',R:'SU-070',dir:1,inf:'vzv',tt:'SU-187',tb:'SU-187'},{n:'Folha veneziana externa',z:-52.5,L:'SU-070',R:'SU-068',dir:-1,inf:'vzv',tt:'SU-187',tb:'SU-187'}]}]}],
  vtx:'Vidro: (L − 149,6) / 2 × (H − 134) · veneziana: (L − 123,6) / 2 de largura (simulação).'},
 jvz6:{n:'Janela de correr 6 folhas com veneziana',cd:'SUP JVZ 600',linha:'Linha Suprema',def:[2400,1200],dw:900,
  fr:{t:'SU-010',b:'SU-011',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:13,
    camadas:[{folhas:[{n:'Folha de vidro esquerda',z:35,L:'SU-039',R:'SU-040',dir:-1},{n:'Folha de vidro direita',z:35,L:'SU-040',R:'SU-039',dir:1}],ov:0},
     {folhas:[{n:'Veneziana cega esquerda',z:0,L:'SU-068',R:'SU-069',dir:-1,inf:'vz',tt:'SU-187',tb:'SU-187'},{n:'Veneziana cega direita',z:0,L:'SU-069',R:'SU-068',dir:1,inf:'vz',tt:'SU-187',tb:'SU-187'}],ov:0},
     {folhas:[{n:'Veneziana ventilada esquerda',z:-35,L:'SU-068',R:'SU-070',dir:-1,inf:'vzv',tt:'SU-187',tb:'SU-187'},{n:'Veneziana ventilada direita',z:-35,L:'SU-070',R:'SU-068',dir:1,inf:'vzv',tt:'SU-187',tb:'SU-187'}],ov:0}]}],
  vtx:'Vidro: (L − 239,9) / 4 × (H − 134) · veneziana: (L − 211,9) / 4 de largura (simulação).'},
 jvc7:{n:'Janela de correr 2 folhas com veneziana camarão',cd:'SUP JVC 701',linha:'Linha Suprema',def:[1400,1200],dw:620,
  fr:{t:'SU-024',b:'SU-025',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:13,
    camadas:[{folhas:[{n:'Folha de vidro interna',z:35,L:'SU-039',R:'SU-040',dir:1},{n:'Folha de vidro externa',z:0,L:'SU-041',R:'SU-039',dir:-1}]},
     {ov:0,folhas:[{n:'Camarão 1',z:-35,L:'SU-074',R:'SU-072',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:-1,ang:1.2}},
      {n:'Camarão 2',z:-35,L:'SU-072',R:'SU-074',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:-1,ang:-1.2,ch:1}},
      {n:'Camarão 3',z:-35,L:'SU-074',R:'SU-072',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:1,ang:1.2,ch:-1}},
      {n:'Camarão 4',z:-35,L:'SU-072',R:'SU-074',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:1,ang:-1.2}}]}]}],
  vtx:'Vidro: (L − 149,6) / 2 × (H − 146) · camarão: palhetas conforme a tabela do catálogo (simulação).'}
,
 pc2:{n:'Porta de correr 2 folhas',cd:'SUP PCR 200',linha:'Linha Suprema',def:[1600,2100],dw:560,hd:380,
  fr:{t:'SU-001',b:'SU-228',s:'SU-003'},
  zonas:[{tipo:'correr',h:'*',edge:14.4,
    folhas:[{n:'Folha interna',z:17.5,L:'SU-044',R:'SU-047',dir:1,tb:'SU-225',tc:'SU-227'},{n:'Folha externa',z:-17.5,L:'SU-049',R:'SU-039',dir:-1,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-143.2)/2,(H-212)/2],vtx:'(L − 143,2) / 2 × (H − 212) / 2',vpor:'por vidro (2 por folha)'},
 pc2a:{n:'Porta de correr 2 folhas (marco com contrafecho)',cd:'SUP PCR 200A',linha:'Linha Suprema',def:[1600,2100],dw:600,hd:380,
  fr:{t:'SU-026',b:'SU-228',s:'SU-028'},
  zonas:[{tipo:'correr',h:'*',edge:35,contra:'SU-291',contra2:true,web0:7,
    folhas:[{n:'Folha interna',z:17.5,L:'SU-044',R:'SU-047',dir:1,tb:'SU-225',tc:'SU-227'},{n:'Folha externa',z:-17.5,L:'SU-049',R:'SU-039',dir:-1,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-181.4)/2,(H-228.4)/2],vtx:'(L − 181,4) / 2 × (H − 228,4) / 2',vpor:'por vidro (2 por folha)'},
 pc3:{n:'Porta de correr 3 folhas',cd:'SUP PCR 300',linha:'Linha Suprema',def:[2400,2100],dw:760,hd:380,
  fr:{t:'SU-010',b:'SU-230',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:13,
    folhas:[{n:'Folha interna',z:35,L:'SU-044',R:'SU-047',dir:1,tb:'SU-225',tc:'SU-227'},{n:'Folha central',z:0,L:'SU-049',R:'SU-047',dir:1,tb:'SU-225',tc:'SU-227'},
     {n:'Folha fixa',z:-35,L:'SU-049',R:'SU-039',fixa:true,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-174)/3,(H-212)/2],vtx:'(L − 174) / 3 × (H − 212) / 2',vpor:'por vidro (2 por folha)'},
 pc4:{n:'Porta de correr 4 folhas',cd:'SUP PCR 400',linha:'Linha Suprema',def:[2800,2100],dw:900,hd:380,
  fr:{t:'SU-001',b:'SU-228',s:'SU-003'},
  zonas:[{tipo:'correr',h:'*',edge:14.4,ovs:[30,0,30],
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-049',fixa:true,tb:'SU-225',tc:'SU-227'},{n:'Folha móvel esquerda',z:17.5,L:'SU-047',R:'SU-044',dir:-1,curso:'passo',tb:'SU-225',tc:'SU-227'},
     {n:'Folha móvel direita',z:17.5,L:'SU-044',R:'SU-047',dir:1,curso:'passo',tb:'SU-225',tc:'SU-227'},{n:'Folha fixa direita',z:-17.5,L:'SU-049',R:'SU-039',fixa:true,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-257.5)/4,(H-212)/2],vtx:'(L − 257,5) / 4 × (H − 212) / 2',vpor:'por vidro (2 por folha)'},
 pc4a:{n:'Porta de correr 4 folhas (marco com contrafecho)',cd:'SUP PCR 400A',linha:'Linha Suprema',def:[2800,2100],dw:900,hd:380,
  fr:{t:'SU-026',b:'SU-228',s:'SU-028'},
  zonas:[{tipo:'correr',h:'*',edge:35,ovs:[30,0,30],contra:'SU-291',contra2:true,web0:7,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-049',fixa:true,tb:'SU-225',tc:'SU-227'},{n:'Folha móvel esquerda',z:17.5,L:'SU-047',R:'SU-044',dir:-1,curso:'passo',tb:'SU-225',tc:'SU-227'},
     {n:'Folha móvel direita',z:17.5,L:'SU-044',R:'SU-047',dir:1,curso:'passo',tb:'SU-225',tc:'SU-227'},{n:'Folha fixa direita',z:-17.5,L:'SU-049',R:'SU-039',fixa:true,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-295.7)/4,(H-228.5)/2],vtx:'(L − 295,7) / 4 × (H − 228,5) / 2',vpor:'por vidro (2 por folha)'},
 pvz3:{n:'Porta de correr 3 folhas com veneziana',cd:'SUP PVZ 300',linha:'Linha Suprema',def:[1800,2100],dw:680,hd:380,
  fr:{t:'SU-010',b:'SU-230',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:13,
    folhas:[{n:'Folha de vidro',z:35,L:'SU-039',R:'SU-047',dir:1,tb:'SU-225',tc:'SU-227'},
     {n:'Folha veneziana cega',z:0,L:'SU-069',R:'SU-068',dir:-1,inf:'vz',tt:'SU-187',tb:'SU-225',tc:'SU-227'},
     {n:'Folha veneziana ventilada',z:-35,L:'SU-070',R:'SU-068',dir:-1,inf:'vzv',tt:'SU-187',tb:'SU-225',tc:'SU-227'}]}],
  vtx:'Vidro: (L − 149,6) / 2 × (H − 212) / 2 · veneziana: (L − 123,6) / 2 de largura (simulação).'}
,
 pg1:{n:'Porta de giro 1 folha',cd:'SUP PGR 100',linha:'Linha Suprema',def:[900,2100],dw:420,hd:420,
  fr:{t:'SU-279',s:'SU-279'},web:0,
  zonas:[{tipo:'giro',h:'*',n:1,fm:'SU-111',tt:'SU-110',tb:'SU-225',tc:'SU-050'}],
  vtx:'Referências do catálogo: L − 166,5 · L − 172,5 · H − 243,5 · H − 255,5. Medida final no sistema de cálculo.'},
 pg2:{n:'Porta de giro 2 folhas',cd:'SUP PGR 200',linha:'Linha Suprema',def:[1500,2100],dw:620,hd:420,
  fr:{t:'SU-279',s:'SU-279'},web:0,
  zonas:[{tipo:'giro',h:'*',n:2,fm:'SU-111',tt:'SU-110',tb:'SU-225',tc:'SU-050'}],
  vtx:'Referências do catálogo: L − 287 · L − 299 · H − 243,5 · H − 255,5. Medida final no sistema de cálculo.'},
 mx1:{n:'Janela maxim-ar 1 folha',cd:'SUP MAX 800',linha:'Linha Suprema',def:[800,700],dw:420,hd:360,
  fr:{t:'SU-079',b:'SU-079',s:'SU-079'},web:0,
  zonas:[{tipo:'max',h:'*',n:1,fm:'SU-200',ft:'SU-080',ping:'SU-276',gap:6}],
  vidro:(L,H)=>[L-98.4,H-98.4],vtx:'(L − 98,4) × (H − 98,4)',vpor:''},
 mx2p:{n:'Janela maxim-ar 2 folhas com peitoril fixo',cd:'SUP MAX 801',linha:'Linha Suprema',def:[1200,1400],dw:520,hd:620,
  fr:{t:'SU-079',b:'SU-079',s:'SU-079'},web:0,zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.4,n:2,mont:'SU-085',bag:'SU-102',ins:12},
   {tipo:'max',h:'*',trav:'SU-086',n:2,mont:'SU-085',fm:'SU-200',ft:'SU-080',ping:'SU-276',gap:6}],
  vtx:'Folhas: (L − 183,8) / 2 de largura · peitoril: (L − 139) / 2 de largura; alturas conforme o sistema de cálculo.'}
};
/* montante que espelha o lado (perfil de encontro da folha externa) */
const ESPELHA={'SU-041':1};
const SDS=25,OV=30,WEB=13;
/* afastamento do perfil de encontro em relação ao plano da folha */
function mz(S,c){if(c==='SU-040')return SDS/2-S[c].h/2;if(c==='SU-041')return -SDS/2+S[c].h/2;return 0;}

/* Gera as peças: cada perfil é a seção (a,b) levada aos eixos ex, ey e extrudada em ez, centrada em p.
   Peças de folha usam coordenadas locais; a folha fica em (ox, 0, z). */
function pecas(S,m,W,H){
 const X=[1,0,0],Y=[0,1,0],Z=[0,0,1],N=v=>v.map(x=>-x);
 const PW=c=>S[c].w,PH=c=>S[c].h,fr=m.fr,FT=PH(fr.t),FB=PH(fr.b),FS=PH(fr.s);
 const P=[],add=(o)=>{P.push(o);return o;};
 const TL=W-2*WEB,Hf=H-FT-FB,yc=(FB-FT)/2;
 add({c:fr.t,len:TL,ex:Z,ey:Y,ez:X,p:[0,H/2-FT/2,0],g:-1,x:[0,1,0]});
 add({c:fr.b,len:TL,ex:Z,ey:Y,ez:X,p:[0,-H/2+FB/2,0],g:-1,x:[0,-1,0]});
 const F=m.folhas,NS=F.length,LROT=fr.s==='SU-003',rot=LROT&&F[0].z>0&&F[NS-1].z<0;
 /* SU-003: lateral esquerdo girado 180° quando a folha interna fica à esquerda; senão espelhado */
 add({c:fr.s,len:H,ex:rot?Z:LROT?N(Z):Z,ey:X,ez:rot?N(Y):Y,p:[-W/2+FS/2,0,0],g:-1,x:[-1,0,0]});
 add({c:fr.s,len:H,ex:LROT?N(Z):Z,ey:N(X),ez:LROT?N(Y):Y,p:[W/2-FS/2,0,0],g:-1,x:[1,0,0]});
 if(m.contra){const WO=m.web0||0,sc=[30/PW(m.contra),15/PH(m.contra)];
  add({c:m.contra,len:Hf,ex:Z,ey:N(X),ez:Y,p:[W/2-FS-7.5+WO,yc,F[NS-1].z],g:-1,x:[.6,0,0],sc});
  if(m.contra2)add({c:m.contra,len:Hf,ex:Z,ey:X,ez:Y,p:[-W/2+FS+7.5-WO,yc,F[0].z],g:-1,x:[-.6,0,0],sc});}
 const OVS=m.ovs||Array(NS-1).fill(OV),SOV=OVS.reduce((a,b)=>a+b,0),Wi=W-2*m.edge,sW=(Wi+SOV)/NS,step=sW-OV,sH=H-50,[gw]=m.vidro(W,H);
 const OB=S['SU-102'].offT||[2.98,18.02],oz=OB[0],inset=PH('SU-053')/2-OB[1],RW=PH('SU-053');
 const folhas=F.map((sd,i)=>{
  const L=sd.L,R=sd.R,xL=-sW/2+PW(L),xR=sW/2-PW(R),xLc=-sW/2+PW(L)/2,xRc=sW/2-PW(R)/2,tx=(xL+xR)/2,tl=xR-xL+4;
  const lfz=rot&&i===0&&L==='SU-039';
  add({c:L,len:sH,ex:ESPELHA[L]?N(X):X,ey:lfz?N(Z):Z,ez:Y,p:[xLc,0,lfz?-mz(S,L):mz(S,L)],g:i,x:[-1,0,0]});
  add({c:R,len:sH,ex:ESPELHA[R]?X:N(X),ey:Z,ez:Y,p:[xRc,0,mz(S,R)],g:i,x:[1,0,0]});
  add({c:'SU-053',len:tl,ex:Z,ey:N(Y),ez:X,p:[tx,sH/2-RW/2,0],g:i,x:[0,1,0]});
  add({c:'SU-053',len:tl,ex:Z,ey:Y,ez:X,p:[tx,-sH/2+RW/2,0],g:i,x:[0,-1,0]});
  const hi=sH/2-RW,lo=-sH/2+RW,bxL=xL-inset,bxR=xR+inset,blen=bxR-bxL,yT=hi+inset,yB=lo-inset,bhl=yT-yB,yc2=(yT+yB)/2;
  add({vid:1,w:gw,h:hi-lo+12,d:6,p:[tx,(lo+hi)/2,-3.5],g:i,x:[0,0,0],nm:'Vidro 6 mm'});
  add({c:'SU-102',len:blen,ex:Z,ey:N(Y),ez:X,p:[tx,yT,oz],g:i,x:[0,.45,.4]});
  add({c:'SU-102',len:blen,ex:Z,ey:Y,ez:X,p:[tx,yB,oz],g:i,x:[0,-.45,.4]});
  add({c:'SU-102',len:bhl,ex:Z,ey:X,ez:Y,p:[bxL,yc2,oz],g:i,x:[-.45,0,.4]});
  add({c:'SU-102',len:bhl,ex:Z,ey:N(X),ez:Y,p:[bxR,yc2,oz],g:i,x:[.45,0,.4]});
  const ox=-Wi/2+sW/2+i*sW-OVS.slice(0,i).reduce((a,b)=>a+b,0);
  return {n:sd.n,ox,z:sd.z,fixa:!!sd.fixa,dir:sd.dir||0,curso:sd.fixa?0:sd.curso==='passo'?step:(sd.dir>0?(NS-1-i)*step:i*step),gx:tx};
 });
 return {P,folhas,sW,sH,step,Wi};
}
/* ---------- Motor genérico das montagens (zonas, folhas de correr, veneziana, maxim-ar, giro) ----------
   Mesma convenção das montagens acima: x = largura, y = altura, z = profundidade (+ lado interno).
   Montante: seção (a,b) com a na largura e b na profundidade. Travessa e marco: a na profundidade, b na altura.
   Cada definição com "zonas" gera as peças por aqui; o 3D e os cortes do desenho técnico usam o mesmo resultado. */
const GX=[1,0,0],GY=[0,1,0],GZ=[0,0,1],GN=v=>v.map(x=>-x);
const ENC={'SU-040':1,'SU-047':-1,'SU-041':-1,'SU-049':1,'SU-069':-1,'SU-070':-1};
const MIR={'SU-041':1,'SU-049':1,'SU-070':1,'SU-069':1};
const ALIAS={'US-285':'VZ-006'};
function secOf(S,c){return S[c]||S[ALIAS[c]];}
function gpecas(S,m,W,H){
 const P=[],FL=[],add=o=>{P.push(o);return o;},PW=c=>secOf(S,c).w,PH=c=>secOf(S,c).h;
 const fr=m.fr,WEB=m.web==null?13:m.web,FS=fr.s?PH(fr.s):0,FT=PH(fr.t),FB=fr.b?PH(fr.b):0;
 const TL=W-2*WEB;
 /* marco */
 add({c:fr.t,len:TL,ex:GZ,ey:GY,ez:GX,p:[0,H/2-FT/2,0],g:-1,x:[0,1,0]});
 if(fr.b)add({c:fr.b,len:TL,ex:GZ,ey:GY,ez:GX,p:[0,-H/2+FB/2,0],g:-1,x:[0,-1,0]});
 const sl=fr.sl||fr.s,sr=fr.sr||fr.s,FSL=PH(sl),FSR=PH(sr);
 add({c:sl,len:H,ex:GZ,ey:GX,ez:GY,p:[-W/2+FSL/2,0,0],g:-1,x:[-1,0,0]});
 add({c:sr,len:H,ex:GZ,ey:GN(GX),ez:GY,p:[W/2-FSR/2,0,0],g:-1,x:[1,0,0]});
 /* zonas de baixo para cima: altura de cada zona (mm reais) ou '*' para o restante */
 const Z=m.zonas,fixo=Z.reduce((a,z)=>a+(z.h==='*'?0:(typeof z.h==='function'?z.h(W,H):z.h)),0),trs=Z.slice(1).map(z=>z.trav?PH(z.trav):0).reduce((a,b)=>a+b,0);
 let yb=-H/2+(fr.b?FB:0);const ytop=H/2-FT;
 const livre=(ytop-yb)-fixo-trs;
 const zonas=[];
 Z.forEach((z,i)=>{
  let hz=z.h==='*'?livre:(typeof z.h==='function'?z.h(W,H):z.h);
  if(i>0&&z.trav){const th=PH(z.trav);add({c:z.trav,len:TL,ex:GZ,ey:z.travInv?GN(GY):GY,ez:GX,p:[0,yb+th/2,0],g:-1,x:[0,i%2?.5:-.5,-.6]});yb+=th;}
  zonas.push({z,y0:yb,y1:yb+hz});yb+=hz;});
 zonas.forEach((q,iz)=>{const z=q.z,nh=iz!==(m.zH==null?0:m.zH),n0=P.length;
  if(z.tipo==='correr')correr(q,nh);else if(z.tipo==='fixo')fixo2(q,nh);else if(z.tipo==='max')maxim(q,nh);else if(z.tipo==='giro')giro(q,nh);
  if(nh)for(let j=n0;j<P.length;j++)P[j].nh=1;});
 /* ----- folhas de correr ----- */
 function correr(q,nh){(q.z.camadas||[q.z]).forEach((c,i)=>correr1(q,Object.assign({},q.z,c,i>0?{contra:null}:{}),nh));}
 function correr1(q,z,nh){const F=z.folhas,NS=F.length,OV=z.ov==null?30:z.ov,SDS=25,edge=z.edge;
  const OVS=z.ovs||Array(NS-1).fill(OV),SOV=OVS.reduce((a,b)=>a+b,0),Wi=W-2*edge,sW=(Wi+SOV)/NS,step=sW-OV;
  const top=q.y1+(z.dt==null?(iz0(q)?FT:0):z.dt)-(z.gt==null?25:z.gt),bot=q.y0-(z.db==null?(fr.b&&q.y0<=-H/2+FB+1?FB:0):z.db==='trav'?PH(z.trav):z.db)+(z.gb==null?25:z.gb);
  const sH=top-bot,yc=(top+bot)/2;
  if(z.contra){const WO=z.web0||0,sc=[30/PW(z.contra),15/PH(z.contra)],hf=top-bot+50-(z.gt==null?0:0);
   add({c:z.contra,len:hf,ex:GZ,ey:GN(GX),ez:GY,p:[W/2-FSR-7.5+WO,yc,F[NS-1].z],g:-1,x:[.6,0,0],sc,nh});
   if(z.contra2)add({c:z.contra,len:hf,ex:GZ,ey:GX,ez:GY,p:[-W/2+FSL+7.5-WO,yc,F[0].z],g:-1,x:[-.6,0,0],sc,nh});}
  F.forEach((sd,i)=>{const gi=FL.length,L=sd.L,R=sd.R,xL=-sW/2+PW(L),xR=sW/2-PW(R),xLc=-sW/2+PW(L)/2,xRc=sW/2-PW(R)/2,tx=(xL+xR)/2,tl=xR-xL+4;
   const mz=c=>ENC[c]?ENC[c]*(SDS/2-PH(c)/2):0;
   add({c:L,len:sH,ex:MIR[L]?GN(GX):GX,ey:GZ,ez:GY,p:[xLc,yc,mz(L)],g:gi,x:[-1,0,0],nh});
   add({c:R,len:sH,ex:MIR[R]?GX:GN(GX),ey:GZ,ez:GY,p:[xRc,yc,mz(R)],g:gi,x:[1,0,0],nh});
   const tt=sd.tt||'SU-053',tb=sd.tb||'SU-053',RT=PH(tt),RB=PH(tb);
   add({c:tt,len:tl,ex:GZ,ey:GN(GY),ez:GX,p:[tx,yc+sH/2-RT/2,0],g:gi,x:[0,1,0]});
   add({c:tb,len:tl,ex:GZ,ey:GY,ez:GX,p:[tx,yc-sH/2+RB/2,0],g:gi,x:[0,-1,0]});
   const hi=yc+sH/2-RT,lo=yc-sH/2+RB;let panes=[[lo,hi]];
   if(sd.tc){const RC=PH(sd.tc),ym=sd.tcy!=null?lo+sd.tcy:(lo+hi)/2;add({c:sd.tc,len:tl,ex:GZ,ey:GY,ez:GX,p:[tx,ym,0],g:gi,x:[0,0,-.7]});panes=[[lo,ym-RC/2],[ym+RC/2,hi]];}
   panes.forEach(([a,b],k)=>enche(gi,sd.inf||'vidro',xL,xR,a,b,sd,k));
   const ox=-Wi/2+sW/2+i*sW-OVS.slice(0,i).reduce((a,b)=>a+b,0);
   const cam=sd.cam?{eixo:'y',px:sd.cam.lado<0?-sW/2:sW/2,pz:0,ang:sd.cam.ang,ch:sd.cam.ch?{w:sW,sx:sd.cam.ch}:null}:null;
   FL.push({n:sd.n,ox,z:sd.z,rot:cam,fixa:!!sd.fixa,dir:sd.cam?0:(sd.dir||0),curso:sd.cam?0:(sd.fixa?0:sd.curso==='passo'?step:(sd.dir>0?(NS-1-i)*step:i*step)),gx:tx,inf:sd.inf||'vidro',
    el:{x0:ox-sW/2,x1:ox+sW/2,y0:bot,y1:top}});});}
 function iz0(q){return q.y1>=ytop-1;}
 /* ----- preenchimento: vidro com baguete ou veneziana ----- */
 function enche(gi,inf,xL,xR,lo,hi,sd,k){const tx=(xL+xR)/2;
  if(inf==='vz'||inf==='vzv'){const c=inf==='vzv'?'US-285':'VZ-006',sh=PH(c),pas=sd.passo||64,n=Math.max(1,Math.floor((hi-lo-8)/pas)),y0=lo+(hi-lo-(n-1)*pas)/2;
   for(let j=0;j<n;j++)add({c,len:xR-xL,ex:GY,ey:GZ,ez:GX,p:[tx,y0+j*pas,0],g:gi,x:[0,0,-.5-(j%2)*.15],sc:[1,1]});
   add({vid:1,vz:1,w:xR-xL,h:hi-lo,d:3,p:[tx,(lo+hi)/2,0],g:gi,x:[0,0,0],nm:inf==='vzv'?'Palhetas da veneziana ventilada':'Palhetas da veneziana cega'});return;}
  const bag=sd.bag||'SU-102',OB=secOf(S,'SU-102').offT||[2.98,18.02],oz=OB[0],ins=7.45;
  const bxL=xL-ins,bxR=xR+ins,yT=hi+ins,yB=lo-ins,blen=bxR-bxL,bhl=yT-yB,yc2=(yT+yB)/2;
  add({vid:1,w:xR-xL+12,h:hi-lo+12,d:6,p:[tx,(lo+hi)/2,-3.5],g:gi,x:[0,0,0],nm:'Vidro 6 mm'});
  add({c:bag,len:blen,ex:GZ,ey:GN(GY),ez:GX,p:[tx,yT,oz],g:gi,x:[0,.45,.4]});
  add({c:bag,len:blen,ex:GZ,ey:GY,ez:GX,p:[tx,yB,oz],g:gi,x:[0,-.45,.4]});
  add({c:bag,len:bhl,ex:GZ,ey:GX,ez:GY,p:[bxL,yc2,oz],g:gi,x:[-.45,0,.4]});
  add({c:bag,len:bhl,ex:GZ,ey:GN(GX),ez:GY,p:[bxR,yc2,oz],g:gi,x:[.45,0,.4]});}
 /* ----- zona fixa (peitoril ou bandeira fixa): painéis de vidro com baguete, divididos por montantes ----- */
 function fixo2(q,nh){const z=q.z,n=z.n||1,mc=z.mont,MW=mc?PH(mc):0,x0=-W/2+FSL+(z.folga||0),x1=W/2-FSR-(z.folga||0),pw=(x1-x0-(n-1)*MW)/n;
  const gi=FL.length;FL.push({n:'Fixo',ox:0,z:0,fixa:true,dir:0,curso:0,gx:0,inf:'vidro',fixo:1,el:{x0,x1,y0:q.y0,y1:q.y1,n,pw,MW}});
  for(let k=0;k<n;k++){const a=x0+k*(pw+MW),b=a+pw;
   if(k>0&&mc)add({c:mc,len:q.y1-q.y0,ex:GZ,ey:GX,ez:GY,p:[a-MW/2,(q.y0+q.y1)/2,0],g:gi,x:[0,0,-.6],nh});
   enche(gi,'vidro',a+(z.ins||10),b-(z.ins||10),q.y0+(z.ins||10),q.y1-(z.ins||10),{bag:z.bag},k);}}
 /* ----- maxim-ar: marco da zona + folhas que giram no topo, projetando para fora ----- */
 function maxim(q,nh){const z=q.z,n=z.n||1,mc=z.mont||'SU-085',MW=mc?PH(mc):0,x0=-W/2+FSL,x1=W/2-FSR,pw=(x1-x0-(n-1)*MW)/n,fm=z.fm||'SU-200',ft=z.ft||'SU-200',FM=PW(fm),FT2=PW(ft)===PW(fm)&&ft===fm?FM:PH(ft);
  for(let k=0;k<n;k++){let a=x0+k*(pw+MW),b=a+pw;
   if(k>0)add({c:mc,len:q.y1-q.y0,ex:GZ,ey:GX,ez:GY,p:[a-MW/2,(q.y0+q.y1)/2,0],g:-1,x:[0,0,-.6],nh});
   if(z.marco){const mc2=z.marco,MH=PH(mc2),ow=b-a,oh=q.y1-q.y0;
    add({c:mc2,len:ow,ex:GZ,ey:GN(GY),ez:GX,p:[(a+b)/2,q.y1-MH/2,0],g:-1,x:[0,.5,-.4],nh:0});
    add({c:mc2,len:ow,ex:GZ,ey:GY,ez:GX,p:[(a+b)/2,q.y0+MH/2,0],g:-1,x:[0,-.5,-.4]});
    add({c:mc2,len:oh-2*MH,ex:GZ,ey:GX,ez:GY,p:[a+MH/2,(q.y0+q.y1)/2,0],g:-1,x:[-.5,0,-.4],nh});
    add({c:mc2,len:oh-2*MH,ex:GZ,ey:GN(GX),ez:GY,p:[b-MH/2,(q.y0+q.y1)/2,0],g:-1,x:[.5,0,-.4],nh});}
   const mo=z.marco?PH(z.marco):0;a+=mo;b-=mo;const qy0=q.y0+mo,qy1=q.y1-mo;
   const gi=FL.length,fg=z.gap==null?8:z.gap,lx0=a+fg,lx1=b-fg,ly0=qy0+fg,ly1=qy1-fg,cx=(lx0+lx1)/2,cy=(ly0+ly1)/2,zf=z.zf==null?-6:z.zf;
   const lw=lx1-lx0,lh=ly1-ly0;
   /* montantes laterais da folha e travessas (mesmo perfil girado quando ft = fm) */
   add({c:fm,len:lh,ex:GX,ey:GZ,ez:GY,p:[lx0+FM/2-cx,0,0],g:gi,x:[-1,0,0],nh});
   add({c:fm,len:lh,ex:GN(GX),ey:GZ,ez:GY,p:[lx1-FM/2-cx,0,0],g:gi,x:[1,0,0],nh});
   if(ft===fm){add({c:ft,len:lw-2*FM+4,ex:GN(GY),ey:GZ,ez:GX,p:[0,ly1-FM/2-cy,0],g:gi,x:[0,1,0]});add({c:ft,len:lw-2*FM+4,ex:GY,ey:GZ,ez:GX,p:[0,ly0+FM/2-cy,0],g:gi,x:[0,-1,0]});}
   else{const TH=PH(ft);add({c:ft,len:lw-2*FM+4,ex:GZ,ey:GN(GY),ez:GX,p:[0,ly1-TH/2-cy,0],g:gi,x:[0,1,0]});add({c:ft,len:lw-2*FM+4,ex:GZ,ey:GY,ez:GX,p:[0,ly0+TH/2-cy,0],g:gi,x:[0,-1,0]});}
   const tv=ft===fm?FM:PH(ft);
   enche(gi,'vidro',lx0+FM-cx,lx1-FM-cx,ly0+tv-cy,ly1-tv-cy,{bag:z.bag},k);
   if(z.ping)add({c:z.ping,len:pw,ex:GZ,ey:GY,ez:GX,p:[(a+b)/2,q.y1-PH(z.ping)/2,-(PW(fr.t)/2)+PW(z.ping)/2],g:-1,x:[0,.4,-.8]});
   FL.push({n:'Folha maxim-ar',ox:cx,oy:cy,z:zf,fixa:false,dir:0,curso:0,gx:0,inf:'vidro',rot:{eixo:'x',py:lh/2,pz:0,ang:0.55},el:{x0:lx0,x1:lx1,y0:ly0,y1:ly1,max:1}});}}
 /* ----- giro: folhas com dobradiça lateral, abrindo para dentro ----- */
 function giro(q,nh){const z=q.z,n=z.n||1,x0=-W/2+FSL,x1=W/2-FSR,fg=z.gap==null?3:z.gap,pw=(x1-x0-(n-1)*fg-2*fg)/n,fm=z.fm||'SU-111',FM=PW(fm);
  for(let k=0;k<n;k++){const a=x0+fg+k*(pw+fg),b=a+pw,ly0=q.y0+(z.gb==null?10:z.gb),ly1=q.y1-fg,cx=(a+b)/2,cy=(ly0+ly1)/2,lw=b-a,lh=ly1-ly0,gi=FL.length;
   add({c:fm,len:lh,ex:GX,ey:GZ,ez:GY,p:[-lw/2+FM/2,0,0],g:gi,x:[-1,0,0],nh});
   add({c:fm,len:lh,ex:GN(GX),ey:GZ,ez:GY,p:[lw/2-FM/2,0,0],g:gi,x:[1,0,0],nh});
   const tt=z.tt||'SU-110',tb=z.tb||'SU-225',tc=z.tc,RT=PH(tt),RB=PH(tb),il=lw-2*FM+4;
   add({c:tt,len:il,ex:GZ,ey:GN(GY),ez:GX,p:[0,lh/2-RT/2,0],g:gi,x:[0,1,0]});
   add({c:tb,len:il,ex:GZ,ey:GY,ez:GX,p:[0,-lh/2+RB/2,0],g:gi,x:[0,-1,0]});
   const hi=lh/2-RT,lo=-lh/2+RB;let panes=[[lo,hi]];
   if(tc){const RC=PH(tc),ym=z.tcy!=null?-lh/2+z.tcy:(lo+hi)/2;add({c:tc,len:il,ex:GZ,ey:GY,ez:GX,p:[0,ym,0],g:gi,x:[0,0,-.7]});panes=[[lo,ym-RC/2],[ym+RC/2,hi]];}
   panes.forEach(([u,v],j)=>enche(gi,'vidro',-lw/2+FM,lw/2-FM,u,v,{bag:z.bag},j));
   const esq=n===1?(z.dob!=='dir'):k===0;
   FL.push({n:n===1?'Folha de giro':(k===0?'Folha esquerda':'Folha direita'),ox:cx,oy:cy,z:0,fixa:false,dir:0,curso:0,gx:0,inf:'vidro',rot:{eixo:'y',px:esq?-lw/2:lw/2,pz:0,ang:esq?1.25:-1.25},el:{x0:a,x1:b,y0:ly0,y1:ly1,giro:esq?-1:1}});}}
 return {P,folhas:FL,sW:0,sH:0,step:0,Wi:W};
}

/* ponto da seção (a,b) no espaço */
function ponto(o,a,b,ox,oz,oy){const k=o.sc||[1,1];a*=k[0];b*=k[1];return [o.p[0]+a*o.ex[0]+b*o.ey[0]+(ox||0),o.p[1]+a*o.ex[1]+b*o.ey[1]+(oy||0),o.p[2]+a*o.ex[2]+b*o.ey[2]+(oz||0)];}
function pecasX(S,m,W,H){return m.zonas?gpecas(S,m,W,H):pecas(S,m,W,H);}
window.FCM={MONT,pecas:pecasX,ponto,secOf:(S,c)=>secOf(S,c)};
})();

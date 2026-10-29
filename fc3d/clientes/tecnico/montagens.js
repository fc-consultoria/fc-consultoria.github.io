/* Montagens das Linhas Suprema e Gold · Plataforma FC 3D Clientes
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
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.3,n:4,mont:'SU-086',marco:'SU-079',bag:'SU-103',ins:4},
   {tipo:'correr',h:'*',trav:'SU-006',edge:14.4,ovs:[30,0,30],db:'trav',contra:'SU-291',contra2:true,web0:7,contraC:'SU-291',contraCz:17.5,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-041',fixa:true},{n:'Folha móvel esquerda',z:17.5,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},
     {n:'Folha móvel direita',z:17.5,L:'SU-039',R:'SU-040',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-17.5,L:'SU-041',R:'SU-039',fixa:true}]}],
  vtx:'Folhas de correr: (L − 263,9) / 4 · peitoril: (L − 174,8) / 4 de largura por painel; alturas conforme o sistema de cálculo.'},
 jc4pa:{n:'Janela de correr 4 folhas com peitoril fixo (marco com contrafecho)',cd:'SUP JCR 402A',linha:'Linha Suprema',def:[2000,1500],dw:860,hd:620,
  fr:{t:'SU-026',b:'SU-029',s:'SU-028'},zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.3,n:4,mont:'SU-086',marco:'SU-079',bag:'SU-103',ins:4},
   {tipo:'correr',h:'*',trav:'SU-006',edge:35,ovs:[30,0,30],db:'trav',contra:'SU-291',contra2:true,web0:7,contraC:'SU-291',contraCz:17.5,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-041',fixa:true},{n:'Folha móvel esquerda',z:17.5,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},
     {n:'Folha móvel direita',z:17.5,L:'SU-039',R:'SU-040',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-17.5,L:'SU-041',R:'SU-039',fixa:true}]}],
  vtx:'Folhas de correr: (L − 295,7) / 4 · peitoril: (L − 206,5) / 4 de largura por painel; alturas conforme o sistema de cálculo.'},
 jvz3:{n:'Janela de correr 3 folhas com veneziana',cd:'SUP JVZ 300',linha:'Linha Suprema',def:[1800,1200],dw:680,
  fr:{t:'SU-010',b:'SU-011',sl:'SU-013',sr:'SU-014',s:'SU-013'},
  zonas:[{tipo:'correr',h:'*',edge:19,slots:2,
    folhas:[{n:'Folha de vidro',z:35,col:0,L:'SU-039',R:'SU-040',dir:1,curso:'col'},
     {n:'Folha veneziana ventilada',z:-35,col:0,L:'SU-068',R:'SU-070',dir:1,curso:'col',inf:'vzv',tt:'SU-187',tb:'SU-187'},
     {n:'Folha veneziana cega',z:0,col:1,L:'SU-069',R:'SU-068',dir:-1,curso:'col',inf:'vz',tt:'SU-187',tb:'SU-187'}]}],
  vtx:'Vidro: (L − 143,2) / 2 × (H − 134) · veneziana: (L − 121,2) / 2 de largura (simulação).'},
 jc4v:{n:'Janela de correr 4 folhas com veneziana',cd:'SUP JCR 204',linha:'Linha Suprema',def:[1400,1200],dw:600,
  fr:{t:'SU-121',b:'SU-122',s:'SU-123'},web:13,
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:0,
    camadas:[{folhas:[{n:'Folha de vidro interna',z:52.5,L:'SU-039',R:'SU-040',dir:1},{n:'Folha de vidro externa',z:17.5,L:'SU-041',R:'SU-039',dir:-1}]},
     {contra:'SU-291',contra2:true,folhas:[{n:'Folha veneziana interna',z:-17.5,L:'SU-068',R:'SU-070',dir:1,inf:'vzv',tt:'SU-187',tb:'SU-187'},{n:'Folha veneziana externa',z:-52.5,L:'SU-070',R:'SU-068',dir:-1,inf:'vzv',tt:'SU-187',tb:'SU-187'}]}]}],
  vtx:'Vidro: (L − 149,6) / 2 × (H − 134) · veneziana: (L − 123,6) / 2 de largura (simulação).'},
 jvz6:{n:'Janela de correr 6 folhas com veneziana',cd:'SUP JVZ 600',linha:'Linha Suprema',def:[2400,1200],dw:900,
  fr:{t:'SU-010',b:'SU-011',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,slots:4,ovs:[30,0,30],
    camadas:[{contra:'SU-291',contra2:true,web0:13,folhas:[{n:'Veneziana cega esquerda',z:0,col:0,L:'SU-068',R:'SU-069',fixa:true,inf:'vz',tt:'SU-187',tb:'SU-187'},{n:'Veneziana cega direita',z:0,col:3,L:'SU-069',R:'SU-068',fixa:true,inf:'vz',tt:'SU-187',tb:'SU-187'}]},
     {contraC:'SU-291',contraCz:35,folhas:[{n:'Folha de vidro esquerda',z:35,col:1,L:'SU-040',R:'SU-039',dir:-1,curso:'passo'},{n:'Folha de vidro direita',z:35,col:2,L:'SU-039',R:'SU-040',dir:1,curso:'passo'}]},
     {contraC:'SU-291',contraCz:-35,folhas:[{n:'Veneziana ventilada esquerda',z:-35,col:1,L:'SU-070',R:'SU-068',dir:-1,curso:'passo',inf:'vzv',tt:'SU-187',tb:'SU-187'},{n:'Veneziana ventilada direita',z:-35,col:2,L:'SU-068',R:'SU-070',dir:1,curso:'passo',inf:'vzv',tt:'SU-187',tb:'SU-187'}]}]}],
  vtx:'Vidro: (L − 239,9) / 4 × (H − 134) · veneziana: (L − 211,9) / 4 de largura (simulação).'},
 jvc7:{n:'Janela de correr 2 folhas com veneziana camarão',cd:'SUP JVC 701',linha:'Linha Suprema',def:[1400,1200],dw:620,
  fr:{t:'SU-024',b:'SU-025',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,contra:'SU-291',contra2:true,web0:13,jamb:'SU-071',jambz:-35,
    camadas:[{folhas:[{n:'Folha de vidro interna',z:35,L:'SU-039',R:'SU-040',dir:1},{n:'Folha de vidro externa',z:0,L:'SU-041',R:'SU-039',dir:-1}]},
     {ov:0,folhas:[{n:'Camarão 1',z:-35,L:'SU-072',R:'SU-074',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:-1,ang:1.2}},
      {n:'Camarão 2',z:-35,L:'SU-074',R:'SU-072',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:-1,ang:-1.2,ch:1}},
      {n:'Camarão 3',z:-35,L:'SU-074',R:'SU-074',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:1,ang:1.2,ch:-1}},
      {n:'Camarão 4',z:-35,L:'SU-074',R:'SU-072',inf:'vzv',tt:'SU-073',tb:'SU-073',cam:{lado:1,ang:-1.2}}]}]}],
  vtx:'Vidro: (L − 149,6) / 2 × (H − 146) · camarão: palhetas conforme a tabela do catálogo (simulação).'}
,
 pc2:{n:'Porta de correr 2 folhas',cd:'SUP PCR 200',linha:'Linha Suprema',def:[1600,2100],dw:560,hd:380,
  fr:{t:'SU-001',b:'SU-228',s:'SU-003'},
  zonas:[{tipo:'correr',h:'*',edge:14.4,
    folhas:[{n:'Folha interna',z:17.5,L:'SU-044',R:'SU-047',dir:1,tb:'SU-225',tc:'SU-227'},{n:'Folha externa',z:-17.5,L:'SU-049',R:'SU-039',dir:-1,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-143.2)/2,(H-212)/2],vtx:'(L − 143,2) / 2 × (H − 212) / 2',vpor:'por vidro (2 por folha)'},
 pc2a:{aj:'Conferir no catálogo o perfil CM-126 (contrafecho) antes de liberar',n:'Porta de correr 2 folhas (marco com contrafecho)',cd:'SUP PCR 200A',linha:'Linha Suprema',def:[1600,2100],dw:600,hd:380,
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
  zonas:[{tipo:'correr',h:'*',edge:14.4,ovs:[30,0,30],contraC:'SU-291',contraCz:17.5,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-049',fixa:true,tb:'SU-225',tc:'SU-227'},{n:'Folha móvel esquerda',z:17.5,L:'SU-047',R:'SU-044',dir:-1,curso:'passo',tb:'SU-225',tc:'SU-227'},
     {n:'Folha móvel direita',z:17.5,L:'SU-044',R:'SU-047',dir:1,curso:'passo',tb:'SU-225',tc:'SU-227'},{n:'Folha fixa direita',z:-17.5,L:'SU-049',R:'SU-039',fixa:true,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-257.5)/4,(H-212)/2],vtx:'(L − 257,5) / 4 × (H − 212) / 2',vpor:'por vidro (2 por folha)'},
 pc4a:{n:'Porta de correr 4 folhas (marco com contrafecho)',cd:'SUP PCR 400A',linha:'Linha Suprema',def:[2800,2100],dw:900,hd:380,
  fr:{t:'SU-026',b:'SU-228',s:'SU-028'},
  zonas:[{tipo:'correr',h:'*',edge:35,ovs:[30,0,30],contra:'SU-291',contra2:true,web0:7,contraC:'SU-291',contraCz:17.5,
    folhas:[{n:'Folha fixa esquerda',z:-17.5,L:'SU-039',R:'SU-049',fixa:true,tb:'SU-225',tc:'SU-227'},{n:'Folha móvel esquerda',z:17.5,L:'SU-047',R:'SU-044',dir:-1,curso:'passo',tb:'SU-225',tc:'SU-227'},
     {n:'Folha móvel direita',z:17.5,L:'SU-044',R:'SU-047',dir:1,curso:'passo',tb:'SU-225',tc:'SU-227'},{n:'Folha fixa direita',z:-17.5,L:'SU-049',R:'SU-039',fixa:true,tb:'SU-225',tc:'SU-227'}]}],
  vidro:(L,H)=>[(L-295.7)/4,(H-228.5)/2],vtx:'(L − 295,7) / 4 × (H − 228,5) / 2',vpor:'por vidro (2 por folha)'},
 pvz3:{n:'Porta de correr 3 folhas com veneziana',cd:'SUP PVZ 300',linha:'Linha Suprema',def:[1800,2100],dw:680,hd:380,
  fr:{t:'SU-010',b:'SU-230',s:'SU-012'},
  zonas:[{tipo:'correr',h:'*',edge:19,slots:2,
    camadas:[{folhas:[{n:'Folha de vidro',z:35,col:0,L:'SU-039',R:'SU-047',dir:1,curso:'col',tb:'SU-225',tc:'SU-227'}]},
     {contra:'SU-291',contraL:true,web0:13,folhas:[{n:'Folha veneziana ventilada',z:-35,col:0,L:'SU-068',R:'SU-070',dir:1,curso:'col',inf:'vzv',tt:'SU-187',tb:'SU-187',tb2:'SU-203'}]},
     {contra:'SU-291',web0:13,folhas:[{n:'Folha veneziana cega',z:0,col:1,L:'SU-069',R:'SU-068',dir:-1,curso:'col',inf:'vz',tt:'SU-187',tb:'SU-187',tb2:'SU-203'}]}]}],
  vtx:'Vidro: (L − 149,6) / 2 × (H − 212) / 2 · veneziana: (L − 123,6) / 2 de largura (simulação).'}
,
 pg1:{n:'Porta de giro 1 folha',cd:'SUP PGR 100',linha:'Linha Suprema',def:[900,2100],dw:420,hd:420,
  fr:{t:'SU-279',s:'SU-279'},web:0,
  zonas:[{tipo:'giro',h:'*',n:1,fm:'SU-111',tt:'SU-110',tb:'SU-225',tc:'SU-050'}],
  vtx:'Referências do catálogo: L − 166,5 · L − 172,5 · H − 243,5 · H − 255,5. Medida final no sistema de cálculo.'},
 pg2:{aj:'Incluir o batente interno 25-548 na montagem antes de liberar',n:'Porta de giro 2 folhas',cd:'SUP PGR 200',linha:'Linha Suprema',def:[1500,2100],dw:620,hd:420,
  fr:{t:'SU-279',s:'SU-279'},web:0,
  zonas:[{tipo:'giro',h:'*',n:2,fm:'SU-111',tt:'SU-110',tb:'SU-225',tc:'SU-050'}],
  vtx:'Referências do catálogo: L − 287 · L − 299 · H − 243,5 · H − 255,5. Medida final no sistema de cálculo.'},
 mx1:{n:'Janela maxim-ar 1 folha',cd:'SUP MAX 800',linha:'Linha Suprema',def:[800,700],dw:420,hd:360,
  fr:{t:'SU-079',b:'SU-079',s:'SU-079'},web:0,
  zonas:[{tipo:'max',h:'*',n:1,fm:'SU-200',ft:'SU-080',ping:'SU-276',gap:6}],
  vidro:(L,H)=>[L-98.4,H-98.4],vtx:'(L − 98,4) × (H − 98,4)',vpor:''},
 mx2p:{n:'Janela maxim-ar 2 folhas com peitoril fixo',cd:'SUP MAX 801',linha:'Linha Suprema',def:[1200,1400],dw:520,hd:620,
  fr:{t:'SU-079',b:'SU-079',s:'SU-079'},web:0,zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.4,n:2,mont:'SU-086',bag:'SU-102',inv:'SU-292',ins:12},
   {tipo:'max',h:'*',trav:'SU-085',n:2,mont:'SU-086',fm:'SU-200',ft:'SU-080',ping:'SU-276',gap:6}],
  vtx:'Folhas: (L − 183,8) / 2 de largura · peitoril: (L − 139) / 2 de largura; alturas conforme o sistema de cálculo.'},
 /* ===================== Linha Gold (catálogo técnico da linha Gold) ===================== */
 g_jc2:{n:'Janela de correr 2 folhas',cd:'GLD JC-2F',linha:'Linha Gold',def:[1200,1000],dw:520,hd:380,
  fr:{t:'LG-044',b:'LG-024',s:'LG-045',sflip:1,sin:14},web:0,
  zonas:[{tipo:'correr',h:'*',edge:22.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,lat:[{c:'LG-028',lado:-1,z:22.5},{c:'LG-028',lado:-1,z:-22.1},{c:'LG-028',lado:1,z:22.5},{c:'LG-028',lado:1,z:-22.1}],
    folhas:[{n:'Folha externa',z:-22.1,L:'LG-050',R:'LG-049',dir:1},{n:'Folha interna',z:22.5,L:'LG-048',R:'LG-050',dir:-1}]}],
  vtx:'Referências do catálogo: (L − 180) / 2 · (L − 192) / 2 · H − 51 · H − 139,6. Medida final no sistema de cálculo.'},
 g_jc4:{n:'Janela de correr 4 folhas',cd:'GLD JC-4F',linha:'Linha Gold',def:[2000,1200],dw:860,hd:380,
  fr:{t:'LG-044',b:'LG-024',s:'LG-045',sflip:1,sin:14},web:0,
  zonas:[{tipo:'correr',h:'*',edge:22.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,ovs:[55.9,25.4,55.9],lat:[{c:'LG-028',lado:-1,z:22.5},{c:'LG-028',lado:-1,z:-22.1},{c:'LG-028',lado:1,z:22.5},{c:'LG-028',lado:1,z:-22.1}],
    folhas:[{n:'Folha fixa esquerda',z:-22.1,L:'LG-050',R:'LG-049',fixa:true},{n:'Folha móvel esquerda',z:22.5,L:'LG-048',R:'LG-050',dir:-1,curso:'passo'},
     {n:'Folha móvel direita',z:22.5,L:'LG-051',R:'LG-048',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-22.1,L:'LG-049',R:'LG-050',fixa:true}]}],
  vtx:'Referências do catálogo: (L − 311,2) / 4 · (L − 335,2) / 4 · H − 51 · H − 139,6. Medida final no sistema de cálculo.'},
 g_jc6:{n:'Janela de correr 6 folhas',cd:'GLD JC-6F',linha:'Linha Gold',def:[2700,1200],dw:960,hd:380,
  fr:{t:'LG-062',b:'LG-066',s:'LG-064',sflip:1,sin:14},web:0,
  zonas:[{tipo:'correr',h:'*',edge:22.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,ovs:[55.9,55.9,25.4,55.9,55.9],lat:[{c:'LG-028',lado:-1,z:44.95},{c:'LG-028',lado:-1,z:0.35},{c:'LG-028',lado:-1,z:-44.25},{c:'LG-028',lado:1,z:44.95},{c:'LG-028',lado:1,z:0.35},{c:'LG-028',lado:1,z:-44.25}],
    folhas:[{n:'Folha fixa esquerda',z:-44.25,L:'LG-050',R:'LG-049',fixa:true},{n:'Folha 2',z:0.35,L:'LG-048',R:'LG-049',dir:-1},{n:'Folha 3',z:44.95,L:'LG-048',R:'LG-050',dir:-1},
     {n:'Folha 4',z:44.95,L:'LG-051',R:'LG-048',dir:1},{n:'Folha 5',z:0.35,L:'LG-049',R:'LG-048',dir:1},{n:'Folha fixa direita',z:-44.25,L:'LG-049',R:'LG-050',fixa:true}]}],
  vtx:'Referências do catálogo: (L − 403,4) / 6 · H − 139,6. Medida final no sistema de cálculo.'},
 g_jvz3:{n:'Janela de correr 3 folhas com veneziana',cd:'GLD JC-3FVZ',linha:'Linha Gold',def:[1600,1200],dw:640,hd:380,
  fr:{t:'LG-062',b:'LG-066',s:'LG-064',sflip:1,sin:14},web:0,
  zonas:[{tipo:'correr',h:'*',edge:22.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,slots:2,lat:[{c:'LG-028',lado:-1,z:44.95},{c:'LG-028',lado:-1,z:0.35},{c:'LG-028',lado:-1,z:-44.25},{c:'LG-028',lado:1,z:44.95},{c:'LG-028',lado:1,z:0.35},{c:'LG-028',lado:1,z:-44.25}],
    folhas:[{n:'Folha de vidro',z:44.95,col:1,L:'LG-048',R:'LG-050',dir:-1,curso:'col'},
     {n:'Folha veneziana cega',z:0.35,col:0,L:'LG-050',R:'LG-049',fixa:true,inf:'vz'},
     {n:'Folha veneziana ventilada',z:-44.25,col:1,L:'LG-049',R:'LG-050',dir:-1,curso:'col',inf:'vzv'}]}],
  vtx:'Referências do catálogo: vidro (L − 180) / 2 · (L − 192) / 2 × H − 51 · veneziana (L − 180) / 2 · (H − 177,3) / 2 · (H − 183,3) / 2. Medida final no sistema de cálculo.'},
 g_jcb:{n:'Janela de correr 2 folhas com bandeira móvel e fixa',cd:'GLD JC-2FBMF',linha:'Linha Gold',def:[1400,1600],dw:560,hd:640,
  fr:{t:'LG-003',b:'LG-024',s:'LG-002',sin:14},web:0,zH:0,
  zonas:[{tipo:'correr',h:'*',edge:25.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,dt:0,gt:-9.2,lat:[{c:'LG-028',lado:-1,z:22.5},{c:'LG-028',lado:-1,z:-22.1},{c:'LG-028',lado:1,z:22.5},{c:'LG-028',lado:1,z:-22.1}],
    folhas:[{n:'Folha externa',z:-22.1,L:'LG-050',R:'LG-049',dir:1},{n:'Folha interna',z:22.5,L:'LG-048',R:'LG-050',dir:-1}]},
   {tipo:'max',h:(W,H)=>H*0.28,trav:'LG-004',n:2,mont:'LG-076',marco:'LG-068',fm:'LG-085',ft:'LG-085',fixos:[1],bag:'BG-057',vins:-6,vz:-7.5,gap:4}],
  vtx:'Referências do catálogo: folhas (L − 186) / 2 · (L − 198) / 2 · J − 65 · J − 153,6 · bandeira (L − 180,5) / 4 · (L − 168,7) / 4 · B − 114,2 · B − 102,4. Medida final no sistema de cálculo.'},
 g_pc2pe:{aj:'Conferir a caixa e as guias da persiana (perfis MN), mostradas de forma simplificada',n:'Porta de correr 2 folhas com persiana de enrolar',cd:'GLD PC-2FPE',linha:'Linha Gold',def:[1800,2300],dw:620,hd:420,
  fr:{t:'LG-044',b:'LG-047',s:'LG-045',sflip:1,sin:14,extra:[{pos:'t',c:'MN-001',dy:210,z:-20},{pos:'l',c:'MN-055',dx:-20,z:-76,ext:210,dy:105},{pos:'r',c:'MN-055',dx:-20,z:-76,ext:210,dy:105}]},web:0,
  zonas:[{tipo:'correr',h:'*',edge:22.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,tt:'LG-006',tb:'LG-007',tc:'LG-055',lat:[{c:'LG-028',lado:-1,z:22.5},{c:'LG-028',lado:-1,z:-22.1},{c:'LG-028',lado:1,z:22.5},{c:'LG-028',lado:1,z:-22.1}],
    folhas:[{n:'Folha externa',z:-22.1,L:'LG-017',R:'LG-019',dir:1,fzL:1},{n:'Folha interna',z:22.5,L:'LG-021',R:'LG-017',dir:-1}]}],
  vtx:'Referências do catálogo: (L − 249,1) / 2 × (H − 224,1) por vão · persiana L − 125 · tubo L − 104,5. Persiana mostrada recolhida na caixa. Medida final no sistema de cálculo.'},
 g_pvz3:{aj:'Conferir o marco S1 (S1-343, S1-364, S1-305) e a travessa S1-317, mostrados aqui com perfis equivalentes da Gold',n:'Porta de correr 3 folhas com veneziana',cd:'GLD PC3F-VZ',linha:'Linha Gold',def:[1800,2200],dw:680,hd:420,
  fr:{t:'LG-062',b:'LG-066',s:'LG-064',sflip:1,sin:14},web:0,
  zonas:[{tipo:'correr',h:'*',edge:22.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,tt:'LG-006',tb:'LG-007',tc:'LG-055',slots:2,lat:[{c:'LG-028',lado:-1,z:44.95},{c:'LG-028',lado:-1,z:0.35},{c:'LG-028',lado:-1,z:-44.25},{c:'LG-028',lado:1,z:44.95},{c:'LG-028',lado:1,z:0.35},{c:'LG-028',lado:1,z:-44.25}],
    folhas:[{n:'Folha de vidro',z:44.95,col:1,L:'LG-021',R:'LG-017',dir:-1,curso:'col'},
     {n:'Folha veneziana cega',z:0.35,col:0,L:'LG-050',R:'LG-019',fixa:true,inf:'vz'},
     {n:'Folha veneziana ventilada',z:-44.25,col:1,L:'LG-019',R:'LG-050',dir:-1,curso:'col',inf:'vzv'}]}],
  vtx:'Referências do catálogo: (L − 180) / 2 · (L − 192) / 2 · veneziana (L − 184) / 2 · (H − 223,1) / 2 · (H − 235,1) / 2. Medida final no sistema de cálculo.'},
 g_pc4b:{n:'Porta de correr 4 folhas com bandeira móvel e fixa',cd:'GLD PC4F-BMF',linha:'Linha Gold',def:[3000,2700],dw:900,hd:780,
  fr:{t:'LG-003',b:'LG-047',s:'LG-002',sin:14},web:0,zH:0,
  zonas:[{tipo:'correr',h:'*',edge:25.6,ov:55.9,gt:27,gb:24,tt:'LG-006',tb:'LG-006',bag:'BG-057',vins:-6,vz:-7.5,tt:'LG-006',tb:'LG-007',tc:'LG-055',dt:0,gt:-9.2,ovs:[55.9,25.4,55.9],lat:[{c:'LG-028',lado:-1,z:22.5},{c:'LG-028',lado:-1,z:-22.1},{c:'LG-028',lado:1,z:22.5},{c:'LG-028',lado:1,z:-22.1}],
    folhas:[{n:'Folha fixa esquerda',z:-22.1,L:'LG-050',R:'LG-019',fixa:true},{n:'Folha móvel esquerda',z:22.5,L:'LG-021',R:'LG-017',dir:-1,curso:'passo'},
     {n:'Folha móvel direita',z:22.5,L:'LG-020',R:'LG-021',dir:1,curso:'passo'},{n:'Folha fixa direita',z:-22.1,L:'LG-019',R:'LG-050',fixa:true}]},
   {tipo:'max',h:(W,H)=>H*0.24,trav:'LG-004',n:4,mont:'LG-076',marco:'LG-068',fm:'LG-085',ft:'LG-085',fixos:[1,2],bag:'BG-057',vins:-6,vz:-7.5,gap:4}],
  vtx:'Referências do catálogo: folhas (L − 317,3) / 4 · (L − 341,3) / 4 · (P − 196,1) / 2 por vão · bandeira (L − 306) / 4 · (L − 180) / 4 · B − 114,2 · B − 102,4. Medida final no sistema de cálculo.'},
 g_pg1v:{n:'Porta de giro 1 folha com veneziana e vidro',cd:'GLD PGR1-FVZ',linha:'Linha Gold',def:[900,2100],dw:420,hd:420,
  fr:{t:'LG-056',s:'LG-056'},web:0,
  zonas:[{tipo:'giro',h:'*',n:1,fm:'LG-043',tt:'LG-058',tb:'LG-007',tc:'LG-055',infs:['vz','vidro'],gap:3.5,gb:10,bag:'BG-057',vins:-6,vz:-7.5}],
  vtx:'Referências do catálogo: L − 175 · vidro L − 181 · veneziana L − 176 · (H − 208,7) / 2 por vão · H − 41,9. Medida final no sistema de cálculo.'},
 g_pg2:{n:'Porta de giro 2 folhas',cd:'GLD PGR-2F',linha:'Linha Gold',def:[1500,2100],dw:620,hd:420,
  fr:{t:'LG-056',s:'LG-056'},web:0,
  zonas:[{tipo:'giro',h:'*',n:2,fm:'LG-043',tt:'LG-058',tb:'LG-007',tc:'LG-055',bat:'LG-016',gap:3.5,gb:10,bag:'BG-057',vins:-6,vz:-7.5}],
  vtx:'Referências do catálogo: (L − 301,5) / 2 · (L − 313,5) / 2 · (H − 214,7) / 2 por vão · H − 41,9. Medida final no sistema de cálculo.'},
 g_mxa:{n:'Janela maxim-ar com peitoril e painel fixo',cd:'GLD MAXP FIXO',linha:'Linha Gold',def:[2400,1600],dw:780,hd:520,
  fr:{t:'LG-082',b:'LG-083',s:'LG-083'},web:0,zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.38,n:3,mont:'LG-079',bag:'BG-057',ins:15,vins:-6,vz:-7.5},
   {tipo:'max',h:'*',trav:'LG-076',n:3,mont:'LG-079',fm:'LG-085',ft:'LG-085',fixos:[0,2],fins:15,ping:'LG-092',bag:'BG-057',vins:-6,vz:-7.5,gap:4}],
  vtx:'Vale para contramarco convencional (CC) e cadeirinha (CD). Medidas do vidro conforme o sistema de cálculo.'},
 g_mxb:{n:'Janela maxim-ar com peitoril fixo',cd:'GLD MAXP FIXO-CC',linha:'Linha Gold',def:[2000,1600],dw:720,hd:520,
  fr:{t:'LG-078',b:'LG-078',s:'LG-078'},web:0,zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.38,n:2,mont:'LG-075',bag:'BG-057',ins:15,vins:-6,vz:-7.5},
   {tipo:'max',h:'*',trav:'LG-076',n:2,mont:'LG-075',fm:'LG-085',ft:'LG-085',ping:'LG-092',bag:'BG-057',vins:-6,vz:-7.5,gap:4}],
  vtx:'Vale para contramarco convencional (CC) e cadeirinha (CD). Medidas do vidro conforme o sistema de cálculo.'},
 g_cju:{n:'Janela maxim-ar conjugada com fixo',cd:'GLD CJ-UNIT',linha:'Linha Gold',def:[1200,2600],dw:420,hd:900,
  fr:{t:'LG-082',b:'LG-088',s:'LG-086'},web:0,zH:1,
  zonas:[{tipo:'fixo',h:(W,H)=>H*0.34,n:1,bag:'BG-057',ins:15,vins:-6,vz:-7.5},
   {tipo:'max',h:'*',trav:'LG-079',n:1,fm:'LG-085',ft:'LG-085',ping:'LG-092',bag:'BG-057',vins:-6,vz:-7.5,gap:4},
   {tipo:'fixo',h:(W,H)=>H*0.16,trav:'LG-079',n:1,bag:'BG-057',ins:15,vins:-6,vz:-7.5}],
  vtx:'Um módulo da fachada: peitoril fixo, maxim-ar e bandeira fixa. Medidas do vidro conforme o sistema de cálculo.'},
 g_cjp:{n:'Porta de giro conjugada com painel fixo',cd:'GLD CJP-GIRO',linha:'Linha Gold',def:[1000,2800],dw:420,hd:640,
  fr:{t:'LG-082',s:'LG-086'},web:0,zH:0,
  zonas:[{tipo:'giro',h:'*',n:1,fm:'LG-043',tt:'LG-058',tb:'LG-007',tc:'LG-055',gap:3.5,gb:10,bag:'BG-057',vins:-6,vz:-7.5},
   {tipo:'fixo',h:(W,H)=>H*0.18,trav:'LG-079',n:1,bag:'BG-057',ins:15,vins:-6,vz:-7.5}],
  vtx:'Módulo da porta na fachada conjugada (porta de giro com bandeira fixa); os módulos de maxim-ar ao lado são os da CJ-UNIT. Medidas conforme o sistema de cálculo.'}
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
/* encontro com afastamento fixo em mm (perfis da Gold) */
const ENCZ={'LG-048':-5.1,'LG-049':5.1,'LG-019':5.1,'LG-021':17.4,'LG-017':13.5,'LG-020':12};
/* largura até o vidro (mm) quando a aba do montante passa por baixo do vidro (perfis da Gold) */
const VW={'LG-050':53.4,'LG-048':42,'LG-049':42,'LG-051':69.1,'LG-017':53.4,'LG-021':42,'LG-019':42,'LG-020':69.1,'LG-085':29.3,'LG-043':55.6};
/* altura até o vidro (mm) nas travessas da Gold */
const VT={'LG-006':44.3,'LG-007':88,'LG-058':45};
/* meia altura livre entre vidros na travessa central (mm) */
const VC={'LG-055':19.9};
const ENC={'SU-040':1,'SU-047':-1,'SU-041':-1,'SU-049':1,'SU-069':-1,'SU-070':-1};
const MIR={'SU-041':1,'SU-049':1,'SU-070':1,'SU-069':1,'LG-050':1,'LG-048':1,'LG-017':1,'LG-021':1};
const ALIAS={'US-285':'VZ-006'};
const TRM={'SU-085':1,'SU-086':1,'LG-079':1,'LG-080':1,'LG-075':1,'LG-076':1};/* travessa/montante do marco da maxim-ar: abas para os dois lados */
const mMul=c=>TRM[c]?{ex:GX,ey:GZ}:{ex:GZ,ey:GX},mTrv=c=>TRM[c]?{ex:GY,ey:GZ}:{ex:GZ,ey:GY};
function secOf(S,c){return S[c]||S[ALIAS[c]];}
function gpecas(S,m,W,H){
 const P=[],FL=[],add=o=>{P.push(o);return o;},PW=c=>secOf(S,c).w,PH=c=>secOf(S,c).h;
 const fr=m.fr,WEB=m.web==null?13:m.web,FS=fr.s?PH(fr.s):0,FT=PH(fr.t),FB=fr.b?PH(fr.b):0;
 const TL=W-2*WEB;
 /* marco */
 add({c:fr.t,len:TL,ex:GZ,ey:GY,ez:GX,p:[0,H/2-FT/2,0],g:-1,x:[0,1,0]});
 if(fr.b)add({c:fr.b,len:TL,ex:GZ,ey:GY,ez:GX,p:[0,-H/2+FB/2,0],g:-1,x:[0,-1,0]});
 const sl=fr.sl||fr.s,sr=fr.sr||fr.s,FSL=fr.sin||PH(sl),FSR=fr.sin||PH(sr),PSL=PH(sl),PSR=PH(sr);
 const sf=fr.sflip?-1:1;
 add({c:sl,len:H,ex:GZ,ey:sf>0?GX:GN(GX),ez:GY,p:[-W/2+FSL-PSL/2,0,0],g:-1,x:[-1,0,0]});
 add({c:sr,len:H,ex:GZ,ey:sf>0?GN(GX):GX,ez:GY,p:[W/2-FSR+PSR/2,0,0],g:-1,x:[1,0,0]});
 /* peças extras do marco: t = horizontal no topo, l/r = vertical nas laterais (em mm reais) */
 (fr.extra||[]).forEach(e=>{if(e.pos==='t')add({c:e.c,len:W+(e.ext||0),ex:e.fz?GN(GZ):GZ,ey:e.fy?GN(GY):GY,ez:GX,p:[0,H/2+(e.dy||0),e.z||0],g:-1,x:[0,.8,(e.z||0)<0?-.4:.4]});
  else{const sg=e.pos==='l'?-1:1;add({c:e.c,len:H+(e.ext||0),ex:e.fz?GN(GZ):GZ,ey:(sg<0)===!e.inv?GX:GN(GX),ez:GY,p:[sg*(W/2+(e.dx||0)),(e.dy||0),e.z||0],g:-1,x:[sg*.8,0,(e.z||0)<0?-.4:.4]});}});
 /* zonas de baixo para cima: altura de cada zona (mm reais) ou '*' para o restante */
 const Z=m.zonas,fixo=Z.reduce((a,z)=>a+(z.h==='*'?0:(typeof z.h==='function'?z.h(W,H):z.h)),0),trs=Z.slice(1).map(z=>z.trav?(TRM[z.trav]?PW(z.trav):PH(z.trav)):0).reduce((a,b)=>a+b,0);
 let yb=-H/2+(fr.b?FB:0);const ytop=H/2-FT;
 const livre=(ytop-yb)-fixo-trs;
 const zonas=[];
 Z.forEach((z,i)=>{
  let hz=z.h==='*'?livre:(typeof z.h==='function'?z.h(W,H):z.h);
  if(i>0&&z.trav){const th=TRM[z.trav]?PW(z.trav):PH(z.trav);add(Object.assign({c:z.trav,len:TL,ez:GX,p:[0,yb+th/2,0],g:-1,x:[0,i%2?.5:-.5,-.6]},TRM[z.trav]?mTrv(z.trav):{ex:GZ,ey:z.travInv?GN(GY):GY}));yb+=th;}
  zonas.push({z,y0:yb,y1:yb+hz});yb+=hz;});
 zonas.forEach((q,iz)=>{const z=q.z,nh=iz!==(m.zH==null?0:m.zH),n0=P.length;
  if(z.tipo==='correr')correr(q,nh);else if(z.tipo==='fixo')fixo2(q,nh);else if(z.tipo==='max')maxim(q,nh);else if(z.tipo==='giro')giro(q,nh);
  if(nh)for(let j=n0;j<P.length;j++)P[j].nh=1;});
 /* ----- folhas de correr ----- */
 function correr(q,nh){(q.z.camadas||[q.z]).forEach((c,i)=>correr1(q,Object.assign({},q.z,i>0?{contra:null,contraC:null}:{},c),nh));}
 function correr1(q,z,nh){const F=z.folhas,NS=z.slots||F.length,OV=z.ov==null?30:z.ov,SDS=25,edge=z.edge;
  const OVS=z.ovs||Array(NS-1).fill(OV),SOV=OVS.reduce((a,b)=>a+b,0),Wi=W-2*edge,sW=(Wi+SOV)/NS,step=sW-OV;
  const top=q.y1+(z.dt==null?(iz0(q)?FT:0):z.dt)-(z.gt==null?25:z.gt),bot=q.y0-(z.db==null?(fr.b&&q.y0<=-H/2+FB+1?FB:0):z.db==='trav'?PH(z.trav):z.db)+(z.gb==null?25:z.gb);
  const sH=top-bot,yc=(top+bot)/2;
  if(z.contra){const WO=z.web0||0,sc=[30/PW(z.contra),15/PH(z.contra)],hf=top-bot+50-(z.gt==null?0:0);
   if(!z.contraL)add({c:z.contra,len:hf,ex:GZ,ey:GN(GX),ez:GY,p:[W/2-FSR-7.5+WO,yc,F[F.length-1].z],g:-1,x:[.6,0,0],sc,nh});
   if(z.contra2||z.contraL)add({c:z.contra,len:hf,ex:GZ,ey:GX,ez:GY,p:[-W/2+FSL+7.5-WO,yc,F[0].z],g:-1,x:[-.6,0,0],sc,nh});}
  (z.lat||[]).forEach(e=>{const ew=PH(e.c),xs=e.lado<0?-W/2+FSL+(e.off||0)+ew/2:W/2-FSR-(e.off||0)-ew/2,ey=(e.lado<0)===!e.inv?GX:GN(GX);
   add({c:e.c,len:top-bot+(e.ext==null?50:e.ext),ex:e.fz?GN(GZ):GZ,ey,ez:GY,p:[xs,yc,e.z||0],g:-1,x:[e.lado*.6,0,(e.z||0)>0?.3:-.3],nh});});
  if(z.jamb){const JW=PW(z.jamb),JH=PH(z.jamb);[-1,1].forEach(sg=>add({c:z.jamb,len:top-bot,ex:GZ,ey:sg<0?GX:GN(GX),ez:GY,p:[sg*(W/2-(sg<0?FSL:FSR)-JH/2),yc,z.jambz||-35],g:-1,x:[sg*.6,0,-.4],nh}));}
  if(z.contraC){const sc=[30/PW(z.contraC),15/PH(z.contraC)];add({c:z.contraC,len:top-bot,ex:GZ,ey:GX,ez:GY,p:[z.cx||0,yc,z.contraCz!=null?z.contraCz:F[0].z],g:-1,x:[0,0,.7],sc,nh});}
  F.forEach((sd,i0)=>{const i=sd.col!=null?sd.col:i0,gi=FL.length,L=sd.L,R=sd.R,xL=-sW/2+(VW[L]||PW(L)),xR=sW/2-(VW[R]||PW(R)),xLc=-sW/2+PW(L)/2,xRc=sW/2-PW(R)/2,tx=(xL+xR)/2,tl=xR-xL+4;
   const mz=c=>ENCZ[c]!=null?ENCZ[c]:ENC[c]?ENC[c]*(SDS/2-PH(c)/2):0;
   add({c:L,len:sH,ex:!MIR[L]!==!sd.fzL?GN(GX):GX,ey:sd.fzL?GN(GZ):GZ,ez:GY,p:[xLc,yc,sd.fzL?-mz(L):mz(L)],g:gi,x:[-1,0,0],nh});
   add({c:R,len:sH,ex:!MIR[R]!==!sd.fzR?GX:GN(GX),ey:sd.fzR?GN(GZ):GZ,ez:GY,p:[xRc,yc,sd.fzR?-mz(R):mz(R)],g:gi,x:[1,0,0],nh});
   const tt=sd.tt||z.tt||'SU-053',tb=sd.tb||z.tb||'SU-053',RT=PH(tt),RB=PH(tb);
   add({c:tt,len:tl,ex:GZ,ey:GN(GY),ez:GX,p:[tx,yc+sH/2-RT/2,0],g:gi,x:[0,1,0]});
   add({c:tb,len:tl,ex:GZ,ey:GY,ez:GX,p:[tx,yc-sH/2+RB/2,0],g:gi,x:[0,-1,0]});
   let lo0=yc-sH/2+(VT[tb]||RB);if(sd.tb2){const R2=PH(sd.tb2);add({c:sd.tb2,len:tl,ex:GZ,ey:GY,ez:GX,p:[tx,lo0+R2/2,0],g:gi,x:[0,-.6,-.3]});lo0+=R2;}
   const hi=yc+sH/2-(VT[tt]||RT),lo=lo0;let panes=[[lo,hi]];
   const tcc=sd.tc||z.tc;if(tcc){const RC=VC[tcc]?2*VC[tcc]:PH(tcc),ym=sd.tcy!=null?lo+sd.tcy:(lo+hi)/2;add({c:tcc,len:tl,ex:GZ,ey:GY,ez:GX,p:[tx,ym,0],g:gi,x:[0,0,-.7]});panes=[[lo,ym-RC/2],[ym+RC/2,hi]];}
   panes.forEach(([a,b],k)=>enche(gi,sd.inf||'vidro',xL,xR,a,b,Object.assign({bag:z.bag,vins:z.vins,vz:z.vz},sd),k));
   const ox=-Wi/2+sW/2+i*sW-OVS.slice(0,i).reduce((a,b)=>a+b,0);
   const cam=sd.cam?{eixo:'y',px:sd.cam.lado<0?-sW/2:sW/2,pz:0,ang:sd.cam.ang,ch:sd.cam.ch?{w:sW,sx:sd.cam.ch}:null}:null;
   FL.push({n:sd.n,ox,z:sd.z,rot:cam,fixa:!!sd.fixa,dir:sd.cam?0:(sd.dir||0),curso:sd.cam?0:(sd.fixa?0:sd.curso==='passo'?step:sd.curso==='col'?sW-OV:(sd.dir>0?(NS-1-i)*step:i*step)),gx:tx,inf:sd.inf||'vidro',
    el:{x0:ox-sW/2,x1:ox+sW/2,y0:bot,y1:top}});});}
 function iz0(q){return q.y1>=ytop-1;}
 /* ----- preenchimento: vidro com baguete ou veneziana ----- */
 function enche(gi,inf,xL,xR,lo,hi,sd,k){const tx=(xL+xR)/2;
  if(inf==='vz'||inf==='vzv'){const c=inf==='vzv'?'US-285':'VZ-006',sh=PH(c),pas=sd.passo||64,n=Math.max(1,Math.floor((hi-lo-8)/pas)),y0=lo+(hi-lo-(n-1)*pas)/2;
   for(let j=0;j<n;j++)add({c,len:xR-xL,ex:GY,ey:GZ,ez:GX,p:[tx,y0+j*pas,0],g:gi,x:[0,0,-.5-(j%2)*.15],sc:[1,1]});
   add({vid:1,vz:1,w:xR-xL,h:hi-lo,d:3,p:[tx,(lo+hi)/2,0],g:gi,x:[0,0,0],nm:inf==='vzv'?'Palhetas da veneziana ventilada':'Palhetas da veneziana cega'});return;}
  const bag=sd.bag||'SU-102',OB=secOf(S,bag).offT||secOf(S,'SU-102').offT||[2.98,18.02],oz=OB[0],ins=sd.vins||7.45;
  const bxL=xL-ins,bxR=xR+ins,yT=hi+ins,yB=lo-ins,blen=bxR-bxL,bhl=yT-yB,yc2=(yT+yB)/2;
  add({vid:1,w:xR-xL+12,h:hi-lo+12,d:6,p:[tx,(lo+hi)/2,sd.vz==null?-3.5:sd.vz],g:gi,x:[0,0,0],nm:'Vidro 6 mm'});
  add({c:bag,len:blen,ex:GZ,ey:GN(GY),ez:GX,p:[tx,yT,oz],g:gi,x:[0,.45,.4]});
  add({c:bag,len:blen,ex:GZ,ey:GY,ez:GX,p:[tx,yB,oz],g:gi,x:[0,-.45,.4]});
  add({c:bag,len:bhl,ex:GZ,ey:GX,ez:GY,p:[bxL,yc2,oz],g:gi,x:[-.45,0,.4]});
  add({c:bag,len:bhl,ex:GZ,ey:GN(GX),ez:GY,p:[bxR,yc2,oz],g:gi,x:[.45,0,.4]});}
 /* ----- zona fixa (peitoril ou bandeira fixa): painéis de vidro com baguete, divididos por montantes ----- */
 function fixo2(q,nh){const z=q.z,n=z.n||1,mc=z.mont,MW=mc?(TRM[mc]?PW(mc):PH(mc)):0,x0=-W/2+FSL+(z.folga||0),x1=W/2-FSR-(z.folga||0),pw=(x1-x0-(n-1)*MW)/n;
  const gi=FL.length;FL.push({n:'Fixo',ox:0,z:0,fixa:true,dir:0,curso:0,gx:0,inf:'vidro',fixo:1,el:{x0,x1,y0:q.y0,y1:q.y1,n,pw,MW}});
  for(let k=0;k<n;k++){const a=x0+k*(pw+MW),b=a+pw;
   if(k>0&&mc)add(Object.assign({c:mc,len:q.y1-q.y0,ez:GY,p:[a-MW/2,(q.y0+q.y1)/2,0],g:gi,x:[0,0,-.6],nh},mMul(mc)));
   let ia=a,ib=b,iy0=q.y0,iy1=q.y1;
   if(z.marco){const mc2=z.marco,MH=PH(mc2),ow=b-a,oh=q.y1-q.y0;
    add({c:mc2,len:ow,ex:GZ,ey:GN(GY),ez:GX,p:[(a+b)/2,q.y1-MH/2,0],g:gi,x:[0,.5,-.4]});
    add({c:mc2,len:ow,ex:GZ,ey:GY,ez:GX,p:[(a+b)/2,q.y0+MH/2,0],g:gi,x:[0,-.5,-.4]});
    add({c:mc2,len:oh-2*MH,ex:GZ,ey:GX,ez:GY,p:[a+MH/2,(q.y0+q.y1)/2,0],g:gi,x:[-.5,0,-.4],nh});
    add({c:mc2,len:oh-2*MH,ex:GZ,ey:GN(GX),ez:GY,p:[b-MH/2,(q.y0+q.y1)/2,0],g:gi,x:[.5,0,-.4],nh});ia+=MH;ib-=MH;iy0+=MH;iy1-=MH;}
   const ins=z.ins||10;enche(gi,'vidro',ia+ins,ib-ins,iy0+ins,iy1-ins,{bag:z.bag},k);
   if(z.inv){const c3=z.inv,IW=PH(c3);add({c:c3,len:iy1-iy0,ex:GZ,ey:GX,ez:GY,p:[ia+IW/2,(iy0+iy1)/2,-8],g:gi,x:[-.4,0,-.5],nh});add({c:c3,len:iy1-iy0,ex:GZ,ey:GN(GX),ez:GY,p:[ib-IW/2,(iy0+iy1)/2,-8],g:gi,x:[.4,0,-.5],nh});}}}
 /* ----- maxim-ar: marco da zona + folhas que giram no topo, projetando para fora ----- */
 function maxim(q,nh){const z=q.z,n=z.n||1,mc=z.mont||'SU-085',MW=mc?(TRM[mc]?PW(mc):PH(mc)):0,x0=-W/2+FSL,x1=W/2-FSR,pw=(x1-x0-(n-1)*MW)/n,fm=z.fm||'SU-200',ft=z.ft||'SU-200',FM=PW(fm),FT2=PW(ft)===PW(fm)&&ft===fm?FM:PH(ft);
  for(let k=0;k<n;k++){let a=x0+k*(pw+MW),b=a+pw;
   if(k>0)add(Object.assign({c:mc,len:q.y1-q.y0,ez:GY,p:[a-MW/2,(q.y0+q.y1)/2,0],g:-1,x:[0,0,-.6],nh},mMul(mc)));
   if(z.fixos&&z.fixos.indexOf(k)>=0){const gi=FL.length,fi=z.fins==null?10:z.fins;FL.push({n:'Fixo',ox:0,z:0,fixa:true,dir:0,curso:0,gx:0,inf:'vidro',fixo:1,el:{x0:a,x1:b,y0:q.y0,y1:q.y1,n:1,pw:b-a,MW:0}});
    enche(gi,'vidro',a+fi,b-fi,q.y0+fi,q.y1-fi,{bag:z.fbag||z.bag,vins:z.vins,vz:z.vz},k);continue;}
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
   else{const TH=PH(ft);add({c:ft,len:lw-2*FM+4,ex:GZ,ey:GN(GY),ez:GX,p:[0,ly1-TH/2-cy,0],g:gi,x:[0,1,0]});add({c:fm,len:lw-2*FM+4,ex:GY,ey:GZ,ez:GX,p:[0,ly0+FM/2-cy,0],g:gi,x:[0,-1,0]});}
   const tv=ft===fm?FM:PH(ft);
   const FV=VW[fm]||FM,TV=VW[ft]||tv;enche(gi,'vidro',lx0+FV-cx,lx1-FV-cx,ly0+FV-cy,ly1-TV-cy,{bag:z.bag,vins:z.vins,vz:z.vz},k);
   if(z.ping)add({c:z.ping,len:pw,ex:GZ,ey:GY,ez:GX,p:[(a+b)/2,q.y1-PH(z.ping)/2,-(PW(fr.t)/2)+PW(z.ping)/2],g:-1,x:[0,.4,-.8]});
   FL.push({n:'Folha maxim-ar',ox:cx,oy:cy,z:zf,fixa:false,dir:0,curso:0,gx:0,inf:'vidro',rot:{eixo:'x',py:lh/2,pz:0,ang:0.55},el:{x0:lx0,x1:lx1,y0:ly0,y1:ly1,max:1}});}}
 /* ----- giro: folhas com dobradiça lateral, abrindo para dentro ----- */
 function giro(q,nh){const z=q.z,n=z.n||1,x0=-W/2+FSL,x1=W/2-FSR,fg=z.gap==null?3:z.gap,pw=(x1-x0-(n-1)*fg-2*fg)/n,fm=z.fm||'SU-111',FM=PW(fm);
  for(let k=0;k<n;k++){const a=x0+fg+k*(pw+fg),b=a+pw,ly0=q.y0+(z.gb==null?10:z.gb),ly1=q.y1-fg,cx=(a+b)/2,cy=(ly0+ly1)/2,lw=b-a,lh=ly1-ly0,gi=FL.length;
   add({c:fm,len:lh,ex:GX,ey:GZ,ez:GY,p:[-lw/2+FM/2,0,0],g:gi,x:[-1,0,0],nh});
   add({c:fm,len:lh,ex:GN(GX),ey:GZ,ez:GY,p:[lw/2-FM/2,0,0],g:gi,x:[1,0,0],nh});
   const tt=z.tt||'SU-110',tb=z.tb||'SU-225',tc=z.tc,RT=VT[tt]||PH(tt),RB=VT[tb]||PH(tb),il=lw-2*FM+4,FV=VW[fm]||FM;
   add({c:tt,len:il,ex:GZ,ey:GN(GY),ez:GX,p:[0,lh/2-PH(tt)/2,0],g:gi,x:[0,1,0]});
   add({c:tb,len:il,ex:GZ,ey:GY,ez:GX,p:[0,-lh/2+PH(tb)/2,0],g:gi,x:[0,-1,0]});
   const hi=lh/2-RT,lo=-lh/2+RB;let panes=[[lo,hi]];
   if(tc){const RC=VC[tc]?2*VC[tc]:PH(tc),ym=z.tcy!=null?-lh/2+z.tcy:(lo+hi)/2;add({c:tc,len:il,ex:GZ,ey:GY,ez:GX,p:[0,ym,0],g:gi,x:[0,0,-.7]});panes=[[lo,ym-RC/2],[ym+RC/2,hi]];}
   panes.forEach(([u,v],j)=>enche(gi,(z.infs&&z.infs[j])||'vidro',-lw/2+FV,lw/2-FV,u,v,{bag:z.bag,vins:z.vins,vz:z.vz},j));
   if(z.bat&&n===2&&k===0){const BW=PW(z.bat);add({c:z.bat,len:lh,ex:GX,ey:GZ,ez:GY,p:[b+fg/2,cy,z.batz||0],g:-1,x:[0,0,-.6],nh});}
   const esq=n===1?(z.dob!=='dir'):k===0;
   FL.push({n:n===1?'Folha de giro':(k===0?'Folha esquerda':'Folha direita'),ox:cx,oy:cy,z:0,fixa:false,dir:0,curso:0,gx:0,inf:'vidro',rot:{eixo:'y',px:esq?-lw/2:lw/2,pz:0,ang:esq?1.25:-1.25},el:{x0:a,x1:b,y0:ly0,y1:ly1,giro:esq?-1:1}});}}
 return {P,folhas:FL,sW:0,sH:0,step:0,Wi:W};
}

/* ponto da seção (a,b) no espaço */
function ponto(o,a,b,ox,oz,oy){const k=o.sc||[1,1];a*=k[0];b*=k[1];return [o.p[0]+a*o.ex[0]+b*o.ey[0]+(ox||0),o.p[1]+a*o.ex[1]+b*o.ey[1]+(oy||0),o.p[2]+a*o.ex[2]+b*o.ey[2]+(oz||0)];}
/* ---------- Ajuste técnico das montagens (só a Matriz grava; vale para todas as empresas) ----------
   Chave no banco: tipologia 'mont:<montagem>', peça '<código>#<n>' (só aquela) ou '<código>#*' (todas daquele perfil na montagem).
   Valores: dx (para a direita), dy (para cima), dz (para o lado interno) em mm; rz = giro da seção (graus); ry = 180 espelha; oculto. */
Object.keys(MONT).forEach(k=>{MONT[k].k=k;});
/* Linha Gold em conferência: oculta para os clientes até a FC liberar (troque para true ao liberar) */
const GOLD_LIBERADA=false;
Object.values(MONT).forEach(m=>{if(m.linha==='Linha Gold'&&!GOLD_LIBERADA&&!m.aj)m.aj='Linha Gold em conferência pela FC; liberar depois da revisão';});
let AJ={};
function ajDe(m,id,c){return AJ['mont:'+m.k+'|'+id]||AJ['mont:'+m.k+'|'+c+'#*']||null;}
function aplicaAj(m,R){const cnt={};R.P.forEach(o=>{if(o.vid)return;cnt[o.c]=(cnt[o.c]||0)+1;o.id=o.c+'#'+cnt[o.c];
  const a=ajDe(m,o.id,o.c);if(!a)return;const [dx,dy,dz,rx,ry,rz,oc]=a.map((v,i)=>i<6?+v||0:!!v);
  if(oc)o.oc=1;
  if(ry%360===180)o.ex=o.ex.map(v=>-v);
  if(rz%360){const t=rz*Math.PI/180,c=Math.cos(t),s=Math.sin(t),ex=o.ex,ey=o.ey;o.ex=ex.map((v,i)=>c*v+s*ey[i]);o.ey=ey.map((v,i)=>-s*ex[i]+c*v);}
  if(dx||dy||dz)o.p=[o.p[0]+dx,o.p[1]+dy,o.p[2]+dz];});return R;}
function pecasX(S,m,W,H){return aplicaAj(m,m.zonas?gpecas(S,m,W,H):pecas(S,m,W,H));}
function carregarAjustes(){let tk=null;try{tk=localStorage.getItem('pfc-token');}catch(_){}
 if(!tk)return Promise.resolve();
 return fetch('https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_ajustes_3d_ler',{method:'POST',headers:{apikey:'sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs','Content-Type':'application/json'},body:JSON.stringify({p_token:tk})})
  .then(r=>r.ok?r.json():{}).then(j=>{AJ={};Object.keys(j||{}).forEach(k=>{if(k.indexOf('mont:')===0)AJ[k]=j[k];});}).catch(()=>{});}
function salvarAjuste(m,peca,v){let tk=null;try{tk=localStorage.getItem('pfc-token');}catch(_){}
 const k='mont:'+m.k+'|'+peca,zero=!v||(!v[0]&&!v[1]&&!v[2]&&!v[4]&&!v[5]&&!v[6]);
 return fetch('https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_ajuste_3d_salvar',{method:'POST',headers:{apikey:'sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs','Content-Type':'application/json'},
  body:JSON.stringify({p_token:tk,p_tipologia:'mont:'+m.k,p_peca:peca,p_dx:zero?0:v[0],p_dy:zero?0:v[1],p_dz:zero?0:v[2],p_rx:0,p_ry:zero?0:v[4],p_rz:zero?0:v[5],p_oculto:zero?false:!!v[6]})})
  .then(async r=>{const j=await r.json().catch(()=>null);if(!r.ok)throw new Error(j&&j.message||'Não foi possível salvar.');if(zero)delete AJ[k];else AJ[k]=v.slice();return j;});}
window.FCM={MONT,pecas:pecasX,ponto,secOf:(S,c)=>secOf(S,c),carregarAjustes,salvarAjuste,ajuste:(m,peca)=>AJ['mont:'+m.k+'|'+peca]||null,ajusteDe:(m,id,c)=>ajDe(m,id,c),
 previa:(m,peca,v)=>{const k='mont:'+m.k+'|'+peca;if(v)AJ[k]=v.slice();else delete AJ[k];}};
})();

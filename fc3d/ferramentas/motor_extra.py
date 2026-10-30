"""Partes novas do motor do Mostruário 3D (Orientativo) para a Plataforma FC 3D Clientes.
Aplicado pelo gera-mostruario.py depois de tipologia_fixa; também pode ser rodado direto:
    python3 motor_extra.py <caminho do mostruario/index.html>
O que acrescenta:
 1) Porta de giro com 2 folhas (SUP PGR 200): uma folha por item de TY.sashes, dobradiças nos dois lados,
    a segunda folha abre espelhada; puxador na folha ativa, batente e fecho na passiva.
 2) Maxim-ar com 2 folhas lado a lado (TY.nmax=2): coluna SU-086 no lugar dos dois marcos do meio.
 3) Peitoril fixo embaixo (TY.peit): monta a parte de cima (correr ou maxim-ar) com a altura A, sobe e
    completa o peitoril: marcos laterais na altura total, travessa, perfil de baixo, colunas, vidros e baguetes.
Cada troca confere que o trecho original existe (assert), para não aplicar em cima de um motor diferente."""
import sys

MARCA = '/* [motor-extra v1] */'


def troca(s, velho, novo, n=1):
    c = s.count(velho)
    assert c == n, f'motor_extra: esperado {n}x, achei {c}x: {velho[:80]!r}'
    return s.replace(velho, novo)


GIRO_NOVO = r'''    const xo=W/2-FW-GP,yt=H/2-FW-GP,yb=-H/2+.010,lh=yt-yb,ly=(yt+yb)/2;
    const ZL=PH('SU-279')/2-PH('SU-111')/2; /* face interna da folha alinhada com a do marco */
    const h110=PH('SU-110'),h225=PH('SU-225'),h50=PH('SU-050'),ym=yb+1.0-.05,hy=yb+1.05;
    const NG=TY.sashes.length,GC=.002,LWD=NG>1?xo-GC:2*xo; /* 2 folhas: 4 mm entre elas (catálogo SUP PGR 200) */
    TY.sashes.forEach((sa,si)=>{
      const P=sa.id,k='folha'+P,g=new THREE.Group(),sd=(NG>1&&si===1)?-1:1; /* sd=1: dobradiças em -x; sd=-1: em +x (espelhada) */
      const PV=sd>0?-xo:xo,xl=sd>0?-xo:GC,xr=sd>0?(NG>1?-GC:xo):xo,cx=(xl+xr)/2,at=x=>x-PV,f0=si===0;
      RK=P+'-L';prof(g,'SU-111',lh,neg(X),Z,Y,at(xl+.019),ly,0,k,'SU-111',M.al,f0);
      RK=P+'-R';prof(g,'SU-111',lh,X,Z,neg(Y),at(xr-.019),ly,0,k,'SU-111',M.al,false);
      const iw=(xr-xl)-.1;
      RK=P+'-top';prof(g,'SU-110',iw,Z,Y,neg(X),at(cx),yt-h110/2,0,k,'SU-110',M.al,f0);
      RK=P+'-bot';prof(g,'SU-225',iw,Z,Y,X,at(cx),yb+h225/2,0,k,'SU-225',M.al,f0);
      RK=P+'-mid';prof(g,'SU-050',iw,Z,Y,X,at(cx),ym,0,k,'SU-050',M.al,f0);
      RK=P+'-glass';
      [[ym+h50/2,yt-h110],[yb+h225,ym-h50/2]].forEach(([lo,hi],pi)=>{
        box(g,iw,hi-lo+.012,.006,at(cx),(lo+hi)/2,-.003,'vidro','SU-102',M.gl,false);
        const BW2=.012,bz=.007,bw=iw,bh=hi-lo;
        prof(g,'SU-102',bw,Z,neg(Y),X,at(cx),hi-BW2/2,bz,'baguete','SU-102',M.al,false,BW2,.014);
        prof(g,'SU-102',bw,Z,Y,X,at(cx),lo+BW2/2,bz,'baguete','SU-102',M.al,false,BW2,.014);
        prof(g,'SU-102',bh-2*BW2,Z,X,Y,at(cx-iw/2+BW2/2),(lo+hi)/2,bz,'baguete','SU-102',M.al,false,BW2,.014);
        prof(g,'SU-102',bh-2*BW2,Z,neg(X),Y,at(cx+iw/2-BW2/2),(lo+hi)/2,bz,'baguete','SU-102',M.al,false,BW2,.014);
        if(pi===1&&f0){const an=new THREE.Object3D();an.position.set(at(cx),lo+.06,bz+.01);an.userData={zone:'SU-102',lbl:true,part:'baguete',vert:false};g.add(an);labelObjs.push(an);}
      });
      if(f0){/* folha ativa: fechadura e maçanetas no lado do encontro (ou do marco, na porta de 1 folha) */
        RK=P+'-R';cb(g,'FRA-822',-.016,.195,.02,at(xr-.032),hy,0,true);
        [1,-1].forEach((sz,i)=>{cb(g,'MAC-927',-.03,.24,.004,at(xr-.045),hy-.02,sz*.016,i===0);
          cb(g,'MAC-927',-.12,.018,.02,at(xr-.045-.05),hy+.06,sz*.03,false);});
        if(NG===1){RK='F-right';cb(group,'CON-295',-.006,.148,.02,W/2-FW-.001,hy,ZL,true);}
      }else{/* folha passiva: batente 25-548 no encontro, pelo lado externo, e fecho FEC-338 (folha de montagem SUP PGR 200) */
        if(TY.batente){RK=P+'-L';prof(g,TY.batente,lh-.02,X,neg(Z),Y,at(xl),ly,-PH('SU-111')/2,k,TY.batente,M.al,true);}
        if(TY.fechoP){RK=P+'-L';cb(g,TY.fechoP,.016,.12,.014,at(xl+.032),hy,0,true);}
      }
      [yt-.2,ly,yb+.25].forEach((y,i)=>{RK=sd>0?'F-left':'F-right';cb(group,'DOB-840',sd*.014,.111,.016,sd*(-W/2+FW+GP/2),y,ZL+.0126+.006,i===0);});
      g.position.set(PV,0,ZL);group.add(g);
      SASH.push({id:P,g,i:si,x0:PV,y0:0,z:ZL,dir:1,fixed:false,travel:0,swing:true,swd:sd,n:sa.n});
    });
    geo={Wi:2*xo,sW:LWD,Hi:lh,yc:ly,step:0,NS:NG,yT:ym};'''

PEIT = r'''  /* [motor-extra v1] peças removidas/refeitas depois de montadas (marcos do meio, laterais na altura total) */
  const exKill=f=>{EX=EX.filter(x=>{if(!f(x))return true;const o=x.o;if(o.parent)o.parent.remove(o);
    [zoneMeshes,profMeshes,labelObjs].forEach(a=>{const i=a.indexOf(o);if(i>=0)a.splice(i,1);});
    const u=o.userData||{};if(u.code&&u.cap&&o.geometry){o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox,e=u.cap.ez;
      LEN[u.code]=Math.max(0,(LEN[u.code]||0)-Math.abs((bb.max.x-bb.min.x)*e.x+(bb.max.y-bb.min.y)*e.y+(bb.max.z-bb.min.z)*e.z));}
    return false;});};
  /* [motor-extra v1] peitoril fixo: a parte de cima (correr ou maxim-ar) é montada com a altura A = H − C,
     sobe C/2 e o peitoril (altura C) é completado embaixo, conforme a folha de montagem do catálogo */
  if(TYPOS[S.typo].peit&&!build.__in){
    const TP=TYPOS[S.typo],PE=TP.peit,h0=S.h,Cmm=Math.max(250,Math.min(h0-400,Math.round(PE.h(S.w,S.h)))),C=Cmm/1000;
    build.__in=true;S.h=h0-Cmm;try{build();}finally{build.__in=false;S.h=h0;}
    const dy=C/2;
    group.children.forEach(o=>o.position.y+=dy);
    EX.forEach(x=>{if(x.o.parent===group)x.b.y+=dy;});
    SASH.forEach(s=>{s.y0=(s.y0||0)+dy;});
    geo.yc=(geo.yc||0)+dy;
    /* marcos laterais inteiros (altura H) */
    const lat=group.children.filter(o=>{const u=o.userData||{};return u.part==='marco'&&u.vert&&u.zone===PE.s&&u.cap&&Math.abs(o.position.x)>W/2-.08;});
    lat.forEach(o=>{const u=o.userData,c=u.cap,lb=labelObjs.includes(o),ek=EX.find(e=>e.o===o);RK=ek?ek.k:(o.position.x<0?'F-left':'F-right');
      const px=o.position.x,pz=o.position.z;exKill(x=>x.o===o);prof(group,u.code,H,c.ex,c.ey,c.ez,px,0,pz,'marco',u.zone,M.al,lb);});
    if(PE.kill)exKill(x=>x.o.userData&&x.o.userData.part==='marco'&&PE.kill.includes(x.k));
    const yb=-H/2,yt=yb+C,FL=PH(PE.s),Wi=W-2*FL,pp='peitoril';
    /* travessa entre a parte de cima e o peitoril (quando não é o próprio trilho de baixo da parte de cima) */
    let ytop=yt;
    if(PE.trav){const TH=PW(PE.trav);RK='F-mid';prof(group,PE.trav,Wi,Y,Z,X,0,yt,0,pp,PE.trav,M.al,true);ytop=yt-TH/2;}
    /* perfil de baixo */
    const HB=PH(PE.b);RK='F-bot';
    if(PE.b===PE.s)prof(group,PE.b,Wi,Z,Y,X,0,yb+HB/2,0,pp,PE.b,M.al,true);
    else prof(group,PE.b,W-2*(TP.web||.013),Z,Y,X,0,yb+HB/2,0,pp,PE.b,M.al,true);
    /* perfil de vidro no contorno (laterais, baixo e cima) */
    const AW=PE.ad?PH(PE.ad):0,y0=yb+HB,y1=ytop;
    if(PE.ad){
      RK='Z-left';prof(group,PE.ad,y1-y0,Z,X,Y,-Wi/2+AW/2,(y0+y1)/2,0,pp,PE.ad,M.al,true);
      RK='Z-right';prof(group,PE.ad,y1-y0,Z,neg(X),Y,Wi/2-AW/2,(y0+y1)/2,0,pp,PE.ad,M.al,false);
      RK='Z-bot';prof(group,PE.ad,Wi-2*AW,Z,Y,X,0,y0+AW/2,0,pp,PE.ad,M.al,false);
      RK='Z-top';prof(group,PE.ad,Wi-2*AW,Z,neg(Y),X,0,y1-AW/2,0,pp,PE.ad,M.al,false);}
    /* colunas entre os vidros */
    const n=PE.n||1,MW=PE.mont?PW(PE.mont):0,pw=(Wi-(n-1)*MW)/n,ga=y0+AW,gb=y1-AW;
    for(let i=1;i<n;i++){RK='Z-mid';prof(group,PE.mont,gb-ga,X,Z,Y,-Wi/2+i*pw+(i-.5)*MW,(ga+gb)/2,0,pp,PE.mont,M.al,i===1);}
    /* vidros e baguetes (lado interno) */
    RK='Z-glass';
    for(let i=0;i<n;i++){
      const xa=-Wi/2+i*(pw+MW)+(i===0?AW:0),xb=-Wi/2+i*(pw+MW)+pw-(i===n-1?AW:0),cx=(xa+xb)/2,ow=xb-xa,oh=gb-ga,cy=(ga+gb)/2;
      box(group,ow+.012,oh+.012,.006,cx,cy,0,'vidro',PE.bag,M.gl,false);
      const BW2=.012,bz=.01;
      prof(group,PE.bag,ow,Z,neg(Y),X,cx,gb-BW2/2,bz,'baguete',PE.bag,M.al,false,BW2,.014);
      prof(group,PE.bag,ow,Z,Y,X,cx,ga+BW2/2,bz,'baguete',PE.bag,M.al,false,BW2,.014);
      prof(group,PE.bag,oh-2*BW2,Z,X,Y,xa+BW2/2,cy,bz,'baguete',PE.bag,M.al,false,BW2,.014);
      prof(group,PE.bag,oh-2*BW2,Z,neg(X),Y,xb-BW2/2,cy,bz,'baguete',PE.bag,M.al,false,BW2,.014);
      if(i===0){const an=new THREE.Object3D();an.position.set(cx,ga+.05,bz+.01);an.userData={zone:PE.bag,lbl:true,part:'baguete',vert:false};group.add(an);labelObjs.push(an);}
    }
    geo.yT=yt;
    RK=null;CUR_P=desmPreset();applyEx();placeSashes();
    capList.forEach(({cm,m})=>m.remove(cm));capList=[];
    CUTDEF=S.cut?cutDef(S.cut,W,H):null;
    if(CUTDEF){const capM=new THREE.MeshStandardMaterial({color:0x3d4a54,roughness:.6,metalness:.2,side:THREE.DoubleSide});
      profMeshes.forEach(m=>{const c=m.userData.cap;const ax=CUTDEF.axis;if(Math.abs(c.ez[ax])<.9)return;
        const gg=new THREE.ShapeGeometry(c.shapes);gg.applyMatrix4(new THREE.Matrix4().makeBasis(c.ex,c.ey,c.ez));
        const cm=new THREE.Mesh(gg,capM);m.add(cm);capList.push({cm,m,ax});});updateCaps();}
    renderer.clippingPlanes=CUTDEF?[CUTDEF.plane]:[];
    xray();buildLabels();
    const [pgw,pgh]=PE.glass(W,C),dl=document.getElementById('dims');
    document.getElementById('dimtag').textContent=`${S.w} × ${S.h} mm`;
    dl.innerHTML=dl.innerHTML.replace(`${S.w} × ${h0-Cmm}`,`${S.w} × ${h0}`)+
      `<dt>Parte de cima (${PE.la||'A'})</dt><dd>${h0-Cmm}</dd><dt>Peitoril fixo (${PE.lc||'C'})</dt><dd>${Cmm}</dd>`+
      `<dt>Vidro do peitoril ${PE.gtxt}</dt><dd>${Math.round(pgw*1000)} × ${Math.round(pgh*1000)}</dd>`;
    return;
  }
'''


def aplicar(s):
    if MARCA in s:
        return s
    # 1) porta de giro com N folhas
    a = s.find("    const xo=W/2-FW-GP,yt=H/2-FW-GP,yb=-H/2+.010")
    fim = "geo={Wi:2*xo,sW:2*xo,Hi:lh,yc:ly,step:0,NS:1,yT:ym};"
    b = s.find(fim)
    assert 0 < a < b and b - a < 4000, 'motor_extra: trecho do giro não encontrado'
    s = s[:a] + GIRO_NOVO + s[b + len(fim):]
    s = troca(s, "<dt>Folha</dt><dd>${Math.round(2*xo*1000)} × ${Math.round(lh*1000)}</dd>",
              "<dt>Folha</dt><dd>${Math.round(LWD*1000)} × ${Math.round(lh*1000)}</dd>")
    s = troca(s, "if(s.swing){s.g.position.set(s.x0,0,s.z);s.g.rotation.y=-1.35*(S.open[s.id]||0)/100;return;}",
              "if(s.swing){s.g.position.set(s.x0,0,s.z);s.g.rotation.y=-(s.swd||1)*1.35*(S.open[s.id]||0)/100;return;}")
    s = troca(s, "cA=TYk==='giro'?0:SASH[0]?SASH[0].x0:0;",
              "cA=TYk==='giro'?(SASH.length>1?SASH[0].x0/2:0):SASH[0]?SASH[0].x0:0;")
    s = troca(s, "cA=TYPOS[S.typo].kind==='giro'?0:SASH[0]?SASH[0].x0:0;",
              "cA=TYPOS[S.typo].kind==='giro'?(SASH.length>1?SASH[0].x0/2:0):SASH[0]?SASH[0].x0:0;")
    s = troca(s, "function meetX(i){return ", "function meetX(i){if(TYPOS[S.typo].kind==='giro')return 0;return ")
    s = troca(s, "  CUTS.push({k:'dir',n:'Lateral direita'",
              "  if(TY.kind==='giro'&&n>1)CUTS.push({k:'m0',n:'Encontro das folhas',d:TY.meetd||'Encontro das duas folhas.'});\n"
              "  if(TY.kind==='maxim'&&TY.nmax===2)CUTS.push({k:'m0',n:'Coluna central',d:TY.meetd||'Coluna entre as duas folhas.'});\n"
              "  CUTS.push({k:'dir',n:'Lateral direita'")
    s = troca(s, "TY.kind==='giro'?[{k:'trav',n:'Travessa central',d:TY.cutd.trav}]:[]",
              "TY.kind==='giro'?[{k:'trav',n:'Travessa central',d:TY.cutd.trav}]:TY.peit?[{k:'trav',n:'Travessa do peitoril',d:TY.cutd.trav}]:[]")
    # cortes horizontais e pontos "+" no meio da parte de cima, quando há peitoril
    s = troca(s, "y0=TYPOS[S.typo].band?geo.yc:", "y0=(TYPOS[S.typo].band||TYPOS[S.typo].peit)?geo.yc:")
    s = troca(s, "const yh=TYPOS[S.typo].band?geo.yc:", "const yh=(TYPOS[S.typo].band||TYPOS[S.typo].peit)?geo.yc:")
    # 2) maxim-ar com 2 folhas lado a lado
    s = troca(s, "    maximUnit(0,0,W,H,'A','Folha maxim-ar',true,'FEC-009');",
              "    if(TY.nmax===2){const uw=W/2;maximUnit(-uw/2,0,uw,H,'A','Folha maxim-ar esquerda',true,'FEC-009','M1');maximUnit(uw/2,0,uw,H,'B','Folha maxim-ar direita',false,'FEC-009','M2');\n"
              "      /* coluna SU-086 no lugar dos dois marcos do meio */\n"
              "      exKill(x=>x.o.userData&&x.o.userData.part==='marco'&&(x.k==='M1-right'||x.k==='M2-left'));\n"
              "      const SB=PH('SU-079'),MO=TY.mont||'SU-086';RK='F-mid';prof(group,MO,H-2*SB,X,Z,Y,0,0,0,'marco',MO,M.al,true);}\n"
              "    else maximUnit(0,0,W,H,'A','Folha maxim-ar',true,'FEC-009');")
    s = troca(s, "const xo=TY.mx?W/2-.002:W/2-MB-.0082,yo=",
              "const UWm=TY.nmax===2?W/2:W,xo=TY.mx?UWm/2-.002:UWm/2-MB-.0082,yo=")
    s = troca(s, "geo={Wi:W-2*MB,sW:2*xo,Hi:H-2*MB,yc:0,step:0,NS:1};",
              "geo={Wi:W-2*MB,sW:2*xo,Hi:H-2*MB,yc:0,step:0,NS:SASH.length};")
    # 3) peitoril fixo (entra antes da montagem de cada tipo)
    s = troca(s, "  /* Montagem conforme o catálogo Suprema (cortes da tipologia). +Z = lado interno */",
              PEIT + "  /* Montagem conforme o catálogo Suprema (cortes da tipologia). +Z = lado interno */")
    return s


if __name__ == '__main__':
    p = sys.argv[1]
    t = open(p, encoding='utf-8').read()
    open(p, 'w', encoding='utf-8').write(aplicar(t))
    print('ok')

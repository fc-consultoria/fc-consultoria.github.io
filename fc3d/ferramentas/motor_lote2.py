"""Partes do motor do Mostruário 3D para as tipologias do Lote 2 em diante (Plataforma FC 3D Clientes).
Aplicado pelo gera-mostruario.py depois de motor_extra; também pode ser rodado direto:
    python3 motor_lote2.py <caminho do mostruario/index.html>
O que acrescenta (as tipologias ficam em mostruario/tipologias-lote2.js):
 1) Marco lateral diferente em cada lado (fr.sl / fr.sr), ex.: SUP JVZ 300 com SU-013 e SU-014.
 2) Recobrimento NYL-357 nas portas de correr novas (TY.n357).
 3) Porta de giro com perfis por tipologia (TY.gp: marco, montante, travessas, baguete, fechadura) e
    veneziana no vão de baixo (folha com vb:true) - portas de giro Gold.
 4) Maxim-ar sem marco próprio (opção nomar) para ficar dentro de um quadro, e regra de vidro própria (TY.mxglass).
 5) Zonas: quadro com zonas empilhadas (TY.kind='zonas': peitoril fixo, maxim-ar, bandeira fixa) e
    correr com bandeira em cima (TY.zt / ztf / ztz) ou zona embaixo (TY.zb); gancho TY.post para peças extras
    (veneziana camarão).
 6) Correção: sorteio de peças da Orientação em Sistema não trava quando a tipologia tem menos de 5 opções.
Cada troca confere que o trecho original existe (assert)."""
import sys

MARCA = '/* [motor-lote2 v1] */'


def troca(s, velho, novo, n=1):
    c = s.count(velho)
    assert c == n, f'motor_lote2: esperado {n}x, achei {c}x: {velho[:80]!r}'
    return s.replace(velho, novo)


HELPERS = "  /* ===== Zonas (peitoril, bandeira, maxim-ar e fixos em quadro): barras retas com a seção do catálogo =====\n     Face visível = maior medida da seção; profundidade = menor. Usado pelas montagens do Lote 2 em diante. */\n  const FACE=c=>Math.max(PW(c),PH(c));\n  /* lado: 'r' (direita) e 't' (topo) espelham a seção para a face interna ficar sempre voltada para o vão */\n  function barV(c,len,x,y,z,key,lbl,part,lado){RK=key;const a=lado==='r'?neg(X):X;return PW(c)>=PH(c)?prof(group,c,len,a,Z,Y,x,y,z,part||'marco',c,M.al,lbl):prof(group,c,len,Z,a,Y,x,y,z,part||'marco',c,M.al,lbl);}\n  function barH(c,len,x,y,z,key,lbl,part,lado){RK=key;const a=lado==='t'?neg(Y):Y;return PW(c)>=PH(c)?prof(group,c,len,a,Z,X,x,y,z,part||'marco',c,M.al,lbl):prof(group,c,len,Z,a,X,x,y,z,part||'marco',c,M.al,lbl);}\n  function pane(x0,x1,y0,y1,bag,key,lbl){const w=x1-x0,h=y1-y0,cx=(x0+x1)/2,cy=(y0+y1)/2,BW2=.012,bz=.008;RK=key;\n    box(group,w+.012,h+.012,.006,cx,cy,-.003,'vidro',bag,M.gl,false);\n    prof(group,bag,w,Z,neg(Y),X,cx,y1-BW2/2,bz,'baguete',bag,M.al,lbl,BW2,.014);\n    prof(group,bag,w,Z,Y,X,cx,y0+BW2/2,bz,'baguete',bag,M.al,false,BW2,.014);\n    prof(group,bag,h-2*BW2,Z,X,Y,x0+BW2/2,cy,bz,'baguete',bag,M.al,false,BW2,.014);\n    prof(group,bag,h-2*BW2,Z,neg(X),Y,x1-BW2/2,cy,bz,'baguete',bag,M.al,false,BW2,.014);}\n  let ZS=0;\n  function zoneFill(z,x0,x1,y0,y1,kz,first,list){\n    const TYz=TYPOS[S.typo],GQz=TYz.line==='gold';\n    if(z.marco){const mf=FACE(z.marco);\n      barV(z.marco,y1-y0,x0+mf/2,(y0+y1)/2,0,kz+'-left',first);barV(z.marco,y1-y0,x1-mf/2,(y0+y1)/2,0,kz+'-right',false,'marco','r');\n      barH(z.marco,x1-x0-2*mf,(x0+x1)/2,y1-mf/2,0,kz+'-top',false,'marco','t');barH(z.marco,x1-x0-2*mf,(x0+x1)/2,y0+mf/2,0,kz+'-bot',false);\n      x0+=mf;x1-=mf;y0+=mf;y1-=mf;}\n    const n=z.n||1,mf=z.mont?FACE(z.mont):0,cw=(x1-x0-(n-1)*mf)/n,bag=z.bag||(GQz?'BG-057':'SU-102');\n    for(let i=0;i<n;i++){const a=x0+i*(cw+mf),b=a+cw;\n      if(i>0&&z.mont)barV(z.mont,y1-y0,a-mf/2,(y0+y1)/2,0,kz+'-mid',first&&i===1);\n      const fixo=z.tipo!=='max'||(z.fixos||[]).includes(i);\n      if(fixo)pane(a,b,y0,y1,bag,kz+'-glass',first&&i===0);\n      else{const L=list||TYz.sashes,sd=L[ZS]||{id:'Z'+ZS,n:'Maxim-ar'};ZS++;const mb=GQz?PW((TYz.mx||{}).mar||'LG-068'):.020;\n        maximUnit((a+b)/2,(y0+y1)/2,cw+2*mb,(y1-y0)+2*mb,sd.id,sd.n,ZS===1,'FEC-009',kz+'M'+i,{nomar:true});}\n    }\n  }\n"
KIND = "  if(TY.kind==='zonas'){\n    /* Quadro com zonas empilhadas de baixo para cima (peitoril fixo, maxim-ar, bandeira fixa) */\n    const F=TY.fr;ZS=0;\n    const fT=FACE(F.t),fB=FACE(F.b),fS=FACE(F.s);\n    barV(F.s,H,-W/2+fS/2,0,0,'F-left',true);barV(F.s,H,W/2-fS/2,0,0,'F-right',false,'marco','r');\n    barH(F.t,W-2*fS,0,H/2-fT/2,0,'F-top',true,'marco','t');barH(F.b,W-2*fS,0,-H/2+fB/2,0,'F-bot',F.b!==F.t);\n    const x0=-W/2+fS,x1=W/2-fS,yTop=H/2-fT,ZL=TY.zonas;let y=-H/2+fB;\n    const trs=ZL.reduce((a,z,i)=>a+(i>0&&z.trav?FACE(z.trav):0),0),fx=ZL.reduce((a,z)=>a+(z.h==='*'?0:z.h(W,H)),0),free=Math.max(.15,yTop-y-trs-fx);\n    ZL.forEach((z,i)=>{if(i>0&&z.trav){const tf=FACE(z.trav);barH(z.trav,x1-x0,0,y+tf/2,0,'F-mid',i===1);y+=tf;}\n      const hz=z.h==='*'?free:z.h(W,H);zoneFill(z,x0,x1,y,y+hz,'Z'+i,i===0);if(z.tipo==='max')geo.yc=y+hz/2;y+=hz;});\n    SASH.forEach(x=>x.sx=x.x0);\n    geo={Wi:x1-x0,sW:(x1-x0),Hi:yTop+H/2-fB,yc:geo.yc||0,step:0,NS:Math.max(1,SASH.length)};\n    CUR_P=desmPreset();applyEx();placeSashes();\n    CUTDEF=S.cut?cutDef(S.cut,W,H):null;\n    if(CUTDEF){const capM=new THREE.MeshStandardMaterial({color:0x3d4a54,roughness:.6,metalness:.2,side:THREE.DoubleSide});\n      profMeshes.forEach(m=>{const c=m.userData.cap;const ax=CUTDEF.axis;if(Math.abs(c.ez[ax])<.9)return;\n        const gg=new THREE.ShapeGeometry(c.shapes);gg.applyMatrix4(new THREE.Matrix4().makeBasis(c.ex,c.ey,c.ez));\n        const cm=new THREE.Mesh(gg,capM);m.add(cm);capList.push({cm,m,ax});});updateCaps();}\n    renderer.clippingPlanes=CUTDEF?[CUTDEF.plane]:[];\n    xray();\n    buildLabels();\n    document.getElementById('dimtag').textContent=`${S.w} × ${S.h} mm`;\n    document.getElementById('dims').innerHTML=`<dt>Vão (L × A)</dt><dd>${S.w} × ${S.h}</dd><dt>Maxim-ar</dt><dd>${SASH.length} folha${SASH.length>1?'s':''}</dd><dt>Vidros</dt><dd>${TY.gtxt}</dd>`;\n    return;\n  }\n"
PRE = '  /* Correr com zona embaixo (peitoril fixo) ou em cima (bandeira): o correr é montado na altura que sobra e depois sobe/desce */\n  const HF=H,ZB=TY.zb?TY.zb(W,HF):0,ZT=TY.zt?TY.zt(W,HF):0,N0=group.children.length;ZS=0;\n  if(ZB||ZT)H=HF-ZB-ZT;\n'
POST = "  if(TY.post)TY.post({group,prof,box,cb,M,X,Y,Z,neg,PW,PH,W,H,SY,sH,Wi,EDGE,setRK:k=>{RK=k;},reg});\n  if(ZB||ZT){const dy=(ZB-ZT)/2,sg=new Set(SASH.map(s=>s.g));\n    group.children.slice(N0).forEach(c=>{if(sg.has(c))return;c.position.y+=dy;const e=EX.find(x=>x.o===c);if(e)e.b.y+=dy;});\n    SASH.forEach(s=>{s.y0=(s.y0||0)+dy;});geo.yc+=dy;if(geo.yT!=null)geo.yT+=dy;\n    H=HF;const FSz=PH(fr.s);\n    const ext=(yc,len,i)=>{RK='F-left';prof(group,fr.sl||fr.s,len,Z,X,Y,-W/2+FSz/2,yc,0,'marco',fr.sl||fr.s,M.al,false);RK='F-right';prof(group,fr.sr||fr.s,len,Z,neg(X),Y,W/2-FSz/2,yc,0,'marco',fr.sr||fr.s,M.al,false);};\n    if(ZB){const fz=TY.zbf||fr.b,f=FACE(fz);ext(-H/2+ZB/2,ZB);barH(fz,W-2*FSz,0,-H/2+f/2,0,'F-bot',true);\n      zoneFill(TY.zbz,-W/2+FSz,W/2-FSz,-H/2+f,-H/2+ZB,'B0',true,TY.zsash);}\n    if(ZT){const fz=TY.ztf||fr.t,f=FACE(fz);ext(H/2-ZT/2,ZT);barH(fz,W-2*FSz,0,H/2-f/2,0,'F-top',true,'marco','t');\n      zoneFill(TY.ztz,-W/2+FSz,W/2-FSz,H/2-ZT,H/2-f,'B1',true,TY.zsash);}\n  }"


def aplicar(s):
    if MARCA in s:
        return s
    # 1) marco lateral por lado
    s = troca(s, "RK='F-left';prof(group,fr.s,H+PBX,", "RK='F-left';prof(group,fr.sl||fr.s,H+PBX,")
    s = troca(s, "RK='F-right';prof(group,fr.s,H+PBX,", "RK='F-right';prof(group,fr.sr||fr.s,H+PBX,")
    s = troca(s, "ROTL?-LZ:LZ,'marco',fr.s,M.al,true);", "ROTL?-LZ:LZ,'marco',fr.sl||fr.s,M.al,true);")
    s = troca(s, "LROT?neg(Y):Y,W/2-FS/2,PBX/2,LZ,'marco',fr.s,M.al,true);", "LROT?neg(Y):Y,W/2-FS/2,PBX/2,LZ,'marco',fr.sr||fr.s,M.al,true);")
    s = troca(s, "d:`Marco lateral ${fr.s} com o montante ${ss[0].L}", "d:`Marco lateral ${fr.sl||fr.s} com o montante ${ss[0].L}")
    s = troca(s, "d:`Marco lateral ${fr.s} com o montante ${ss[n-1].R}", "d:`Marco lateral ${fr.sr||fr.s} com o montante ${ss[n-1].R}")
    # 2) NYL-357 nas portas novas
    s = troca(s, "if(S.typo==='pcr200'||S.typo==='pvz300'){", "if(S.typo==='pcr200'||S.typo==='pvz300'||TY.n357){")
    # 3) porta de giro com perfis por tipologia
    a = s.find("  if(TY.kind==='giro'){")
    b = s.find("  if(TY.kind==='maxim'){", a)
    assert a > 0 and b > a
    g = s[a:b]
    for k, v in [("'SU-279'", 'GPP.mar'), ("'SU-111'", 'GPP.mont'), ("'SU-110'", 'GPP.top'), ("'SU-225'", 'GPP.bot'),
                 ("'SU-050'", 'GPP.mid'), ("'SU-102'", 'GPP.bag'), ("'FRA-822'", 'GPP.fra')]:
        g = g.replace(k, v)
    g = g.replace("  if(TY.kind==='giro'){", "  if(TY.kind==='giro'){" + MARCA + "\n    const GPP=Object.assign({mar:'SU-279',mont:'SU-111',top:'SU-110',bot:'SU-225',mid:'SU-050',bag:'SU-102',fra:'FRA-822'},TY.gp||{}),GPO=PW(GPP.mont)/2-.012;", 1)
    g = troca(g, "at(xl+.019)", "at(xl+GPO)")
    g = troca(g, "at(xr-.019)", "at(xr-GPO)")
    g = troca(g, "const iw=(xr-xl)-.1;", "const iw=(xr-xl)-2*(PW(GPP.mont)-.012);")
    g = troca(g, "[[ym+h50/2,yt-h110],[yb+h225,ym-h50/2]].forEach(([lo,hi],pi)=>{",
              "[[ym+h50/2,yt-h110],[yb+h225,ym-h50/2]].forEach(([lo,hi],pi)=>{\n        if(sa.vb&&pi===1){const slm=new THREE.MeshStandardMaterial({color:CORES[S.cor],metalness:.4,roughness:.45,side:THREE.DoubleSide});\n          for(let y=lo+.02;y<hi-.01;y+=.04){const sl=new THREE.Mesh(new THREE.BoxGeometry(iw,.042,.0015),slm);sl.rotation.x=-.75;sl.position.set(at(cx),y,0);sl.userData={zone:null,part:'vidro'};g.add(sl);reg(sl);}\n          return;}")
    s = s[:a] + g + s[b:]
    # 4) maxim-ar sem marco próprio + regra de vidro própria
    s = troca(s, "function maximUnit(cx,cy,UW,UH,P,nm,first,fech,keyF){", "function maximUnit(cx,cy,UW,UH,P,nm,first,fech,keyF,opt){\n    const NOM=!!(opt&&opt.nomar);")
    gq = """      RK=kF+'-left';prof(group,MC,UH,neg(X),Z,Y,cx-UW/2+MW/2,cy,0,'marco',MC,M.al,first);
      RK=kF+'-right';prof(group,MC,UH,X,Z,Y,cx+UW/2-MW/2,cy,0,'marco',MC,M.al,first);
      RK=kF+'-top';prof(group,MC,UW-2*MW,Y,Z,X,cx,cy+UH/2-MW/2,0,'marco',MC,M.al,first);
      RK=kF+'-bot';prof(group,MC,UW-2*MW,neg(Y),Z,X,cx,cy-UH/2+MW/2,0,'marco',MC,M.al,first);"""
    s = troca(s, gq, "      if(!NOM){\n" + gq + "}")
    su = """    RK=kF+'-left';prof(group,MC,UH,Z,X,Y,cx-UW/2+SB/2,cy,0,'marco',MC,M.al,first);
    RK=kF+'-right';prof(group,MC,UH,Z,neg(X),Y,cx+UW/2-SB/2,cy,0,'marco',MC,M.al,first);
    RK=kF+'-top';prof(group,MC,UW-2*MB,Z,neg(Y),X,cx,cy+UH/2-SB/2,0,'marco',MC,M.al,first);
    RK=kF+'-bot';prof(group,MC,UW-2*MB,Z,Y,X,cx,cy-UH/2+SB/2,0,'marco',MC,M.al,first);"""
    s = troca(s, su, "    if(!NOM){\n" + su + "}")
    gu = """    RK=kF+'-top';cb(group,Q.gua,UW-2*MB,.0047,.0078,cx,cy+UH/2-MB-.0024,.004,first);
    RK=kF+'-bot';cb(group,Q.gua,UW-2*MB,.0047,.0078,cx,cy-UH/2+MB+.0024,.004,false);
    [-1,1].forEach(sx=>{RK=sx<0?kF+'-left':kF+'-right';cb(group,Q.gua,.0047,UH-2*MB,.0078,cx+sx*(UW/2-MB-.0024),cy,.004,false);});"""
    s = troca(s, gu, "    if(!NOM){\n" + gu + "}")
    s = troca(s, "const [gw,gh]=TYPOS[S.typo].glass(UW,UH),gz=-FH/2+.002+.004;", "const [gw,gh]=(TYPOS[S.typo].mxglass||TYPOS[S.typo].glass)(UW,UH),gz=-FH/2+.002+.004;")
    # 5) zonas
    s = troca(s, "const M=mats(),W=S.w/1000,H=S.h/1000,test=S.mode==='test';", "const M=mats(),W=S.w/1000,test=S.mode==='test';let H=S.h/1000;")
    m1 = "  /* Montagem conforme o catálogo Suprema (cortes da tipologia). +Z = lado interno */\n"
    s = troca(s, m1, HELPERS + m1)
    s = troca(s, "  if(TY.kind==='maxim'){\n", KIND + "  if(TY.kind==='maxim'){\n")
    m3 = "  const FT=PH(fr.t),FB=PH(fr.b),FS=PH(fr.s),GLD=TY.line==='gold';OV=TY.ov||.03;\n"
    s = troca(s, m3, PRE + m3)
    m4 = "\n  RK=null;\n  CUR_P=desmPreset();applyEx();  CUR_P=desmPreset();applyEx();cemPost();"
    s = troca(s, m4, "\n" + POST + m4)
    # 6) sorteio da Orientação em Sistema
    s = troca(s, "while(pick.length<5){", "while(pick.length<Math.min(5,ks.length)){")
    return s


if __name__ == '__main__':
    p = sys.argv[1]
    t = open(p, encoding='utf-8').read()
    open(p, 'w', encoding='utf-8').write(aplicar(t))
    print('ok', p)

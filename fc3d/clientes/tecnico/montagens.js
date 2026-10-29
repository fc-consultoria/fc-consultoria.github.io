/* Montagens da Linha FC Residencial · Plataforma FC 3D Clientes
   Uma definição por montagem gera o 3D e os cortes do desenho técnico (seções em escala real, mm).
   © FC Consultoria em Esquadria · criação da FC, uso exclusivo de empresas licenciadas. */
(function(){
const MONT={
 jc2:{n:'Janela de correr 2 folhas',cd:'FC JC2 · 01',linha:'Linha FC Residencial',def:[1200,1000],
  fr:{t:'FC-101',b:'FC-102',s:'FC-103'},edge:14.4,rotLat:true,
  folhas:[{n:'Folha interna',z:17.5,L:'FC-104',R:'FC-105',dir:1},{n:'Folha externa',z:-17.5,L:'FC-106',R:'FC-104',dir:-1}],
  vidro:(L,H)=>[(L-143.2)/2,H-134],vtx:'(L − 143,2) / 2 × (H − 134)',dw:460},
 jc3:{n:'Janela de correr 3 folhas',cd:'FC JC3 · 01',linha:'Linha FC Residencial',def:[1800,1200],
  fr:{t:'FC-111',b:'FC-112',s:'FC-113'},edge:19,contra:'FC-114',contra2:true,web0:13,
  folhas:[{n:'Folha interna',z:35,L:'FC-104',R:'FC-105',dir:1},{n:'Folha central',z:0,L:'FC-106',R:'FC-105',dir:1},{n:'Folha fixa',z:-35,L:'FC-106',R:'FC-104',fixa:true}],
  vidro:(L,H)=>[(L-174)/3,H-134],vtx:'(L − 174) / 3 × (H − 134)',dw:660}
};
/* montante que espelha o lado (perfil de encontro da folha externa) */
const ESPELHA={'FC-106':1};
const SDS=25,OV=30,WEB=13;
/* afastamento do perfil de encontro em relação ao plano da folha */
function mz(S,c){if(c==='FC-105')return SDS/2-S[c].h/2;if(c==='FC-106')return -SDS/2+S[c].h/2;return 0;}

/* Gera as peças: cada perfil é a seção (a,b) levada aos eixos ex, ey e extrudada em ez, centrada em p.
   Peças de folha usam coordenadas locais; a folha fica em (ox, 0, z). */
function pecas(S,m,W,H){
 const X=[1,0,0],Y=[0,1,0],Z=[0,0,1],N=v=>v.map(x=>-x);
 const PW=c=>S[c].w,PH=c=>S[c].h,fr=m.fr,FT=PH(fr.t),FB=PH(fr.b),FS=PH(fr.s);
 const P=[],add=(o)=>{P.push(o);return o;};
 const TL=W-2*WEB,Hf=H-FT-FB,yc=(FB-FT)/2;
 add({c:fr.t,len:TL,ex:Z,ey:Y,ez:X,p:[0,H/2-FT/2,0],g:-1,x:[0,1,0]});
 add({c:fr.b,len:TL,ex:Z,ey:Y,ez:X,p:[0,-H/2+FB/2,0],g:-1,x:[0,-1,0]});
 const rot=!!m.rotLat;
 add({c:fr.s,len:H,ex:Z,ey:X,ez:rot?N(Y):Y,p:[-W/2+FS/2,0,0],g:-1,x:[-1,0,0]});
 add({c:fr.s,len:H,ex:rot?N(Z):Z,ey:N(X),ez:rot?N(Y):Y,p:[W/2-FS/2,0,0],g:-1,x:[1,0,0]});
 const F=m.folhas,NS=F.length;
 if(m.contra){const WO=m.web0||0,sc=[30/PW(m.contra),15/PH(m.contra)];
  add({c:m.contra,len:Hf,ex:Z,ey:N(X),ez:Y,p:[W/2-FS-7.5+WO,yc,F[NS-1].z],g:-1,x:[.6,0,0],sc});
  if(m.contra2)add({c:m.contra,len:Hf,ex:Z,ey:X,ez:Y,p:[-W/2+FS+7.5-WO,yc,F[0].z],g:-1,x:[-.6,0,0],sc});}
 const Wi=W-2*m.edge,sW=(Wi+(NS-1)*OV)/NS,step=sW-OV,sH=H-50,[gw]=m.vidro(W,H);
 const OB=S['FC-108'].offT||[2.98,18.02],oz=OB[0],inset=PH('FC-107')/2-OB[1],RW=PH('FC-107');
 const folhas=F.map((sd,i)=>{
  const L=sd.L,R=sd.R,xL=-sW/2+PW(L),xR=sW/2-PW(R),xLc=-sW/2+PW(L)/2,xRc=sW/2-PW(R)/2,tx=(xL+xR)/2,tl=xR-xL+4;
  const lfz=rot&&i===0&&L==='FC-104';
  add({c:L,len:sH,ex:ESPELHA[L]?N(X):X,ey:lfz?N(Z):Z,ez:Y,p:[xLc,0,lfz?-mz(S,L):mz(S,L)],g:i,x:[-1,0,0]});
  add({c:R,len:sH,ex:ESPELHA[R]?X:N(X),ey:Z,ez:Y,p:[xRc,0,mz(S,R)],g:i,x:[1,0,0]});
  add({c:'FC-107',len:tl,ex:Z,ey:N(Y),ez:X,p:[tx,sH/2-RW/2,0],g:i,x:[0,1,0]});
  add({c:'FC-107',len:tl,ex:Z,ey:Y,ez:X,p:[tx,-sH/2+RW/2,0],g:i,x:[0,-1,0]});
  const hi=sH/2-RW,lo=-sH/2+RW,bxL=xL-inset,bxR=xR+inset,blen=bxR-bxL,yT=hi+inset,yB=lo-inset,bhl=yT-yB,yc2=(yT+yB)/2;
  add({vid:1,w:gw,h:hi-lo+12,d:6,p:[tx,(lo+hi)/2,-3.5],g:i,x:[0,0,0],nm:'Vidro 6 mm'});
  add({c:'FC-108',len:blen,ex:Z,ey:N(Y),ez:X,p:[tx,yT,oz],g:i,x:[0,.45,.4]});
  add({c:'FC-108',len:blen,ex:Z,ey:Y,ez:X,p:[tx,yB,oz],g:i,x:[0,-.45,.4]});
  add({c:'FC-108',len:bhl,ex:Z,ey:X,ez:Y,p:[bxL,yc2,oz],g:i,x:[-.45,0,.4]});
  add({c:'FC-108',len:bhl,ex:Z,ey:N(X),ez:Y,p:[bxR,yc2,oz],g:i,x:[.45,0,.4]});
  const ox=-Wi/2+sW/2+i*step;
  return {n:sd.n,ox,z:sd.z,fixa:!!sd.fixa,dir:sd.dir||0,curso:sd.fixa?0:(sd.dir>0?(NS-1-i)*step:i*step),gx:tx};
 });
 return {P,folhas,sW,sH,step,Wi};
}
/* ponto da seção (a,b) no espaço */
function ponto(o,a,b,ox,oz){const k=o.sc||[1,1];a*=k[0];b*=k[1];return [o.p[0]+a*o.ex[0]+b*o.ey[0]+(ox||0),o.p[1]+a*o.ex[1]+b*o.ey[1],o.p[2]+a*o.ex[2]+b*o.ey[2]+(oz||0)];}
window.FCM={MONT,pecas,ponto};
})();

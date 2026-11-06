/* Gera fc3d/clientes/aplicacao.json a partir da base da Plataforma FC 3D (tecnico/montagens.js + tecnico/secoes.json).
   Mesma regra da plataforma: só entram as montagens liberadas para os clientes (sem "aj" = em ajuste).
   Também gera aplicacao-amostra.json: só as montagens de amostra do público aberto (site da FC e link que as empresas mandam aos clientes),
   já montadas, sem expor a base inteira. Rodar sempre que mudar uma montagem:  node fc3d/clientes/ferramentas/gera-aplicacao.js   © FC Consultoria */
const fs=require('fs'),path=require('path'),vm=require('vm');
const T=path.join(__dirname,'..','tecnico');
/* Ajuste técnico (posições corrigidas pela FC na plataforma): exportar a tabela pfc_ajustes_3d para ferramentas/ajustes-3d.json
   no formato {"mont:<tipologia>|<peça>":[dx,dy,dz,rx,ry,rz,oculto]} e rodar este script. Sem o arquivo, sai sem ajustes. */
const AJF=path.join(__dirname,'ajustes-3d.json'),AJD=fs.existsSync(AJF)?JSON.parse(fs.readFileSync(AJF,'utf8')):null;
const ctx={window:{},localStorage:{getItem:()=>AJD?'arquivo':null},fetch:()=>Promise.resolve({ok:true,json:()=>AJD||{}}),console};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(T,'montagens.js'),'utf8'),ctx);
const FCM=ctx.window.FCM,S=JSON.parse(fs.readFileSync(path.join(T,'secoes.json'),'utf8'));
FCM.carregarAjustes().then(()=>{if(AJD)console.log('Ajustes técnicos aplicados: '+Object.keys(AJD).length);
const lista=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' e '+a[a.length-1];
const AMOSTRA=['jc2','g_jc2'];
/* Aplicações escondidas de todos os acessos enquanto a FC corrige a posição no Ajuste técnico (tipologia:perfil). Tirar daqui quando corrigir. */
const OCULTAR=new Set(['pg1:SU-279','pg1:SU-111','jc4p:SU-103','jc4pa:SU-103','pvz3:SU-203','mx2p:SU-292','jvc7:SU-071']);/* janela de correr 2 folhas Suprema e Gold */
const modelos={},perfis={},fora=[];
Object.entries(FCM.MONT).forEach(([k,m])=>{
 if(m.aj){fora.push(m.cd+' ('+m.aj+')');return;}
 const R=FCM.pecas(S,m,m.def[0],m.def[1]),U={};
 R.P.forEach(o=>{if(o.vid||o.oc)return;const u=U[o.c]||(U[o.c]={q:0,f:[],marco:false});u.q++;
  if(o.g<0)u.marco=true;else{const n=(R.folhas[o.g]||{}).n||'Folha';if(!u.f.includes(n))u.f.push(n);}});
 modelos[k]={n:m.n,linha:m.linha.replace(/^Linha\s+/,''),ref:m.cd};
 Object.entries(U).forEach(([c,u])=>{const onde=[];if(u.marco)onde.push('no marco');
  if(u.f.length)onde.push(u.f.length===R.folhas.length&&u.f.length>1?'em todas as folhas':'na '+lista(u.f.map(x=>x.toLowerCase())));
  if(OCULTAR.has(k+':'+c))return;
  (perfis[c]=perfis[c]||[]).push({m:k,pos:((S[c]||{}).n||'Perfil')+' · '+onde.join(' e ')+' · '+u.q+(u.q>1?' peças':' peça')});});
});
/* amostra pronta: peças já calculadas e só as seções usadas */
const r2=v=>Array.isArray(v)?v.map(r2):typeof v==='number'?Math.round(v*100)/100:v;
const am={_nota:'Gerado por ferramentas/gera-aplicacao.js. Amostra pública da Aplicação.',m:{},sec:{}};
const pack=(am,k)=>{const m=FCM.MONT[k];if(!m||m.aj)return;const R=FCM.pecas(S,m,m.def[0],m.def[1]);
 am.m[k]={W:m.def[0],H:m.def[1],folhas:R.folhas.map(f=>({ox:r2(f.ox),oy:r2(f.oy||0),z:r2(f.z),dir:f.dir||0,curso:r2(f.curso||0),rot:f.rot||null,n:f.n})),
  P:R.P.filter(o=>!o.vz&&!o.oc).map(o=>{const q={g:o.g,p:r2(o.p)};if(o.vid)Object.assign(q,{vid:1,w:r2(o.w),h:r2(o.h),d:r2(o.d),nm:o.nm});else{Object.assign(q,{c:o.c,len:r2(o.len),ex:o.ex,ey:o.ey,ez:o.ez});if(o.sc)q.sc=r2(o.sc);
   const sc=FCM.secOf(S,o.c);if(!am.sec[o.c])am.sec[o.c]={n:sc.n,s:sc.s};}return q;})};};
AMOSTRA.forEach(k=>pack(am,k));
/* 06/11/2026: "Ver o encaixe" liberado em todas as tipologias no público aberto (só o encaixe; esquadria inteira e folhas na Plataforma FC 3D) */
const enc={_nota:'Gerado por ferramentas/gera-aplicacao.js. Público: só o Ver o encaixe das tipologias fora da amostra.',m:{},sec:{}};
Object.keys(FCM.MONT).filter(k=>!AMOSTRA.includes(k)).forEach(k=>pack(enc,k));
fs.writeFileSync(path.join(__dirname,'..','aplicacao-encaixe.json'),JSON.stringify(enc));
fs.writeFileSync(path.join(__dirname,'..','aplicacao-amostra.json'),JSON.stringify(am));
const out={amostra:AMOSTRA.filter(k=>modelos[k]),_nota:'Gerado automaticamente da base da Plataforma FC 3D (tecnico/montagens.js). Só montagens liberadas para os clientes. Não editar à mão: rode fc3d/clientes/ferramentas/gera-aplicacao.js.',modelos,perfis};
fs.writeFileSync(path.join(__dirname,'..','aplicacao.json'),JSON.stringify(out,null,1)+'\n');
console.log(Object.keys(modelos).length+' montagens, '+Object.keys(perfis).length+' perfis. Fora (em ajuste): '+fora.length);fora.forEach(f=>console.log('  - '+f));
});

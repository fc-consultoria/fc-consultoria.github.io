/* Gera fc3d/clientes/aplicacao.json a partir da base da Plataforma FC 3D (tecnico/montagens.js + tecnico/secoes.json).
   Mesma regra da plataforma: só entram as montagens liberadas para os clientes (sem "aj" = em ajuste).
   Rodar sempre que mudar uma montagem:  node fc3d/clientes/ferramentas/gera-aplicacao.js   © FC Consultoria */
const fs=require('fs'),path=require('path'),vm=require('vm');
const T=path.join(__dirname,'..','tecnico');
const ctx={window:{},localStorage:{getItem:()=>null},fetch:()=>Promise.resolve({ok:false,json:()=>({})}),console};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(T,'montagens.js'),'utf8'),ctx);
const FCM=ctx.window.FCM,S=JSON.parse(fs.readFileSync(path.join(T,'secoes.json'),'utf8'));
const lista=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' e '+a[a.length-1];
const modelos={},perfis={},fora=[];
Object.entries(FCM.MONT).forEach(([k,m])=>{
 if(m.aj){fora.push(m.cd+' ('+m.aj+')');return;}
 const R=FCM.pecas(S,m,m.def[0],m.def[1]),U={};
 R.P.forEach(o=>{if(o.vid||o.oc)return;const u=U[o.c]||(U[o.c]={q:0,f:[],marco:false});u.q++;
  if(o.g<0)u.marco=true;else{const n=(R.folhas[o.g]||{}).n||'Folha';if(!u.f.includes(n))u.f.push(n);}});
 modelos[k]={n:m.n,linha:m.linha.replace(/^Linha\s+/,''),ref:m.cd};
 Object.entries(U).forEach(([c,u])=>{const onde=[];if(u.marco)onde.push('no marco');
  if(u.f.length)onde.push(u.f.length===R.folhas.length&&u.f.length>1?'em todas as folhas':'na '+lista(u.f.map(x=>x.toLowerCase())));
  (perfis[c]=perfis[c]||[]).push({m:k,pos:((S[c]||{}).n||'Perfil')+' · '+onde.join(' e ')+' · '+u.q+(u.q>1?' peças':' peça')});});
});
const out={_nota:'Gerado automaticamente da base da Plataforma FC 3D (tecnico/montagens.js). Só montagens liberadas para os clientes. Não editar à mão: rode fc3d/clientes/ferramentas/gera-aplicacao.js.',modelos,perfis};
fs.writeFileSync(path.join(__dirname,'..','aplicacao.json'),JSON.stringify(out,null,1)+'\n');
console.log(Object.keys(modelos).length+' montagens, '+Object.keys(perfis).length+' perfis. Fora (em ajuste): '+fora.length);fora.forEach(f=>console.log('  - '+f));

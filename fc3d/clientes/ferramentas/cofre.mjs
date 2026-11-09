#!/usr/bin/env node
/* Plataforma FC 3D · Cofre — cifra as telas e a base técnica antes de publicar (09/11/2026)
   © FC Consultoria em Esquadria

   Os arquivos de verdade (fonte) NÃO ficam no repositório público. Eles ficam em fc3d/clientes/_fonte/ (pasta ignorada pelo git)
   e são guardados cifrados em ferramentas/fonte.tgz.enc. A chave fica só no banco (pfc_config, k = 'cofre_chave').

   Uso (chave na variável FC_COFRE_CHAVE, em base64):
     node fc3d/clientes/ferramentas/cofre.mjs abrir    → recria _fonte/ a partir de fonte.tgz.enc (para editar)
     node fc3d/clientes/ferramentas/cofre.mjs fechar   → cifra tudo de _fonte/ e gera as páginas de entrada públicas

   Depois de editar: sempre "fechar" antes do commit. Nunca commitar a pasta _fonte/. */
import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const RAIZ=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const FONTE=path.join(RAIZ,'_fonte'),PACOTE=path.join(RAIZ,'ferramentas','fonte.tgz.enc');
const k=process.env.FC_COFRE_CHAVE;if(!k){console.error('Defina FC_COFRE_CHAVE (base64, 32 bytes).');process.exit(1);}
const KEY=Buffer.from(k,'base64');if(KEY.length!==32){console.error('Chave inválida.');process.exit(1);}

/* telas cifradas inteiras: a página pública vira só a entrada que pede a chave */
const PAGINAS=['mostruario/index.html','mostruario/montagem-tipologia.html','orientativo/index.html','orientativo3d/index.html','montagens/index.html','tecnico/index.html'];
/* ficam na fonte mas também saem abertos no site (usados por telas públicas) */
const PUBLICO=['mostruario/vento.js','aplicacao-amostra.json'];/* 09/11/2026: aplicacao-encaixe.json saiu do público (só a amostra abre) */
/* gerado à parte: a Aplicação completa sai cifrada e a versão pública sai sem as posições (só a amostra completa) */
const APLIC='aplicacao.json';

const cifra=b=>{const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',KEY,iv);return Buffer.concat([iv,c.update(zlib.gzipSync(b,{level:9})),c.final(),c.getAuthTag()]);};
const decifra=b=>{const iv=b.subarray(0,12),tag=b.subarray(b.length-16),d=crypto.createDecipheriv('aes-256-gcm',KEY,iv);d.setAuthTag(tag);return zlib.gunzipSync(Buffer.concat([d.update(b.subarray(12,b.length-16)),d.final()]));};
const lista=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?lista(path.join(d,e.name)):[path.join(d,e.name)]);
const rel=f=>path.relative(FONTE,f).split(path.sep).join('/');
const pub=r=>path.join(RAIZ,r);

function abrir(){
  if(!fs.existsSync(PACOTE)){console.error('Não achei '+PACOTE);process.exit(1);}
  const tmp=path.join(RAIZ,'ferramentas','.fonte.tgz');fs.writeFileSync(tmp,decifra(fs.readFileSync(PACOTE)));
  fs.mkdirSync(FONTE,{recursive:true});execFileSync('tar',['-xzf',tmp,'-C',FONTE]);fs.rmSync(tmp);
  console.log('Fonte aberta em '+FONTE+' ('+lista(FONTE).length+' arquivos). Edite e depois rode "fechar".');
}

const ENTRADA=t=>`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Plataforma FC 3D</title>
<script src="/fc3d/clientes/aba.js?v=1"></script>
<script src="/fc3d/clientes/cofre.js?v=1"></script>
</head>
<body style="margin:0;background:#eef1f0;font-family:system-ui,-apple-system,Segoe UI,sans-serif">
<div id="cofreMsg" style="min-height:100vh;display:grid;place-items:center;color:#5a6b69">Abrindo a Plataforma FC 3D…</div>
<script>FCCofre.pagina(${JSON.stringify(t)});</script>
<noscript>Ative o JavaScript para abrir a Plataforma FC 3D.</noscript>
</body>
</html>
`;

function fechar(){
  if(!fs.existsSync(FONTE)){console.error('Não achei '+FONTE+'. Rode "abrir" primeiro.');process.exit(1);}
  const arqs=lista(FONTE).map(rel).filter(r=>!r.startsWith('.'));
  const naFonte=new Set(arqs);
  const cofreJs=fs.readFileSync(pub('cofre.js'),'utf8');
  let n=0;
  for(const r of arqs){
    const src=fs.readFileSync(path.join(FONTE,r));
    if(PAGINAS.includes(r)){
      let h=src.toString('utf8');const dir=path.posix.dirname(r);
      /* scripts próprios protegidos entram dentro da tela cifrada */
      h=h.replace(/<script\s+src="([^"]+)"\s*>\s*<\/script>/g,(m,s)=>{
        if(/^(https?:)?\/\//.test(s))return m;
        const alvo=s.startsWith('/fc3d/clientes/')?s.slice(15).split('?')[0]:path.posix.normalize(path.posix.join(dir,s.split('?')[0]));
        if(!naFonte.has(alvo)||PAGINAS.includes(alvo))return m;
        return '<script>/* '+alvo+' */\n'+fs.readFileSync(path.join(FONTE,alvo),'utf8').replace(/<\/script/gi,'<\\/script')+'\n</script>';});
      /* o cofre vai junto, logo depois do aba.js (ou no início do head) */
      const ins='<script>'+cofreJs.replace(/<\/script/gi,'<\\/script')+'</script>';
      h=/<script src="\/fc3d\/clientes\/aba\.js[^"]*"><\/script>/.test(h)?h.replace(/(<script src="\/fc3d\/clientes\/aba\.js[^"]*"><\/script>)/,'$1'+ins):h.replace(/<head>/i,'<head>'+ins);
      fs.writeFileSync(pub(r)+'.enc',cifra(Buffer.from(h,'utf8')));
      fs.writeFileSync(pub(r),ENTRADA(path.posix.basename(r)));n++;continue;
    }
    if(r===APLIC){
      fs.writeFileSync(pub('aplicacao-completa.json.enc'),cifra(src));
      const d=JSON.parse(src.toString('utf8')),am=new Set(d.amostra||[]),perfis={};
      Object.entries(d.perfis||{}).forEach(([c,v])=>{perfis[c]=v.map(a=>am.has(a.m)?a:{m:a.m,pos:''});});
      fs.writeFileSync(pub(APLIC),JSON.stringify({amostra:d.amostra,_nota:'Versão pública (sem as posições). A Aplicação completa fica só na Plataforma FC 3D.',modelos:d.modelos,perfis},null,1)+'\n');n++;continue;
    }
    if(PUBLICO.includes(r)){fs.mkdirSync(path.dirname(pub(r)),{recursive:true});fs.writeFileSync(pub(r),src);continue;}
    /* base técnica e scripts: só cifrados (o aberto sai do site) */
    fs.mkdirSync(path.dirname(pub(r)),{recursive:true});
    fs.writeFileSync(pub(r)+'.enc',cifra(src));
    if(fs.existsSync(pub(r)))fs.rmSync(pub(r));n++;
  }
  /* pacote da fonte para a próxima edição */
  const tmp=path.join(RAIZ,'ferramentas','.fonte.tgz');
  execFileSync('tar',['-czf',tmp,'-C',FONTE,'--exclude=./.*','.']);
  fs.writeFileSync(PACOTE,cifra(fs.readFileSync(tmp)));fs.rmSync(tmp);
  console.log('Cifrados: '+n+' · fonte guardada em ferramentas/fonte.tgz.enc. Pode publicar (sem a pasta _fonte).');
}

const cmd=({abrir,fechar})[process.argv[2]];if(cmd)cmd();else console.log("Use: abrir | fechar");

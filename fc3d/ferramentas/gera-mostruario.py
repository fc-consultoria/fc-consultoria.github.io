"""Gera fc3d/clientes/mostruario/index.html a partir do Mostruário 3D do Orientativo
(treinamento/demo/index.html), para a Plataforma FC 3D Clientes:
- entrada só com a sessão da plataforma (pfc_sessao), sem o modo demonstrativo;
- só a Linha FC Residencial (linha Premium fica para depois);
- nomes de marca trocados pelos nomes das linhas FC.
Uso: python3 gera-mostruario.py <caminho do treinamento/demo/index.html>"""
import re,sys,os
src=sys.argv[1]
s=open(src,encoding='utf-8').read()
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','clientes','mostruario','index.html')

# 1) scripts de fora que não pertencem à plataforma
s=s.replace('<script src="../cda-codigos.js?v=3"></script>','<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">')
s=s.replace('<script>window.FC_DEMO=2;</script>','')
s=s.replace('<script src="/whats.js?v=1"></script>','')
# 2) tira o modo demonstrativo (demoInit / demo2Init) e liga a entrada da plataforma
a=s.find('/* ===== Modo demonstração (site da FC)');b=s.find('if(window.FC_DEMO===2)demo2Init();else if(window.FC_DEMO)demoInit();')
assert a>0 and b>a
gate=r'''/* ===== Plataforma FC 3D Clientes: entrada com a sessão da plataforma ===== */
(function(){const SP='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_sessao',SPK='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
 const g=document.createElement('div');g.id='pfcGate';g.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:#eef1f0;font:500 16px system-ui;padding:20px;text-align:center';
 g.innerHTML='<div><b style="font-size:20px">Abrindo o Mostruário 3D…</b><p style="color:#5a6b69">Conferindo o seu acesso à Plataforma FC 3D.</p></div>';document.body.appendChild(g);
 const nega=(t,p)=>{g.innerHTML='<div style="max-width:380px"><b style="font-size:20px">'+t+'</b><p style="color:#5a6b69">'+p+'</p><p><a href="../" style="color:#0e6f6a;font-weight:700">Ir para a Plataforma FC 3D</a></p></div>';};
 let tk=null;try{tk=localStorage.getItem('pfc-token');}catch(_){}
 if(!tk){nega('Entre na Plataforma FC 3D','O Mostruário 3D abre pela plataforma, depois de entrar com o seu login.');return;}
 fetch(SP,{method:'POST',headers:{apikey:SPK,'Content-Type':'application/json'},body:JSON.stringify({p_token:tk})}).then(r=>r.ok?r.json():null).then(d=>{
  if(!(d&&(d.papel||d.matriz))){nega('Sessão encerrada','Entre de novo na Plataforma FC 3D.');return;}
  g.remove();const t=new URLSearchParams(location.search).get('t');setTypo(TYPOS[t]&&LINHAS[0].t.includes(t)?t:'jcr200');
 }).catch(()=>nega('Sem conexão','Confira a internet e abra de novo.'));})();
'''
s=s[:a]+gate+s[b+len('if(window.FC_DEMO===2)demo2Init();else if(window.FC_DEMO)demoInit();'):]
# 3) só a Linha FC Residencial
s=re.sub(r"\{k:'gold',n:'Gold',c:'#c8932f',t:\[[^\]]*\]\}",'',s)
s=s.replace(",\n]",'\n]')
# 4) nomes das linhas
REP=[("catálogo técnico Suprema","catálogo técnico da linha"),("catálogo Suprema","catálogo da linha"),
 ("catálogos MettallFleck e Alcoa","catálogos dos fabricantes"),("Linha Suprema","Linha FC Residencial"),("LINHA SUPREMA","LINHA FC RESIDENCIAL"),
 ("| SUPREMA","| FC RESIDENCIAL"),("(Gold)","(Premium)"),("Linha Gold","Linha FC Premium"),
 ("?'Gold':'Suprema'","?'FC Premium':'FC Residencial'"),("'Gold':'Suprema'","'FC Premium':'FC Residencial'"),
 ("<strong>Suprema</strong>","<strong>FC Residencial</strong>"),("<strong>Gold</strong>","<strong>FC Premium</strong>"),
 ("JCR 200 Suprema","JCR 200"),("2 folhas, Suprema)","2 folhas)"),("da JCR 200 (Suprema)","da JCR 200")]
for x,y in REP:s=s.replace(x,y)
s=re.sub(r"\bSuprema\b","FC Residencial",s);s=re.sub(r"\bGold\b","FC Premium",s);s=re.sub(r"\bAlcoa\b","fabricante",s)
s=re.sub(r"code:'SUP ","code:'FC ",s);s=s.replace(".replace('SUP ','')",".replace('FC ','')").replace(".replace('GOLD ','G ')",".replace('GOLD ','G ')")
s=s.replace('(SUP JCR 200)','(FC JCR 200)')
# 5) esconde a linha Premium no diagrama e o guia do aluno do Orientativo
s=s.replace('</style>','.dia-ln[data-l="gold"],.guiabtn{display:none!important}\n</style>',1)
s=s.replace('<title>FC Mostruário 3D</title>','<title>Mostruário 3D · Plataforma FC 3D</title>')
# 6) botão de voltar para a plataforma
s=s.replace('</body>','<a href="../#tip" style="position:fixed;left:14px;bottom:14px;z-index:9000;background:#0a4f4b;color:#fff;font:600 14px system-ui;padding:9px 14px;border-radius:11px;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.25)">← Plataforma FC 3D</a>\n</body>',1) if '</body>' in s else s+'<a href="../#tip" style="position:fixed;left:14px;bottom:14px;z-index:9000;background:#0a4f4b;color:#fff;font:600 14px system-ui;padding:9px 14px;border-radius:11px;text-decoration:none">← Plataforma FC 3D</a>'
os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w',encoding='utf-8').write(s)
for w in ['Suprema','SUPREMA','Alcoa','ALCOA','Gold','Claiton','Ladore','Belmetal','Perfileve']:
    n=len(re.findall(w,s))
    if n:print('ainda tem',w,n)
print('ok',out,len(s))

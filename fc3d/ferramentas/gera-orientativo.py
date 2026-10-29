"""Gera fc3d/clientes/orientativo/ a partir do Orientativo de Montagem 3D original
(treinamento/esquadrias/), inteiro, para a Plataforma FC 3D Clientes:
- entrada só com a sessão da plataforma (pfc_sessao), sem o login da Matriz do treinamento;
- o 3D abre no Mostruário da plataforma (../mostruario/);
- nomes de marca trocados pelos Suprema e Gold com os nomes delas; sem o nome do fabricante.
Uso: python3 gera-orientativo.py <caminho do treinamento/esquadrias>"""
import re,sys,os,shutil
src=sys.argv[1];base=os.path.dirname(os.path.abspath(__file__))
dst=os.path.join(base,'..','clientes','orientativo');os.makedirs(dst,exist_ok=True)
def marcas(s):
    for x,y in [
                ("catálogos técnicos Gold e Suprema","catálogos técnicos das linhas"),
                ("(Alcoa, 2004)","(2004)"),("Alcoa, 2004","2004")]:s=s.replace(x,y)
    
    s=re.sub(r"\bAlcoa\b","fabricante",s)
    return s
# arquivos de apoio
for f in ['cm3d.js','perfis.json','perfis_extra.json','jan_shapes.json']:
    t=open(os.path.join(src,f),encoding='utf-8').read();open(os.path.join(dst,f),'w',encoding='utf-8').write(marcas(t) if f.endswith('.js') else t)
for d in ['gua','img2d']:
    if os.path.isdir(os.path.join(dst,d)):shutil.rmtree(os.path.join(dst,d))
    shutil.copytree(os.path.join(src,d),os.path.join(dst,d))
s=open(os.path.join(src,'index.html'),encoding='utf-8').read()
s=s.replace('<script src="../cda-codigos.js?v=3"></script>','').replace('<script src="/whats.js?v=1"></script>','').replace('<script src="../conversa-equipe.js?v=11"></script>','')
s=s.replace('<script src="../auth.js"></script>',"<script>const sb=window.supabase.createClient('https://cpkjphodruyxfouirhpd.supabase.co','sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg',{auth:{persistSession:false,storageKey:'pfc-ori-sb'}});</script>")
s=s.replace("/treinamento/demo/index.html?previa&esq=1&v=3","../mostruario/?esq=1&v=3")
s=s.replace("/treinamento/esquadrias/?sala=","/fc3d/clientes/orientativo/?sala=")
s=re.sub(r"function voltaUrl\(adm\)\{.*?return u\|\|'/treinamento/';\}","function voltaUrl(adm){return '../#tip';}",s,flags=re.S)
s=s.replace("b.textContent=adm?'← Painel matriz':'← Painel inicial';b.title=adm?'Voltar para o painel matriz da FC':'Voltar para o painel inicial da empresa';","b.textContent='← Plataforma FC 3D';b.title='Voltar para as Tipologias da plataforma';")
old="if(ALUNO||ESTUDO)iniciar();else gateUI(()=>{try{localStorage.setItem('fc_eu','1')}catch(_){}iniciar();},{soMatriz:true});"
assert old in s
s=s.replace(old,r"""if(ALUNO||ESTUDO)iniciar();else (function(){/* Plataforma FC 3D Clientes: entra com a sessão da plataforma */
 const SP='https://pawwncmfadzxfahfvhry.supabase.co/rest/v1/rpc/pfc_sessao',SPK='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs',G=$('#gate');
 const nega=(t,p)=>{G.hidden=false;G.innerHTML='<form><small>Plataforma FC 3D</small><h1>'+t+'</h1><p>'+p+'</p><a href="../" style="color:#0f6b70;font-weight:700">Ir para a Plataforma FC 3D</a></form>';};
 let tk=null;try{tk=localStorage.getItem('pfc-token');}catch(_){}
 if(!tk){nega('Entre na Plataforma FC 3D','O Orientativo abre pela plataforma, depois de entrar com o seu login.');return;}
 fetch(SP,{method:'POST',headers:{apikey:SPK,'Content-Type':'application/json'},body:JSON.stringify({p_token:tk})}).then(r=>r.ok?r.json():null)
  .then(d=>{if(!(d&&(d.papel||d.matriz))){nega('Sessão encerrada','Entre de novo na Plataforma FC 3D.');return;}if(!d.matriz){const g=$('#bGrav');if(g)g.hidden=true;}iniciar();})
  .catch(()=>nega('Sem conexão','Confira a internet e abra de novo.'));})();""")
s=s.replace('<small>FC Consultoria · Matriz</small>','<small>Plataforma FC 3D</small>')
# modo foco (?foco=1): abre só o módulo escolhido nas Tipologias, sem a sequência lateral
s=s.replace('</style>','body.foco .nav,body.foco .foot [data-go],body.foco #bHome{display:none!important}body.foco .lay{grid-template-columns:1fr!important;max-width:1180px}\n</style>',1)
s=s.replace('<body>','<body>\n<script>if(new URLSearchParams(location.search).get("foco")==="1")document.body.classList.add("foco");</script>',1)
s=s.replace('<title>Esquadrias 3D · Passo a passo · FC Consultoria</title>','<title>Orientativo 3D · Plataforma FC 3D</title>')
# Tipologias: só os modelos que têm 3D
s=s.replace("let TIPF='',TIPS=null;","let TIPF='',TIPS=null;\nMODELOS.forEach(f=>{f[1]=f[1].filter(m=>t3De(m));});for(let i=MODELOS.length-1;i>=0;i--)if(!MODELOS[i][1].length)MODELOS.splice(i,1);")
s=s.replace("const sel=TIPS||MODELOS[1][1][0];","const sel=TIPS||(MODELOS.find(m=>/correr/i.test(m[0]))||MODELOS[0])[1][0];")
s=s.replace("<p class=\"nt\">Os ${MODELOS.reduce((a,m)=>a+m[1].length,0)} modelos do passo a passo. Toque no desenho para ver o modelo grande e o que ele tem.</p>","<p class=\"nt\">Os ${MODELOS.reduce((a,m)=>a+m[1].length,0)} modelos com 3D. Toque no desenho para ver o modelo grande e girar em 3D.</p>")
s=s.replace("[['','Todos'],['3d','🧊 Só com 3D ('+N3+')'],...MODELOS.map(m=>[m[0],m[0]])]","[['','Todos'],...MODELOS.map(m=>[m[0],m[0]])]")
a=s.find('<p class="nt" style="margin:4px 0 8px"><b class="d3b" style="position:static;display:inline-block">🧊 3D</b>');b=s.find('</p>',a)+4
if a>0:s=s[:a]+s[b:]
s=marcas(s)
open(os.path.join(dst,'index.html'),'w',encoding='utf-8').write(s)
for w in ['Alcoa','Claiton','Ladore','Belmetal','Perfileve']:
    n=len(re.findall(r'\b'+w+r'\b',s))
    if n:print('ainda tem',w,n)
print('ok',dst)

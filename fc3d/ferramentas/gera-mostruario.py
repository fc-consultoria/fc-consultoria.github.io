"""Gera fc3d/clientes/mostruario/index.html a partir do Mostruário 3D do Orientativo
(treinamento/demo/index.html), para a Plataforma FC 3D Clientes:
- entrada só com a sessão da plataforma (pfc_sessao), sem o modo demonstrativo;
- Suprema e Gold com os nomes delas; sem o nome do fabricante;
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
  const t=new URLSearchParams(location.search).get('t');const A=window.PFC_AJ;if(A)A.matriz(d.matriz);(A?A.carregar():Promise.resolve()).then(()=>{g.remove();setTypo(TYPOS[t]?t:'jcr200');});
 }).catch(()=>nega('Sem conexão','Confira a internet e abra de novo.'));})();
'''
s=s[:a]+gate+s[b+len('if(window.FC_DEMO===2)demo2Init();else if(window.FC_DEMO)demoInit();'):]
# 3) linhas
# (as duas linhas ficam, para o Orientativo abrir o 3D de cada uma)
# 4) nomes das linhas
REP=[
 ("catálogos MettallFleck e Alcoa","catálogos dos fabricantes"),
 
 
 
 ]
for x,y in REP:s=s.replace(x,y)
s=re.sub(r"\bAlcoa\b","fabricante",s)


# 5) esconde o guia do aluno do Orientativo
s=s.replace('</style>','.guiabtn{display:none!important}\n</style>',1)
s=s.replace('<title>FC Mostruário 3D</title>','<title>Mostruário 3D · Plataforma FC 3D</title>')
# 5b) mover peças (todos) e ajuste técnico (Matriz)
s+='\n<script src="ajustes.js?v=8"></script>\n'
s+='<script src="tipologias-extra.js?v=3"></script>\n'  # tipologias novas no formato completo (lotes)
s+='<script src="perfis-extra.js?v=1"></script>\n'  # seções dos perfis que faltavam (catálogos técnicos)
s+='<script src="tipologias-lote2.js?v=1"></script>\n'  # Lote 2 em diante: as tipologias restantes da Suprema e Gold
s+='<script src="base-tecnica.js?v=8"></script>\n'  # Base técnica: desenho do catálogo + fonte
s+='<script src="config-cores.js?v=6"></script>\n'  # Configuração compacta e botão Cores
s+='<script src="vento.js?v=4"></script>\n'  # Simular pressão de vento
s+='<script src="flutuantes.js?v=2"></script>\n'  # painéis flutuantes (Base técnica, Simular) e 3D por cima
# 5c) Simular pressão de vento (S.vtOn) usa a mesma mão de amigo do catálogo (S.diaOn)
VT=[
 ("if(S.diaOn&&DIA&&!S.cut&&DIA.parts.includes(part)","if((S.diaOn||S.vtOn)&&DIA&&!S.cut&&DIA.parts.includes(part)"),
 ("if(c&&S.diaOn&&DIA){","if(c&&(S.diaOn||S.vtOn)&&DIA){"),
 ("if(S.lock||S.diaOn||S.us||S.cut){","if(S.lock||S.diaOn||S.vtOn||S.us||S.cut){"),
 ("if(S.lock||S.diaOn||DESM||EXE>.02)return;","if(S.lock||S.diaOn||S.vtOn||DESM||EXE>.02)return;"),
 ("const on=!!(S.diaOn&&DIA&&!S.cut&&!DESM);","const on=!!((S.diaOn||S.vtOn)&&DIA&&!S.cut&&!DESM);"),
 ("const hb=hotList.find(h=>h.c.k===DIA.k);if(hb){","const hb=hotList.find(h=>h.c.k===DIA.k);if(hb&&S.diaOn){"),
]
for x,y in VT:
    assert s.count(x)==1,('vento',x);s=s.replace(x,y)
# 5d) cabeçalho cabe no celular
s=s.replace('.hdr-r{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap}\n','.hdr-r{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap}\n@media(max-width:700px){.hdr-r{width:100%;min-width:0}.hdr-r,.hdr-r *{box-sizing:border-box;max-width:100%}}\n',1)
# 6) botão de voltar para a plataforma (some quando o Mostruário está dentro do Orientativo)
s+='\n<script>if(window.top===window){const a=document.createElement("a");a.href="../#tip";a.textContent="← Plataforma FC 3D";a.style.cssText="position:fixed;right:14px;bottom:14px;z-index:9000;background:#0a4f4b;color:#fff;font:600 14px system-ui;padding:9px 14px;border-radius:11px;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.25)";document.body.appendChild(a);}</script>\n<script src="../toque.js?v=1"></script>\n'
# 7) tipologia fixa: escolhida no card, sem seletor de linha/tipologia dentro do 3D
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import tipologia_fixa
s=tipologia_fixa.aplicar(s)
import motor_extra  # giro 2 folhas, maxim-ar duplo, peitoril fixo
s=motor_extra.aplicar(s)
import motor_lote2  # zonas (peitoril/bandeira/maxim-ar em quadro), giro com perfis por tipologia, marco lateral por lado
s=motor_lote2.aplicar(s)
os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w',encoding='utf-8').write(s)
for w in ['Alcoa','ALCOA','Claiton','Ladore','Belmetal','Perfileve']:
    n=len(re.findall(w,s))
    if n:print('ainda tem',w,n)
print('ok',out,len(s))

/* Plataforma FC 3D · compra da licença anual (Pix)
   © FC Consultoria em Esquadria · criação da FC, uso exclusivo de empresas licenciadas.
   Uso: FCLIC.abrir({token, nome, whats}) — token pode ser nulo (demonstrativo já encerrado). */
(function(){
const ZAP='5566999867984',PK='pfc-lic-pedido',QRJS='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
const h=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}},del(k){try{localStorage.removeItem(k)}catch(_){}}};
const brl=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const zap=t=>'https://wa.me/'+ZAP+'?text='+encodeURIComponent(t);
/* chamada própria ao banco: a página principal guarda a função rpc dentro dela, sem expor para este módulo */
const SB_URL='https://pawwncmfadzxfahfvhry.supabase.co',SB_KEY='sb_publishable_b0kGoqo85joo3Vb8Xllxhw_VemwaLMs';
async function call(fn,a){if(typeof window.rpc==='function')return window.rpc(fn,a);
  const r=await fetch(SB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(a||{})});
  let d=null;try{d=await r.json();}catch(_){}if(!r.ok)throw new Error((d&&(d.message||d.hint))||('Erro '+r.status));return d;}

/* ---- Pix copia e cola (BR Code estático com valor) ---- */
const tlv=(id,v)=>id+String(v.length).padStart(2,'0')+v;
const semAcento=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9 ]/g,'').toUpperCase().trim();
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF;}return c.toString(16).toUpperCase().padStart(4,'0');}
function pix(P){
  const conta=tlv('00','br.gov.bcb.pix')+tlv('01',P.pix_chave);
  let s=tlv('00','01')+tlv('26',conta)+tlv('52','0000')+tlv('53','986')+tlv('54',Number(P.valor).toFixed(2))+tlv('58','BR')
    +tlv('59',semAcento(P.pix_nome).slice(0,25))+tlv('60',semAcento(P.pix_cidade).slice(0,15))+tlv('62',tlv('05',String(P.txid).replace(/[^A-Za-z0-9]/g,'').slice(0,25)))+'6304';
  return s+crc16(s);
}
const carrega=u=>new Promise((ok,er)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=er;document.head.appendChild(s);});
let qrP=null;const qrLib=()=>qrP||(qrP=window.qrcode?Promise.resolve():carrega(QRJS).catch(()=>carrega('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js')));

/* ---- estilo ---- */
const css=`#licOv{position:fixed;inset:0;z-index:90;background:rgba(10,18,22,.62);display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow:auto}
#licOv .lc{background:var(--panel);color:var(--ink);border-radius:18px;width:100%;max-width:520px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.35);position:relative}
#licOv .x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:10px;border:0;background:transparent;font-size:22px;cursor:pointer;color:var(--mute)}
#licOv h2{font-size:22px;padding-right:36px}#licOv .pr{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:14px 0 4px}
#licOv .pr b{font:700 34px var(--f-h);color:var(--teal)}#licOv ul{margin:10px 0 16px;padding-left:18px;display:grid;gap:4px;font-size:14px}
#licOv .gr{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}#licOv .gr .w{grid-column:1/-1}
#licOv .ac{display:flex;gap:10px;align-items:flex-start;margin:4px 0 14px;font-size:14px}#licOv .ac input{width:20px;height:20px;margin:1px 0 0;flex:none;accent-color:var(--teal)}
#licOv .ac a,#licOv .lk{color:var(--teal);font-weight:600}#licOv .msg{min-height:20px;font-size:13.5px;color:#b3401a;margin:0 0 8px}
#licOv .qr{display:grid;place-items:center;background:#fff;border-radius:14px;padding:14px;margin:14px auto;width:min(260px,100%)}#licOv .qr img,#licOv .qr svg{width:100%;height:auto;display:block}
#licOv textarea{width:100%;border:1px solid var(--line);background:var(--soft);color:var(--ink);border-radius:11px;padding:10px 12px;font:12.5px/1.4 ui-monospace,monospace;resize:none;word-break:break-all}
#licOv .bts{display:grid;gap:10px;margin-top:12px}#licOv .bx{padding:12px 14px;border-radius:12px;background:var(--soft);font-size:13.5px;margin-top:14px}
#licOv .ok{font-size:40px;line-height:1}
@media (max-width:480px){#licOv .gr{grid-template-columns:1fr}#licOv .lc{padding:20px 16px}}`;
function estilo(){if(document.getElementById('licCss'))return;const s=document.createElement('style');s.id='licCss';s.textContent=css;document.head.appendChild(s);}

let ctx={},info=null,ped=null;
function caixa(html){estilo();let o=document.getElementById('licOv');
  if(!o){o=document.createElement('div');o.id='licOv';o.addEventListener('click',e=>{if(e.target===o)fechar();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('licOv'))fechar();});document.body.appendChild(o);}
  o.innerHTML=`<div class="lc" role="dialog" aria-modal="true" aria-labelledby="licTit"><button class="x" type="button" aria-label="Fechar">×</button>${html}</div>`;
  o.querySelector('.x').onclick=fechar;o.scrollTop=0;return o;}
function fechar(){const o=document.getElementById('licOv');if(o)o.remove();}
const cartao=()=>zap('Olá, FC! Quero a licença da Plataforma FC 3D'+(ped&&ped.empresa?' para a '+ped.empresa:'')+' e prefiro pagar no cartão ou preciso de mais acessos.');

/* ---- 1 · licença + dados + termos ---- */
async function passo1(){
  caixa(`<p class="mute">Carregando…</p>`);
  try{info=info||await call('pfc_licenca_info',{});}catch(e){caixa(`<h2 id="licTit">Adquirir licença</h2><p class="msg">Não foi possível carregar agora. Tente de novo ou fale com a FC.</p><a class="btn pri" href="${zap('Olá, FC! Quero adquirir a licença da Plataforma FC 3D.')}" target="_blank" rel="noopener">Falar com a FC</a>`);return;}
  const v=ped||{};const o=caixa(`<h2 id="licTit">Licença da Plataforma FC 3D</h2>
   <div class="pr"><b>${brl(info.valor)}</b><span class="mute">no Pix · 1 ano · até ${info.acessos} acessos</span></div>
   <ul><li>Tipologias Suprema e Gold em 3D, com desenho técnico e aplicação de cada perfil</li><li>Apresentação em tela cheia para TV e telão</li><li>Monte sua Casa com as esquadrias na planta</li><li>Licença no nome da sua empresa</li></ul>
   <form id="licF" autocomplete="on" novalidate><div class="gr">
    <div class="w"><label class="f" for="lEmp">Nome da empresa</label><input class="in" id="lEmp" autocomplete="organization" maxlength="100" value="${h(v.empresa||ctx.empresa||'')}"></div>
    <div><label class="f" for="lDoc">CNPJ (ou CPF)</label><input class="in" id="lDoc" inputmode="numeric" maxlength="20" value="${h(v.documento||'')}"></div>
    <div><label class="f" for="lCid">Cidade</label><input class="in" id="lCid" autocomplete="address-level2" maxlength="60" value="${h(v.cidade||'')}"></div>
    <div><label class="f" for="lRes">Responsável</label><input class="in" id="lRes" autocomplete="name" maxlength="80" value="${h(v.responsavel||ctx.nome||'')}"></div>
    <div><label class="f" for="lZap">WhatsApp com DDD</label><input class="in" id="lZap" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="(66) 9 9999-9999" value="${h(v.whats||ctx.whats||'')}"></div>
    <div class="w"><label class="f" for="lMail">E-mail <span class="mute" style="font-weight:400">(opcional)</span></label><input class="in" id="lMail" type="email" autocomplete="email" maxlength="100" value="${h(v.email||'')}"></div>
   </div>
   <label class="ac"><input type="checkbox" id="lTer"><span>Li e aceito os <a href="termos/" target="_blank" rel="noopener">termos de uso</a> da Plataforma FC 3D.</span></label>
   <div class="msg" id="lMsg" role="alert"></div>
   <div class="bts"><button class="btn pri" id="lBt">Gerar Pix de ${brl(info.valor)}</button>
   <a class="btn sec" href="${cartao()}" target="_blank" rel="noopener">💳 Cartão em até 3x ou mais acessos? Fale com a FC</a></div></form>`);
  o.querySelector('#licF').addEventListener('submit',async e=>{e.preventDefault();const g=id=>o.querySelector(id).value.trim(),m=o.querySelector('#lMsg'),bt=o.querySelector('#lBt');m.textContent='';
    if(!o.querySelector('#lTer').checked){m.textContent='Para seguir, aceite os termos de uso.';o.querySelector('#lTer').focus();return;}
    bt.disabled=true;bt.textContent='Gerando Pix…';
    try{const r=await call('pfc_licenca_pedir',{p_token:ctx.token||null,p_empresa:g('#lEmp'),p_documento:g('#lDoc'),p_responsavel:g('#lRes'),p_whats:g('#lZap'),p_email:g('#lMail'),p_cidade:g('#lCid'),p_termos:true});
      if(r.erro){m.textContent=r.erro;return;}
      ped=Object.assign({},r,{documento:g('#lDoc'),cidade:g('#lCid'),whats:g('#lZap'),email:g('#lMail')});ls.set(PK,r.pedido);passo2();
    }catch(err){m.textContent=err.message||'Não foi possível gerar o Pix. Tente de novo.';}
    finally{bt.disabled=false;bt.textContent='Gerar Pix de '+brl(info.valor);}});
}

/* ---- 2 · Pix com QR + copia e cola ---- */
async function passo2(){
  const cod=pix(ped);
  const o=caixa(`<h2 id="licTit">Pague com Pix</h2><p class="mute" style="margin-top:4px">${h(ped.empresa)} · licença de 1 ano · até ${ped.acessos} acessos</p>
   <div class="pr"><b>${brl(ped.valor)}</b><span class="mute">valor já preenchido</span></div>
   <div class="qr" id="lQr" aria-label="QR Code do Pix"><span class="mute" style="color:#555">Gerando QR Code…</span></div>
   <label class="f" for="lCod">Pix copia e cola</label><textarea id="lCod" rows="4" readonly>${h(cod)}</textarea>
   <div class="bts"><button class="btn sec" type="button" id="lCop">📋 Copiar código Pix</button>
   <button class="btn pri" type="button" id="lPg">✅ Já paguei · enviar comprovante</button>
   <a class="btn sec" href="${cartao()}" target="_blank" rel="noopener">💳 Cartão ou mais acessos? Fale com a FC</a></div>
   <div class="bx">Recebedor: FC Consultoria em Esquadria · CNPJ 52.985.682/0001-32<br>Identificador do pedido: <b>${h(ped.txid)}</b></div>
   <p style="margin-top:12px;font-size:13.5px"><a class="lk" href="#" id="lVolta">← corrigir dados da empresa</a></p>`);
  o.querySelector('#lCop').onclick=async e=>{const b=e.currentTarget,t=o.querySelector('#lCod');try{await navigator.clipboard.writeText(cod);}catch(_){t.select();document.execCommand('copy');}b.textContent='✓ Código copiado';setTimeout(()=>{b.textContent='📋 Copiar código Pix';},2500);};
  o.querySelector('#lVolta').onclick=e=>{e.preventDefault();passo1();};
  o.querySelector('#lPg').onclick=async e=>{const b=e.currentTarget;b.disabled=true;
    const txt='Olá, FC! Paguei a licença da Plataforma FC 3D.\nEmpresa: '+ped.empresa+'\nResponsável: '+ped.responsavel+'\nValor: '+brl(ped.valor)+'\nPedido: '+ped.txid+'\nSegue o comprovante do Pix:';
    const w=window.open(zap(txt),'_blank','noopener');
    try{await call('pfc_licenca_comprovante',{p_pedido:ped.pedido});}catch(_){}
    ped.status='comprovante';passo3(w?null:zap(txt));};
  try{await qrLib();const q=qrcode(0,'M');q.addData(cod);q.make();o.querySelector('#lQr').innerHTML=q.createSvgTag({cellSize:6,margin:2,scalable:true});}
  catch(_){o.querySelector('#lQr').innerHTML='<span style="color:#555;font-size:13px;text-align:center">Use o Pix copia e cola abaixo.</span>';}
}

/* ---- 3 · aviso recebido ---- */
function passo3(linkZap){
  const o=caixa(`<div class="ok" aria-hidden="true">✅</div><h2 id="licTit" style="margin-top:8px">Pagamento avisado</h2>
   <p style="margin-top:8px">Mande o comprovante na conversa do WhatsApp que abriu. A FC confere o Pix e libera a licença da <b>${h(ped.empresa)}</b>, com os ${ped.acessos} acessos, pelo WhatsApp informado.</p>
   <div class="bx">Atendimento: segunda a sexta, 8h às 11h e 13h às 17h. Avisos fora desse horário são liberados no próximo horário de atendimento.<br>Pedido: <b>${h(ped.txid)}</b></div>
   <div class="bts"><a class="btn pri" href="${linkZap||zap('Olá, FC! Paguei a licença da Plataforma FC 3D. Pedido '+ped.txid+'. Segue o comprovante:')}" target="_blank" rel="noopener">Abrir o WhatsApp da FC</a>
   <button class="btn sec" type="button" id="lVer">Ver o Pix de novo</button></div>`);
  o.querySelector('#lVer').onclick=passo2;
}

window.FCPIX=pix;
window.FCLIC={
  async abrir(c){ctx=c||{};
    const pid=ls.get(PK);
    if(pid&&!ped){try{const r=await call('pfc_licenca_status',{p_pedido:pid});if(r&&!r.erro&&(r.status==='aguardando'||r.status==='comprovante')){ped=r;info=info||r;}else ls.del(PK);}catch(_){}}
    if(ped&&ped.status==='comprovante')return passo3();
    if(ped&&ped.pedido)return passo2();
    return passo1();},
  fechar
};
})();

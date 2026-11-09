/* ===== Conversa de orçamento → WhatsApp direto (09/11/2026) =====
   A conversa pelo site foi desativada: o botão e os formulários abrem o WhatsApp oficial da FC com a mensagem pronta.
   Mantém a mesma API (FCRC.init / FCRC.abrir / FCRC.enviar) usada pelas páginas. */
(function(){
const SB='https://cpkjphodruyxfouirhpd.supabase.co',KEY='sb_publishable_d0HEeWsaqOeZIQKGftlF-Q_B8BUOWWg',WA='5566999867984';
const LS={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:v;}catch(_){return d;}}};
let CFG={pag:'site',marca:'FC Consultoria',cor:'#1f9d55'},pronto=false;
function hit(ev,ref){try{if(LS.g('fc_eu','')==='1')return;const s=sessionStorage.getItem('fc_s')||'x';fetch(SB+'/rest/v1/rpc/site_hit',{method:'POST',keepalive:true,headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({p_s:s,p_pag:CFG.pag,p_ev:ev,p_o:sessionStorage.getItem('fc_o')||'direto',p_ref:ref||''})}).catch(()=>{});}catch(_){}}
const link=t=>'https://wa.me/'+WA+(t?'?text='+encodeURIComponent(t):'');
function abrirZap(t){hit('rep_whats',CFG.marca);const w=window.open(link(t||(CFG.marca==='FC Consultoria'?'Olá, FC! Vim pelo site.':'Olá, FC! Vim pelo site, página '+CFG.marca+'.')),'_blank','noopener');if(!w)location.href=link(t);}
function montar(){if(pronto)return;pronto=true;
 const st=document.createElement('style');st.textContent=`#rcB{position:fixed;right:18px;bottom:18px;z-index:9998;border:0;border-radius:99px;background:#1f9d55;color:#fff;font:700 15px system-ui,sans-serif;padding:12px 18px;min-height:46px;box-shadow:0 8px 24px rgba(0,0,0,.18);cursor:pointer}#rcB:focus-visible{outline:3px solid #0b5357;outline-offset:2px}@media(max-width:560px){#rcB{right:12px;bottom:12px}}`;document.head.appendChild(st);
 const b=document.createElement('button');b.type='button';b.id='rcB';b.textContent='💬 Falar com a FC no WhatsApp';b.onclick=()=>abrirZap();document.body.appendChild(b);}
async function enviarDireto(p,txt,pag){if(!p||!p.nome||!txt)throw new Error('dados');
 const t=txt+'\n\nNome: '+p.nome+(p.cidade?'\nCidade: '+p.cidade:'')+(p.fone?'\nWhatsApp: '+p.fone:'');hit('conv_env',pag||CFG.marca);abrirZap(t);return true;}
window.FCRC={init(o){CFG=Object.assign(CFG,o||{});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();},abrir(t){abrirZap(t);},enviar:enviarDireto};
})();

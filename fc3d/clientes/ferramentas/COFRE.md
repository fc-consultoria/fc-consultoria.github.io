# Cofre da Plataforma FC 3D (09/11/2026)

As telas e a base técnica da Plataforma FC 3D ficam **cifradas** neste repositório público (arquivos `.enc`).
A chave fica só no banco da plataforma (Supabase `pawwncmfadzxfahfvhry`, tabela `pfc_config`, `k = 'cofre_chave'`)
e é entregue pela função `pfc_cofre_chave(p_token)` somente para quem tem login válido.

## Para editar qualquer tela ou arquivo cifrado

1. Pegar a chave no banco: `select v from pfc_config where k='cofre_chave';`
2. `export FC_COFRE_CHAVE='<chave>'`
3. `node fc3d/clientes/ferramentas/cofre.mjs abrir` → recria `fc3d/clientes/_fonte/` com os arquivos de verdade.
4. Editar **dentro de `_fonte/`** (nunca as páginas de entrada públicas nem os `.enc`).
5. `node fc3d/clientes/ferramentas/cofre.mjs fechar` → cifra tudo e atualiza `ferramentas/fonte.tgz.enc`.
6. Commit. A pasta `_fonte/` é ignorada pelo git e **nunca** vai para o repositório.

Telas cifradas inteiras: mostruario/, mostruario/montagem-tipologia.html, orientativo/, orientativo3d/, montagens/, tecnico/.
Base cifrada: tecnico/montagens.js, tecnico/secoes.json, orientativo/jan_shapes.json, orientativo/perfis_extra.json, aplicacao-completa.json e os scripts do mostruário.
Saem abertos (usados por telas públicas): mostruario/vento.js, aplicacao-amostra.json, aplicacao.json (versão sem as posições). O encaixe (aplicacao-encaixe.json) fica cifrado: no público só a amostra abre.

Para gerar a Aplicação: abrir o cofre, rodar `node fc3d/clientes/_fonte/ferramentas/gera-aplicacao.js`, depois fechar.

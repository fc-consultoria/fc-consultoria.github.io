"""Tipologia fixa no Mostruário 3D da Plataforma FC 3D Clientes.

A tipologia é escolhida no card das Tipologias; dentro do 3D não há mais
"Escolha a linha", "Novas linhas · em breve" nem "Escolha a tipologia".

- esconde a linha de seleção (#typoLab) em todos os modos;
- códigos da Gold iguais aos dos cards (GLD em vez de GOLD);
- tipologia oculta (ajuste pendente) aberta direto pelo link: só o Acesso FC vê;
- botão "← Voltar às tipologias".

Usado pelo gera-mostruario.py. Rodar sozinho aplica no index.html atual:
    python3 tipologia_fixa.py
Pode rodar mais de uma vez (não duplica).
"""
import os

# Tipologias do Mostruário que estão com "Oculto · ajustar" nos cards da plataforma.
# Quando conferir e liberar no card, tire daqui também.
OCULTAS = ['gpc2fpe', 'gpc3fvz', 'pgr200', 'pcr200a', 'gjc2fbmf', 'gpc4fbmf', 'gpgr1fvz', 'gmaxpf', 'gmaxpfcc', 'gcjunit']

MARCA = '/*pfc-tipologia-fixa*/'


def aplicar(s):
    if MARCA not in s:
        s = s.replace('</style>', MARCA + '#typoLab{display:none!important}\n</style>', 1)
    s = s.replace("code:'GOLD ", "code:'GLD ")
    s = s.replace(".replace('GOLD ','G ')", ".replace('GLD ','G ')")
    velho = "const t=new URLSearchParams(location.search).get('t');const A=window.PFC_AJ;"
    novo = ("const t=new URLSearchParams(location.search).get('t');"
            "if(window.top===window&&" + repr(OCULTAS).replace(' ', '') + ".includes(t)&&!d.matriz)"
            "{nega('Tipologia em ajuste','Esta tipologia está sendo conferida pela FC e ainda não está liberada.');return;}"
            "const A=window.PFC_AJ;")
    if velho in s:
        s = s.replace(velho, novo)
    s = s.replace('a.textContent="← Plataforma FC 3D";', 'a.textContent="← Voltar às tipologias";')
    return s


if __name__ == '__main__':
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'clientes', 'mostruario', 'index.html')
    s = open(f, encoding='utf-8').read()
    n = aplicar(s)
    open(f, 'w', encoding='utf-8').write(n)
    print('ok' if n != s else 'já estava aplicado', f)

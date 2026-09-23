# Espaçamento de seções e centralização

Pedido: gap de 48 px nas realidades red e blue, com galerias centralizadas durante a rolagem lateral.

O main compartilhado usa flex em coluna com gap de 48 px; as seções não acumulam padding vertical externo. Os palcos horizontais usam sua altura de conteúdo, sem mínimo de uma tela ou padding vazio. O início do pin é calculado pela metade da diferença entre a altura da janela e a do palco, com piso zero quando o conteúdo ultrapassa a tela. O cálculo é renovado no refresh do ScrollTrigger.

Validação Chromium em http://127.0.0.1:3000: distância medida de 48 px entre todas as seções nas duas versões em 1440 e 390 px. Em viewport com 900 px de altura, centros dos quatro palcos entre 449,56 e 450,22 px durante o pin. Capturas /tmp/spacing-{blue,red}-{projects,stack}.png inspecionadas. Lint e TypeScript passaram.

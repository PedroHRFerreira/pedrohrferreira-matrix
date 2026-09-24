# Animações e entrada dos minigames

O usuário confirmou a apresentação “Iniciar minigame” nos temas Red e Blue e
pediu para continuar a otimização para máquinas fracas sem perder design/layout.
Sem dispositivo indicado, validar desktop e celular com CPU limitada.

## Escopo

- Destacar o botão de iniciar, explicitar clique/toque e Enter, manter instruções
  de movimento e permitir encerrar pelo botão nos dois temas.
- Reduzir trabalho repetido nos ciclos de animação: medidas de cenário somente ao
  redimensionar, transformações dos personagens sem renderizar a árvore React a
  cada movimento, preservar eventos de portas/captura e velocidade de jogo.
- Otimizar o desenho da tempestade mantendo quantidade, profundidade e direção
  das gotas e comportamento dos relâmpagos.
- Respeitar pausa, documento oculto, movimento reduzido e desmontagem.
- Preservar cenas, posições, galerias, cores e progressão da corrupção existente.

## Verificação

Medir antes/depois no mesmo Chromium headless, CPU 6x, larguras 1440/390,
DPR 1. Registrar cadência rAF como tal, sem confundir com FPS da GPU. Medir também
layout, scripts e operações de desenho. Comparar capturas e testar minigames,
portas, captura, pausa, teclado/toque, responsividade e quarta falha → revelação.

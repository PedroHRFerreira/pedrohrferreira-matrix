# Remediação da auditoria do portfólio Matrix

## Escopo aprovado

Aplicar todos os achados da revisão de prontidão sobre a implementação atual.

## Conteúdo

- Publicar somente conteúdo em português.
- Remover o seletor, os catálogos e a infraestrutura de tradução.
- Usar `curriculo-pedro.pdf` como fonte-base para nome, posicionamento, experiências,
  projetos e competências.
- Expor o currículo como download e manter GitHub e LinkedIn como canais profissionais.
- Evitar publicar telefone e e-mail diretamente na interface.

## Experiência de entrada

- Preservar os cinco segundos de ruído na primeira visita com movimento normal.
- Não oferecer controle manual para pular a introdução.
- Simplificar esperas para `prefers-reduced-motion`.
- Persistir a realidade escolhida e levar visitantes recorrentes diretamente à última
  realidade, mantendo uma ação para rever a escolha.

## Navegação

- Manter a mesma implementação vertical -> horizontal -> vertical nas duas realidades.
- O scroll vertical controla o deslocamento lateral; não existirá barra horizontal,
  carrossel ou `scroll-snap`, inclusive em telas móveis.
- Em movimento reduzido, apresentar uma alternativa vertical legível e sem pinagem.

## Atmosfera e acessibilidade

- Substituir os caracteres sobrepostos nas falhas das nuvens por distorções de textura.
- Manter apenas um link global de pular para o conteúdo.
- Preservar foco visível, navegação por teclado, semântica e controles reais.

## Validação

- Atualizar testes unitários e Playwright para os novos critérios.
- Cobrir primeira visita, retorno, pular introdução, ambas as realidades, currículo,
  teclado, desktop, mobile e movimento reduzido.
- Executar formatação, lint, testes, build, testes ponta a ponta e inspeção visual.

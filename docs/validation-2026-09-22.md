# Validação do portfólio — 22/09/2026

Ambiente: http://127.0.0.1:3000/, Chromium real via Playwright, perfis desktop e mobile.

## Cobertura

- Entrada completa com animação e escolha de realidade; entrada com movimento reduzido.
- Realidades red e blue, navegação pelas seções, galerias horizontais, teclado, detalhes dos projetos e retorno de foco.
- Larguras de 320, 390, 480, 768, 1024 e 1440 px: sem transbordamento horizontal do documento nos cenários verificados.
- Galeria red também inspecionada em 1280 × 720; título e conteúdo visíveis. Em alturas abaixo de 600 px, a galeria usa rolagem horizontal nativa sem fixação animada.
- Nome completo do blue em uma linha, espaçamento entre seções e centralização das galerias.
- Currículo com resposta HTTP 200; página inexistente com HTTP 404 e retorno à experiência.
- Sem erros de página nos percursos responsivos verificados.

## Correções

- Menu red em 320 px: removida a reserva lateral que cortava os links.
- Galerias red em telas baixas: cabeçalho compacto e desativação da fixação nas menores alturas.
- ARCA Tracker: endereço corrigido para https://github.com/PedroHRFerreira/arca-tracker, conforme informado pelo usuário; HTTP 200 confirmado.
- Teste de entrada atualizado para o fluxo atual; adicionadas verificações do menu estreito e recuperação da página 404.

## Resultados

- 20 testes unitários aprovados.
- 30 cenários E2E aprovados entre a execução principal e a reexecução dos testes corrigidos/adicionados; dois cenários exclusivos de desktop ignorados no perfil mobile.
- Regressão final das galerias: três testes aprovados e um cenário exclusivo de desktop ignorado no mobile.
- ESLint, TypeScript e build de produção aprovados após as correções funcionais.
- Links públicos GitHub verificados com HTTP 200. LinkedIn devolveu HTTP 999 ao acesso automatizado e não pôde ser confirmado por esse método.

## Evidências visuais temporárias

Capturas inspecionadas em `/tmp`: `qa-red-320-main-content.png`, `qa-red-320-projects.png`, `qa-red-768-stack.png`, `qa-blue-320-main-content.png`, `qa-blue-768-projects.png`, `qa-blue-1440-contact.png`, `qa-red-menu-fixed.png` e `qa-red-stack-720.png`.

## Limites

Validação realizada em Chromium, com emulação de tamanhos móveis. Safari, Firefox e dispositivos físicos não foram testados. Os resultados cobrem os fluxos exercitados e não constituem garantia de ausência de qualquer defeito.

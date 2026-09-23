# Validação de fluxos e responsividade — 23/09/2026

Ambiente: http://localhost:3000, Chromium real via Playwright.

- Suíte completa: 36 cenários aprovados; 2 testes exclusivos de desktop ignorados no perfil mobile.
- 20 testes unitários aprovados; ESLint, TypeScript e build de produção aprovados.
- Percursos red e blue, seções, galerias, detalhes dos projetos, teclado, retorno de foco, reinício, página 404 e retorno à TV com as duas narrativas.
- Tamanhos inspecionados: 320×568, 390×844, 768×1024, 1024×768, 1440×900 e 844×390. Retornos à TV exercitados com movimento reduzido; a suíte cobre também animações e galerias sem essa preferência.
- Inspeção visual encontrou a dica de teclado cortada e pouco espaço abaixo das pílulas na TV em paisagem baixa. Corrigido espaçamento e tamanho do texto somente abaixo de 500 px de altura, em telas acima de 35rem de largura.
- Após a correção, nova verificação em 844×390 com teclado e toque, incluindo pergunta, escolha e entrada no blue.
- Capturas temporárias em /tmp/audit-*, /tmp/tv-landscape-question-* e /tmp/tv-landscape-choice-*.

Limites: Chromium com emulação de dispositivos; Safari, Firefox e aparelhos físicos não foram testados. Links externos não foram revalidados nesta rodada. A aprovação abrange os percursos exercitados.

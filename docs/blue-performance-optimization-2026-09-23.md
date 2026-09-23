# Blue — otimização das nuvens e restauração das galerias

## Alterações

- Nuvens usam as texturas `cloud-round.webp` e `cloud-wide.webp`, já versionadas no projeto. Elas substituem os cinco gradientes e os filtros de cada nuvem. Posição, dimensões do elemento, opacidade, espelhamento, parallax e animações foram mantidos. O padding transparente da textura fica fora do elemento animado para manter o tamanho do desenho.
- Galerias horizontais usam o contexto do `gsap.matchMedia`, sem um contexto redundante. A limpeza remove explicitamente o transform horizontal e seu cache. Isso corrige cards da stack fora da tela ao ativar movimento reduzido ou entrar na largura mobile.
- Teste de regressão alterna desktop → movimento reduzido → movimento normal → mobile → desktop e verifica a visibilidade dos cards.

## Medição antes/depois

Mesmo método da [referência inicial](blue-performance-baseline-2026-09-23.md), versão de produção em `http://127.0.0.1:3100`, DPR 1 e três repetições por perfil, executadas sequencialmente. Os testes funcionais e a comparação visual foram executados depois das medições, para não disputar recursos com elas.

Valores são medianas da cadência de `requestAnimationFrame` em Hz, **não FPS apresentados pela GPU**.

| Perfil                                       | Repouso antes → depois | Rolagem antes → depois |
| -------------------------------------------- | ---------------------: | ---------------------: |
| Desktop 1440 × 900, CPU normal               |          15,29 → 25,03 |          11,37 → 16,95 |
| Desktop 1440 × 900, CPU 6× mais lenta        |          15,13 → 23,97 |          11,14 → 16,41 |
| Celular emulado 390 × 844, CPU 6× mais lenta |          60,00 → 59,67 |          41,44 → 48,40 |

No desktop 6×, ganho observado de aproximadamente 58% em repouso e 47% na rolagem. No celular, o repouso permaneceu próximo de 60 Hz e a mediana da rolagem melhorou cerca de 17%; as rodadas de rolagem variaram de 41,44 a 49,53 Hz. As amostras são pequenas e não medem a variabilidade entre aparelhos.

Dados brutos: `blue-performance-optimized-2026-09-23.json`. Script temporário: `/tmp/blue-optimized.cjs`; capturas: `/tmp/blue-optimized-2026-09-23/`.

## Comparação visual

Capturas com 900 px de altura e larguras 1440, 1024, 768, 390 e 320 px. Na mesma página, o CSS original das nuvens foi aplicado temporariamente e removido para comparar as duas versões. As animações CSS foram pausadas em 5 segundos e houve espera após redimensionar para estabilizar transições.

Erro absoluto médio por canal, escala 0–255:

| Largura | Erro médio | Diferença máxima |
| ------- | ---------: | ---------------: |
| 1440    |      0,163 |                5 |
| 1024    |      0,167 |                4 |
| 768     |      0,097 |                7 |
| 390     |      0,099 |                6 |
| 320     |      0,111 |                8 |

Nenhum pixel das capturas diferiu mais de 10 níveis em qualquer canal. Não são imagens idênticas: escalar a textura também escala o desfoque já incorporado. Nas capturas inspecionadas, a aparência e o layout foram preservados, com pequenas diferenças de rasterização.

Dados: `blue-cloud-visual-comparison-2026-09-23.json`. Capturas temporárias: `/tmp/cloud-original-<largura>.png` e `/tmp/cloud-texture-<largura>.png`. A captura completa desktop da versão otimizada confirmou que a stack voltou a aparecer após ativar movimento reduzido.

## Validação

- Build de produção e TypeScript: passaram.
- ESLint: passou após a última alteração.
- Testes unitários: 20 passaram em seis arquivos.
- Teste novo de restauração: falhou com a primeira tentativa de correção; passou após limpar o transform.
- Testes de navegador relevantes: 15 passaram, três casos exclusivos de desktop foram pulados no perfil mobile. Cobertura: galerias Red/Blue, movimento reduzido, nuvens, modal, navegação por teclado e recuperação da rota 404.
- Nove rodadas de medição sem erros de console/JavaScript registrados. Uma rodada mobile registrou uma tarefa longa de 53 ms na rolagem; demais amostras sem tarefas longas registradas.

Comando dos testes de navegador:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npx playwright test --workers=2 --grep 'blue restaura cards|pílula azul|projetos e stack|movimento reduzido mantém|modal navega|teclado alcança|página inexistente|código descendente' --reporter=line
```

## Limitações

O Chromium headless usa SwiftShader (renderização por software). A melhora local é mensurável, mas ainda não comprova a meta de fluidez em hardware fraco real. O desktop continua abaixo da meta proposta de 30 atualizações/s durante a rolagem neste ambiente. Não foi implementada redução automática de efeitos.

As texturas acrescentam aproximadamente 383 KiB de imagens ao primeiro carregamento da Blue; já existiam no repositório, mas não eram solicitadas pelo componente. Esta rodada mediu a página estabilizada, sem limitação de rede, e não avaliou esse custo em conexão lenta.

Os dados e este relatório permanecem no projeto. Scripts e capturas ficam em `/tmp` e podem ser apagados pelo sistema. Nenhum deploy foi feito.

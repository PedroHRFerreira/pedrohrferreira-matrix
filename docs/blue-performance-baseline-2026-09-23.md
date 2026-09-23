# Blue — referência de desempenho

Medição em 23/09/2026, sem alterações no código da aplicação.
Commit: `2a6d5edeaa01208c677e9123e47313b614aa9e1f`.

## Método

- Build de produção: `npm run build`; servidor: `npm run start -- --hostname 127.0.0.1 --port 3100`.
- URL: `http://127.0.0.1:3100`. Chromium 153.0.8010.12, Playwright, headless.
- Três contextos novos por perfil; execução sequencial; DPR 1; sem limitação de rede.
- Desktop: 1440 × 900. Celular: 390 × 844, emulação mobile e touch.
- Introdução abre com movimento reduzido; movimento normal é restaurado antes da escolha da pílula azul. A transição inicial não faz parte da medição.
- Espera de 8 segundos após a Blue aparecer. Amostras de 6 segundos em repouso e depois 6 segundos de rolagem programática do topo ao fim, proporcional ao tempo transcorrido.
- CPU 6× via `Emulation.setCPUThrottlingRate`, relativo ao computador executor. Não representa um modelo específico de aparelho fraco.
- Registro dos intervalos de `requestAnimationFrame` e de tarefas longas via `PerformanceObserver`.

## Resultados

Mediana das três repetições; unidade: callbacks de animação por segundo (Hz).

| Perfil | Repouso | Rolagem |
| --- | ---: | ---: |
| Desktop, CPU normal | 15,29 | 11,37 |
| Desktop, CPU 6× mais lenta | 15,13 | 11,14 |
| Celular emulado, CPU 6× mais lenta | 60,00 | 41,44 |

**Estes valores não são uma medição de FPS efetivamente apresentados pela GPU.**
Não comparar diretamente com os antigos 10,9/18,2 FPS: a versão, o método e o ambiente anteriores não foram preservados.
O perfil mobile usa menos pixels e as regras responsivas do site; ele não simula GPU, memória ou desempenho real de um celular.

Somente uma rodada registrou tarefas longas: duas, somando 133 ms, durante a rolagem desktop 6×. Ausência de tarefas longas não significa ausência de custo de JavaScript ou renderização.

## Verificações

- Build de produção e verificação TypeScript concluídos.
- Nove rodadas sem erros de console/JavaScript registrados e sem overflow horizontal no ponto final da rolagem.
- Modal Rods SDK abriu e fechou por Escape em cada perfil, com movimento reduzido após as amostras.
- Rota inexistente devolveu HTTP 404; a recuperação pelo link não foi exercitada nesta rodada.
- Capturas da primeira rodada de cada perfil: hero com movimento normal e página completa com movimento reduzido. Estas duas capturas representam modos diferentes e não devem ser usadas como comparação visual entre si.
- Inspecionadas as capturas de hero desktop/mobile e as páginas completas desktop/mobile. Hero legível em ambos; captura desktop completa apresentou uma lacuna na área de stack, a investigar separadamente.

## Artefatos e reprodução

Dados brutos preservados em `blue-performance-baseline-2026-09-23.json`, ao lado deste relatório.
Script temporário: `/tmp/blue-baseline.cjs`; capturas: `/tmp/blue-baseline-2026-09-23/`.
O diretório temporário pode ser removido pelo sistema. Os dados e o método deste relatório permanecem no projeto.
Para repetir enquanto o script existir, iniciar o servidor de produção acima e executar `node /tmp/blue-baseline.cjs`.
O script sobrescreve os arquivos temporários; copiar os resultados anteriores antes de executar novamente.

## Limites e próximos critérios

### Diagnóstico adicional

O navegador informou `ANGLE_SWIFTSHADER` / `SwiftShader Device (Subzero)`: renderização por software. Portanto, este ambiente não comprova o desempenho com GPU física de desktop ou celular.

Em um ensaio exploratório desktop 1440 × 900, CPU normal, após 8 segundos de estabilização, medimos 6 segundos para cada condição, com 1 segundo de espera entre alterações:

| Condição | Cadência rAF (Hz) |
| --- | ---: |
| Original | 13,92 |
| Animações das nuvens pausadas por CSS temporário | 27,76 |
| Original restaurado | 13,80 |

O ensaio aponta uma contribuição relevante das nuvens animadas neste renderizador. Não é uma otimização aplicada, nem prova que removê-las seja necessário: pausá-las muda o comportamento visual e foi usado somente para diagnóstico. Dados completos: `blue-performance-diagnostic-2026-09-23.json`.

Foi reproduzida uma falha preexistente ao alternar movimento normal para reduzido no desktop: os quatro cards da stack permaneceram à esquerda da tela (bordas direitas em −800/−232 px). Captura: `/tmp/blue-baseline-2026-09-23/stack-inspection.png`. A verificação de overflow horizontal no final da página não detecta esse problema. Esta falha não foi corrigida nesta medição.

Não houve auditoria completa de carregamento/Core Web Vitals, interações com cursor, todas as larguras responsivas ou hardware real. Esta referência serve para comparação local controlada.
Os resultados desktop semelhantes com e sem limitação de CPU justificam investigar composição/rasterização e o renderizador do ambiente antes de priorizar mudanças em JavaScript.
Qualquer otimização deve preservar o visual e ser comparada no mesmo perfil, modo de movimento, ambiente e percurso. A meta de fluidez em aparelhos fracos ainda não foi comprovada.

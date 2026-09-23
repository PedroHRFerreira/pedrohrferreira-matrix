# Validação de desempenho — 23/09/2026

Build de produção, Chromium via Playwright, CPU limitada a 6×. Desktop 1280×900 no footer e 1280×720 na rolagem; mobile Pixel 7 emulado. Animações habilitadas após a escolha. Nenhum código do produto alterado nesta validação.

## Comparação do percurso de rolagem

Mesmo script `scripts/measure-runtime.mjs`, percurso de 10 segundos. Referência recuperada de `/tmp/matrix-runtime.json`, registrada às 13:27 UTC; não foi reconstruída a versão anterior. Uma execução por realidade, portanto pequenas diferenças não demonstram regressão.

| Página | FPS anterior | FPS atual | p95 anterior / atual |
| --- | --- | --- | --- |
| Blue | 10,9 | 10,9 | 116,6 / 116,7 ms |
| Red | 52,2 | 51,4 | 33,4 / 33,4 ms |

Red: diferença de aproximadamente -1,5%, com p95 estável. Blue: lentidão já presente na referência e reproduzida agora. Não há evidência de regressão relevante neste percurso, mas o blue desktop não pode ser considerado fluido nesse ambiente.

## Footer atual

Três amostras de 1,2 segundo por cenário (`scripts/measure-passage.mjs`). Jogo ativo medido durante movimento à direita, reiniciado a cada amostra para evitar captura/saída. Isso cobre início da perseguição, não uma sessão prolongada com todas as cópias.

| Página | Desktop inativo | Desktop ativo | Mobile, só botão |
| --- | --- | --- | --- |
| Red | 59,2–60 FPS | 60 FPS | 59,2–60 FPS |
| Blue | 13,4–14,4 FPS | 15–15,2 FPS | 60 FPS |

Nenhuma tarefa de JavaScript acima de 50 ms nas amostras concluídas. A diferença entre ativo/inativo no blue não demonstra melhoria: cenas e carga visual diferem. O FPS baixo também sem jogo sugere custo da página/renderização; não foi realizado profiling para atribuir causa.

Uma tentativa inicial de 4 segundos no blue ativo terminou com captura e foi descartada por misturar jogo ativo e retorno ao topo. As amostras válidas confirmaram `data-active=true`. Antes disso, red ativo em janelas de 4 segundos ficou entre 55,3 e 60 FPS.

## Limites e reprodução

Emulação relativa à CPU desta máquina; não reproduz GPU fraca, pouca RAM, aquecimento ou aparelhos físicos. Não substitui validação em hardware real, nem prova ausência de toda regressão. Build de produção aprovado. Resultados brutos em `docs/performance-2026-09-23.json`.

Executar `npm run build`, iniciar `npm run start -- --port 3100`, depois `node scripts/measure-passage.mjs`. Para o percurso: `PERF_URL=http://localhost:3100 PERF_OUTPUT=/tmp/matrix-runtime-current.json node scripts/measure-runtime.mjs`.

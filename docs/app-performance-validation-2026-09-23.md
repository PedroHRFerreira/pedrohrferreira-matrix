# Aplicação — validação e otimizações

Escopo: introdução CRT, escolha e transições, Red, Blue, galerias, diálogos, modal, rodapés, reconsideração e erro 404. Trabalho local em 23/09/2026, mantendo o layout e a direção visual.

## Otimizações aplicadas nesta rodada

### Introdução

O ruído continua sendo calculado em 320 × 180 pixels, com a mesma distribuição aleatória e a mesma cadência de atualização. O contraste e o brilho foram incorporados a uma paleta de 256 tons, eliminando o filtro CSS sobre o canvas ampliado. Como os canais RGB já eram iguais, o filtro de escala de cinza era redundante. Cada pixel RGBA passa a ser escrito de uma vez, por uma visão de 32 bits do mesmo buffer.

Comparação isolada em Chromium entre o filtro original e a paleta, cobrindo todos os 256 tons sobre o mesmo fundo e opacidade: diferença máxima e média de pixels igual a zero. Script temporário: `/tmp/static-filter-check.cjs`; imagens: `/tmp/static-filter-before.png` e `/tmp/static-filter-after.png`. Isso valida a transformação de cor; não é uma comparação pixel a pixel de duas sequências aleatórias completas.

### Diálogo Red

A preferência de movimento reduzido passa a ser acompanhada em tempo real pelo hook compartilhado. Ao ativá-la durante a digitação, a resposta completa aparece imediatamente e o temporizador é cancelado. Um teste verifica que o texto deixa de receber escritas após essa mudança.

### Blue

Foram mantidas e revalidadas as otimizações da rodada anterior: texturas de nuvens e restauração das galerias. Resultados e comparações em [blue-performance-optimization-2026-09-23.md](blue-performance-optimization-2026-09-23.md).

## Desempenho

Produção local: `http://127.0.0.1:3100`, Chromium 153.0.8010.12 headless, SwiftShader, CPU 6× mais lenta, DPR 1, altura 900 px, sem limitação de rede. São cadências de `requestAnimationFrame` em Hz, **não FPS apresentados pela GPU**.

### Ruído da introdução

Três contextos novos por largura e versão. O observador registra intervalos somente enquanto o estado é `static-noise`, cuja duração nominal é 3,5 segundos. A primeira rodada de cada perfil também captura uma imagem durante a amostra; esse custo afeta a rodada. Valores abaixo são medianas das três repetições, não um estudo estatístico entre dispositivos.

| Largura | Antes | Depois |
| ------- | ----: | -----: |
| 1440 px | 29,14 |  51,15 |
| 390 px  | 59,72 |  59,72 |

Ganho local observado no desktop de aproximadamente 76%. O perfil mobile já estava próximo de 60 Hz.

### Red

Uma amostra exploratória de seis segundos por cenário/largura, após quatro segundos de estabilização; rolagem programática do topo ao fim. Estas medições foram feitas antes das mudanças no diálogo e não representam uma comparação antes/depois da Red.

| Largura | Repouso | Rolagem |
| ------- | ------: | ------: |
| 1440 px |   50,22 |   35,40 |
| 390 px  |   60,00 |   57,18 |

A chuva Matrix já limita o desenho e responde a visibilidade e movimento reduzido; seu código não foi alterado nesta rodada.

## Validação visual e funcional

- Compilação de produção/TypeScript, ESLint e 20 testes unitários passaram.
- Antes das mudanças, a suíte completa de navegador passou com 43 testes e três pulos intencionais no perfil mobile.
- Acrescentados testes para percorrer toda a introdução sem pular etapas e para interromper a digitação da Red ao ativar movimento reduzido.
- Após as mudanças, a suíte completa terminou com **47 testes aprovados e três pulos intencionais** no perfil mobile, em 2,5 minutos. Inclui introdução natural desktop/mobile, transições, reconsideração, galerias, teclado, modal, currículo e recuperação do erro 404.
- Verificação responsiva adicional de Blue e Red em 320, 768, 1024 e 1440 px, altura 900 px, com movimento reduzido. Percorridas as seções, capturados hero, stack, seleção e diálogo. Oito combinações sem erro de JavaScript registrado e sem overflow horizontal no ponto final da checagem.
- Capturas inspecionadas incluem ruído otimizado desktop, Red hero desktop/mobile, Red página completa, seleção 320 px, diálogo 320 px, hero Red 1024 px, stack Red 768 px e stack Blue 1024 px. Sem alteração visual indesejada identificada nessas capturas.

## Artefatos

- Dados brutos: `app-performance-before-2026-09-23.json` e `app-performance-after-2026-09-23.json`.
- Resultado responsivo: `app-responsive-validation-2026-09-23.json`.
- Scripts temporários: `/tmp/app-audit.cjs`, `/tmp/app-responsive-check.cjs`.
- Capturas: `/tmp/app-audit-before/`, `/tmp/app-audit-after/`, `/tmp/app-responsive-check/`.

Para a suíte completa, com o servidor de produção na porta 3100:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npx playwright test --workers=2 --reporter=line
```

## Limites

A validação cobre os fluxos locais disponíveis em Chromium, incluindo o perfil mobile emulado. Não inclui Safari/Firefox, hardware fraco físico, Lighthouse/Core Web Vitals, rede lenta ou navegação nos sites externos dos projetos. Não é garantia de fluidez em qualquer máquina. A Blue ainda é o trecho mais exigente nas medições salvas.

Os dados e relatórios ficam no projeto; capturas e scripts em `/tmp` podem ser removidos pelo sistema. Nenhuma publicação foi realizada.

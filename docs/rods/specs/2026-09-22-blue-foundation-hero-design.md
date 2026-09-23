# Pílula Azul — Foundation e Hero

## Escopo

Implementação das Fases 1 e 2 do plano anexado, seguindo a recomendação apresentada e a instrução do usuário para continuar.

- Paleta azul profunda (#0a0e27 / #0f1438), texto claro, cyan e rosa pastel.
- Navbar com superfície escura translúcida, estado de scroll e adaptação para 320 px.
- Fundo global com oito/seis/quatro nuvens e sete/cinco/três feixes conforme a largura.
- Feixes com coordenadas renovadas a cada oito segundos; temporizador suspenso com documento oculto ou movimento reduzido.
- Hero com entrada escalonada após a transição existente, halo com parallax ao mouse e ações com feedback visual.
- Abertura CRT com expansão do sinal e pílulas com acabamento e contraste refinados.
- Adequação das superfícies existentes à nova paleta, mantendo a estrutura dos produtos e galerias.
- CSS e APIs existentes, sem dependências novas. Som opcional não incluído.

## Validação

- TypeScript, lint e compilação de produção passaram.
- Vitest: 20 testes passaram.
- Playwright: três testes existentes (teclado, azul mobile e galerias desktop) passaram.
- Novo cenário de feixes responsivos e movimento reduzido: passou em Chromium e no perfil mobile.
- Inspeção visual em Chromium: http://127.0.0.1:3000 nas larguras 320, 390, 480, 768, 1024 e 1440 px, altura 900 px.
- Fluxos: abertura CRT, escolha azul por Enter, hero, Sobre, Projetos e mudança de movimento reduzido em tempo real.
- Página de erro: http://127.0.0.1:3000/does-not-exist.
- Capturas temporárias inspecionadas: /tmp/blue-{320,390,480,768,1024,1440}.png, /tmp/blue-about.png, /tmp/blue-projects.png, /tmp/blue-404.png, /tmp/blue-pills.png e /tmp/blue-boot.png.
- Corrigido corte do último item da navbar em 320 px. Nenhum overflow horizontal de documento nas larguras verificadas; nenhum pageerror nos fluxos visuais.

## Limites

Fases 4–6 (novos filtros, modais, redesenhos e transições globais) continuam fora desta entrega. Não foram medidos Lighthouse, FPS ou conformidade WCAG completa, nem testados Safari e Firefox.

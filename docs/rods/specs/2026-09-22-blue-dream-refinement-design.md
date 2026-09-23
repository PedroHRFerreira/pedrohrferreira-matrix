# Refinamento do mundo dos sonhos

Substitui as decisões anteriores de paleta escura e filtros. O usuário pediu retirar filtros, números decorativos e esferas, clarear o ambiente e trocar os feixes por código verde descendente e sutil. Após a pergunta sobre ambos os filtros, pediu continuar; aplicado a Projetos e Stack.

- Removidos campos de busca, seletores, contadores e estados de filtro.
- Cards sem numeração ou visual vazio; imagens reais continuam suportadas.
- Removidas esfera de Sobre e anéis do hero; layout de Sobre usa uma coluna.
- Paleta azul-claro, lavanda e rosa suave, com texto escuro e navegação clara.
- Código decorativo real em pequenos blocos, descendo do topo até sair da tela, opacidade máxima 0,16, ciclo de 22 segundos com intervalo invisível. Posição só muda entre ciclos. Sem brilho ou linhas luminosas.
- Respeita movimento reduzido e pausa quando a aba está oculta.
- Mantidas galerias horizontais, modal e navegação por teclado.

Validação: lint e TypeScript passaram; oito cenários E2E passaram (dois cenários desktop ignorados no perfil mobile). Chromium em http://127.0.0.1:3000 nas larguras 1440, 768 e 390 px. Capturas /tmp/dream-{hero,about,projects,stack}-{largura}.png e /tmp/dream-code.png. Sem overflow de documento ou pageerror. Confirmado deslocamento vertical crescente de um bloco durante a animação. Lighthouse e auditoria completa de acessibilidade não executados.

## Correção solicitada: binário único e nuvens

O usuário esclareceu que o efeito deve ser uma única coluna de dígitos binários, em posições aleatórias, e pediu nuvens mais visíveis e rápidas. Substituídos os fragmentos de programação por uma coluna de 24 dígitos (um por linha). Há apenas um elemento animado, com ciclo de 14 segundos, descida, desaparecimento e nova posição aleatória entre ciclos. As nuvens usam sua opacidade integral, blur de 4 px e duração de deslocamento reduzida a 40% da anterior; ampliadas no celular.

Lint, TypeScript e seis testes E2E passaram. Chromium em 1440, 768 e 390 px, sem overflow ou pageerror. Capturas /tmp/dream-code.png e /tmp/dream-hero-390.png inspecionadas; deslocamento da coluna confirmado de cima para baixo. Movimento reduzido continua desativando a animação.

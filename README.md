# Pedro Henrique Rodrigues — Matrix Experience

Portfólio cinematográfico em português construído com Next.js, React, TypeScript, Sass e GSAP. A
experiência começa em um terminal CRT, oferece duas realidades visuais e apresenta a mesma
trajetória profissional em ambas.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Validação completa:

```bash
npm run format:check
npm run lint
npm test
npm run build
npm run test:e2e
```

## Conteúdo

O conteúdo profissional em português vive em `src/config/portfolio.ts` e foi consolidado a partir
do currículo aprovado. O PDF público fica em `public/curriculo-pedro.pdf`. As experiências Red e
Blue compartilham o mesmo conteúdo tipado, mas preservam composições visuais próprias.

## Movimento e acessibilidade

- CSS cuida de nuvens, scanlines, fades e microinterações ambientes.
- GSAP é reservado às sequências cinematográficas e à travessia horizontal dos projetos.
- A página mantém o percurso vertical → horizontal → vertical em desktop e mobile.
- `prefers-reduced-motion` remove a travessia animada e apresenta os projetos em fluxo vertical.
- A introdução pode ser pulada, e teclado, foco visível e link de salto cobrem os fluxos principais.

## Ciclo da realidade

A realidade escolhida é salva no navegador. Em uma nova visita, a experiência retorna diretamente
à última escolha; **Rever escolha** apaga essa preferência e volta à seleção das pílulas.

## Lançamento

Veja [docs/launch-checklist.md](docs/launch-checklist.md).

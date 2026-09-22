# Checklist de lançamento

## Conteúdo e identidade

- [x] Publicar nome, cargo, trajetória, projetos e stack com base no currículo aprovado.
- [x] Disponibilizar o currículo em `/curriculo-pedro.pdf` nas duas realidades.
- [x] Manter toda a experiência exclusivamente em português.
- [ ] Confirmar os links específicos de repositório ou demonstração de cada projeto.
- [ ] Confirmar e-mail profissional, localização pública e disponibilidade.
- [ ] Aprovar imagem de Open Graph e validar sua prévia.

## Experiência e acessibilidade

- [x] Não oferecer controle para pular a introdução; respeitar `prefers-reduced-motion` com fluxo simplificado.
- [x] Persistir a última realidade e oferecer **Rever escolha**.
- [x] Manter a travessia vertical → horizontal → vertical em desktop e mobile.
- [x] Remover caracteres literais dos glitches das nuvens.
- [x] Manter um único link **Ir para o conteúdo**.
- [ ] Validar teclado e leitor de tela no endereço de produção.

## Qualidade e produção

- [ ] Executar `npm run format:check`, `npm run lint`, `npm test`, `npm run build` e
      `npm run test:e2e` na revisão final.
- [ ] Testar desktop, mobile e movimento reduzido sem erros no console.
- [ ] Executar Lighthouse e validar Core Web Vitals em um aparelho móvel intermediário.
- [ ] Publicar o build de produção e confirmar HTTPS e redirecionamento entre domínio raiz e `www`.
- [ ] Confirmar `pedrohr.dev` nos metadados ou substituí-lo pelo domínio final.
- [ ] Adicionar o domínio final ao GitHub, LinkedIn e currículo.

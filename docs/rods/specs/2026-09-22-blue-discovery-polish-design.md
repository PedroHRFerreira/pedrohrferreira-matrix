# Pílula Azul — descoberta e acabamento

O usuário confirmou manter a rolagem horizontal no desktop. Stack e projetos continuam verticais em dispositivos de toque e com movimento reduzido.

## Entrega

- Stack: busca, seleção de categoria, ícones e explicações acessíveis; estado vazio com limpeza dos filtros.
- Projetos: busca e filtro por tecnologia, detalhes em dialog nativo, navegação entre resultados, ampliação quando houver imagem cadastrada.
- Recalcular travessias horizontais quando os resultados mudarem; restaurar posição de leitura ao filtrar.
- Footer: links sociais com feedback, retorno ao topo e acabamento visual.
- Transições: entradas de seção, progresso global e respeito à preferência de movimento em tempo real.
- Reutilizar conteúdo e bibliotecas existentes; nenhum dado profissional ou imagem fictícia.

## Aceitação

Validar filtros com zero, um e vários resultados, teclado, Escape e retorno de foco do modal, rolagem horizontal após limpar filtros, mobile, movimento reduzido, lint, tipos, testes e build.

## Implementação e validação

- Componente compartilhado de movimento observa alterações diretas nos cards, recria os contextos GSAP e reposiciona a seção durante filtragem. Foco por teclado desloca a galeria até o card ativo.
- Modal separado da apresentação dos cards; dialog nativo, ciclo de foco, Escape, retorno explícito ao acionador e bloqueio de scroll do fundo.
- Stack com explicações por hover, foco e toque, além de conteúdo expansível por categoria.
- Indicador global usa eventos passivos e requestAnimationFrame; entradas de seção são canceladas quando movimento reduzido é ativado. Footer também acompanha essa preferência.
- Lint, TypeScript/build e 20 testes unitários passaram.
- E2E: 11 execuções relevantes passaram (9 na rodada de regressão + 2 para recálculo e foco em cards fora da tela). Casos exclusivamente desktop foram ignorados no perfil mobile.
- Chromium: http://127.0.0.1:3000, larguras 320, 390, 480, 768, 1024 e 1440 px; altura 900 px. Filtros, estados vazios, modal, Stack e footer conferidos. Sem overflow de documento ou pageerror.
- Capturas temporárias em /tmp/discovery-{projects,stack,modal,footer}-{largura}.png. Corrigidos rótulo de categoria, scroll interno que consumia a rolagem da galeria, ciclo e restauração do foco no dialog e contraste de tags no modal.
- Limites: os projetos atuais não possuem imagens; a ampliação está condicionada a uma imagem cadastrada e não foi validada com conteúdo real. Sem medição Lighthouse, FPS ou auditoria WCAG completa; sem validação em Firefox/Safari. O site é uma página única: a entrega anima seções, sem introduzir rotas ou transições entre páginas inexistentes. Inclinação 3D opcional não foi adicionada.

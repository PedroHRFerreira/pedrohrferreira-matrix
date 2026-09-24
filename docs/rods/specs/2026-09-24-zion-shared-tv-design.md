# Mundo real na TV da abertura

## Escopo confirmado

O usuário pediu que mensagens e minigame reutilizem a TV da abertura e confirmou que o responsivo mantém as mensagens, pulando somente o jogo. Os complementos pedem o aviso de Enter exatamente como o inicial, sprites existentes de Neo/agentes, arte pixelada e uma porta que abre por aproximação.

- A mesma TV, terminal, tipografia, cursor e efeito de digitação são compartilhados com a abertura.
- Desktop: `[ PRESSIONE ENTER PARA CONTINUAR ]`; Enter na segunda mensagem inicia imediatamente a fuga.
- Até 48rem ou com ponteiro de toque: sem arena; `[ IR PARA O MUNDO REAL ↵ ]` após a segunda mensagem, no mesmo estilo de botão da abertura.
- O jogo ocupa a tela interna inteira, com instruções compactas no canto.
- Reutilizar os sprites pixelados de Neo e dos agentes do footer; piso e obstáculos também pixelados.
- Porta vertical com moldura, painéis, maçaneta e luz no interior. Reutiliza a animação de dobradiça do footer e abre ao aproximar Neo.
- Enter retoma uma fuga pausada e reinicia após captura.
- Preservar mensagens e recuperação de carregamento; aguardar a digitação e tempo de leitura antes do destino.
- Usar “Mundo real” como nome visível do destino.

## Organização

`Television`, `Terminal` e `TerminalContinue` concentram o visual compartilhado. `useTerminalTyping` reaproveita o comportamento anterior da abertura. `PixelCharacters` compartilha os desenhos existentes, sem alterar as regras dos jogos do footer. A máquina de estados permanece intacta: o botão responsivo enfileira a entrada e a conclusão da fuga, nessa ordem, sem renderizar a arena.

## Verificação

- 41 testes em EntryExperience, RealityPassage, ZionSequence e ExperienceTemplate aprovados.
- TypeScript, ESLint e formatação aprovados.
- E2E desktop e Pixel 7 aprovados: digitação real, Enter, captura, nova tentativa, porta abrindo, botão responsivo, travessia, destino e recarregamento.
- Prévia: http://localhost:3000/.
- Larguras conferidas: 320, 390, 412, 768, 844, 1024, 1440 e 1920 pixels; inclui paisagem 844×390.
- Capturas temporárias em `/tmp/world-real-*.png`: digitação, mensagens, botão responsivo, jogo pixelado, captura, porta aberta e carregamento.

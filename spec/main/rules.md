# Regras do projeto

- When a Figma design exists, always follow its responsive pattern.
- When a Figma design exists or the project is frontend, validate the result directly in a real browser with the `visual-check` skill before marking it done.
- If `visual-check` alone cannot complete the interaction, a browser MCP such as Playwright MCP is acceptable as a last resort while keeping workflow behavior in skills and MCP tools primitive.
- Na Blue Page, a corrupção da Matrix começa na primeira falha e acumula camadas persistentes nas três primeiras tentativas (~15%, ~40%, ~85%). Nunca resetar visualmente entre tentativas. Combinar código, CRT, scanlines, aberração cromática e glitch, preservando legibilidade, pausa e movimento reduzido. Recarregar pode reiniciar a jornada; a quarta captura mantém a consequência narrativa para Zion.
- Otimizações de animação devem preservar o design, o layout, os efeitos narrativos e as regras dos minigames. Medir antes/depois com CPU limitada e comparar o resultado visual em desktop e celular; não retirar efeitos para simular ganho de desempenho.

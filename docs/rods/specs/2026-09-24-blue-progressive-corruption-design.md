# Corrupção progressiva da Blue Page

Desenho confirmado pelo usuário com “continue”.

Capturas acumulam níveis 0 / 15 / 40 / 85% durante a visita. Primeiro nível:
interferência e código nas bordas; segundo: invasão lateral e corrupção textual;
terceiro: domínio visual. Quarta captura mantém revelação e Zion existentes.
Combinar scanlines, aberração cromática, vinheta CRT, glitch e código sob a interface.
Nunca retirar camadas entre tentativas. Recarregar reinicia a jornada em memória.
Pausa e movimento reduzido mantêm a corrupção estática. Preservar legibilidade,
controles, dados profissionais e alterações anteriores. Validar falhas reais,
progressão, pausa, movimento reduzido e larguras móveis/desktop em Chromium.

## Validação realizada

- TypeScript sem erros; ESLint dos componentes e do teste sem erros.
- 14 testes de hook/roteamento passaram.
- Playwright: 2 testes passaram (Chromium desktop e Pixel 7), em http://localhost:3000.
- Capturas reais 1/2/3 acumulam 15/40/85%; pausa conserva nível; quarta abre revelação; recarregar zera progresso.
- Larguras 320, 390, 768, 1024 e 1440 sem overflow horizontal.
- Imagens temporárias inspecionadas: /tmp/blue-chromium-1.png, /tmp/blue-chromium-2.png, /tmp/blue-chromium-3-motion.png, /tmp/blue-mobile-1.png e /tmp/blue-mobile-3-motion.png.
- Movimento reduzido mantém código e scanlines estáticos; movimento normal mantém conteúdo legível após animação de entrada.
- Primeiro ensaio bloqueado pelo sandbox; origem 127.0.0.1 não completou entrada. Teste final usou localhost fora do isolamento.
- Ajustado o teste móvel para aguardar rolagem antes de iniciar o jogo, que cancela corretamente ao rolar.

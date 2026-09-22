# Single-column terminal shell — design

## Decision

The Red experience becomes a single-column terminal shell. A scene is no longer a portfolio page with terminal accents: it is a bordered console window that contains title, command history, output and input in one continuous surface.

## Layout

- Full-height dark terminal frame with a system header and thin Matrix-green chrome.
- Command history flows from the scene heading into the current output without card gaps.
- The command prompt is visually anchored at the bottom of the terminal surface.
- Project, experience and stack panels use console output styling: no floating-card shadows or independent rounded blocks.
- Small status indicators and scan lines remain secondary to readable professional content.

## Responsive behavior

- Desktop uses a spacious single terminal column.
- Mobile retains the same order and chrome, with a compact header and naturally flowing prompt.
- Reduced motion removes blinking and panel transition effects.

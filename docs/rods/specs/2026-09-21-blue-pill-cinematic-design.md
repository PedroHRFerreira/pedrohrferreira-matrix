# Blue Pill Cinematic Experience — Approved Design

## Scope

Refactor the Blue Pill as a distinct three-moment journey while preserving the existing portfolio content, anchors, locale behavior, and links:

1. Vertical arrival in an apparently perfect world.
2. A continuous desktop traversal where vertical page progress drives a wide horizontal sequence.
3. A natural return to vertical reading and a subtly doubtful ending.

The final visual-direction addendum overrides earlier Matrix-fault ideas: there are no green beams, character rain, or floating code over the sky. A fault may affect only a small region inside one cloud texture, lasts about 0.5 seconds, never starts on load, and each selected cloud faults at most once.

## Visual direction

- Photorealistic cinematic sky and volumetric cloud material, with atmospheric depth and restrained sunrise light.
- Sophisticated glass surfaces and generous controls; blue, soft white, blush, and atmospheric gold are primary.
- Matrix green is reserved for brief, low-opacity texture corruption.
- Clouds move at different speeds and depths without abrupt visible restarts.
- The experience remains readable if backdrop imagery or animation fails.

## Interaction and accessibility

- Desktop with fine pointer: native vertical scrolling maps to horizontal movement through large project environments using the existing GSAP/ScrollTrigger dependency.
- Coarse pointer, narrow screens, and reduced motion: the same content becomes a normal vertical sequence with no independent horizontal scrollbar or scroll trap.
- Movement uses transform and opacity, dimensions refresh with the viewport, and all observers/timers are cleaned up.
- Red Pill composition and behavior remain isolated.

## Red Pill reference

The open Figma establishes the Red direction for a subsequent implementation pass: near-black editorial system UI, compact hero, three featured-project panels, spacious pacing, three stack panels, a wide terminal block, and a typographic “Disconnect from the Matrix” ending. Blue does not reuse that composition.

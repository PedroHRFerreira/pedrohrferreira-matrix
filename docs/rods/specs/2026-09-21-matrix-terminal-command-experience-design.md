# Matrix terminal command experience — design

## Objective

Rework the Red portfolio into a full-screen Matrix interface while preserving the current rain background, reality selection, footer transmission and reduced-motion fallback. The professional content remains primary; Matrix effects provide navigation, rhythm and context rather than decoration alone.

## Narrative

The scroll order becomes a sequence of terminal scenes:

1. **Identity** — existing hero remains the immediate entry point.
2. **Profile** — `profile --inspect` prints the professional summary.
3. **Experience** — `experience --open <entry>` selects one career entry at a time and exposes its details.
4. **Projects** — `projects --select <project>` focuses a project in the centered horizontal stage.
5. **Capabilities** — `stack --scan <domain>` moves through Front-end, Back-end, Tools, and Architecture/Data/AI.
6. **Transmission end** — the existing footer stays the final contact surface.

## Interaction model

- Scroll changes the active scene and drives the terminal composition with reversible GSAP timelines.
- Each scene exposes real command buttons, usable by pointer and keyboard. Commands update the scene's command line and selected content; they do not navigate away or create modal layers.
- The first option in each scene is selected by default so every scene is meaningful without interaction.
- Keyboard focus must remain visible. Buttons use semantic labels and pressed state.
- `prefers-reduced-motion` disables pinning/scrubbed effects and displays every command panel in a readable vertical flow.

## Visual system

- Full-screen scene frame: thin green system lines, prompt, command history and one focused content panel.
- Matrix-specific accents are constrained to cursor blinks, scan lines, status signals and short terminal output. No decorative text obscures professional content.
- Experience uses a vertical signal rail; Projects retain a centered horizontal track; Stack uses a modular system map rather than a grid of equal cards.

## Component boundaries

- A shared client `TerminalScene` owns command state, keyboard/pointer activation and terminal frame semantics.
- Red section components remain responsible for converting portfolio content into scene-specific command options and content panels.
- Existing `RedSectionMotion` retains scroll ownership; it only coordinates scene entry and must not own command selection state.
- `HorizontalProjectsMotion` remains the single owner of the project track/pin behavior.

## Acceptance criteria

- Experience, Projects and Stack no longer render as a long sequence of equal blocks.
- Every scene has one focused content panel and at least one meaningful command execution.
- Project cards remain horizontally traversable and vertically centered while motion is enabled.
- The Red footer remains the contact endpoint.
- Mobile, keyboard navigation, and reduced-motion flow are usable.

# Terminal navigation — design

## Decision

Replace scroll-pinned progression and the automatic horizontal project track with explicit terminal navigation. Scrolling remains free and natural; it only moves the user between scenes.

## Controls

- **Enter** advances from the scene nearest the viewport center to the next scene with smooth scrolling.
- **Left/Right arrows** select the previous/next command in the active scene.
- Each scene includes a visible prompt. Submitting `next` advances; a command identifier or ordinal selects content, e.g. `projects 2`, `stack backend`, or `freelancer`.
- Inputs, links and buttons retain their native keyboard behavior; global shortcuts do not hijack keys while those controls are focused.

## Project behavior

Projects stop being a scroll-driven horizontal carousel. The selected project replaces the focused panel with a short terminal transition. Commands and arrow keys become the reliable way to traverse projects.

## Accessibility and motion

- All controls remain semantic buttons or form inputs.
- Reduced-motion mode keeps free scrolling and removes panel/cursor animations.
- The prompt announces command outcomes without forcing a focus change.

## Acceptance criteria

- No section pins or consumes the user's vertical scroll.
- Enter advances between terminal scenes.
- Arrows and commands switch content within the active scene.
- Projects remain fully usable without horizontal scrolling.

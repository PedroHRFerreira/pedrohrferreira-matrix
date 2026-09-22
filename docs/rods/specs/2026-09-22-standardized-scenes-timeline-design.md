# Standardized scenes and interactive timeline — approved design

## Shared scene contract

Profile, Experience, Projects, and Stack use the same outer composition:

1. compact system status;
2. section eyebrow, title, and optional description;
3. compact command dock;
4. a consistently sized content workspace;
5. the same panel transition and keyboard/typed-command behavior.

The shell stays consistent while the visualization inside the workspace remains specific to the content.

## Experience timeline

- A persistent vertical signal rail shows every career milestone, period, and organization.
- Selecting a milestone updates a focused detail surface beside the rail.
- The active point is highlighted and connected to the remaining chronology.
- On narrow screens, the rail becomes a compact vertical selector above the detail.
- Reduced-motion mode renders every experience in document flow.

## Acceptance criteria

- Every Red content section has matching width, header rhythm, command dock, and workspace spacing.
- Experience reads as a chronology before interaction.
- All three career milestones remain visible as timeline choices.
- The focused detail does not create a large empty gap before Projects.
- Desktop and mobile remain keyboard-accessible and free of horizontal overflow.

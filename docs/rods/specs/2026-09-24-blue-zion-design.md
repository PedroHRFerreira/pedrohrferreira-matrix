# Approved Blue → Zion experience

## Scope approved by the user

Implement the complete journey and validate responsive behavior at the end.
The destination is the professional portfolio, presented inside an illustrated
apocalyptic world. Preserve real profile, experience, projects and contact data.
The implementer may choose noticeable changes to the Blue narrative copy.

## Journey

1. First and second Blue game captures keep the existing return behavior.
2. Third capture keeps the Blue page active but corrupts it: colored copy becomes
   green, selected narrative changes, more code beams, dark clouds and storm.
3. Fourth capture ends the simulation and moves into the television revelation.
4. First message: “A realidade pode ser uma coisa assustadora para algumas pessoas.”
5. Separate Enter/touch command reveals: “Isso não é real, e o mundo real fica em algum outro lugar.”
6. Another deliberate command starts the television chase. Neon must escape
   multiple agents through the sole door, Zion. A capture retries the chase only.
7. Reaching Zion starts loading with: “Não sabemos quem deu o primeiro golpe, se fomos nós ou eles. Mas sabemos que fomos nós que manchamos os céus.”
8. Reveal the new portfolio with blackened skies above a ruined city, destroyed
   houses and burned cars.

## Approved visual and motion direction

Serious, frightening illustrated horror. Rough ink/charcoal texture, deep shadows,
slightly distorted architecture and oppressive skies. Avoid photorealistic AI
polish and childish cartoon treatment. Continuous wind-slanted rain, small puddles
and restrained splashes. Silent diffuse cloud flashes at irregular intervals
(approximately 7–14 seconds), quickly illuminating rain and ruins then fading.
Keep text legible and support reduced motion, touch controls and paused effects.

## No saved progress

All progress is held only in React memory. Refreshing starts the entry experience
again, with zero captures. Do not use localStorage, sessionStorage, cookies or URL
parameters to restore the journey.

## Domain integration contract

`useExperience` preserves existing entry/red/blue behavior and adds
`blueCaptureCount`, `blueCorrupted`, `registerBlueCapture()` and
`completeZionChase()`. The third capture remains `ready-blue`; the fourth becomes
`blue-revelation-one`. `advanceSequence()` moves to `blue-revelation-two`, then
`zion-chase`. `completeZionChase()` moves to `zion-loading`.
`completeTransition()` completes that loading as `ready-zion`.

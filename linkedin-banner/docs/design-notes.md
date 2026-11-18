# Design notes

## Format

- Canvas: 1584 × 396 px, the 4:1 size LinkedIn recommends for a profile banner. Export a 2x copy (3168 × 792 px) for sharper text.
- LinkedIn recompresses uploads, so export PNG and keep the file small.

## Safe zone

LinkedIn crops the banner and places the profile photo over it. Approximate values on the 396 px canvas, measured against a desktop preview:

| Area | Rule |
|---|---|
| Top and bottom | about 64 px may be cropped on desktop; keep text and key shapes between y = 64 and y = 332 |
| Left | the profile photo covers roughly x < 260 in the lower left; keep text and key shapes to the right of that |

`npm run safe-zone` draws these on top of the banner so a change can be checked quickly.

## Concept: the V model

The nine stages are the classic software-engineering V model. The left arm holds the design phases, coding is the bottom, and the right arm holds the test phases. The middle stage is the bottom of the V.

| Arm | Stages |
|---|---|
| Left, going down | Requirements Analysis, System Design, Architecture Design, Module Design |
| Bottom | Coding |
| Right, going up | Unit Testing, Integration Testing, System Testing, Acceptance Testing |

Dashed lines link each design phase to the test phase that checks it:

| Level | Left (design) | Right (testing) |
|---|---|---|
| 1 | Requirements Analysis | Acceptance Testing |
| 2 | System Design | System Testing |
| 3 | Architecture Design | Integration Testing |
| 4 | Module Design | Unit Testing |

The two top lines stop before the headline and subline. Longer stage names wrap onto two lines inside the arrows.

## Look

- Background: light navy (`#1f3a63`) with a soft glow behind the headline. No green.
- Stage colours run warm to cool: coral, amber, cream, sky blue, periwinkle.
- Arrows are rounded, slightly transparent, with a glossy top highlight, a thin white edge, a drop shadow and a faint reflection.
- Fonts: Geist, then Inter, then Segoe UI. Text is drawn by the browser that exports, so the look depends on which of these fonts is installed.
- Background icons: 20 line icons (agent, orchestration, LLM, retrieval, container, code, neural network, chip, control loop, robot arm, car, drone, shield, monitor, waveform, gear, piston, sparkle, Stewart platform, muscle) at about 11% opacity, tilted and scaled slightly. They fade behind the headline and are kept off the keyword line.

## Version history

1. Flat chevron row on a deep green background.
2. V-model layout on green.
3. Light navy background, dashed links, glass arrows.
4. Background icon pattern; keyword line from the profile summary; subline "From Idea to Operation".

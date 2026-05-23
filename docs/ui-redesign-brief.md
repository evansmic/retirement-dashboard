docs/ui-redesign-brief.md

# Retirement Dashboard UI Redesign Brief
## Project
Canadian Local-First Retirement Planner
ProjectionLab-inspired retirement planning platform
---
# Core Product Philosophy
This product is NOT a spreadsheet replacement.
This product is:
- guided financial decision software
- calm retirement planning software
- local-first private planning software
- Canadian-specific retirement intelligence
The UI should feel:
- calm
- intelligent
- trustworthy
- premium
- emotionally safe
- transparent
- analytical but approachable
Avoid:
- intimidating financial UX
- clutter
- “tax software” aesthetics
- alarmist language
- excessive chart overload
- overly playful fintech startup visuals
The app should answer:
# “Am I okay?”
before anything else.
---
# Core UX Principles
## 1. Progressive Disclosure
Never overwhelm users with every field at once.
Use:
- grouped sections
- collapsible advanced settings
- step-based guidance
- contextual help
- “why this matters” explanations
---
## 2. Guided Confidence Building
Users should feel increasing confidence as they complete more information.
Examples:
- confidence score
- accuracy improvement prompts
- recommendation impact indicators
- projection stability language
---
## 3. Calm Financial Language
Avoid:
- failure
- collapse
- disaster
- impossible
- unsafe
Prefer:
- needs optimization
- stress-sensitive
- projected gap
- opportunity to improve
- moderate confidence
---
## 4. Decision Clarity Over Data Density
The goal is not maximum charts.
The goal is:
- clarity
- actionability
- trust
- decision comparison
Every screen should help users:
- understand tradeoffs
- test scenarios
- improve confidence
---
# Design System Direction
## Visual Style
Modern premium SaaS dashboard with:
- glassmorphism
- layered surfaces
- soft shadows
- subtle gradients
- muted neutral palette
- strong typography hierarchy
- calm motion
Visual inspiration:
- ProjectionLab
- Linear
- Arc Browser
- modern Bloomberg terminal aesthetics
- Apple glassmorphism restraint
Avoid:
- neon fintech styling
- excessive saturation
- gaming aesthetics
- crypto dashboard styling
---
# Color System
## Primitive Tokens
### Navy / Slate
- slate-950: #020617
- slate-900: #0f172a
- slate-800: #1e293b
- slate-700: #334155
### Blue
- blue-500: #3b82f6
- blue-400: #60a5fa
### Green
- green-500: #10b981
### Amber
- amber-500: #f59e0b
### Red
- red-500: #ef4444
### Neutral
- white: #ffffff
- off-white: #f8fafc
- gray-100: #f1f5f9
- gray-300: #cbd5e1
- gray-500: #64748b
---
# Semantic Tokens
## Backgrounds
- bg-app
- bg-surface
- bg-surface-elevated
- bg-glass
## Text
- text-primary
- text-secondary
- text-muted
- text-success
- text-risk
- text-warning
## Borders
- border-subtle
- border-glass
## Status
- status-success
- status-warning
- status-risk
- status-neutral
---
# Glassmorphism Style
Use restrained glassmorphism.
Requirements:
- backdrop blur
- semi-transparent surfaces
- subtle borders
- soft elevation
Avoid:
- extreme transparency
- unreadable overlays
- excessive blur
Suggested values:
- background: rgba(255,255,255,0.72)
- border: rgba(255,255,255,0.35)
- blur: 16px
---
# Typography
Typography should feel:
- analytical
- premium
- calm
Use:
- strong hierarchy
- large numeric displays
- restrained body copy
Recommended scale:
- H1
- H2
- H3
- H4
- Display Number
- Body
- Label
- Caption
---
# Motion Principles
Motion should feel:
- stable
- calm
- intelligent
Avoid:
- bouncing
- overshooting
- flashy animations
Animation timing:
- 150ms micro interactions
- 250ms standard transitions
- 400ms panel transitions
Charts should animate slowly and subtly.
---
# Responsive Strategy
Support:
- Desktop
- Tablet
- Mobile
Breakpoints:
- Desktop: 1280+
- Tablet: 768
- Mobile: 375
Mobile experience should prioritize:
- stacked cards
- collapsible sections
- progressive disclosure
- simplified chart layouts
---
# Information Hierarchy
Dashboard order:
1. Hero Verdict
2. Key Retirement Metrics
3. Recommendations
4. Risk Summary
5. Timeline / Projection Charts
6. Advanced Analytics
7. Detailed Tables
The dashboard should answer:
- Can I retire?
- How confident is the plan?
- What should I improve?
- What are the biggest risks?
before showing advanced analytics.
---
# Core Components
## AppShell
Persistent shell with:
- Sidebar
- TopBar
- Content area
- Save state
- Responsive collapse behavior
---
# SidebarNav
Features:
- collapsible
- icon-based
- active state
- plan navigation
- calm visual hierarchy
Sections:
- Dashboard
- Cash Flow
- Scenarios
- Risks
- Stress Tests
- Assumptions
- Export
---
# TopBar
Include:
- plan name
- save state
- export button
- local-first status
- user/settings
---
# HeroVerdict
MOST IMPORTANT COMPONENT.
Purpose:
Answer:
# “Am I okay?”
Requirements:
- large calm headline
- success probability
- confidence level
- supporting explanation
- optional CTA
Example:
“You’re on track for retirement at 64.”
NOT:
“Your plan will fail.”
---
# MetricCard
Structure:
- label
- large number
- optional sparkline
- optional delta
- optional tooltip
Use:
- clean typography
- restrained color
- strong spacing
---
# RecommendationCard
Purpose:
Turn analysis into action.
Structure:
- recommendation title
- projected impact
- confidence level
- rationale
- tradeoffs
- test scenario CTA
Example:
“Delay CPP to age 70”
Impact:
“Estimated lifetime income increase: +$184,000”
---
# RiskCard
Purpose:
Communicate risks calmly.
Structure:
- risk title
- severity
- impact
- explanation
- actionable recommendations
Avoid alarmist language.
---
# ConfidenceMeter
Purpose:
Show projection reliability.
Example:
“Projection Confidence: Moderate”
Based on:
- completeness
- assumption quality
- variability
---
# IntakeField
Core reusable form component.
Variants:
- default
- tooltip
- helper text
- error
- success
- currency
- percentage
- province selector
- age picker
Features:
- helper explanations
- “why this matters”
- smart defaults
---
# EmptyState
Important for emotional UX.
Variants:
- no plan
- no scenarios
- no risks
- error state
Should feel:
- encouraging
- calm
- inviting
---
# SaveStatusPill
Important for local-first trust.
Examples:
- All changes saved locally
- Working offline
- Unsaved changes
- Syncing
---
# Simulation State Components
Required:
- calculating
- stale projection
- unsaved changes
- syncing
- recovering backup
- offline mode
---
# Intake Flow UX
The onboarding should NOT feel like tax software.
Flow:
1. Welcome
2. Quick profile
3. Financial snapshot
4. Lifestyle goals
5. Initial verdict
6. Confidence improvement loop
The system should provide meaningful projections quickly.
---
# Recommendation Philosophy
Recommendations should:
- reduce anxiety
- increase agency
- encourage exploration
Always support:
- rationale
- tradeoffs
- impact
- confidence
- scenario testing
Never mutate primary plans automatically.
Always:
- clone
- compare
- sandbox
---
# Local-First Philosophy
Privacy should feel visible.
Communicate:
- local saves
- offline functionality
- data ownership
- exportability
The user should feel:
“This is MY retirement plan.”
---
# Technical UI Implementation Requirements
IMPORTANT:
Preserve all existing retirement calculation logic.
This redesign is:
- UI
- UX
- architecture
- component system
NOT:
- calculation rewrites
---
# Frontend Architecture Direction
Preferred structure:
- reusable components
- semantic design tokens
- modular dashboard layout
- responsive patterns
- componentized states
---
# Initial Refactor Order
1. Design tokens
2. Global styles
3. App shell
4. Sidebar
5. Top bar
6. Core cards
7. Hero verdict
8. Recommendation system
9. Risk system
10. Intake redesign
11. Mobile refinement
12. Export experience
---
# Codex Instructions
When implementing:
- preserve existing business logic
- preserve calculations
- preserve data structures unless necessary
- focus on presentation and UX
- prioritize reusable components
- use semantic tokens
- avoid hardcoded colors
- maintain responsive layouts
- implement clean TypeScript props
- prefer maintainable architecture over rapid hacks
---
# Desired Emotional Journey
| Stage | Emotion |
|---|---|
| Welcome | Safety |
| Setup | Momentum |
| First Projection | Relief |
| Refinement | Engagement |
| Recommendations | Empowerment |
| Scenario Testing | Control |
| Risks | Calm Awareness |
| Export | Confidence |
---
# Final Product Goal
The product should consistently make users feel:
“I understand my retirement better now.”
That is more important than:
- more charts
- more complexity
- more technical inputs
- more analytics

---
# Visual Reference Mockups

The following images are reference boards for the later UI/UX phase. They should guide look, feel, hierarchy, and component language, but they are not binding implementation specs and should not override engine, persistence, non-advisory, or progressive-disclosure boundaries.

- `docs/assets/dashboard-mockup-gpt.png` — desktop design-system and dashboard reference.
- `docs/assets/mobile-screen-mockups.png` — full user journey and mobile-first flow reference.
- `docs/assets/ipad-mockups.png` — tablet/dashboard responsive layout reference.

Use these references to preserve:
- calm premium SaaS direction
- strong first-answer hierarchy
- local-first save/status visibility
- reusable intake field states
- responsive app shell patterns
- recommendation cards that remain review-oriented
- progressive disclosure from first answer to deeper analysis

Do not copy these patterns literally where they would:
- make Overview too dense
- imply statistical certainty without model support
- present optimizer output as advice
- hide Ontario/province scope
- weaken local backup reminders
- turn Details into a consumer-facing engineering checklist

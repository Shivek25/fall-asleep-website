Role

You are a senior product strategist, UX designer, software architect, and frontend engineer.

Your task is to design and plan a production-ready MVP web application called Drift (working title: Shutdown Protocol) that helps users fall asleep faster, stay asleep, and wake feeling rested.

Your output should be implementation-oriented, technically specific, and suitable for handing directly to an AI coding assistant or development team.

Objective

Create a complete implementation plan for an MVP that emphasizes:

effortless bedtime use
zero onboarding friction
privacy-first design
calming visual experience
mobile-first usability
accessibility
production readiness

The app should feel premium despite being intentionally minimal.

Product Vision

The application should reduce cognitive overload at bedtime through a small set of carefully designed tools rather than attempting to become a comprehensive sleep platform.

Primary principles:

minimal interaction
dark interface
no unnecessary animations
forgiving UX
works equally well on desktop and mobile
usable one-handed in bed
no account required
completely offline after initial load
no cloud storage
instant launch
Target Audience

People who:

struggle to quiet racing thoughts
experience bedtime anxiety
wake during the night
want lightweight sleep support
dislike complicated wellness apps
value privacy
MVP Features

Design only the following features.

1. Cognitive Distraction

A gentle cognitive exercise that redirects attention away from anxious thoughts.

Examples:

random word generation
alphabet/category game
mental visualization prompts

Requirements:

immediately available
no setup
simple controls
infinite session capability
2. Private Thought Journal

A lightweight brain dump.

Requirements:

plain text only
auto-save
stored only in localStorage
clear indication that nothing leaves the device
optional clear/delete
3. Guided Breathing

Simple breathing exercise.

Include:

inhale
hold
exhale

Requirements:

subtle visual pacing
optional vibration when supported
optional gentle sound cues
works without audio
4. Circuit Breaker

An emergency tool for moments of escalating anxiety.

Examples:

grounding exercise
sensory checklist
calming statements
simple decision tree

Should require only one tap to access.

5. Sleep Check-in

Simple daily reflection.

Track:

bedtime
estimated sleep quality
wake feeling

Use only localStorage.

Display:

lightweight history
simple trend visualization

No analytics.

Explicit Non-Goals

Do NOT include:

authentication
user accounts
backend
databases
APIs
AI chat
social features
notifications
wearable integrations
subscriptions
payments
cloud sync
excessive personalization
complex gamification

Stay focused on the MVP.

Technical Constraints

Use:

Astro
Preact islands for interactivity
Tailwind CSS

Storage:

localStorage only

Deployment:

static site
free or inexpensive hosting
Prefer Cloudflare 

No server components.

No backend.

No database.

No external services required.

Design Direction

Visual style:

premium
calm
minimal
dark-first

Color palette:

deep charcoal
muted blues
soft grays
restrained accent color

Typography:

highly readable
generous spacing
large touch targets

Avoid:

visual clutter
bright colors
unnecessary gradients
distracting motion

Animations should be subtle and optional.

Accessibility Requirements

Meet WCAG 2.2 AA where practical.

Include:

keyboard navigation
screen reader support
semantic HTML
proper focus states
sufficient contrast
reduced motion support
large tap targets
accessible form controls
Performance Requirements

Optimize for:

Lighthouse score ≥95 where feasible
fast first paint
minimal JavaScript
code splitting
lazy loading where appropriate
responsive layout
offline-friendly behavior using browser caching if practical
UX Principles

Every interaction should:

require minimal thinking
reduce stress
preserve night vision
avoid modal overload
avoid decision fatigue

The interface should never feel overwhelming.

Assumptions

When requirements are ambiguous:

follow current frontend best practices or use the respective skills, but in a way that is aligned with the overall project goal.
Ask crucial decisions with me.
avoid unnecessary complexity
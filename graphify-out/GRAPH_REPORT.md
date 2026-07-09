# Graph Report - FallAsleep  (2026-07-09)

## Corpus Check
- 13 files · ~68,009 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 60 nodes · 67 edges · 8 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f830cd6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Breathing Exercise|Breathing Exercise]]
- [[_COMMUNITY_Circuit Breaker|Circuit Breaker]]
- [[_COMMUNITY_Sleep Check-in|Sleep Check-in]]
- [[_COMMUNITY_Journal Storage|Journal Storage]]
- [[_COMMUNITY_Cognitive Shuffle|Cognitive Shuffle]]
- [[_COMMUNITY_Config|Config]]

## God Nodes (most connected - your core abstractions)
1. `🌙 Fall Asleep — Shutdown Protocol` - 8 edges
2. `setItem()` - 4 edges
3. `playChime()` - 3 edges
4. `playBreathingCue()` - 3 edges
5. `getItem()` - 3 edges
6. `isStorageAvailable()` - 3 edges
7. `CalmingStatement` - 2 edges
8. `calmingStatements` - 2 edges
9. `wordBank` - 2 edges
10. `shuffleArray()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (8 total, 0 thin omitted)

### Community 0 - "Breathing Exercise"
Cohesion: 0.23
Nodes (9): BreathingPattern, PATTERNS, Phase, PHASE_COLORS, PHASE_LABELS, getContext(), playBreathingCue(), playChime() (+1 more)

### Community 1 - "Circuit Breaker"
Cohesion: 0.18
Nodes (10): code:bash (# Install dependencies), code:bash (npm run build), Deployment, Design Principles, Development, 🌙 Fall Asleep — Shutdown Protocol, Features, License (+2 more)

### Community 2 - "Sleep Check-in"
Cohesion: 0.2
Nodes (5): BEDTIMES, CheckinEntry, WAKE_FEELS, DataPoint, Props

### Community 3 - "Journal Storage"
Cohesion: 0.24
Nodes (4): GROUNDING_STEPS, Mode, CalmingStatement, calmingStatements

### Community 4 - "Cognitive Shuffle"
Cohesion: 0.33
Nodes (6): STORAGE_KEYS, VaultEntry, getItem(), isStorageAvailable(), removeItem(), setItem()

### Community 5 - "Config"
Cohesion: 0.47
Nodes (3): SPEEDS, shuffleArray(), wordBank

## Knowledge Gaps
- **22 isolated node(s):** `BreathingPattern`, `PATTERNS`, `Phase`, `PHASE_LABELS`, `PHASE_COLORS` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `setItem()` connect `Cognitive Shuffle` to `Sleep Check-in`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `getItem()` connect `Cognitive Shuffle` to `Sleep Check-in`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `BreathingPattern`, `PATTERNS`, `Phase` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
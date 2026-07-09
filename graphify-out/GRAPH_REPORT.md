# Graph Report - D:\College_Work\FallAsleep  (2026-07-09)

## Corpus Check
- 15 files · ~67,806 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 48 nodes · 57 edges · 6 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Breathing Exercise|Breathing Exercise]]
- [[_COMMUNITY_Circuit Breaker|Circuit Breaker]]
- [[_COMMUNITY_Sleep Check-in|Sleep Check-in]]
- [[_COMMUNITY_Journal Storage|Journal Storage]]
- [[_COMMUNITY_Cognitive Shuffle|Cognitive Shuffle]]

## God Nodes (most connected - your core abstractions)
1. `setItem()` - 4 edges
2. `playChime()` - 3 edges
3. `playBreathingCue()` - 3 edges
4. `getItem()` - 3 edges
5. `isStorageAvailable()` - 3 edges
6. `CalmingStatement` - 2 edges
7. `calmingStatements` - 2 edges
8. `wordBank` - 2 edges
9. `shuffleArray()` - 2 edges
10. `getContext()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (6 total, 0 thin omitted)

### Community 0 - "Breathing Exercise"
Cohesion: 0.23
Nodes (9): BreathingPattern, PATTERNS, Phase, PHASE_COLORS, PHASE_LABELS, getContext(), playBreathingCue(), playChime() (+1 more)

### Community 1 - "Circuit Breaker"
Cohesion: 0.24
Nodes (4): GROUNDING_STEPS, Mode, CalmingStatement, calmingStatements

### Community 2 - "Sleep Check-in"
Cohesion: 0.2
Nodes (5): BEDTIMES, CheckinEntry, WAKE_FEELS, DataPoint, Props

### Community 3 - "Journal Storage"
Cohesion: 0.33
Nodes (6): STORAGE_KEYS, VaultEntry, getItem(), isStorageAvailable(), removeItem(), setItem()

### Community 4 - "Cognitive Shuffle"
Cohesion: 0.47
Nodes (3): SPEEDS, shuffleArray(), wordBank

## Knowledge Gaps
- **15 isolated node(s):** `BreathingPattern`, `PATTERNS`, `Phase`, `PHASE_LABELS`, `PHASE_COLORS` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `setItem()` connect `Journal Storage` to `Sleep Check-in`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `getItem()` connect `Journal Storage` to `Sleep Check-in`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `BreathingPattern`, `PATTERNS`, `Phase` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
# Deck Organization

## Structure Philosophy

**Flat vs Deep:**
- Deep hierarchy (A::B::C::D) → hard to navigate, inflexible
- Flat with tags → flexible, searchable, easier to combine

**Recommended:** 
- 1-2 level deck structure for broad categories
- Tags for specific topics, sources, difficulty

Example:
```
Medical
├── Preclinical
├── Clinical
└── Boards
```
Plus tags: `#cardiology`, `#pharmacology`, `#sketchy`, `#high-yield`

## Tagging Strategy

**Hierarchical tags:** Use `::` separator
- `anatomy::upper_limb::muscles`
- `pathology::cardio::arrhythmias`

**Functional tags:**
- `#leech` — Known problem cards
- `#rewrite` — Needs improvement
- `#high-yield` — Exam priority
- `#source::FirstAid` — Material origin

**Don't over-tag.** If you never filter by a tag, remove it.

## Duplicate Detection

**Types:**
- Exact duplicate (same text)
- Semantic duplicate (different words, same fact)
- Overlapping (tests subset of another card)

**Finding duplicates:**
- Anki: Browse → Find Duplicates (Note > Find Duplicates)
- Add-on: "Find and Replace" or "FSRS4Anki Helper"
- Manual: Sort by sort field, look for similar entries

**Resolution:**
- Exact: Delete one
- Semantic: Keep better-worded version
- Overlapping: Merge or keep only the complete version

## Deck Splitting

When to split a deck:
- >2000 cards with distinct topics
- Different study schedules needed (daily vs weekly)
- Want different settings (intervals, new cards/day)

When NOT to split:
- For "organization" — use tags instead
- When topics interconnect heavily

## Maintenance Routine

**Weekly:**
- Clear suspended cards (decide: delete, unsuspend, rewrite)
- Review leeches (rewrite or add mnemonics)
- Check review forecast (reduce new if backlog building)

**Monthly:**
- Audit tag usage (remove unused tags)
- Look for duplicate candidates
- Review cards not seen in 6+ months (still relevant?)

**Per exam/milestone:**
- Create filtered deck for weak areas
- Tag high-yield vs low-yield
- Adjust settings for intensity needed

## Filtered Decks

**Use cases:**
- Pre-exam cram (cards due in next 7 days)
- Weak area focus (tagged topics, low ease cards)
- Random mixed review (break deck silos)

**Search examples:**
```
deck:Medical is:due prop:ease<2.0       # Ease hell cards
deck:Medical tag:high-yield -is:new     # High-yield reviews only  
rated:7:1                               # Failed in last 7 days
prop:ivl<21 prop:ivl>7                  # Medium-interval cards
```

**Trap:** Filtered decks reschedule can mess with intervals. Use "Reschedule" option carefully.

## Import/Export

**Import formats:**
- Tab-separated: `front\tback\ttags`
- Semicolon: `front;back;tags`
- CSV with headers (map fields manually)

**Export for backup:**
- `.apkg` includes scheduling data
- `.colpkg` full collection backup

**Sharing decks:**
- Remove personal notes/context
- Check for copyrighted content (images, text)
- Reset scheduling if sharing publicly

## User's Predefined Taxonomy (Strict Whitelist)

**CRITICAL INSTRUCTION FOR AI:** 
When generating cards, you are FORBIDDEN from creating new tags. You MUST select the most appropriate tags ONLY from the following whitelist. Do not invent variations.

**Computer Science (Fundamentals):**
- `#CS::Network`, `#CS::OS`, `#CS::Algorithm`, `#CS::Crypto`

**Architecture & Engineering:**
- `#Arch`, `#Arch::Build`, `#Arch::CI_CD`, `#Arch::DesignPattern`, `#Arch::Monitor`, `#Arch::Strategy`

**Frameworks & UI:**
- `#FW`, `#FW::Nextjs`, `#FW::Nextjs::AppRouter`, `#FW::Nextjs::Opt`, `#FW::React`, `#FW::React::Core`, `#FW::React::Hooks`, `#FW::React::SSR`, `#FW::React::State`, `#FW::UI`

**Interview Prep:**
- `#Interview`, `#Interview::HighFreq`, `#Interview::STAR`, `#Interview::SysDesign`

**Language & Browser API:**
- `#Lang`, `#Lang::Browser`, `#Lang::Browser::DOM`, `#Lang::Browser::Storage`, `#Lang::CSS`, `#Lang::JS`, `#Lang::JS::Async`, `#Lang::JS::Core`, `#Lang::TS`, `#Lang::TS::Type`, `#Lang::TS::Utility`

**Performance:**
- `#Perf`, `#Perf::Load`, `#Perf::Network`, `#Perf::Realtime`, `#Perf::Render`, `#Perf::Web_Vitals`

**Web3:**
- `#Web3`, `#Web3::DEX`, `#Web3::EVM`, `#Web3::NonEVM`, `#Web3::Security`, `#Web3::Wallet`

**Functional (Maintenance):**
- `#high-yield`, `#leech`, `#rewrite`

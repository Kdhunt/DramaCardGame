# Scoring and economy review

## Scope and evidence

This review examines the source snapshot retrieved through GitHub at commit `68ae0ae4b5cf47c825fa88b7773dda7ef6382c86` of `Kdhunt/DramaCardGame`. The commit and branch were verified through GitHub metadata. The local snapshot did not include Git metadata, so no local `git rev-parse` check was performed.

The implemented rules below come from `src/pages/GameBoard.jsx` and `src/lib/gameData.js`. Historical discussion and proposed changes are explicitly separated. Deterministic reproductions are recorded in [validation-results.md](validation-results.md). No human playtest, win-rate study, or measured game-duration study was performed.

## Current scoring formula

For an ordinary event, the current implementation immediately awards the acting player:

`change in DP = dpInstigator - cost + mismatch bonus + sequential chain bonus + location type bonus`

The mismatch bonus is 1 when the character and location have no overlapping tags, except that a location tagged Wild Card disables mismatch entirely. The event's tags and tier do not participate in this calculation. This is implemented at [GameBoard.jsx:339](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L339) and [gameData.js:525](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L525).

The sequential chain bonus is 0 for the first event, 1 for the second consecutive event of the same type at the same location, 2 for the third, and 3 for the fourth and every subsequent event. It is additive. A UI label such as `Chain ×4` does not mean that the points are multiplied by four. See [GameBoard.jsx:343](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L343) and [gameData.js:550](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L550).

The location type bonus is a single additional point when any event `locationTypeBonuses` tag matches a location tag. Multiple matching tags do not add multiple points. The location's descriptive `effect` and an event's `subActions` do not execute through this formula.

A selected target receives `dpTarget`, with their resulting DP floored at zero. The target does not receive the acting player's mismatch, chain, or location bonuses. A later performance prompt can add another 1 DP to the acting player. A climax vote adds a fixed 3 DP to the chosen winner. Those are separate awards.

## Findings that change the actual game

### 1. Required targets can be omitted, avoiding both gifts and reactions

The target picker is displayed for cards with nonzero `dpTarget`, but the same dialog always offers a general Play Card button that calls `confirmPlayCard(null)`. See [GameBoard.jsx:1177](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1177) and [GameBoard.jsx:1196](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1196).

With a null target, the acting player keeps their full ordinary reward. Nobody receives `dpTarget`, and no target reaction window opens. The check for a target counter is conditional on an actual target at [GameBoard.jsx:446](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L446).

Reproduction: The Detective plays Grand Reconciliation at Wedding Chapel. Starting at `[10, 10]`, selecting a target produces `[15, 13]`. Using the general Play Card button produces `[15, 10]`. Grand Reconciliation promises 3 DP to each participant; the null-target path retains the actor's reward while avoiding the other participant's reward and counter opportunity. On a fourth consecutive Romance event, the null-target actor instead reaches 18 DP from 10.

This is a substantial incentive to avoid involving other Main Characters, which conflicts directly with the desired interaction.

### 2. Main Character abilities are displayed but not applied

Character `ability` fields are prose. `CharacterCard.jsx` displays them, but the scoring paths do not evaluate those fields or dispatch ability-specific rules. For example, The Gossip's printed additional 2 DP for secrets or rumors is absent when Petty Gossip resolves. At Small-Town Café, a Gossip starting with 10 DP reaches 12, consisting of base 1 plus location bonus 1. The character ability adds nothing.

The same issue affects The Millionaire's promised mismatch doubling, The Nun's additional High Drama fee, The Golden Child's once-per-game penalty protection, and other character-specific benefits. Character choice currently affects ordinary scoring primarily through tag overlap. See [gameData.js:5](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L5), [GameBoard.jsx:339](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L339), and [CharacterCard.jsx:64](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/cards/CharacterCard.jsx#L64).

Equal-looking archetypes therefore cannot be considered mechanically balanced on the strength of their printed abilities.

### 3. Location effects and scene sub-actions are largely promises without settlement

`getSubAction` is used to show a preview at [GameBoard.jsx:1145](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1145). The event resolver does not execute that returned sub-action. Examples include Wedding Crash's additional play at a Romantic location, Petty Gossip's points for all players in a Working Class location, and corporate Blackmail's optional steal. The location's `effect` field is likewise displayed rather than evaluated.

This distinction matters because the card descriptions suggest substantially more choices and benefits than the running game supplies.

### 4. Amplification and framing do not change climax payouts

Everyone's Watching sets `amplified: true`; Flip the Script sets `flipScriptBy`; Change the Narrative changes `instigatorId`. The climax settlement reads none of those fields. It simply adds 3 DP to the vote's winner.

A reproduction with three players starting at `[10, 10, 10]` pays a B-winning climax as `[10, 13, 10]`. Setting `amplified: true`, `flipScriptBy: C`, and `instigatorId: C` produces exactly the same result. These actions can consume a card and the main action without delivering the advertised scoring change.

See [GameBoard.jsx:470](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L470), [GameBoard.jsx:621](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L621), and [GameBoard.jsx:651](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L651).

### 5. Exploded voting chains can repeatedly return and pay another 3 DP

`touchChains` skips resolved and suppressed chains, but not exploded chains. An exploded chain already at intensity 3 becomes unstable again whenever a touching event is played. A touch can be established merely because the acting player is already involved, regardless of event type or target.

Reproduction: Corporate War is exploded, intensity 3, escalation count 3, and involves A and B. A plays Coffee Spill, a Comedy event, with no target. The chain becomes unstable at escalation count 4 and is eligible for another climax vote. After a no-follow-up climax marks it exploded again, another touching play can repeat the sequence.

Thus a concluded story can repeatedly generate 3-point voting awards from unrelated events. This is a reproducible repeated-payout path, not an assertion that a human group will always exploit it. See [GameBoard.jsx:287](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L287), [GameBoard.jsx:319](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L319), and [GameBoard.jsx:483](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L483).

### 6. Pausing and protection do not enforce their advertised benefits

Behind Closed Doors writes a paused status and `pausedTurn`, but there is no corresponding one-turn resume handler. `touchChains` can still escalate a paused chain. A paused chain at intensity 2 and escalation count 2 becomes unstable at intensity 3 when an involved player plays Coffee Spill.

Protected is stored as a player state but the ordinary penalty resolver does not consume or apply it. A Protected target at 10 DP hit by The Double Cross still loses the full 2 DP and reaches 8. See [GameBoard.jsx:655](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L655), [GameBoard.jsx:686](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L686), and [GameBoard.jsx:361](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L361).

### 7. Reflection accepts beneficial effects and can reward the attacker

Karma's a Witch is valid against every Confrontation card. Its resolver multiplies `dpTarget` by 2 without requiring that value to be negative. Wedding Crash has `dpTarget: 2`. Countering it with Karma therefore gives the attacker 4 DP while the defender receives none. Starting at `[10, 10]`, the result is `[14, 10]`.

That is the actual implementation of the wording about doubling a target penalty, even though this card has no target penalty. Restricting the counter to harmful effects or explicitly defining beneficial reflection is a rules decision that must be made. See [GameBoard.jsx:43](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L43), [GameBoard.jsx:556](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L556), and [gameData.js:253](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L253).

### 8. Fees differ by resolution path

Ordinary event resolution subtracts `cost`. Pile-on resolution also subtracts it. The secret-exposure resolver adds `dpInstigator` without subtracting the card's cost or awarding ordinary scene bonuses.

Total Exposure lists cost 1 and instigator reward 3. Its targeted secret-exposure path gives an actor at 10 DP a result of 13 rather than deducting the fee. Exposing Hidden Affair lowers the target from 10 to 7. The secret-exposure routing also occurs before immunity and counter checks, so that route bypasses those defenses. See [gameData.js:400](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L400), [GameBoard.jsx:236](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L236), and [GameBoard.jsx:427](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L427).

Ordinary negated/reflected cards do not pay their printed fee through the counter resolver. There is also no general affordability check before an ordinary event is selected. Whether fees are prepaid commitments or deductions from successful rewards is currently inconsistent or unspecified; this must become an explicit rule.

### 9. Pile-on is a separate score purchase, not a contest over the original result

The original event's DP is committed before a pile-on is offered. Only the immediately next seated player is considered. If they cannot or do not play, no later player gets the opportunity. A pile-on adds points to that player's own score; it does not resolve a target's effects, offer counters, create/touch a persistent storyline, or apply an event state. See [GameBoard.jsx:403](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L403) and [GameBoard.jsx:802](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L802).

This does not provide the requested pattern in which multiple players' cards change an unresolved outcome. It provides one extra player's immediate scoring action. Two separate concepts are currently called chains: the consecutive-type score bonus and persistent storylines. A pile-on advances the former but not the latter.

### 10. Aspirations and subjective awards can determine the race without rules verification

The aspiration resolver pays the printed reward without checking the condition or consulting achievement counters. A player with Heart of the Drama can claim its 5 DP with no recorded Romance history. Claims appear available during the main phase. This may function as an honor system, but it is not objective automatic achievement verification.

Secret Keeper requires reaching game end with secrets intact, while the game ends immediately on crossing the DP target. There is no separate final-scoring settlement for that condition. Secret goal rewards are displayed on cards but have no award path in the game resolver.

The performance prompt awards 1 DP by a yes/no click. The climax vote selects a player who best fits a dramatic outcome and pays 3 DP. `ClimaxVote.jsx` allows tallying after only two votes even in a larger game; ties are resolved by the first sorted entry rather than an explicit tie rule. These awards conflict with the earlier user requirement for quantifiable card-based scoring. See [GameBoard.jsx:834](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L834), [GameBoard.jsx:869](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L869), [ClimaxVote.jsx:26](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ClimaxVote.jsx#L26), and [ClimaxVote.jsx:94](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ClimaxVote.jsx#L94).

## Actual deck and scoring opportunities

The built deck contains 237 physical cards, including duplicate copies. The comments referring to 80 events are not the built deck size.

| Card level | Physical copies |
|---|---:|
| Low | 52 |
| Medium | 78 |
| High | 63 |
| Action | 44 |
| Total | 237 |

There are 32 character records, 31 selectable characters, and 25 locations. For ordinary events excluding special secret-exposure events, the mean printed rewards and fees are:

| Level | Copies | Mean instigator reward | Mean fee | Mean reward minus fee |
|---|---:|---:|---:|---:|
| Low | 50 | 1.16 | 0 | 1.16 |
| Medium | 75 | 1.96 | 0 | 1.96 |
| High | 60 | 3.10 | 0.50 | 2.60 |

These means exclude mismatch, location, chains, targets, counters, aspirations, and performance awards. They do not establish card balance or winning strategy. High Drama events generally offer a higher immediate return, and their descriptive prerequisites such as a previous death or existing romance are not generally validated.

A repeated 5-point ordinary return would reach the quick threshold of 20 in four scoring actions from its zero starting score. The full mode begins at 5 and targets 35, so the same illustrative rate takes six scoring actions. This is arithmetic using implemented thresholds, not a measured duration or prediction of actual play. Setup values appear at `src/pages/GameSetup.jsx:68`; the targets appear at `GameBoard.jsx:140`.

### Main Character mismatch opportunities

Across an equally likely draw from all 25 current locations, The Stranger and The Ex-Con each mismatch at 21 locations. The Intern mismatches at 12. That is a difference of 9/25, or 0.36 expected DP per ordinary event, under that uniform-location assumption and before considering other effects. More or broader character tags can reduce the currently awarded mismatch bonus. The printed abilities do not presently compensate for that difference.

### Consecutive-type availability

For a uniformly random five-card hand from the entire 237-card deck, the exact probability of at least one ordinary event of a given type is:

`P(match) = 1 - choose(237 - K, 5) / choose(237, 5)`

| Type | Matching physical cards, K | Chance of at least one in five |
|---|---:|---:|
| Romance | 22 | 38.8284% |
| Gossip | 28 | 46.9725% |
| Confrontation | 29 | 48.2411% |
| Mystery | 41 | 61.6601% |
| Comedy | 31 | 50.7055% |
| Power | 42 | 62.6382% |

These are unconditional random-hand probabilities, not independent multi-player probabilities or observed pile-on rates. Actual hands, prior draws, cards already played, and the next-seat restriction change the opportunity. The results show that equal-looking type-based aspirations and chain opportunities do not have equal supply.

## Historical disparity formula: not the current implementation

An earlier discussion proposed social levels 0, 1, and 2, with:

`S = abs(Character - Location) + abs(Location - Event) + abs(Character - Event)`

The user accepted examples such as chef 1, rooftop garden 1, fashion show 2 producing 2 disparity, and matching levels producing zero. This earlier proposal must not be reported as the current source-code formula. The current source uses the tag-overlap mismatch rule described above.

For any three real numbers, the pairwise expression equals:

`S = 2 * (maximum level - minimum level)`

It can therefore produce only 0, 2, and 4 with these three social levels. The full 27 combinations are shown below; each row fixes Character and Location, with the three Event columns completing the enumeration.

| Character | Location | Event 0 | Event 1 | Event 2 |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 2 | 4 |
| 0 | 1 | 2 | 2 | 4 |
| 0 | 2 | 4 | 4 | 4 |
| 1 | 0 | 2 | 2 | 4 |
| 1 | 1 | 2 | 0 | 2 |
| 1 | 2 | 4 | 2 | 2 |
| 2 | 0 | 4 | 4 | 4 |
| 2 | 1 | 4 | 2 | 2 |
| 2 | 2 | 4 | 2 | 0 |

| Character level | Zero-point cases | Two-point cases | Four-point cases | Expected disparity |
|---:|---:|---:|---:|---:|
| 0 | 1 | 3 | 5 | 26/9 = 2.8889 |
| 1 | 1 | 6 | 2 | 20/9 = 2.2222 |
| 2 | 1 | 3 | 5 | 26/9 = 2.8889 |
| All 27 cases | 3 | 12 | 12 | 8/3 = 2.6667 |

Under independent, uniformly distributed Location and Event levels, either extreme Character level earns 30% more expected baseline disparity than the middle level. This is an exact property of that historical model, not a current-code win-rate finding. It ignores drafting, card supply, costs, abilities, player choices, and additional rewards.

The historical expression also makes every Event worth 4 when Character and Location already occupy opposite extremes. It measures range, rather than three independent dramatic tensions. Multiplying zero cannot reward a betrayal at an otherwise aligned society wedding. Social disparity can remain a conditional modifier, but it cannot carry the whole meaning of a dramatic consequence.

## Superseded pot-splitting branch: historical, not adopted

A later conversation explored a seeded pot split between Instigator and Spotlight awards. The user subsequently rejected the poker-style framing in favor of several players changing an outcome for different reasons. This branch is retained as research history, not a specification for the next implementation.

In the separately recorded project-level arithmetic check, the candidate pot was `P = 2N + M*D + S`, where N is the player count, D is contributed Drama, M is the multiplier, and S is committed fees. For three players, multipliers 1 and 2, fees 0, 1 and 3, award ratios 1:1, 3:1 and 1:3, and six directed player-to-player contribution edges each taking values 0 through 3, the reported exhaustive check covered `4^6 * 2 * 3 * 3 = 73,728` allocations. All allocations conserved the pot. This check was executed separately from the 16-case source-code harness in validation-results.md.

The recorded example A to B = 3 Drama, B to A = 2, and C to B = 1 has D = 6. With seed 2N = 6, multiplier 2, and fees 2, the pot is 20. An equal Instigator/Spotlight split awards A = 10, B = 10, C = 0. Those are gross awards; the distribution of individual fees determines each player's net gain.

Conservation establishes correct accounting for that candidate. It does not establish that its incentives are enjoyable or suitable. The branch was rejected for design fit despite its arithmetic consistency.

## Decisions needed before balancing numbers

The most consequential problem is the mismatch between card promises and actual resolution. Numeric balancing before fixing that mismatch would tune a much simpler game than the cards describe.

The next rules revision needs one authoritative settlement path: validate who is involved; hold an outcome open for a defined response window; apply card and Main Character effects; resolve the outcome; then award the headline and conditional benefits. Costs, cancellation, reflection, state consumption, multipliers, and one-time rewards must use that same path. The [current proposed direction](../design/current-direction.md) remains a design candidate; earlier pot-splitting proposals are not current implementation requirements.

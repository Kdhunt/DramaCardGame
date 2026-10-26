# Implementation review

## Scope and evidence

This review covers the source snapshot from `Kdhunt/DramaCardGame` at commit [`68ae0ae4b5cf47c825fa88b7773dda7ef6382c86`](https://github.com/Kdhunt/DramaCardGame/tree/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86), identified during retrieval as the April 13 snapshot. It does not establish what is currently deployed at `drama-card-show.base44.app`.

The review is based on `src/pages/Rules.jsx`, `GameSetup.jsx`, `GameBoard.jsx`, the game components `ActiveChains`, `ChainTracker`, `ClimaxVote`, `PlayerStates`, and `SceneRecap`, and the corresponding definitions in `src/lib/gameData.js`. No game implementation was changed for this review.

Severity means the following:

| Priority | Meaning |
| --- | --- |
| P1 | A core requirement is absent, or the implemented transition can invalidate settlement, protection, or progression. |
| P2 | A card, interface, or supporting rule behaves differently from its stated effect, or omits an important part of that effect. |

Source inspection establishes the described dispatch paths and state updates. Two function extractions were also executed in Node with minimal mock state: `touchChains` and `confirmPlayCard`. Those checks execute the existing function bodies; they are not full browser or React integration tests. Browser rendering, modal ordering, and the live deployed version were not verified.

## Current design direction used for comparison

The user's latest direction is a contest resembling Munchkin's multiplayer intervention: several players can add cards that change an unresolved outcome while escalating the drama. Different players can benefit for different reasons tied to their Main Characters, cards, or circumstances. The user explicitly rejected making the game poker.

Earlier project constraints still relevant to this review include objective numeric resolution, cards played on other cards, and Main Characters as the center of interactions. Proposed replacement rules discussed in conversation are design candidates, not features claimed to exist in this snapshot.

## What exists

| Requirement | Actual implementation | Assessment |
| --- | --- | --- |
| Each player has a Main Character | Setup deals two selectable archetypes and saves the chosen character with the player. The board retains that object. | Present as identity and displayed card. |
| Cards can affect existing cards or stories | Proactive Actions can target a persistent chain ID. Events can create a chain from a named template. | Partly present, through chain objects rather than a complete attachment and contest system. |
| Several players can interfere with one outcome | A targeted player can respond with one counter. A separate pile-on offer can go to the next player. | Does not implement the requested multiplayer contest. |
| Main Characters create different reasons to benefit | Character abilities are prose definitions. The active event payout uses fixed instigator and target values plus general bonuses. | Advertised character differentiation is not integrated into settlement. |
| Drama escalates across plays | Consecutive card types increase `eventChain.count`; persistent chains have intensity and escalation counts. | Present, but the two escalation systems are disconnected in important ways. |
| Resolution is objective | Event arithmetic is numeric, but performance bonuses, aspiration claims, and climax voting are manual. | Incomplete. |

Setup evidence: [`GameSetup.jsx:40`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameSetup.jsx#L40) and [`GameSetup.jsx:62`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameSetup.jsx#L62). Board initialization and identity: [`GameBoard.jsx:119`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L119).

## P1: Pile-on play does not contest an unresolved outcome

`resolveEventCard` immediately removes the acting player's card and awards its DP. It also immediately applies the target's DP effect. Only afterward does it offer a pile-on, and only when the consecutive type chain has reached at least two cards.

The eligible participant is always `(currentTurn + 1) % players.length`. The engine does not search subsequent players, let other participants volunteer, or rotate a reaction window. `playPileOnCard` separately awards the joining player points, closes the dialog, and proceeds to the performance bonus.

The pile-on does not select a target, apply `dpTarget`, run a counter window, execute a Secret reveal, create or touch a persistent chain, or apply the event's state effect. A card's printed scenario therefore does not execute through the same path when it is used to pile on.

Concrete trace: player A resolves the second Gossip card of a chain and receives its points. Player B may play one matching card and independently receive points. Player C cannot enter that exchange through the pile-on flow, even if C has an appropriate card. B's card cannot reverse A's already awarded result.

This is a confirmed design gap rather than a claim that the present code fails its own narrower scoring model. The implementation supports an extra scoring play, not the newly requested shared contest.

Evidence: [`GameBoard.jsx:338`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L338), [`GameBoard.jsx:403`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L403), and [`GameBoard.jsx:802`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L802).

## P1: Important outcome and payout Actions have no corresponding effect

Several cards consume a card and the main action while recording a field that settlement never uses.

| Card | Printed promise | Active behavior |
| --- | --- | --- |
| Everyone's Watching | Double all DP gains and losses at resolution. | Sets `chain.amplified = true`; no payout path reads that field. |
| Flip the Script | Let its player decide who receives the instigator DP at climax. | Sets `chain.flipScriptBy`; climax settlement neither reads it nor offers that decision. |
| Change the Narrative | Swap instigator and victim and change who gains DP. | Changes `instigatorId` to another involved ID. It does not identify a victim role, change the fixed climax award, or redirect payment. |
| Play the Victim | Reduce the next incoming DP penalty by one. | Adds `Protected` to the player's state list. Penalty resolution does not read or consume `Protected`. |

The ordinary event payout operates immediately. Climax voting later awards a flat three DP to the voted player. Neither route applies the claimed amplification or beneficiary control.

Evidence for printed effects: [`gameData.js:412`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L412), [`gameData.js:416`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L416), and [`gameData.js:421`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L421). Handler evidence: [`GameBoard.jsx:621`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L621), [`GameBoard.jsx:651`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L651), and [`GameBoard.jsx:686`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L686). Climax payment: [`GameBoard.jsx:470`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L470).

## P1: Completed chains can become unstable again

After a vote, a chain with no follow-up is marked `exploded`. `touchChains` excludes only `resolved` and `suppressed` chains. An exploded chain can therefore be touched again. Since it already has intensity three, the next matching event changes its status back to `unstable`, making it eligible for another climax vote and another award.

Executed reproduction using the existing `touchChains` body:

| Before | Input | After |
| --- | --- | --- |
| `status: exploded`, `intensity: 3`, `escalationCount: 3` | A matching Gossip event | `status: unstable`, `intensity: 3`, `escalationCount: 4` |

This affects templates with vote climaxes and no follow-up, including Public Scandal and Sudden Confession. It does not require starting a new storyline.

Evidence: [`GameBoard.jsx:287`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L287), [`GameBoard.jsx:320`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L320), [`GameBoard.jsx:483`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L483), and [`gameData.js:592`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L592).

## P1: Secret reveal dispatch bypasses immunity and the response window

`confirmPlayCard` routes cards with `secretReveal` into `startSecretReveal` and returns before it checks `immunePlayers` or the target's valid counters. This means a player protected from event effects cannot use that protection against this event path, and a valid counter in hand is not offered.

Executed dispatch reproduction: the target was placed in `immunePlayers` and given a qualifying counter. Calling the existing `confirmPlayCard` body for Total Exposure called only `startSecretReveal`. It did not call the reaction or normal event resolution paths.

The specialized Secret resolver also does not call the persistent chain helpers. Total Exposure has a chain template, but its ordinary targeted Secret reveal dispatch does not create that chain.

Evidence: [`GameBoard.jsx:423`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L423), [`GameBoard.jsx:236`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L236), and [`gameData.js:599`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L599).

## P1: Climax voting and performance bonuses replace objective resolution

The climax interface asks players to choose whoever best fits the dramatic outcome. That is an actual settlement path, not descriptive rules text. It awards the chosen player three DP.

It also permits tallying after only two votes, even in a six-player game. Ties are resolved by taking the first entry after a descending count sort; no explicit tie rule or second round is applied. Equal totals therefore depend on vote insertion order rather than a game rule. Self-voting is permitted.

Separately, `givePerformanceBonus(true)` awards the current player one DP. This action remains part of the active flow after ordinary events and many Actions. It conflicts with the user's objective-scoring requirement.

Evidence: [`ClimaxVote.jsx:26`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ClimaxVote.jsx#L26), [`ClimaxVote.jsx:66`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ClimaxVote.jsx#L66), [`ClimaxVote.jsx:94`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ClimaxVote.jsx#L94), and [`GameBoard.jsx:835`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L835).

## P2: Behind Closed Doors neither enforces its pause nor schedules its return

The card promises a one-turn pause that prevents escalation, followed by an intensity increase. The handler sets `status: paused` and `pausedTurn: currentTurn`. No subsequent handler reads `pausedTurn` to resume the chain.

Meanwhile, `touchChains` can still escalate paused chains. The executed function check changed a paused intensity-two chain with escalation count two directly to unstable intensity three after one matching Gossip event. The pause thus does not enforce the restriction printed on the card.

Evidence: [`gameData.js:418`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L418), [`GameBoard.jsx:655`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L655), and [`GameBoard.jsx:287`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L287).

## P2: Character abilities and most state benefits are display definitions

Main Character abilities exist as strings in the card catalogue, and the board renders the Character card. The audited game engine does not dispatch those abilities when cards resolve. For example, the Widow's bonus for being targeted by Romance, the Gossip's reward for revealed Secrets, and the Servant's shared assistance reward are not applied by the event or Secret resolvers.

Player state descriptions similarly promise bonuses and protection that settlement does not calculate. States do have a limited active purpose: Twist the Knife checks for a named negative state before escalating chains, and Deny Everything edits the state list. It would therefore be inaccurate to call the entire state system cosmetic. The missing part is the advertised per-state scoring or protection behavior.

Evidence: character definitions at [`gameData.js:5`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L5), state definitions at [`gameData.js:609`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L609), character display at [`GameBoard.jsx:1048`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1048), and the implemented negative-state condition at [`GameBoard.jsx:663`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L663).

## P2: Leak to the Press omits its Secret exposure

The card says it both escalates a chain and exposes a Secret of a random involved player. Its handler only increases intensity and checks for a climax. It never selects an involved player or reveals a Secret.

Evidence: [`gameData.js:415`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L415) and [`GameBoard.jsx:690`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L690).

## P2: Required targeting can be bypassed

The Event dialog displays target buttons for Secret reveals and cards with nonzero `dpTarget`, but always also displays a general Play Card button that calls `confirmPlayCard(null)`.

Consequently, a targeted card can be played without its target effect. A Secret reveal played that way misses the specialized reveal path and enters ordinary event resolution. This lets the acting player receive an instigator reward without exposing anyone. Which cards permit an optional target should be a printed rule rather than an always available UI escape.

Evidence: [`GameBoard.jsx:1177`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1177), [`GameBoard.jsx:1196`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1196), and the dispatch condition at [`GameBoard.jsx:428`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L428).

## P2: The rules page does not describe the active engine reliably

| Rules page says | Implemented behavior |
| --- | --- |
| Pass means discard and draw. | `passTurn` logs the pass and ends the turn without either operation. |
| Spend two DP for an interrupt, one for an extra draw, or DP to avoid a negative effect. | No corresponding purchase controls or handlers exist in the audited board. The target counter opportunity is free. |
| Extreme mismatches may double rewards. | Ordinary event settlement adds one mismatch DP; it does not implement that general doubling. |
| Full mode includes a two-DP sympathy bonus for trailing players. | Full mode changes starting DP and the victory target; no sympathy award is applied. |
| Dream fulfillment is checked during resolution. | Claim Aspiration is a manual award. The handler does not validate the condition. |
| Players develop complex arcs and multiple twists. | Persistent chains exist, but many of their purported effects are fields or logs rather than settlement logic. |

The Rules page explicitly includes acting bonuses and monologue voting, so it also preserves a design direction superseded by the user's objective-scoring constraint.

Evidence: [`Rules.jsx:23`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/Rules.jsx#L23), [`Rules.jsx:28`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/Rules.jsx#L28), [`Rules.jsx:43`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/Rules.jsx#L43), [`GameBoard.jsx:862`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L862), and [`GameBoard.jsx:869`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L869).

## Display and active behavior must remain distinct

`ChainTracker` renders a consecutive-type count as `Chain ×N`, but its own displayed numeric bonus is additive: one, two, then three DP. That symbol is not evidence of multiplicative game scoring.

`ActiveChains` displays intensity and status; it also includes exploded chains in its active list because it filters out only resolved and suppressed entries. That agrees with the resurrection defect above, rather than providing a separate lifecycle rule.

`SceneRecap` stores and edits narrative titles and notes and displays event logs. Editing those notes does not update card relationships, scoring, chain eligibility, or character state. It is a useful record, not a rule engine.

Likewise, `getSubAction` is used by the play dialog to display a location-specific description. The ordinary event resolver does not execute that description as a separate effect.

Evidence: [`ChainTracker.jsx:18`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ChainTracker.jsx#L18), [`ActiveChains.jsx:20`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/ActiveChains.jsx#L20), [`SceneRecap.jsx:21`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/game/SceneRecap.jsx#L21), and [`GameBoard.jsx:1145`](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1145).

## Verification limits and next implementation decisions

The winner effect watches player DP and only excludes an active climax. It does not explicitly exclude a pending pile-on or performance dialog. That ordering deserves an integration test when the turn flow changes. This review did not reproduce modal ordering in a browser and does not classify a specific premature-win UI sequence as a confirmed defect.

The source supplies a useful starting point: chosen Main Characters, typed cards, target selection, counter cards, story references, and visible escalation. The next design decision is to replace immediate independent awards with one explicit unresolved scene state, a bounded multiplayer response sequence, and settlement conditions tied to each involved Main Character. Merely adding more chain labels or card text will not produce that interaction.

This document records findings and decision points. It does not approve a final replacement rulebook, assert that the live app has these exact defects, or claim that playtesting has occurred.

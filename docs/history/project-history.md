# Project history and decision provenance

This is a reconstructed history of Drama! The Soap Opera Card Game, prepared October 25, 2026, America/Denver. It summarizes earlier discussions recovered through Personal Context and source excerpts supplied during the present review. It is not a verbatim transcript, a complete archive of every conversation, or evidence that every assistant suggestion became an approved rule.

The repository snapshot examined during this review was identified as commit `68ae0ae4b5cf47c825fa88b7773dda7ef6382c86`. Its implemented behavior is documented separately in [Card inventory and effect audit](../research/card-inventory-and-effects.md). Historical intentions and current code are different kinds of evidence. Neither should silently overwrite the other.

## How to read the record

A user constraint records something the user requested, accepted, or explicitly rejected in the recovered discussions. An assistant proposal records an idea suggested in a response. A later correction or current instruction takes precedence over an earlier proposal. Absence of a later decision does not establish approval.

Some historical details are available only as search summaries. Where the recovered material does not preserve an exact date or the full underlying rule, this document leaves that uncertainty visible.

## April 27, 2023: initial card game concept

The user described a card game called Drama. A 104-card deck was proposed or accepted, with later user specifications of 26 character cards and 22 event cards. The recovered material does not finalize the remaining 56 cards, their types, scoring, victory conditions, resource system, or interaction timing.

The assistant suggested characters, dramatic scenarios, events, conflicts, resolutions, drawing and playing cards, scoring, alliances, bluffing, negotiation, and possibly objectives. These were concept directions rather than a complete tested system.

The early counts should not be treated as current constraints without considering later changes. In particular, 26 characters cannot be split equally among three social classes.

## September 22, 2023: currencies, influence, and relationships

Earlier assistant responses proposed character and location cards, action or influence cards, events, drama tokens as currency and victory points, relationships, secrets, negotiation, influence rounds, and a game end determined by a drama threshold or round limit.

The recovered source does not establish a finalized turn sequence, stable card inventory, or tested economy from this version. It is evidence of explored mechanisms rather than a controlling rulebook.

## March 28, 2025: simpler mechanics and a recognizable identity

The user called the project Drama! The Soap Opera Card Game and asked for a simpler, proven mechanical foundation. The requested identity combined soap opera storytelling, quantifiable gameplay, Drama Points as both victory points and currency, and rewards tied to disparities or mismatches, including multipliers.

The user asked for substantial card and rule detail and for scenario testing. This was a request for a working game rather than merely entertaining card descriptions.

An early performance bonus appeared in this period. The later April 1 instruction explicitly excludes performance and subjective scoring, so that earlier idea is superseded.

## March 29, 2025: audience, tone, duration, and an assistant rules draft

The user specified an audience of ages 13 and above, humorous and mildly satirical writing, a playful and mildly suggestive tone, and cheesy, exaggerated camp comedy art. Desired versions lasted approximately 40 to 45 minutes and 90 to 120 minutes.

An assistant draft proposed three to six players and a 150-card collection with 30 characters, 25 locations, 80 events, and 15 dreams. It suggested a turn with drawing, playing, optional narration, and resolution, plus DP earning and spending, interruptions, mismatches, locations, and personal goals. Suggested winning targets were approximately 15 to 20 DP for a quick game and 30 to 40 for a full game. No player elimination was part of that proposed direction.

Other assistant details included low events paying roughly 1 DP, medium events 2, high events 3 or 4, an interruption costing 2, and main actions such as an event, location change, dream, or pass. A setup proposal placed four locations face up while each player owned a character.

These are versioned proposals. The recovered material does not show that all of them were jointly approved, implemented, or tested. Card totals, targets, and the meaning of a scene changed in later versions.

## March 31, 2025: archetypes, social groups, locations, and event meaning

The user asked for 24 unnamed character archetypes, evenly divided into eight High Society, eight Middle Management, and eight Working Class characters. Character abilities were to relate to locations and characters from the social groups.

An assistant supplied 24 archetypes and abilities mentioning Plot, Twist, Reaction, Crisis, DP, assistance, betrayal, discard, skipping, and tier interactions. The terminology was not necessarily a single settled card taxonomy.

The user also requested 24 locations, eight in each of three social tiers. Country Club and Opera House were accepted, while Opera House Balcony was rejected as too narrow. The intent was useful general locations rather than hyper-specific fragments of a setting.

For events in this version, the user described occasions or invitations rather than completed dramatic outcomes. The cards were to have a title and a high, normal, or low designation, with the players causing the drama. This differs from later cards that already declare an affair exposed, a secret revealed, or a catastrophe completed. That semantic difference should be resolved explicitly when rewriting the card model.

## March 31 to April 1, 2025: numerical disparity scoring

The user requested scoring based on matching or separating the levels of a character, location, and event. An assistant represented the levels as High = 2, Middle = 1, and Low = 0, then proposed:

`|character - location| + |location - event| + |character - event|`.

Recovered examples include a chef at 1, rooftop garden at 1, and fashion show at 2 producing 2, and a rockstar, charity gala, and haunted mansion all at 2 producing zero disparity. These examples establish the intended arithmetic in that version. They do not establish that the formula adequately measures every kind of soap opera drama.

The present review established the identity:

`sum of the three pairwise distances = 2 * (highest level - lowest level)`.

Consequently the only possible results are 0, 2, and 4. Once the lowest and highest levels appear, the remaining card cannot change the result. With equally likely independent location and event levels, a fixed extreme character averages 26/9 points while a fixed middle character averages 20/9, a 30 percent difference. These are present review calculations, not historical playtest findings.

The useful reconciliation proposed during the current review was to treat disparity as one objective ingredient rather than the entire definition of drama. Later relationship and trope requirements provide additional context. This reconciliation is a proposal, not a claim that an earlier complete rule already used it.

## April 1, 2025: objective scoring becomes explicit

The user's requirement was that scores be mathematically determined from the scene location, characters present, and event. Acting quality, roleplaying, performance, and subjective judgment were excluded.

This is a controlling correction to earlier performance bonuses. Storytelling and humor may remain enjoyable parts of play, but they cannot determine who receives points through audience approval or an acting contest.

The current repository still contains performance bonus buttons, card text about acting dramatically, and climax votes selecting the person who best fits the outcome. Those are discrepancies between the older implementation and the later stated requirement.

## August 26, 2025: another terminology and resource branch

An assistant proposed scenes combining a Hook, Location, and Trope, plus Spotlight bidding, Applause, Strings, Scandals, Agendas, and Drama Points. The user rejected Heat as terminology. Tension was suggested as a replacement, but the user later questioned it in favor of Drama or Drama Level. The user also rejected Hook as insider jargon and preferred plain terms such as Inciting Event or Turn of Events.

The available evidence does not establish acceptance of the complete resource architecture. These terms should not be imported into the current design as settled components.

## August 27, 2025: context matters

The user wanted combinations of tropes, characters, status, and relationships to matter. The recovered example distinguished paparazzi following a waitress who is dating a millionaire from paparazzi following a waitress and a docker.

The important distinction is that attention follows the actual situation. Social class alone does not explain whether the event makes sense. A relationship, a hidden fact, a public identity, or a preceding incident should determine which cards become relevant.

The recovered summary dates this requirement to August 27, 2025. The current review retains it as a requirement for meaningful conditions rather than evidence of a finalized card or scoring formula.

## April 2, 2026: a measurable currency and an unaccepted assistant proposal

The user again requested measurable drama functioning as both currency and victory points.

An assistant proposed several additional concepts: Heart, Blood, Power, Public, Secret, and Cliffhanger states or tracks; Sympathy; spending effects priced from 1 to 7; a forced scandal at 10 DP; victory through 15 unspent DP or a hidden Destino combined with 8 DP. The available evidence does not establish user acceptance of this architecture.

It should not be merged into the current design as if it were a completed rules specification. In particular, multiple tracks, thresholds, and objectives can conflict with the request for simplicity and with each other unless their transitions and payouts are fully defined.

## April 9, 2026: prototype and persistent storylines

A prototype was referenced at https://drama-card-show.base44.app. An assistant reported more than 200 event cards, tagged characters and locations, passive abilities, aspirations, counters, voting, and a Draw, Play, React, Resolve sequence.

The assistant identified a concern that individual plays resolved as isolated deterministic DP exchanges. Proposed extensions included persistent Drama Chains or Threads, escalation, state tags, relational secrets, and consequences carrying forward.

This report was an assistant description of the prototype at that time. It does not establish that every printed ability executed correctly. The later repository audit found substantial gaps between printed effects and handlers.

Another event definition from the later discussions distinguished events as things that happen from actions as character choices. This is a different vocabulary from the March 31 occasions or invitations model. The distinction needs a conscious decision rather than combining both meanings under Event.

## October 25, 2026: fresh review and corrected direction

The user asked for a fresh examination of the whole project and for mechanics that make sense. The user then asked for comparisons with popular, well-rated games, concentrating on their mechanics.

The review explored High Society and The Bloody Inn as economic comparisons. High Society uses separate money and status, with final exclusion of the poorest player. The Bloody Inn uses francs as both expenses and final wealth. These are references for analyzing spending incentives, not instructions to copy their complete systems. Research documentation elsewhere in the repository retains rulebook sources and rating limitations.

The user subsequently authorized replacing or removing existing mechanics while preserving building drama, cards being played on other cards, and play centered on each player's own main character. Pot multiplication or splitting was discussed during this stage.

Assistant proposals temporarily explored a poker-like scene pot, claim strength, and then fixed Instigator and Spotlight awards. These were exploratory proposals rather than established rules. The user later rejected the poker direction and cited Munchkin's sequential interference: players add cards that affect an unfolding outcome, while different participants can benefit for different reasons.

The current direction therefore preserves these ideas:

* Each player has their own continuing main character.
* Drama develops through connected plays rather than isolated point grants.
* Cards can affect existing cards, relationships, conditions, and incidents.
* Multiple players can intervene before the outcome is settled.
* Different characters can benefit from different outcomes or different contributions.
* Objective conditions and arithmetic determine results.

A proposed response architecture used a contested scene, sequential opportunities to play or pass, and conditional payouts specified by character or card. Examples included an instigator seeking exposure, an ally paid from an agreed share, a target profiting through a tell-all, and a blackmailer wanting concealment. These are proposed directions for the next rules draft, not existing repository behavior or evidence of a completed balance test.

The [current design proposal](../design/current-direction.md) and [present conversation record](../conversations/2026-10-25-mechanics-review.md) preserve the detailed direction. This history intentionally does not present an exploratory design as final approval.

## Superseded or unresolved details

| Detail | Historical status | Treatment in the current review |
| --- | --- | --- |
| 104 cards with 26 characters and 22 events | Early user specifications | Historical version; do not combine blindly with later equal three-group requirements |
| 150 cards with 30 characters, 25 locations, 80 events, 15 dreams | Assistant draft | Proposal, not current inventory |
| 24 characters and 24 locations divided equally among three tiers | Explicit later user request | Relevant historical requirement; actual source differs and latest rewrite authorization permits reconsideration |
| Performance points | Earlier proposal | Superseded by objective scoring requirement |
| Three-card disparity equation | Numerical proposal with accepted examples | Valid arithmetic, incomplete as a general drama measure, structurally biased if tied to permanent character tiers |
| Multiple new tracks and Destino victory | April 2026 assistant proposal | Unaccepted in available evidence |
| Passive abilities, sub-actions, statuses | Advertised prototype features | Inspect execution rather than assuming the printed promises work |
| Poker-style ranking and scene pots | Current review exploration | Rejected as the direction for the core game |
| Fixed Instigator and Spotlight awards | Current review exploration | Not the current direction after the Munchkin clarification |
| Simultaneous card selection | Possible alternative mechanism | Does not capture the user's emphasized sequential interference without additional opportunities to respond |
| Expose versus Cover Up | Example of a contested scene | Illustrative, not a mandate that every incident have the same binary fiction |

## Open historical questions

The recovered record does not establish a single final physical deck size, a completed pricing curve, a tested amount of interruption, a precise persistent attachment model, or a validated method for achieving both desired durations. The latest user instruction authorizes replacing mechanics, so these should be solved as implementation and design questions while preserving the current direction.

Historical assistant language should not be treated as user consent. A future rules change should identify the behavior it creates, how an actual card produces it, what decisions it gives each main character, and how its outcome can be checked without subjective scoring.

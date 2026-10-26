# Card inventory and effect audit

This is a read-only review of the repository snapshot identified as commit `68ae0ae4b5cf47c825fa88b7773dda7ef6382c86`, inspected during the October 25, 2026 review, America/Denver. Counts below come from importing `src/lib/gameData.js` with Node and enumerating its exports. Findings distinguish printed promises, executable behavior, and proposed design changes. They are code inspection findings, not observed playtest results.

The source tree was supplied as a snapshot rather than a working Git checkout in this review environment. Commit links use the identifier supplied with that snapshot.

## Verified inventory

| Component | Unique designs | Copies or availability |
| --- | --- | --- |
| Characters | 32 | 31 selectable, 1 non-selectable Evil Twin |
| Locations | 25 | 25 location cards |
| Ordinary low drama events | 25 | 50 draw cards |
| Ordinary medium drama events | 25 | 75 draw cards |
| Ordinary high drama events | 20 | 60 draw cards |
| Secret reveal events | 3 | 2 low, 3 medium, 3 high copies |
| Reactive action designs | 8 | 16 draw cards |
| Proactive action designs | 12 | 24 draw cards |
| Actions with both timings | 2 | 4 draw cards |
| Secrets | 20 | Two dealt to each player |
| Aspirations | 15 | One dealt to each player |

The draw deck contains 237 cards representing 95 unique names: 70 ordinary events, 3 secret reveal events, and 22 actions. By level it contains 52 low, 78 medium, 63 high, and 44 action cards. The comment describing 80 event cards is stale. The 27 storyline templates and 9 player states are additional definitions, rather than separate dealt cards.

Deck construction: [src/lib/gameData.js:425](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L425). Dealing: [src/pages/GameBoard.jsx:114](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L114).

## What the engine actually scores

Ordinary event resolution pays the acting player:

`base instigator DP - printed cost + mismatch bonus + consecutive type bonus + location tag bonus`.

It then applies one `dpTarget` amount to one selected target. A negative target total is floored at zero. It does not evaluate the event's prose, character abilities, location effect prose, or sub-action prose. There is no stored relationship, affair, wedding, parentage, employment, rescued status, or dead status prerequisite in this path.

The complete calculation is at [src/pages/GameBoard.jsx:337](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L337). The target picker is driven by a nonzero target amount or the special secret reveal flag at [src/pages/GameBoard.jsx:1177](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1177).

This means a card can describe a lover, betrayed partner, hero, lawyer, third participant, or audience without the implementation identifying that person. An ordinary event can generally be played without its described situation being present.

Printed costs behave as deductions from the same payout, rather than an affordability requirement. No DP balance check prevents an ordinary cost-bearing event from being played at zero DP. Every ordinary event with a positive cost has a larger base reward than its cost, so these plays still increase the actor's DP before any bonus. The current code therefore does not yet create a meaningful decision about saving currency to unlock an otherwise unavailable action.

## Material gaps between cards and implementation

| Printed promise | Implemented behavior | Consequence |
| --- | --- | --- |
| Every character has a special ability | Ability strings are rendered on CharacterCard but never interpreted by the game rules | Character selection promises differentiation that mostly reduces to tags |
| Location cards have specific effects | Location effects are shown, while the engine awards only the event's generic location tag bonus | Cost discounts, conditional extra rewards, and doubled mismatch do not happen |
| Events offer location-specific sub-actions | The play preview displays matching sub-action text without executing it | Preview can promise a second play, forced discard, skipped draw, extra recipient, or extra points that never occur |
| Everyone's Watching doubles chain payouts | The action sets `amplified: true`; no payout reads it | Spending a card does not produce the promised multiplier |
| Flip the Script controls who gains at climax | The action sets `flipScriptBy`; no resolution reads it | Its advertised bargaining power does not exist |
| Change the Narrative changes the payout recipient | It replaces `instigatorId`; climax awards a flat amount to the vote winner | The role swap does not implement the stated payout change |
| Behind Closed Doors pauses for one turn and then escalates | It writes `status: paused` and `pausedTurn`; there is no resume handler | Chain becomes unavailable in action selection but ordinary touch logic can still escalate it |
| Leak to the Press escalates and reveals a secret | It increases intensity only | Half its effect is missing |
| Play the Victim reduces the next incoming penalty | It applies Protected; damage and secret penalty paths never consult or consume that state | Protection is cosmetic |
| Most negative states alter later scoring | State descriptions are rendered, but normal event scoring ignores them | Most status conditions add labels rather than decisions |
| Secret goals award DP | Goal text and reward appear on SecretCard; no goal completion or payment handler exists | Alternative motives suggested by the cards are unavailable |
| Aspirations require measurable achievements | A reveal button awards the reward without checking the condition | Completion relies on player honesty and manual memory |

Examples in source: character rendering [src/components/cards/CharacterCard.jsx:61](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/cards/CharacterCard.jsx#L61); location rendering [src/components/cards/LocationCard.jsx:48](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/components/cards/LocationCard.jsx#L48); sub-action preview [src/pages/GameBoard.jsx:1145](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1145); action handlers [src/pages/GameBoard.jsx:621](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L621); climax payout [src/pages/GameBoard.jsx:469](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L469); aspiration payout [src/pages/GameBoard.jsx:869](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L869).

## Specific card contradictions

| Card | Printed outcome | Current numeric outcome or missing condition |
| --- | --- | --- |
| Coffee Spill | Instigator gains 1, with another point if an argument follows | Instigator gets 1 and target gets 1 without an argument check |
| Love Triangle | Two people clash and a third person is the romantic prize | Only actor and one target can receive the encoded 2 and 2; the third participant is not modeled |
| Secret Alliance | Two allies each gain 1 and a third party loses 1 | Encodes one instigator gain and one target loss; there is no second ally payout |
| Forbidden Romance Exposed | Both lovers gain 3 and betrayed parties lose 1 | Encodes actor plus 3 and a single target minus 1; lover and betrayed roles are not identified |
| Season Finale Twist | Every other player loses 1 | Ordinary resolution changes only the chosen target |
| Grand Reconciliation | Both participants gain 3 and all others gain 1 | Only actor and one target get the base rewards |
| Revolution | The leading player loses 2 | Target picker permits any other player; no leader restriction is enforced |
| Hostile Takeover | A Business character loses 1 | Target picker does not filter characters by Business |
| Wedding Crash | Interrupts a wedding and may allow an immediate extra card at a romantic venue | No wedding prerequisite or extra play is implemented |
| Exposé Published | Target loses 2 and skips the next draw | Only the numeric target loss is implemented |
| Secret Revealed | A secret is revealed | Ordinary version gives DP and creates an Exposed Secret chain but does not reveal a Secret card |
| Not So Fast! | Reduce intensity or cancel an event | Reactive handler only implements cancellation |
| I Know Your Secret! | Reveal a secret and apply its penalty | Reactive handler also consumes the pending event without resolving it, effectively cancelling it in addition to exposing |

Card definitions: [src/lib/gameData.js:100](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L100), [src/lib/gameData.js:180](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L180), [src/lib/gameData.js:309](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L309), [src/lib/gameData.js:343](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L343), [src/lib/gameData.js:358](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L358), [src/lib/gameData.js:368](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L368). Numeric event and counter resolution: [src/pages/GameBoard.jsx:354](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L354), [src/pages/GameBoard.jsx:525](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L525).

## Secret reveal design and balance

Whisper Campaign lets the target choose an unrevealed secret. Dig for Dirt has the target offer two and the instigator choose one. Total Exposure randomly selects one. However, each player begins with exactly two secrets. Offering two initially offers no selection to the target, and after one exposure all three cards have the same remaining secret available. The UI handles the one remaining secret case, so this is a loss of meaningful choice rather than a deadlock.

Random selection is not intrinsically a stronger form of exposure than choosing the most damaging secret. Across all 190 possible distinct initial secret pairs, choosing the smaller penalty averages approximately 2.953 DP, choosing the larger averages 3.747 DP, and a random secret averages 3.35 DP. These are exact inventory calculations under uniformly random dealing. They exclude other card benefits, scores floored at zero, strategic secret goals, and any unimplemented effects.

The special secret reveal route executes before the immunity and counter checks. Its payout adds the instigator base DP and subtracts the secret penalty, without charging the printed cost or applying the ordinary bonuses. Consequently Total Exposure's printed 1 DP cost is skipped. Secret exposure also bypasses ordinary chain creation and state application.

Source: secret route [src/pages/GameBoard.jsx:198](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L198), secret payout [src/pages/GameBoard.jsx:236](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L236), route ordering [src/pages/GameBoard.jsx:427](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L427), medium selection [src/pages/GameBoard.jsx:1558](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1558).

The secret goals are promising raw material for different characters benefiting from different outcomes. Hidden Affair rewards public declaration, Hidden Addiction rewards receiving support, and Spy for the Enemy rewards a successful counter. These should become explicit, machine-checkable conditions. Undefined blackmailers, rivals, true creators, and child relationships currently require facts that are not stored anywhere.

## Tags and taxonomy

The character tags mix social class, occupation, genre role, personality, and supernatural narrative function. Event `type` values are Romance, Gossip, Confrontation, Mystery, Comedy, and Power. Location tags belong to a different set. Event affinity explicitly bridges those sets through `locationTypeBonuses`, which is a useful structure.

However, references such as a Medical event, Business event, Power event in a Family location, and a Law-tagged location are not consistently distinguished in card prose. Medical and Business are not event types. Criminal appears in the affinities of Crime of Passion and Kidnapping Plot, but no location has a Criminal tag, so that individual affinity cannot match.

`checkMismatch` pays when a character shares no location tags, except that any Wild Card location suppresses mismatch. This is no longer the historical three-tier distance formula. It rewards characters with narrow or rare tags more often. The Stranger and Ex-Con mismatch at 21 of 25 locations, the Intern at 12. These are opportunities in the defined inventory, not expected game scores. More character tags can reduce the automatic reward, and Wild Card on a character does not work as a wildcard.

The historical eight characters in each of three social classes is not the current inventory: there is no Middle Management tag. Among selectable characters, 6 have High Society and 9 have Working Class, while other characters may have neither and several have multiple role tags.

Mismatch implementation [src/lib/gameData.js:525](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L525); event type colors [src/lib/gameData.js:76](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L76); character definitions [src/lib/gameData.js:3](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L3).

## Reactions, pile-ons, and actual attachment behavior

The existing reaction system implements negate, redirect, reflect, and expose with some type restrictions. That is useful material for interference. But only the selected target receives a counter window, and the pending event resolves or disappears after that single response. Other players cannot join, the instigator cannot answer the counter, and a redirected target receives no new reaction window or immunity check. The Confrontation-only Karma counter also doubles a positive target reward when used against a Confrontation with positive `dpTarget`, because the handler does not require a negative penalty.

Pile-on is a separate mechanism. It is offered only after an ordinary same-type streak reaches two, only to the next seated player, and only if that player holds the same event type. Its resolution pays that player their own event's base and bonuses. It neither changes the original outcome nor applies the piled-on card's target effect, secret flow, chain creation, or state changes. It is an extra scoring play rather than a shared contested scene.

Persistent chains record their source name and involved player IDs. They do not store an attached card tree or typed edges identifying what a response changed. An unrelated event can escalate a chain merely because the acting player belongs to it or its genre matches. The touch logic excludes resolved and suppressed chains but not exploded or paused chains. That permits completed stories to continue accumulating escalation and makes the pause unreliable.

Nineteen of the 27 templates use a vote, while eight use automatic resolution. Dig for Dirt and Total Exposure have templates, but their special reveal route bypasses ordinary chain creation. Nine proactive action designs, representing 18 draw cards, require an active chain and cannot be used before one exists. That dependence is reasonable only if the game reliably creates relevant, actionable stories.

Reaction selection [src/pages/GameBoard.jsx:446](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L446); redirect [src/pages/GameBoard.jsx:585](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L585); pile-on offer [src/pages/GameBoard.jsx:403](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L403); pile-on resolution [src/pages/GameBoard.jsx:802](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L802); chain data [src/pages/GameBoard.jsx:258](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L258); chain touch [src/pages/GameBoard.jsx:282](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L282).

## Character and state cases that need decisions

The Evil Twin is excluded from setup, yet no normal rule transforms a character into it. The special unmasking branch only runs if the target is already the Evil Twin, and then replaces the main character. Its promise to inherit the original tags and abilities is not modeled. This conflicts with the current direction to keep a permanent main character. A future Evil Twin could instead be an attached condition or impersonation card.

Protected has no damage reduction. Suspected, Heartbroken, Blackmailed, Humiliated, Exposed, Vindicated, Disgraced, and Entangled do not generally apply their printed numerical effects. Some negative states do enable Twist the Knife, so they are not entirely unused. Vindicated has no normal application path. Disgraced says this turn without expiry logic. Deny Everything additionally removes Blackmailed, although its card lists only Exposed, Humiliated, and Disgraced.

Many abilities depend on acting, dramatic speeches, being convincing, or unspecified declarations. The Doctor, Artist, Counselor, Newcomer, and Socialite illustrate the conflict with the user's objective scoring requirement. Retain the character identities while rewriting abilities into explicit conditions, costs, limits, and effects.

Evil Twin definition [src/lib/gameData.js:38](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L38); selectable filter [src/pages/GameSetup.jsx:40](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameSetup.jsx#L40); unmask branch [src/pages/GameBoard.jsx:377](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L377); character replacement [src/pages/GameBoard.jsx:1667](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L1667); state definitions [src/lib/gameData.js:610](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/lib/gameData.js#L610); Deny Everything [src/pages/GameBoard.jsx:640](https://github.com/Kdhunt/DramaCardGame/blob/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86/src/pages/GameBoard.jsx#L640).

## Preserve and rewrite for the current direction

Preserve permanent character identity, readable tags, secrets with individual stakes, location affinities, recognizable soap opera incidents, explicit redirects and reversals, and persistent consequences. Character-centered conditional benefits are already suggested by Servant, Intern, Widow, Paparazzo, and secret goals, even though their execution is missing.

Rewrite immediate independent DP grants into a pending scene with named stakes and a resolution window. Let different players attach cards to the specific character, event, condition, or earlier response they affect. Require every play to identify its acting main character. Resolve the final outcome after everyone has an opportunity to respond, then pay the distinct benefits that the surviving cards specify.

The following are proposed rewrites, not implemented rules or approved card text:

| Existing material | Proposed role | Objective specification needed |
| --- | --- | --- |
| Forbidden Kiss, Hidden Affair | Establish a relationship or secret linking main characters | Exactly which characters are linked and whether the relationship is public |
| Public Scandal, Exposé Published | Initiate a contested attempt to expose or damage something already present | Eligible fact, success threshold, opposing outcome, and each outcome's consequence |
| Redirect!, Wrong Address | Attach a response that changes a named target | New target eligibility and whether that target may respond |
| Deny Everything | Counter a specific accusation or exposed fact in the pending scene | What it negates, what remains true, and whether suspicion persists |
| Leak to the Press | Make an existing matter public and change the pending stakes | Which secret is revealed and what other players can still prevent |
| Everyone's Watching | Attach a bounded reward modifier to the scene | Which rewards change, cap, and when the modifier can be removed |
| The Servant, The Intern | A personal incentive to assist a qualifying main character | An actual support card or committed effect, named recipient, and limited reward |
| Hidden Affair, Hidden Addiction | Give the target a reason to welcome an otherwise threatening outcome | A stored fact and a one-time condition for the alternative benefit |
| The Paparazzo | Benefit from publication involving an eligible subject | Which eligible subject or relationship creates demand for the photograph |
| Evil Twin | Attach an impersonation or replacement-claim condition | Preserve the player's main character and resolve the disputed identity mechanically |

Avoid awarding DP for narration quality, vague audience reaction, or mere participation. Do not infer that every genre match is a causal continuation of a story. Each printed condition should have a corresponding rule field and an executable check.

## Complete character inventory

The ability column summarizes the currently printed promise. None of these ability strings has its own implemented trigger in the rules. The Evil Twin has a name-specific branch described above, which is not execution of its printed inherited ability.

| Character | Tags | Selectable | Printed ability |
| --- | --- | --- | --- |
| The Doctor | Medical | Yes | Once per scene, if you 'recall' a forgotten memory in a dramatic outburst, gain +1 DP. |
| The Tycoon | Business, High Society | Yes | Gain +1 DP whenever you play a High Drama Event that involves money, power, or blackmail. |
| The Romantic | Romantic | Yes | If you form a declared 'love relationship' with another character, both gain +2 DP. |
| The Matriarch | Family, High Society | Yes | Once per scene, if you meddle in another character's affairs, gain +1 DP (max 3 uses). |
| The Heir | High Society | Yes | If you lose 2+ DP in a single event, you may distribute 1 DP to each other player for sympathy. |
| The Celebrity | Celebrity | Yes | If paparazzi or public gossip appear (any Event referencing media/rumor), gain +1 DP. |
| The Stranger | Wild Card | Yes | When you enter a scene, spend 1 DP to conceal your motive. If exposed, gain +2 DP. |
| The Servant | Working Class | Yes | If you assist another character's event, you each gain +1 DP. |
| The Newcomer | Working Class, Wild Card | Yes | Once per scene, if you bumble into trouble unknowingly, gain +1 DP. |
| The Widow | Romantic, Family | Yes | If a romantic event targets you, gain +1 DP for your tragic backstory. |
| The Politician | Business, High Society | Yes | Whenever you 'make a deal' or bribe in an Event, gain +1 additional DP. |
| The Rebel | Working Class, Criminal | Yes | Gain +1 DP when a mismatch places you in a fancy/high-society location. |
| The Gossip | Working Class | Yes | If an Event reveals secrets or rumors, gain +2 DP. You live for the tea. |
| The Golden Child | Family | Yes | Once per game, automatically negate a negative DP effect that targets you. |
| The Detective | Law, Criminal | Yes | If an Event involves a crime or suspicion, gain +2 DP for investigating. |
| The Nun | Spiritual | Yes | High Drama Events in your presence cost +1 DP to play. |
| The Artist | Working Class, Artistic | Yes | Whenever you deliver a dramatic speech or monologue, gain +1 DP (max once per scene). |
| The Intern | Working Class, Business | Yes | If you assist a 'boss' character in an Event, gain +1 DP for your enthusiasm. |
| The Millionaire | High Society | Yes | When placed in a low-class location, double any DP gained for mismatch. |
| The Nurse | Medical, Working Class | Yes | Gain +1 DP whenever you 'save' or heal another character in a Medium/High drama event. |
| The Starlet | Celebrity | Yes | If an Event references media, audition, or public appearance, gain +1 DP. |
| The Rockstar | Celebrity, Working Class | Yes | Each time you cause a rowdy event or meltdown (Medium/High drama), gain +1 DP. |
| The Paparazzo | Celebrity, Working Class | Yes | If you catch another character's secret on camera, they lose 1 DP and you gain +2 DP. |
| The Counselor | Medical, Family | Yes | You may forego your +1 performance bonus to give +1 DP to another player once per scene. |
| The Lawyer | Law, Business | Yes | Whenever you 'win' an argument or lawsuit event, gain +2 DP. |
| The Ex-Con | Criminal | Yes | Gain +1 DP each time you sabotage a High Society character (max 2 times per game). |
| The Schemer | Business, Wild Card | Yes | Once per game, you may secretly announce a target at the start of your turn. If you cause them to lose DP this turn, gain +2 DP. |
| The Heartbreaker | Romantic, Celebrity | Yes | Each time a romantic event you instigate causes another player to lose DP, gain +1 bonus DP. |
| The Patriarch | Family, Business | Yes | If you play a Power event in a Family location, gain +2 DP instead of normal bonus. |
| The Socialite | High Society | Yes | If you flirt or seduce in an Event, gain +1 DP. If it leads to a fight or love triangle, gain +2 total. |
| The Prodigal | Family, Wild Card | Yes | The first time each game you return to a Family location after it has changed, gain +2 DP. |
| The Evil Twin | Wild Card, Criminal | No | Inherits all tags and abilities of the player's original character, but all DP penalties they cause are doubled. |

## Complete location inventory

These effects are printed prose. Event location affinity can add the separate generic bonus.

| Location | Tags | Printed effect |
| --- | --- | --- |
| Glamorous Mansion | High Society | +1 DP to any character who humiliates a wealthy resident here. |
| Trailer Park | Working Class | If a High Society character is here, apply double mismatch bonus. |
| Hospital ER | Medical | +1 DP to a Medical character who resolves an injury event here. |
| Corporate Boardroom | Business | Business-based Events played here yield +1 DP to the instigator. |
| Wedding Chapel | Romantic | Any Romantic Event here yields +1 DP. If called off, +2 DP instead. |
| Seedy Dive Bar | Working Class | If a High Society or Celebrity character visits, gain +1 mismatch DP. |
| City Hall | Business, Law | Political or legal Events here earn +1 DP for the instigator. |
| Tropical Island Resort | Wild Card | High Drama Events cost -1 DP (vacation meltdown discount!). |
| Chic Penthouse | High Society | If a Working Class or Criminal tag is here, +1 mismatch DP for them. |
| Police Station | Law | Criminal or Detective characters gain +1 DP when they star in an event here. |
| Family Farm | Working Class | High Society mismatch triggers +1 DP. High-society events here +2 mismatch. |
| Fashion Studio | Celebrity, Artistic | Any 'modeling,' 'photo shoot,' or 'performance' events gain +1 DP. |
| Small-Town Café | Working Class | If a High Drama event is played here, it yields +1 DP from shocked bystanders. |
| Casino Royale | High Society, Business | Any gambling or risk-based event gains +1 DP here. |
| Courtroom | Law | Legal showdowns yield +2 DP if a Lawyer or Politician is involved. |
| Secret Love Nest | Romantic | Romantic or illicit affairs here yield +1 extra DP. |
| Suburban House | Family | Domestic spats (Medium Drama) grant +1 DP. |
| Luxury Yacht | High Society | Events referencing wealth or parties earn +1 DP. Working Class mismatch +1. |
| Convent | Spiritual | If a moralizing character is here, High Drama costs +1 DP to play. |
| Roadside Motel | Working Class | Secret rendezvous events yield +1 DP. High Society mismatch +1. |
| Nightclub | Celebrity, Working Class | Music/performance events gain +1 DP. Brawls gain +1 mismatch. |
| Rodeo Arena | Working Class, Wild Card | High Society or Medical mismatch +1 DP. If injury occurs, +2. |
| Spa Retreat | High Society | Low Drama events here grant +1 DP if it's a comedic meltdown. |
| Airport Terminal | Wild Card | If a character tries to flee or skip town, that event grants +2 DP. |
| Beachfront Boardwalk | Romantic, Wild Card | Romantic confessions or comedic slip-ups yield +1 DP. |

## Low drama draw designs

| Name | Type | Actor DP | Target DP | Cost | Copies |
| --- | --- | --- | --- | --- | --- |
| Coffee Spill | Comedy | 1 | 1 | 0 | 2 |
| Clumsy Flirtation | Romance | 1 | 1 | 0 | 2 |
| Petty Gossip | Gossip | 1 | 1 | 0 | 2 |
| Awkward Silence | Comedy | 1 | 0 | 0 | 2 |
| Lost Keys | Comedy | 2 | 0 | 0 | 2 |
| Spilled Secrets (Minor) | Gossip | 1 | 1 | 0 | 2 |
| Mild Insult | Confrontation | 1 | 1 | 0 | 2 |
| Flashback Hint | Mystery | 1 | 0 | 0 | 2 |
| Tactless Joke | Comedy | 2 | 0 | 0 | 2 |
| Little White Lie | Mystery | 1 | 0 | 0 | 2 |
| Wrong Number | Comedy | 1 | 0 | 0 | 2 |
| Stolen Parking Spot | Confrontation | 1 | 1 | 0 | 2 |
| Overheard Conversation | Gossip | 1 | 0 | 0 | 2 |
| Embarrassing Photo | Gossip | 1 | 1 | 0 | 2 |
| Wardrobe Malfunction | Comedy | 2 | 0 | 0 | 2 |
| Accidental Compliment | Romance | 1 | 1 | 0 | 2 |
| Mixed-Up Orders | Comedy | 1 | 0 | 0 | 2 |
| Suspicious Text | Mystery | 1 | 0 | 0 | 2 |
| Name Forgotten | Comedy | 1 | 0 | 0 | 2 |
| Fender Bender | Confrontation | 1 | 1 | 0 | 2 |
| Surprise Party Fail | Comedy | 1 | 0 | 0 | 2 |
| Snooping | Mystery | 1 | 0 | 0 | 2 |
| Borrowed and Not Returned | Confrontation | 1 | 1 | 0 | 2 |
| Fake Sick Day | Comedy | 2 | 0 | 0 | 2 |
| Wrong Restroom | Comedy | 1 | 0 | 0 | 2 |
| Whisper Campaign | Gossip | 1 | 0 | 0 | 2 |

## Medium drama draw designs

| Name | Type | Actor DP | Target DP | Cost | Copies |
| --- | --- | --- | --- | --- | --- |
| Secret Revealed | Mystery | 2 | 1 | 0 | 3 |
| Love Triangle | Romance | 2 | 2 | 0 | 3 |
| Blackmail | Power | 2 | -1 | 0 | 3 |
| Lovers' Quarrel | Romance | 2 | 2 | 0 | 3 |
| Slander/Defamation | Gossip | 2 | 0 | 0 | 3 |
| Dramatic Ultimatum | Confrontation | 2 | 1 | 0 | 3 |
| Sudden Confession | Mystery | 2 | 1 | 0 | 3 |
| Brawl / Catfight | Confrontation | 2 | 2 | 0 | 3 |
| Gossip Gone Wild | Gossip | 2 | -1 | 0 | 3 |
| Jealous Outburst | Confrontation | 2 | 1 | 0 | 3 |
| The Intervention | Power | 2 | 0 | 0 | 3 |
| Fake Pregnancy Scare | Mystery | 2 | 1 | 0 | 3 |
| Forbidden Kiss | Romance | 2 | 2 | 0 | 3 |
| Power Play | Power | 2 | -1 | 0 | 3 |
| Runaway Moment | Comedy | 2 | 0 | 0 | 3 |
| Caught Red-Handed | Mystery | 2 | -1 | 0 | 3 |
| Social Media Blowup | Gossip | 2 | -1 | 0 | 3 |
| Secret Alliance | Power | 1 | -1 | 0 | 3 |
| Dramatic Monologue | Comedy | 2 | 0 | 0 | 3 |
| Staged Faint | Comedy | 2 | 0 | 0 | 3 |
| Inheritance Challenge | Power | 2 | -1 | 0 | 3 |
| Mistaken Identity | Mystery | 2 | 1 | 0 | 3 |
| Scandalous Letter | Gossip | 2 | -1 | 0 | 3 |
| Near-Death Experience | Mystery | 2 | 0 | 0 | 3 |
| Hostile Takeover | Power | 2 | -1 | 0 | 3 |
| Dig for Dirt | Mystery | 2 | 0 | 0 | 3 |

## High drama draw designs

| Name | Type | Actor DP | Target DP | Cost | Copies |
| --- | --- | --- | --- | --- | --- |
| Back from the Dead! | Mystery | 3 | 1 | 1 | 3 |
| Wedding Crash | Confrontation | 3 | 2 | 0 | 3 |
| Evil Twin Unmasked | Mystery | 3 | -2 | 1 | 3 |
| Sudden Disaster | Power | 3 | 1 | 0 | 3 |
| Amnesia Cured! | Mystery | 3 | 1 | 0 | 3 |
| Public Scandal | Gossip | 3 | -1 | 0 | 3 |
| Illegitimate Child | Power | 3 | 2 | 1 | 3 |
| Explosive Love Confession | Romance | 3 | 1 | 0 | 3 |
| Crime of Passion | Confrontation | 3 | 2 | 0 | 3 |
| Season Finale Twist | Power | 4 | -1 | 2 | 3 |
| Faked Death Revealed | Mystery | 3 | -1 | 1 | 3 |
| Secret Child Revealed | Power | 3 | -2 | 1 | 3 |
| Courtroom Breakdown | Confrontation | 3 | 2 | 0 | 3 |
| Kidnapping Plot | Power | 3 | 2 | 1 | 3 |
| Exposé Published | Gossip | 3 | -2 | 0 | 3 |
| Forbidden Romance Exposed | Romance | 3 | -1 | 0 | 3 |
| Corporate Espionage | Power | 3 | -2 | 1 | 3 |
| The Double Cross | Confrontation | 3 | -2 | 0 | 3 |
| Grand Reconciliation | Romance | 3 | 3 | 0 | 3 |
| Revolution | Power | 4 | -2 | 1 | 3 |
| Total Exposure | Power | 3 | 0 | 1 | 3 |

## Complete action inventory

Each design has two copies in the draw deck. Timing and targets below are the data definitions; they do not guarantee the corresponding handler implements the entire printed effect.

| Action | Category | Timing | Target | Printed effect |
| --- | --- | --- | --- | --- |
| Not So Fast! | Suppression | reactive | event | Reduce a chain's intensity by 1 OR cancel an event entirely before it resolves. |
| Plot Twist! | Manipulation | reactive | event | Cancel an event targeting you. The instigator loses 1 DP for the backfire. |
| Oh No You Don't | Suppression | reactive | event | Cancel any High Drama event. The instigator must discard one more card. |
| Redirect! | Redirection | reactive | event | Redirect a targeted event to a different player of your choice. |
| Wrong Address | Redirection | reactive | event | Redirect a Gossip or Mystery event ;  the rumor reaches a different target. |
| Backfire! | Manipulation | reactive | event | Reflect an event back on the instigator. They receive all DP effects they intended for you. |
| Mirror Mirror | Manipulation | reactive | event | Reflect a Romance or Gossip event. Instigator takes the negative DP, you take the positive. |
| Karma's a Witch | Manipulation | reactive | event | Reflect any Confrontation event. The instigator receives double the target DP penalty. |
| I Know Your Secret! | Exposure | both | player | Force a target player to reveal one of their Secret cards. They immediately lose the penalty DP. |
| Immunity Idol | Protection | both | self | Play before your turn begins. You are immune to all event effects this round. |
| Pour Gasoline | Escalation | proactive | chain | Target an active chain. +1 intensity. If already level 2, immediately triggers climax. |
| Change the Narrative | Framing | proactive | chain | Swap who is considered instigator and victim in a chain. Changes who gains DP at resolution. |
| Drag Them Into It | Insertion | proactive | chain_player | Add another player to an active chain. Apply Entangled state to them. |
| Deny Everything | Suppression | proactive | self | Remove Exposed, Humiliated, or Disgraced state from yourself. Gain Suspected instead. |
| Leak to the Press | Exposure | proactive | chain | Escalate a chain AND expose one secret of a random player involved in it. |
| Flip the Script | Framing | proactive | chain | At this chain's climax, you decide who gains the instigator DP. Creates lobbying and threats. |
| Everyone's Watching | Amplification | proactive | chain | Mark a chain: all DP gains and losses from its resolution are doubled. |
| Behind Closed Doors | Suppression | proactive | chain | Pause a chain for 1 turn ;  it cannot be escalated. When it resumes it gains +1 intensity. |
| You're Involved Now | Insertion | proactive | chain_player | Forcibly add any player to an active chain. They gain Entangled and cannot avoid escalation. |
| Twist the Knife | Escalation | proactive | player | If your target has any negative state (Exposed, Humiliated, etc.), escalate all their active chains twice. |
| Play the Victim | Redirection | proactive | self | Gain Protected state ;  the next DP penalty targeting you is reduced by 1. |
| Blow It Wide Open | Exposure | proactive | chain | Reveal ALL unrevealed secrets of every player involved in the target chain. Nuclear option. |

## Complete secret inventory

Penalties execute when a special exposure effect reveals the secret. Goal rewards are printed but have no completion handler.

| Secret | Exposure penalty | Goal reward | Printed goal |
| --- | --- | --- | --- |
| Hidden Affair | 3 | 4 | Have the affair publicly declared or defended in a romantic event. |
| Embezzlement | 4 | 5 | Get away with it ;  survive to game end without being exposed. |
| Fake Identity | 3 | 4 | Convince another player to vouch for your 'true' identity in a scene. |
| Hidden Addiction | 2 | 3 | Successfully 'recover' by having another character support or save you in an event. |
| Murder Cover-Up | 5 | 6 | Frame another character for the crime in a Mystery or Power event. |
| Spy for the Enemy | 4 | 5 | Successfully redirect or negate an event using 'inside information' (play a Counter card). |
| Blackmail Victim | 3 | 4 | Turn the tables ;  play a Blackmail or Power event targeting your blackmailer. |
| Stolen Inheritance | 4 | 5 | Win or survive an Inheritance or legal event without losing DP. |
| Paternity Secret | 4 | 5 | Publicly claim the child or relationship in a Family or High Drama event. |
| Criminal Record | 3 | 4 | Avoid all Law-tagged location effects for the entire game. |
| Staged Accident | 4 | 5 | Collect insurance or sympathy DP by being 'saved' in a Medical or Mystery event. |
| Fake Credentials | 3 | 4 | Successfully bluff your expertise ;  assist in a Medical, Law, or Business event without being questioned. |
| Double Life | 4 | 4 | Play events from two different type categories (e.g. Romance and Power) in the same game. |
| Sabotaged Rival | 3 | 4 | Make that rival lose DP again in any event this game. |
| Forged Document | 3 | 4 | Use the document to win a legal, business, or inheritance event. |
| Hidden Child Abroad | 4 | 5 | Reveal the child dramatically in a Family or High Drama event for maximum effect. |
| Insurance Fraud | 3 | 4 | Profit from a Medical event by gaining DP while supposedly 'recovering'. |
| Witness to a Crime | 3 | 4 | Break your silence ;  reveal what you saw in a Confrontation or Mystery event. |
| Stolen Idea | 2 | 3 | Defend your 'original idea' and win a Power or Business event against the true creator. |
| Secret Gambling Debt | 3 | 4 | Win enough DP from events to 'pay off' the debt ;  reach the target DP before any other player. |

## Complete aspiration inventory

The application offers a claim button rather than verifying these conditions. End-of-game aspirations need an explicit end scoring phase in any revised design.

| Aspiration | Reward | Printed condition |
| --- | --- | --- |
| Heart of the Drama | 5 | Gain 6+ DP total from Romance-type events. |
| Pot Stirrer | 4 | Play 3 or more Gossip-type events across the game. |
| Scene Stealer | 5 | Be the instigator of 3 or more High Drama events. |
| Location Loyalist | 4 | Play 3 events at the same location without it changing. |
| Chain Reaction | 4 | Participate in a chain of 3+ events of the same type in a row. |
| Counter Puncher | 4 | Successfully play 2 counter cards in one game. |
| Mismatch Maven | 4 | Earn 3 or more mismatch bonus DP across the game. |
| Pile-On King | 4 | Jump into another player's chain as a pile-on at least twice. |
| Secret Keeper | 5 | Reach game end with all your secrets unrevealed. |
| Romantic Lead | 4 | Gain DP from a Romance event played at a Romantic-tagged location. |
| Confrontation Queen | 4 | Instigate 2 Confrontation events and gain DP from both. |
| Mystery Merchant | 4 | Gain DP from 2 Mystery events targeting other players. |
| Power Trip | 5 | Gain 8+ DP total from Power-type events. |
| Drama Magnet | 4 | Have 3 or more events played targeting you across the game. |
| The Final Twist | 5 | Play a High Drama event when the leading player has 5 or fewer DP left to win. |

## Verification limits

The inventory was calculated directly from exports and the effect findings were traced through card renderers, setup, event resolution, secret resolution, counter handlers, action handlers, chain logic, and aspiration claiming. No gameplay was simulated and no application behavior was tested in a browser for this document. A later implementation should be tested against explicit acceptance examples before balance conclusions are presented as established.

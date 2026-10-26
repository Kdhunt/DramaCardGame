# Current proposed direction: contested scenes and personal stakes

Status: design proposal following the user's latest clarification. It is not a complete final rulebook and has not been validated through human playtesting.

## Core experience

Each player has one permanent main character. A scene presents a situation with a disputed outcome. Several players can add cards that change what happens, complicate earlier cards, or create an opportunity for their own character to benefit.

The intended feeling is a developing run of interference: an accusation, a denial, evidence, a cover-up, a reversal, and a final opportunity to exploit the consequences. Players have reasons to help or hinder because their own characters have different stakes.

## Three connected elements

| Element | Purpose |
| --- | --- |
| Outcome | Determines what happens: exposure or concealment, a wedding proceeding or collapsing, control of an inheritance changing hands |
| Drama | Measures escalation and can increase specified rewards |
| Personal stakes | Determines who benefits, under which exact conditions, and how |

A card that strengthens a cover-up may reduce the chance of exposure while increasing Drama. Both sides can escalate the situation while seeking different endings.

Outcome strength and reward size must be distinguishable. A bigger potential reward should not automatically make its preferred outcome more likely. The initial prototype can use small printed values; its exact scoring scale remains open.

## Main characters

The owner of a card acts through their main character as an instigator, witness, victim, ally, antagonist, or professional participant. A character's traits should grant specific opportunities or conditional advantages.

For example, an alleged victim can produce original work, a journalist can publish an interview, and a publicist can manage the public response. A general Denial can remain available to any accused character.

Character abilities need explicit triggers and frequency limits. An ability that says a character benefits from publicity needs a defined Public condition and a rule specifying when the benefit is paid. Narrative statements such as "be dramatic" cannot substitute for those conditions.

Social class may remain as a tag for qualifying interactions. The historical class-distance formula should not decide whether an otherwise aligned scene can contain betrayal or scandal.

## Cards affecting other cards

| Existing element | Possible follow-up | Purpose |
| --- | --- | --- |
| Relationship | Secret | Establishes an unresolved risk involving named characters |
| Secret | Evidence | Makes an exposure attempt possible or stronger |
| Evidence | Alibi | Changes the likelihood of the exposure outcome |
| Alibi | Contradictory Evidence | Answers the defense and shifts the likely ending |
| Exposure | Tell All Interview | Gives the exposed character a new opportunity while retaining the consequence |
| Relationship | Betrayal | Changes the current conflict and future opportunities |
| A specified reward | Blackmail Demand | Diverts a defined portion to another character |

Card attachments should express an actual dependency. Playing another card with the same broad genre tag is insufficient by itself to establish that it answers the previous card.

## Worked scene

At a fashion show, a Secret connects Leona and Mara: Leona allegedly stole Mara's design. The scene is disputed between Exposure and Cover Up.

| Play | Main character | Card target | Contribution |
| --- | --- | --- | --- |
| Photo of the Original | Quinn, journalist | The Secret | Exposure +2 |
| Just a Coincidence | Leona, accused designer | The Photo | Cover Up +3 |
| Dated Sketchbook | Mara, alleged victim | The denial | Exposure +4 |
| Cease and Desist | Felix, publicist | The evidence | Cover Up +2 |
| Publish the Interview | Quinn | Mara's evidence | Exposure +3 |

Exposure stands at 9 and Cover Up at 5. The exact relationship between these values and accumulated Drama is still a prototype choice. These are illustrative cards, not entries currently implemented in the repository.

Possible benefits have distinct printed conditions:

* Quinn receives a scoop reward if exposure succeeds.
* Mara receives vindication because the exposed theft involved her main character.
* Leona receives a protection reward if the allegation remains unconfirmed. A different card, Tell All Interview, could let her benefit from exposure while accepting its persistent consequences.
* Felix receives a professional fee if his card's participation condition is met. A client losing need not erase a clearly defined fee.

This produces several motives around one outcome. It also makes both possible outcomes worth pursuing. Exact reward amounts require testing.

## Multiplication and distribution

An effect that enlarges a reward and an effect that reallocates it need separate rules.

* Live Broadcast could double a specified exposure reward when attached to a qualifying public revelation.
* Trusted Confidant could increase a protection reward if a cover-up succeeds.
* An agreed helper payment could transfer a stated amount from the principal beneficiary's award.
* Blackmail Demand could divert part of an award under its printed conditions.

Other small character or card bonuses can be paid independently if the rules explicitly identify their source. Do not promise both a conserved shared pool and unlimited independent payments from that same pool.

The design has not committed to one universal pot. The latest clarification prioritizes interacting cards and different reasons to benefit. A common reward can still exist for a particular scene without creating universal winner rankings.

Every reward effect needs an owner, trigger, amount or formula, payment source, timing, and stacking limit. No reward should be paid twice for the same resolved condition unless a card explicitly creates a new payable event.

## Proposed exchange procedure

1. The initiating card establishes the conflict, eligible participants, possible outcomes, and rewards.
2. Players receive opportunities clockwise to contribute one legal card or pass.
3. Passing does not withdraw a player. Another contribution lets them reconsider when their opportunity returns.
4. A new contribution resets the consecutive-pass count.
5. Everyone passing consecutively ends the exchange.
6. Resolve the outcome, evaluate all qualifying benefits, pay once, and retain consequences that matter later.

A first test could limit each player to two contributions, including the initiating play, and allow no replacement draws during the exchange. These limits are proposed controls, not settled requirements. Cards must resolve in a defined order, with explicit rules for cancellation, redirection, and effects that depend on an earlier card.

## What carries forward

Relationships and unresolved facts can survive a scene. Settled rewards do not accrue again automatically. Exposure should remain a fact unless a later effect explicitly changes what characters or the public believe. Denial should not silently reset an exposed Secret into a fresh source of identical payouts.

## Validation priorities

* Can three or more players explain different personal reasons to intervene?
* Does a typical exchange contain a genuine reversal or consequential choice?
* Can a defending character profit without every defense automatically becoming the best choice?
* Do players preserve cards for later scenes, rather than emptying every hand into every exchange?
* Can players at zero Drama still make meaningful plays?
* Do printed tags and relationships prevent arbitrary cards from affecting unrelated situations?
* Are multipliers exciting without making previous scenes irrelevant?
* Can a player understand both the outcome and the reward calculation from the visible cards?

These questions require representative play sessions. The isolated mathematical and source checks elsewhere in this folder cannot establish fun or balance.

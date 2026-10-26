# Access, provenance, and limits

Research session date: October 25, 2026, America/Denver. Some runtime timestamps were October 26 in UTC; individual conversation messages did not supply reliable per-message timestamps.

## Repository source

* Repository: [Kdhunt/DramaCardGame](https://github.com/Kdhunt/DramaCardGame).
* Reviewed branch: main.
* Reviewed commit: [`68ae0ae4b5cf47c825fa88b7773dda7ef6382c86`](https://github.com/Kdhunt/DramaCardGame/commit/68ae0ae4b5cf47c825fa88b7773dda7ef6382c86).
* Commit date: April 13, 2026.
* Commit message: initial checkin.
* The repository tree, README, package manifest, game data, page components, card components, and game-specific components were retrieved through the connected GitHub integration.
* Vendor UI scaffolding was inventoried but is not the focus of the mechanics audit.

References to implemented behavior in this folder refer to this commit. The live Base44 application's published version was not independently established.

## Website and MCP access

The user supplied:

`https://drama-card-show.base44.app/api/mcp`

An ordinary web retrieval could not access the endpoint. A direct anonymous GET followed a redirect to a login page and returned HTML. A standard JSON-RPC MCP initialization POST to the supplied endpoint returned HTTP 405 with the message "Method Not Allowed".

These observations establish that the attempted connection did not expose the game's cards or rules. They do not uniquely establish the cause, prove that OAuth is configured incorrectly, or establish that the endpoint cannot work for an authenticated client.

Base44's official [App MCP documentation](https://docs.base44.com/Integrations/app-mcp) describes Streamable HTTP connections, public read access, OAuth access for sign-in-required apps, selectable tool access, and publication to activate configuration changes. The assistant suggested checking those settings. No Base44 configuration was changed.

The user then directed the review to GitHub, which provided actual source access. Resolving the MCP connection is not required to preserve this review.

## Historical conversation evidence

Earlier discussions were recovered as summaries rather than raw transcripts. The history document distinguishes user constraints from earlier assistant proposals and identifies uncertainty. A repeated assistant suggestion is not evidence of user approval.

The current-session conversation record preserves the visible substantive messages and progress updates. It is not an export of every conversation ever held in this project. Internal tool traffic, credentials, unrelated personal context, and private working instructions are outside its scope.

## Comparative research evidence

* BoardGameGeek ratings were read from current indexed listings. Direct page requests often returned HTTP 403.
* Ratings and counts are rounded snapshots, not exact live database totals.
* Ratings reflect reception of whole games. They are not polls about the specific mechanisms discussed here.
* Published rulebooks, publisher explanations, and a licensed digital implementation grounded the mechanism descriptions.
* Proposed adaptations are design inferences. They have not been demonstrated to work in Drama! merely because a comparison game is successful.

## Validation boundaries

The audit includes static source inspection, pure-function execution, mathematical enumeration, and selected isolated handler reproductions. No claim is made that the revised engine has been implemented, that a complete browser session has been tested, that multiplayer synchronization has been validated, or that human playtesting has established balance.

See [validation results](validation-results.md) for the checks actually performed.

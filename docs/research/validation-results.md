# Validation results

## Reviewed source

The reviewed snapshot was retrieved as `Kdhunt/DramaCardGame` commit `68ae0ae4b5cf47c825fa88b7773dda7ef6382c86`, verified through GitHub branch and commit metadata. The local folder lacks Git metadata, so no local HEAD verification was performed.

The checks ran successfully with Node and built-in modules only. No dependency installation, application-source modification, browser automation, human playtest, randomized full-game simulation, or remote mutation was performed by this validation task.

## What passing means here

The 16 deterministic assertions reproduce the current implementation, including defects. A passing assertion that amplification does nothing means that missing behavior was reproduced; it does not certify the intended game as correct.

The script imports the actual `gameData.js` module. For resolver checks, it extracts named function definitions from the actual `GameBoard.jsx` source and supplies minimal state-setter stubs. Unrelated presentation effects and persistent-chain calls are stubbed when testing an event's arithmetic. The extracted chain and climax handlers are tested separately.

This isolates score calculations and state transitions without installing React. It does not validate React scheduling, state-update batching, rendering, dialogs, or complete turn flow. No actual win rates or game durations were measured.

## Observed outputs

All DP arrays preserve player order, with each player starting at 10 unless the case says otherwise.

| Check | Observed result |
|---|---|
| Deck levels, Low / Medium / High / Action | `[52, 78, 63, 44]`, total 237 |
| Character records / selectable characters / locations | `[32, 31, 25]` |
| Sequential bonus at counts 1, 2, 3, 4, 9 | `[0, 1, 2, 3, 3]` |
| Detective, Wedding Chapel, Grand Reconciliation, target B | DP `[15, 13]` |
| Same event, null target | DP `[15, 10]` |
| Same null-target event as fourth consecutive Romance | DP `[18, 10]` |
| Gossip, Small-Town Café, Petty Gossip | DP `[12, 10]`; character's printed additional bonus absent |
| Protected B hit by The Double Cross | DP `[14, 8]`; full 2-point target penalty |
| Exploded Corporate War touched by involved A's Coffee Spill | Status unstable, intensity 3, escalation count 4, climax selected |
| Paused Corporate War touched by involved A's Coffee Spill | Status unstable, intensity 3, escalation count 3, climax selected |
| Ordinary climax won by B | DP `[10, 13, 10]` |
| Same climax with amplification and framing flags favoring C | DP `[10, 13, 10]` |
| Karma's a Witch against Wedding Crash | DP `[14, 10]`; positive target reward doubled onto attacker |
| Total Exposure against Hidden Affair | DP `[13, 7]`; printed 1-point cost not deducted |
| Heart of the Drama claim without achievement history | DP 15, dreamRevealed true |
| Historical 27-case disparity enumeration | Character 0 totals 26; Character 1 totals 20; Character 2 totals 26 |

The script also prints exact hypergeometric random-hand probabilities for the six event types. These use the physical deck and a five-card hand; they are not observed pile-on frequencies.

## Reproduce

Run the following from the repository root. The command writes no files and makes no network requests. Resolver extraction assumes the function names and indentation of the reviewed snapshot; it intentionally fails if a named function cannot be located. After modifying those functions, update the desired expectations rather than treating these defect-preserving values as the permanent specification.

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const data = await import(pathToFileURL(resolve('src/lib/gameData.js')));
const { EVENTS, CHARACTERS, LOCATIONS, ASPIRATIONS, SECRETS, checkMismatch,
  getChainBonus, getLocationTypeBonus, getStateFromEvent } = data;
const source = readFileSync('src/pages/GameBoard.jsx', 'utf8');
let passed = 0;
function check(name, actual, expected) {
  assert.deepEqual(actual, expected, name);
  passed += 1;
  console.log(`PASS ${name}: ${JSON.stringify(actual)}`);
}
function extract(name) {
  const start = source.indexOf(`  const ${name} =`);
  assert.ok(start >= 0, `Find ${name}`);
  const end = source.indexOf('\n  };', start);
  assert.ok(end > start, `Find end of ${name}`);
  return source.slice(start, end + 6);
}
function compile(name, env) {
  return new Function(...Object.keys(env), `${extract(name)}\nreturn ${name};`)(...Object.values(env));
}
const noop = () => {};
const detective = CHARACTERS.find(c => c.name === 'The Detective');
const chapel = LOCATIONS.find(l => l.name === 'Wedding Chapel');
function runEvent(name, targetIdx, options = {}) {
  const card = EVENTS.find(c => c.name === name);
  const actor = options.actor || detective;
  const location = options.location || chapel;
  let state = { players: [
    { id:'A', name:'A', dp:10, character:actor, hand:[card] },
    { id:'B', name:'B', dp:10, character:detective, hand:[], states:options.targetStates || [] }
  ] };
  const env = { currentPlayer:state.players[0], currentLocation:location,
    currentTurn:0, eventChain:options.eventChain || null, gameState:state,
    checkMismatch, getChainBonus, getLocationTypeBonus, getStateFromEvent,
    setEventChain:noop, setGameState:fn => { state = fn(state); }, addLog:noop,
    createChain:noop, touchChains:noop, applyStateToPlayer:noop,
    checkClimaxTrigger:noop, setPlayedCard:noop, setShowPlayDialog:noop,
    setPhase:noop, setShowPerformanceBonus:noop, setPileOnPlayerIdx:noop,
    setShowPileOnDialog:noop };
  compile('resolveEventCard', env)(card, 0, targetIdx);
  return state.players.map(p => p.dp);
}
check('physical deck counts', ['low','medium','high','action'].map(l => EVENTS.filter(c => c.level === l).length), [52,78,63,44]);
check('character/location counts', [CHARACTERS.length, CHARACTERS.filter(c => c.selectable).length, LOCATIONS.length], [32,31,25]);
check('sequential chain is additive', [1,2,3,4,9].map(getChainBonus), [0,1,2,3,3]);
check('Grand Reconciliation with target', runEvent('Grand Reconciliation',1), [15,13]);
check('Grand Reconciliation with null target', runEvent('Grand Reconciliation',null), [15,10]);
check('fourth Romance resolves immediately for actor', runEvent('Grand Reconciliation',null,{eventChain:{locationId:chapel.id,eventType:'Romance',count:3}}), [18,10]);
check('Gossip printed ability is absent from ordinary score', runEvent('Petty Gossip',null,{actor:CHARACTERS.find(c=>c.name==='The Gossip'),location:LOCATIONS.find(l=>l.name==='Small-Town Café')}), [12,10]);
check('Protected does not reduce incoming penalty', runEvent('The Double Cross',1,{targetStates:['Protected']}), [14,8]);
let chains;
let climax;
const chainEnv = {
  gameState:{players:[{id:'A',name:'A'},{id:'B',name:'B'}]}, currentTurn:0,
  setDramaChains:fn => { chains=fn(chains); }, addLog:noop,
  setClimaxChain:c => { climax=c; }
};
function touchStatus(status,intensity,count) {
  chains=[{id:'x',title:'Corporate War',intensity,escalationCount:count,status,
    involvedPlayerIds:['A','B'],touchTags:['Power'],climaxType:'vote'}];
  climax=null;
  compile('touchChains',chainEnv)(EVENTS.find(c=>c.name==='Coffee Spill'),0,null);
  compile('checkClimaxTrigger',chainEnv)();
  return [chains[0].status,chains[0].intensity,chains[0].escalationCount,climax?.id];
}
check('unrelated Comedy reopens exploded vote chain',touchStatus('exploded',3,3),['unstable',3,4,'x']);
check('unrelated Comedy escalates paused chain',touchStatus('paused',2,2),['unstable',3,3,'x']);
function climaxResult(flags={}) {
  let state={players:[{id:'A',name:'A',dp:10},{id:'B',name:'B',dp:10},{id:'C',name:'C',dp:10}]};
  const chain={id:'v',title:'Public Scandal',involvedPlayerIds:['A','B'],instigatorId:'A',followUp:null,...flags};
  let chains=[chain];
  const env={gameState:state,setGameState:fn=>{state=fn(state);},addLog:noop,
    setDramaChains:fn=>{chains=fn(chains);},setClimaxChain:noop,setShowPerformanceBonus:noop};
  compile('resolveClimaxVote',env)({chain,winnerPlayer:state.players[1],winnerId:'B',counts:{B:2}});
  return {dp:state.players.map(p=>p.dp),status:chains[0].status};
}
check('ordinary climax award',climaxResult(),{dp:[10,13,10],status:'exploded'});
check('amplification/framing flags do not change payout',climaxResult({amplified:true,flipScriptBy:'C',instigatorId:'C'}),{dp:[10,13,10],status:'exploded'});
{
  const card=EVENTS.find(c=>c.name==='Wedding Crash');
  const counter=EVENTS.find(c=>c.name==="Karma's a Witch");
  let state={players:[{id:'A',name:'A',dp:10,hand:[card]},{id:'B',name:'B',dp:10,hand:[counter]}]};
  const env={counterOpportunity:{card,handIdx:0,targetIdx:1},currentTurn:0,
    isCounterValid:()=>true,setGameState:fn=>{state=fn(state);},addLog:noop,
    setCounterOpportunity:noop,setPhase:noop,setShowPerformanceBonus:noop,setImmunePlayers:noop};
  compile('resolveCounterOpportunity',env)(counter,0);
  check('Karma turns positive target reward into attacker gain',state.players.map(p=>p.dp),[14,10]);
}
{
  const card=EVENTS.find(c=>c.name==='Total Exposure');
  const secret=SECRETS.find(s=>s.name==='Hidden Affair');
  let state={players:[{id:'A',name:'A',dp:10,hand:[card]},{id:'B',name:'B',dp:10,hand:[],revealedSecretIds:[]}]};
  const env={currentTurn:0,gameState:state,setGameState:fn=>{state=fn(state);},
    addLog:noop,setSecretRevealState:noop,setPhase:noop,setShowPerformanceBonus:noop};
  compile('resolveSecretExpose',env)(1,secret,0,card);
  check('Total Exposure bypasses printed one DP fee',state.players.map(p=>p.dp),[13,7]);
}
{
  const dream=ASPIRATIONS.find(a=>a.name==='Heart of the Drama');
  let state={players:[{id:'A',name:'A',dp:10,dream,dreamRevealed:false}]};
  const env={currentPlayer:state.players[0],currentTurn:0,targetDP:20,
    setGameState:fn=>{state=fn(state);},addLog:noop,setShowAspirationDialog:noop,
    setWinner:noop,setShowWinDialog:noop,setShowPerformanceBonus:noop};
  compile('revealAspiration',env)();
  check('aspiration pays without achievement history',[state.players[0].dp,state.players[0].dreamRevealed],[15,true]);
}
function choose(n,k){let v=1;for(let i=1;i<=k;i++)v=v*(n-k+i)/i;return v;}
for(const type of ['Romance','Gossip','Confrontation','Mystery','Comedy','Power']) {
  const k=EVENTS.filter(c=>c.cardClass!=='action'&&c.type===type).length;
  console.log(`DATA matching ${type}: copies=${k}, P(at least one in random 5)=${(100*(1-choose(EVENTS.length-k,5)/choose(EVENTS.length,5))).toFixed(4)}%`);
}
const historical=[0,1,2].map(c=>{
  const scores=[];
  for(let l=0;l<3;l++)for(let e=0;e<3;e++)scores.push(Math.abs(c-l)+Math.abs(l-e)+Math.abs(c-e));
  return {character:c,total:scores.reduce((a,b)=>a+b,0),counts:[0,2,4].map(s=>scores.filter(x=>x===s).length)};
});
check('historical pairwise exhaustive enumeration',historical,[{character:0,total:26,counts:[1,3,5]},{character:1,total:20,counts:[1,6,2]},{character:2,total:26,counts:[1,3,5]}]);
console.log(`SUMMARY ${passed} deterministic checks passed; zero human playtests performed.`);
JS
```

## Source inspection findings outside the harness

Additional static findings, with exact source references, are documented in [scoring-and-economy.md](scoring-and-economy.md): the UI's null-target button; absent execution of Character abilities, location effects and sub-actions; target-only reaction windows; secret exposure routing before defenses; next-seat-only pile-ons; end-condition timing; aspiration validation; and subjective performance/climax awards.

The climax voting component also permits counting after two votes at larger player counts and lacks an explicit tied-vote rule. These observations came from reading source; the React component was not rendered by this harness.

## Reported completion

The captured run ended with:

```text
SUMMARY 16 deterministic checks passed; zero human playtests performed.
```

## Historical pot accounting check

This separate calculation belongs to the superseded fixed-award proposal. It verifies accounting only. It does not describe the chosen game direction or the current application.

The following reproduction enumerates 73,728 candidate allocations, including ties, unclaimed awards, and odd-token distribution. It checks that the distributed and returned amounts equal the available pot. The example produces pot 20, outgoing totals [3, 2, 1], incoming totals [2, 4, 0], awards [10, 10, 0], and no return to the bank.

```sh
python3 - <<'PY'
from itertools import product

def settle(edges, multiplier, fees, ratio, first=0):
    n = 3
    outgoing = [0] * n
    incoming = [0] * n
    directions = [(a, b) for a in range(n) for b in range(n) if a != b]
    for (a, b), value in zip(directions, edges):
        outgoing[a] += value
        incoming[b] += value
    fresh = sum(edges)
    pot = 2 * n + multiplier * fresh + fees
    cause_pool = pot * ratio[0] // sum(ratio)
    pools = [cause_pool, pot - cause_pool]
    paid = [0] * n
    returned = 0
    for scores, pool in zip([outgoing, incoming], pools):
        top = max(scores)
        if top == 0:
            returned += pool
            continue
        winners = [i for i in range(n) if scores[i] == top]
        share, odd = divmod(pool, len(winners))
        for i in winners:
            paid[i] += share
        ordered = sorted(winners, key=lambda i: (i - first) % n)
        for i in ordered[:odd]:
            paid[i] += 1
    assert sum(paid) + returned == pot
    assert all(x >= 0 for x in paid)
    assert sum(outgoing) == sum(incoming) == fresh
    return pot, outgoing, incoming, paid, returned

cases = 0
for edges in product(range(4), repeat=6):
    for multiplier in (1, 2):
        for fees in (0, 1, 3):
            for ratio in ((1, 1), (3, 1), (1, 3)):
                settle(edges, multiplier, fees, ratio)
                cases += 1
assert cases == 73728
assert settle((3, 0, 2, 0, 0, 1), 2, 2, (1, 1)) == (
    20, [3, 2, 1], [2, 4, 0], [10, 10, 0], 0
)
print({'allocation_checks_passed': cases})
print({'example': settle((3, 0, 2, 0, 0, 1), 2, 2, (1, 1))})
PY
```

## Documentation checks

The documentation batch contains 11 Markdown documents plus the repository README update. All seven current-session user requests were checked against the conversation record. Internal relative file links resolved, and 114 source line references were checked against the reviewed files. Source links are pinned to the reviewed commit so later game changes do not silently change the evidence. These checks validate documentation consistency, not the proposed gameplay.

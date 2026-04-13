// ============ CHARACTER CARDS ============
// selectable: false = only available via special in-game conditions, not during character creation
export const CHARACTERS = [
  // === SELECTABLE CHARACTERS ===
  { id: 1,  name: "The Doctor",       emoji: "🧠", tags: ["Medical"],                    selectable: true,  ability: "Once per scene, if you 'recall' a forgotten memory in a dramatic outburst, gain +1 DP.",                                    description: "A brilliant physician plagued by memory gaps and secrets." },
  { id: 3,  name: "The Tycoon",       emoji: "💰", tags: ["Business", "High Society"],    selectable: true,  ability: "Gain +1 DP whenever you play a High Drama Event that involves money, power, or blackmail.",                                description: "A ruthless business magnate craving control." },
  { id: 5,  name: "The Romantic",     emoji: "💕", tags: ["Romantic"],                    selectable: true,  ability: "If you form a declared 'love relationship' with another character, both gain +2 DP.",                                       description: "Falls in love easily and dramatically." },
  { id: 6,  name: "The Matriarch",    emoji: "👑", tags: ["Family", "High Society"],     selectable: true,  ability: "Once per scene, if you meddle in another character's affairs, gain +1 DP (max 3 uses).",                                  description: "A bossy, well-meaning mother figure who runs everything." },
  { id: 7,  name: "The Heir",         emoji: "🎩", tags: ["High Society"],                selectable: true,  ability: "If you lose 2+ DP in a single event, you may distribute 1 DP to each other player for sympathy.",                        description: "An altruistic heir to a fortune, beloved by many." },
  { id: 8,  name: "The Celebrity",    emoji: "📸", tags: ["Celebrity"],                    selectable: true,  ability: "If paparazzi or public gossip appear (any Event referencing media/rumor), gain +1 DP.",                                   description: "A star or influencer dogged by drama." },
  { id: 9,  name: "The Stranger",     emoji: "🕵️", tags: ["Wild Card"],                   selectable: true,  ability: "When you enter a scene, spend 1 DP to conceal your motive. If exposed, gain +2 DP.",                                     description: "A shadowy figure with unknown aims." },
  { id: 10, name: "The Servant",      emoji: "🫱", tags: ["Working Class"],               selectable: true,  ability: "If you assist another character's event, you each gain +1 DP.",                                                           description: "A butler, maid, or valet fiercely devoted to a household." },
  { id: 11, name: "The Newcomer",     emoji: "🌸", tags: ["Working Class", "Wild Card"], selectable: true,  ability: "Once per scene, if you bumble into trouble unknowingly, gain +1 DP.",                                                  description: "An innocent soul, new in town, ignorant of local intrigues." },
  { id: 12, name: "The Widow",        emoji: "🖤", tags: ["Romantic", "Family"],         selectable: true,  ability: "If a romantic event targets you, gain +1 DP for your tragic backstory.",                                               description: "Recently lost a spouse and is emotionally vulnerable." },
  { id: 13, name: "The Politician",   emoji: "🏙️", tags: ["Business", "High Society"],  selectable: true,  ability: "Whenever you 'make a deal' or bribe in an Event, gain +1 additional DP.",                                               description: "A public official who thrives on shady bargains." },
  { id: 14, name: "The Rebel",        emoji: "🏍️", tags: ["Working Class", "Criminal"],selectable: true,  ability: "Gain +1 DP when a mismatch places you in a fancy/high-society location.",                                             description: "A tough survivor from the wrong side of the tracks." },
  { id: 15, name: "The Gossip",       emoji: "🗣️", tags: ["Working Class"],               selectable: true,  ability: "If an Event reveals secrets or rumors, gain +2 DP. You live for the tea.",                                              description: "A nosy neighbor or coworker who spreads information." },
  { id: 16, name: "The Golden Child", emoji: "✨", tags: ["Family"],                    selectable: true,  ability: "Once per game, automatically negate a negative DP effect that targets you.",                                            description: "Favored offspring who everyone seems to adore." },
  { id: 17, name: "The Detective",    emoji: "🔍", tags: ["Law", "Criminal"],            selectable: true,  ability: "If an Event involves a crime or suspicion, gain +2 DP for investigating.",                                            description: "A jaded investigator who sees the worst in people." },
  { id: 18, name: "The Nun",          emoji: "⛪", tags: ["Spiritual"],                  selectable: true,  ability: "High Drama Events in your presence cost +1 DP to play.",                                                             description: "A pious figure with deeply hidden depths." },
  { id: 19, name: "The Artist",       emoji: "🎨", tags: ["Working Class", "Artistic"],  selectable: true,  ability: "Whenever you deliver a dramatic speech or monologue, gain +1 DP (max once per scene).",                               description: "A free spirit craving inspiration and attention." },
  { id: 20, name: "The Intern",       emoji: "📋", tags: ["Working Class", "Business"],  selectable: true,  ability: "If you assist a 'boss' character in an Event, gain +1 DP for your enthusiasm.",                                       description: "Young apprentice doing all the grunt work." },
  { id: 21, name: "The Millionaire",  emoji: "🎠", tags: ["High Society"],                selectable: true,  ability: "When placed in a low-class location, double any DP gained for mismatch.",                                            description: "Quirky but loaded, thrives on fish-out-of-water drama." },
  { id: 22, name: "The Nurse",        emoji: "💉", tags: ["Medical", "Working Class"],   selectable: true,  ability: "Gain +1 DP whenever you 'save' or heal another character in a Medium/High drama event.",                            description: "An underappreciated caretaker with a big heart." },
  { id: 23, name: "The Starlet",      emoji: "⭐", tags: ["Celebrity"],                    selectable: true,  ability: "If an Event references media, audition, or public appearance, gain +1 DP.",                                          description: "A dreamer hoping for her big break." },
  { id: 24, name: "The Rockstar",     emoji: "🎸", tags: ["Celebrity", "Working Class"], selectable: true,  ability: "Each time you cause a rowdy event or meltdown (Medium/High drama), gain +1 DP.",                                   description: "Rebellious musician who loves causing a scene." },
  { id: 25, name: "The Paparazzo",    emoji: "📰", tags: ["Celebrity", "Working Class"], selectable: true,  ability: "If you catch another character's secret on camera, they lose 1 DP and you gain +2 DP.",                              description: "An invasive tabloid photographer." },
  { id: 26, name: "The Counselor",    emoji: "💚", tags: ["Medical", "Family"],          selectable: true,  ability: "You may forego your +1 performance bonus to give +1 DP to another player once per scene.",                          description: "A therapist who tries to help — or manipulate." },
  { id: 27, name: "The Lawyer",       emoji: "⚖️", tags: ["Law", "Business"],           selectable: true,  ability: "Whenever you 'win' an argument or lawsuit event, gain +2 DP.",                                                     description: "Expert at legal battles and cunning strategies." },
  { id: 28, name: "The Ex-Con",       emoji: "⛓️", tags: ["Criminal"],                    selectable: true,  ability: "Gain +1 DP each time you sabotage a High Society character (max 2 times per game).",                                description: "Recently released from prison, harboring grudges." },
  // === 5 NEW SELECTABLE CHARACTERS ===
  { id: 29, name: "The Schemer",      emoji: "🧩", tags: ["Business", "Wild Card"],     selectable: true,  ability: "Once per game, you may secretly announce a target at the start of your turn. If you cause them to lose DP this turn, gain +2 DP.", description: "Always three steps ahead, always plotting." },
  { id: 30, name: "The Heartbreaker", emoji: "💔", tags: ["Romantic", "Celebrity"],      selectable: true,  ability: "Each time a romantic event you instigate causes another player to lose DP, gain +1 bonus DP.",                        description: "Charming, dangerous, and completely unavailable." },
  { id: 31, name: "The Patriarch",    emoji: "👨‍👤", tags: ["Family", "Business"],       selectable: true,  ability: "If you play a Power event in a Family location, gain +2 DP instead of normal bonus.",                                   description: "The iron-fisted head of the family. His word is law." },
  { id: 32, name: "The Socialite",    emoji: "🍸", tags: ["High Society"],                selectable: true,  ability: "If you flirt or seduce in an Event, gain +1 DP. If it leads to a fight or love triangle, gain +2 total.",             description: "Always partying, always stirring hearts and grudges." },
  { id: 33, name: "The Prodigal",     emoji: "🏠", tags: ["Family", "Wild Card"],        selectable: true,  ability: "The first time each game you return to a Family location after it has changed, gain +2 DP.",                          description: "Left home under a cloud. Now they're back, and nothing is the same." },
  // === SPECIAL / NON-SELECTABLE CHARACTERS ===
  // Evil Twin: not available at character creation — only revealed via 'Evil Twin Unmasked' event
  { id: 34, name: "The Evil Twin",    emoji: "👿", tags: ["Wild Card", "Criminal"],     selectable: false, ability: "Inherits all tags and abilities of the player's original character, but all DP penalties they cause are doubled.",       description: "An identical impostor who has been living your life. Their motives are far darker." },
];

// ============ LOCATION CARDS (25) ============
export const LOCATIONS = [
  { id: 1, name: "Glamorous Mansion", emoji: "🏰", tags: ["High Society"], effect: "+1 DP to any character who humiliates a wealthy resident here.", description: "A luxurious estate with chandeliers and dark family secrets." },
  { id: 2, name: "Trailer Park", emoji: "🏚️", tags: ["Working Class"], effect: "If a High Society character is here, apply double mismatch bonus.", description: "A rundown neighborhood on the wrong side of town." },
  { id: 3, name: "Hospital ER", emoji: "🏥", tags: ["Medical"], effect: "+1 DP to a Medical character who resolves an injury event here.", description: "Where life-and-death drama unfolds amid beeping machines." },
  { id: 4, name: "Corporate Boardroom", emoji: "🏢", tags: ["Business"], effect: "Business-based Events played here yield +1 DP to the instigator.", description: "High-stakes deals and betrayals go down here." },
  { id: 5, name: "Wedding Chapel", emoji: "💒", tags: ["Romantic"], effect: "Any Romantic Event here yields +1 DP. If called off, +2 DP instead.", description: "Where vows or objections may occur." },
  { id: 6, name: "Seedy Dive Bar", emoji: "🍺", tags: ["Working Class"], effect: "If a High Society or Celebrity character visits, gain +1 mismatch DP.", description: "A rundown bar perfect for confrontations." },
  { id: 7, name: "City Hall", emoji: "🏛️", tags: ["Business", "Law"], effect: "Political or legal Events here earn +1 DP for the instigator.", description: "Where political power and justice collide." },
  { id: 8, name: "Tropical Island Resort", emoji: "🏝️", tags: ["Wild Card"], effect: "High Drama Events cost -1 DP (vacation meltdown discount!).", description: "An exotic getaway for special episodes." },
  { id: 9, name: "Chic Penthouse", emoji: "🌃", tags: ["High Society"], effect: "If a Working Class or Criminal tag is here, +1 mismatch DP for them.", description: "A swanky downtown penthouse with stunning views." },
  { id: 10, name: "Police Station", emoji: "🚔", tags: ["Law"], effect: "Criminal or Detective characters gain +1 DP when they star in an event here.", description: "Interrogation rooms and holding cells." },
  { id: 11, name: "Family Farm", emoji: "🌾", tags: ["Working Class"], effect: "High Society mismatch triggers +1 DP. High-society events here +2 mismatch.", description: "Rolling fields and rustic charm." },
  { id: 12, name: "Fashion Studio", emoji: "👗", tags: ["Celebrity", "Artistic"], effect: "Any 'modeling,' 'photo shoot,' or 'performance' events gain +1 DP.", description: "Runway lights and haute couture." },
  { id: 13, name: "Small-Town Café", emoji: "☕", tags: ["Working Class"], effect: "If a High Drama event is played here, it yields +1 DP from shocked bystanders.", description: "A quiet place where drama hits differently." },
  { id: 14, name: "Casino Royale", emoji: "🎰", tags: ["High Society", "Business"], effect: "Any gambling or risk-based event gains +1 DP here.", description: "High rollers, higher stakes." },
  { id: 15, name: "Courtroom", emoji: "⚖️", tags: ["Law"], effect: "Legal showdowns yield +2 DP if a Lawyer or Politician is involved.", description: "Order in the court — or total chaos." },
  { id: 16, name: "Secret Love Nest", emoji: "🕯️", tags: ["Romantic"], effect: "Romantic or illicit affairs here yield +1 extra DP.", description: "A hidden rendezvous spot for forbidden love." },
  { id: 17, name: "Suburban House", emoji: "🏡", tags: ["Family"], effect: "Domestic spats (Medium Drama) grant +1 DP.", description: "White picket fences hiding family chaos." },
  { id: 18, name: "Luxury Yacht", emoji: "🛥️", tags: ["High Society"], effect: "Events referencing wealth or parties earn +1 DP. Working Class mismatch +1.", description: "Sailing into trouble on the high seas." },
  { id: 19, name: "Convent", emoji: "🙏", tags: ["Spiritual"], effect: "If a moralizing character is here, High Drama costs +1 DP to play.", description: "A place of peace, prayer, and hidden truths." },
  { id: 20, name: "Roadside Motel", emoji: "🛏️", tags: ["Working Class"], effect: "Secret rendezvous events yield +1 DP. High Society mismatch +1.", description: "Neon lights and questionable decisions." },
  { id: 21, name: "Nightclub", emoji: "🪩", tags: ["Celebrity", "Working Class"], effect: "Music/performance events gain +1 DP. Brawls gain +1 mismatch.", description: "Flashing lights, pounding music, bad decisions." },
  { id: 22, name: "Rodeo Arena", emoji: "🤠", tags: ["Working Class", "Wild Card"], effect: "High Society or Medical mismatch +1 DP. If injury occurs, +2.", description: "Dust, danger, and dramatic showdowns." },
  { id: 23, name: "Spa Retreat", emoji: "🧖", tags: ["High Society"], effect: "Low Drama events here grant +1 DP if it's a comedic meltdown.", description: "Relaxation meets meltdown." },
  { id: 24, name: "Airport Terminal", emoji: "✈️", tags: ["Wild Card"], effect: "If a character tries to flee or skip town, that event grants +2 DP.", description: "Departures, arrivals, and dramatic chases." },
  { id: 25, name: "Beachfront Boardwalk", emoji: "🏖️", tags: ["Romantic", "Wild Card"], effect: "Romantic confessions or comedic slip-ups yield +1 DP.", description: "Sun, surf, and sea-breeze drama." },
];

// ============ EVENT TYPES ============
// type: "Romance" | "Gossip" | "Confrontation" | "Mystery" | "Comedy" | "Power"
// locationTypeBonuses: array of location tags that grant +1 extra DP
// subActions: optional sub-actions triggered at specific location tags

export const EVENT_TYPE_COLORS = {
  Romance:      { bg: "bg-pink-500/20",   text: "text-pink-400",   border: "border-pink-500/30"   },
  Gossip:       { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  Confrontation:{ bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  Mystery:      { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
  Comedy:       { bg: "bg-teal-500/20",   text: "text-teal-400",   border: "border-teal-500/30"   },
  Power:        { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500/30"     },
};

export const ACTION_CATEGORY_COLORS = {
  Manipulation:  { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  Escalation:    { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/30' },
  Suppression:   { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  Insertion:     { bg: 'bg-teal-500/20',   text: 'text-teal-400',   border: 'border-teal-500/30' },
  Exposure:      { bg: 'bg-amber-500/20',  text: 'text-amber-400',  border: 'border-amber-500/30' },
  Protection:    { bg: 'bg-emerald-500/20',text: 'text-emerald-400',border: 'border-emerald-500/30' },
  Redirection:   { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Amplification: { bg: 'bg-pink-500/20',   text: 'text-pink-400',   border: 'border-pink-500/30' },
  Framing:       { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
};

// ============ EVENT CARDS (80) ============
const LOW_DRAMA_EVENTS = [
  {
    name: "Coffee Spill", emoji: "☕", type: "Comedy",
    effect: "Minor accident. +1 DP to instigator, +1 DP if it triggers a mild argument.",
    dpInstigator: 1, dpTarget: 1,
    locationTypeBonuses: ["Working Class", "Family"],
    subActions: [{ locationTag: "Corporate Boardroom", desc: "Spills on important documents — target loses 1 extra DP from embarrassment." }],
  },
  {
    name: "Clumsy Flirtation", emoji: "😘", type: "Romance",
    effect: "Attempt a romance with comedic results. +1 DP each to participants if they ham it up.",
    dpInstigator: 1, dpTarget: 1,
    locationTypeBonuses: ["Romantic"],
    subActions: [{ locationTag: "Romantic", desc: "Setting intensifies the moment — gain +1 extra DP each." }],
  },
  {
    name: "Petty Gossip", emoji: "🤫", type: "Gossip",
    effect: "Spread a small rumor. +1 DP instigator, +1 DP targeted character.",
    dpInstigator: 1, dpTarget: 1,
    locationTypeBonuses: ["Working Class", "Celebrity"],
    subActions: [{ locationTag: "Working Class", desc: "Whole neighborhood hears — gossip spreads to all players (+1 DP each)." }],
  },
  {
    name: "Awkward Silence", emoji: "😶", type: "Comedy",
    effect: "Forces a comedic pause. +1 DP to whoever breaks it with a dramatic line.",
    dpInstigator: 1, dpTarget: 0,
    locationTypeBonuses: ["Family", "Working Class"],
    subActions: [{ locationTag: "High Society", desc: "The silence is deafening at this fancy venue — +1 extra DP for breaking it." }],
  },
  {
    name: "Lost Keys", emoji: "🔑", type: "Comedy",
    effect: "A mild inconvenience. +2 DP to whoever 'finds' them and bails someone out.",
    dpInstigator: 2, dpTarget: 0,
    locationTypeBonuses: ["Working Class"],
    subActions: [{ locationTag: "Law", desc: "Keys are evidence — Confrontation sub-plot triggers, instigator gains +1 extra DP." }],
  },
  {
    name: "Spilled Secrets (Minor)", emoji: "🤭", type: "Gossip",
    effect: "Some partial info leaks. +1 DP instigator, +1 to a second character implicated.",
    dpInstigator: 1, dpTarget: 1,
    locationTypeBonuses: ["Celebrity", "Working Class"],
    subActions: [{ locationTag: "Business", desc: "Boardroom leak — instigator gains +1 extra as the info holds strategic value." }],
  },
  {
    name: "Mild Insult", emoji: "😤", type: "Confrontation",
    effect: "A small social faux pas. +1 DP each to instigator & target if they play it up.",
    dpInstigator: 1, dpTarget: 1,
    locationTypeBonuses: ["High Society"],
    subActions: [{ locationTag: "High Society", desc: "In polite company the insult cuts deep — both gain +1 extra DP." }],
  },
  {
    name: "Flashback Hint", emoji: "💭", type: "Mystery",
    effect: "One character glimpses a snippet of backstory. +1 DP if it teases a bigger secret.",
    dpInstigator: 1, dpTarget: 0,
    locationTypeBonuses: ["Wild Card"],
    subActions: [{ locationTag: "Medical", desc: "Triggered by a medical detail — amnesia characters gain +1 extra DP." }],
  },
  {
    name: "Tactless Joke", emoji: "😬", type: "Comedy",
    effect: "Offensive humor. +2 DP to instigator if the group reacts big.",
    dpInstigator: 2, dpTarget: 0,
    locationTypeBonuses: ["Family", "Working Class"],
    subActions: [{ locationTag: "Spiritual", desc: "Told in sacred surroundings — shock doubles, instigator gains +1 extra DP." }],
  },
  {
    name: "Little White Lie", emoji: "🤥", type: "Mystery",
    effect: "Innocent fib snowballs. +1 DP to the liar; if discovered same scene, lose 1 DP.",
    dpInstigator: 1, dpTarget: 0,
    locationTypeBonuses: ["Wild Card"],
    subActions: [{ locationTag: "Law", desc: "Lying in a legal setting — if discovered, target loses an additional 1 DP." }],
  },
];

const MEDIUM_DRAMA_EVENTS = [
  {
    name: "Secret Revealed", emoji: "🔓", type: "Mystery",
    effect: "A hidden fact emerges. +2 DP instigator, +1 DP target.",
    dpInstigator: 2, dpTarget: 1,
    locationTypeBonuses: ["Wild Card", "Family"],
    subActions: [{ locationTag: "Law", desc: "Revealed in court — instigator gains +1 extra DP and target faces legal consequences." }],
  },
  {
    name: "Love Triangle", emoji: "💔", type: "Romance",
    effect: "A new suitor enters an existing relationship. +2 DP each to the two who clash, +1 for the 'prize.'",
    dpInstigator: 2, dpTarget: 2,
    locationTypeBonuses: ["Romantic"],
    subActions: [{ locationTag: "Romantic", desc: "Romantic setting makes everyone emotional — all three gain +1 extra DP." }],
  },
  {
    name: "Blackmail", emoji: "📧", type: "Power",
    effect: "Instigator +2 DP; target can lose 1 DP or pay 1 DP to avoid the threat.",
    dpInstigator: 2, dpTarget: -1,
    locationTypeBonuses: ["Business", "High Society"],
    subActions: [{ locationTag: "Business", desc: "Corporate leverage — instigator may also steal 1 DP directly from target's score." }],
  },
  {
    name: "Lovers' Quarrel", emoji: "💢", type: "Romance",
    effect: "Two love interests argue. Each gains +2 DP if performed dramatically.",
    dpInstigator: 2, dpTarget: 2,
    locationTypeBonuses: ["Romantic", "Family"],
    subActions: [{ locationTag: "Family", desc: "Family witnesses the fight — all other players gain +1 DP from the spectacle." }],
  },
  {
    name: "Slander/Defamation", emoji: "📰", type: "Gossip",
    effect: "Attack someone's reputation. +2 DP instigator, target can do comeback next turn.",
    dpInstigator: 2, dpTarget: 0,
    locationTypeBonuses: ["Celebrity", "Working Class"],
    subActions: [{ locationTag: "Celebrity", desc: "Hits the tabloids — instigator gains +1 extra DP; target loses 1 DP from public image." }],
  },
  {
    name: "Dramatic Ultimatum", emoji: "⚡", type: "Confrontation",
    effect: "'Do this or else!' +2 DP instigator if threat stands, +1 to target if they defy it.",
    dpInstigator: 2, dpTarget: 1,
    locationTypeBonuses: ["Business", "Law"],
    subActions: [{ locationTag: "Law", desc: "Legal threat — instigator may force target to skip their next Draw Phase." }],
  },
  {
    name: "Sudden Confession", emoji: "😭", type: "Mystery",
    effect: "Reveal a personal truth. +2 DP to confessor, +1 DP if it triggers shock.",
    dpInstigator: 2, dpTarget: 1,
    locationTypeBonuses: ["Romantic", "Spiritual"],
    subActions: [{ locationTag: "Spiritual", desc: "Confession in a sacred place — confessor gains +1 extra DP for the solemnity." }],
  },
  {
    name: "Brawl / Catfight", emoji: "🤜", type: "Confrontation",
    effect: "Physical altercation. +2 DP each to participants, +1 mismatch if inappropriate location.",
    dpInstigator: 2, dpTarget: 2,
    locationTypeBonuses: ["Working Class", "Wild Card"],
    subActions: [{ locationTag: "High Society", desc: "Chaos at a fancy venue — both gain +1 extra DP from the scandalized witnesses." }],
  },
  {
    name: "Gossip Gone Wild", emoji: "📢", type: "Gossip",
    effect: "Rumors escalate. +2 DP instigator, -1 DP to a character whose secret was twisted.",
    dpInstigator: 2, dpTarget: -1,
    locationTypeBonuses: ["Celebrity", "Working Class"],
    subActions: [{ locationTag: "Celebrity", desc: "Goes viral — instigator gains +2 extra DP but must pick a second target to lose 1 DP." }],
  },
  {
    name: "Jealous Outburst", emoji: "😡", type: "Confrontation",
    effect: "A character rants about perceived betrayal. +2 DP to them, +1 DP to any accused.",
    dpInstigator: 2, dpTarget: 1,
    locationTypeBonuses: ["Romantic", "Family"],
    subActions: [{ locationTag: "Romantic", desc: "Passionate outburst in a romantic setting — instigator gains +1 extra DP." }],
  },
];

const HIGH_DRAMA_EVENTS = [
  {
    name: "Back from the Dead!", emoji: "⚰️", type: "Mystery",
    effect: "A presumed-dead character reappears. +3 DP instigator, +1 DP if it ruins someone's plan.",
    dpInstigator: 3, dpTarget: 1, cost: 1,
    locationTypeBonuses: ["Wild Card", "High Society"],
    subActions: [{ locationTag: "Family", desc: "Returns to the family home — all Family-tagged characters gain +1 DP from the shock." }],
  },
  {
    name: "Wedding Crash", emoji: "💥", type: "Confrontation",
    effect: "Interrupt a wedding or celebration. +3 DP instigator, +2 DP if it ends in chaos.",
    dpInstigator: 3, dpTarget: 2, cost: 0,
    locationTypeBonuses: ["Romantic"],
    subActions: [{ locationTag: "Romantic", desc: "Crashing IN the chapel — instigator gains +2 extra DP and may immediately play another card." }],
  },
  {
    name: "Evil Twin Unmasked", emoji: "🎭", type: "Mystery",
    effect: "The fake identity is exposed. +3 DP to the exposer, -2 DP if the twin flees.",
    dpInstigator: 3, dpTarget: -2, cost: 1,
    locationTypeBonuses: ["Wild Card"],
    subActions: [{ locationTag: "High Society", desc: "Unmasked at a gala — all watching players gain +1 DP from the spectacle." }],
  },
  {
    name: "Sudden Disaster", emoji: "🔥", type: "Power",
    effect: "Threatens everyone present. +3 DP to trigger; each rescuer gains +1 DP.",
    dpInstigator: 3, dpTarget: 1, cost: 0,
    locationTypeBonuses: ["Wild Card", "Working Class"],
    subActions: [{ locationTag: "Medical", desc: "Medical emergency — any Medical character who acts gains +2 DP instead of +1." }],
  },
  {
    name: "Amnesia Cured!", emoji: "🧠", type: "Mystery",
    effect: "Key character regains memories. +3 DP to them, +1 to any player impacted.",
    dpInstigator: 3, dpTarget: 1, cost: 0,
    locationTypeBonuses: ["Medical", "Wild Card"],
    subActions: [{ locationTag: "Medical", desc: "Cured in a hospital — the cure reveals damning evidence, target loses 1 extra DP." }],
  },
  {
    name: "Public Scandal", emoji: "📺", type: "Gossip",
    effect: "Big reveal in front of a crowd. +3 DP instigator, targeted character loses 1-2 DP.",
    dpInstigator: 3, dpTarget: -1, cost: 0,
    locationTypeBonuses: ["Celebrity", "Business"],
    subActions: [{ locationTag: "Celebrity", desc: "Live on air — target loses 2 DP instead of 1 and must skip their next Draw Phase." }],
  },
  {
    name: "Illegitimate Child", emoji: "👶", type: "Power",
    effect: "Shocking paternity reveal. +3 DP instigator, +2 if it topples a relationship.",
    dpInstigator: 3, dpTarget: 2, cost: 1,
    locationTypeBonuses: ["Family", "High Society"],
    subActions: [{ locationTag: "Family", desc: "Revealed in the family home — all Family-tagged characters gain +1 DP from the fallout." }],
  },
  {
    name: "Explosive Love Confession", emoji: "💘", type: "Romance",
    effect: "Grand romantic declaration. +3 DP to confessor, +1 mismatch if wildly out of place.",
    dpInstigator: 3, dpTarget: 1, cost: 0,
    locationTypeBonuses: ["Romantic"],
    subActions: [{ locationTag: "Romantic", desc: "The setting is perfect — target must respond (accept or reject) earning +1 DP either way." }],
  },
  {
    name: "Crime of Passion", emoji: "🗡️", type: "Confrontation",
    effect: "A major betrayal or assault. +3 DP instigator, targeted character +2 if they retaliate.",
    dpInstigator: 3, dpTarget: 2, cost: 0,
    locationTypeBonuses: ["Law", "Criminal"],
    subActions: [{ locationTag: "Law", desc: "Witnessed by authorities — instigator loses 1 DP but gains a 'Wanted' status worth +3 DP if survived to game end." }],
  },
  {
    name: "Season Finale Twist", emoji: "🌀", type: "Power",
    effect: "Overwrites a storyline with a bigger bombshell. +4 DP instigator, -1 DP to all others.",
    dpInstigator: 4, dpTarget: -1, cost: 2,
    locationTypeBonuses: ["Wild Card", "High Society"],
    subActions: [{ locationTag: "Wild Card", desc: "The twist feels pre-destined here — instigator may immediately draw 2 cards." }],
  },
];

const MORE_LOW_DRAMA_EVENTS = [
  { name: "Wrong Number", emoji: "📞", type: "Comedy", effect: "A misdial causes comic confusion. +1 DP to instigator if played for laughs.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Working Class", "Family"], subActions: [{ locationTag: "Business", desc: "The wrong number reaches a competitor — instigator gains +1 extra DP from the accidental intel." }] },
  { name: "Stolen Parking Spot", emoji: "🅿️", type: "Confrontation", effect: "Petty dispute over parking. +1 DP each if it escalates dramatically.", dpInstigator: 1, dpTarget: 1, locationTypeBonuses: ["Working Class"], subActions: [{ locationTag: "High Society", desc: "It's a valet spot — the affront is unforgivable. Both gain +1 extra DP." }] },
  { name: "Overheard Conversation", emoji: "👂", type: "Gossip", effect: "You catch a juicy snippet. +1 DP if it informs your next play.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Working Class", "Celebrity"], subActions: [{ locationTag: "Business", desc: "It's a corporate secret — instigator gains +1 extra DP and may name a target." }] },
  { name: "Embarrassing Photo", emoji: "📷", type: "Gossip", effect: "An old photo resurfaces. +1 DP instigator, +1 DP target from embarrassment.", dpInstigator: 1, dpTarget: 1, locationTypeBonuses: ["Celebrity", "High Society"], subActions: [{ locationTag: "Celebrity", desc: "It goes viral — target loses 1 extra DP from public mockery." }] },
  { name: "Wardrobe Malfunction", emoji: "👗", type: "Comedy", effect: "A clothing disaster mid-scene. +2 DP to instigator for sheer humiliation.", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["Celebrity", "High Society"], subActions: [{ locationTag: "High Society", desc: "At a formal event — all watching players gain +1 DP from the spectacle." }] },
  { name: "Accidental Compliment", emoji: "😊", type: "Romance", effect: "An unintended sweet remark sparks feelings. +1 DP each to both parties.", dpInstigator: 1, dpTarget: 1, locationTypeBonuses: ["Romantic"], subActions: [{ locationTag: "Romantic", desc: "In a romantic setting it lands perfectly — both gain +1 extra DP." }] },
  { name: "Mixed-Up Orders", emoji: "🍽️", type: "Comedy", effect: "Wrong meals delivered, chaos ensues. +1 DP to whoever milks it most.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Working Class"], subActions: [{ locationTag: "High Society", desc: "At a fancy restaurant — the waiter is mortified, instigator gains +1 extra DP." }] },
  { name: "Suspicious Text", emoji: "📱", type: "Mystery", effect: "A cryptic message is spotted. +1 DP if it sparks suspicion.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Wild Card"], subActions: [{ locationTag: "Family", desc: "Seen by a family member — another player may demand an explanation, gaining +1 DP." }] },
  { name: "Name Forgotten", emoji: "🙈", type: "Comedy", effect: "You forget someone's name at the worst moment. +1 DP for comic awkwardness.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Family", "Working Class"], subActions: [{ locationTag: "High Society", desc: "It's the host's name — social catastrophe. Instigator gains +1 extra DP." }] },
  { name: "Fender Bender", emoji: "🚗", type: "Confrontation", effect: "Minor car collision triggers overreaction. +1 DP each to both parties.", dpInstigator: 1, dpTarget: 1, locationTypeBonuses: ["Working Class", "Wild Card"], subActions: [{ locationTag: "Law", desc: "Police are called — instigator must choose: cooperate (−1 DP) or flee (+2 DP)." }] },
  { name: "Surprise Party Fail", emoji: "🎉", type: "Comedy", effect: "The 'surprise' is totally ruined. +1 DP to whoever caused it.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Family"], subActions: [{ locationTag: "High Society", desc: "Catered event ruined — instigator gains +1 extra DP, target loses 1 DP." }] },
  { name: "Snooping", emoji: "🕵️", type: "Mystery", effect: "Someone rifles through another's belongings. +1 DP if something is found.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Wild Card", "Family"], subActions: [{ locationTag: "Business", desc: "Corporate espionage — instigator gains +1 extra DP." }] },
  { name: "Borrowed and Not Returned", emoji: "📚", type: "Confrontation", effect: "A long-held grudge over a borrowed item explodes. +1 DP each.", dpInstigator: 1, dpTarget: 1, locationTypeBonuses: ["Family", "Working Class"], subActions: [{ locationTag: "Family", desc: "It's an heirloom — both gain +1 extra DP." }] },
  { name: "Fake Sick Day", emoji: "🤒", type: "Comedy", effect: "Someone plays hooky and gets caught living it up. +2 DP to instigator.", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["Working Class", "Business"], subActions: [{ locationTag: "Business", desc: "The boss sees you — instigator loses 1 DP but gains sympathy of all other players (+1 DP each)." }] },
  { name: "Wrong Restroom", emoji: "🚻", type: "Comedy", effect: "An awkward mix-up. +1 DP for sheer embarrassment.", dpInstigator: 1, dpTarget: 0, locationTypeBonuses: ["Wild Card", "High Society"], subActions: [{ locationTag: "High Society", desc: "At a gala — instigator gains +1 extra DP." }] },
];

const MORE_MEDIUM_DRAMA_EVENTS = [
  { name: "The Intervention", emoji: "🫂", type: "Power", effect: "Group confronts a character about their behavior. +2 DP instigator.", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["Family"], subActions: [{ locationTag: "Family", desc: "In the family home — all players gain +1 DP for their roles." }] },
  { name: "Fake Pregnancy Scare", emoji: "🤰", type: "Mystery", effect: "Shocking announcement that unravels. +2 DP instigator, +1 if it ruins someone's plan.", dpInstigator: 2, dpTarget: 1, locationTypeBonuses: ["Family", "Romantic"], subActions: [{ locationTag: "High Society", desc: "Announced at a dinner party — instigator gains +1 extra DP." }] },
  { name: "Forbidden Kiss", emoji: "💋", type: "Romance", effect: "An unexpected public kiss. +2 DP to both involved.", dpInstigator: 2, dpTarget: 2, locationTypeBonuses: ["Romantic"], subActions: [{ locationTag: "Family", desc: "In front of family — every other player gains +1 DP." }] },
  { name: "Power Play", emoji: "♟️", type: "Power", effect: "A calculated move to undermine a rival. +2 DP instigator, target loses 1 DP.", dpInstigator: 2, dpTarget: -1, locationTypeBonuses: ["Business", "Law"], subActions: [{ locationTag: "Business", desc: "In the boardroom — instigator gains +1 extra DP." }] },
  { name: "Runaway Moment", emoji: "🏃", type: "Comedy", effect: "A character flees a social disaster. +2 DP for the dramatic exit.", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["Wild Card", "Romantic"], subActions: [{ locationTag: "Romantic", desc: "Fleeing a date — instigator gains +1 extra DP." }] },
  { name: "Caught Red-Handed", emoji: "🫵", type: "Mystery", effect: "Instigator exposes someone's dirty secret in the act. +2 DP instigator, -1 DP target.", dpInstigator: 2, dpTarget: -1, locationTypeBonuses: ["Wild Card", "Law"], subActions: [{ locationTag: "Business", desc: "During a shady deal — target loses 1 extra DP." }] },
  { name: "Social Media Blowup", emoji: "📲", type: "Gossip", effect: "A post spirals out of control. +2 DP instigator, named target loses 1 DP.", dpInstigator: 2, dpTarget: -1, locationTypeBonuses: ["Celebrity", "Working Class"], subActions: [{ locationTag: "Celebrity", desc: "Goes truly viral — instigator gains +1 extra DP." }] },
  { name: "Secret Alliance", emoji: "🤝", type: "Power", effect: "Two players team up in secret against another. Both gain +1 DP, target loses 1 DP.", dpInstigator: 1, dpTarget: -1, locationTypeBonuses: ["Business", "High Society"], subActions: [{ locationTag: "Law", desc: "Sealed legally — the alliance cannot be broken this turn." }] },
  { name: "Dramatic Monologue", emoji: "🎤", type: "Comedy", effect: "A character delivers an over-the-top speech. +2 DP if the group applauds (or groans).", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["Celebrity", "Wild Card"], subActions: [{ locationTag: "High Society", desc: "At a formal dinner — instigator gains +1 extra DP for the audacity." }] },
  { name: "Staged Faint", emoji: "😵", type: "Comedy", effect: "A character dramatically collapses for attention. +2 DP instigator.", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["High Society", "Family"], subActions: [{ locationTag: "Medical", desc: "At a hospital — a doctor sees through it immediately, instigator loses 1 DP but gains +2 sympathy DP from others." }] },
  { name: "Inheritance Challenge", emoji: "📜", type: "Power", effect: "Someone contests a will. +2 DP to challenger, target family member loses 1 DP.", dpInstigator: 2, dpTarget: -1, locationTypeBonuses: ["Business", "Law"], subActions: [{ locationTag: "Law", desc: "In a courtroom — instigator gains +1 extra DP." }] },
  { name: "Mistaken Identity", emoji: "🕶️", type: "Mystery", effect: "Someone is confused for another person. +2 DP to whoever benefits from the confusion.", dpInstigator: 2, dpTarget: 1, locationTypeBonuses: ["Wild Card"], subActions: [{ locationTag: "High Society", desc: "At a masquerade — instigator may reassign 1 DP from any player to themselves." }] },
  { name: "Scandalous Letter", emoji: "✉️", type: "Gossip", effect: "A private letter is read aloud. +2 DP instigator, target loses 1 DP.", dpInstigator: 2, dpTarget: -1, locationTypeBonuses: ["High Society", "Family"], subActions: [{ locationTag: "Romantic", desc: "It's a love letter — instigator gains +1 extra DP." }] },
  { name: "Near-Death Experience", emoji: "💀", type: "Mystery", effect: "A character narrowly survives something. +2 DP for their dramatic return.", dpInstigator: 2, dpTarget: 0, locationTypeBonuses: ["Wild Card", "Medical"], subActions: [{ locationTag: "Medical", desc: "In the ER — any Medical character present gains +1 DP." }] },
  { name: "Hostile Takeover", emoji: "🏦", type: "Power", effect: "A business power grab. +2 DP instigator, another player with Business tag loses 1 DP.", dpInstigator: 2, dpTarget: -1, locationTypeBonuses: ["Business"], subActions: [{ locationTag: "Business", desc: "In the boardroom — instigator gains +1 extra DP." }] },
];

const MORE_HIGH_DRAMA_EVENTS = [
  { name: "Faked Death Revealed", emoji: "👻", type: "Mystery", effect: "Someone who 'died' walks in. +3 DP to the living ghost, -1 DP to anyone who profited from their death.", dpInstigator: 3, dpTarget: -1, cost: 1, locationTypeBonuses: ["Wild Card", "Family"], subActions: [{ locationTag: "Family", desc: "Returns to the family home — all other players lose 1 DP from the shock." }] },
  { name: "Secret Child Revealed", emoji: "🍼", type: "Power", effect: "A hidden child emerges and claims their birthright. +3 DP instigator, targeted parent loses 2 DP.", dpInstigator: 3, dpTarget: -2, cost: 1, locationTypeBonuses: ["Family", "High Society"], subActions: [{ locationTag: "High Society", desc: "At a family gala — all watching players gain +1 DP." }] },
  { name: "Courtroom Breakdown", emoji: "⚖️", type: "Confrontation", effect: "A witness snaps on the stand. +3 DP for the breakdown, +2 DP to the lawyer who caused it.", dpInstigator: 3, dpTarget: 2, cost: 0, locationTypeBonuses: ["Law"], subActions: [{ locationTag: "Law", desc: "In an actual courtroom — instigator gains +1 extra DP." }] },
  { name: "Kidnapping Plot", emoji: "🔐", type: "Power", effect: "A character is taken hostage. +3 DP to mastermind, +2 DP to any hero who intervenes.", dpInstigator: 3, dpTarget: 2, cost: 1, locationTypeBonuses: ["Wild Card", "Criminal"], subActions: [{ locationTag: "Law", desc: "Police get involved — mastermind loses 2 DP but gains dramatic notoriety (+3 if game survives)." }] },
  { name: "Exposé Published", emoji: "🗞️", type: "Gossip", effect: "A devastating article goes public. +3 DP instigator, target loses 2 DP and skips next draw.", dpInstigator: 3, dpTarget: -2, cost: 0, locationTypeBonuses: ["Celebrity", "Business"], subActions: [{ locationTag: "Celebrity", desc: "Front page news — instigator gains +1 extra DP." }] },
  { name: "Forbidden Romance Exposed", emoji: "🌹", type: "Romance", effect: "A secret love affair goes public. +3 DP to both lovers, -1 DP to any betrayed parties.", dpInstigator: 3, dpTarget: -1, cost: 0, locationTypeBonuses: ["Romantic", "High Society"], subActions: [{ locationTag: "Family", desc: "Family finds out — both lovers gain +1 extra DP from the chaos." }] },
  { name: "Corporate Espionage", emoji: "🕴️", type: "Power", effect: "Stolen trade secrets change everything. +3 DP instigator, targeted company loses 2 DP.", dpInstigator: 3, dpTarget: -2, cost: 1, locationTypeBonuses: ["Business"], subActions: [{ locationTag: "Business", desc: "In the boardroom — instigator gains +1 extra DP." }] },
  { name: "The Double Cross", emoji: "🐍", type: "Confrontation", effect: "An ally betrays their partner at the worst moment. +3 DP to the betrayer, betrayed loses 2 DP.", dpInstigator: 3, dpTarget: -2, cost: 0, locationTypeBonuses: ["Wild Card", "Business"], subActions: [{ locationTag: "High Society", desc: "Witnessed in public — all other players gain +1 DP from the spectacle." }] },
  { name: "Grand Reconciliation", emoji: "🕊️", type: "Romance", effect: "Two bitter rivals or ex-lovers reunite dramatically. +3 DP each, all other players gain +1 DP.", dpInstigator: 3, dpTarget: 3, cost: 0, locationTypeBonuses: ["Romantic", "Family"], subActions: [{ locationTag: "Romantic", desc: "In the perfect setting — both gain +1 extra DP." }] },
  { name: "Revolution", emoji: "✊", type: "Power", effect: "The underdog rises up against the powerful. +4 DP to the rebel, the top-scoring player loses 2 DP.", dpInstigator: 4, dpTarget: -2, cost: 1, locationTypeBonuses: ["Working Class", "Law"], subActions: [{ locationTag: "Business", desc: "Corporate overthrow — instigator gains +1 extra DP." }] },
];

// ============ COUNTER CARDS (reclassified as Reactive Actions) ============
export const COUNTER_CARDS = [
  { id: "c1",  name: "Not So Fast!",        emoji: "🚫", cardClass: "action", actionCategory: "Suppression", timing: "reactive", target: "event", counterType: "negate",    effect: "Reduce a chain's intensity by 1 OR cancel an event entirely before it resolves.",                      description: "Bend drama instead of erasing it." },
  { id: "c2",  name: "Plot Twist!",          emoji: "🌀", cardClass: "action", actionCategory: "Manipulation", timing: "reactive", target: "event", counterType: "negate",    effect: "Cancel an event targeting you. The instigator loses 1 DP for the backfire.",                           description: "Negate an event and embarrass the instigator." },
  { id: "c3",  name: "Oh No You Don't",      emoji: "🖐️", cardClass: "action", actionCategory: "Suppression", timing: "reactive", target: "event", counterType: "negate",    effect: "Cancel any High Drama event. The instigator must discard one more card.",                              description: "Shut down a big play before it lands." },
  { id: "c4",  name: "Redirect!",             emoji: "↩️", cardClass: "action", actionCategory: "Redirection", timing: "reactive", target: "event", counterType: "redirect",  effect: "Redirect a targeted event to a different player of your choice.",                                     description: "Point the drama at someone else instead." },
  { id: "c5",  name: "Wrong Address",         emoji: "📬", cardClass: "action", actionCategory: "Redirection", timing: "reactive", target: "event", counterType: "redirect",  effect: "Redirect a Gossip or Mystery event — the rumor reaches a different target.",                          description: "The rumor mill points the wrong way." },
  { id: "c6",  name: "Backfire!",             emoji: "💥", cardClass: "action", actionCategory: "Manipulation", timing: "reactive", target: "event", counterType: "reflect",   effect: "Reflect an event back on the instigator. They receive all DP effects they intended for you.",          description: "Turn an attack right back at the attacker." },
  { id: "c7",  name: "Mirror Mirror",         emoji: "🪞", cardClass: "action", actionCategory: "Manipulation", timing: "reactive", target: "event", counterType: "reflect",   effect: "Reflect a Romance or Gossip event. Instigator takes the negative DP, you take the positive.",         description: "What goes around comes right back around." },
  { id: "c8",  name: "Karma's a Witch",       emoji: "🔮", cardClass: "action", actionCategory: "Manipulation", timing: "reactive", target: "event", counterType: "reflect",   effect: "Reflect any Confrontation event. The instigator receives double the target DP penalty.",              description: "Sweet, sweet karmic justice." },
  { id: "c9",  name: "I Know Your Secret!",   emoji: "🤫", cardClass: "action", actionCategory: "Exposure",    timing: "both",     target: "player", counterType: "expose",   effect: "Force a target player to reveal one of their Secret cards. They immediately lose the penalty DP.",  description: "Expose someone's dark secret at the worst moment." },
  { id: "c10", name: "Immunity Idol",         emoji: "🛡️", cardClass: "action", actionCategory: "Protection",  timing: "both",     target: "self",   counterType: "negate",   effect: "Play before your turn begins. You are immune to all event effects this round.",                      description: "Absolute protection for one full round." },
];

// ============ SECRET REVEAL EVENT CARDS ============
// secretReveal: 'low' | 'medium' | 'high' — triggers special dialog flow
const SECRET_REVEAL_EVENTS = [
  {
    name: "Whisper Campaign", emoji: "🤫", type: "Gossip", level: "low", levelLabel: "Low Drama",
    secretReveal: "low",
    effect: "Play on a target. They choose which of their secrets to reveal — at least they control the damage.",
    dpInstigator: 1, dpTarget: 0, cost: 0,
    locationTypeBonuses: ["Working Class", "Celebrity"],
    subActions: [],
  },
  {
    name: "Dig for Dirt", emoji: "🔎", type: "Mystery", level: "medium", levelLabel: "Medium Drama",
    secretReveal: "medium",
    effect: "Target picks 2 of their secrets to put on the table — then YOU choose which one gets exposed.",
    dpInstigator: 2, dpTarget: 0, cost: 0,
    locationTypeBonuses: ["Business", "Law"],
    subActions: [],
  },
  {
    name: "Total Exposure", emoji: "📡", type: "Power", level: "high", levelLabel: "High Drama",
    secretReveal: "high",
    effect: "You randomly expose any one of the target's unrevealed secrets. They have no say.",
    dpInstigator: 3, dpTarget: 0, cost: 1,
    locationTypeBonuses: ["Celebrity", "High Society"],
    subActions: [],
  },
];

// ============ ACTION CARDS ============
export const ACTION_CARDS = [
  { id: 'a1',  name: "Pour Gasoline",        emoji: "🪣", cardClass: "action", actionCategory: "Escalation",    timing: "proactive", target: "chain",        actionEffect: "pour_gasoline",      effect: "Target an active chain. +1 intensity. If already level 2, immediately triggers climax." },
  { id: 'a2',  name: "Change the Narrative", emoji: "🔄", cardClass: "action", actionCategory: "Framing",        timing: "proactive", target: "chain",        actionEffect: "change_narrative",   effect: "Swap who is considered instigator and victim in a chain. Changes who gains DP at resolution." },
  { id: 'a3',  name: "Drag Them Into It",    emoji: "🕸️", cardClass: "action", actionCategory: "Insertion",      timing: "proactive", target: "chain_player", actionEffect: "drag_them_in",       effect: "Add another player to an active chain. Apply Entangled state to them." },
  { id: 'a4',  name: "Deny Everything",      emoji: "🙅", cardClass: "action", actionCategory: "Suppression",    timing: "proactive", target: "self",         actionEffect: "deny_everything",    effect: "Remove Exposed, Humiliated, or Disgraced state from yourself. Gain Suspected instead." },
  { id: 'a5',  name: "Leak to the Press",    emoji: "📡", cardClass: "action", actionCategory: "Exposure",       timing: "proactive", target: "chain",        actionEffect: "leak_to_press",      effect: "Escalate a chain AND expose one secret of a random player involved in it." },
  { id: 'a6',  name: "Flip the Script",      emoji: "🎬", cardClass: "action", actionCategory: "Framing",        timing: "proactive", target: "chain",        actionEffect: "flip_the_script",    effect: "At this chain's climax, you decide who gains the instigator DP. Creates lobbying and threats." },
  { id: 'a7',  name: "Everyone's Watching",  emoji: "👁️", cardClass: "action", actionCategory: "Amplification",  timing: "proactive", target: "chain",        actionEffect: "everyone_watching",  effect: "Mark a chain: all DP gains and losses from its resolution are doubled." },
  { id: 'a8',  name: "Behind Closed Doors",  emoji: "🚪", cardClass: "action", actionCategory: "Suppression",    timing: "proactive", target: "chain",        actionEffect: "behind_closed_doors",effect: "Pause a chain for 1 turn — it cannot be escalated. When it resumes it gains +1 intensity." },
  { id: 'a9',  name: "You're Involved Now",  emoji: "🫵", cardClass: "action", actionCategory: "Insertion",      timing: "proactive", target: "chain_player", actionEffect: "youre_involved_now", effect: "Forcibly add any player to an active chain. They gain Entangled and cannot avoid escalation." },
  { id: 'a10', name: "Twist the Knife",      emoji: "🗡️", cardClass: "action", actionCategory: "Escalation",    timing: "proactive", target: "player",       actionEffect: "twist_the_knife",    effect: "If your target has any negative state (Exposed, Humiliated, etc.), escalate all their active chains twice." },
  { id: 'a11', name: "Play the Victim",      emoji: "😢", cardClass: "action", actionCategory: "Redirection",    timing: "proactive", target: "self",         actionEffect: "play_the_victim",    effect: "Gain Protected state — the next DP penalty targeting you is reduced by 1." },
  { id: 'a12', name: "Blow It Wide Open",    emoji: "💣", cardClass: "action", actionCategory: "Exposure",       timing: "proactive", target: "chain",        actionEffect: "blow_it_wide_open",  effect: "Reveal ALL unrevealed secrets of every player involved in the target chain. Nuclear option." },
];

// Build event deck with copies
let eventId = 1;
export const EVENTS = [];

// Low Drama: 2 copies each
[...LOW_DRAMA_EVENTS, ...MORE_LOW_DRAMA_EVENTS].forEach(e => {
  for (let i = 0; i < 2; i++) {
    EVENTS.push({ ...e, id: eventId++, level: "low", levelLabel: "Low Drama" });
  }
});

// Medium Drama: 3 copies each
[...MEDIUM_DRAMA_EVENTS, ...MORE_MEDIUM_DRAMA_EVENTS].forEach(e => {
  for (let i = 0; i < 3; i++) {
    EVENTS.push({ ...e, id: eventId++, level: "medium", levelLabel: "Medium Drama" });
  }
});

// High Drama: 3 copies each
[...HIGH_DRAMA_EVENTS, ...MORE_HIGH_DRAMA_EVENTS].forEach(e => {
  for (let i = 0; i < 3; i++) {
    EVENTS.push({ ...e, id: eventId++, level: "high", levelLabel: "High Drama", cost: e.cost || 0 });
  }
});

// Secret Reveal Events: 2 copies of low, 3 of medium, 3 of high
SECRET_REVEAL_EVENTS.forEach(e => {
  const copies = e.level === 'low' ? 2 : 3;
  for (let i = 0; i < copies; i++) {
    EVENTS.push({ ...e, id: eventId++ });
  }
});

// Add 2 copies of each action card (former counters) into the deck
COUNTER_CARDS.forEach(c => {
  for (let i = 0; i < 2; i++) {
    EVENTS.push({ ...c, id: eventId++, level: "action", levelLabel: "Action" });
  }
});

// Add 2 copies of each new action card
ACTION_CARDS.forEach(a => {
  for (let i = 0; i < 2; i++) {
    EVENTS.push({ ...a, id: eventId++, level: "action", levelLabel: "Action" });
  }
});

// ============ SECRET CARDS (20) ============
export const SECRETS = [
  { id: 1, name: "Hidden Affair", emoji: "💏", description: "You are secretly in a forbidden relationship.", penalty: 3, goal: "Have the affair publicly declared or defended in a romantic event.", goalReward: 4 },
  { id: 2, name: "Embezzlement", emoji: "💸", description: "You've been skimming money from the company.", penalty: 4, goal: "Get away with it — survive to game end without being exposed.", goalReward: 5 },
  { id: 3, name: "Fake Identity", emoji: "🎭", description: "Your real name and past are a complete fiction.", penalty: 3, goal: "Convince another player to vouch for your 'true' identity in a scene.", goalReward: 4 },
  { id: 4, name: "Hidden Addiction", emoji: "🍷", description: "You're battling a secret addiction that controls you.", penalty: 2, goal: "Successfully 'recover' by having another character support or save you in an event.", goalReward: 3 },
  { id: 5, name: "Murder Cover-Up", emoji: "🔪", description: "You were involved in covering up a death.", penalty: 5, goal: "Frame another character for the crime in a Mystery or Power event.", goalReward: 6 },
  { id: 6, name: "Spy for the Enemy", emoji: "🕵️", description: "You're feeding information to a rival faction.", penalty: 4, goal: "Successfully redirect or negate an event using 'inside information' (play a Counter card).", goalReward: 5 },
  { id: 7, name: "Blackmail Victim", emoji: "📧", description: "Someone has leverage over you and you've been paying them.", penalty: 3, goal: "Turn the tables — play a Blackmail or Power event targeting your blackmailer.", goalReward: 4 },
  { id: 8, name: "Stolen Inheritance", emoji: "📜", description: "The wealth you claim was stolen from its rightful owner.", penalty: 4, goal: "Win or survive an Inheritance or legal event without losing DP.", goalReward: 5 },
  { id: 9, name: "Paternity Secret", emoji: "👶", description: "A child believed to be someone else's is actually yours.", penalty: 4, goal: "Publicly claim the child or relationship in a Family or High Drama event.", goalReward: 5 },
  { id: 10, name: "Criminal Record", emoji: "⛓️", description: "Your squeaky-clean image hides a criminal past.", penalty: 3, goal: "Avoid all Law-tagged location effects for the entire game.", goalReward: 4 },
  { id: 11, name: "Staged Accident", emoji: "🚗", description: "An 'accident' you caused was entirely intentional.", penalty: 4, goal: "Collect insurance or sympathy DP by being 'saved' in a Medical or Mystery event.", goalReward: 5 },
  { id: 12, name: "Fake Credentials", emoji: "🎓", description: "Your degrees, licenses, and titles are all forged.", penalty: 3, goal: "Successfully bluff your expertise — assist in a Medical, Law, or Business event without being questioned.", goalReward: 4 },
  { id: 13, name: "Double Life", emoji: "🎪", description: "You have an entire second life no one knows about.", penalty: 4, goal: "Play events from two different type categories (e.g. Romance and Power) in the same game.", goalReward: 4 },
  { id: 14, name: "Sabotaged Rival", emoji: "😈", description: "Your success came at the direct expense of someone you betrayed.", penalty: 3, goal: "Make that rival lose DP again in any event this game.", goalReward: 4 },
  { id: 15, name: "Forged Document", emoji: "📄", description: "A key document in your possession is completely fabricated.", penalty: 3, goal: "Use the document to win a legal, business, or inheritance event.", goalReward: 4 },
  { id: 16, name: "Hidden Child Abroad", emoji: "✈️", description: "You have a child living abroad that no one knows about.", penalty: 4, goal: "Reveal the child dramatically in a Family or High Drama event for maximum effect.", goalReward: 5 },
  { id: 17, name: "Insurance Fraud", emoji: "🏥", description: "You faked an illness or accident for a major payout.", penalty: 3, goal: "Profit from a Medical event by gaining DP while supposedly 'recovering'.", goalReward: 4 },
  { id: 18, name: "Witness to a Crime", emoji: "👁️", description: "You saw something terrible and said nothing.", penalty: 3, goal: "Break your silence — reveal what you saw in a Confrontation or Mystery event.", goalReward: 4 },
  { id: 19, name: "Stolen Idea", emoji: "💡", description: "Your greatest achievement was stolen from someone else.", penalty: 2, goal: "Defend your 'original idea' and win a Power or Business event against the true creator.", goalReward: 3 },
  { id: 20, name: "Secret Gambling Debt", emoji: "🎰", description: "You owe a very dangerous person a very large sum.", penalty: 3, goal: "Win enough DP from events to 'pay off' the debt — reach the target DP before any other player.", goalReward: 4 },
];

// ============ ASPIRATION CARDS (15) ============
export const ASPIRATIONS = [
  { id: 1,  name: "Heart of the Drama",   emoji: "💘", condition: "Gain 6+ DP total from Romance-type events.",                                             reward: 5, description: "Your heart bleeds, and the crowd loves it." },
  { id: 2,  name: "Pot Stirrer",           emoji: "🤔", condition: "Play 3 or more Gossip-type events across the game.",                                      reward: 4, description: "You keep the rumor mill spinning." },
  { id: 3,  name: "Scene Stealer",         emoji: "🎤", condition: "Be the instigator of 3 or more High Drama events.",                                       reward: 5, description: "If there's a spotlight, you're in it." },
  { id: 4,  name: "Location Loyalist",     emoji: "📍", condition: "Play 3 events at the same location without it changing.",                                 reward: 4, description: "You own this place — everyone knows it." },
  { id: 5,  name: "Chain Reaction",        emoji: "🔗", condition: "Participate in a chain of 3+ events of the same type in a row.",                          reward: 4, description: "You know how to keep the energy escalating." },
  { id: 6,  name: "Counter Puncher",       emoji: "🥊", condition: "Successfully play 2 counter cards in one game.",                                          reward: 4, description: "You wait for the perfect moment, then strike." },
  { id: 7,  name: "Mismatch Maven",        emoji: "🎪", condition: "Earn 3 or more mismatch bonus DP across the game.",                                       reward: 4, description: "Wildly out of place — and you completely owned it." },
  { id: 8,  name: "Pile-On King",          emoji: "🔥", condition: "Jump into another player's chain as a pile-on at least twice.",                           reward: 4, description: "You smell drama from across the room." },
  { id: 9,  name: "Secret Keeper",         emoji: "🤐", condition: "Reach game end with all your secrets unrevealed.",                                        reward: 5, description: "No one found out. No one ever will." },
  { id: 10, name: "Romantic Lead",         emoji: "🌹", condition: "Gain DP from a Romance event played at a Romantic-tagged location.",                      reward: 4, description: "The perfect setting. The perfect moment. All yours." },
  { id: 11, name: "Confrontation Queen",   emoji: "👊", condition: "Instigate 2 Confrontation events and gain DP from both.",                                 reward: 4, description: "You never back down from a fight." },
  { id: 12, name: "Mystery Merchant",      emoji: "🔍", condition: "Gain DP from 2 Mystery events targeting other players.",                                  reward: 4, description: "You dig for the truth — and profit handsomely." },
  { id: 13, name: "Power Trip",            emoji: "⚡", condition: "Gain 8+ DP total from Power-type events.",                                               reward: 5, description: "Every situation bends to your will." },
  { id: 14, name: "Drama Magnet",          emoji: "🌀", condition: "Have 3 or more events played targeting you across the game.",                             reward: 4, description: "You don't start the drama — it finds you." },
  { id: 15, name: "The Final Twist",       emoji: "💥", condition: "Play a High Drama event when the leading player has 5 or fewer DP left to win.",          reward: 5, description: "You made sure the finale was YOUR moment." },
];

// ============ UTILITY FUNCTIONS ============
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function checkMismatch(character, location) {
  if (!character?.tags || !location?.tags) return false;
  const charTags = character.tags;
  const locTags = location.tags;
  if (locTags.includes("Wild Card")) return false;
  const hasOverlap = charTags.some(t => locTags.includes(t));
  return !hasOverlap;
}

export function getDramaLevelColor(level) {
  switch(level) {
    case 'low': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'medium': return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'high': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    default: return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
  }
}

/**
 * Returns the chain escalation bonus DP for playing N consecutive events of the same type at a location.
 * chain=1 → 0 (first event, no chain yet)
 * chain=2 → +1
 * chain=3 → +2
 * chain=4+ → +3 (max escalation)
 */
export function getChainBonus(chainCount) {
  if (chainCount <= 1) return 0;
  if (chainCount === 2) return 1;
  if (chainCount === 3) return 2;
  return 3;
}

/**
 * Returns the location type bonus for an event played at a location.
 * Checks if the location's tags overlap with the event's locationTypeBonuses.
 */
export function getLocationTypeBonus(event, location) {
  if (!event?.locationTypeBonuses || !location?.tags) return 0;
  const matches = event.locationTypeBonuses.some(tag => location.tags.includes(tag));
  return matches ? 1 : 0;
}

/**
 * Returns the matching sub-action for an event at a location (if any).
 */
export function getSubAction(event, location) {
  if (!event?.subActions || !location?.name) return null;
  return event.subActions.find(sa =>
    location.tags?.includes(sa.locationTag) || location.name === sa.locationTag
  ) || null;
}

// ============ DRAMA CHAIN TEMPLATES ============
// Maps card names → persistent storyline blueprints
export const CHAIN_TEMPLATES = {
  "Love Triangle":             { title: "Love Triangle",           emoji: "💔", tags: ["Romance"],              touchTags: ["Romance","Confrontation","Gossip"],    climaxType: "vote",       climaxPrompt: "Who does the heart truly choose?",              followUp: "Public Scandal" },
  "Secret Revealed":           { title: "Exposed Secret",          emoji: "🔓", tags: ["Mystery","Gossip"],    touchTags: ["Mystery","Gossip","Confrontation"],    climaxType: "resolution", climaxPrompt: null,                                             followUp: null },
  "Blackmail":                 { title: "Blackmail Leverage",      emoji: "📧", tags: ["Power","Business"],   touchTags: ["Power","Business","Mystery"],          climaxType: "vote",       climaxPrompt: "Who holds the real power here?",                followUp: "Public Ruin" },
  "Forbidden Kiss":            { title: "Forbidden Affair",        emoji: "💋", tags: ["Romance"],              touchTags: ["Romance","Confrontation","Gossip"],    climaxType: "vote",       climaxPrompt: "Does the table approve or condemn this?",       followUp: "Forbidden Romance Exposed" },
  "Sudden Confession":         { title: "Public Confession",       emoji: "😭", tags: ["Romance","Mystery"],  touchTags: ["Romance","Mystery","Gossip"],          climaxType: "vote",       climaxPrompt: "Was the confession sincere or calculated?",     followUp: null },
  "Mistaken Identity":         { title: "Identity Crisis",         emoji: "🕶️", tags: ["Mystery"],             touchTags: ["Mystery","Confrontation","Power"],     climaxType: "vote",       climaxPrompt: "Who does the table believe is the real person?",followUp: null },
  "Scandalous Letter":         { title: "Scandalous Letter",       emoji: "✉️", tags: ["Gossip","Power"],     touchTags: ["Gossip","Romance","Power"],            climaxType: "resolution", climaxPrompt: null,                                             followUp: "Public Scandal" },
  "Caught Red-Handed":         { title: "Caught In The Act",       emoji: "🫵", tags: ["Mystery","Gossip"],   touchTags: ["Mystery","Gossip","Confrontation"],    climaxType: "resolution", climaxPrompt: null,                                             followUp: null },
  "Hostile Takeover":          { title: "Corporate War",           emoji: "🏦", tags: ["Power","Business"],   touchTags: ["Power","Business","Confrontation"],    climaxType: "vote",       climaxPrompt: "Who controls the company now?",                 followUp: null },
  "Power Play":                { title: "Power Struggle",          emoji: "♟️", tags: ["Power"],               touchTags: ["Power","Business","Confrontation"],    climaxType: "resolution", climaxPrompt: null,                                             followUp: null },
  "Faked Death Revealed":      { title: "Return From The Dead",    emoji: "👻", tags: ["Mystery"],             touchTags: ["Mystery","Romance","Family"],          climaxType: "vote",       climaxPrompt: "Who was truly wronged by this deception?",      followUp: null },
  "Back from the Dead!":       { title: "Shocking Return",         emoji: "⚰️", tags: ["Mystery"],             touchTags: ["Mystery","Romance","Family"],          climaxType: "vote",       climaxPrompt: "How does the table react to this return?",      followUp: null },
  "Public Scandal":            { title: "Public Scandal",          emoji: "📺", tags: ["Gossip","Celebrity"], touchTags: ["Gossip","Celebrity","Power"],          climaxType: "vote",       climaxPrompt: "Who comes out of this looking worst?",          followUp: null },
  "Explosive Love Confession": { title: "Grand Declaration",       emoji: "💘", tags: ["Romance"],              touchTags: ["Romance","Confrontation","Gossip"],    climaxType: "vote",       climaxPrompt: "Does this declaration change everything?",      followUp: null },
  "Inheritance Challenge":     { title: "Family War",              emoji: "📜", tags: ["Power","Family"],     touchTags: ["Power","Family","Business"],           climaxType: "vote",       climaxPrompt: "Who deserves the inheritance?",                 followUp: null },
  "Secret Child Revealed":     { title: "Hidden Legacy",           emoji: "🍼", tags: ["Family","Power"],     touchTags: ["Family","Romance","Power"],            climaxType: "vote",       climaxPrompt: "Will the family accept the hidden heir?",       followUp: null },
  "Grand Reconciliation":      { title: "Forced Peace",            emoji: "🕊️", tags: ["Romance","Family"],  touchTags: ["Romance","Family","Confrontation"],    climaxType: "vote",       climaxPrompt: "Is this reconciliation genuine or strategic?",  followUp: null },
  "Slander/Defamation":        { title: "Smear Campaign",          emoji: "📰", tags: ["Gossip"],              touchTags: ["Gossip","Power","Celebrity"],          climaxType: "resolution", climaxPrompt: null,                                             followUp: "Public Scandal" },
  "Dig for Dirt":              { title: "Active Investigation",    emoji: "🔎", tags: ["Mystery","Gossip"],   touchTags: ["Mystery","Gossip","Confrontation"],    climaxType: "resolution", climaxPrompt: null,                                             followUp: null },
  "Total Exposure":            { title: "Total Exposure",          emoji: "📡", tags: ["Gossip","Power"],     touchTags: ["Gossip","Power","Celebrity"],          climaxType: "vote",       climaxPrompt: "Who is most damaged by the exposure?",          followUp: null },
  "Lovers' Quarrel":           { title: "Lovers' War",             emoji: "💢", tags: ["Romance","Confrontation"], touchTags: ["Romance","Confrontation"],          climaxType: "vote",       climaxPrompt: "Does this love survive the fight?",            followUp: null },
  "Dramatic Ultimatum":        { title: "The Ultimatum",           emoji: "⚡", tags: ["Power","Confrontation"], touchTags: ["Power","Confrontation","Business"],  climaxType: "vote",       climaxPrompt: "Does the threat get followed through?",         followUp: null },
  "Gossip Gone Wild":          { title: "Rumor Wildfire",          emoji: "📢", tags: ["Gossip"],              touchTags: ["Gossip","Celebrity","Power"],          climaxType: "resolution", climaxPrompt: null,                                             followUp: "Public Scandal" },
  "Social Media Blowup":       { title: "Viral Scandal",           emoji: "📲", tags: ["Gossip","Celebrity"], touchTags: ["Gossip","Celebrity","Power"],          climaxType: "vote",       climaxPrompt: "Who gets cancelled?",                           followUp: null },
  "The Intervention":          { title: "The Intervention",        emoji: "🫂", tags: ["Family","Power"],     touchTags: ["Family","Confrontation","Romance"],    climaxType: "vote",       climaxPrompt: "Does the subject accept help or rebel?",        followUp: null },
  "Crime of Passion":          { title: "Crime of Passion",        emoji: "🗡️", tags: ["Confrontation","Power"], touchTags: ["Confrontation","Power","Mystery"],  climaxType: "vote",       climaxPrompt: "Who was truly at fault?",                       followUp: null },
  "Secret Alliance":           { title: "Hidden Alliance",         emoji: "🤝", tags: ["Power","Business"],   touchTags: ["Power","Business","Confrontation"],    climaxType: "resolution", climaxPrompt: null,                                             followUp: null },
};

// ============ PLAYER STATES ============
export const PLAYER_STATES = {
  Exposed:     { emoji: "👁️",  label: "Exposed",     desc: "Gossip, mystery, and scandal cards targeting you gain +1 DP." },
  Suspected:   { emoji: "🔍",  label: "Suspected",   desc: "Mystery cards involving you escalate chains faster." },
  Heartbroken: { emoji: "💔",  label: "Heartbroken", desc: "Romance and betrayal plays involving you grant the instigator +1 bonus DP." },
  Blackmailed: { emoji: "📧",  label: "Blackmailed", desc: "Power and business cards targeting you carry extra weight." },
  Humiliated:  { emoji: "😳",  label: "Humiliated",  desc: "Comedy and gossip plays about you gain +1 DP for the instigator." },
  Protected:   { emoji: "🛡️",  label: "Protected",   desc: "Reduce the next incoming DP penalty by 1." },
  Entangled:   { emoji: "🕸️",  label: "Entangled",   desc: "Counted as part of active chains — escalation events touch you." },
  Vindicated:  { emoji: "✨",   label: "Vindicated",  desc: "Mystery and legal plays you instigate gain +1 DP." },
  Disgraced:   { emoji: "💀",  label: "Disgraced",   desc: "Others gain +1 DP when targeting you this turn." },
};

/**
 * Returns chain template for a card name, or null.
 */
export function getChainTemplate(cardName) {
  return CHAIN_TEMPLATES[cardName] || null;
}

/**
 * Returns a player state to apply to the TARGET when a card is played.
 */
export function getStateFromEvent(card) {
  if (card.secretReveal) return 'Exposed';
  if (card.type === 'Romance'   && card.dpTarget < 0) return 'Heartbroken';
  if (card.type === 'Gossip'    && card.dpTarget < 0) return 'Humiliated';
  if (card.type === 'Power'     && card.dpTarget < 0) return 'Blackmailed';
  if (card.type === 'Mystery'   && card.dpTarget < 0) return 'Suspected';
  if (card.type === 'Confrontation' && card.dpTarget < 0) return 'Disgraced';
  return null;
}

// All action cards (reactive + proactive)
export const ACTIONS = [...COUNTER_CARDS, ...ACTION_CARDS];
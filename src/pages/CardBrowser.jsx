import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CHARACTERS, LOCATIONS, EVENTS, ASPIRATIONS as DREAMS, SECRETS, ACTION_CARDS, COUNTER_CARDS } from "@/lib/gameData";
import ActionCard from "@/components/cards/ActionCard";
import SecretCard from "@/components/cards/SecretCard";
import CharacterCard from "@/components/cards/CharacterCard";
import LocationCard from "@/components/cards/LocationCard";
import EventCard from "@/components/cards/EventCard";
import DreamCard from "@/components/cards/DreamCard";

// De-duplicate events by name for browsing
const uniqueEvents = [];
const seenNames = new Set();
EVENTS.forEach(e => {
  if (!seenNames.has(e.name) && e.cardClass !== 'action') {
    seenNames.add(e.name);
    uniqueEvents.push(e);
  }
});

const ALL_ACTIONS = [...COUNTER_CARDS, ...ACTION_CARDS];
const totalCards = CHARACTERS.length + LOCATIONS.length + uniqueEvents.length + DREAMS.length + SECRETS.length + ALL_ACTIONS.length;

const tabs = [
  { value: "characters", label: "Characters", count: CHARACTERS.length },
  { value: "locations", label: "Locations", count: LOCATIONS.length },
  { value: "events", label: "Events", count: uniqueEvents.length },
  { value: "actions", label: "Actions", count: ALL_ACTIONS.length },
  { value: "dreams", label: "Aspirations", count: DREAMS.length },
  { value: "secrets", label: "Secrets", count: SECRETS.length },
];

export default function CardBrowser() {
  const [tab, setTab] = useState("characters");
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  const filterBySearch = (items, keys) => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item => keys.some(k => item[k]?.toLowerCase().includes(q)));
  };

  const filteredCharacters = filterBySearch(CHARACTERS, ["name", "description"]);
  const filteredLocations = filterBySearch(LOCATIONS, ["name", "description"]);
  const filteredDreams = filterBySearch(DREAMS, ["name", "description", "condition"]);

  let filteredEvents = filterBySearch(uniqueEvents, ["name", "effect"]);
  if (eventFilter !== "all") {
    filteredEvents = filteredEvents.filter(e => e.level === eventFilter);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Card Collection</h1>
            <p className="font-body text-sm text-muted-foreground">Browse all {totalCards} cards in the game</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-4">
          <TabsList className="bg-card border border-border h-auto p-1 gap-1">
            {tabs.map(t => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="font-body text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
              >
                {t.label} ({t.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 font-body bg-card border-border"
          />
        </div>

        {/* Event level filter */}
        {tab === "events" && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { val: "all", label: "All" },
              { val: "low", label: "Low Drama" },
              { val: "medium", label: "Medium Drama" },
              { val: "high", label: "High Drama" },
            ].map(f => (
              <Button
                key={f.val}
                variant={eventFilter === f.val ? "default" : "outline"}
                size="sm"
                onClick={() => setEventFilter(f.val)}
                className="font-body text-xs rounded-full"
              >
                {f.label}
              </Button>
            ))}
          </div>
        )}

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + eventFilter + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "characters" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCharacters.map(c => (
                  <CharacterCard key={c.id} character={c} />
                ))}
              </div>
            )}

            {tab === "locations" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredLocations.map(l => (
                  <LocationCard key={l.id} location={l} />
                ))}
              </div>
            )}

            {tab === "events" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredEvents.map(e => (
                  <div key={e.id}>
                    <EventCard event={e} />
                    <p className="font-body text-[10px] text-muted-foreground text-center mt-1">
                      ×{e.level === 'low' ? 2 : 3} copies
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "actions" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filterBySearch(ALL_ACTIONS, ["name", "effect", "actionCategory"]).map(a => (
                  <ActionCard key={a.id} action={a} />
                ))}
              </div>
            )}

            {tab === "dreams" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredDreams.map(d => (
                  <DreamCard key={d.id} dream={d} revealed />
                ))}
              </div>
            )}

            {tab === "secrets" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filterBySearch(SECRETS, ["name", "description", "goal"]).map(s => (
                  <SecretCard key={s.id} secret={s} revealed />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
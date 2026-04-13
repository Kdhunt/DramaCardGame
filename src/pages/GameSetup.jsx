import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Users, Sparkles, Plus, X, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CHARACTERS, shuffleDeck } from "@/lib/gameData";
import CharacterCard from "@/components/cards/CharacterCard";

export default function GameSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [gameMode, setGameMode] = useState(null); // 'quick' or 'full'
  const [playerNames, setPlayerNames] = useState(["", "", ""]);
  const [selectedCharacters, setSelectedCharacters] = useState({});
  const [currentPlayerPicking, setCurrentPlayerPicking] = useState(0);
  const [characterChoices, setCharacterChoices] = useState([]);

  const validPlayers = playerNames.filter(n => n.trim().length > 0);

  const addPlayer = () => {
    if (playerNames.length < 6) setPlayerNames([...playerNames, ""]);
  };

  const removePlayer = (idx) => {
    if (playerNames.length > 3) {
      const next = playerNames.filter((_, i) => i !== idx);
      setPlayerNames(next);
    }
  };

  const updatePlayerName = (idx, val) => {
    const next = [...playerNames];
    next[idx] = val;
    setPlayerNames(next);
  };

  const startCharacterSelection = () => {
    const shuffled = shuffleDeck(CHARACTERS.filter(c => c.selectable));
    // Each player gets 2 choices, pick 1
    const choices = {};
    validPlayers.forEach((_, i) => {
      choices[i] = [shuffled[i * 2], shuffled[i * 2 + 1]];
    });
    setCharacterChoices(choices);
    setCurrentPlayerPicking(0);
    setSelectedCharacters({});
    setStep(2);
  };

  const selectCharacter = (playerIdx, character) => {
    setSelectedCharacters(prev => ({ ...prev, [playerIdx]: character }));
    if (playerIdx < validPlayers.length - 1) {
      setCurrentPlayerPicking(playerIdx + 1);
    }
  };

  const allCharactersSelected = Object.keys(selectedCharacters).length === validPlayers.length;

  const startGame = () => {
    const gameState = {
      mode: gameMode,
      players: validPlayers.map((name, i) => ({
        name,
        character: selectedCharacters[i],
        dp: gameMode === 'full' ? 5 : 0,
        hand: [],
        dream: null,
        dreamRevealed: false,
      })),
    };
    sessionStorage.setItem("dramaGameState", JSON.stringify(gameState));
    navigate("/play");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Game Setup</h1>
            <p className="font-body text-sm text-muted-foreground">Configure your episode of Drama!</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {["Mode", "Players", "Characters"].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`} />
              <p className={`font-body text-xs mt-1.5 ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}>{label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Game Mode */}
          {step === 0 && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Choose Your Format</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    mode: 'quick',
                    icon: Zap,
                    title: "Quick-Play Episode",
                    time: "~40–45 min",
                    desc: "A single wild episode. Fast-paced chaos with a 15–20 DP target.",
                    details: ["Start at 0 DP", "1 Dream per player", "Race to the finish"],
                  },
                  {
                    mode: 'full',
                    icon: Clock,
                    title: "Full-Length Season",
                    time: "~90–120 min",
                    desc: "A multi-act epic saga. Complex arcs and huge payoffs at 30–40 DP target.",
                    details: ["Start at 5 DP", "Full event deck", "Catch-up mechanics"],
                  },
                ].map(opt => (
                  <motion.div
                    key={opt.mode}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setGameMode(opt.mode)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      gameMode === opt.mode
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <opt.icon className={`w-6 h-6 ${gameMode === opt.mode ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">{opt.title}</h3>
                        <p className="font-body text-xs text-muted-foreground">{opt.time}</p>
                      </div>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-3">{opt.desc}</p>
                    <div className="space-y-1">
                      {opt.details.map(d => (
                        <div key={d} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          <span className="font-body text-xs text-foreground">{d}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(1)}
                  disabled={!gameMode}
                  className="gap-2 rounded-full px-6 font-body"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Players */}
          {step === 1 && (
            <motion.div
              key="players"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-foreground">
                  <Users className="w-5 h-5 inline mr-2 text-primary" />
                  Players ({playerNames.length})
                </h2>
                <Badge variant="outline" className="font-body text-xs">3–6 players</Badge>
              </div>

              <div className="space-y-3">
                {playerNames.map((name, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-display text-sm font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <Input
                      placeholder={`Player ${i + 1} name`}
                      value={name}
                      onChange={e => updatePlayerName(i, e.target.value)}
                      className="font-body bg-card border-border"
                    />
                    {playerNames.length > 3 && (
                      <Button variant="ghost" size="icon" onClick={() => removePlayer(i)} className="rounded-full shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>

              {playerNames.length < 6 && (
                <Button variant="outline" onClick={addPlayer} className="gap-2 font-body rounded-full">
                  <Plus className="w-4 h-4" /> Add Player
                </Button>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(0)} className="gap-2 rounded-full font-body">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={startCharacterSelection}
                  disabled={validPlayers.length < 3}
                  className="gap-2 rounded-full px-6 font-body"
                >
                  Choose Characters <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Character Selection */}
          {step === 2 && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {!allCharactersSelected ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display text-lg font-bold text-primary-foreground">
                      {currentPlayerPicking + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">
                        {validPlayers[currentPlayerPicking]}'s Turn
                      </h2>
                      <p className="font-body text-sm text-muted-foreground">Choose your character (pick 1 of 2)</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {characterChoices[currentPlayerPicking]?.map(char => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        selected={selectedCharacters[currentPlayerPicking]?.id === char.id}
                        onClick={() => selectCharacter(currentPlayerPicking, char)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    <Sparkles className="w-5 h-5 inline mr-2 text-primary" />
                    Cast Assembled!
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {validPlayers.map((name, i) => (
                      <div key={i} className="rounded-xl bg-card border border-border p-4">
                        <p className="font-body text-xs text-muted-foreground mb-1">Player {i + 1}</p>
                        <p className="font-display text-base font-bold text-foreground mb-2">{name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedCharacters[i].emoji}</span>
                          <span className="font-body text-sm text-foreground">{selectedCharacters[i].name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2 rounded-full font-body">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {allCharactersSelected && (
                  <Button onClick={startGame} className="gap-2 rounded-full px-8 font-body text-base">
                    <Sparkles className="w-5 h-5" /> Start Drama!
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
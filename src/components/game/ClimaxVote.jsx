import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Flame } from "lucide-react";

export default function ClimaxVote({ chain, players, onResolve }) {
  const [votes, setVotes] = useState({});
  const [phase, setPhase] = useState("vote"); // "vote" | "result"
  const [result, setResult] = useState(null);

  if (!chain) return null;

  const involved = players.filter(p =>
    chain.involvedPlayerIds.includes(p.id || p.name)
  );
  const allPlayers = players;

  const castVote = (voterId, targetId) => {
    setVotes(prev => ({ ...prev, [voterId]: targetId }));
  };

  const totalVoters = allPlayers.length;
  const votescast = Object.keys(votes).length;

  const tally = () => {
    const counts = {};
    Object.values(votes).forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    const winner = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
    const winnerPlayer = allPlayers.find(p => (p.id || p.name) === winner?.[0]);
    setResult({ winnerId: winner?.[0], winnerPlayer, counts });
    setPhase("result");
  };

  const finish = () => {
    onResolve({
      chain,
      winnerId: result?.winnerId,
      winnerPlayer: result?.winnerPlayer,
      counts: result?.counts || {},
    });
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="bg-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <span>{chain.emoji}</span>
            <span className="text-red-400">Climax!</span>
            {chain.title}
          </DialogTitle>
          <DialogDescription className="font-body text-sm">
            This storyline has hit a boiling point. The table must decide.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-2">
          <p className="font-display text-base font-bold text-red-400">📢 The Question</p>
          <p className="font-body text-sm text-foreground mt-1 italic">"{chain.climaxPrompt}"</p>
        </div>

        {phase === "vote" && (
          <div className="space-y-3">
            <p className="font-body text-xs text-muted-foreground">
              Each player votes ({votescast}/{totalVoters} cast). Vote for the player who best fits the dramatic outcome.
            </p>
            {allPlayers.map((voter, vi) => (
              <div key={vi} className="space-y-1">
                <p className="font-body text-xs text-muted-foreground font-medium">{voter.character?.emoji} {voter.name} votes for:</p>
                <div className="flex flex-wrap gap-2">
                  {involved.map((p, pi) => {
                    const tid = p.id || p.name;
                    const vid = voter.id || voter.name;
                    const chosen = votes[vid] === tid;
                    return (
                      <Button
                        key={pi}
                        size="sm"
                        variant={chosen ? "default" : "outline"}
                        onClick={() => castVote(vid, tid)}
                        className="font-body rounded-full text-xs"
                      >
                        {p.character?.emoji} {p.name}
                        {chosen && " ✓"}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
            <DialogFooter>
              <Button
                disabled={votescast < Math.min(2, totalVoters)}
                onClick={tally}
                className="font-body rounded-full gap-2"
              >
                <Flame className="w-4 h-4" /> Count the Votes
              </Button>
            </DialogFooter>
          </div>
        )}

        {phase === "result" && result && (
          <div className="space-y-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="text-center py-4"
            >
              <span className="text-5xl block mb-2">{result.winnerPlayer?.character?.emoji || "🎭"}</span>
              <p className="font-display text-xl font-bold text-primary">{result.winnerPlayer?.name}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">wins this dramatic moment</p>
              <p className="font-display text-3xl font-black text-primary mt-2">+3 DP</p>
            </motion.div>
            {chain.followUp && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
                <p className="font-body text-xs text-amber-400">
                  🔄 The drama transforms into: <span className="font-bold">{chain.followUp}</span>
                </p>
              </div>
            )}
            <div className="space-y-1">
              {Object.entries(result.counts || {}).map(([tid, count]) => {
                const p = allPlayers.find(p => (p.id || p.name) === tid);
                return (
                  <div key={tid} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                    <Trophy className="w-3 h-3" />
                    {p?.character?.emoji} {p?.name}: {count} vote{count !== 1 ? "s" : ""}
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button onClick={finish} className="font-body rounded-full gap-2">
                Resolve & Continue
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
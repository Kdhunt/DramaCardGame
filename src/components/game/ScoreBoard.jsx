import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { parsePlayerName } from "@/lib/nameUtils";
import PlayerStates from "@/components/game/PlayerStates";

export default function ScoreBoard({ players, currentTurn, targetDP }) {
  const sorted = [...players].sort((a, b) => b.dp - a.dp);
  const leader = sorted[0]?.dp || 0;

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Scoreboard
        </h3>
        <span className="font-body text-xs text-muted-foreground">Target: {targetDP} DP</span>
      </div>

      <div className="space-y-2">
        {players.map((player, i) => {
          const isActive = i === currentTurn;
          const isLeader = player.dp === leader && player.dp > 0;
          const progress = targetDP > 0 ? Math.min((player.dp / targetDP) * 100, 100) : 0;
          const { displayName, secretRole } = parsePlayerName(player.name);

          return (
            <motion.div
              key={i}
              layout
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                isActive ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/30"
              }`}
            >
              <span className="text-xl shrink-0">{player.character.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-body text-xs font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {displayName}
                  </span>
                  {secretRole && (
                    <span className="font-body text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 shrink-0">
                      {secretRole}
                    </span>
                  )}
                  {isLeader && <Star className="w-3 h-3 text-primary shrink-0" />}
                  {isActive && (
                    <span className="font-body text-[10px] text-primary shrink-0">← Turn</span>
                  )}
                </div>
                <PlayerStates states={player.states} />
                <div className="w-full h-1.5 rounded-full bg-muted mt-1">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <span className="font-display text-lg font-bold text-foreground shrink-0">
                {player.dp}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
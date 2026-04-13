import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Target } from "lucide-react";

export default function SecretCard({ secret, revealed, peekable, onPeek, compact }) {
  if (!secret) return null;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        revealed ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border"
      }`}>
        <span className="text-lg">{revealed ? secret.emoji : "🔒"}</span>
        <span className="font-body text-xs font-medium text-foreground truncate">
          {revealed ? secret.name : "Hidden Secret"}
        </span>
        {revealed && (
          <span className="font-body text-[10px] text-destructive ml-auto shrink-0">EXPOSED</span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={peekable ? { scale: 1.02 } : {}}
      onClick={peekable ? onPeek : undefined}
      className={`relative rounded-xl overflow-hidden ring-1 transition-all duration-300 ${
        revealed
          ? "ring-destructive/60 shadow-lg shadow-destructive/20"
          : peekable
          ? "ring-border hover:ring-primary/50 cursor-pointer"
          : "ring-border"
      }`}
    >
      <div className={`p-4 min-h-[160px] flex flex-col ${
        revealed
          ? "bg-gradient-to-br from-destructive/15 via-card to-destructive/5"
          : "bg-gradient-to-br from-muted via-card to-secondary/20"
      }`}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-3xl">{revealed ? secret.emoji : "🔒"}</span>
          {revealed ? <Eye className="w-4 h-4 text-destructive" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
        </div>

        {revealed ? (
          <>
            <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1">{secret.name}</h3>
            <p className="font-body text-xs text-muted-foreground mb-2 flex-1">{secret.description}</p>
            <div className="bg-background/40 rounded-lg px-2.5 py-1.5 border border-destructive/20 mb-2">
              <p className="font-body text-[11px] text-destructive italic">Exposed! −{secret.penalty} DP</p>
            </div>
            {secret.goal && (
              <div className="bg-primary/10 rounded-lg px-2.5 py-1.5 border border-primary/20">
                <div className="flex items-center gap-1 mb-0.5">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="font-body text-[10px] text-primary font-semibold">Secret Goal (+{secret.goalReward} DP)</span>
                </div>
                <p className="font-body text-[11px] text-primary/80 italic">{secret.goal}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Lock className="w-8 h-8 text-muted-foreground/40" />
            <p className="font-display text-sm font-bold text-muted-foreground/60">Dark Secret</p>
            {peekable && (
              <p className="font-body text-xs text-muted-foreground/40 text-center">Tap to peek (privately)</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
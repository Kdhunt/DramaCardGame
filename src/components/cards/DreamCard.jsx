import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Trophy } from "lucide-react";

export default function DreamCard({ dream, revealed, onReveal, compact }) {
  if (!dream) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
        <span className="text-lg">{revealed ? dream.emoji : "❓"}</span>
        <span className="font-body text-xs font-medium text-foreground truncate">
          {revealed ? dream.name : "Secret Aspiration"}
        </span>
        {revealed && (
          <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-body ml-auto">
            +{dream.reward} DP
          </Badge>
        )}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={onReveal}
      className={`relative rounded-xl overflow-hidden cursor-pointer ring-1 transition-all duration-300 ${
        revealed
          ? "ring-primary shadow-lg shadow-primary/20"
          : "ring-primary/30 hover:ring-primary/60"
      }`}
    >
      <div className="bg-gradient-to-br from-primary/15 via-card to-secondary/20 p-4 min-h-[180px] flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <span className="text-3xl">{revealed ? dream.emoji : "🔮"}</span>
          {revealed ? (
            <Eye className="w-4 h-4 text-primary" />
          ) : (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {revealed ? (
          <>
            <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1">
              {dream.name}
            </h3>
            <p className="font-body text-xs text-muted-foreground mb-2 flex-1">
              {dream.description}
            </p>
            <div className="bg-background/40 rounded-lg px-2.5 py-2 border border-border/50 mb-2">
              <p className="font-body text-[11px] text-primary italic leading-snug">
                Condition: {dream.condition}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="font-display text-sm font-bold text-primary">+{dream.reward} DP</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="font-display text-lg font-bold text-muted-foreground/60 mb-1">Secret Aspiration</p>
            <p className="font-body text-xs text-muted-foreground/40 text-center">
              Click to reveal when achieved
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
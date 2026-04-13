import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const TYPE_STYLES = {
  Romance:      { bg: "bg-pink-500/20",   text: "text-pink-400",   border: "border-pink-500/40",   glow: "shadow-pink-500/20" },
  Gossip:       { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40", glow: "shadow-yellow-500/20" },
  Confrontation:{ bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/40", glow: "shadow-orange-500/20" },
  Mystery:      { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/40", glow: "shadow-violet-500/20" },
  Comedy:       { bg: "bg-teal-500/20",   text: "text-teal-400",   border: "border-teal-500/40",   glow: "shadow-teal-500/20" },
  Power:        { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500/40",    glow: "shadow-red-500/20" },
};

const CHAIN_EMOJIS = { 2: "🔥", 3: "💥", 4: "⚡", 5: "🌪️" };

export default function ChainTracker({ chain }) {
  const active = chain && chain.count >= 2;
  const style = active ? (TYPE_STYLES[chain.eventType] || TYPE_STYLES.Power) : null;
  const bonus = chain?.count >= 4 ? 3 : chain?.count === 3 ? 2 : chain?.count === 2 ? 1 : 0;
  const chainEmoji = CHAIN_EMOJIS[Math.min(chain?.count || 0, 5)] || "🔗";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          className={`rounded-xl border ${style.border} ${style.bg} px-4 py-3 shadow-lg ${style.glow} flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{chainEmoji}</span>
            <div>
              <p className={`font-display text-sm font-bold ${style.text}`}>
                {chain.eventType} Chain ×{chain.count}
              </p>
              <p className="font-body text-[10px] text-muted-foreground">
                Pile on with another <span className={`font-bold ${style.text}`}>{chain.eventType}</span> card to escalate!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Zap className={`w-4 h-4 ${style.text}`} />
            <span className={`font-display text-lg font-black ${style.text}`}>+{bonus} DP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
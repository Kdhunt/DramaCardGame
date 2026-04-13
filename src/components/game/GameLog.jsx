import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GameLog({ log }) {
  if (!log || log.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="font-display text-sm font-bold text-foreground mb-2">📜 Story So Far</h3>
        <p className="font-body text-xs text-muted-foreground italic">The drama has yet to unfold...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <h3 className="font-display text-sm font-bold text-foreground mb-3">📜 Story So Far</h3>
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-2 pr-2">
          <AnimatePresence>
            {log.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 text-xs"
              >
                <span className="text-base shrink-0">{entry.emoji}</span>
                <div>
                  <span className="font-body text-foreground font-medium">{entry.player}</span>
                  <span className="font-body text-muted-foreground"> {entry.text}</span>
                  {entry.dp !== 0 && (
                    <span className={`font-display font-bold ml-1 ${entry.dp > 0 ? "text-primary" : "text-destructive"}`}>
                      {entry.dp > 0 ? "+" : ""}{entry.dp} DP
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
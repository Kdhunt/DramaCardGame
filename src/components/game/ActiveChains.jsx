import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, AlertTriangle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const INTENSITY_CONFIG = {
  1: { label: "Simmering",  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  icon: Flame   },
  2: { label: "Escalating", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: Zap     },
  3: { label: "EXPLOSIVE",  color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30",    icon: AlertTriangle },
};

const STATUS_CONFIG = {
  active:     { label: "Active",     color: "text-emerald-400", bg: "bg-emerald-500/15" },
  unstable:   { label: "Unstable",   color: "text-orange-400",  bg: "bg-orange-500/15"  },
  exploded:   { label: "Exploded",   color: "text-red-400",     bg: "bg-red-500/15"     },
  resolved:   { label: "Resolved",   color: "text-muted-foreground", bg: "bg-muted/30"  },
  suppressed: { label: "Suppressed", color: "text-blue-400",    bg: "bg-blue-500/15"    },
};

export default function ActiveChains({ chains, players, onTarget }) {
  const active = chains.filter(c => c.status !== "resolved" && c.status !== "suppressed");
  if (active.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          🎭 Active Storylines
        </h3>
        <Badge variant="outline" className="font-body text-[10px]">{active.length} live</Badge>
      </div>
      <AnimatePresence>
        {active.map(chain => {
          const ic = INTENSITY_CONFIG[chain.intensity] || INTENSITY_CONFIG[1];
          const sc = STATUS_CONFIG[chain.status] || STATUS_CONFIG.active;
          const Icon = ic.icon;
          const involved = chain.involvedPlayerIds
            .map(id => players.find(p => p.id === id || p.name === id))
            .filter(Boolean);

          return (
            <motion.div
              key={chain.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`rounded-xl border ${ic.border} ${ic.bg} px-3 py-2.5`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-xl shrink-0 mt-0.5">{chain.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className={`font-display text-sm font-bold ${ic.color} leading-tight`}>{chain.title}</p>
                      <span className={`text-[10px] font-body px-1.5 py-0 rounded-full border ${ic.border} ${ic.color}`}>
                        <Icon className="w-2.5 h-2.5 inline mr-0.5" />{ic.label}
                      </span>
                      {chain.status !== "active" && (
                        <span className={`text-[10px] font-body px-1.5 py-0 rounded-full ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      )}
                    </div>

                    {/* Involved players */}
                    {involved.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {involved.map((p, i) => (
                          <span key={i} className="font-body text-[10px] px-1.5 py-0.5 rounded-full bg-card border border-border text-muted-foreground">
                            {p.character?.emoji} {p.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-1">
                      {chain.tags.map(t => (
                        <Badge key={t} variant="outline" className="text-[9px] px-1 py-0 border-border text-muted-foreground font-body">{t}</Badge>
                      ))}
                    </div>

                    {/* Escalation bar */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[1,2,3].map(n => (
                          <div key={n} className={`w-4 h-1.5 rounded-full transition-all ${n <= chain.intensity ? ic.color.replace('text-','bg-').replace('400','500') : 'bg-muted'}`} />
                        ))}
                      </div>
                      <span className="font-body text-[9px] text-muted-foreground">
                        {chain.escalationCount} escalation{chain.escalationCount !== 1 ? 's' : ''}
                        {chain.intensity < 3 ? ` — ${3 - chain.intensity} more to climax` : ' — CLIMAX READY'}
                      </span>
                    </div>

                    {chain.intensity === 3 && (
                      <p className={`font-body text-[10px] ${ic.color} font-bold mt-1 animate-pulse`}>
                        ⚡ Chain climax triggered!
                      </p>
                    )}
                  </div>
                </div>

                {chain.visibleToAll ? (
                  <Eye className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
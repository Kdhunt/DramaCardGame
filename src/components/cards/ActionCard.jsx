import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ACTION_CATEGORY_COLORS } from "@/lib/gameData";
import { Zap, Shield, Eye, RotateCcw, ChevronRight, Flame, Users, Megaphone } from "lucide-react";

const CATEGORY_ICONS = {
  Manipulation:  RotateCcw,
  Escalation:    Flame,
  Suppression:   Shield,
  Insertion:     Users,
  Exposure:      Eye,
  Protection:    Shield,
  Redirection:   ChevronRight,
  Amplification: Megaphone,
  Framing:       Zap,
};

const TIMING_LABELS = {
  reactive:  { label: "Reactive", desc: "Play when targeted", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  proactive: { label: "Proactive", desc: "Play on your turn", bg: "bg-primary/20", text: "text-primary", border: "border-primary/30" },
  both:      { label: "Reactive + Proactive", desc: "Flexible timing", bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
};

const TARGET_LABELS = {
  event:        "Target: Event",
  chain:        "Target: Chain",
  player:       "Target: Player",
  self:         "Target: Self",
  chain_player: "Target: Chain + Player",
};

export default function ActionCard({ action, onClick, disabled, small }) {
  if (!action) return null;

  const cc = ACTION_CATEGORY_COLORS[action.actionCategory] || ACTION_CATEGORY_COLORS.Manipulation;
  const timing = TIMING_LABELS[action.timing] || TIMING_LABELS.proactive;
  const Icon = CATEGORY_ICONS[action.actionCategory] || Zap;

  if (small) {
    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${cc.border} ${cc.bg} ${
          !disabled ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed opacity-50'
        } transition-all`}
      >
        <span className="text-lg">{action.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-body text-xs font-medium text-foreground truncate">{action.name}</p>
          <div className="flex items-center gap-1">
            <p className={`font-body text-[9px] ${cc.text}`}>{action.actionCategory}</p>
            <span className={`font-body text-[8px] px-1 rounded ${timing.bg} ${timing.text}`}>{timing.label}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.04, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ring-1 ${cc.border} hover:ring-2`}
    >
      <div className={`${cc.bg} p-3.5 min-h-[200px] flex flex-col`}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <Badge className={`${cc.bg} ${cc.text} border ${cc.border} text-[10px] font-body gap-1`}>
            <Icon className="w-3 h-3" />
            {action.actionCategory}
          </Badge>
          <Badge className={`${timing.bg} ${timing.text} border ${timing.border} text-[9px] font-body`}>
            {timing.label}
          </Badge>
        </div>

        {/* Action "A" watermark badge */}
        <div className="absolute top-2 right-2 opacity-20">
          <span className="font-display text-4xl font-black text-foreground">A</span>
        </div>

        <span className="text-3xl mb-1.5">{action.emoji}</span>
        <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1">{action.name}</h3>
        <p className="font-body text-[11px] text-muted-foreground leading-snug flex-1">{action.effect}</p>

        {/* Target indicator */}
        <div className={`mt-2 px-2 py-1 rounded-lg ${cc.bg} border ${cc.border}`}>
          <p className={`font-body text-[10px] ${cc.text} font-medium`}>
            🎯 {TARGET_LABELS[action.target] || `Target: ${action.target}`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
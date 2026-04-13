import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getDramaLevelColor, EVENT_TYPE_COLORS } from "@/lib/gameData";
import { Zap, Flame, Sparkles, ShieldOff } from "lucide-react";
import ActionCard from "./ActionCard";

const COUNTER_TYPE_COLORS = {
  negate:   { bg: 'bg-blue-500/20',    text: 'text-blue-400',    border: 'border-blue-500/30'    },
  redirect: { bg: 'bg-amber-500/20',   text: 'text-amber-400',   border: 'border-amber-500/30'   },
  reflect:  { bg: 'bg-violet-500/20',  text: 'text-violet-400',  border: 'border-violet-500/30'  },
  expose:   { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/30' },
};

const levelIcons = {
  low: Sparkles,
  medium: Zap,
  high: Flame,
};

export default function EventCard({ event, onClick, disabled, small }) {
  if (!event) return null;

  // Action card rendering (new system — former counters + new proactive actions)
  if (event.cardClass === 'action') {
    return <ActionCard action={event} onClick={onClick} disabled={disabled} small={small} />;
  }

  // Legacy counter card rendering (backwards compat, shouldn't appear in new data)
  if (event.cardClass === 'counter') {
    const cc = COUNTER_TYPE_COLORS[event.counterType] || COUNTER_TYPE_COLORS.negate;

    if (small) {
      return (
        <div
          onClick={disabled ? undefined : onClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${cc.border} ${cc.bg} ${!disabled ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed opacity-50'} transition-all`}
        >
          <span className="text-lg">{event.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs font-medium text-foreground truncate">{event.name}</p>
            <p className={`font-body text-[9px] ${cc.text}`}>{event.counterType?.toUpperCase()}</p>
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
        <div className={`${cc.bg} p-3.5 min-h-[180px] flex flex-col`}>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${cc.bg} ${cc.text} border ${cc.border} text-[10px] font-body gap-1`}>
              <ShieldOff className="w-3 h-3" />
              {event.counterType?.charAt(0).toUpperCase() + event.counterType?.slice(1)}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] font-body">Counter</Badge>
          </div>
          <span className="text-3xl mb-1.5">{event.emoji}</span>
          <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1">{event.name}</h3>
          <p className="font-body text-[11px] text-muted-foreground leading-snug flex-1">{event.effect}</p>
        </div>
      </motion.div>
    );
  }

  const colors = getDramaLevelColor(event.level);
  const Icon = levelIcons[event.level] || Sparkles;

  if (small) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors.border} ${colors.bg}`}>
        <span className="text-lg">{event.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-body text-xs font-medium text-foreground truncate">{event.name}</p>
          <div className="flex items-center gap-1.5">
            <p className={`font-body text-[10px] ${colors.text}`}>{event.levelLabel}</p>
            {event.type && (
              <span className={`font-body text-[9px] px-1 rounded ${EVENT_TYPE_COLORS[event.type]?.bg} ${EVENT_TYPE_COLORS[event.type]?.text}`}>
                {event.type}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const typeColors = event.type ? EVENT_TYPE_COLORS[event.type] : null;

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.04, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ring-1 ${colors.border} hover:ring-2`}
    >
      <div className={`${colors.bg} p-3.5 min-h-[180px] flex flex-col`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Badge className={`${colors.bg} ${colors.text} border ${colors.border} text-[10px] font-body gap-1`}>
              <Icon className="w-3 h-3" />
              {event.levelLabel}
            </Badge>
            {event.type && typeColors && (
              <Badge className={`${typeColors.bg} ${typeColors.text} border ${typeColors.border} text-[10px] font-body`}>
                {event.type}
              </Badge>
            )}
          </div>
          {event.cost > 0 && (
            <Badge variant="outline" className="text-[10px] font-body border-destructive/30 text-destructive">
              Cost: {event.cost} DP
            </Badge>
          )}
        </div>

        <span className="text-3xl mb-1.5">{event.emoji}</span>
        <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1">
          {event.name}
        </h3>
        <p className="font-body text-[11px] text-muted-foreground leading-snug flex-1">
          {event.effect}
        </p>

        <div className="flex gap-2 mt-2">
          {event.dpInstigator > 0 && (
            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-body">
              +{event.dpInstigator} DP (you)
            </Badge>
          )}
          {event.dpTarget !== 0 && (
            <Badge className={`text-[10px] font-body ${
              event.dpTarget > 0
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-destructive/20 text-destructive border-destructive/30"
            }`}>
              {event.dpTarget > 0 ? "+" : ""}{event.dpTarget} DP (target)
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
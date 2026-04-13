import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export default function LocationCard({ location, active, onClick, compact }) {
  if (!location) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
        <MapPin className="w-3.5 h-3.5 text-accent" />
        <span className="text-lg">{location.emoji}</span>
        <span className="font-body text-sm font-medium text-foreground truncate">{location.name}</span>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
        active
          ? "ring-2 ring-accent shadow-lg shadow-accent/20"
          : "ring-1 ring-border hover:ring-accent/50"
      }`}
    >
      <div className="bg-gradient-to-br from-accent/10 via-card to-secondary/30 p-4 min-h-[160px] flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <span className="text-3xl">{location.emoji}</span>
          <div className="flex flex-wrap gap-1">
            {location.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 border-accent/30 text-accent font-body">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1">
          {location.name}
        </h3>
        <p className="font-body text-xs text-muted-foreground mb-2 flex-1">
          {location.description}
        </p>

        <div className="bg-background/40 rounded-lg px-2.5 py-1.5 border border-border/50">
          <p className="font-body text-[11px] text-accent italic leading-snug">
            {location.effect}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
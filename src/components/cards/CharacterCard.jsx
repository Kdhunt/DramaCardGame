import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CharacterCard({ character, selected, onClick, compact }) {
  if (!character) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
        <span className="text-xl">{character.emoji}</span>
        <span className="font-body text-sm font-medium text-foreground truncate">{character.name}</span>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
        selected
          ? "ring-2 ring-primary shadow-lg shadow-primary/20"
          : "ring-1 ring-border hover:ring-primary/50"
      }`}
    >
      <div className="bg-gradient-to-br from-secondary via-card to-muted p-4 min-h-[220px] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{character.emoji}</span>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            >
              <span className="text-primary-foreground text-xs font-bold">✓</span>
            </motion.div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-1.5">
          {character.name}
        </h3>

        {/* Description */}
        <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
          {character.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {character.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary font-body">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Ability */}
        <div className="bg-background/40 rounded-lg px-2.5 py-2 border border-border/50">
          <p className="font-body text-[11px] text-muted-foreground italic leading-snug">
            {character.ability}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
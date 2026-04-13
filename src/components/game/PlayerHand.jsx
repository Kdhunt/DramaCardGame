import { motion, AnimatePresence } from "framer-motion";
import EventCard from "../cards/EventCard";

export default function PlayerHand({ hand, onPlayCard, disabled }) {
  if (!hand || hand.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="font-body text-sm text-muted-foreground">No cards in hand</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <AnimatePresence>
        {hand.map((card, i) => (
          <motion.div
            key={card.id + "-" + i}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ delay: i * 0.05 }}
          >
            <EventCard
              event={card}
              onClick={() => onPlayCard(card, i)}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
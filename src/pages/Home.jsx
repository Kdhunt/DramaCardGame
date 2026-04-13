import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, BookOpen, Users, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Users, label: "3–6 Players", desc: "Perfect for game nights" },
  { icon: Clock, label: "40–120 min", desc: "Quick or full-length" },
  { icon: Sparkles, label: "150 Cards", desc: "Endless drama combos" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 font-body text-xs text-accent tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            The Soap Opera Card Game
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-6xl sm:text-8xl md:text-9xl font-black text-center leading-[0.85] tracking-tight mb-4"
        >
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            DRAMA!
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-body text-lg sm:text-xl text-muted-foreground text-center max-w-lg mb-10 leading-relaxed"
        >
          Spin outrageous soap opera plots. Play wild twists.
          <br className="hidden sm:block" />
          Earn Drama Points. Unleash your inner drama queen.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mb-16"
        >
          <Link to="/setup">
            <Button size="lg" className="gap-2 font-body text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <Play className="w-5 h-5" />
              New Game
            </Button>
          </Link>
          <Link to="/rules">
            <Button size="lg" variant="outline" className="gap-2 font-body text-base px-8 py-6 border-border text-foreground hover:bg-muted rounded-full">
              <BookOpen className="w-5 h-5" />
              How to Play
            </Button>
          </Link>
          <Link to="/cards">
            <Button size="lg" variant="outline" className="gap-2 font-body text-base px-8 py-6 border-border text-foreground hover:bg-muted rounded-full">
              📇 Browse Cards
            </Button>
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border"
            >
              <f.icon className="w-5 h-5 text-primary" />
              <div>
                <p className="font-display text-sm font-bold text-foreground">{f.label}</p>
                <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating card emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["👑", "💔", "🎭", "🔥", "💍", "🗡️", "💰", "⚰️"].map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.15, 0],
                y: [0, -80],
                x: [0, (i % 2 === 0 ? 20 : -20)],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeOut",
              }}
              className="absolute text-3xl sm:text-4xl"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${60 + (i % 3) * 15}%`,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
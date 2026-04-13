import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";

const sections = [
  {
    title: "Overview",
    emoji: "🎬",
    content: "Drama! is a campy, tongue-in-cheek storytelling card game that parodies soap opera tropes. Players assume the roles of over-the-top soap opera characters and collaboratively spin an outrageous melodrama. Through clever card play and hammy roleplaying, you'll create wild plot twists in classic settings — all while earning Drama Points (DP) for stirring up chaos."
  },
  {
    title: "Components",
    emoji: "🃏",
    content: "150 cards total: 30 Character Cards (unique archetypes), 25 Location Cards (dramatic settings), 80 Event Cards (low/medium/high drama plot twists), and 15 Dream/Goal Cards (secret objectives). Plus Drama Point tokens to track scores."
  },
  {
    title: "Setup",
    emoji: "⚙️",
    content: "Each player draws 2 Character cards and picks one. Each gets 1 secret Dream/Goal card. Deal 5 Event cards per player. Place a starting Location. Quick-Play starts at 0 DP; Full-Length starts at 5 DP each."
  },
  {
    title: "Turn Structure",
    emoji: "🔄",
    content: "Each turn has 3 phases:\n\n1. DRAW PHASE: Draw 1 Event card from the deck.\n\n2. MAIN PHASE: Choose ONE action — Play an Event Card (introduce a plot twist), Change Location (move the scene), Work Toward a Dream (narrative action), or Pass (discard and draw).\n\n3. RESOLVE: Narrate the outcome, award Drama Points, check for mismatches and dream fulfillment. Vote on Performance Bonus (+1 DP for great acting)."
  },
  {
    title: "Drama Points",
    emoji: "⭐",
    content: "Earn DP by playing events (Low: +1-2, Medium: +2-3, High: +3-5), roleplaying (+1 per turn for theatrics), completing Dreams (+4-6 DP), and through mismatch bonuses.\n\nSpend DP on Dramatic Interrupts (2 DP to play out of turn), High Drama card costs, extra card draws (1 DP each), or avoiding negative effects."
  },
  {
    title: "Drama Multiplier",
    emoji: "🎭",
    content: "When a character is completely out of their element (e.g., a High Society heiress at a Dive Bar), all DP rewards from events get +1 bonus. For extreme mismatches, rewards may double! This rewards fish-out-of-water comedy."
  },
  {
    title: "Quick-Play (~45 min)",
    emoji: "⚡",
    content: "Race to 20 DP! Start at 0 DP with 1 Dream each. Fast-paced, chaotic, and perfect for game night. The first player to hit the target wins the episode."
  },
  {
    title: "Full-Length (~2 hrs)",
    emoji: "📺",
    content: "Target 35 DP. Start with 5 DP and the full event deck. Complex arcs, multiple twists, and catch-up mechanics (trailing players get +2 DP sympathy bonus). Build a full season of drama!"
  },
  {
    title: "Winning",
    emoji: "🏆",
    content: "First player to reach the DP target wins! In case of tie, tied players each deliver a final monologue and the group votes. Everyone creates the story together — the DP winner is just the biggest drama queen!"
  },
];

export default function Rules() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">How to Play</h1>
              <p className="font-body text-sm text-muted-foreground">The complete rules of Drama!</p>
            </div>
          </div>
          <Link to="/setup">
            <Button className="gap-2 rounded-full font-body">
              <Play className="w-4 h-4" /> Play Now
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{section.emoji}</span>
                <h2 className="font-display text-xl font-bold text-foreground">{section.title}</h2>
              </div>
              <div className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
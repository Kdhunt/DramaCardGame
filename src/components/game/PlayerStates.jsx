import { PLAYER_STATES } from "@/lib/gameData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function PlayerStates({ states = [] }) {
  if (!states || states.length === 0) return null;
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1">
        {states.map((s, i) => {
          const def = PLAYER_STATES[s] || { emoji: "❓", label: s, desc: "" };
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <span className="cursor-help text-base">{def.emoji}</span>
              </TooltipTrigger>
              <TooltipContent className="font-body text-xs max-w-[180px]">
                <span className="font-bold">{def.label}:</span> {def.desc}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
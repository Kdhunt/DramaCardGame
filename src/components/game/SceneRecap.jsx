import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, ScrollText, Pencil, Check } from "lucide-react";

export default function SceneRecap({ open, onClose, sceneHistory, onUpdateScene }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditTitle(sceneHistory[idx].title || "");
    setEditNotes(sceneHistory[idx].notes || "");
  };

  const saveEdit = (idx) => {
    onUpdateScene(idx, { title: editTitle, notes: editNotes });
    setEditingIdx(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-primary" />
            Scene Recap — Story So Far
          </DialogTitle>
        </DialogHeader>

        {sceneHistory.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground py-4">No scenes played yet.</p>
        ) : (
          <div className="relative pl-6 space-y-6 py-2">
            {/* Timeline line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />

            {sceneHistory.map((scene, idx) => {
              const isCurrent = idx === sceneHistory.length - 1;
              const isEditing = editingIdx === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[18px] top-1.5 w-3 h-3 rounded-full border-2 ${
                    isCurrent ? "bg-primary border-primary" : "bg-muted border-border"
                  }`} />

                  <div className={`rounded-xl border p-4 ${
                    isCurrent ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
                  }`}>
                    {/* Location header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl">{scene.location?.emoji}</span>
                        <div>
                          {isEditing ? (
                            <Input
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              placeholder={`Scene ${idx + 1}: ${scene.location?.name}`}
                              className="font-display text-sm font-bold bg-background border-border h-7 py-0 px-2"
                            />
                          ) : (
                            <p className="font-display text-sm font-bold text-foreground">
                              {scene.title || `Scene ${idx + 1}: ${scene.location?.name}`}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <MapPin className="w-3 h-3 text-accent" />
                            <span className="font-body text-[10px] text-accent">{scene.location?.name}</span>
                            {isCurrent && <Badge className="text-[9px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30 font-body">Active</Badge>}
                          </div>
                        </div>
                      </div>

                      {isEditing ? (
                        <Button size="sm" onClick={() => saveEdit(idx)} className="rounded-full h-7 px-3 font-body text-xs gap-1 shrink-0">
                          <Check className="w-3 h-3" /> Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => startEdit(idx)} className="rounded-full h-7 px-2 font-body text-xs gap-1 shrink-0 text-muted-foreground">
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                      )}
                    </div>

                    {/* Notes */}
                    {isEditing ? (
                      <Textarea
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        placeholder="Add scene notes… what happened here?"
                        className="font-body text-xs bg-background border-border min-h-[60px] mb-2 resize-none"
                      />
                    ) : scene.notes ? (
                      <p className="font-body text-xs text-muted-foreground italic mb-2 px-2 py-1.5 rounded-lg bg-background/50 border border-border/50">
                        📝 {scene.notes}
                      </p>
                    ) : null}

                    {/* Events list */}
                    {scene.events?.length > 0 ? (
                      <div className="space-y-1">
                        {scene.events.map((ev, ei) => (
                          <div key={ei} className="flex items-center gap-2 text-[11px] font-body text-muted-foreground">
                            <span className="shrink-0">{ev.emoji}</span>
                            <span className="text-foreground font-medium">{ev.player}</span>
                            <span>{ev.text}</span>
                            {ev.dp !== 0 && (
                              <span className={`font-bold ml-auto shrink-0 ${ev.dp > 0 ? "text-primary" : "text-destructive"}`}>
                                {ev.dp > 0 ? "+" : ""}{ev.dp} DP
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-[10px] text-muted-foreground/50 italic">No events played here yet.</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
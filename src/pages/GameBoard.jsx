import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  ArrowLeft, SkipForward, Shuffle, MapPin, Sparkles, Award, Star, Trophy, RefreshCw, Eye, ShieldAlert, ScrollText, Zap
} from "lucide-react";
import {
  EVENTS, LOCATIONS, ASPIRATIONS, CHARACTERS, SECRETS, shuffleDeck, checkMismatch,
  getChainBonus, getLocationTypeBonus, getSubAction, getChainTemplate, getStateFromEvent
} from "@/lib/gameData";
import ActiveChains from "@/components/game/ActiveChains";
import ClimaxVote from "@/components/game/ClimaxVote";
import PlayerStates from "@/components/game/PlayerStates";
import { parsePlayerName } from "@/lib/nameUtils";
import CharacterCard from "@/components/cards/CharacterCard";
import LocationCard from "@/components/cards/LocationCard";
import EventCard from "@/components/cards/EventCard";
import DreamCard from "@/components/cards/DreamCard";
import SecretCard from "@/components/cards/SecretCard";
import ScoreBoard from "@/components/game/ScoreBoard";
import PlayerHand from "@/components/game/PlayerHand";
import GameLog from "@/components/game/GameLog";
import ChainTracker from "@/components/game/ChainTracker";
import SceneRecap from "@/components/game/SceneRecap";

// Determine if a reactive action is valid against a pending event
function isCounterValid(counterCard, pendingCard) {
  if (!counterCard || counterCard.cardClass !== 'action' || counterCard.timing === 'proactive') return false;
  const { counterType, name } = counterCard;
  if (counterType === 'negate') {
    if (name === "Oh No You Don't") return pendingCard.level === 'high';
    return true;
  }
  if (counterType === 'redirect') {
    if (name === "Wrong Address") return ['Gossip', 'Mystery'].includes(pendingCard.type);
    return true;
  }
  if (counterType === 'reflect') {
    if (name === "Mirror Mirror") return ['Romance', 'Gossip'].includes(pendingCard.type);
    if (name === "Karma's a Witch") return pendingCard.type === 'Confrontation';
    return true; // Backfire works on any
  }
  if (counterType === 'expose') return true;
  return false;
}

export default function GameBoard() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [eventDeck, setEventDeck] = useState([]);
  const [locationDeck, setLocationDeck] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameLog, setGameLog] = useState([]);
  const [playedCard, setPlayedCard] = useState(null);
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  const [showAspirationDialog, setShowAspirationDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showPerformanceBonus, setShowPerformanceBonus] = useState(false);
  const [phase, setPhase] = useState("draw");
  const [eventChain, setEventChain] = useState(null);
  // Pile-on: during a chain, any player may jump in before the turn ends
  const [showPileOnDialog, setShowPileOnDialog] = useState(false);
  const [pileOnPlayerIdx, setPileOnPlayerIdx] = useState(null);
  // Evil Twin redraw
  const [showEvilTwinDialog, setShowEvilTwinDialog] = useState(false);
  const [evilTwinTargetIdx, setEvilTwinTargetIdx] = useState(null);
  const [evilTwinChoices, setEvilTwinChoices] = useState([]);
  // Secret / aspiration peeking
  const [showSecretPeek, setShowSecretPeek] = useState(false);
  const [showAspirationPeek, setShowAspirationPeek] = useState(false);
  // Secret reveal flow
  const [secretRevealState, setSecretRevealState] = useState(null);
  // Counter system — reactive
  const [counterOpportunity, setCounterOpportunity] = useState(null);
  const [showRecap, setShowRecap] = useState(false);
  const [sceneHistory, setSceneHistory] = useState([]);
  const [dramaChains, setDramaChains] = useState([]);
  const [climaxChain, setClimaxChain] = useState(null); // chain awaiting vote
  // { card, handIdx, targetIdx } — pending event waiting for counter response
  const [redirectPickState, setRedirectPickState] = useState(null);
  // { counterCard, counterHandIdx, pendingCard, pendingHandIdx, targetIdx }
  const [immunePlayers, setImmunePlayers] = useState(new Set());
  // Counter card proactive play (expose / immunity idol)
  const [showProactiveCounterDialog, setShowProactiveCounterDialog] = useState(false);
  const [proactiveCounter, setProactiveCounter] = useState(null);
  // Action window
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { card, handIdx }

  // Check win condition after climax too (must be before any early returns)
  useEffect(() => {
    if (!gameState || climaxChain) return;
    const w = gameState.players.find(p => p.dp >= targetDP);
    if (w && !showWinDialog) {
      setWinner(w);
      setShowWinDialog(true);
    }
  }, [gameState?.players, climaxChain]);

  // Initialize game
  useEffect(() => {
    const saved = sessionStorage.getItem("dramaGameState");
    if (!saved) { navigate("/setup"); return; }
    const state = JSON.parse(saved);

    const shuffledEvents = shuffleDeck(EVENTS);
    const shuffledLocations = shuffleDeck(LOCATIONS);
    const shuffledDreams = shuffleDeck(ASPIRATIONS);
    const shuffledSecrets = shuffleDeck(SECRETS);

    const players = state.players.map((p, i) => ({
      ...p,
      hand: shuffledEvents.splice(0, 5),
      dream: shuffledDreams[i],
      dreamRevealed: false,
      secrets: [shuffledSecrets[i * 2], shuffledSecrets[i * 2 + 1]],
      revealedSecretIds: [],
    }));

    const startLoc = shuffledLocations.shift();
    // Add unique id to each player for chain references
    const playersWithIds = players.map((p, i) => ({ ...p, id: p.name }));
    setGameState({ ...state, players: playersWithIds });
    setEventDeck(shuffledEvents);
    setLocationDeck(shuffledLocations);
    setCurrentLocation(startLoc);
    setSceneHistory([{ location: startLoc, events: [], title: "", notes: "" }]);
    setDramaChains([]);
    setPhase("draw");
  }, [navigate]);

  const targetDP = gameState?.mode === 'quick' ? 20 : 35;
  const currentPlayer = gameState?.players?.[currentTurn];

  const addLog = useCallback((emoji, player, text, dp = 0) => {
    setGameLog(prev => [{ emoji, player, text, dp }, ...prev]);
    setSceneHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.events = [...(last.events || []), { emoji, player, text, dp }];
      updated[updated.length - 1] = last;
      return updated;
    });
  }, []);

  // Draw phase
  const drawCard = () => {
    if (eventDeck.length === 0) return;
    const newDeck = [...eventDeck];
    const drawn = newDeck.shift();
    setEventDeck(newDeck);
    setGameState(prev => {
      const players = [...prev.players];
      players[currentTurn] = {
        ...players[currentTurn],
        hand: [...players[currentTurn].hand, drawn],
      };
      return { ...prev, players };
    });
    addLog("🃏", currentPlayer.name, "drew a card");
    // Clear immunity for current player on their new turn draw
    setImmunePlayers(prev => {
      const next = new Set(prev);
      next.delete(currentTurn);
      return next;
    });
    setPhase("main");
  };

  // Play an event or action card (from hand)
  const playEventCard = (card, handIdx) => {
    if (card.cardClass === 'action') {
      // Reactive-only actions during the action window — proactive/both on your turn
      if (card.timing === 'reactive') {
        // Reactive: inform player to wait for counter window
        setProactiveCounter({ card, handIdx });
        setShowProactiveCounterDialog(true);
      } else {
        // Proactive or both — open action window
        setPendingAction({ card, handIdx });
        setShowActionDialog(true);
      }
      return;
    }
    setPlayedCard({ card, handIdx });
    setShowPlayDialog(true);
  };

  // Secret reveal flow
  const startSecretReveal = (card, handIdx, targetPlayerIdx) => {
    const tier = card.secretReveal;
    const target = gameState.players[targetPlayerIdx];
    const unrevealed = target.secrets.filter(s => !target.revealedSecretIds.includes(s.id));

    if (unrevealed.length === 0) {
      addLog(card.emoji, currentPlayer.name, `tried to expose ${target.name} but all secrets are already out!`);
      removeCardFromHand(handIdx);
      setShowPlayDialog(false);
      setPlayedCard(null);
      setPhase('resolve');
      setShowPerformanceBonus(true);
      return;
    }

    if (tier === 'low') {
      setSecretRevealState({ tier, targetIdx: targetPlayerIdx, instigatorIdx: currentTurn, handIdx, card, phase: 'target_picks', targetChoices: null });
    } else if (tier === 'medium') {
      setSecretRevealState({ tier, targetIdx: targetPlayerIdx, instigatorIdx: currentTurn, handIdx, card, phase: 'target_picks', targetChoices: null });
    } else if (tier === 'high') {
      const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      resolveSecretExpose(targetPlayerIdx, picked, handIdx, card);
    }
    setShowPlayDialog(false);
    setPlayedCard(null);
  };

  const removeCardFromHand = (handIdx, playerIdx = currentTurn) => {
    setGameState(prev => {
      const players = [...prev.players];
      const cp = { ...players[playerIdx] };
      cp.hand = cp.hand.filter((_, i) => i !== handIdx);
      players[playerIdx] = cp;
      return { ...prev, players };
    });
  };

  const resolveSecretExpose = (targetIdx, secret, handIdx, card, instigatorIdx = currentTurn) => {
    setGameState(prev => {
      const players = [...prev.players];
      const cp = { ...players[instigatorIdx] };
      cp.hand = cp.hand.filter((_, i) => i !== handIdx);
      cp.dp = cp.dp + card.dpInstigator;
      players[instigatorIdx] = cp;
      const tp = { ...players[targetIdx] };
      tp.revealedSecretIds = [...(tp.revealedSecretIds || []), secret.id];
      tp.dp = Math.max(0, tp.dp - secret.penalty);
      players[targetIdx] = tp;
      return { ...prev, players };
    });
    addLog(card.emoji, gameState.players[instigatorIdx].name,
      `exposed ${gameState.players[targetIdx].name}'s secret: "${secret.name}"! (−${secret.penalty} DP)`,
      card.dpInstigator);
    setSecretRevealState(null);
    setPhase('resolve');
    setShowPerformanceBonus(true);
  };

  // ---- Drama Chain helpers ----
  const createChain = (card, instigatorIdx, targetIdxList) => {
    const tpl = getChainTemplate(card.name);
    if (!tpl) return null;
    const chain = {
      id: `chain_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      ...tpl,
      sourceCardName: card.name,
      instigatorId: gameState?.players?.[instigatorIdx]?.id || gameState?.players?.[instigatorIdx]?.name,
      involvedPlayerIds: [
        gameState?.players?.[instigatorIdx]?.id || gameState?.players?.[instigatorIdx]?.name,
        ...(targetIdxList || []).map(i => gameState?.players?.[i]?.id || gameState?.players?.[i]?.name),
      ].filter(Boolean),
      intensity: 1,
      status: "active",
      escalationCount: 0,
      createdTurn: currentTurn,
      lastModifiedTurn: currentTurn,
      visibleToAll: true,
    };
    setDramaChains(prev => [...prev, chain]);
    addLog("🎭", gameState.players[instigatorIdx].name, `started a new storyline: "${chain.title}"`);
    return chain;
  };

  const touchChains = (card, instigatorIdx, targetPlayerIdx) => {
    if (!gameState) return;
    const instigatorId = gameState.players[instigatorIdx]?.id || gameState.players[instigatorIdx]?.name;
    const targetId = targetPlayerIdx != null ? (gameState.players[targetPlayerIdx]?.id || gameState.players[targetPlayerIdx]?.name) : null;

    setDramaChains(prev => prev.map(chain => {
      if (chain.status === 'resolved' || chain.status === 'suppressed') return chain;
      const tagMatch = (card.type && chain.touchTags?.includes(card.type));
      const playerMatch = targetId && chain.involvedPlayerIds.includes(targetId);
      const instigatorMatch = chain.involvedPlayerIds.includes(instigatorId);
      if (!tagMatch && !playerMatch && !instigatorMatch) return chain;

      const newEscCount = chain.escalationCount + 1;
      let newIntensity = chain.intensity;
      if (newEscCount === 2 && chain.intensity < 2) newIntensity = 2;
      if (newEscCount >= 3 && chain.intensity < 3) newIntensity = 3;
      const newStatus = newIntensity === 3 ? 'unstable' : chain.status;
      addLog("🔥", gameState.players[instigatorIdx].name, `escalated "${chain.title}"! Intensity ${newIntensity}`);
      return { ...chain, escalationCount: newEscCount, intensity: newIntensity, status: newStatus, lastModifiedTurn: currentTurn };
    }));
  };

  const applyStateToPlayer = (playerIdx, state) => {
    if (playerIdx == null || !state) return;
    setGameState(prev => {
      const players = [...prev.players];
      const p = { ...players[playerIdx] };
      const existing = p.states || [];
      if (!existing.includes(state)) {
        p.states = [...existing, state];
        players[playerIdx] = p;
        return { ...prev, players };
      }
      return prev;
    });
  };

  // Check if any chains just hit intensity 3 and need a climax vote
  const checkClimaxTrigger = () => {
    setDramaChains(prev => {
      const explosive = prev.find(c => c.intensity === 3 && c.status === 'unstable' && c.climaxType === 'vote');
      if (explosive) {
        setClimaxChain(explosive);
      } else {
        // Auto-resolve non-vote climaxes
        const autoExplode = prev.find(c => c.intensity === 3 && c.status === 'unstable' && c.climaxType !== 'vote');
        if (autoExplode) {
          addLog("💥", "The Story", `"${autoExplode.title}" exploded! Consequences ripple through the scene.`);
          return prev.map(c => c.id === autoExplode.id ? { ...c, status: 'exploded' } : c);
        }
      }
      return prev;
    });
  };

  // Core event resolution
  const resolveEventCard = (card, handIdx, targetPlayerIdx) => {
    const isMismatch = checkMismatch(currentPlayer.character, currentLocation);
    const mismatchDP = isMismatch ? 1 : 0;
    const cost = card.cost || 0;

    const sameChain =
      eventChain &&
      eventChain.locationId === currentLocation?.id &&
      eventChain.eventType === card.type;
    const newChainCount = sameChain ? eventChain.count + 1 : 1;
    const chainBonusDP = getChainBonus(newChainCount);
    setEventChain({ locationId: currentLocation?.id, eventType: card.type, count: newChainCount });

    const locTypeBonus = getLocationTypeBonus(card, currentLocation);
    const totalBonus = mismatchDP + chainBonusDP + locTypeBonus;

    setGameState(prev => {
      const players = [...prev.players];
      const cp = { ...players[currentTurn] };
      cp.hand = cp.hand.filter((_, i) => i !== handIdx);
      cp.dp = cp.dp - cost + card.dpInstigator + totalBonus;
      players[currentTurn] = cp;

      if (targetPlayerIdx !== null && targetPlayerIdx !== undefined && targetPlayerIdx !== currentTurn) {
        const tp = { ...players[targetPlayerIdx] };
        tp.dp = Math.max(0, tp.dp + card.dpTarget);
        players[targetPlayerIdx] = tp;
        addLog(card.emoji, currentPlayer.name, `played "${card.name}" targeting ${tp.name}`, card.dpInstigator + totalBonus);
      } else {
        addLog(card.emoji, currentPlayer.name, `played "${card.name}"`, card.dpInstigator + totalBonus);
      }

      if (isMismatch) addLog("🎭", currentPlayer.name, "gets mismatch bonus! Fish out of water!", mismatchDP);
      if (chainBonusDP > 0) addLog("🔗", currentPlayer.name, `${card.type} chain ×${newChainCount} — escalation bonus!`, chainBonusDP);
      if (locTypeBonus > 0) addLog("📍", currentPlayer.name, `${card.type} event amplified by ${currentLocation?.name}!`, locTypeBonus);

      return { ...prev, players };
    });

    // Evil Twin special case
    const targetIsEvilTwin =
      targetPlayerIdx !== null &&
      targetPlayerIdx !== undefined &&
      card.name === "Evil Twin Unmasked" &&
      gameState?.players?.[targetPlayerIdx]?.character?.name === "The Evil Twin";

    if (targetIsEvilTwin) {
      const usedIds = new Set(gameState.players.map(p => p.character.id));
      const available = shuffleDeck(CHARACTERS.filter(c => !usedIds.has(c.id)));
      setEvilTwinChoices(available.slice(0, 2));
      setEvilTwinTargetIdx(targetPlayerIdx);
      setShowEvilTwinDialog(true);
    }

    // Persistent chain creation and touch
    createChain(card, currentTurn, targetPlayerIdx != null ? [targetPlayerIdx] : []);
    touchChains(card, currentTurn, targetPlayerIdx);
    const newState = getStateFromEvent(card);
    if (newState && targetPlayerIdx != null) applyStateToPlayer(targetPlayerIdx, newState);
    checkClimaxTrigger();

    setPlayedCard(null);
    setShowPlayDialog(false);
    setPhase("resolve");
    if (!targetIsEvilTwin) {
      // After resolving, check if we're in a chain — offer pile-on to next player
      const inChain = newChainCount >= 2;
      if (inChain && gameState?.players?.length > 1) {
        // Find next player (not current) who has a card of the same type
        const nextIdx = (currentTurn + 1) % gameState.players.length;
        const nextPlayer = gameState.players[nextIdx];
        const hasMatchingCard = nextPlayer?.hand?.some(
          c => c.cardClass !== 'counter' && c.type === card.type
        );
        if (hasMatchingCard) {
          setPileOnPlayerIdx(nextIdx);
          setShowPileOnDialog(true);
          return;
        }
      }
      setShowPerformanceBonus(true);
    }
  };

  // Confirm play — routes through counter check
  const confirmPlayCard = (targetPlayerIdx) => {
    if (!playedCard) return;
    const { card, handIdx } = playedCard;

    // Route secret reveal cards
    if (card.secretReveal && targetPlayerIdx !== null && targetPlayerIdx !== undefined) {
      startSecretReveal(card, handIdx, targetPlayerIdx);
      return;
    }

    const isTargeted = targetPlayerIdx !== null && targetPlayerIdx !== undefined && targetPlayerIdx !== currentTurn;

    // Check if target is immune
    if (isTargeted && immunePlayers.has(targetPlayerIdx)) {
      addLog("🛡️", gameState.players[targetPlayerIdx].name, `was immune — the event fizzled!`);
      removeCardFromHand(handIdx);
      setPlayedCard(null);
      setShowPlayDialog(false);
      setPhase("resolve");
      setShowPerformanceBonus(true);
      return;
    }

    // Check for reaction window opportunity
    if (isTargeted) {
      const target = gameState.players[targetPlayerIdx];
      const validCounters = target.hand.filter(c => c.cardClass === 'action' && isCounterValid(c, card));
      if (validCounters.length > 0) {
        setCounterOpportunity({ card, handIdx, targetIdx: targetPlayerIdx });
        setPlayedCard(null);
        setShowPlayDialog(false);
        return;
      }
    }

    resolveEventCard(card, handIdx, targetPlayerIdx);
  };

  // Target passes on countering
  const resolveWithoutCounter = () => {
    if (!counterOpportunity) return;
    const { card, handIdx, targetIdx } = counterOpportunity;
    setCounterOpportunity(null);
    resolveEventCard(card, handIdx, targetIdx);
  };

  // Resolve climax vote
  const resolveClimaxVote = ({ chain, winnerId, winnerPlayer, counts }) => {
    // Award DP to winner
    if (winnerPlayer) {
      const winnerIdx = gameState.players.findIndex(p => (p.id || p.name) === (winnerPlayer.id || winnerPlayer.name));
      if (winnerIdx >= 0) {
        setGameState(prev => {
          const players = [...prev.players];
          players[winnerIdx] = { ...players[winnerIdx], dp: players[winnerIdx].dp + 3 };
          return { ...prev, players };
        });
        addLog("🗳️", winnerPlayer.name, `won the climax vote for "${chain.title}"!`, 3);
      }
    }
    // Mark chain as exploded or follow-up
    setDramaChains(prev => prev.map(c => {
      if (c.id !== chain.id) return c;
      return { ...c, status: chain.followUp ? 'resolved' : 'exploded' };
    }));
    // Create follow-up chain if applicable
    if (chain.followUp) {
      const followTemplate = { title: chain.followUp, emoji: "🌀", tags: chain.tags, touchTags: chain.touchTags, climaxType: "resolution", followUp: null };
      const newChain = {
        id: `chain_${Date.now()}_follow`,
        ...followTemplate,
        sourceCardName: chain.sourceCardName,
        instigatorId: chain.instigatorId,
        involvedPlayerIds: chain.involvedPlayerIds,
        intensity: 1,
        status: "active",
        escalationCount: 0,
        createdTurn: currentTurn,
        lastModifiedTurn: currentTurn,
        visibleToAll: true,
      };
      setDramaChains(prev => [...prev, newChain]);
      addLog("🔄", "The Story", `The drama transforms into: "${chain.followUp}"`);
    }
    setClimaxChain(null);
    setShowPerformanceBonus(true);
  };

  // Target plays a counter card
  const resolveCounterOpportunity = (counterCard, counterHandIdx) => {
    if (!counterOpportunity) return;
    const { card: pendingCard, handIdx: pendingHandIdx, targetIdx } = counterOpportunity;
    const instigatorIdx = currentTurn;

    if (!isCounterValid(counterCard, pendingCard)) return;

    if (counterCard.counterType === 'redirect') {
      setRedirectPickState({ counterCard, counterHandIdx, pendingCard, pendingHandIdx, targetIdx });
      setCounterOpportunity(null);
      return;
    }

    setGameState(prev => {
      const players = [...prev.players];
      // Remove counter card from target's hand
      const tp = { ...players[targetIdx] };
      tp.hand = tp.hand.filter((_, i) => i !== counterHandIdx);
      // Remove pending card from instigator's hand
      const ip = { ...players[instigatorIdx] };
      ip.hand = ip.hand.filter((_, i) => i !== pendingHandIdx);

      if (counterCard.counterType === 'negate') {
        if (counterCard.name === "Plot Twist!") {
          ip.dp = Math.max(0, ip.dp - 1);
          addLog("🌀", players[targetIdx].name, `countered "${pendingCard.name}" with Plot Twist! Instigator loses 1 DP!`);
        } else if (counterCard.name === "Oh No You Don't") {
          if (ip.hand.length > 0) ip.hand = ip.hand.slice(0, -1);
          addLog("🖐️", players[targetIdx].name, `blocked the High Drama! Instigator discards a card!`);
        } else if (counterCard.name === "Immunity Idol") {
          addLog("🛡️", players[targetIdx].name, `invoked Immunity Idol! "${pendingCard.name}" cancelled — immune this round!`);
          setImmunePlayers(prev2 => new Set([...prev2, targetIdx]));
        } else {
          addLog("🚫", players[targetIdx].name, `played "${counterCard.name}" — "${pendingCard.name}" cancelled!`);
        }
      } else if (counterCard.counterType === 'reflect') {
        if (counterCard.name === "Backfire!") {
          const penalty = pendingCard.dpTarget || 0;
          ip.dp = Math.max(0, ip.dp + penalty);
          addLog("💥", players[targetIdx].name, `reflected "${pendingCard.name}" back! Instigator gets ${penalty > 0 ? '+' : ''}${penalty} DP!`, penalty);
        } else if (counterCard.name === "Mirror Mirror") {
          ip.dp = Math.max(0, ip.dp + (pendingCard.dpTarget || 0));
          tp.dp = tp.dp + (pendingCard.dpInstigator || 0);
          addLog("🪞", players[targetIdx].name, `mirrored the ${pendingCard.type}! Roles reversed — you gain +${pendingCard.dpInstigator} DP!`, pendingCard.dpInstigator || 0);
        } else if (counterCard.name === "Karma's a Witch") {
          const doublePenalty = (pendingCard.dpTarget || 0) * 2;
          ip.dp = Math.max(0, ip.dp + doublePenalty);
          addLog("🔮", players[targetIdx].name, `karmic justice! Instigator gets double the penalty (${doublePenalty} DP)!`);
        }
      } else if (counterCard.counterType === 'expose') {
        // Counter-expose the instigator
        const unrevealed = (ip.secrets || []).filter(s => !(ip.revealedSecretIds || []).includes(s.id));
        if (unrevealed.length > 0) {
          const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
          ip.revealedSecretIds = [...(ip.revealedSecretIds || []), picked.id];
          ip.dp = Math.max(0, ip.dp - picked.penalty);
          addLog("🤫", players[targetIdx].name,
            `turned it around! Exposed ${players[instigatorIdx].name}'s secret: "${picked.name}"! (−${picked.penalty} DP)`);
        } else {
          addLog("🤫", players[targetIdx].name, `tried to expose ${players[instigatorIdx].name} but they have no secrets left!`);
        }
      }

      players[instigatorIdx] = ip;
      players[targetIdx] = tp;
      return { ...prev, players };
    });

    setCounterOpportunity(null);
    setPhase('resolve');
    setShowPerformanceBonus(true);
  };

  // Redirect: target picks new victim
  const resolveRedirect = (newTargetIdx) => {
    if (!redirectPickState) return;
    const { counterCard, counterHandIdx, pendingCard, pendingHandIdx, targetIdx } = redirectPickState;

    // Remove counter from original target's hand
    setGameState(prev => {
      const players = [...prev.players];
      const tp = { ...players[targetIdx] };
      tp.hand = tp.hand.filter((_, i) => i !== counterHandIdx);
      players[targetIdx] = tp;
      return { ...prev, players };
    });

    addLog(counterCard.emoji, gameState.players[targetIdx].name,
      `redirected "${pendingCard.name}" to ${gameState.players[newTargetIdx].name}!`);

    setRedirectPickState(null);
    resolveEventCard(pendingCard, pendingHandIdx, newTargetIdx);
  };

  // Resolve a proactive/both-timing action
  const resolveAction = (card, handIdx, targetChainId = null, targetPlayerIdx = null) => {
    if (!card) return;
    const ae = card.actionEffect;
    removeCardFromHand(handIdx);

    if (ae === 'pour_gasoline' && targetChainId) {
      setDramaChains(prev => prev.map(c => {
        if (c.id !== targetChainId) return c;
        const newIntensity = Math.min(c.intensity + 1, 3);
        addLog(card.emoji, currentPlayer.name, `poured gasoline on "${c.title}"! Intensity now ${newIntensity}`);
        return { ...c, intensity: newIntensity, status: newIntensity === 3 ? 'unstable' : c.status, escalationCount: c.escalationCount + 1 };
      }));
      checkClimaxTrigger();

    } else if (ae === 'change_narrative' && targetChainId) {
      setDramaChains(prev => prev.map(c => {
        if (c.id !== targetChainId) return c;
        const involved = [...c.involvedPlayerIds];
        const newInstigatorId = involved.find(id => id !== c.instigatorId) || c.instigatorId;
        addLog(card.emoji, currentPlayer.name, `changed the narrative of "${c.title}" — roles reversed!`);
        return { ...c, instigatorId: newInstigatorId };
      }));

    } else if ((ae === 'drag_them_in' || ae === 'youre_involved_now') && targetChainId && targetPlayerIdx !== null) {
      const targetId = gameState.players[targetPlayerIdx]?.id || gameState.players[targetPlayerIdx]?.name;
      setDramaChains(prev => prev.map(c => {
        if (c.id !== targetChainId) return c;
        if (c.involvedPlayerIds.includes(targetId)) return c;
        addLog(card.emoji, currentPlayer.name, `dragged ${gameState.players[targetPlayerIdx].name} into "${c.title}"!`);
        return { ...c, involvedPlayerIds: [...c.involvedPlayerIds, targetId] };
      }));
      applyStateToPlayer(targetPlayerIdx, 'Entangled');

    } else if (ae === 'deny_everything') {
      const negativeStates = ['Exposed', 'Humiliated', 'Disgraced', 'Blackmailed'];
      setGameState(prev => {
        const players = [...prev.players];
        const p = { ...players[currentTurn] };
        p.states = [...(p.states || []).filter(s => !negativeStates.includes(s)), 'Suspected'];
        players[currentTurn] = p;
        return { ...prev, players };
      });
      addLog(card.emoji, currentPlayer.name, 'denied everything — negative states cleared, now Suspected');

    } else if (ae === 'everyone_watching' && targetChainId) {
      setDramaChains(prev => prev.map(c => c.id === targetChainId ? { ...c, amplified: true } : c));
      addLog(card.emoji, currentPlayer.name, `everyone's watching — all DP doubled at resolution!`);

    } else if (ae === 'behind_closed_doors' && targetChainId) {
      setDramaChains(prev => prev.map(c => c.id === targetChainId ? { ...c, status: 'paused', pausedTurn: currentTurn } : c));
      addLog(card.emoji, currentPlayer.name, `locked the chain behind closed doors for 1 turn!`);

    } else if (ae === 'flip_the_script' && targetChainId) {
      setDramaChains(prev => prev.map(c => c.id === targetChainId ? { ...c, flipScriptBy: currentPlayer.id || currentPlayer.name } : c));
      addLog(card.emoji, currentPlayer.name, `flipped the script — they control who gains DP at climax!`);

    } else if (ae === 'twist_the_knife' && targetPlayerIdx !== null) {
      // Fixed: escalate chains directly without passing null card to touchChains
      const targetP = gameState.players[targetPlayerIdx];
      const negativeStates = ['Exposed', 'Humiliated', 'Disgraced', 'Blackmailed', 'Heartbroken', 'Suspected'];
      if ((targetP.states || []).some(s => negativeStates.includes(s))) {
        const targetId = targetP.id || targetP.name;
        setDramaChains(prev => prev.map(chain => {
          if (chain.status === 'resolved' || chain.status === 'suppressed') return chain;
          if (!chain.involvedPlayerIds.includes(targetId)) return chain;
          // Escalate twice
          const newEscCount = chain.escalationCount + 2;
          let newIntensity = chain.intensity;
          if (newEscCount >= 2 && newIntensity < 2) newIntensity = 2;
          if (newEscCount >= 3 && newIntensity < 3) newIntensity = 3;
          const newStatus = newIntensity === 3 ? 'unstable' : chain.status;
          return { ...chain, escalationCount: newEscCount, intensity: newIntensity, status: newStatus, lastModifiedTurn: currentTurn };
        }));
        addLog(card.emoji, currentPlayer.name, `twisted the knife on ${targetP.name} — chains escalate twice!`);
        checkClimaxTrigger();
      } else {
        addLog(card.emoji, currentPlayer.name, `tried to twist the knife on ${targetP.name} but they have no negative states!`);
      }

    } else if (ae === 'play_the_victim') {
      applyStateToPlayer(currentTurn, 'Protected');
      addLog(card.emoji, currentPlayer.name, 'played the victim — Protected state gained!');

    } else if (ae === 'leak_to_press' && targetChainId) {
      setDramaChains(prev => prev.map(c => {
        if (c.id !== targetChainId) return c;
        const newIntensity = Math.min(c.intensity + 1, 3);
        addLog(card.emoji, currentPlayer.name, `leaked the chain to the press! Intensity +1`);
        return { ...c, intensity: newIntensity, status: newIntensity === 3 ? 'unstable' : c.status };
      }));
      checkClimaxTrigger();

    } else if (ae === 'blow_it_wide_open' && targetChainId) {
      // Fixed: batch all player updates into a single setGameState call
      const chain = dramaChains.find(c => c.id === targetChainId);
      if (chain) {
        setGameState(prev => {
          const players = [...prev.players];
          const logEntries = [];
          chain.involvedPlayerIds.forEach(pid => {
            const pidx = players.findIndex(p => (p.id || p.name) === pid);
            if (pidx < 0) return;
            const p = { ...players[pidx] };
            const unrevealed = (p.secrets || []).filter(s => !(p.revealedSecretIds || []).includes(s.id));
            if (unrevealed.length === 0) return;
            p.revealedSecretIds = [...(p.revealedSecretIds || []), ...unrevealed.map(s => s.id)];
            p.dp = Math.max(0, p.dp - unrevealed.reduce((sum, s) => sum + s.penalty, 0));
            players[pidx] = p;
            logEntries.push(`${p.name} (${unrevealed.map(s => s.name).join(', ')})`);
          });
          if (logEntries.length > 0) {
            addLog('💣', currentPlayer.name, `blew all secrets wide open! Exposed: ${logEntries.join(' | ')}`);
          } else {
            addLog('💣', currentPlayer.name, `blew it wide open but everyone's secrets were already out!`);
          }
          return { ...prev, players };
        });
      }

    } else if (card.name === 'Immunity Idol') {
      setImmunePlayers(prev => new Set([...prev, currentTurn]));
      addLog('🛡️', currentPlayer.name, 'played Immunity Idol — immune to all events this turn!');

    } else if (card.counterType === 'expose' && targetPlayerIdx !== null) {
      const tp = gameState.players[targetPlayerIdx];
      const unrevealed = (tp.secrets || []).filter(s => !(tp.revealedSecretIds || []).includes(s.id));
      const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      if (picked) {
        setGameState(prev => {
          const players = [...prev.players];
          const t = { ...players[targetPlayerIdx] };
          t.revealedSecretIds = [...(t.revealedSecretIds || []), picked.id];
          t.dp = Math.max(0, t.dp - picked.penalty);
          players[targetPlayerIdx] = t;
          return { ...prev, players };
        });
        addLog('🤫', currentPlayer.name, `exposed ${tp.name}'s secret: "${picked.name}"! (−${picked.penalty} DP)`);
      }

    } else {
      addLog(card.emoji, currentPlayer.name, `played Action: "${card.name}"`);
    }

    setShowActionDialog(false);
    setPendingAction(null);
    setPhase('resolve');
    setShowPerformanceBonus(true);
  };

  // Proactive counter play (Immunity Idol = protect self; Expose = pick target; others = warn)
  const resolveProactiveCounter = (targetIdx = null) => {
    if (!proactiveCounter) return;
    const { card, handIdx } = proactiveCounter;

    if (card.name === "Immunity Idol") {
      removeCardFromHand(handIdx);
      setImmunePlayers(prev => new Set([...prev, currentTurn]));
      addLog("🛡️", currentPlayer.name, "played Immunity Idol — immune to all events this turn!");
      setShowProactiveCounterDialog(false);
      setProactiveCounter(null);
      setPhase("resolve");
      setShowPerformanceBonus(true);
      return;
    }

    if (card.counterType === 'expose' && targetIdx !== null) {
      setGameState(prev => {
        const players = [...prev.players];
        const cp = { ...players[currentTurn] };
        cp.hand = cp.hand.filter((_, i) => i !== handIdx);
        players[currentTurn] = cp;
        const tp = { ...players[targetIdx] };
        const unrevealed = (tp.secrets || []).filter(s => !(tp.revealedSecretIds || []).includes(s.id));
        const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        if (picked) {
          tp.revealedSecretIds = [...(tp.revealedSecretIds || []), picked.id];
          tp.dp = Math.max(0, tp.dp - picked.penalty);
          players[targetIdx] = tp;
          addLog("🤫", currentPlayer.name, `exposed ${players[targetIdx].name}'s secret: "${picked.name}"! (−${picked.penalty} DP)`);
        }
        return { ...prev, players };
      });
      setShowProactiveCounterDialog(false);
      setProactiveCounter(null);
      setPhase("resolve");
      setShowPerformanceBonus(true);
      return;
    }

    // Reactive-only actions used proactively — just inform
    addLog(card.emoji, currentPlayer.name, `kept "${card.name}" ready to use in the reaction window (play when targeted)`);
    setShowProactiveCounterDialog(false);
    setProactiveCounter(null);
  };

  // Pile-on: next player jumps into the chain
  const playPileOnCard = (card, handIdx) => {
    if (!pileOnPlayerIdx === null) return;
    const pilePlayer = gameState.players[pileOnPlayerIdx];
    const isMismatch = checkMismatch(pilePlayer.character, currentLocation);
    const mismatchDP = isMismatch ? 1 : 0;
    const newCount = (eventChain?.count || 1) + 1;
    const chainBonus = getChainBonus(newCount);
    const locBonus = getLocationTypeBonus(card, currentLocation);
    setEventChain(prev => ({ ...prev, count: newCount }));
    const total = card.dpInstigator + chainBonus + mismatchDP + locBonus - (card.cost || 0);
    setGameState(prev => {
      const players = [...prev.players];
      const pp = { ...players[pileOnPlayerIdx] };
      pp.hand = pp.hand.filter((_, i) => i !== handIdx);
      pp.dp = pp.dp + total;
      players[pileOnPlayerIdx] = pp;
      return { ...prev, players };
    });
    addLog(card.emoji, pilePlayer.name,
      `piled on with "${card.name}"! Chain ×${newCount}`, total);
    setShowPileOnDialog(false);
    setPileOnPlayerIdx(null);
    setShowPerformanceBonus(true);
  };

  const skipPileOn = () => {
    setShowPileOnDialog(false);
    setPileOnPlayerIdx(null);
    setShowPerformanceBonus(true);
  };

  // Performance bonus
  const givePerformanceBonus = (yes) => {
    if (yes) {
      setGameState(prev => {
        const players = [...prev.players];
        players[currentTurn] = { ...players[currentTurn], dp: players[currentTurn].dp + 1 };
        return { ...prev, players };
      });
      addLog("🎭", currentPlayer.name, "earned a performance bonus!", 1);
    }
    setShowPerformanceBonus(false);
    checkWinCondition();
  };

  const changeLocation = () => {
    if (locationDeck.length === 0) return;
    const newDeck = [...locationDeck];
    const newLoc = newDeck.shift();
    setLocationDeck(newDeck);
    setCurrentLocation(newLoc);
    setEventChain(null);
    setSceneHistory(prev => [...prev, { location: newLoc, events: [], title: "", notes: "" }]);
    addLog("📍", currentPlayer.name, `moved the scene to ${newLoc.name} ${newLoc.emoji}`);
    setShowLocationDialog(false);
    setPhase("resolve");
    setShowPerformanceBonus(true);
  };

  const passTurn = () => {
    addLog("⏭️", currentPlayer.name, "passed their turn");
    endTurn();
  };

  const peekAspiration = () => setShowAspirationPeek(true);

  const revealAspiration = () => {
    const newDp = currentPlayer.dp + currentPlayer.dream.reward;
    setGameState(prev => {
      const players = [...prev.players];
      const cp = { ...players[currentTurn] };
      cp.dreamRevealed = true;
      cp.dp = newDp;
      players[currentTurn] = cp;
      return { ...prev, players };
    });
    addLog("🔮", currentPlayer.name, `achieved their aspiration: "${currentPlayer.dream.name}"!`, currentPlayer.dream.reward);
    setShowAspirationDialog(false);
    if (newDp >= targetDP) {
      setWinner({ ...currentPlayer, dp: newDp });
      setShowWinDialog(true);
    } else {
      setShowPerformanceBonus(true);
    }
  };

  const checkWinCondition = () => {
    const w = gameState?.players?.find(p => p.dp >= targetDP);
    if (w) {
      setWinner(w);
      setShowWinDialog(true);
    } else {
      endTurn();
    }
  };

  const endTurn = () => {
    setCurrentTurn(prev => (prev + 1) % (gameState?.players?.length || 1));
    setPhase("draw");
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="rounded-full font-body gap-2 text-xs">
              <ArrowLeft className="w-4 h-4" /> Exit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setShowRecap(true)} className="rounded-full font-body gap-2 text-xs">
            <ScrollText className="w-3.5 h-3.5" /> Scene Recap
          </Button>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/30 font-body text-xs">
              {gameState.mode === 'quick' ? '⚡ Quick-Play' : '🎬 Full-Length'}
            </Badge>
            <Badge variant="outline" className="font-body text-xs">
              🃏 {eventDeck.length} cards left
            </Badge>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-4">
          {/* Sidebar */}
          <div className="space-y-4">
            <ScoreBoard players={gameState.players} currentTurn={currentTurn} targetDP={targetDP} />

            {/* Current Scene — full details */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-accent" />
                Current Scene
              </h3>
              {currentLocation && (
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl shrink-0">{currentLocation.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold text-foreground leading-tight">{currentLocation.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentLocation.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 border-accent/40 text-accent font-body">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground leading-snug italic">
                    {currentLocation.description}
                  </p>
                  <div className="bg-accent/10 rounded-lg px-3 py-2 border border-accent/20">
                    <p className="font-body text-[11px] text-accent leading-snug font-medium">
                      📍 Scene Effect:
                    </p>
                    <p className="font-body text-[11px] text-accent/80 leading-snug mt-0.5">
                      {currentLocation.effect}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <ActiveChains chains={dramaChains} players={gameState.players} />
            <GameLog log={gameLog} />
          </div>

          {/* Main Content */}
          <div className="space-y-4">
          <ChainTracker chain={eventChain} />
            {/* Current Player Banner */}
            <motion.div
              key={currentTurn}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 via-card to-accent/10 rounded-2xl border border-primary/20 p-5"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentPlayer.character.emoji}</span>
                  <div>
                    <p className="font-body text-xs text-primary uppercase tracking-wider">
                      {phase === 'draw' ? '🎴 Draw Phase' : phase === 'main' ? '🎬 Main Phase' : '✨ Resolve'}
                    </p>
                    <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                      {parsePlayerName(currentPlayer.name).displayName}'s Turn
                      {parsePlayerName(currentPlayer.name).secretRole && (
                        <span className="font-body text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                          {parsePlayerName(currentPlayer.name).secretRole}
                        </span>
                      )}
                    </h2>
                    <p className="font-body text-xs text-muted-foreground">
                      {currentPlayer.character.name} • {currentPlayer.dp} DP
                      {immunePlayers.has(currentTurn) && <span className="ml-2 text-emerald-400">🛡️ Immune</span>}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {phase === "draw" && (
                    <Button onClick={drawCard} className="gap-2 rounded-full font-body text-sm">
                      <Shuffle className="w-4 h-4" /> Draw Card
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={peekAspiration} className="gap-1.5 rounded-full font-body text-xs border border-border">
                    <Eye className="w-3.5 h-3.5" /> My Aspiration
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSecretPeek(true)} className="gap-1.5 rounded-full font-body text-xs border border-border">
                    <Eye className="w-3.5 h-3.5" /> My Secret
                  </Button>
                  {phase === "main" && (
                    <>
                      <Button variant="outline" onClick={() => setShowLocationDialog(true)} className="gap-2 rounded-full font-body text-xs">
                        <MapPin className="w-3.5 h-3.5" /> Change Scene
                      </Button>
                      <Button variant="outline" onClick={() => setShowAspirationDialog(true)} className="gap-2 rounded-full font-body text-xs">
                        <Star className="w-3.5 h-3.5" /> Claim Aspiration
                      </Button>
                      <Button variant="ghost" onClick={passTurn} className="gap-2 rounded-full font-body text-xs">
                        <SkipForward className="w-3.5 h-3.5" /> Pass
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Info strip */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">Your Character</p>
                <CharacterCard character={currentPlayer.character} compact />
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">🔮 Aspiration <span className="text-primary/60">(Season)</span></p>
                <DreamCard dream={currentPlayer.dream} revealed={currentPlayer.dreamRevealed} compact />
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">🔒 Secret <span className="text-destructive/60">(Scene)</span></p>
                <SecretCard secret={currentPlayer.secrets?.[0]} revealed={currentPlayer.revealedSecretIds?.includes(currentPlayer.secrets?.[0]?.id)} compact />
              </div>
            </div>

            {/* Hand */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-foreground">
                  Your Hand ({currentPlayer.hand.length} cards)
                </h3>
                {phase === "main" && (
                  <p className="font-body text-xs text-primary animate-pulse">Click a card to play it!</p>
                )}
              </div>
              <PlayerHand
                hand={currentPlayer.hand}
                onPlayCard={playEventCard}
                disabled={phase !== "main"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Pile-On Dialog */}
      <Dialog open={showPileOnDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              🔥 Pile On! {gameState?.players?.[pileOnPlayerIdx]?.name}, you can escalate!
            </DialogTitle>
            <DialogDescription className="font-body text-sm">
              There's a live <span className="font-bold text-primary">{eventChain?.eventType}</span> chain going.
              Play a matching card right now to jump in and steal some DP — or let it slide.
            </DialogDescription>
          </DialogHeader>
          {pileOnPlayerIdx !== null && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <span>🔗</span>
                <p className="font-body text-xs text-amber-400">
                  Chain ×{eventChain?.count} — next escalation bonus: <span className="font-bold">+{getChainBonus((eventChain?.count || 1) + 1)} DP</span>
                </p>
              </div>
              <p className="font-body text-xs text-muted-foreground mb-2">Your matching cards:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gameState.players[pileOnPlayerIdx]?.hand
                  .map((c, i) => ({ c, i }))
                  .filter(({ c }) => c.cardClass !== 'action' && c.type === eventChain?.eventType)
                  .map(({ c, i }) => (
                    <EventCard key={i} event={c} onClick={() => playPileOnCard(c, i)} />
                  ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={skipPileOn} className="font-body rounded-full">Pass — skip it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Play Event Dialog */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="bg-card border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {playedCard?.card.emoji} Play "{playedCard?.card.name}"?
            </DialogTitle>
            <DialogDescription className="font-body text-sm">
              {playedCard?.card.effect}
            </DialogDescription>
          </DialogHeader>

          {playedCard?.card.cost > 0 && (
            <p className="font-body text-sm text-destructive">
              This costs {playedCard.card.cost} DP to play.
            </p>
          )}

          {/* Chain/location preview */}
          {(() => {
            const card = playedCard?.card;
            if (!card) return null;
            const sameChain = eventChain && eventChain.locationId === currentLocation?.id && eventChain.eventType === card.type;
            const chainCount = sameChain ? eventChain.count + 1 : 1;
            const chainBonus = getChainBonus(chainCount);
            const locBonus = getLocationTypeBonus(card, currentLocation);
            const subAction = getSubAction(card, currentLocation);
            return (
              <div className="space-y-2">
                {chainCount > 1 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="text-base">🔗</span>
                    <p className="font-body text-xs text-amber-400">
                      <span className="font-bold">{card.type} Chain ×{chainCount}</span> — +{chainBonus} DP escalation bonus
                    </p>
                  </div>
                )}
                {locBonus > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
                    <span className="text-base">📍</span>
                    <p className="font-body text-xs text-accent">
                      <span className="font-bold">{currentLocation?.name}</span> amplifies this {card.type}: +1 DP
                    </p>
                  </div>
                )}
                {subAction && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
                    <span className="text-base shrink-0">✨</span>
                    <p className="font-body text-xs text-violet-400">
                      <span className="font-bold">Scene Sub-Action:</span> {subAction.desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Target picker */}
          {(playedCard?.card.secretReveal || playedCard?.card.dpTarget !== 0) && gameState?.players?.length > 1 && (
            <div className="space-y-1">
              <p className="font-body text-xs text-muted-foreground">
                {playedCard?.card.secretReveal ? 'Choose a target to expose:' : 'Choose a target player:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {gameState.players.map((p, i) => i !== currentTurn && (
                  <Button key={i} size="sm" variant="outline" onClick={() => confirmPlayCard(i)}
                    className="font-body rounded-full text-xs gap-1">
                    {p.character.emoji} {p.name}
                    {immunePlayers.has(i) && <span className="text-emerald-400">🛡️</span>}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowPlayDialog(false)} className="font-body rounded-full">Cancel</Button>
            <Button onClick={() => confirmPlayCard(null)} className="font-body rounded-full">Play Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proactive Counter Dialog */}
      <Dialog open={showProactiveCounterDialog} onOpenChange={setShowProactiveCounterDialog}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {proactiveCounter?.card.emoji} {proactiveCounter?.card.name}
            </DialogTitle>
            <DialogDescription className="font-body text-sm">
              {proactiveCounter?.card.effect}
            </DialogDescription>
          </DialogHeader>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium border ${
            proactiveCounter?.card.counterType === 'negate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
            proactiveCounter?.card.counterType === 'redirect' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
            proactiveCounter?.card.counterType === 'reflect' ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' :
            'bg-destructive/10 text-destructive border-destructive/30'
          }`}>
            {proactiveCounter?.card.counterType === 'negate' ? '🚫 Negate' :
             proactiveCounter?.card.counterType === 'redirect' ? '↩️ Redirect' :
             proactiveCounter?.card.counterType === 'reflect' ? '🪞 Reflect' : '🤫 Expose'}
          </div>

          {proactiveCounter?.card.name === 'Immunity Idol' && (
            <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="font-body text-xs text-emerald-400">Grants you immunity to all targeted events this turn.</p>
            </div>
          )}

          {proactiveCounter?.card.counterType === 'reflect' || proactiveCounter?.card.counterType === 'redirect' || (proactiveCounter?.card.counterType === 'negate' && proactiveCounter?.card.name !== 'Immunity Idol') ? (
            <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="font-body text-xs text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
                This is a <strong>reactive counter</strong> — it's most powerful when played during the counter window after being targeted. Keep it in hand to counter opponents!
              </p>
            </div>
          ) : null}

          {proactiveCounter?.card.counterType === 'expose' && (
            <div className="space-y-1">
              <p className="font-body text-xs text-muted-foreground">Choose whose secret to expose:</p>
              <div className="flex flex-wrap gap-2">
                {gameState?.players?.map((p, i) => i !== currentTurn && (
                  <Button key={i} size="sm" variant="outline"
                    onClick={() => resolveProactiveCounter(i)}
                    className="font-body rounded-full text-xs gap-1">
                    {p.character.emoji} {p.name}
                    {p.revealedSecretIds?.length === p.secrets?.length ? ' (all exposed)' : ''}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => { setShowProactiveCounterDialog(false); setProactiveCounter(null); }}
              className="font-body rounded-full">Cancel</Button>
            {proactiveCounter?.card.name === 'Immunity Idol' && (
              <Button onClick={() => resolveProactiveCounter()} className="font-body rounded-full gap-2">
                🛡️ Activate Immunity
              </Button>
            )}
            {(proactiveCounter?.card.counterType === 'reflect' || proactiveCounter?.card.counterType === 'redirect' ||
              (proactiveCounter?.card.counterType === 'negate' && proactiveCounter?.card.name !== 'Immunity Idol')) && (
              <Button variant="outline" onClick={() => { setShowProactiveCounterDialog(false); setProactiveCounter(null); }}
                className="font-body rounded-full">Hold it for later</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Window Dialog */}
      <Dialog open={showActionDialog} onOpenChange={() => { setShowActionDialog(false); setPendingAction(null); }}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {pendingAction?.card.emoji} {pendingAction?.card.name}
            </DialogTitle>
            <DialogDescription className="font-body text-sm">{pendingAction?.card.effect}</DialogDescription>
          </DialogHeader>
          {pendingAction && (() => {
            const card = pendingAction.card;
            const activeChains = dramaChains.filter(c => c.status === 'active' || c.status === 'unstable');
            const needsChain = ['chain','chain_player'].includes(card.target);
            const needsPlayer = ['player','chain_player'].includes(card.target);
            const isSelf = card.target === 'self';
            if (isSelf) return (
              <div className="space-y-3">
                <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="font-body text-xs text-primary">This action targets yourself. No additional selection needed.</p>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="ghost" onClick={() => { setShowActionDialog(false); setPendingAction(null); }} className="font-body rounded-full">Cancel</Button>
                  <Button onClick={() => resolveAction(card, pendingAction.handIdx)} className="font-body rounded-full gap-2"><Zap className="w-4 h-4" /> Execute</Button>
                </DialogFooter>
              </div>
            );
            if (needsChain && activeChains.length === 0) return (
              <div>
                <p className="font-body text-sm text-muted-foreground py-2">No active storylines to target. Play an Event first to create chains.</p>
                <DialogFooter className="mt-2">
                  <Button variant="ghost" onClick={() => { setShowActionDialog(false); setPendingAction(null); }} className="font-body rounded-full">Cancel</Button>
                </DialogFooter>
              </div>
            );
            return (
              <div className="space-y-4">
                {needsChain && (
                  <div>
                    <p className="font-body text-xs text-muted-foreground mb-2 font-medium">Target a storyline:</p>
                    <div className="space-y-2">
                      {activeChains.map(chain => (
                        <button key={chain.id}
                          onClick={() => {
                            if (!needsPlayer) resolveAction(card, pendingAction.handIdx, chain.id);
                            else setPendingAction(prev => ({ ...prev, selectedChainId: chain.id }));
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                            pendingAction.selectedChainId === chain.id ? 'bg-primary/10 border-primary/50' : 'bg-muted border-border hover:border-primary/30'
                          }`}>
                          <div className="flex items-center gap-2">
                            <span>{chain.emoji}</span>
                            <span className="font-body text-sm font-medium text-foreground">{chain.title}</span>
                            <span className="font-body text-[10px] text-muted-foreground ml-auto">Intensity {chain.intensity}/3</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {needsPlayer && pendingAction.selectedChainId && (
                  <div>
                    <p className="font-body text-xs text-muted-foreground mb-2 font-medium">Choose a player to involve:</p>
                    <div className="flex flex-wrap gap-2">
                      {gameState.players.map((p, i) => i !== currentTurn && (
                        <Button key={i} size="sm" variant="outline" onClick={() => resolveAction(card, pendingAction.handIdx, pendingAction.selectedChainId, i)} className="font-body rounded-full text-xs gap-1">
                          {p.character.emoji} {p.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {needsPlayer && !needsChain && (
                  <div>
                    <p className="font-body text-xs text-muted-foreground mb-2 font-medium">Choose a target player:</p>
                    <div className="flex flex-wrap gap-2">
                      {gameState.players.map((p, i) => i !== currentTurn && (
                        <Button key={i} size="sm" variant="outline" onClick={() => resolveAction(card, pendingAction.handIdx, null, i)} className="font-body rounded-full text-xs gap-1">
                          {p.character.emoji} {p.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="ghost" onClick={() => { setShowActionDialog(false); setPendingAction(null); }} className="font-body rounded-full">Cancel</Button>
                </DialogFooter>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Reaction Window — shown to TARGET player */}
      <Dialog open={!!counterOpportunity} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">⚔️ Reaction Window!</DialogTitle>
            <DialogDescription className="font-body text-sm">
              <span className="font-bold text-foreground">{counterOpportunity && gameState.players[counterOpportunity.targetIdx]?.name}</span>
              {" — you're being targeted by "}
              <span className="text-destructive font-bold">"{counterOpportunity?.card.name}"</span>
              ! Play a Reactive Action to respond, or let it resolve.
            </DialogDescription>
          </DialogHeader>
          {counterOpportunity && (
            <>
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                <p className="font-body text-xs text-destructive font-bold mb-1">Incoming Event:</p>
                <p className="font-body text-sm text-foreground font-medium">{counterOpportunity.card.emoji} {counterOpportunity.card.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{counterOpportunity.card.effect}</p>
                <div className="flex gap-2 mt-2">
                  {counterOpportunity.card.dpInstigator > 0 && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-body">Attacker: +{counterOpportunity.card.dpInstigator} DP</Badge>
                  )}
                  {counterOpportunity.card.dpTarget !== 0 && (
                    <Badge className={`text-[10px] font-body ${counterOpportunity.card.dpTarget > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}>
                      You: {counterOpportunity.card.dpTarget > 0 ? '+' : ''}{counterOpportunity.card.dpTarget} DP
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2 font-medium">
                  {gameState.players[counterOpportunity.targetIdx]?.name}'s Reactive Actions:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gameState.players[counterOpportunity.targetIdx]?.hand.map((c, i) => {
                    const valid = isCounterValid(c, counterOpportunity.card);
                    const isReactive = c.cardClass === 'action' && (c.timing === 'reactive' || c.timing === 'both');
                    return (
                      <div key={i} className={`relative ${!isReactive ? 'opacity-25 pointer-events-none' : !valid ? 'opacity-40' : ''}`}>
                        <EventCard event={c} onClick={() => valid && isReactive && resolveCounterOpportunity(c, i)} disabled={!valid || !isReactive} small />
                        {isReactive && !valid && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[9px] bg-background/80 px-1.5 py-0.5 rounded text-muted-foreground font-body">Wrong type</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={resolveWithoutCounter} className="font-body rounded-full">Pass — Let it resolve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redirect Pick Dialog */}
      <Dialog open={!!redirectPickState} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              ↩️ Redirect — Choose New Target
            </DialogTitle>
            <DialogDescription className="font-body text-sm">
              {redirectPickState && gameState.players[redirectPickState.targetIdx]?.name}, 
              pick who "{redirectPickState?.pendingCard.name}" hits instead.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-2">
            {gameState?.players?.map((p, i) => {
              if (!redirectPickState) return null;
              // Can't redirect back to original target or to the instigator (or self if target)
              if (i === redirectPickState.targetIdx) return null;
              return (
                <Button key={i} variant="outline" onClick={() => resolveRedirect(i)}
                  className="font-body rounded-full gap-1">
                  {p.character.emoji} {p.name}
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Performance Bonus Dialog */}
      <Dialog open={showPerformanceBonus} onOpenChange={() => givePerformanceBonus(false)}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">🎭 Performance Bonus!</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Did {currentPlayer?.name} deliver that scene with melodramatic flair?
              <br />Vote: Does {currentPlayer?.name} deserve +1 DP for acting?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => givePerformanceBonus(false)} className="font-body rounded-full">
              Nah, they phoned it in
            </Button>
            <Button onClick={() => givePerformanceBonus(true)} className="font-body rounded-full gap-2">
              <Award className="w-4 h-4" /> Award +1 DP!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">📍 Change Scene Location</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Draw a new random location to move the story.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={changeLocation} className="font-body rounded-full gap-2">
            <MapPin className="w-4 h-4" /> Draw New Location
          </Button>
        </DialogContent>
      </Dialog>

      {/* Secret Peek Dialog */}
      <Dialog open={showSecretPeek} onOpenChange={setShowSecretPeek}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">🔒 Your Dark Secrets</DialogTitle>
            <DialogDescription className="font-body text-sm">Scene secrets — hidden facts that can be exposed this scene.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {currentPlayer?.secrets?.map(s => {
              const revealed = currentPlayer.revealedSecretIds?.includes(s.id);
              return <SecretCard key={s.id} secret={s} revealed={revealed || true} peekable={false} />;
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSecretPeek(false)} className="font-body rounded-full">Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aspiration Peek Dialog */}
      <Dialog open={showAspirationPeek} onOpenChange={setShowAspirationPeek}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">🔮 Your Aspiration</DialogTitle>
            <DialogDescription className="font-body text-sm">Your season-long goal. Achieve the condition at any point to claim your DP reward.</DialogDescription>
          </DialogHeader>
          <DreamCard dream={currentPlayer?.dream} revealed />
          {currentPlayer?.dreamRevealed && (
            <p className="font-body text-xs text-primary">✓ You've already claimed this aspiration!</p>
          )}
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowAspirationPeek(false)} className="font-body rounded-full">Close</Button>
            {!currentPlayer?.dreamRevealed && phase === 'main' && (
              <Button onClick={() => { setShowAspirationPeek(false); setShowAspirationDialog(true); }} className="font-body rounded-full gap-2">
                <Sparkles className="w-4 h-4" /> Claim It!
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secret Reveal Flow Dialogs */}
      {secretRevealState && (() => {
        const { tier, targetIdx, instigatorIdx, handIdx, card, phase: srPhase, targetChoices } = secretRevealState;
        const target = gameState.players[targetIdx];
        const instigator = gameState.players[instigatorIdx];
        const unrevealed = target?.secrets?.filter(s => !target.revealedSecretIds?.includes(s.id)) || [];

        if (tier === 'low') return (
          <Dialog open onOpenChange={() => {}}>
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{card.emoji} {target?.name}: Pick Your Poison</DialogTitle>
                <DialogDescription className="font-body text-sm">
                  <span className="text-primary font-bold">{target?.name}</span>, choose which secret to reveal.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {unrevealed.map(s => (
                  <button key={s.id} onClick={() => resolveSecretExpose(targetIdx, s, handIdx, card)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-muted/70 border border-border hover:border-primary/40 transition-all">
                    <span className="text-lg mr-2">{s.emoji}</span>
                    <span className="font-body text-sm font-medium text-foreground">{s.name}</span>
                    <span className="font-body text-xs text-destructive ml-2">−{s.penalty} DP</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        );

        if (tier === 'medium' && srPhase === 'target_picks') return (
          <Dialog open onOpenChange={() => {}}>
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{card.emoji} {target?.name}: Offer Two Secrets</DialogTitle>
                <DialogDescription className="font-body text-sm">
                  <span className="text-primary font-bold">{target?.name}</span>: pick 2 secrets. Then {instigator?.name} chooses which to expose.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {unrevealed.map(s => {
                  const chosen = (targetChoices || []).find(c => c.id === s.id);
                  const chosenCount = (targetChoices || []).length;
                  return (
                    <button key={s.id}
                      disabled={!chosen && chosenCount >= 2}
                      onClick={() => {
                        const cur = targetChoices || [];
                        const next = chosen ? cur.filter(c => c.id !== s.id) : [...cur, s];
                        setSecretRevealState(prev => ({ ...prev, targetChoices: next }));
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        chosen ? 'bg-primary/10 border-primary/50' : 'bg-muted border-border hover:border-primary/30'
                      } disabled:opacity-40`}>
                      <span className="text-lg mr-2">{s.emoji}</span>
                      <span className="font-body text-sm font-medium text-foreground">{s.name}</span>
                      <span className="font-body text-xs text-destructive ml-2">−{s.penalty} DP</span>
                      {chosen && <span className="ml-2 text-primary text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
              <DialogFooter>
                <Button disabled={!targetChoices || targetChoices.length < Math.min(2, unrevealed.length)}
                  onClick={() => setSecretRevealState(prev => ({ ...prev, phase: 'instigator_picks' }))}
                  className="font-body rounded-full">Confirm Choices</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );

        if (tier === 'medium' && srPhase === 'instigator_picks') return (
          <Dialog open onOpenChange={() => {}}>
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{card.emoji} {instigator?.name}: Choose What to Expose</DialogTitle>
                <DialogDescription className="font-body text-sm">
                  <span className="text-primary font-bold">{instigator?.name}</span>: pick one of {target?.name}'s offered secrets.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {(targetChoices || []).map(s => (
                  <button key={s.id} onClick={() => resolveSecretExpose(targetIdx, s, handIdx, card)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-primary/10 border border-border hover:border-primary/50 transition-all">
                    <span className="text-lg mr-2">{s.emoji}</span>
                    <span className="font-body text-sm font-medium text-foreground">{s.name}</span>
                    <span className="font-body text-xs text-destructive ml-2">−{s.penalty} DP</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        );

        return null;
      })()}

      {/* Aspiration Reveal Dialog */}
      <Dialog open={showAspirationDialog} onOpenChange={setShowAspirationDialog}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">🔮 Claim Your Aspiration?</DialogTitle>
          </DialogHeader>
          {currentPlayer?.dream && !currentPlayer?.dreamRevealed ? (
            <>
              <DreamCard dream={currentPlayer.dream} revealed />
              <p className="font-body text-sm text-muted-foreground">
                Only reveal if you've achieved the condition! This earns +{currentPlayer.dream.reward} DP.
              </p>
              <DialogFooter className="gap-2">
                <Button variant="ghost" onClick={() => setShowAspirationDialog(false)} className="font-body rounded-full">Not Yet</Button>
                <Button onClick={revealAspiration} className="font-body rounded-full gap-2">
                  <Sparkles className="w-4 h-4" /> Reveal & Claim!
                </Button>
              </DialogFooter>
            </>
          ) : (
            <p className="font-body text-sm text-muted-foreground">
              {currentPlayer?.dreamRevealed ? "You've already claimed your aspiration!" : "No aspiration available."}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Evil Twin Redraw Dialog */}
      <Dialog open={showEvilTwinDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">👯 Twin Unmasked!</DialogTitle>
            <DialogDescription className="font-body text-sm">
              {gameState?.players?.[evilTwinTargetIdx]?.name}'s evil twin identity is exposed! They must draw a new character.
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-2">
            {evilTwinChoices.map(char => (
              <motion.div
                key={char.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setGameState(prev => {
                    const players = [...prev.players];
                    players[evilTwinTargetIdx] = { ...players[evilTwinTargetIdx], character: char };
                    return { ...prev, players };
                  });
                  addLog("👯", gameState.players[evilTwinTargetIdx].name, `revealed as ${char.name}!`);
                  setShowEvilTwinDialog(false);
                  setShowPerformanceBonus(true);
                }}
                className="cursor-pointer rounded-xl bg-gradient-to-br from-secondary via-card to-muted p-4 border border-border hover:border-primary/50 transition-all"
              >
                <span className="text-4xl block mb-2">{char.emoji}</span>
                <p className="font-display text-base font-bold text-foreground mb-1">{char.name}</p>
                <p className="font-body text-xs text-muted-foreground">{char.description}</p>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Climax Vote */}
      {climaxChain && gameState && (
        <ClimaxVote
          chain={climaxChain}
          players={gameState.players}
          onResolve={resolveClimaxVote}
        />
      )}

      {/* Scene Recap */}
      <SceneRecap
        open={showRecap}
        onClose={() => setShowRecap(false)}
        sceneHistory={sceneHistory}
        onUpdateScene={(idx, data) => setSceneHistory(prev => {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...data };
          return updated;
        })}
      />

      {/* Win Dialog */}
      <Dialog open={showWinDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-md text-center">
          <div className="py-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">{winner?.name} Wins!</h2>
            <p className="font-body text-lg text-primary mb-1">{winner?.character.emoji} {winner?.character.name}</p>
            <p className="font-display text-4xl font-black text-primary">{winner?.dp} DP</p>
            <p className="font-body text-sm text-muted-foreground mt-4 mb-6">
              The most dramatic player takes the spotlight! 🎬
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/"><Button variant="outline" className="font-body rounded-full">Home</Button></Link>
              <Link to="/setup">
                <Button className="font-body rounded-full gap-2"><RefreshCw className="w-4 h-4" /> New Game</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
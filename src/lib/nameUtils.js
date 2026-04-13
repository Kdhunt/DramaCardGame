/**
 * Parses a player name for a bracketed secret role.
 * e.g. "Alice (The Mole)" → { displayName: "Alice", secretRole: "The Mole" }
 */
export function parsePlayerName(name) {
  if (!name) return { displayName: name, secretRole: null };
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { displayName: match[1].trim(), secretRole: match[2].trim() };
  }
  return { displayName: name, secretRole: null };
}
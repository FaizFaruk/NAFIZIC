// Profanity filter — add words you want to censor to this list
const BANNED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'damn', 'bastard', 'crap', 'dick', 'pussy',
  'nigga', 'nigger', 'fag', 'retard', 'slut', 'whore', 'cunt',
  // Add more words here as needed
]

function escapeRegex(word: string) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function maskWord(word: string): string {
  if (word.length <= 2) return '*'.repeat(word.length)
  return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1]
}

export function censorText(text: string): string {
  let cleaned = text
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi')
    cleaned = cleaned.replace(regex, (match) => maskWord(match))
  }
  return cleaned
}

// Check if text contains banned words (for optional rejection)
export function containsProfanity(text: string): boolean {
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi')
    if (regex.test(text)) return true
  }
  return false
}

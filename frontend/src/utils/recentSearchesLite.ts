const RECENT_KEY = 'recentChefSearches'

export function getRecentSearches(): string[] {
  const stored = localStorage.getItem(RECENT_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveRecentSearch(term: string) {
  const existing = getRecentSearches()

  const updated = [term, ...existing.filter(t => t !== term)].slice(0, 5)

  localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
}
import AsyncStorage from '@react-native-async-storage/async-storage'

const RECENT_KEY = 'recentChefSearches'

export async function getRecentSearches(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(RECENT_KEY)
  return stored ? JSON.parse(stored) : []
}

export async function saveRecentSearch(term: string) {
  const existing = await getRecentSearches()
  const updated = [term, ...existing.filter(t => t !== term)].slice(0, 5)
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated))
}

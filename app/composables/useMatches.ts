export function useMatches(params?: { group?: string; date?: string; team?: string; stage?: string }) {
  return useFetch('/api/matches', { query: params })
}

export function useMatch(id: string) {
  return useFetch('/api/matches', { query: { id } })
}

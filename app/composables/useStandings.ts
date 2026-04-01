export function useStandings(group?: string) {
  return useFetch('/api/standings', { query: group ? { group } : {} })
}

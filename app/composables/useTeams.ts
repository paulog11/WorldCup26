export function useTeams() {
  return useFetch('/api/teams')
}

export function useTeam(id: string) {
  return useFetch('/api/teams', { query: { id } })
}

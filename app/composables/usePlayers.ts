export function usePlayers(params?: { team?: string; id?: string }) {
  return useFetch('/api/players', { query: params })
}

export function useTeamMeta(teamId?: string) {
  return useFetch('/api/team-meta', { query: { team: teamId } })
}

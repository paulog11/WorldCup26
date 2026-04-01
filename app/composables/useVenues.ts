export function useVenues() {
  return useFetch('/api/venues')
}

export function useVenue(id: string) {
  return useFetch('/api/venues', { query: { id } })
}

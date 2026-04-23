export interface MatchPrediction {
  homeWin: number
  draw: number
  awayWin: number
}

export function predictMatch(homeRank: number, awayRank: number): MatchPrediction {
  const homeStrength = 1 / Math.sqrt(homeRank)
  const awayStrength = 1 / Math.sqrt(awayRank)
  const total = homeStrength + awayStrength
  const homeRatio = homeStrength / total

  // Draw is more likely when ranks are close, less likely when mismatched
  const rankDiff = Math.abs(homeRank - awayRank)
  const proximity = Math.max(0, 1 - rankDiff / 100)
  const drawProb = 0.10 + 0.20 * proximity

  const remaining = 1 - drawProb
  const homeWin = Math.round(homeRatio * remaining * 100)
  const awayWin = Math.round((1 - homeRatio) * remaining * 100)
  const draw = 100 - homeWin - awayWin

  return { homeWin, draw, awayWin }
}

"use client"

import { memo, useMemo, useState } from "react"
import { Calendar, Trophy, AlertCircle } from "lucide-react"
import type { Match } from "../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MatchesTableProps {
  matches: Match[]
}

const MatchScore = memo(
  ({
    homeScore,
    awayScore,
    isHalfTime,
  }: {
    homeScore: number
    awayScore: number
    isHalfTime?: boolean
  }) => {
    const scoreClass = useMemo(() => {
      if (isHalfTime) return "text-white/60"
      if (homeScore > awayScore) return "text-emerald-400"
      if (homeScore < awayScore) return "text-rose-400"
      return "text-amber-400"
    }, [homeScore, awayScore, isHalfTime])

    return (
      <span className={`font-mono font-bold ${scoreClass}`}>
        {homeScore} - {awayScore}
      </span>
    )
  },
)

MatchScore.displayName = "MatchScore"

export const MatchesTable = memo(({ matches = [] }: MatchesTableProps) => {
  const [viewType, setViewType] = useState<"rounds" | "all">("rounds")

  const matchesByRound = useMemo(() => {
    return matches.reduce(
      (acc, match) => {
        const round = match.round || "Unknown"
        if (!acc[round]) {
          acc[round] = []
        }
        acc[round].push(match)
        return acc
      },
      {} as Record<string, Match[]>,
    )
  }, [matches])

  if (matches.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-white/20" />
          <p className="text-white/60">No matches available for this league yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#CCFF00]" />
          <h3 className="text-2xl font-bold text-white">Match Schedule</h3>
        </div>
        <Select value={viewType} onValueChange={(value) => setViewType(value as "rounds" | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rounds">View by Rounds</SelectItem>
            <SelectItem value="all">View All Matches</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {viewType === "rounds" ? (
          <div className="divide-y divide-white/10">
            {Object.entries(matchesByRound).map(([round, roundMatches]) => (
              <div key={round} className="p-4">
                <div className="flex items-center gap-2 mb-3 bg-white/5 rounded-lg p-3">
                  <Trophy className="w-4 h-4 text-[#CCFF00]" />
                  <h4 className="text-lg font-medium text-white">Round {round}</h4>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Home Team</TableHead>
                      <TableHead>Away Team</TableHead>
                      <TableHead className="text-center">HT</TableHead>
                      <TableHead className="text-center">FT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roundMatches.map((match, index) => (
                      <TableRow key={`${match.home_team}-${match.away_team}-${index}`}>
                        <TableCell>{match.date}</TableCell>
                        <TableCell>{match.home_team}</TableCell>
                        <TableCell>{match.away_team}</TableCell>
                        <TableCell className="text-center">
                          <MatchScore homeScore={match.ht_home_score} awayScore={match.ht_away_score} isHalfTime />
                        </TableCell>
                        <TableCell className="text-center">
                          <MatchScore homeScore={match.home_score} awayScore={match.away_score} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Round</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Home Team</TableHead>
                <TableHead>Away Team</TableHead>
                <TableHead className="text-center">HT</TableHead>
                <TableHead className="text-center">FT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match, index) => (
                <TableRow key={`${match.home_team}-${match.away_team}-${index}`}>
                  <TableCell>{match.round}</TableCell>
                  <TableCell>{match.date}</TableCell>
                  <TableCell>{match.home_team}</TableCell>
                  <TableCell>{match.away_team}</TableCell>
                  <TableCell className="text-center">
                    <MatchScore homeScore={match.ht_home_score} awayScore={match.ht_away_score} isHalfTime />
                  </TableCell>
                  <TableCell className="text-center">
                    <MatchScore homeScore={match.home_score} awayScore={match.away_score} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
})

MatchesTable.displayName = "MatchesTable"


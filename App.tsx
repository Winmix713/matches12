"use client"

import { useState, useMemo, useCallback } from "react"
import { Header } from "./components/Header"
import { LeagueTable } from "./components/LeagueTable"
import { LeagueDetails } from "./components/LeagueDetails"
import { NewLeagueModal } from "./components/NewLeagueModal"
import { leagues } from "./data/sampleData"
import { calculateTeamStats } from "./utils/calculations"
import type { LeagueData, Match } from "./types"

function App() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null)
  const [leaguesList, setLeaguesList] = useState<LeagueData[]>(leagues)
  const [matches, setMatches] = useState<Match[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewLeagueModalOpen, setIsNewLeagueModalOpen] = useState(false)

  const filteredLeagues = useMemo(() => {
    return leaguesList.filter((league) =>
      Object.values(league).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [leaguesList, searchTerm])

  const teamStats = useMemo(() => {
    return matches.reduce(
      (acc, match) => {
        if (!acc[match.home_team]) {
          acc[match.home_team] = calculateTeamStats(match.home_team, matches)
        }
        if (!acc[match.away_team]) {
          acc[match.away_team] = calculateTeamStats(match.away_team, matches)
        }
        return acc
      },
      {} as Record<string, ReturnType<typeof calculateTeamStats>>,
    )
  }, [matches])

  const handleLeagueAction = useCallback((leagueId: string, action: "view" | "edit" | "complete" | "delete") => {
    switch (action) {
      case "view":
      case "edit":
        setSelectedLeagueId(leagueId)
        break
      case "complete":
        setLeaguesList((prevLeagues) =>
          prevLeagues.map((league) => (league.id === leagueId ? { ...league, status: "Completed" } : league)),
        )
        break
      case "delete":
        setLeaguesList((prevLeagues) => prevLeagues.filter((league) => league.id !== leagueId))
        break
    }
  }, [])

  const handleCreateLeague = useCallback((leagueId: string) => {
    const newLeague: LeagueData = {
      id: leagueId,
      season: `Virtuális Labdarúgás Liga Mód Retail ${leagueId}`,
      winner: "-",
      secondPlace: "-",
      thirdPlace: "-",
      status: "In Progress",
    }
    setLeaguesList((prevLeagues) => [...prevLeagues, newLeague])
  }, [])

  const handleUpdateLeague = useCallback((updatedLeague: LeagueData) => {
    setLeaguesList((prevLeagues) =>
      prevLeagues.map((league) => (league.id === updatedLeague.id ? updatedLeague : league)),
    )
  }, [])

  const handleUpdateMatches = useCallback((updatedMatches: Match[]) => {
    setMatches(updatedMatches)
  }, [])

  return (
    <div className="min-h-screen bg-[#181818]">
      <Header currentSeason="2024" />

      <main className="container mx-auto p-8">
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative w-full max-w-6xl">
            {selectedLeagueId ? (
              <LeagueDetails
                league={leaguesList.find((league) => league.id === selectedLeagueId)!}
                matches={matches}
                onBack={() => setSelectedLeagueId(null)}
                onUpdateLeague={handleUpdateLeague}
                onUpdateMatches={handleUpdateMatches}
              />
            ) : (
              <LeagueTable
                leagues={filteredLeagues}
                onLeagueAction={handleLeagueAction}
                onSearch={setSearchTerm}
                onNewLeague={() => setIsNewLeagueModalOpen(true)}
              />
            )}

            {/* Glass reflection effects */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </main>

      <NewLeagueModal
        isOpen={isNewLeagueModalOpen}
        onClose={() => setIsNewLeagueModalOpen(false)}
        onCreateLeague={handleCreateLeague}
      />
    </div>
  )
}

export default App


"use client"

import { useState, useCallback, useMemo, useRef, memo } from "react"
import { ArrowLeft, Save, Edit, Upload } from "lucide-react"
import Papa from "papaparse"
import type { Match, LeagueData } from "../types"
import { MatchesTable } from "./MatchesTable"
import { StandingsTable } from "./StandingsTable"
import { FormTable } from "./FormTable"
import { calculateStandings, calculateTeamForms } from "../utils/calculations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LeagueDetailsProps {
  league: LeagueData
  matches: Match[]
  onBack: () => void
  onUpdateLeague: (updatedLeague: LeagueData) => void
  onUpdateMatches: (matches: Match[]) => void
}

type TabType = "matches" | "standings" | "form"

const TabButton = memo(
  ({
    active,
    onClick,
    children,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <Button
      variant={active ? "default" : "secondary"}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        active ? "bg-[#CCFF00] text-black shadow-lg scale-105" : ""
      }`}
    >
      {children}
    </Button>
  ),
)

TabButton.displayName = "TabButton"

export const LeagueDetails = memo(
  ({ league, matches, onBack, onUpdateLeague, onUpdateMatches }: LeagueDetailsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("matches")
    const [isEditing, setIsEditing] = useState(false)
    const [editedLeague, setEditedLeague] = useState(league)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const [dataLoaded, setDataLoaded] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const standings = useMemo(() => calculateStandings(matches), [matches])
    const teamForms = useMemo(() => calculateTeamForms(matches), [matches])

    const handleSave = useCallback(() => {
      onUpdateLeague(editedLeague)
      setIsEditing(false)
      setIsSaveDisabled(true)
    }, [editedLeague, onUpdateLeague])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setEditedLeague((prev) => ({ ...prev, [name]: value }))
      setIsSaveDisabled(false)
    }, [])

    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        Papa.parse<Match>(file, {
          header: true,
          complete: (result) => {
            const parsedMatches = result.data
              .filter(
                (match): match is Match =>
                  match.date !== undefined &&
                  match.home_team !== undefined &&
                  match.away_team !== undefined &&
                  match.ht_home_score !== undefined &&
                  match.ht_away_score !== undefined &&
                  match.home_score !== undefined &&
                  match.away_score !== undefined,
              )
              .map((match) => ({
                ...match,
                ht_home_score: Number(match.ht_home_score),
                ht_away_score: Number(match.ht_away_score),
                home_score: Number(match.home_score),
                away_score: Number(match.away_score),
                round: match.round || "Unknown",
              }))

            if (parsedMatches.length === 0) {
              alert("No valid matches found in the CSV file. Please check the format and try again.")
              return
            }

            onUpdateMatches(parsedMatches)
            setDataLoaded(true)
            setIsSaveDisabled(false)
          },
          error: (error) => {
            console.error("Error parsing CSV:", error)
            alert("Failed to parse CSV file. Please check the format and try again.")
          },
        })
      },
      [onUpdateMatches],
    )

    const triggerFileUpload = useCallback(() => {
      fileInputRef.current?.click()
    }, [])

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Leagues
          </Button>
          <Button onClick={() => setIsEditing((prev) => !prev)} variant="default" className="gap-2">
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? "Save" : "Edit League"}
          </Button>
        </div>

        {isEditing && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="leagueName" className="block text-sm font-medium text-white/80 mb-2">
                  League Name
                </label>
                <Input
                  type="text"
                  id="leagueName"
                  name="name"
                  value={editedLeague.name}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Enter league name"
                />
              </div>
              <div>
                <label htmlFor="leagueSeason" className="block text-sm font-medium text-white/80 mb-2">
                  Season
                </label>
                <Input
                  type="text"
                  id="leagueSeason"
                  name="season"
                  value={editedLeague.season}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Enter season (e.g., 2023-24)"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto flex-grow">
                <label htmlFor="csv-upload" className="block text-sm font-medium text-white/80 mb-2">
                  Upload Matches Data (CSV)
                </label>
                <input
                  ref={fileInputRef}
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={triggerFileUpload} variant="secondary" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Choose CSV File
                  </Button>
                  <span className={`text-sm ${dataLoaded ? "text-emerald-400" : "text-white/60"}`}>
                    {dataLoaded ? "✓ Data loaded successfully" : "No file chosen"}
                  </span>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaveDisabled} variant="default" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <TabButton active={activeTab === "matches"} onClick={() => setActiveTab("matches")}>
            Matches
          </TabButton>
          <TabButton active={activeTab === "standings"} onClick={() => setActiveTab("standings")}>
            Standings
          </TabButton>
          <TabButton active={activeTab === "form"} onClick={() => setActiveTab("form")}>
            Form
          </TabButton>
        </div>

        <div className="transition-all duration-300">
          {activeTab === "matches" && <MatchesTable matches={matches} />}
          {activeTab === "standings" && <StandingsTable standings={standings} />}
          {activeTab === "form" && <FormTable teamForms={teamForms} />}
        </div>
      </div>
    )
  },
)

LeagueDetails.displayName = "LeagueDetails"


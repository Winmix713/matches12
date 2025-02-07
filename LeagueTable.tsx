import { memo } from "react"
import { Search, Plus, Eye, Edit2, CheckCircle, Trash2, Trophy } from "lucide-react"
import type React from "react" // Added import for React
import type { LeagueData } from "../types"

interface LeagueTableProps {
  leagues: LeagueData[]
  onLeagueAction: (leagueId: string, action: "view" | "edit" | "complete" | "delete") => void
  onSearch: (term: string) => void
  onNewLeague: () => void
}

const ActionButton = memo(
  ({
    onClick,
    icon,
    label,
    variant,
  }: {
    onClick: () => void
    icon: React.ReactNode
    label: string
    variant: "blue" | "yellow" | "green" | "red"
  }) => {
    const colors = {
      blue: "text-blue-400 hover:bg-blue-500/20",
      yellow: "text-yellow-400 hover:bg-yellow-500/20",
      green: "text-green-400 hover:bg-green-500/20",
      red: "text-red-400 hover:bg-red-500/20",
    }

    return (
      <button
        onClick={onClick}
        className={`p-1.5 rounded-full transition-all duration-200 ${colors[variant]}`}
        aria-label={label}
      >
        {icon}
      </button>
    )
  },
)

ActionButton.displayName = "ActionButton"

const SearchBar = memo(({ onSearch }: { onSearch: (term: string) => void }) => (
  <div className="relative w-full sm:w-80">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
    <input
      type="text"
      placeholder="Search seasons..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full bg-black/20 text-white border border-white/10 rounded-lg pl-10 pr-4 py-2.5
                focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:border-transparent
                transition-all duration-200 placeholder:text-white/40"
      aria-label="Search seasons"
    />
  </div>
))

SearchBar.displayName = "SearchBar"

const StatusBadge = memo(({ status }: { status: string }) => (
  <span
    className={`
      px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5
      ${
        status === "In Progress" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
      } backdrop-blur-sm
    `}
  >
    {status === "In Progress" ? (
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    ) : (
      <Trophy className="w-3.5 h-3.5" />
    )}
    {status}
  </span>
))

StatusBadge.displayName = "StatusBadge"

export const LeagueTable = memo(({ leagues, onLeagueAction, onSearch, onNewLeague }: LeagueTableProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <SearchBar onSearch={onSearch} />
          <button
            onClick={onNewLeague}
            className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90 transition-all duration-200 
                     px-6 py-2.5 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center
                     font-medium shadow-lg hover:shadow-[#CCFF00]/25 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            New League
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111111]/30 backdrop-blur-sm">
                <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Season</th>
                <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Winner</th>
                <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Second Place
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Third Place
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Status</th>
                <th className="p-4 text-right text-xs font-medium text-white/80 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leagues.map((league) => (
                <tr key={league.id} className="transition-all duration-300 hover:bg-white/10 group">
                  <td className="p-4 whitespace-nowrap text-sm text-white/80">{league.season}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-white/80">{league.winner || "—"}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-white/80">{league.secondPlace || "—"}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-white/80">{league.thirdPlace || "—"}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-white/80">
                    <StatusBadge status={league.status} />
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <ActionButton
                        onClick={() => onLeagueAction(league.id, "view")}
                        icon={<Eye className="w-4 h-4" />}
                        label={`View ${league.season}`}
                        variant="blue"
                      />
                      <ActionButton
                        onClick={() => onLeagueAction(league.id, "edit")}
                        icon={<Edit2 className="w-4 h-4" />}
                        label={`Edit ${league.season}`}
                        variant="yellow"
                      />
                      {league.status === "In Progress" && (
                        <ActionButton
                          onClick={() => onLeagueAction(league.id, "complete")}
                          icon={<CheckCircle className="w-4 h-4" />}
                          label={`Complete ${league.season}`}
                          variant="green"
                        />
                      )}
                      <ActionButton
                        onClick={() => onLeagueAction(league.id, "delete")}
                        icon={<Trash2 className="w-4 h-4" />}
                        label={`Delete ${league.season}`}
                        variant="red"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {leagues.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/60">
                    <div className="flex flex-col items-center gap-2">
                      <Trophy className="w-8 h-8 text-white/20" />
                      <p>No leagues found. Create your first league to get started!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
})

LeagueTable.displayName = "LeagueTable"


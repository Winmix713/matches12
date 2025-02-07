import { memo } from "react"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import type { TeamForm } from "../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FormTableProps {
  teamForms: TeamForm[]
  className?: string
}

const FORM_COLORS = {
  W: "bg-emerald-500 hover:bg-emerald-600",
  D: "bg-amber-500 hover:bg-amber-600",
  L: "bg-rose-500 hover:bg-rose-600",
} as const

const FormResult = memo(({ result }: { result: string }) => (
  <span
    className={`w-6 h-6 flex items-center justify-center text-xs font-semibold text-white rounded transition-colors ${
      FORM_COLORS[result as keyof typeof FORM_COLORS] ?? "bg-gray-500 hover:bg-gray-600"
    }`}
    title={result === "W" ? "Win" : result === "D" ? "Draw" : result === "L" ? "Loss" : "Unknown"}
  >
    {result}
  </span>
))

FormResult.displayName = "FormResult"

const PositionIndicator = memo(({ position, prevPosition }: { position: number; prevPosition?: number }) => {
  if (!prevPosition) return <span>{position}</span>

  const diff = prevPosition - position
  if (diff === 0)
    return (
      <span className="flex items-center gap-1">
        {position} <Minus className="w-3 h-3 text-gray-400" />
      </span>
    )

  return (
    <span className="flex items-center gap-1">
      {position}
      {diff > 0 ? <ArrowUp className="w-3 h-3 text-emerald-500" /> : <ArrowDown className="w-3 h-3 text-rose-500" />}
    </span>
  )
})

PositionIndicator.displayName = "PositionIndicator"

export const FormTable = memo(({ teamForms = [], className = "" }: FormTableProps) => {
  if (teamForms.length === 0) {
    return <div className="text-white/80 text-center p-4 bg-white/5 rounded-lg">No form data available.</div>
  }

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold text-[#CCFF00] mb-6 flex items-center">
        League Table
        <span className="text-sm font-normal text-white/60 ml-2">Last updated: {new Date().toLocaleDateString()}</span>
      </h3>
      <div className="overflow-x-auto rounded-lg bg-[#111111]/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">GF</TableHead>
              <TableHead className="text-center">GA</TableHead>
              <TableHead className="text-center">GD</TableHead>
              <TableHead className="text-center">Pts</TableHead>
              <TableHead className="text-center">Form</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamForms.map((team, index) => (
              <TableRow key={`${team.team}-${index}`}>
                <TableCell>
                  <PositionIndicator
                    position={team.position}
                    prevPosition={index > 0 ? teamForms[index - 1].position : undefined}
                  />
                </TableCell>
                <TableCell>{team.team}</TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center">{team.goalsFor}</TableCell>
                <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={
                      team.goalsFor - team.goalsAgainst > 0
                        ? "text-emerald-400"
                        : team.goalsFor - team.goalsAgainst < 0
                          ? "text-rose-400"
                          : ""
                    }
                  >
                    {team.goalsFor - team.goalsAgainst}
                  </span>
                </TableCell>
                <TableCell className="text-center">{team.points}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1.5">
                    {team.form.split("").map((result, i) => (
                      <FormResult key={i} result={result} />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
})

FormTable.displayName = "FormTable"


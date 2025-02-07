"use client"

import { useMemo } from "react"
import { Medal, TrendingDown, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StandingsEntry {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form?: ("W" | "D" | "L")[]
  previousPosition?: number
}

interface StandingsTableProps {
  standings: StandingsEntry[]
  className?: string
}

const COLUMNS = [
  { key: "position", label: "Pos", align: "left" as const },
  { key: "team", label: "Team", align: "left" as const },
  { key: "played", label: "P", align: "center" as const },
  { key: "won", label: "W", align: "center" as const },
  { key: "drawn", label: "D", align: "center" as const },
  { key: "lost", label: "L", align: "center" as const },
  { key: "goalsFor", label: "GF", align: "center" as const },
  { key: "goalsAgainst", label: "GA", align: "center" as const },
  { key: "goalDifference", label: "GD", align: "center" as const },
  { key: "points", label: "Pts", align: "center" as const },
] as const

export function StandingsTable({ standings = [], className }: StandingsTableProps) {
  const zones = useMemo(() => {
    if (standings.length === 0) return null
    return {
      champions: standings.length >= 1 ? 1 : 0,
      championsLeague: standings.length >= 4 ? 4 : 0,
      europaLeague: standings.length >= 6 ? 6 : 0,
      relegation: standings.length >= 3 ? standings.length - 3 : 0,
    }
  }, [standings])

  if (standings.length === 0) {
    return (
      <Card className={cn("animate-in fade-in-50", className)}>
        <CardHeader>
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No standings available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("animate-in fade-in-50", className)}>
      <CardHeader>
        <CardTitle>Standings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn("h-10 px-4 text-xs font-semibold", column.align === "center" && "text-center")}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((entry, index) => {
                const positionChange = entry.previousPosition ? entry.previousPosition - entry.position : 0

                return (
                  <TableRow
                    key={entry.team}
                    className={cn(
                      "group transition-colors hover:bg-muted/50",
                      zones?.champions === entry.position && "bg-yellow-500/5",
                      zones?.championsLeague >= entry.position && "bg-blue-500/5",
                      zones?.europaLeague >= entry.position && "bg-orange-500/5",
                      entry.position > (zones?.relegation || 0) && "bg-red-500/5",
                    )}
                  >
                    <TableCell className="relative px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span>{entry.position}</span>
                        {positionChange !== 0 && (
                          <span
                            className={cn(
                              "text-xs",
                              positionChange > 0 && "text-green-500",
                              positionChange < 0 && "text-red-500",
                            )}
                          >
                            {positionChange > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                        {zones?.champions === entry.position && <Medal className="h-3 w-3 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {entry.team}
                      {entry.form && (
                        <div className="mt-1 flex gap-0.5">
                          {entry.form.map((result, i) => (
                            <span
                              key={i}
                              className={cn(
                                "inline-flex h-1.5 w-1.5 rounded-full",
                                result === "W" && "bg-green-500",
                                result === "D" && "bg-yellow-500",
                                result === "L" && "bg-red-500",
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">{entry.played}</TableCell>
                    <TableCell className="px-4 py-3 text-center text-green-500">{entry.won}</TableCell>
                    <TableCell className="px-4 py-3 text-center text-yellow-500">{entry.drawn}</TableCell>
                    <TableCell className="px-4 py-3 text-center text-red-500">{entry.lost}</TableCell>
                    <TableCell className="px-4 py-3 text-center">{entry.goalsFor}</TableCell>
                    <TableCell className="px-4 py-3 text-center">{entry.goalsAgainst}</TableCell>
                    <TableCell
                      className={cn(
                        "px-4 py-3 text-center",
                        entry.goalDifference > 0 && "text-green-500",
                        entry.goalDifference < 0 && "text-red-500",
                      )}
                    >
                      {entry.goalDifference > 0 && "+"}
                      {entry.goalDifference}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center font-bold">{entry.points}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


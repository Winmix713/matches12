import { memo } from "react"
import { Trophy, BarChart3, ChevronDown } from "lucide-react"

interface HeaderProps {
  currentSeason?: string
  className?: string
}

const Logo = memo(() => (
  <div className="flex items-center gap-3 group">
    <Trophy
      size={32}
      className="text-[#CCFF00] transition-transform duration-300 group-hover:scale-110"
      aria-hidden="true"
    />
    <div>
      <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
        Soccer Championship Analysis
      </h1>
      <p className="text-xs text-white/60 hidden md:block">Professional Soccer Statistics & Analysis</p>
    </div>
  </div>
))

Logo.displayName = "Logo"

const SeasonIndicator = memo(({ season }: { season: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
      <BarChart3 size={20} className="text-[#CCFF00]" aria-hidden="true" />
      <span className="font-medium">Season {season}</span>
      <ChevronDown size={16} className="text-white/60" aria-hidden="true" />
    </div>
  </div>
))

SeasonIndicator.displayName = "SeasonIndicator"

export const Header = memo(({ currentSeason = "2023-2024", className = "" }: HeaderProps) => {
  return (
    <header
      className={`
        bg-[#111111]/80 backdrop-blur-md border-b border-white/10 
        text-white shadow-lg sticky top-0 z-50 
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <nav className="container mx-auto px-4 md:px-6 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <SeasonIndicator season={currentSeason} />
        </div>
      </nav>
    </header>
  )
})

Header.displayName = "Header"


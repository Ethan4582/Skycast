"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WeatherService } from "@/services/weather-service"
import type { WeatherSearchResult } from "@/types/weather"

interface WeatherSearchProps {
  onSearch: (city: string) => void
  loading: boolean
}

export function WeatherSearch({ onSearch, loading }: WeatherSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<WeatherSearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const saved = localStorage.getItem("weather-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])


  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const results = await WeatherService.searchCities(query)
        setSuggestions(results)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (city: string) => {
    onSearch(city)
    setQuery("")
    setShowSuggestions(false)

  
    const updated = [city, ...recentSearches.filter((s) => s !== city)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("weather-recent-searches", JSON.stringify(updated))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query.trim())
    }
  }

  return (
    <div ref={searchRef} className="relative max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0 || recentSearches.length > 0)}
            className="pl-10 pr-20 h-12 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-all duration-300"
            disabled={loading}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/20 transition-all duration-300"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                "Search"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Card className="absolute top-full left-0 right-0 mt-2 p-2 bg-white/10 backdrop-blur-md border-white/20 z-50">
              
              {suggestions.length > 0 && (
                <div className="space-y-1">
                  {suggestions.map((city, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSearch(city.name)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>
                        {city.name}, {city.country}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

            
              {suggestions.length === 0 && recentSearches.length > 0 && (
                <div className="space-y-1">
                  <motion.p
                    className="text-xs text-slate-400 px-3 py-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Recent searches
                  </motion.p>
                  {recentSearches.map((city, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSearch(city)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{city}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

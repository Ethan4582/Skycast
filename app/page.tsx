"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WeatherSearch } from "@/components/weather/weather-search"
import { WeatherDisplay } from "@/components/weather/weather-display"
import { WeatherService } from "@/services/weather-service"
import type { WeatherData } from "@/types/weather"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCitySearch = async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await WeatherService.getCurrentWeather(city)
      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await WeatherService.getWeatherByCoords(position.coords.latitude, position.coords.longitude)
            setWeatherData(data)
          } catch (err) {
            console.error("Failed to get weather by location:", err)
          }
        },
        () => {
          
          handleCitySearch("London")
        },
      )
    } else {
      handleCitySearch("London")
    }
  }, [])

  const [dotPositions, setDotPositions] = useState<{ x: number; y: number; left: string }[]>([])

  useEffect(() => {
    
    const positions = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      left: `${Math.random() * 100}%`,
    }))
    setDotPositions(positions)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dotPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: pos.x,
              y: pos.y,
            }}
            animate={{
              y: -10,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: pos.left,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white text-balance"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Skycast
            </motion.h1>
            <motion.p
              className="text-lg text-slate-300 text-pretty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Get real-time weather information for cities worldwide
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <WeatherSearch onSearch={handleCitySearch} loading={loading} />
          </motion.div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                  <motion.div className="space-y-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "12rem" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Skeleton className="h-8 w-48 bg-white/20" />
                    </motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "8rem" }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Skeleton className="h-16 w-32 bg-white/20" />
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                        >
                          <Skeleton className="h-20 bg-white/20" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-6 bg-red-500/20 backdrop-blur-md border-red-500/30">
                  <motion.p
                    className="text-red-200 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {error}
                  </motion.p>
                </Card>
              </motion.div>
            )}

            {weatherData && !loading && (
              <motion.div
                key="weather-data"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <WeatherDisplay data={weatherData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

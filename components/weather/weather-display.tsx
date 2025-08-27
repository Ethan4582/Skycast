"use client"

import type { WeatherData } from "@/types/weather"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WeatherService } from "@/services/weather-service"
import { Droplets, Wind, Eye, Gauge, MapPin, Navigation } from "lucide-react"

interface WeatherDisplayProps {
  data: WeatherData
}

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  const { location, current } = data

  const getWindDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
        <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.div
                className="flex items-center gap-2 text-slate-300 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MapPin className="h-4 w-4" />
                <span>
                  {location.name}, {location.country}
                </span>
              </motion.div>
              <motion.h2
                className="text-5xl md:text-7xl font-bold text-white mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
                  {current.temperature}°C
                </motion.span>
              </motion.h2>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {current.condition}
                  </Badge>
                </motion.div>
                <span className="text-slate-300 capitalize">{current.description}</span>
              </motion.div>
            </div>
            <motion.div
              className="text-right"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.img
                src={WeatherService.getWeatherIconUrl(current.icon) || "/placeholder.svg"}
                alt={current.description}
                className="w-24 h-24 md:w-32 md:h-32"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <motion.p
                className="text-slate-300 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Feels like {current.feelsLike}°C
              </motion.p>
            </motion.div>
          </div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>
            <motion.div
              className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
              >
                <Droplets className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              </motion.div>
              <motion.p
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {current.humidity}%
              </motion.p>
              <p className="text-slate-400 text-sm">Humidity</p>
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1, type: "spring" }}
              >
                <Wind className="h-6 w-6 text-green-400 mx-auto mb-2" />
              </motion.div>
              <div className="flex items-center justify-center gap-1">
                <motion.p
                  className="text-2xl font-semibold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  {current.windSpeed}
                </motion.p>
                <motion.div animate={{ rotate: current.windDirection }} transition={{ duration: 0.8, delay: 1.2 }}>
                  <Navigation className="h-4 w-4 text-green-400" />
                </motion.div>
              </div>
              <p className="text-slate-400 text-sm">
                {current.windSpeed} km/h {getWindDirection(current.windDirection)}
              </p>
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1, type: "spring" }}
              >
                <Eye className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              </motion.div>
              <motion.p
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {current.visibility}
              </motion.p>
              <p className="text-slate-400 text-sm">Visibility (km)</p>
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
              >
                <Gauge className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              </motion.div>
              <motion.p
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                {current.pressure}
              </motion.p>
              <p className="text-slate-400 text-sm">Pressure (hPa)</p>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

import type { WeatherData, WeatherSearchResult } from "@/types/weather"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    if (!API_KEY) {
      throw new Error("OpenWeatherMap API key is not configured")
    }

    try {
     
      const geoResponse = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`)

      if (!geoResponse.ok) {
        throw new Error("Failed to find city")
      }

      const geoData = await geoResponse.json()

      if (!geoData.length) {
        throw new Error("City not found")
      }

      const { lat, lon, name, country } = geoData[0]

  
      const weatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const weatherData = await weatherResponse.json()

      return this.transformWeatherData(weatherData, { name, country, lat, lon })
    } catch (error) {
      console.error("Weather API Error:", error)
      throw error
    }
  }

  static async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    if (!API_KEY) {
      throw new Error("OpenWeatherMap API key is not configured")
    }

    try {
      const weatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const weatherData = await weatherResponse.json()

      return this.transformWeatherData(weatherData, {
        name: weatherData.name,
        country: weatherData.sys.country,
        lat,
        lon,
      })
    } catch (error) {
      console.error("Weather API Error:", error)
      throw error
    }
  }

  static async searchCities(query: string): Promise<WeatherSearchResult[]> {
    if (!API_KEY || query.length < 2) {
      return []
    }

    try {
      const response = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)

      if (!response.ok) {
        return []
      }

      const data = await response.json()

      return data.map((item: any) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }))
    } catch (error) {
      console.error("City search error:", error)
      return []
    }
  }

  private static transformWeatherData(apiData: any, location: any): WeatherData {
    return {
      location: {
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
      },
      current: {
        temperature: Math.round(apiData.main.temp),
        feelsLike: Math.round(apiData.main.feels_like),
        condition: apiData.weather[0].main,
        description: apiData.weather[0].description,
        icon: apiData.weather[0].icon,
        humidity: apiData.main.humidity,
        windSpeed: Math.round(apiData.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: apiData.wind.deg,
        pressure: apiData.main.pressure,
        visibility: apiData.visibility ? Math.round(apiData.visibility / 1000) : 10,
      },
    }
  }

  static getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
  }
}

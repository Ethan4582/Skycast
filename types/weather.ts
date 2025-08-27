export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temperature: number
    feelsLike: number
    condition: string
    description: string
    icon: string
    humidity: number
    windSpeed: number
    windDirection: number
    pressure: number
    visibility: number
    uvIndex?: number
  }
  forecast?: {
    daily: DailyForecast[]
    hourly: HourlyForecast[]
  }
}

export interface DailyForecast {
  date: string
  high: number
  low: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
}

export interface HourlyForecast {
  time: string
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
}

export interface WeatherSearchResult {
  name: string
  country: string
  lat: number
  lon: number
}

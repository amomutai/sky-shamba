// Shapes returned by the WeatherAI API (https://api.weather-ai.co)
// Derived from actual v1/weather response — condition_code is a string, not a number.

export interface CurrentWeather {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_gust: number;
  uv_index: number;
  condition_code: string; // API sends "0", "51", etc.
  icon: string;
  icon_path: string;
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_sum: number;
  precipitation_probability: number;
  wind_max: number;
  condition_code: string;
  icon: string;
  icon_path: string;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  feels_like: number;
  precipitation_probability: number;
  condition_code: string;
  icon: string;
  wind_speed: number;
  wind_gust: number;
  humidity: number;
  uv_index: number;
}

export interface WeatherResponse {
  location: {
    lat: number;
    lon: number;
    timezone: string;
    country: string;
  };
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  // ai_summary is returned by the Pro /v1/insights endpoint
  ai_summary?: string;
}

// Derived from the actual /v1/trees/analyze response
export interface TreeAnalysisResult {
  analysis_id: string;
  timestamp: string;
  total_tree_count: number;
  tree_density_per_acre: number | null;
  confidence_score: number; // 0–1
  canopy_coverage_pct: number | null;
  tree_health: {
    healthy: number;
    needs_care: number;
    needs_replacement: number;
  };
  low_confidence: boolean;
  tree_species_guess: string | null;
  image_perspective: string | null;
  observations: string[];
  recommendations: string[];
  original_image_url: string;
  overlay_image_url: string | null;
}

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
  };
}

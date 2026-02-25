"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";
  uvIndex: number;
  airQuality: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";
  }>;
}

interface WeatherWidgetProps {
  location?: string;
}

const WEATHER_ICONS = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
};

const CONDITION_LABELS = {
  sunny: "Słonecznie",
  cloudy: "Pochmurno",
  rainy: "Deszczowo",
  snowy: "Śnieg",
  stormy: "Burza",
};

const AIR_QUALITY_LABELS = ["Bardzo dobry", "Dobry", "Umiarkowany", "Słaby", "Bardzo słaby"];
const AIR_QUALITY_COLORS = ["text-green-600 bg-green-50", "text-green-600 bg-green-50", "text-yellow-600 bg-yellow-50", "text-orange-600 bg-orange-50", "text-red-600 bg-red-50"];

// Mock weather data generator
function generateMockWeather(): WeatherData {
  const conditions: WeatherData["condition"][] = ["sunny", "cloudy", "rainy", "sunny", "sunny"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  const baseTemp = 15 + Math.floor(Math.random() * 15);

  return {
    temperature: baseTemp,
    feelsLike: baseTemp + (Math.random() > 0.5 ? 2 : -2),
    humidity: 40 + Math.floor(Math.random() * 40),
    windSpeed: 5 + Math.floor(Math.random() * 20),
    condition,
    uvIndex: condition === "sunny" ? 5 + Math.floor(Math.random() * 5) : 1 + Math.floor(Math.random() * 3),
    airQuality: Math.floor(Math.random() * 5) + 1,
    forecast: [
      { day: "Dziś", high: baseTemp, low: baseTemp - 5, condition },
      { day: "Jutro", high: baseTemp + 2, low: baseTemp - 3, condition: "sunny" },
      { day: "Śr", high: baseTemp - 1, low: baseTemp - 6, condition: "cloudy" },
      { day: "Czw", high: baseTemp + 3, low: baseTemp - 2, condition: "sunny" },
      { day: "Pt", high: baseTemp, low: baseTemp - 4, condition: "rainy" },
    ],
  };
}

function getActivityRecommendation(weather: WeatherData): string {
  if (weather.condition === "rainy" || weather.condition === "stormy") {
    return "🏠 Dziś lepiej na siłownię lub trening w domu";
  }
  if (weather.temperature < 5) {
    return "🧥 Zimno! Ubierz się ciepło na spacer";
  }
  if (weather.temperature > 25 && weather.uvIndex > 6) {
    return "🌞 Gorąco! Unikaj słońca 11-15, używaj kremu z filtrem";
  }
  if (weather.airQuality > 3) {
    return "😷 Słaba jakość powietrza - rozważ trening w pomieszczeniu";
  }
  return "🏃 Świetna pogoda na aktywność na świeżym powietrzu!";
}

export function WeatherWidget({ location = "Warszawa" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWeather(generateMockWeather());
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !weather) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-white/20 rounded w-1/2 mb-4" />
        <div className="h-16 bg-white/20 rounded w-1/3 mb-4" />
        <div className="h-4 bg-white/20 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">{location}</p>
            <p className="text-5xl font-bold mt-2">{weather.temperature}°</p>
            <p className="text-sm opacity-80 mt-1">
              Odczuwalna: {weather.feelsLike}°
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl">{WEATHER_ICONS[weather.condition]}</p>
            <p className="text-sm mt-1">{CONDITION_LABELS[weather.condition]}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-2xl">💧</p>
            <p className="text-lg font-medium">{weather.humidity}%</p>
            <p className="text-xs opacity-70">Wilgotność</p>
          </div>
          <div className="text-center">
            <p className="text-2xl">💨</p>
            <p className="text-lg font-medium">{weather.windSpeed} km/h</p>
            <p className="text-xs opacity-70">Wiatr</p>
          </div>
          <div className="text-center">
            <p className="text-2xl">☀️</p>
            <p className="text-lg font-medium">{weather.uvIndex}</p>
            <p className="text-xs opacity-70">UV Index</p>
          </div>
        </div>
      </div>

      {/* Air Quality */}
      <div className={`rounded-xl p-4 ${AIR_QUALITY_COLORS[weather.airQuality - 1]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Jakość powietrza</p>
            <p className="text-lg font-bold">{AIR_QUALITY_LABELS[weather.airQuality - 1]}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
            <span className="text-xl font-bold">{weather.airQuality}</span>
          </div>
        </div>
      </div>

      {/* Activity Recommendation */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <p className="text-sm text-zinc-600">{getActivityRecommendation(weather)}</p>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <h4 className="font-medium text-zinc-900 mb-3">Prognoza 5-dniowa</h4>
        <div className="flex justify-between">
          {weather.forecast.map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-zinc-500 mb-1">{day.day}</p>
              <p className="text-2xl mb-1">{WEATHER_ICONS[day.condition]}</p>
              <p className="text-sm font-medium text-zinc-900">{day.high}°</p>
              <p className="text-xs text-zinc-400">{day.low}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Outdoor Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <h4 className="font-medium text-zinc-900 mb-2">Porady na dziś</h4>
        <ul className="text-sm text-zinc-600 space-y-1">
          {weather.uvIndex > 5 && (
            <li>• Używaj kremu z filtrem SPF 30+</li>
          )}
          {weather.humidity > 70 && (
            <li>• Wysoka wilgotność - pij więcej wody</li>
          )}
          {weather.temperature > 20 && (
            <li>• Świetna pogoda na spacer lub bieganie</li>
          )}
          {weather.condition === "sunny" && (
            <li>• Załóż okulary przeciwsłoneczne</li>
          )}
          {weather.windSpeed > 15 && (
            <li>• Silny wiatr - rozważ trening w pomieszczeniu</li>
          )}
        </ul>
      </div>
    </div>
  );
}

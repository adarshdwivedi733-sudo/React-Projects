import React, { useState } from "react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [city, setCity] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = "4c09e89e27bf05622bf6185263c65055";

  const getWeather = async () => {
    if (!city) return;

    // Current
    const res1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data1 = await res1.json();
    setCurrent(data1);

    // Forecast
    const res2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data2 = await res2.json();

    const filtered = data2.list.slice(0, 8).map((item) => ({
      temp: Math.round(item.main.temp),
      time: item.dt_txt.split(" ")[1].slice(0, 5),
    }));

    setForecast(filtered);
  };

  // 🌦 Dynamic effects
  const weatherType = current?.weather[0]?.main?.toLowerCase() || "";

  return (
    <div className="app">

      {/* 🌤 Animations */}
      {weatherType.includes("cloud") && <div className="clouds"></div>}
      {weatherType.includes("rain") && <div className="rain"></div>}
      {weatherType.includes("thunder") && <div className="lightning"></div>}

      <div className="card">

        {/* TOP */}
        <div className="top">
          <p>📍 {current?.name || "City"}</p>
          <p>{new Date().toDateString()}</p>
        </div>

        {/* MAIN */}
        <div className="main">

          {/* LEFT */}
          <div className="left">
            <h1 className="temp">
              {current ? Math.round(current.main.temp) : "--"}°C
            </h1>

            <p className="condition">
              {current?.weather[0]?.main || "Weather"}
            </p>

            <div className="details">
              <p>🌬 {current?.wind?.speed || "--"} km/h</p>
              <p>💧 {current?.main?.humidity || "--"}%</p>
            </div>
          </div>

          {/* CENTER */}
          <div className="center">
            {current && (
              <img
                src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
                alt="weather"
              />
            )}
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="forecast-card">
              {forecast.map((item, i) => (
                <p key={i}>
                  {item.time} - {item.temp}°
                </p>
              ))}
            </div>
          </div>

        </div>

        {/* GRAPH */}
        <div className="graph">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={forecast}>
              <XAxis dataKey="time" />
              <Tooltip />
              <Line type="monotone" dataKey="temp" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SEARCH */}
      <div className="search">
        <input
  placeholder="Search city..."
  value={city}
  onChange={(e) => setCity(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  }}
/>
        <button onClick={getWeather}>Search</button>
      </div>

    </div>
  );
}

export default App;
import axios from 'axios'
import { useState } from 'react'
import './App.css'
import MapSelector from './MapSelector'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

function App() {
  const [mode, setMode] = useState('planning') // 'planning' or 'forecast'
  const [loading, setLoading] = useState(false)
  const [historicalData, setHistoricalData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  
  // Form inputs
  const [lat, setLat] = useState('20.0')
  const [lon, setLon] = useState('73.5')
  const [activity, setActivity] = useState('harvest')
  const [crop, setCrop] = useState('wheat')
  const [targetDate, setTargetDate] = useState('2025-06-15')

  // Download function HERE
  const downloadData = async (format) => {
    if (!historicalData) {
      alert('No data to download. Please run an analysis first.')
      return
    }

    try {
      if (format === 'csv') {
        // CSV: Direct download from backend
        const response = await axios.post(
          'http://localhost:5000/api/download',
          {
            format: 'csv',
            data: historicalData
          },
          {
            responseType: 'blob' // Important for CSV
          }
        )

        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // Extract filename from headers or use default
        const contentDisposition = response.headers['content-disposition']
        let filename = 'weatherwise_analysis.csv'
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename=(.+)/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        alert(`✅ Downloaded ${filename}`)
        
      } else {
        // JSON: Get content and create blob
        const response = await axios.post('http://localhost:5000/api/download', {
          format: 'json',
          data: historicalData
        })

        const result = response.data
        
        if (result.success) {
          const blob = new Blob([JSON.stringify(result.content, null, 2)], { 
            type: 'application/json' 
          })
          
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = result.filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          alert(`✅ Downloaded ${result.filename}`)
        }
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download. Please try again.')
    }
  }

  const loadHistoricalAnalysis = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:5000/api/historical-analysis?lat=${lat}&lon=${lon}&date=${targetDate}&activity=${activity}&crop=${crop}`
      )
      setHistoricalData(response.data)
      setForecastData(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to load analysis. Make sure Flask backend is running!')
    }
    setLoading(false)
  }

  const loadForecast = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:5000/api/forecast?lat=${lat}&lon=${lon}&activity=${activity}&crop=${crop}`
      )
      setForecastData(response.data)
      setHistoricalData(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to load forecast. Make sure Flask backend is running!')
    }
    setLoading(false)
  }

  // Preset locations
  const presetLocations = {
    nashik: { lat: '20.0', lon: '73.5', name: 'Nashik, Maharashtra' },
    pune: { lat: '18.5', lon: '73.8', name: 'Pune, Maharashtra' },
    delhi: { lat: '28.6', lon: '77.2', name: 'Delhi' },
    bangalore: { lat: '12.9', lon: '77.6', name: 'Bangalore' },
  }

  const selectLocation = (key) => {
    setLat(presetLocations[key].lat)
    setLon(presetLocations[key].lon)
  }

  return (
    <div className="app">
      <header>
        <h1>☀️ WeatherWise</h1>
        <p>NASA-Powered Weather Intelligence: Plan Months Ahead, Execute with Confidence</p>
      </header>

      <main>
        {/* Mode Selector */}
        <div className="mode-selector">
          <button 
            className={mode === 'planning' ? 'active' : ''}
            onClick={() => setMode('planning')}
          >
            📅 Planning Mode<br/>
            <span className="mode-desc">(Months in Advance)</span>
          </button>
          <button 
            className={mode === 'forecast' ? 'active' : ''}
            onClick={() => setMode('forecast')}
          >
            🎯 Forecast Mode<br/>
            <span className="mode-desc">(7-Day Precision)</span>
          </button>
        </div>

        {/* Input Form */}
        <div className="input-card">
          <h3>
            {mode === 'planning' 
              ? '📊 Historical Pattern Analysis' 
              : '🌤️ Real-Time Weather Forecast'}
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Activity Type:</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="harvest">🌾 Harvest</option>
                <option value="planting">🌱 Planting</option>
                <option value="event">🎉 Outdoor Event</option>
                <option value="construction">🏗️ Construction</option>
                <option value="spraying">💧 Pesticide Spraying</option>
              </select>
            </div>

            {(activity === 'harvest' || activity === 'planting' || activity === 'spraying') && (
              <div className="form-group">
                <label>Crop Type:</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="maize">Maize</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
            )}
          </div>

          {/* Interactive Map */}
          <div className="map-section">
            <h4>Select Location on Map:</h4>
            <MapSelector 
              onLocationSelect={(lat, lon) => {
                setLat(lat.toFixed(2))
                setLon(lon.toFixed(2))
              }}
              initialLat={lat}
              initialLon={lon}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude:</label>
              <input 
                type="number" 
                step="0.1"
                value={lat} 
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g., 20.0"
              />
            </div>

            <div className="form-group">
              <label>Longitude:</label>
              <input 
                type="number" 
                step="0.1"
                value={lon} 
                onChange={(e) => setLon(e.target.value)}
                placeholder="e.g., 73.5"
              />
            </div>

            {mode === 'planning' && (
              <div className="form-group">
                <label>Target Date:</label>
                <input 
                  type="date" 
                  value={targetDate} 
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>

          <div className="preset-locations">
            <span>Quick Select:</span>
            <button onClick={() => selectLocation('nashik')} className="preset-btn">Nashik</button>
            <button onClick={() => selectLocation('pune')} className="preset-btn">Pune</button>
            <button onClick={() => selectLocation('delhi')} className="preset-btn">Delhi</button>
            <button onClick={() => selectLocation('bangalore')} className="preset-btn">Bangalore</button>
          </div>

          <button 
            onClick={mode === 'planning' ? loadHistoricalAnalysis : loadForecast} 
            disabled={loading} 
            className="analyze-btn"
          >
            {loading ? '⏳ Analyzing...' : 
             mode === 'planning' ? '📊 Analyze Historical Patterns' : '🚀 Get Weather Forecast'}
          </button>
        </div>

        {/* Historical Analysis Results */}
        {historicalData && (
          <div className="results">
            <div className="planning-header">
              <h2>📅 Long-Term Planning Analysis</h2>
              <div className="planning-meta">
                <span>🗓️ Target: {historicalData.target_date}</span>
                <span>📍 {historicalData.location.name}</span>
                <span>⏰ Planning {historicalData.months_in_advance} months in advance</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">☔</div>
                <div className="stat-value">{historicalData.statistics.rain_probability}%</div>
                <div className="stat-label">Rain Probability</div>
                <div className="stat-detail">
                  {historicalData.statistics.rainy_years} of {historicalData.statistics.total_years_analyzed} years
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{historicalData.statistics.favorable_conditions_probability}%</div>
                <div className="stat-label">Favorable Conditions</div>
                <div className="stat-detail">
                  {historicalData.statistics.favorable_years} favorable years
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🌡️</div>
                <div className="stat-value">{historicalData.statistics.average_temperature_c}°C</div>
                <div className="stat-label">Avg Temperature</div>
                <div className="stat-detail">Historical average</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  {historicalData.planning_risk_score < 30 ? '🟢' : 
                   historicalData.planning_risk_score < 60 ? '🟡' : '🔴'}
                </div>
                <div className="stat-value">{historicalData.planning_risk_score}</div>
                <div className="stat-label">Planning Risk Score</div>
                <div className="stat-detail">/100</div>
              </div>
            </div>

            {/* Visual Charts */}
            <div className="charts-section">
              <h2>📊 Visual Data Analysis</h2>
              
              {/* Probability Comparison Chart */}
              <div className="chart-card">
                <h3>Weather Probabilities Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    {
                      name: 'Rain',
                      probability: historicalData.statistics.rain_probability,
                      fill: '#3b82f6'
                    },
                    {
                      name: 'Favorable',
                      probability: historicalData.statistics.favorable_conditions_probability,
                      fill: '#10b981'
                    },
                    {
                      name: 'Extreme Heat',
                      probability: historicalData.extreme_events.extreme_heat.probability,
                      fill: '#ef4444'
                    },
                    {
                      name: 'Heavy Rain',
                      probability: historicalData.extreme_events.extreme_rainfall.probability,
                      fill: '#6366f1'
                    },
                    {
                      name: 'Heat Wave',
                      probability: historicalData.extreme_events.heat_wave.probability,
                      fill: '#f59e0b'
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                      {[
                        { fill: '#3b82f6' },
                        { fill: '#10b981' },
                        { fill: '#ef4444' },
                        { fill: '#6366f1' },
                        { fill: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="chart-caption">
                  Historical probability analysis based on 20 years of NASA satellite data
                </p>
              </div>

              {/* Monthly Pattern Chart */}
              <div className="chart-card">
                <h3>Monthly Rain Probability Pattern</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData.monthly_pattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="day" 
                      label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis label={{ value: 'Rain Probability (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rain_probability" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Rain Probability"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="chart-caption">
                  Rain probability trends throughout the month at this location
                </p>
              </div>

              {/* Historical Trends Chart */}
              <div className="chart-card">
                <h3>10-Year Historical Temperature Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData.historical_data.map(year => ({
                    year: year.year,
                    temperature: year.temperature_c,
                    precipitation: year.precipitation_mm
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      label={{ value: 'Precipitation (mm)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="precipitation" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Precipitation (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="chart-caption">
                  Temperature and precipitation patterns for this date over the last 10 years
                </p>
              </div>
            </div>

            <div className="recommendation-card" style={{
              background: historicalData.planning_risk_score < 30 ? '#d1fae5' : 
                         historicalData.planning_risk_score < 60 ? '#fef3c7' : '#fee2e2',
              borderLeftColor: historicalData.planning_risk_score < 30 ? '#10b981' : 
                              historicalData.planning_risk_score < 60 ? '#f59e0b' : '#ef4444',
            }}>
              <h3>📋 Planning Recommendation</h3>
              <div className="big-recommendation">
                {historicalData.recommendation}
              </div>
            </div>

            <div className="insights-card">
              <h3>💡 Key Insights (Based on 20 Years NASA Data)</h3>
              {historicalData.insights.map((insight, idx) => (
                <div key={idx} className="insight-item">• {insight}</div>
              ))}
            </div>

              {/* Extreme Events Analysis */}
            <div className="extreme-events-section">
              <h2>⚠️ Extreme Weather Events Analysis</h2>
              <p className="extreme-subtitle">Probability of extreme conditions based on historical NASA data</p>
              
              <div className="extreme-grid">
                {/* Extreme Heat */}
                <div className={`extreme-card severity-${historicalData.extreme_events.extreme_heat.severity.toLowerCase()}`}>
                  <div className="extreme-icon">🌡️</div>
                  <h3>Extreme Heat</h3>
                  <div className="extreme-prob">{historicalData.extreme_events.extreme_heat.probability}%</div>
                  <div className="extreme-threshold">{historicalData.extreme_events.extreme_heat.threshold}</div>
                  <div className="extreme-desc">{historicalData.extreme_events.extreme_heat.description}</div>
                  <div className={`severity-badge ${historicalData.extreme_events.extreme_heat.severity.toLowerCase()}`}>
                    {historicalData.extreme_events.extreme_heat.severity} RISK
                  </div>
                  <div className="extreme-count">
                    {historicalData.extreme_events.extreme_heat.occurrences} occurrences in 20 years
                  </div>
                </div>

                {/* Extreme Rainfall */}
                <div className={`extreme-card severity-${historicalData.extreme_events.extreme_rainfall.severity.toLowerCase()}`}>
                  <div className="extreme-icon">🌊</div>
                  <h3>Extreme Rainfall</h3>
                  <div className="extreme-prob">{historicalData.extreme_events.extreme_rainfall.probability}%</div>
                  <div className="extreme-threshold">{historicalData.extreme_events.extreme_rainfall.threshold}</div>
                  <div className="extreme-desc">{historicalData.extreme_events.extreme_rainfall.description}</div>
                  <div className={`severity-badge ${historicalData.extreme_events.extreme_rainfall.severity.toLowerCase()}`}>
                    {historicalData.extreme_events.extreme_rainfall.severity} RISK
                  </div>
                  <div className="extreme-count">
                    {historicalData.extreme_events.extreme_rainfall.occurrences} occurrences in 20 years
                  </div>
                </div>

                {/* Heat Wave */}
                <div className={`extreme-card severity-${historicalData.extreme_events.heat_wave.severity.toLowerCase()}`}>
                  <div className="extreme-icon">🔥</div>
                  <h3>Heat Wave</h3>
                  <div className="extreme-prob">{historicalData.extreme_events.heat_wave.probability}%</div>
                  <div className="extreme-threshold">{historicalData.extreme_events.heat_wave.threshold}</div>
                  <div className="extreme-desc">{historicalData.extreme_events.heat_wave.description}</div>
                  <div className={`severity-badge ${historicalData.extreme_events.heat_wave.severity.toLowerCase()}`}>
                    {historicalData.extreme_events.heat_wave.severity} RISK
                  </div>
                  <div className="extreme-count">
                    {historicalData.extreme_events.heat_wave.occurrences} occurrences in 20 years
                  </div>
                </div>

                {/* Dangerous Winds */}
                <div className={`extreme-card severity-${historicalData.extreme_events.dangerous_winds.severity.toLowerCase()}`}>
                  <div className="extreme-icon">💨</div>
                  <h3>Dangerous Winds</h3>
                  <div className="extreme-prob">{historicalData.extreme_events.dangerous_winds.probability}%</div>
                  <div className="extreme-threshold">{historicalData.extreme_events.dangerous_winds.threshold}</div>
                  <div className="extreme-desc">{historicalData.extreme_events.dangerous_winds.description}</div>
                  <div className={`severity-badge ${historicalData.extreme_events.dangerous_winds.severity.toLowerCase()}`}>
                    {historicalData.extreme_events.dangerous_winds.severity} RISK
                  </div>
                  <div className="extreme-count">
                    {historicalData.extreme_events.dangerous_winds.occurrences} occurrences in 20 years
                  </div>
                </div>
              </div>

              {/* Comfort Index */}
              <div className="comfort-index-card">
                <div className="comfort-icon">😊</div>
                <h3>Overall Comfort Index</h3>
                <div className="comfort-score">{historicalData.extreme_events.comfort_index.probability}%</div>
                <p>{historicalData.extreme_events.comfort_index.description}</p>
              </div>

              {/* Extreme Events Summary */}
              <div className="extreme-summary">
                <h3>⚡ Extreme Events Summary</h3>
                {historicalData.extreme_events.summary.map((warning, idx) => (
                  <div key={idx} className="summary-item">{warning}</div>
                ))}
              </div>
            </div>

            <div className="historical-timeline">
              <h3>📈 Historical Data (Last 10 Years)</h3>
              <div className="timeline">
                {historicalData.historical_data.map((year, idx) => (
                  <div key={idx} className={`timeline-item ${year.was_favorable ? 'favorable' : 'unfavorable'}`}>
                    <div className="year">{year.year}</div>
                    <div className="status">{year.rained ? '🌧️ Rained' : '☀️ Dry'}</div>
                    <div className="temp">{year.temperature_c}°C</div>
                    <div className="precip">{year.precipitation_mm}mm</div>
                  </div>
                ))}
              </div>
            </div>

                {/* Download Section */}
            <div className="download-section">
              <div className="sources">
                <strong>Data Sources:</strong> {historicalData.data_sources.join(' • ')}
              </div>
              
              <div className="download-buttons">
                <h3>📥 Download Analysis Report</h3>
                <p>Export this analysis for offline use and record-keeping</p>
                <div className="button-group">
                  <button 
                    onClick={() => downloadData('csv')}
                    className="download-btn csv-btn"
                  >
                    📄 Download CSV
                  </button>
                  <button 
                    onClick={() => downloadData('json')}
                    className="download-btn json-btn"
                  >
                    📋 Download JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Results*/}
        {forecastData && (
          <div className="results">
            <div className="risk-card">
              <h2>🎯 7-Day Weather Forecast</h2>
              <div className="location">{forecastData.location.name}</div>
              <div className="activity">Activity: {forecastData.location.activity_type}</div>
              
              <div className="risk-score">
                <div className="score" style={{
                  color: forecastData.risk_analysis.risk_score < 30 ? '#10b981' : 
                         forecastData.risk_analysis.risk_score < 60 ? '#f59e0b' : '#ef4444'
                }}>
                  {forecastData.risk_analysis.risk_score}
                </div>
                <div className="label">/ 100 Risk Score</div>
              </div>

              <div className="recommendation" style={{
                background: forecastData.risk_analysis.risk_score < 30 ? '#d1fae5' : 
                           forecastData.risk_analysis.risk_score < 60 ? '#fef3c7' : '#fee2e2',
                borderLeftColor: forecastData.risk_analysis.risk_score < 30 ? '#10b981' : 
                                forecastData.risk_analysis.risk_score < 60 ? '#f59e0b' : '#ef4444',
                color: forecastData.risk_analysis.risk_score < 30 ? '#065f46' : 
                      forecastData.risk_analysis.risk_score < 60 ? '#78350f' : '#7f1d1d'
              }}>
                {forecastData.risk_analysis.risk_score < 30 ? '✅' : 
                 forecastData.risk_analysis.risk_score < 60 ? '⚠️' : '🚫'} {forecastData.risk_analysis.recommendation}
              </div>

              <div className="reasoning">
                <h3>Key Insights:</h3>
                {forecastData.risk_analysis.reasoning.map((reason, idx) => (
                  <div key={idx}>• {reason}</div>
                ))}
              </div>
            </div>

            <div className="forecast-grid">
              <h3>7-Day Detailed Forecast</h3>
              <div className="days">
                {forecastData.forecast.map((day, idx) => (
                  <div key={idx} className="day-card">
                    <div className="date">{new Date(day.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</div>
                    <div className="temp">{day.temperature_c}°C</div>
                    <div className="condition">{day.conditions}</div>
                    <div className="precip">💧 {day.precipitation_mm}mm</div>
                    <div className="precip-prob">☔ {day.precipitation_probability}%</div>
                    <div className="soil">🌱 {(day.soil_moisture_index * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sources">
              <strong>Data Sources:</strong> {forecastData.data_sources.join(' • ')}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

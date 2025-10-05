# WeatherWise Architecture

## System Overview

WeatherWise is a full-stack web application that provides weather intelligence
for long-term planning and short-term decision-making.

## Architecture Diagram
┌─────────────────────────────────────────────────────────────┐<br>
│                         Frontend                             │<br>
│  React + Vite + Tailwind CSS + Recharts + Leaflet            │<br>
│  - Interactive UI                                            │<br>
│  - Visual Charts                                             │<br>
│  - Map Interface                                             │<br>
│  - Download Functionality                                    │<br>
└──────────────────┬──────────────────────────────────────────┘<br>
│ REST API (Axios)<br>
│ HTTP/JSON<br>
┌──────────────────▼──────────────────────────────────────────┐<br>
│                      Backend API                             │<br>
│              Flask + Python 3.11                             │<br>
│  - /api/health                                               │<br>
│  - /api/forecast                                             │<br>
│  - /api/historical-analysis                                  │<br>
│  - /api/download                                             │<br>
└──────────────────┬──────────────────────────────────────────┘<br>
│ HTTPS/Authentication<br>
│ Meteomatics API Client<br>
┌──────────────────▼──────────────────────────────────────────┐<br>
│                  Meteomatics API                             │<br>
│  - Processes NASA satellite data                             │<br>
│  - Provides structured weather data                          │<br>
│  - Historical and forecast data access                       │<br>
└──────────────────┬──────────────────────────────────────────┘<br>
│<br>
┌──────────────────▼──────────────────────────────────────────┐<br>
│              NASA Earth Observation Data                     │<br>
│  - GPM IMERG (Precipitation)                                 │<br>
│  - SMAP (Soil Moisture)                                      │<br>
│  - MODIS (Atmospheric Conditions)                            │<br>
│  - 20+ years of satellite observations                       │<br>
└─────────────────────────────────────────────────────────────┘<br>
## Component Details

### Frontend (React Application)

**Location:** `/frontend/src/`

**Key Components:**
- `App.jsx` - Main application component with state management
- `MapSelector.jsx` - Interactive Leaflet map for location selection

**Features:**
- Dual-mode interface (Planning vs Forecast)
- Real-time chart rendering with Recharts
- Responsive design with Tailwind CSS
- CSV/JSON export functionality
- Interactive map with click-to-select

**State Management:**
- React useState hooks for local state
- Axios for API communication
- No external state management library (keeping it simple)

### Backend (Flask API)

**Location:** `/backend/app.py`

**Key Endpoints:**

1. **GET /api/health**
   - Health check endpoint
   - Returns API status

2. **GET /api/forecast**
   - Provides 7-day weather forecast
   - Parameters: lat, lon, activity, crop
   - Returns: Forecast data with risk analysis

3. **GET /api/historical-analysis**
   - Analyzes 20 years of historical data
   - Parameters: lat, lon, date, activity, crop
   - Returns: Statistical probability analysis

4. **POST /api/download**
   - Generates downloadable reports
   - Parameters: format (csv/json), data
   - Returns: Formatted file for download

**Core Functions:**
- `fetch_real_meteomatics_data()` - Retrieves NASA data via API
- `generate_historical_analysis()` - Calculates probabilities
- `calculate_extreme_events()` - Analyzes extreme weather
- `calculate_risk_score()` - Activity-specific risk assessment

### Data Integration Layer

**Meteomatics API Integration:**
- Authentication: HTTP Basic Auth
- Base URL: https://api.meteomatics.com
- Data Format: JSON responses
- Historical Range: 2014-2024 (10 years)

**Parameters Retrieved:**
- `t_2m:C` - Temperature at 2 meters (Celsius)
- `precip_24h:mm` - 24-hour precipitation
- `relative_humidity_2m:p` - Relative humidity
- `wind_speed_10m:ms` - Wind speed at 10 meters

### Analysis Algorithms

**Historical Probability Calculation:**
```python
probability = (favorable_occurrences / total_years) * 100
```
**Risk Score Algorithm**
```python
risk_score = min(
    rain_risk + soil_risk + wind_risk,
    100
)
```
- Weighted based on activity type
- Considers precipitation, soil moisture, wind
- Returns 0-100 scale (lower = better conditions)

**Extreme Event Detection:**

- Temperature threshold exceedance
- Precipitation intensity analysis
- Multi-day event pattern recognition
- Severity classification (LOW/MODERATE/HIGH)

## Data Flow
### Planning Mode Flow:
User Input (location, date, activity)<br>
    ↓<br>
Frontend sends GET /api/historical-analysis<br>
    ↓<br>
Backend queries Meteomatics for 10-year history<br>
    ↓<br>
Statistical analysis calculates probabilities<br>
    ↓<br>
Extreme events analyzed<br>
    ↓<br>
Risk score computed<br>
    ↓<br>
JSON response with complete analysis<br>
    ↓<br>
Frontend renders charts, stats, insights<br>
    ↓<br>
User can download CSV/JSON report<br>

## Technology Stack
### Frontend:

- React 18.3.1
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Recharts 2.12.0
- Leaflet 1.9.4
- React-Leaflet 4.2.1
- Axios 1.7.2

### Backend:

- Python 3.11+
- Flask 3.0.0
- Flask-CORS 4.0.0
- Requests 2.31.0

## Deployment:

- **Frontend:** Vercel/Netlify ready
- **Backend:** Railway/Render compatible
- **Environment:** Node.js 18+, Python 3.11+

## Security Considerations

- CORS properly configured for cross-origin requests
- API credentials stored in environment variables
- No user data collection or storage
- Rate limiting ready for production deployment

## Scalability
**Current architecture supports:**

- ~1000 requests/hour (Meteomatics free tier)
- Stateless API design (horizontal scaling ready)
- Caching layer can be added for frequently accessed locations
- Database integration ready (currently memory-based for speed)

## Future Architecture Enhancements

- Redis caching layer for API responses
- PostgreSQL database for user preferences
- WebSocket connections for real-time updates
- CDN integration for global performance
- Kubernetes deployment for auto-scaling


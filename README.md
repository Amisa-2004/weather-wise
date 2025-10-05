# WeatherWise - NASA Space Apps Challenge 2025

## Will It Rain On My Parade?

[![NASA Space Apps 2025](https://img.shields.io/badge/NASA%20Space%20Apps-2025-blue)](https://www.spaceappschallenge.org/)

WeatherWise is a dual-mode weather intelligence platform that transforms NASA Earth observation data into actionable probability-based forecasts for long-term planning and short-term decision-making.

## 🎥 Demo Video
[Link to your video - add after upload]

## 🚀 Live Demo
[Link to deployed app - if you deploy]

## 📊 Features

- **Planning Mode**: 20+ years of NASA satellite data analysis for long-term planning
- **Forecast Mode**: Precise 7-day forecasts for immediate decisions
- **Interactive Map**: Click-to-select location interface
- **Extreme Events Analysis**: Heat waves, heavy rainfall, dangerous winds
- **Climate Trends**: Long-term pattern analysis from NASA observations
- **Visual Charts**: Interactive probability and trend visualizations
- **Download Reports**: Export analysis in CSV and JSON formats

## 🛰️ Data Sources

- NASA GPM IMERG (Global Precipitation Measurement)
- NASA SMAP (Soil Moisture Active Passive)
- NASA MODIS (Atmospheric Conditions)
- Meteomatics Weather API (NASA data processing partner)

## 🛠️ Technology Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Recharts (data visualization)
- Leaflet.js (interactive maps)
- React DatePicker

**Backend:**
- Python 3.11 + Flask
- Meteomatics API integration
- Real-time NASA data processing

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Meteomatics API credentials

### Installation

**⚙️ Prerequisites**

Make sure you have the following installed:

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js + npm](https://nodejs.org/)

1. Clone the repository
```bash
git clone https://github.com/Amisa-2004/weatherwise-nasa.git
cd weatherwise-nasa
```
---
**BACKEND**
1. Your path should look like: **C:\Users\Desktop\WeatherWise\backend>**
2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate      # On macOS/Linux
venv\Scripts\activate         # On Windows
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Add meteomatics credentials
```bash
METEOMATICS_USERNAME = "your_username"
METEOMATICS_PASSWORD = "your_password"
```
5. Run the flask server:
```bash
flask run
```
By default, the server will run at: http://localhost:5000
<br />
⚠️ Make sure FLASK_APP=app.py is set. You can set it with:
```bash
export FLASK_APP=app.py       # macOS/Linux
set FLASK_APP=app.py          # Windows
```

---
**FRONTEND**
1. Open a new command prompt KEEP the backend terminal running. Navigate to the frontend folder. Your path should look like **C:\Users\Desktop\WeatherWise\frontend>**
2. Install React Dependencies
```bash
npm install
```
3. Start the React Develpoment Server
```bash
npm run dev
```
This will open your app in the browser at: http://localhost:3000

## 📖 Documentation
- Architechture Overview: https://github.com/Amisa-2004/weather-wise/blob/main/docs/architecture.md
- NASA Data Sources: https://github.com/Amisa-2004/weather-wise/blob/main/docs/nasa_data_sources.md

## 👥 Team
**Stellar Minds**

## 📝 License
MIT License - Built for NASA Space Apps Challenge 2025
---
**Built with ❤️ for NASA Space Apps Challenge 2025*

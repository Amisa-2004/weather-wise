# NASA Data Sources

## Overview

WeatherWise integrates NASA Earth observation data to provide historical weather
pattern analysis and probability-based forecasting. This document details the
specific NASA missions and datasets utilized by the platform.

## Primary Data Sources

### 1. NASA GPM IMERG
**Mission:** Global Precipitation Measurement<br>
**URL:** https://gpm.nasa.gov/data/imerg

**Data Used:**
- Precipitation measurements from satellite constellation
- 30-minute temporal resolution
- 0.1° x 0.1° spatial resolution
- Global coverage from 60°N to 60°S

**Integration:**
- Accessed via Meteomatics API
- Historical data: 2014-2024 (10+ years)
- Parameters: `precip_24h:mm` (24-hour accumulated precipitation)

**Citation:**
Huffman, G.J., E.F. Stocker, D.T. Bolvin, E.J. Nelkin, Jackson Tan (2019),
GPM IMERG Final Precipitation L3 1 day 0.1 degree x 0.1 degree V06,
Greenbelt, MD, Goddard Earth Sciences Data and Information Services Center (GES DISC),
Accessed: [Date], doi:10.5067/GPM/IMERGDF/DAY/06

### 2. NASA SMAP
**Mission:** Soil Moisture Active Passive<br>
**URL:** https://smap.jpl.nasa.gov/

**Data Used:**
- L-band radiometer soil moisture measurements
- 3-day temporal resolution
- 36 km spatial resolution
- Global coverage

**Integration:**
- Soil moisture index derived from SMAP observations
- Critical for agricultural risk assessment
- Used to determine equipment operability for harvest timing

**Citation:**
O'Neill, P. E., S. Chan, E. G. Njoku, T. Jackson, R. Bindlish, and J. Chaubell.
2021. SMAP L3 Radiometer Global Daily 36 km EASE-Grid Soil Moisture,
Version 8. Boulder, Colorado USA. NASA National Snow and Ice Data Center
Distributed Active Archive Center. doi: https://doi.org/10.5067/HH4SZ2PXSP6A

### 3. NASA MODIS
**Mission:** Moderate Resolution Imaging Spectroradiometer<br>
**URL:** https://modis.gsfc.nasa.gov/

**Data Used:**
- Atmospheric temperature profiles
- Cloud cover observations
- Atmospheric humidity measurements

**Integration:**
- Temperature data: `t_2m:C` (2-meter air temperature)
- Humidity data: `relative_humidity_2m:p`
- Cloud cover for weather condition classification

**Citation:**
NASA MODIS Adaptive Processing System, Goddard Space Flight Center, USA:
http://modis.gsfc.nasa.gov/

## Data Access Platform

### Meteomatics Weather API
**URL:** https://www.meteomatics.com/<br>
**Role:** Official NASA Space Apps Challenge Partner

Meteomatics processes and provides structured access to NASA satellite data:
- Historical weather data archive (2014-present)
- Standardized API for multiple data sources
- Quality-controlled and gap-filled datasets
- Global coverage with consistent formatting

**Why Meteomatics:**
- Direct integration with NASA data streams
- Handles complex satellite data processing
- Provides unified API for multiple NASA missions
- NASA Space Apps Challenge official partner
- Free access for hackathon participants

## Data Processing Methodology

### Historical Analysis Process

1. **Data Retrieval:**
   - Query Meteomatics API for specific date/location
   - Retrieve 10 years of historical observations (2014-2024)
   - Extract: temperature, precipitation, humidity, wind speed

2. **Quality Control:**
   - Validate data completeness
   - Handle missing values
   - Flag anomalous readings

3. **Statistical Analysis:**
   - Calculate occurrence frequencies
   - Compute probability distributions
   - Identify extreme event patterns
   - Generate confidence intervals

4. **Risk Assessment:**
   - Apply activity-specific thresholds
   - Weight factors based on use case
   - Calculate composite risk scores (0-100)

### Extreme Event Detection

**Thresholds (Location-Adjusted):**

**Extreme Heat:**
- Tropical (<20°N): >38°C (100°F)
- Subtropical (20-25°N): >40°C (104°F)
- Temperate (>25°N): >35°C (95°F)

**Extreme Rainfall:**
- Tropical: >80mm/day
- Subtropical: >70mm/day
- Temperate: >60mm/day

**Heat Wave Definition:**
- 3+ consecutive days above heat threshold
- Regional temperature threshold adjustments

**Dangerous Winds:**
- >60 km/h (>37 mph)
- Activity-disrupting wind speeds

## Data Limitations & Disclaimers

### Spatial Resolution:
- Meteomatics provides 0.1° x 0.1° grid spacing
- Approximately 11km x 11km at equator
- May not capture micro-climate variations

### Temporal Coverage:
- Historical data: 2014-2024 (10 years)
- Sufficient for statistical probability analysis
- Longer datasets provide higher confidence

### Forecast Limitations:
- 7-day forecasts are model predictions
- Historical probabilities are NOT forecasts
- Confidence decreases beyond 7 days

### Data Gaps:
- Satellite coverage may have occasional gaps
- Polar regions (>60° latitude) have limited GPM coverage
- SMAP has 3-day revisit time (interpolation used)

## Attribution Requirements

All outputs from WeatherWise include:
- Clear NASA data source attribution
- Link to original NASA mission websites
- Meteomatics processing acknowledgment
- Date of data access and version information

**Example Attribution Text:**
Data Sources: NASA GPM IMERG (Precipitation), NASA SMAP (Soil Moisture),
NASA MODIS (Atmospheric Conditions). Processed and provided via Meteomatics
Weather API. Created for NASA Space Apps Challenge 2025.

## Additional Resources

**NASA Earthdata:**
https://www.earthdata.nasa.gov/

**NASA Giovanni (Data Visualization):**
https://giovanni.gsfc.nasa.gov/giovanni/

**NASA Worldview (Satellite Imagery):**
https://worldview.earthdata.nasa.gov/

**GPM Data Access:**
https://gpm.nasa.gov/data/directory

**SMAP Data Access:**
https://nsidc.org/data/smap

**NASA Open Data Portal:**
https://data.nasa.gov/

## Contact & Support

**For data questions:**
- NASA GES DISC: gsfc-dl-help-disc@mail.nasa.gov
- Meteomatics Support: support@meteomatics.com

**For WeatherWise technical questions:**
- GitHub Issues: https://github.com/Amisa-2004/weather-wise.git
- Team Contact: 2401021086@cgu-odisha.ac.in
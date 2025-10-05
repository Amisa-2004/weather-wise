import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng]
      setPosition(newPos)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : <Marker position={position} />
}

function MapSelector({ onLocationSelect, initialLat = 20.0, initialLon = 73.5 }) {
  const [position, setPosition] = useState([parseFloat(initialLat), parseFloat(initialLon)])

  return (
    <div className="map-container">
      <div className="map-instructions">
        📍 Click anywhere on the map to select a location
      </div>
      <MapContainer 
        center={position} 
        zoom={6} 
        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          position={position} 
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  )
}

export default MapSelector
import { Marker, Popup, TileLayer, MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReferralDataMarkers from "../data/referral_data.json";
import FacilityPopup from "./FacilityPopup";
import type { FacilityRecord, FacilityType, Blank } from "./FacilityPopup";
import { renderToStaticMarkup } from 'react-dom/server';
import { Stethoscope, Activity, Hospital, Pill } from 'lucide-react';
import * as L from "leaflet";
import MapLegend from "./MapLegend";

const getMarkerStyle = (type: FacilityType | Blank) => {
  switch (type) {
    case 'Primary Health Center':
      return { color: '#2563eb', Icon: Stethoscope };
    case 'Secondary Health Facility':
      return { color: '#dc2626', Icon: Hospital };
    case 'Health Post':
      return { color: '#16a34a', Icon: Activity };
    default:
      return { color: '#ea580c', Icon: Pill };
  }
};

export const createCustomIcon = (facilityType: FacilityType | Blank) => {
  const { color, Icon } = getMarkerStyle(facilityType);

  const iconHtml = renderToStaticMarkup(
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: color,
      color: 'white',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    }}>
      <Icon size={18} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-pin', // custom class name to reset default styles
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const ReferralMap = () => {
  return (
    <MapContainer center={[21.1945, 92.151564]} zoom={14.5}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {(ReferralDataMarkers as FacilityRecord[]).map((markerData, index) => {
        const latitude = Number(markerData.Latitude);
        const longitude = Number(markerData.Longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return (
          <Marker key={`${markerData["Facility Name"] || "facility"}-${index}`} position={[latitude, longitude]} icon={createCustomIcon(markerData["Facility Type"])}>
            <Popup>
              <FacilityPopup facility={markerData} />
            </Popup>
          </Marker>
        );
      })}
    <MapLegend />
    </MapContainer>
  );
};

export default ReferralMap;
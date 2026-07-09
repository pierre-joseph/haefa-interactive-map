import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReferralDataMarkers from "../data/referral_data.json";
import FacilityPopup from "./FacilityPopup";
import type { FacilityRecord, FacilityType, Blank } from "./FacilityPopup";
import { renderToStaticMarkup } from "react-dom/server";
import { Activity, Hospital, Pill, Stethoscope } from "lucide-react";
import * as L from "leaflet";
import MapLegend from "./MapLegend";
import { useMemo, useState } from "react";
import FilterPanel from "./FilterPanel";
import "./ReferralMap.css";

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

const createCustomIcon = (facilityType: FacilityType | Blank) => {
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
    className: "custom-marker-pin",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const initialFilters = {
  query: "",
  names: [] as string[],
  types: [] as string[],
  services: [] as string[],
  camps: [] as string[],
  agencies: [] as string[],
};

const matchesQuery = (facility: FacilityRecord, q: string) => {
  if (!q) return true;
  const lq = q.trim().toLowerCase();
  const keys = ["Facility Name", "Implementing Agency", "Facility Type", "Camp Name"] as const;
  return keys.some((k) => {
    const v = facility[k];
    return v !== undefined && String(v).toLowerCase().includes(lq);
  });
};

const hasTypes = (facility: FacilityRecord, types: string[]) => {
  if (!types || types.length === 0) return true;
  return types.includes(facility["Facility Type"] as string);
};

const hasNames = (facility: FacilityRecord, names: string[]) => {
  if (!names || names.length === 0) return true;
  return names.includes(facility["Facility Name"] as string);
};

const hasAgencies = (facility: FacilityRecord, agencies: string[]) => {
  if (!agencies || agencies.length === 0) return true;
  return agencies.includes(facility["Implementing Agency"] as string);
};


const hasServices = (facility: FacilityRecord, services: string[]) => {
  if (!services || services.length === 0) return true;
  return services.every((s) => facility[s as keyof FacilityRecord] === "Available");
};

const matchesLocation = (facility: FacilityRecord, camps: string[]) => {
  if (camps && camps.length > 0 && !camps.includes(String(facility["Camp Name"] ?? ""))) return false;
  return true;
};

const ReferralMap = () => {
  const [filters, setFilters] = useState(initialFilters);

  const facilities = ReferralDataMarkers as FacilityRecord[];

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      if (!matchesQuery(f, filters.query)) return false;
      if (!hasTypes(f, filters.types)) return false;
      if (!matchesLocation(f, filters.camps)) return false;
      if (!hasServices(f, filters.services)) return false;
      if (!hasNames(f, filters.names)) return false;
      if (!hasAgencies(f, filters.agencies)) return false;
      const latitude = Number(f.Latitude);
      const longitude = Number(f.Longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
      return true;
    });
  }, [facilities, filters]);

  return (
    <div className="referral-map__wrap">
      <FilterPanel facilities={facilities} filters={filters} onChange={setFilters} />

      <MapContainer
        center={[21.1945, 92.151564]}
        zoom={14}
        scrollWheelZoom={false}
        className="referral-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles courtesy of <a href="https://www.hotosm.org/" target="_blank" rel="noreferrer">Humanitarian OpenStreetMap Team</a>'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {filteredFacilities.map((markerData, index) => {
          const latitude = Number(markerData.Latitude);
          const longitude = Number(markerData.Longitude);

          return (
            <Marker key={`${markerData["Facility Name"] || "facility"}-${index}`} position={[latitude, longitude]} icon={createCustomIcon(markerData["Facility Type"]) }>
              <Popup>
                <FacilityPopup facility={markerData} />
              </Popup>
            </Marker>
          );
        })}
        <MapLegend />
      </MapContainer>
    </div>
  );
};

export default ReferralMap;
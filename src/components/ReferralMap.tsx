import { useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BedDouble, Hospital, Cross, Syringe } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import ReferralDataMarkers from "../data/referral_data.json";
import campGeoJson from "../data/camp_outlines.json";
import FacilityPopup from "./FacilityPopup";
import type { FacilityRecord, FacilityType, Blank } from "./FacilityPopup";
import MapLegend from "./MapLegend";
import FilterPanel from "./FilterPanel";
import { useTranslation } from 'react-i18next';
import "./ReferralMap.css";

const getMarkerStyle = (type: FacilityType | Blank) => {
  switch (type) {
    case 'Primary Health Center':
      return { color: '#2563eb', Icon: BedDouble };
    case 'Secondary Health Facility':
      return { color: '#dc2626', Icon: Hospital };
    case 'Health Post':
      return { color: '#16a34a', Icon: Cross };
    default:
      return { color: '#ea580c', Icon: Syringe };
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

const coordinateKey = (latitude: number, longitude: number) => `${latitude},${longitude}`;

const OverlapMarkerPopup = ({ facilities }: { facilities: FacilityRecord[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFacility = facilities[Math.min(activeIndex, facilities.length - 1)];

  return (
    <div className="facility-popup-shell facility-popup-shell--overlap">
      <div className="facility-overlap">
        <div className="facility-overlap__header">
          <div>
            <p className="facility-overlap__kicker">{facilities.length} facilities</p>
            <h4 className="facility-overlap__title">Share this exact location</h4>
          </div>
        </div>

        <div className="facility-overlap__list" role="list" aria-label="Facilities at this location">
          {facilities.map((facility, index) => (
            <button
              key={`${String(facility["Facility Name"] ?? "facility")}-${index}`}
              type="button"
              className={`facility-overlap__item ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="facility-overlap__name">{String(facility["Facility Name"] ?? "Unnamed facility")}</span>
              <span className="facility-overlap__meta">
                {String(facility["Facility Type"] ?? "")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeFacility && (
        <div className="facility-overlap__detail">
          <FacilityPopup facility={activeFacility} />
        </div>
      )}
    </div>
  );
};

const ReferralMap = () => {
  const [filters, setFilters] = useState(initialFilters);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

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

  const facilityGroups = useMemo(() => {
    const groups = new Map<string, FacilityRecord[]>();

    filteredFacilities.forEach((facility) => {
      const latitude = Number(facility.Latitude);
      const longitude = Number(facility.Longitude);
      const key = coordinateKey(latitude, longitude);
      const bucket = groups.get(key) ?? [];
      bucket.push(facility);
      groups.set(key, bucket);
    });

    return Array.from(groups.values()).map((group) =>
      group.slice().sort((left, right) => {
        const leftName = String(left["Facility Name"] ?? "");
        const rightName = String(right["Facility Name"] ?? "");
        return leftName.localeCompare(rightName);
      })
    );
  }, [filteredFacilities]);


  const getCampStyle = (feature: any) => {
    const campName = feature.properties.NPMCamp;
    const isSelected = filters.camps.includes(campName);

    return {
      fillColor: isSelected ? '#2563eb' : '#64748b',
      fillOpacity: isSelected ? 0.25 : 0.05,
      color: isSelected ? '#1d4ed8' : '#64748b',
      weight: isSelected ? 3 : 1,
      dashArray: isSelected ? '' : '4, 4',
    };
  };

  const onEachCamp = (feature: any, layer: L.Layer) => {
    const campName = feature.properties.NPMCamp;

    layer.on({
      click: () => {
        setFilters((prev) => ({
          ...prev,
          camps: prev.camps.includes(campName)
            ? prev.camps.filter((c) => c !== campName)
            : [...prev.camps, campName],
        }));
      },
    });

    if (campName) {
      layer.bindTooltip(`<b>${campName}</b>`, { sticky: true });
    }
  };

  const { t } = useTranslation();

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
          attribution={t('map.attribution')}
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        <GeoJSON
          key={filters.camps.join(',')} 
          ref={geoJsonRef}
          data={campGeoJson as any}
          style={getCampStyle}
          onEachFeature={onEachCamp}
        />

        {facilityGroups.map((group, index) => {
          const facility = group[0];
          const latitude = Number(facility.Latitude);
          const longitude = Number(facility.Longitude);
          const isOverlapping = group.length > 1;

          return (
            <Marker
              key={`${coordinateKey(latitude, longitude)}-${index}`}
              position={[latitude, longitude]}
              icon={createCustomIcon(facility["Facility Type"])}
              riseOnHover
              zIndexOffset={isOverlapping ? 1000 : 0}
            >
              <Popup
                className="facility-popup-shell"
                autoPan
                keepInView
                autoPanPadding={L.point(24, 24)}
                maxWidth={380}
                minWidth={240}
              >
                {isOverlapping ? (
                  <OverlapMarkerPopup facilities={group} />
                ) : (
                  <FacilityPopup facility={facility} />
                )}
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
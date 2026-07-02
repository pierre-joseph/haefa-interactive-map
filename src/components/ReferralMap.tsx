import { Marker, Popup, TileLayer, MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReferralDataMarkers from "../data/referral_data.json";
import FacilityPopup from "./FacilityPopup";

type ReferralFacility = {
  Latitude?: number | string;
  Longitude?: number | string;
  [key: string]: string | number | undefined;
};

const ReferralMap = () => {
  return (
    <MapContainer center={[21.1945, 92.151564]} zoom={14.5}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {(ReferralDataMarkers as ReferralFacility[]).map((markerData, index) => {
        const latitude = Number(markerData.Latitude);
        const longitude = Number(markerData.Longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return (
          <Marker key={`${markerData["Facility Name"] || "facility"}-${index}`} position={[latitude, longitude]}>
            <Popup>
              <FacilityPopup facility={markerData} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default ReferralMap;
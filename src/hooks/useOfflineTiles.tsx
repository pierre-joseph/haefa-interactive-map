import { useEffect } from "react";
import L from "leaflet";
import "leaflet.offline";

export function useOfflineTiles(
  map: L.Map | null,
  tileUrl: string,
  attribution: string,
  minZoom = 12,
  maxZoom = 16
) {
  useEffect(() => {
    if (!map) return;

    const offlineLayer = (L.tileLayer as any).offline(tileUrl, {
      attribution,
    }).addTo(map);

    const control = (L.control as any).savetiles(offlineLayer, {
      zoomlevels: Array.from(
        { length: maxZoom - minZoom + 1 },
        (_, i) => minZoom + i
      ),
      confirm(layer: any, succCallback: () => void) {
        if (window.confirm(`Save ${layer._tilesforSave.length} tiles for offline use?`)) {
          succCallback();
        }
      },
      confirmRemoval(_layer: any, succCallback: () => void) {
        if (window.confirm("Remove all cached tiles?")) succCallback();
      },
    }).addTo(map);

    return () => {
      map.removeControl(control);
      map.removeLayer(offlineLayer);
    };
  }, [map, tileUrl, attribution, minZoom, maxZoom]);
}
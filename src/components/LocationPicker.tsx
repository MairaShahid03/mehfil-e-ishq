import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { MapPin, Search, Loader2 } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 31.5204, lng: 74.3587 }; // Lahore

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#d4a843" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e0e0e" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
];

interface LocationPickerProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (location: string, lat: number | null, lng: number | null) => void;
}

const LocationPicker = ({ location, latitude, longitude, onLocationChange }: LocationPickerProps) => {
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          onLocationChange(results[0].formatted_address, lat, lng);
        } else {
          onLocationChange(`${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng);
        }
      });
    },
    [onLocationChange]
  );

  const onPlaceSelected = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarkerPos({ lat, lng });
      onLocationChange(place.formatted_address || place.name || "", lat, lng);
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border-2 border-gold/20 bg-noir/50">
          <div className="flex items-center gap-2 text-gold mb-3">
            <MapPin size={18} />
            <span className="font-heading text-sm">Event Location</span>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value, null, null)}
            className="w-full px-4 py-3 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            placeholder="Enter venue address or location..."
          />
          <p className="text-ivory/30 text-xs mt-2">
            Add VITE_GOOGLE_MAPS_API_KEY to enable interactive map
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 rounded-xl border-2 border-destructive/30 bg-noir/50 text-ivory/60 text-sm">
        Failed to load Google Maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[300px] rounded-xl border-2 border-gold/20 bg-noir/50">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Autocomplete
          onLoad={(ac) => (autocompleteRef.current = ac)}
          onPlaceChanged={onPlaceSelected}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={16} />
            <input
              type="text"
              defaultValue={location}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              placeholder="Search for a venue or address..."
            />
          </div>
        </Autocomplete>
      </div>

      <div className="rounded-xl overflow-hidden border-2 border-gold/20">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPos || defaultCenter}
          zoom={markerPos ? 15 : 12}
          onClick={onMapClick}
          options={{
            styles: darkMapStyles,
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {markerPos && <Marker position={markerPos} />}
        </GoogleMap>
      </div>

      {location && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/10 border border-gold/20">
          <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-ivory text-sm font-medium">{location}</p>
            {markerPos && (
              <p className="text-ivory/40 text-xs mt-1">
                {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

import "maplibre-gl/dist/maplibre-gl.css";

import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import { useRef, useState } from "react";

import CoordinateInput from "@/components/CoordinateInput";
import { ModeToggle } from "@/components/ModeToggle";
import SearchResultPlaces from "@/components/SearchResultPlaces";
import { ThemeProvider } from "@/components/theme-provider";
import YouAreHere from "@/components/YouAreHere";

interface LocationDetails {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  url?: string;
}

export default function Home() {
  const [viewState, setViewState] = useState({
    longitude: 77.1175,
    latitude: 28.75,
    zoom: 14,
  });

  const [locations, setLocations] = useState<LocationDetails[]>([]);

  const mapRef = useRef<any>(null);

  const handleCoordinateUpdate = (
    coords: { latitude: number; longitude: number },
    locationDetails?: LocationDetails[]
  ) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [coords.longitude, coords.latitude],
        zoom: 14,
        essential: true,
      });
    }

    if (locationDetails && locationDetails.length > 0) {
      setLocations(locationDetails);
    }
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative h-screen w-screen overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <ModeToggle />
        </div>

        <Map
          {...viewState}
          ref={mapRef}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        >
          <GeolocateControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />

          {locations.length === 0 && <YouAreHere />}

          <SearchResultPlaces locationDetails={locations} />

          <CoordinateInput
            setCoordinates={(coords, details) =>
              handleCoordinateUpdate(coords, details)
            }
            mapRef={mapRef}
          />
        </Map>
      </div>
    </ThemeProvider>
  );
}

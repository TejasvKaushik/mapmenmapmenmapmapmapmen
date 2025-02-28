import "maplibre-gl/dist/maplibre-gl.css";

import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";

import CoordinateInput from "@/components/CoordinateInput";
import SearchResultPlaces from "@/components/SearchResultPlaces";
import YouAreHere from "@/components/YouAreHere";
import { useState } from "react";

export default function Home() {
  const [viewState, setViewState] = useState({
    longitude: 100,
    latitude: 40,
    zoom: 14,
  });

  return (
    <div className="relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: 1200, height: 700 }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        <YouAreHere />
        <CoordinateInput
          setCoordinates={(coords) => setViewState({ ...viewState, ...coords })}
        />
      </Map>
    </div>
  );
}

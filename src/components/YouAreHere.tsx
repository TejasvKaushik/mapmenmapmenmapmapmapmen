import { Marker, useMap } from "react-map-gl/maplibre";
import React, { useEffect, useState } from "react";

import { useTheme } from "next-themes";

type YouAreHereProps = Record<string, never>;

const dtuCoordinates: [number, number] = [28.75, 77.1175];

const YouAreHere: React.FC<YouAreHereProps> = () => {
  const [userLocation, setUserLocation] =
    useState<[number, number]>(dtuCoordinates);
  const { current: map } = useMap();
  const { theme } = useTheme();

  useEffect(() => {
    if (!map) return;
    (async () => {
      const location: [number, number] = await new Promise<[number, number]>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve([position.coords.longitude, position.coords.latitude]),
            () => resolve(dtuCoordinates)
          );
        }
      );

      if (location !== dtuCoordinates) {
        setUserLocation(location);
        map.flyTo({ center: location, zoom: 14 });
      }
    })();
  }, [map]);

  if (!map) return null;

  return (
    <>
      {userLocation && (
        <Marker
          longitude={userLocation[0]}
          latitude={userLocation[1]}
          anchor="bottom"
        >
          <div
            className={`p-2 rounded-full shadow-md text-white ${
              theme === "dark" ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            📍 You are here!
          </div>
        </Marker>
      )}
    </>
  );
};

export default YouAreHere;

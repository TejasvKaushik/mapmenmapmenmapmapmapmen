import { Marker, useMap } from "react-map-gl/maplibre";
import React, { useEffect, useState } from "react";

type YouAreHereProps = {};

const middleOfUSA: [number, number] = [-100, 40];

const YouAreHere: React.FC<YouAreHereProps> = () => {
  const [userLocation, setUserLocation] =
    useState<[number, number]>(middleOfUSA);
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;
    (async () => {
      const location: [number, number] = await new Promise<[number, number]>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve([position.coords.longitude, position.coords.latitude]),
            () => resolve(middleOfUSA) // Ensure it always resolves to [number, number]
          );
        }
      );

      if (location !== middleOfUSA) {
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
          <div className="bg-blue-500 p-2 rounded-full shadow-md text-white">
            📍 You are here!
          </div>
        </Marker>
      )}
    </>
  );
};

export default YouAreHere;

import { Marker, Popup } from "react-map-gl/maplibre";
import React, { useMemo, useState } from "react";

import Pin from "@/maputils/pin";
import { cn } from "@/lib/utils"; // Import cn from shadcn
import { useTheme } from "next-themes";

interface LocationDetails {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  url?: string;
}

type SearchResultPlacesProps = {
  locationDetails: LocationDetails[];
  onSelectLocation?: (location: LocationDetails) => void;
};

const SearchResultPlaces: React.FC<SearchResultPlacesProps> = ({
  locationDetails,
  onSelectLocation,
}) => {
  const { theme } = useTheme(); // Get current theme
  const [popupInfo, setPopupInfo] = useState<LocationDetails | null>(null);

  const pins = useMemo(
    () =>
      locationDetails.map((location, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(location);
            if (onSelectLocation) onSelectLocation(location);
          }}
        >
          <Pin />
        </Marker>
      )),
    [locationDetails, onSelectLocation]
  );

  return (
    <>
      {pins}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => setPopupInfo(null)}
        >
          <div
            className={cn(
              "p-2 max-w-xs rounded-md shadow-md",
              theme === "dark"
                ? "bg-zinc-800 text-white"
                : "bg-white text-black"
            )}
          >
            <h3 className="font-bold text-sm">{popupInfo.name}</h3>
            {popupInfo.address && (
              <p className="text-xs text-zinc-500">{popupInfo.address}</p>
            )}
            {popupInfo.url && (
              <a
                href={popupInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-700 mt-1 block break-words"
              >
                {popupInfo.url}
              </a>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default SearchResultPlaces;

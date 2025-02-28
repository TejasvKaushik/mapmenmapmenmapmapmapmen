import {
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl/maplibre";
import React, { useMemo, useState } from "react";

import ControlPanel from "@/maputils/control-panel";
import Pin from "@/maputils/pin";

interface LocationDetails {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  url?: string;
}

type SearchResultPlacesProps = {
  locationDetails: LocationDetails[];
};

const SearchResultPlaces: React.FC<SearchResultPlacesProps> = ({
  locationDetails,
}) => {
  const [popupInfo, setPopupInfo] = useState(null);

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
          }}
        >
          <Pin />
        </Marker>
      )),
    []
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
          <div>
            {popupInfo.city}, {popupInfo.state} |{" "}
          </div>
        </Popup>
      )}
      <ControlPanel />
    </>
  );
};
export default SearchResultPlaces;

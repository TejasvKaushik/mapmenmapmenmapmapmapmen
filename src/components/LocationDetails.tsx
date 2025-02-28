import React from "react";

interface LocationDetails {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  url?: string;
}

interface LocationDetailsDisplayProps {
  locationDetails: LocationDetails[];
  isLoading: boolean;
}

const LocationDetailsDisplay: React.FC<LocationDetailsDisplayProps> = ({
  locationDetails,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-4 right-4 bg-white p-6 shadow-lg rounded-lg z-10 w-80">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">Loading city details...</p>
        </div>
      </div>
    );
  }

  if (locationDetails.length === 0) {
    return (
      <div className="absolute top-4 right-4 bg-white p-6 shadow-lg rounded-lg z-10 w-80">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">Search for a city to see details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 p-6 shadow-lg rounded-lg z-10 w-80 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">City Details</h2>
      {locationDetails.map((detail, index) => (
        <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold text-lg text-blue-600 mb-2">
            {detail.name}
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="col-span-1 text-gray-600">Latitude:</div>
            <div className="col-span-2 font-medium">{detail.latitude}</div>

            <div className="col-span-1 text-gray-600">Longitude:</div>
            <div className="col-span-2 font-medium">{detail.longitude}</div>
          </div>

          {detail.address && (
            <div className="mb-2">
              <div className="text-gray-600">Address:</div>
              <div className="font-medium">{detail.address}</div>
            </div>
          )}

          {detail.url && (
            <div className="mt-2">
              <div className="text-gray-600">More Info:</div>
              <a
                href={detail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-words"
              >
                {detail.url}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LocationDetailsDisplay;

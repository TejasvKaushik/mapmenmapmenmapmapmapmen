import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

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
  onLocationClick: (latitude: number, longitude: number) => void;
}

const LocationDetailsDisplay: React.FC<LocationDetailsDisplayProps> = ({
  locationDetails,
  isLoading,
  onLocationClick,
}) => {
  const { theme } = useTheme();

  if (isLoading) return null;
  if (locationDetails.length === 0) return null;

  return (
    <div className="absolute top-1/2 right-6 transform -translate-y-1/2 w-80 max-h-96 no-scrollbar overflow-y-auto">
      {locationDetails.map((detail, index) => (
        <div
          key={index}
          className={cn(
            "mb-4 p-3 rounded cursor-pointer",
            theme === "dark"
              ? "bg-zinc-800 text-gray-300"
              : "bg-gray-50 text-black"
          )}
          onClick={() => onLocationClick(detail.latitude, detail.longitude)}
        >
          <h3 className="font-semibold text-lg text-primary mb-2">
            {detail.name}
          </h3>

          {detail.address && (
            <div className="mb-2">
              <div className="font-medium">{detail.address}</div>
            </div>
          )}

          {detail.url && (
            <div className="mt-2">
              <a
                href={detail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-words dark:text-blue-400"
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

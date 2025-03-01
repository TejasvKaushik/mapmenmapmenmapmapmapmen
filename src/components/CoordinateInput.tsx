import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import LocationDetailsDisplay from "./LocationDetails";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "next-themes";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

let genAI: any = null;
let model: any = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

interface CoordinateInputProps {
  setCoordinates: (
    coords: { latitude: number; longitude: number },
    locationDetails?: CityDetails[]
  ) => void;
  mapRef: React.RefObject<any>;
}

interface CityDetails {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  url?: string;
}

export default function CoordinateInput({
  setCoordinates,
  mapRef,
}: CoordinateInputProps) {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [cityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    if (!city.trim()) {
      setApiError("Please enter a city name");
      setIsLoading(false);
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      setCoordinates({ latitude: lat, longitude: lon }, []);
    }

    if (!model) {
      setApiError("API key is missing. Please add GEMINI_API_KEY.");
      setIsLoading(false);
      return;
    }

    const searchSystemPrompt =
      'Output in JSON only with keys: "latitude", "longitude", "name", "address", and "url" if available. Output as an array only.';

    const cityPrompt = `Find details about ${city}. ${searchSystemPrompt}`;

    try {
      const result = await model.generateContent(cityPrompt);
      const responseText = result.response.text();

      try {
        const startIndex = responseText.indexOf("[");
        const endIndex = responseText.lastIndexOf("]");
        let jsonString = responseText;

        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          jsonString = responseText.substring(startIndex, endIndex + 1);
        }

        const parsedData = JSON.parse(jsonString) as CityDetails[];
        setCityDetails(parsedData);

        if (
          parsedData.length > 0 &&
          parsedData[0].latitude &&
          parsedData[0].longitude
        ) {
          setCoordinates(
            {
              latitude: parsedData[0].latitude,
              longitude: parsedData[0].longitude,
            },
            parsedData
          );

          setLatitude(parsedData[0].latitude.toString());
          setLongitude(parsedData[0].longitude.toString());
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        setApiError("Error parsing response data.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setApiError("Error connecting to Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationClick = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 14,
        essential: true,
      });
    }
  };

  return (
    <div>
      <Card
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 p-4 shadow-lg w-80",
          theme === "dark"
            ? "dark:bg-zinc-900 dark:text-white"
            : "bg-white text-black"
        )}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-x-2">
          <Input
            type="text"
            placeholder="Stadiums in Liverpool"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow p-2"
          />
          <Button
            type="submit"
            className="px-4 py-2 w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </form>
      </Card>
      <LocationDetailsDisplay
        locationDetails={cityDetails}
        isLoading={isLoading}
        onLocationClick={handleLocationClick}
      />
    </div>
  );
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import LocationDetailsDisplay from "./LocationDetails";
import SearchResultPlaces from "./SearchResultPlaces";
import { useState } from "react";

// For Next.js, client-side accessible environment variables need to be prefixed with NEXT_PUBLIC_
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Initialize the API only if we have a key
let genAI: any = null;
let model: any = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

interface CoordinateInputProps {
  setCoordinates: (coords: { latitude: number; longitude: number }) => void;
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
}: CoordinateInputProps) {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [cityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    // Check if a city was entered
    if (!city.trim()) {
      setApiError("Please enter a city name");
      setIsLoading(false);
      return;
    }

    // Use manual coordinates if provided
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      setCoordinates({ latitude: lat, longitude: lon });
    }

    // Check if API is initialized
    if (!model) {
      setApiError(
        "API key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file."
      );
      setIsLoading(false);
      return;
    }

    // System prompt to get structured JSON output
    const searchSystemPrompt =
      'Output in JSON only with keys: "latitude", "longitude", "name", "address", and "url" if available. Output as an array only.';

    // Create a prompt to get city details
    const cityPrompt = `Find details about ${city}. ${searchSystemPrompt}`;

    try {
      const result = await model.generateContent(cityPrompt);
      const responseText = result.response.text();
      // console.log("Raw response:", responseText);

      // Parse the JSON response
      try {
        // Extract JSON from the response without using the 's' flag
        // First try to find opening and closing brackets
        const startIndex = responseText.indexOf("[");
        const endIndex = responseText.lastIndexOf("]");

        let jsonString = responseText;

        // If we found valid brackets, extract just that portion
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          jsonString = responseText.substring(startIndex, endIndex + 1);
        }

        const parsedData = JSON.parse(jsonString) as CityDetails[];
        setCityDetails(parsedData);
        console.log(cityDetails);

        // If we got coordinates, use them
        if (
          parsedData.length > 0 &&
          parsedData[0].latitude &&
          parsedData[0].longitude
        ) {
          setCoordinates({
            latitude: parsedData[0].latitude,
            longitude: parsedData[0].longitude,
          });

          // Update the input fields with the retrieved coordinates
          setLatitude(parsedData[0].latitude.toString());
          setLongitude(parsedData[0].longitude.toString());
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        setApiError("Error parsing response data. Check console for details.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setApiError("Error connecting to Gemini API. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute bottom-4 left-1/2 bg-white p-4 shadow-lg rounded-lg z-10 w-80">
        <h2 className="text-xl font-bold mb-3">City Search</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block mb-2 p-2 border rounded w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white p-2 rounded mb-2 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search City"}
          </button>
          {apiError && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
              {apiError}
            </div>
          )}
        </form>
      </div>

      <LocationDetailsDisplay
        locationDetails={cityDetails}
        isLoading={isLoading}
      />

      <SearchResultPlaces locationDetails={cityDetails} />
    </>
  );
}

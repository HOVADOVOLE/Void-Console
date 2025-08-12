import type {
  ApodData,
  NeoFeedData,
  MarsPhotoResponse,
  MarsManifest,
  SolarFlare,
  GeomagneticStorm,
  EpicImage,
  EonetResponse,
} from "../types/nasa";

const NASA_BASE_URL = "https://api.nasa.gov";
const API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

/**
 * Fallback funkce pro přímé volání NASA API, pokud Supabase Proxy není dostupná.
 */
const directFetch = async <T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> => {
  // Pokud endpoint začíná na http, použijeme ho jako absolutní URL (pro EONET)
  let urlStr = endpoint.startsWith("http")
    ? endpoint
    : `${NASA_BASE_URL}${endpoint}`;

  const url = new URL(urlStr);

  // Přidáme API KEY pouze pokud voláme api.nasa.gov (EONET ho nepotřebuje)
  if (url.hostname === "api.nasa.gov") {
    url.searchParams.append("api_key", API_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    console.error(`NASA API Error [${response.status}] at ${url.toString()}`);

    // Specifický handling pro EPIC (často hází 503)
    if (response.status === 503 && endpoint.includes("EPIC")) {
      console.warn("EPIC Service Unavailable - returning empty data");
      return [] as any; // Vracíme prázdné pole, aby UI zobrazilo "No Signal"
    }

    throw new Error(
      `NASA API Error: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
};

/**
 * Získá Astronomy Picture of the Day.
 */
export const fetchApod = async (date?: string): Promise<ApodData> => {
  const params: Record<string, string> = {};
  if (date && typeof date === "string") params.date = date;

  // PROXY DISABLED FOR LOCAL DEVELOPMENT TO PREVENT CORS ERRORS
  // try {
  //   return await callNasaApi('planetary/apod', params);
  // } catch (error) { ... }

  return directFetch<ApodData>("/planetary/apod", params);
};

/**
 * Získá seznam blízkozemních objektů (NEO) pro dané období.
 * @param startDate Formát YYYY-MM-DD
 * @param endDate Formát YYYY-MM-DD
 */
export const fetchNeoFeed = async (
  startDate: string,
  endDate: string,
): Promise<NeoFeedData> => {
  const params = { start_date: startDate, end_date: endDate };
  return directFetch<NeoFeedData>("/neo/rest/v1/feed", params);
};

/**
 * Získá fotky z Mars Roveru.
 * @param rover Name of the rover (curiosity, opportunity, spirit)
 * @param sol Martian sol (day)
 * @param camera Optional camera filter
 */
export const fetchMarsPhotos = async (
  rover: string,
  sol: number,
  camera?: string,
): Promise<MarsPhotoResponse> => {
  const params: Record<string, string> = { sol: sol.toString() };
  if (camera) params.camera = camera;

  return directFetch<MarsPhotoResponse>(
    `/mars-photos/api/v1/rovers/${rover}/photos`,
    params,
  );
};

/**
 * Získá manifest roveru (informace o dostupných fotkách a datech).
 */
export const fetchRoverManifest = async (
  rover: string,
): Promise<MarsManifest> => {
  return directFetch<MarsManifest>(`/mars-photos/api/v1/manifests/${rover}`);
};

/**
 * Získá data o slunečních erupcích (Solar Flares) z DONKI.
 * @param startDate YYYY-MM-DD
 * @param endDate YYYY-MM-DD
 */
export const fetchSolarFlares = async (
  startDate: string,
  endDate: string,
): Promise<SolarFlare[]> => {
  const params = { startDate, endDate };
  return directFetch<SolarFlare[]>("/DONKI/FLR", params);
};

/**
 * Získá data o geomagnetických bouřích (Geomagnetic Storms) z DONKI.
 */
export const fetchGeomagneticStorms = async (
  startDate: string,
  endDate: string,
): Promise<GeomagneticStorm[]> => {
  const params = { startDate, endDate };
  return directFetch<GeomagneticStorm[]>("/DONKI/GST", params);
};

/**
 * Získá nejnovější snímky Země z EPIC API.
 */
export const fetchEpicImages = async (): Promise<EpicImage[]> => {
  return directFetch<EpicImage[]>("/EPIC/api/natural");
};

/**
 * Získá aktuální přírodní události z EONET API.
 * EONET je hostován na eonet.gsfc.nasa.gov a nevyžaduje API klíč, ale má jiné URL.
 */
export const fetchEonetEvents = async (
  days: number = 20,
  status: string = "open",
): Promise<EonetResponse> => {
  const params = { days: days.toString(), status };
  // Použijeme directFetch s absolutní URL, protože EONET je mimo standardní api.nasa.gov
  // A Supabase proxy by musela být nakonfigurována specificky pro tuto doménu.
  return directFetch<EonetResponse>(
    "https://eonet.gsfc.nasa.gov/api/v3/events",
    params,
  );
};

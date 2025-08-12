import { useQuery } from "@tanstack/react-query";
import {
  fetchApod,
  fetchNeoFeed,
  fetchMarsPhotos,
  fetchRoverManifest,
  fetchSolarFlares,
  fetchGeomagneticStorms,
  fetchEpicImages,
  fetchEonetEvents,
} from "../services/nasaService";
import type { NeoFeedData, Asteroid } from "../types/nasa";

export type ThreatLevel = "LOW" | "MODERATE" | "CRITICAL";

/**
 * Hook pro získání APOD (Astronomy Picture of the Day).
 * Cache je nastavena na 24 hodin, protože obrázek se mění jednou denně.
 */
export const useApod = () => {
  return useQuery({
    queryKey: ["apod"],
    queryFn: () => fetchApod(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hodin
  });
};

/**
 * Hook pro získání NEO Feed (Asteroidy) pro dnešek.
 */
export const useNeoFeed = () => {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["neoFeed", today],
    queryFn: () => fetchNeoFeed(today, today),
    staleTime: 1000 * 60 * 60, // 1 hodina
  });
};

/**
 * Hook pro získání fotek z Mars Roveru.
 */
export const useMarsPhotos = (rover: string, sol: number, camera?: string) => {
  return useQuery({
    queryKey: ["marsPhotos", rover, sol, camera],
    queryFn: () => fetchMarsPhotos(rover, sol, camera),
    staleTime: 1000 * 60 * 60 * 24, // Fotky z minulosti se nemění
    enabled: !!rover && sol >= 0,
  });
};

/**
 * Hook pro manifest roveru (zjištění max Sol a dostupných dat).
 */
export const useRoverManifest = (rover: string) => {
  return useQuery({
    queryKey: ["roverManifest", rover],
    queryFn: () => fetchRoverManifest(rover),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

/**
 * Hook pro sluneční erupce (posledních 30 dní).
 */
export const useSolarFlares = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["solarFlares", startDate, endDate],
    queryFn: () => fetchSolarFlares(startDate, endDate),
    staleTime: 1000 * 60 * 60, // 1 hodina
  });
};

/**
 * Hook pro geomagnetické bouře (posledních 30 dní).
 */
export const useGeomagneticStorms = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["geomagneticStorms", startDate, endDate],
    queryFn: () => fetchGeomagneticStorms(startDate, endDate),
    staleTime: 1000 * 60 * 60,
  });
};

/**
 * Hook pro získání snímků Země (EPIC).
 */
export const useEpicImages = () => {
  return useQuery({
    queryKey: ["epicImages"],
    queryFn: fetchEpicImages,
    staleTime: 1000 * 60 * 60 * 4, // 4 hodiny
  });
};

/**
 * Hook pro přírodní události na Zemi (EONET).
 */
export const useEonetEvents = (days: number = 20) => {
  return useQuery({
    queryKey: ["eonetEvents", days],
    queryFn: () => fetchEonetEvents(days),
    staleTime: 1000 * 60 * 30, // 30 minut
  });
};

/**
 * Pomocná funkce pro výpočet úrovně hrozby.
 */
const calculateThreatLevel = (data?: NeoFeedData): ThreatLevel => {
  if (!data) return "LOW";

  let maxHazard = 0; // 0 = safe, 1 = potentially hazardous, 2 = critical

  Object.values(data.near_earth_objects)
    .flat()
    .forEach((asteroid: Asteroid) => {
      if (asteroid.is_potentially_hazardous_asteroid) {
        const missDistanceAu = parseFloat(
          asteroid.close_approach_data[0].miss_distance.astronomical,
        );
        const diameterMeters =
          asteroid.estimated_diameter.meters.estimated_diameter_max;

        // Kritéria pro CRITICAL: blíž než 0.05 AU a větší než 140m (zjednodušená definice)
        if (missDistanceAu < 0.05 && diameterMeters > 140) {
          maxHazard = 2;
        } else {
          maxHazard = Math.max(maxHazard, 1);
        }
      }
    });

  if (maxHazard === 2) return "CRITICAL";
  if (maxHazard === 1) return "MODERATE";
  return "LOW";
};

/**
 * Hook, který vrací vypočítanou úroveň hrozby na základě aktuálních dat.
 */
export const useThreatLevel = () => {
  const { data, isLoading, error } = useNeoFeed();

  const level = calculateThreatLevel(data);

  // Počet nebezpečných objektů dnes
  const hazardousCount = data
    ? Object.values(data.near_earth_objects)
        .flat()
        .filter((a) => a.is_potentially_hazardous_asteroid).length
    : 0;

  return { level, hazardousCount, isLoading, error };
};

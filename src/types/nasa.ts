export interface ApodData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

export interface Asteroid {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }[];
  is_sentry_object: boolean;
}

export interface NeoFeedData {
  links: {
    next: string;
    prev: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: Asteroid[];
  };
}

// --- MARS ROVER TYPES ---

export interface RoverCamera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface Rover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: 'active' | 'complete';
  max_sol?: number;
  max_date?: string;
  total_photos?: number;
  cameras?: {
    name: string;
    full_name: string;
  }[];
}

export interface MarsPhoto {
  id: number;
  sol: number;
  camera: RoverCamera;
  img_src: string;
  earth_date: string;
  rover: Rover;
}

export interface MarsPhotoResponse {
  photos: MarsPhoto[];
}

export interface MarsManifest {
  photo_manifest: Rover;
}

// --- DONKI (SPACE WEATHER) TYPES ---

export interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string; // e.g., "M1.2", "X2.1"
  sourceLocation: string;
  activeRegionNum: number;
  link: string;
}

export interface GeomagneticStorm {
  gstID: string;
  startTime: string;
  allKpIndex: {
    observedTime: string;
    kpIndex: number;
    source: string;
  }[];
  link: string;
}

// --- EPIC (EARTH IMAGING) TYPES ---

export interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  dscovr_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  date: string;
}

// --- EONET (NATURAL EVENTS) TYPES ---

export interface EonetCategory {
  id: string;
  title: string;
}

export interface EonetGeometry {
  magnitudeValue?: number;
  magnitudeUnit?: string;
  date: string;
  type: string;
  coordinates: number[]; // [lon, lat]
}

export interface EonetEvent {
  id: string;
  title: string;
  description?: string;
  link: string;
  categories: EonetCategory[];
  sources: { id: string; url: string }[];
  geometry: EonetGeometry[];
}

export interface EonetResponse {
  title: string;
  description: string;
  link: string;
  events: EonetEvent[];
}

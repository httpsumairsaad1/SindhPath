
export interface City {
  id: string;
  name: string;
  x: number; // Percent relative to map container
  y: number; // Percent relative to map container
  description: string;
}

export interface Connection {
  from: string;
  to: string;
  distance: number; // in km
}

export interface PathResult {
  path: string[];
  totalDistance: number;
  visitedNodes: string[];
}

export interface Graph {
  [cityId: string]: {
    [neighborId: string]: number;
  };
}

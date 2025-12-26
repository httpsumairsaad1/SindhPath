
import { Graph, PathResult } from '../types';

export const runDijkstra = (graph: Graph, start: string, end: string): PathResult | null => {
  const distances: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};
  const visited: Set<string> = new Set();
  const queue: string[] = [];

  // Initialize
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    prev[node] = null;
    queue.push(node);
  });
  distances[start] = 0;

  const visitedNodes: string[] = [];

  while (queue.length > 0) {
    // Sort queue to get the node with the smallest distance
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift();

    if (!u || distances[u] === Infinity) break;
    if (u === end) break;

    visited.add(u);
    visitedNodes.push(u);

    const neighbors = graph[u];
    for (const v in neighbors) {
      if (visited.has(v)) continue;
      
      const alt = distances[u] + neighbors[v];
      if (alt < distances[v]) {
        distances[v] = alt;
        prev[v] = u;
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = end;
  
  if (prev[curr] === null && curr !== start) return null;

  while (curr !== null) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return {
    path,
    totalDistance: distances[end],
    visitedNodes
  };
};

export const findSecondShortestPath = (graph: Graph, start: string, end: string, firstPath: string[]): PathResult | null => {
  let secondBest: PathResult | null = null;
  
  // We remove each edge in the first path one by one and find the shortest path in the modified graph
  for (let i = 0; i < firstPath.length - 1; i++) {
    const u = firstPath[i];
    const v = firstPath[i + 1];
    
    // Deep copy graph to avoid side effects
    const tempGraph: Graph = JSON.parse(JSON.stringify(graph));
    
    // Remove edge (u, v) and (v, u)
    if (tempGraph[u] && tempGraph[u][v]) delete tempGraph[u][v];
    if (tempGraph[v] && tempGraph[v][u]) delete tempGraph[v][u];
    
    const res = runDijkstra(tempGraph, start, end);
    
    if (res && res.path.length > 0) {
      // Check if it's actually different (sometimes multiple paths have same distance)
      if (!secondBest || res.totalDistance < secondBest.totalDistance) {
        secondBest = res;
      }
    }
  }
  
  return secondBest;
};

export const buildGraph = (connections: any[]): Graph => {
  const graph: Graph = {};
  connections.forEach(conn => {
    if (!graph[conn.from]) graph[conn.from] = {};
    if (!graph[conn.to]) graph[conn.to] = {};
    graph[conn.from][conn.to] = conn.distance;
    graph[conn.to][conn.from] = conn.distance; // Bidirectional
  });
  return graph;
};

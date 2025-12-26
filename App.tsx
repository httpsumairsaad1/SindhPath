
import React, { useState, useMemo, useEffect } from 'react';
import { CITIES, CONNECTIONS } from './data/sindhData';
import { runDijkstra, findSecondShortestPath, buildGraph } from './utils/dijkstra';
import { PathResult, City } from './types';
import { getTravelInsight, getDijkstraExplanation } from './services/geminiService';

const App: React.FC = () => {
  const [startCity, setStartCity] = useState<string>('KHI');
  const [endCity, setEndCity] = useState<string>('SKZ');
  const [result, setResult] = useState<PathResult | null>(null);
  const [secondResult, setSecondResult] = useState<PathResult | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [insight, setInsight] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const graph = useMemo(() => buildGraph(CONNECTIONS), []);

  const handleCalculate = async () => {
    if (startCity === endCity) {
      alert("Please select different start and end cities.");
      return;
    }

    setLoading(true);
    setSelectedCity(null);
    const pathResult = runDijkstra(graph, startCity, endCity);
    setResult(pathResult);

    if (pathResult) {
      // Calculate 2nd Shortest Path
      const secondPath = findSecondShortestPath(graph, startCity, endCity, pathResult.path);
      setSecondResult(secondPath);

      const cityNames = pathResult.path.map(id => CITIES.find(c => c.id === id)?.name || id);
      const startName = CITIES.find(c => c.id === startCity)?.name || startCity;
      const endName = CITIES.find(c => c.id === endCity)?.name || endCity;

      // Parallel fetch from Gemini
      const [aiInsight, aiExpl] = await Promise.all([
        getTravelInsight(startName, endName, pathResult.totalDistance),
        getDijkstraExplanation(startName, endName, cityNames)
      ]);
      setInsight(aiInsight || '');
      setExplanation(aiExpl || '');
    } else {
      setSecondResult(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const isNodeOnPath = (cityId: string) => result?.path.includes(cityId);
  const isNodeOnSecondPath = (cityId: string) => secondResult?.path.includes(cityId);
  
  const isEdgeOnPath = (fromId: string, toId: string) => {
    if (!result) return false;
    for (let i = 0; i < result.path.length - 1; i++) {
      const u = result.path[i];
      const v = result.path[i + 1];
      if ((u === fromId && v === toId) || (u === toId && v === fromId)) return true;
    }
    return false;
  };

  const isEdgeOnSecondPath = (fromId: string, toId: string) => {
    if (!secondResult) return false;
    for (let i = 0; i < secondResult.path.length - 1; i++) {
      const u = secondResult.path[i];
      const v = secondResult.path[i + 1];
      if ((u === fromId && v === toId) || (u === toId && v === fromId)) return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-96 bg-white border-r border-slate-200 p-6 flex flex-col gap-5 shadow-2xl z-20 overflow-y-auto">
        <header className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <i className="fas fa-route text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SindhPath</h1>
        </header>

        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Start City</label>
            <select 
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold transition-all outline-none"
            >
              {CITIES.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Destination</label>
            <select 
              value={endCity}
              onChange={(e) => setEndCity(e.target.value)}
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold transition-all outline-none"
            >
              {CITIES.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>)}
            </select>
          </div>

          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-location-arrow"></i>}
            Calculate Routes
          </button>
        </section>

        {result && (
          <section className="mt-2 flex flex-col gap-3 animate-fadeIn">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 shadow-sm">
              <h3 className="text-indigo-900 font-bold flex items-center gap-2 mb-2 text-sm">
                <i className="fas fa-trophy text-amber-500"></i> Shortest Path (1st)
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 text-xs font-bold uppercase">Distance</span>
                <span className="text-indigo-700 font-black text-xl">{result.totalDistance} km</span>
              </div>
            </div>

            {secondResult && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
                <h3 className="text-orange-900 font-bold flex items-center gap-2 mb-2 text-sm">
                  <i className="fas fa-road text-orange-500"></i> Alternative Path (2nd)
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 text-xs font-bold uppercase">Distance</span>
                  <span className="text-orange-700 font-black text-xl">{secondResult.totalDistance} km</span>
                </div>
              </div>
            )}

            {insight && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-900 font-bold flex items-center gap-2 mb-1 text-sm">
                  <i className="fas fa-lightbulb text-yellow-500"></i> Travel Tip
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{insight}</p>
              </div>
            )}
          </section>
        )}
      </aside>

      {/* Main Map View */}
      <main className="flex-1 relative bg-slate-200 p-4 md:p-8 flex items-center justify-center">
        {/* Map Container with constrained size and border */}
        <div className="relative w-full h-full max-w-5xl max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl border-[12px] border-slate-100 overflow-hidden">
          
          {/* Legend */}
          <div className="absolute top-8 left-8 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Map Legend</h4>
            <div className="flex items-center gap-3">
              <div className="w-6 h-1 bg-indigo-600 rounded-full"></div>
              <span className="text-slate-900 font-bold text-xs">Shortest Route</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-1 border-b-2 border-dashed border-orange-500"></div>
              <span className="text-orange-600 font-bold text-xs">Alternative Path</span>
            </div>
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <i className="fas fa-mouse-pointer text-indigo-400 text-[10px]"></i>
              <span className="text-slate-500 text-[10px]">Click cities for details</span>
            </div>
          </div>

          {/* City Detail Popup */}
          {selectedCity && (
            <div className="absolute top-8 right-8 z-30 w-72 bg-white rounded-2xl shadow-2xl border border-indigo-100 p-5 animate-slideDown">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-black text-indigo-900 leading-none">{selectedCity.name}</h3>
                <button onClick={() => setSelectedCity(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-snug">{selectedCity.description}</p>
            </div>
          )}

          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            {/* Background Map Shape (River Indus) */}
            <path 
              d="M 680 0 Q 640 100 640 200 T 500 350 T 350 500 T 300 700 T 200 1000" 
              fill="none" 
              stroke="#dbeafe" 
              strokeWidth="60" 
              strokeOpacity="0.5"
            />
            
            {/* Connections (Edges) */}
            {CONNECTIONS.map((conn, idx) => {
              const fromCity = CITIES.find(c => c.id === conn.from)!;
              const toCity = CITIES.find(c => c.id === conn.to)!;
              const isShortest = isEdgeOnPath(conn.from, conn.to);
              const isSecond = isEdgeOnSecondPath(conn.from, conn.to);
              
              return (
                <g key={`edge-${idx}`}>
                  {/* Base Line */}
                  <line
                    x1={fromCity.x * 10}
                    y1={fromCity.y * 10}
                    x2={toCity.x * 10}
                    y2={toCity.y * 10}
                    stroke={isShortest ? '#4f46e5' : isSecond ? '#f59e0b' : '#e2e8f0'}
                    strokeWidth={isShortest ? '10' : isSecond ? '6' : '3'}
                    strokeDasharray={isSecond && !isShortest ? "10 5" : "0"}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  {/* Distance Indicator */}
                  {!isShortest && !isSecond && (
                    <text
                      x={(fromCity.x + toCity.x) * 5}
                      y={(fromCity.y + toCity.y) * 5 + 5}
                      textAnchor="middle"
                      className="text-[12px] fill-slate-300 font-bold select-none"
                    >
                      {conn.distance}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Cities (Nodes) */}
            {CITIES.map((city) => {
              const isOnShortest = isNodeOnPath(city.id);
              const isOnSecond = isNodeOnSecondPath(city.id);
              const isStart = startCity === city.id;
              const isEnd = endCity === city.id;

              return (
                <g 
                  key={city.id} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedCity(city)}
                >
                  <circle
                    cx={city.x * 10}
                    cy={city.y * 10}
                    r={isStart || isEnd ? "24" : "16"}
                    fill={isStart ? '#10b981' : isEnd ? '#ef4444' : isOnShortest ? '#4f46e5' : isOnSecond ? '#f59e0b' : '#fff'}
                    stroke={isOnShortest || isStart || isEnd ? '#fff' : '#cbd5e1'}
                    strokeWidth="4"
                    className="transition-all duration-300 shadow-xl"
                  />
                  <text
                    x={city.x * 10}
                    y={city.y * 10 + (isStart || isEnd ? 50 : 40)}
                    textAnchor="middle"
                    className={`text-[20px] font-black uppercase tracking-tighter transition-colors ${isOnShortest || isStart || isEnd ? 'fill-slate-900' : 'fill-slate-400'}`}
                  >
                    {city.name}
                  </text>
                  {/* Subtle Ping Animation for Highlighted Nodes */}
                  {(isOnShortest || isOnSecond) && (
                    <circle
                      cx={city.x * 10}
                      cy={city.y * 10}
                      r="30"
                      fill="none"
                      stroke={isOnShortest ? '#4f46e5' : '#f59e0b'}
                      strokeWidth="2"
                      className="animate-ping opacity-20"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </main>
    </div>
  );
};

export default App;

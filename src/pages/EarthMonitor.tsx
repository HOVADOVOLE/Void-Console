import { useState } from "react";
import { useEpicImages, useEonetEvents } from "../hooks/useNasa";
import {
  Map,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Flame,
  CloudRain,
  Mountain,
  Wind,
  ExternalLink,
} from "lucide-react";

const EarthMonitor = () => {
  const [epicIndex, setEpicIndex] = useState(0);
  const { data: epicImages, isLoading: loadingEpic } = useEpicImages();
  const { data: eonetData, isLoading: loadingEonet } = useEonetEvents(30); // Last 30 days

  // --- EPIC LOGIC ---
  const currentEpic = epicImages?.[epicIndex];

  const getEpicImageUrl = (image: any) => {
    if (!image) return "";
    const date = new Date(image.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image.image}.png`;
  };

  const handleNextEpic = () => {
    if (!epicImages) return;
    setEpicIndex((prev) => (prev + 1) % epicImages.length);
  };

  const handlePrevEpic = () => {
    if (!epicImages) return;
    setEpicIndex((prev) => (prev - 1 + epicImages.length) % epicImages.length);
  };

  // --- EONET LOGIC ---
  const getEventIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("fire"))
      return <Flame className="w-4 h-4 text-orange-500" />;
    if (t.includes("ice") || t.includes("snow"))
      return <Mountain className="w-4 h-4 text-cyan-200" />;
    if (t.includes("volcano"))
      return <Mountain className="w-4 h-4 text-red-500" />;
    if (t.includes("storm") || t.includes("cyclone"))
      return <Wind className="w-4 h-4 text-yellow-400" />;
    return <CloudRain className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-400 flex items-center">
          <Map className="w-8 h-8 mr-3" />
          PLANETARY OPERATIONS
        </h2>
        <div className="flex items-center space-x-2 text-xs font-mono text-green-400/70">
          <RefreshCw
            className={`w-3 h-3 ${loadingEonet ? "animate-spin" : ""}`}
          />
          <span>LIVE FEED ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* --- EPIC: EARTH VIEW --- */}
        <div className="border border-green-500/30 bg-black flex flex-col items-center justify-center relative min-h-[500px] overflow-hidden group tour-earth-epic">
          <div className="absolute top-0 left-0 p-4 z-10">
            <h3 className="text-green-400 font-bold uppercase text-sm tracking-widest">
              DSCOVR SATELLITE FEED
            </h3>
            <div className="text-[10px] text-green-400/50">
              LAGRANGE POINT 1
            </div>
          </div>

          {loadingEpic ? (
            <div className="animate-pulse text-green-400/50 text-xs">
              ACQUIRING OPTICAL SIGNAL...
            </div>
          ) : currentEpic ? (
            <>
              <img
                src={getEpicImageUrl(currentEpic)}
                alt="Earth from DSCOVR"
                className="max-w-[80%] max-h-[80%] animate-in fade-in duration-1000"
              />

              <div className="absolute bottom-10 flex space-x-4">
                <button
                  onClick={handlePrevEpic}
                  className="p-2 border border-green-500/30 text-green-500 hover:bg-green-500/20 backdrop-blur-sm rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center justify-center text-green-400/80 bg-slate-900/50 backdrop-blur-md px-4 rounded border border-green-500/10">
                  <span className="text-[10px] font-mono">
                    {currentEpic.date}
                  </span>
                  <span className="text-xs font-bold">
                    {epicIndex + 1} / {epicImages?.length}
                  </span>
                </div>
                <button
                  onClick={handleNextEpic}
                  className="p-2 border border-green-500/30 text-green-500 hover:bg-green-500/20 backdrop-blur-sm rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-red-500">
              <span className="text-2xl font-bold tracking-widest">
                SATELLITE OFFLINE
              </span>
              <span className="text-xs opacity-50 mt-2">
                DSCOVR LINK UNAVAILABLE (503)
              </span>
            </div>
          )}

          {/* Decorative Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        {/* --- EONET: EVENT LOG --- */}
        <div className="border border-green-500/30 bg-slate-900/50 flex flex-col h-[600px] xl:h-auto tour-earth-eonet">
          <div className="p-4 border-b border-green-500/30 bg-green-500/5 flex justify-between items-center">
            <h3 className="font-bold text-green-400 uppercase tracking-widest text-sm">
              GLOBAL EVENT TRACKER
            </h3>
            <div className="text-[10px] text-green-400/50">SOURCE: EONET</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loadingEonet ? (
              <div className="text-center text-green-400/30 mt-10">
                Scanning planetary surface...
              </div>
            ) : !eonetData?.events ? (
              <div className="text-center text-red-500 mt-10">
                DATASTREAM ERROR
              </div>
            ) : (
              eonetData.events.map((event) => (
                <div
                  key={event.id}
                  className="border border-green-500/10 bg-slate-950 p-3 hover:border-green-500/40 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-900 rounded-md mr-3 border border-green-500/20">
                        {getEventIcon(event.title)}
                      </div>
                      <div>
                        <h4 className="font-bold text-green-100 text-sm group-hover:text-green-400 transition-colors">
                          {event.title}
                        </h4>
                        <div className="text-[10px] text-green-400/40 uppercase">
                          {event.categories[0].title}
                        </div>
                      </div>
                    </div>
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400/30 hover:text-green-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="pl-12">
                    <div className="flex items-center justify-between text-[10px] text-green-400/30 font-mono border-t border-green-500/10 pt-2 mt-1">
                      <span>
                        LAT: {event.geometry[0].coordinates[1].toFixed(2)} /
                        LON: {event.geometry[0].coordinates[0].toFixed(2)}
                      </span>
                      <span>
                        {new Date(event.geometry[0].date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthMonitor;

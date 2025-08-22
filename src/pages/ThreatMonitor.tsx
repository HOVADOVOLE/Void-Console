import { useNeoFeed } from "../hooks/useNasa";
import { AlertTriangle, Info } from "lucide-react";

const ThreatMonitor = () => {
  const { data, isLoading } = useNeoFeed();

  const hazards = data
    ? Object.values(data.near_earth_objects)
        .flat()
        .filter((a) => a.is_potentially_hazardous_asteroid)
        .sort(
          (a, b) =>
            parseFloat(a.close_approach_data[0].miss_distance.astronomical) -
            parseFloat(b.close_approach_data[0].miss_distance.astronomical),
        )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-red-500 flex items-center animate-pulse">
          <AlertTriangle className="w-8 h-8 mr-3" />
          CRITICAL THREAT MONITOR
        </h2>
        <div className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-500 text-xs font-bold">
          LIVE_TRACKING_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="border border-red-500/30 bg-red-950/10 p-6">
            <h3 className="text-red-500 font-bold mb-4 uppercase text-sm">
              Threat Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-red-500/10 pb-2">
                <span className="text-xs text-red-500/70">
                  Potential Impacts
                </span>
                <span className="text-xl font-bold text-red-500">
                  {hazards.length}
                </span>
              </div>
              <div className="flex justify-between border-b border-red-500/10 pb-2">
                <span className="text-xs text-red-500/70">
                  Highest Velocity
                </span>
                <span className="text-sm font-bold text-white">
                  {hazards.length > 0
                    ? Math.round(
                        Number(
                          hazards[0].close_approach_data[0].relative_velocity
                            .kilometers_per_hour,
                        ),
                      ).toLocaleString()
                    : 0}{" "}
                  km/h
                </span>
              </div>
            </div>
          </div>

          <div className="border border-cyan-400/30 bg-slate-900/50 p-6 text-xs text-cyan-400/70 italic">
            <Info className="w-4 h-4 mb-2 opacity-50" />
            "Potential Threat" refers to objects larger than 140m that come
            within 0.05 AU of Earth. Constant monitoring is advised for all
            identified designations.
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          {hazards.length === 0 && !isLoading ? (
            <div className="h-64 border border-green-500/30 bg-green-950/10 flex items-center justify-center text-green-500 font-bold uppercase tracking-widest">
              No immediate threats detected in primary sector.
            </div>
          ) : (
            hazards.map((hazard) => (
              <div
                key={hazard.id}
                className="border border-red-500/30 bg-slate-900/80 p-4 flex justify-between items-center group hover:border-red-500 transition-colors"
              >
                <div>
                  <div className="text-red-500 font-bold text-lg group-hover:text-red-400">
                    {hazard.name}
                  </div>
                  <div className="text-[10px] text-cyan-400/50 uppercase">
                    Designation ID: {hazard.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-red-500/70 uppercase mb-1">
                    Miss Distance
                  </div>
                  <div className="text-lg font-mono text-white">
                    {Number(
                      hazard.close_approach_data[0].miss_distance.astronomical,
                    ).toFixed(4)}{" "}
                    <span className="text-xs opacity-50">AU</span>
                  </div>
                </div>
                <div className="hidden sm:block text-right border-l border-red-500/20 pl-4">
                  <div className="text-xs text-red-500/70 uppercase mb-1">
                    Diameter
                  </div>
                  <div className="text-lg font-mono text-white">
                    {Math.round(
                      hazard.estimated_diameter.meters.estimated_diameter_max,
                    )}{" "}
                    <span className="text-xs opacity-50">m</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatMonitor;

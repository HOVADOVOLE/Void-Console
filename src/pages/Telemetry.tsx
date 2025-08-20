import { useNeoFeed } from "../hooks/useNasa";
import { appLogger } from "../lib/logger";
import {
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

type SortKey = "name" | "velocity" | "distance" | "diameter" | "hazard";

const Telemetry = () => {
  const { data, isLoading } = useNeoFeed();
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data)
      appLogger.success(
        "TELEMETRY",
        `Received data for ${Object.keys(data.near_earth_objects).length} days`,
      );
  }, [data]);

  const asteroids = useMemo(() => {
    if (!data) return [];
    let list = Object.values(data.near_earth_objects).flat();

    // Filtering
    if (search) {
      list = list.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sorting
    return list.sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      switch (sortKey) {
        case "name":
          valA = a.name;
          valB = b.name;
          break;
        case "velocity":
          valA = parseFloat(
            a.close_approach_data[0].relative_velocity.kilometers_per_hour,
          );
          valB = parseFloat(
            b.close_approach_data[0].relative_velocity.kilometers_per_hour,
          );
          break;
        case "distance":
          valA = parseFloat(
            a.close_approach_data[0].miss_distance.astronomical,
          );
          valB = parseFloat(
            b.close_approach_data[0].miss_distance.astronomical,
          );
          break;
        case "diameter":
          valA = a.estimated_diameter.meters.estimated_diameter_max;
          valB = b.estimated_diameter.meters.estimated_diameter_max;
          break;
        case "hazard":
          valA = a.is_potentially_hazardous_asteroid ? 1 : 0;
          valB = b.is_potentially_hazardous_asteroid ? 1 : 0;
          break;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ active }: { active: boolean }) => (
    <ArrowUpDown
      className={`w-3 h-3 ml-1 inline-block ${active ? "text-cyan-400" : "opacity-30"}`}
    />
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-neon flex items-center">
          <span className="w-2 h-8 bg-cyan-400 mr-3 block"></span>
          NEO TELEMETRY DATA
        </h2>

        <div className="flex items-center space-x-4">
          <div className="relative tour-telemetry-search">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400/50" />

            <input
              type="text"
              placeholder="SEARCH OBJECT ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-cyan-400/30 pl-9 pr-4 py-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-400 w-64"
            />
          </div>
          <div className="text-xs text-cyan-400/50 font-mono hidden md:block">
            TOTAL_OBJECTS: {asteroids.length}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center border border-dashed border-cyan-400/20">
          <div className="animate-pulse text-cyan-400">
            SCANNING DEEP SPACE SECTORS...
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto border border-cyan-400/30 bg-slate-900/50 custom-scrollbar tour-telemetry-table">
          <table className="w-full text-left border-collapse text-xs relative">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-sm z-10 shadow-sm shadow-cyan-400/10">
              <tr className="border-b border-cyan-400/30 text-cyan-400 uppercase tracking-widest font-bold">
                <th
                  className="p-4 cursor-pointer hover:bg-cyan-400/5"
                  onClick={() => handleSort("name")}
                >
                  Designation <SortIcon active={sortKey === "name"} />
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-cyan-400/5"
                  onClick={() => handleSort("hazard")}
                >
                  Hazard Status <SortIcon active={sortKey === "hazard"} />
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-cyan-400/5"
                  onClick={() => handleSort("velocity")}
                >
                  Velocity (km/h) <SortIcon active={sortKey === "velocity"} />
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-cyan-400/5"
                  onClick={() => handleSort("distance")}
                >
                  Miss Distance (AU){" "}
                  <SortIcon active={sortKey === "distance"} />
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-cyan-400/5"
                  onClick={() => handleSort("diameter")}
                >
                  Est. Diameter (m) <SortIcon active={sortKey === "diameter"} />
                </th>
              </tr>
            </thead>
            <tbody>
              {asteroids.map((asteroid) => (
                <tr
                  key={asteroid.id}
                  className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-colors group"
                >
                  <td className="p-4 border-r border-cyan-400/10 font-bold text-white group-hover:text-neon">
                    {asteroid.name}
                    <a
                      href={asteroid.nasa_jpl_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4 border-r border-cyan-400/10">
                    <div className="flex items-center">
                      {asteroid.is_potentially_hazardous_asteroid ? (
                        <span className="text-red-500 flex items-center font-bold bg-red-500/10 px-2 py-1 rounded border border-red-500/30">
                          <ShieldAlert className="w-3 h-3 mr-2" /> HAZARDOUS
                        </span>
                      ) : (
                        <span className="text-green-500 flex items-center opacity-70">
                          <ShieldCheck className="w-3 h-3 mr-2" /> SECURE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 border-r border-cyan-400/10 font-mono text-cyan-300">
                    {Number(
                      asteroid.close_approach_data[0].relative_velocity
                        .kilometers_per_hour,
                    ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="p-4 border-r border-cyan-400/10 font-mono">
                    <span
                      className={
                        parseFloat(
                          asteroid.close_approach_data[0].miss_distance
                            .astronomical,
                        ) < 0.05
                          ? "text-yellow-400 font-bold"
                          : "text-cyan-400/70"
                      }
                    >
                      {Number(
                        asteroid.close_approach_data[0].miss_distance
                          .astronomical,
                      ).toFixed(6)}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-white/80">
                    {Math.round(
                      asteroid.estimated_diameter.meters.estimated_diameter_max,
                    )}
                    m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Telemetry;

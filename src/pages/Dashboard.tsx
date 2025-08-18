import { useState, useEffect, useRef } from "react";
import ApodWidget from "../components/widgets/ApodWidget";
import TelemetryWidget from "../components/widgets/TelemetryWidget";
import AsteroidRadar from "../components/widgets/AsteroidRadar";
import { appLogger, type LogEntry } from "../lib/logger";
import { clsx } from "clsx";

const Dashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    appLogger.info("DASHBOARD", "MISSION OVERVIEW MODULE LOADED");
    return appLogger.subscribe((allLogs) => {
      // Zobrazujeme posledních 20 logů
      setLogs(allLogs.slice(0, 20));
    });
  }, []);

  // Auto-scroll na konec logů
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return "text-green-400";
      case "WARN":
        return "text-yellow-400";
      case "ERROR":
        return "text-red-500";
      default:
        return "text-cyan-400/80";
    }
  };

  return (
    <div className="flex flex-col space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon flex items-center">
          <span className="w-2 h-8 bg-cyan-400 mr-3 block shadow-[0_0_10px_#22d3ee]"></span>
          MISSION OVERVIEW
        </h2>
        <div className="text-xs text-cyan-400/50 font-mono hidden sm:block">
          // TERMINAL_ID: V_CON_01
        </div>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-h-[500px]">

              {/* Left Column */}

              <div className="lg:col-span-1 flex flex-col gap-6">

                <div className="flex-none h-auto min-h-[250px] tour-dashboard-telemetry">

                  <TelemetryWidget />

                </div>

                <div className="flex-1 min-h-[300px] tour-dashboard-radar">

                  <AsteroidRadar />

                </div>

              </div>

      

              {/* Visual Feed Section */}

              <div className="lg:col-span-2 min-h-[400px] tour-dashboard-apod">

                 <ApodWidget />

              </div>

            </div>

      

            {/* System Logs */}

            <div className="w-full border border-cyan-400/30 bg-slate-900/50 p-4 font-mono text-[10px] h-48 flex flex-col shadow-inner shadow-black/50 tour-dashboard-logs">

                <div className="flex justify-between items-center bg-slate-900/90 border-b border-cyan-400/20 pb-2 mb-2 font-bold text-cyan-400/70 uppercase shrink-0">

      
          <span>// REALTIME_SYSTEM_LOGS</span>
          <span className="animate-pulse">CONNECTED</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-cyan-400/20">AWAITING SYSTEM BROADCAST...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex space-x-2">
                <span className="opacity-50 text-cyan-400 shrink-0">
                  [{log.timestamp}]
                </span>
                <span
                  className={clsx(
                    "font-bold shrink-0 w-12",
                    getLogColor(log.level),
                  )}
                >
                  [{log.level}]
                </span>
                <span className="truncate text-white/80">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

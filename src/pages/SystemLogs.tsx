import { useState, useEffect } from "react";
import { appLogger, type LogEntry } from "../lib/logger";
import { Terminal, Trash2, Filter } from "lucide-react";
import { clsx } from "clsx";

const SystemLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterErrors, setFilterErrors] = useState(false);
  
  useEffect(() => {
    return appLogger.subscribe(setLogs);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'text-green-400';
      case 'WARN': return 'text-yellow-400';
      case 'ERROR': return 'text-red-500 font-bold';
      default: return 'text-cyan-400';
    }
  };

  const displayedLogs = filterErrors ? logs.filter(l => l.level === 'ERROR') : logs;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon flex items-center">
          <Terminal className="w-8 h-8 mr-3" />
          SYSTEM_CONSOLE_LOGS
        </h2>
        <div className="flex space-x-2 tour-logs-controls">
           <button 
             onClick={() => setFilterErrors(!filterErrors)}
             className={`p-2 border transition-all ${filterErrors ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-cyan-400/30 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10'}`}
             title="Toggle Error Filter"
           >
             <Filter className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setLogs([])} // Pouze vyčistí lokální view, ne historii loggeru (pro jednoduchost)
             className="p-2 border border-red-500/30 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-all"
             title="Clear Console"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex-1 bg-black/80 border border-cyan-400/30 font-mono text-xs overflow-y-auto p-4 shadow-[inset_0_0_20px_rgba(0,0,0,1)] custom-scrollbar tour-logs-content">
        <div className="space-y-1">
          {displayedLogs.length === 0 ? (
            <div className="text-cyan-400/30 italic">NO LOGS TO DISPLAY...</div>
          ) : (
            displayedLogs.map((log, i) => (
              <div key={i} className="flex space-x-4 border-b border-cyan-400/5 py-1 hover:bg-cyan-400/5 transition-colors group">
                <span className="text-cyan-400/40 shrink-0">[{log.timestamp}]</span>
                <span className={clsx("shrink-0 uppercase w-16", getLevelColor(log.level))}>
                  {log.level}
                </span>
                <span className="text-cyan-400/90 group-hover:text-white transition-colors break-all">
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div className="animate-pulse text-cyan-400 mt-4">_</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-3 border border-cyan-400/10">
          <div className="text-[10px] text-cyan-400/50 uppercase">
            Total Events
          </div>
          <div className="text-lg font-bold">{logs.length}</div>
        </div>
        <div className="bg-slate-900 p-3 border border-cyan-400/10">
          <div className="text-[10px] text-cyan-400/50 uppercase">Errors</div>
          <div className="text-lg font-bold text-red-500">
            {logs.filter((l) => l.level === "ERROR").length}
          </div>
        </div>
        <div className="bg-slate-900 p-3 border border-cyan-400/10">
          <div className="text-[10px] text-cyan-400/50 uppercase">
            Buffer Status
          </div>
          <div className="text-lg font-bold text-green-400">OPTIMAL</div>
        </div>
        <div className="bg-slate-900 p-3 border border-cyan-400/10">
          <div className="text-[10px] text-cyan-400/50 uppercase">
            Sync Level
          </div>
          <div className="text-lg font-bold">100%</div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

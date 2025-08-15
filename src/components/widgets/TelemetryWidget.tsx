import { useThreatLevel } from '../../hooks/useNasa';
import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

const TelemetryWidget = () => {
  const { level, hazardousCount, isLoading } = useThreatLevel();

  if (isLoading) {
    return (
      <div className="h-full border border-cyan-400/30 bg-slate-900/50 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-cyan-400 font-mono text-sm">CALCULATING THREAT LEVELS...</div>
      </div>
    );
  }

  const getLevelColor = () => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      case 'MODERATE': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]';
      default: return 'text-cyan-400 border-cyan-400 bg-cyan-400/5';
    }
  };

  const getLevelIcon = () => {
    switch (level) {
      case 'CRITICAL': return <ShieldAlert className="w-12 h-12 animate-pulse" />;
      case 'MODERATE': return <AlertTriangle className="w-12 h-12" />;
      default: return <ShieldCheck className="w-12 h-12" />;
    }
  };

  return (
    <div className={clsx("h-full w-full border bg-slate-900/50 p-0 relative flex flex-col transition-all duration-500 min-h-[220px]", getLevelColor())}>
      <div className="absolute top-0 right-0 p-2 opacity-70 text-[10px] border-b border-l border-inherit font-bold">
        THREAT_MONITOR
      </div>
      
      <div className="p-4 border-b border-inherit bg-inherit flex items-center justify-between">
        <h3 className="font-bold tracking-wider text-sm">DEFENSE STATUS</h3>
        <div className="w-2 h-2 rounded-full bg-current animate-ping" />
      </div>

      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="opacity-90">
          {getLevelIcon()}
        </div>
        
        <div className="text-3xl font-bold tracking-widest leading-none">
          {level}
        </div>
        
        <div className="text-xs opacity-70 uppercase tracking-widest">
          Current Threat Level
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 text-xs border-t border-inherit py-3 opacity-80 mt-auto">
          <div className="flex flex-col items-center">
             <span className="text-lg font-bold">{hazardousCount}</span>
             <span className="text-[10px] uppercase">Detected Hazards</span>
          </div>
          <div className="flex flex-col items-center border-l border-inherit pl-2">
             <span className="text-lg font-bold">0.00 AU</span>
             <span className="text-[10px] uppercase">Min Distance</span>
          </div>
      </div>
    </div>
  );
};

export default TelemetryWidget;

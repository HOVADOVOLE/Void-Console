import { useSolarFlares, useGeomagneticStorms } from '../hooks/useNasa';
import { Sun, Activity, Zap, Shield } from 'lucide-react';

const SolarDefense = () => {
  const { data: flares, isLoading: loadingFlares } = useSolarFlares();
  const { data: storms, isLoading: loadingStorms } = useGeomagneticStorms();

  const isLoading = loadingFlares || loadingStorms;

  const getFlareColor = (classType: string) => {
    if (classType.startsWith('X')) return 'text-red-500 font-bold';
    if (classType.startsWith('M')) return 'text-yellow-400 font-bold';
    return 'text-cyan-400';
  };

  const activeStorms = storms?.slice(0, 5) || [];
  const recentFlares = flares?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yellow-500 flex items-center">
          <Sun className="w-8 h-8 mr-3 animate-pulse" />
          SOLAR DEFENSE ARRAY
        </h2>
        <div className="flex space-x-4 text-xs font-mono">
           <div className="flex items-center text-yellow-500">
             <Activity className="w-4 h-4 mr-2" />
             SOLAR ACTIVITY: {recentFlares.length > 5 ? 'HIGH' : 'NOMINAL'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solar Flares Panel */}
        <div className="border border-yellow-500/30 bg-yellow-950/5 p-0 flex flex-col h-[500px] tour-solar-flares">
          <div className="p-4 border-b border-yellow-500/30 bg-yellow-500/10 flex justify-between items-center">
            <h3 className="font-bold text-yellow-500 uppercase flex items-center">
              <Zap className="w-4 h-4 mr-2" /> Solar Flares (Last 30 Days)
            </h3>
            <span className="text-xs text-yellow-500/50">{recentFlares.length} DETECTED</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              <div className="text-yellow-500/50 text-center mt-10">Scanning solar surface...</div>
            ) : recentFlares.length === 0 ? (
              <div className="text-green-500 text-center mt-10">NO SIGNIFICANT FLARES DETECTED</div>
            ) : (
              recentFlares.map((flare) => (
                <div key={flare.flrID} className="flex justify-between items-center p-3 border border-yellow-500/10 bg-slate-900/50 hover:bg-yellow-500/5 transition-colors">
                  <div>
                    <div className={`text-sm ${getFlareColor(flare.classType)}`}>CLASS {flare.classType}</div>
                    <div className="text-[10px] text-yellow-500/40">{new Date(flare.beginTime).toLocaleString()}</div>
                  </div>
                  <div className="text-right text-[10px] text-yellow-500/40">
                    <div>Region: {flare.activeRegionNum || 'N/A'}</div>
                    <a href={flare.link} target="_blank" rel="noreferrer" className="hover:text-yellow-500 underline">DETAILS</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Geomagnetic Storms Panel */}
        <div className="border border-cyan-400/30 bg-slate-900/30 p-0 flex flex-col h-[500px] tour-solar-storms">
           <div className="p-4 border-b border-cyan-400/30 bg-cyan-400/5 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400 uppercase flex items-center">
              <Shield className="w-4 h-4 mr-2" /> Geomagnetic Storms
            </h3>
             <span className="text-xs text-cyan-400/50">{activeStorms.length} RECORDED</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {isLoading ? (
              <div className="text-cyan-400/50 text-center mt-10">Monitoring magnetosphere...</div>
            ) : activeStorms.length === 0 ? (
              <div className="text-green-500 text-center mt-10 flex flex-col items-center">
                <Shield className="w-12 h-12 mb-2 opacity-50" />
                MAGNETOSPHERE STABLE
              </div>
            ) : (
              activeStorms.map((storm) => (
                <div key={storm.gstID} className="p-4 border border-cyan-400/20 bg-slate-950">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-cyan-400 font-bold text-sm">{storm.gstID}</span>
                     <span className="text-[10px] text-cyan-400/50">{new Date(storm.startTime).toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    {storm.allKpIndex.map((kp, i) => (
                      <div key={i} className="flex justify-between text-xs border-b border-cyan-400/5 py-1">
                         <span className="text-cyan-400/70">{kp.source}</span>
                         <span className={`font-bold ${kp.kpIndex > 5 ? 'text-red-500' : 'text-green-400'}`}>KP {kp.kpIndex}</span>
                      </div>
                    ))}
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

export default SolarDefense;

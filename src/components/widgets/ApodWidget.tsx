import { useApod } from '../../hooks/useNasa';
import { Maximize2, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

const ApodWidget = () => {
  const { data, isLoading, error } = useApod();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center border-dashed border border-cyan-400/20 bg-slate-900/40 p-6 min-h-[300px]">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-cyan-400/70 animate-pulse text-xs tracking-widest">CONNECTING TO HUBBLE TELESCOPE...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center border border-red-500/30 bg-red-950/10 p-6 min-h-[300px]">
        <div className="text-red-500 font-bold mb-2">SIGNAL LOST</div>
        <div className="text-red-400/60 text-xs">UNABLE TO RETRIEVE VISUAL DATA</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-slate-900/50 border border-cyan-400/30 flex flex-col group min-h-[400px]">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-slate-950/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest border-b border-cyan-400/30 inline-block pb-1 mb-1">
            OPTICAL_SENSOR_01 // APOD
          </div>
          <h3 className="text-white font-bold text-shadow-sm leading-tight max-w-[80%]">
            {data.title}
          </h3>
        </div>
        <div className="flex space-x-2 pointer-events-auto">
           {data.media_type === 'video' ? <Video className="w-4 h-4 text-cyan-400" /> : <ImageIcon className="w-4 h-4 text-cyan-400" />}
        </div>
      </div>

      {/* Media Content */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {data.media_type === 'image' ? (
          <img 
            src={data.url} 
            alt={data.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <iframe
            src={data.url}
            title={data.title}
            className="w-full h-full"
            allowFullScreen
          />
        )}
        
        {/* Overlay Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      </div>

      {/* Footer / Description */}
      <div className="p-4 bg-slate-950/90 border-t border-cyan-400/30 text-xs text-cyan-400/80">
        <p className="line-clamp-3 leading-relaxed">
          {data.explanation}
        </p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-cyan-400 hover:text-white flex items-center space-x-1 uppercase text-[10px] font-bold tracking-wider"
        >
          <Maximize2 className="w-3 h-3" />
          <span>FULL ANALYSIS</span>
        </button>
      </div>
      
      {/* Modal for Full Description (Simplified) */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsExpanded(false)}>
           <div className="bg-slate-900 border border-cyan-400 p-6 max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(34,211,238,0.2)]" onClick={e => e.stopPropagation()}>
             <h2 className="text-xl text-neon mb-4">{data.title}</h2>
             <div className="mb-4">
               {data.media_type === 'image' && (
                  <img src={data.hdurl || data.url} alt={data.title} className="w-full h-auto border border-cyan-400/30" />
               )}
             </div>
             <p className="text-cyan-400/80 leading-relaxed text-sm">{data.explanation}</p>
             <button 
              onClick={() => setIsExpanded(false)}
              className="mt-6 w-full py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 uppercase font-bold text-xs"
             >
               CLOSE TERMINAL
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ApodWidget;

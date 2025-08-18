import { useState } from 'react';
import { useMarsPhotos, useRoverManifest } from '../hooks/useNasa';
import { useAddFavorite } from '../hooks/useFavorites';
import { Camera, ChevronLeft, ChevronRight, Loader2, Info, Bookmark } from 'lucide-react';

const ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'];
const CAMERAS = [
  { id: 'all', name: 'ALL CAMERAS' },
  { id: 'fhaz', name: 'FRONT HAZARD' },
  { id: 'rhaz', name: 'REAR HAZARD' },
  { id: 'navcam', name: 'NAVIGATION' },
];

const getDefaultSol = (rover: string) => {
  switch (rover) {
    case 'curiosity': return 3000;
    case 'opportunity': return 5000;
    case 'spirit': return 2000;
    case 'perseverance': return 800;
    default: return 1000;
  }
};

const MarsUplink = () => {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [sol, setSol] = useState(getDefaultSol('curiosity'));
  const [camera, setCamera] = useState('all');
  const addFavoriteMutation = useAddFavorite();

  // Načtení manifestu pro zjištění max SOL
  const { data: manifest } = useRoverManifest(selectedRover);
  const maxSol = manifest?.photo_manifest.max_sol || 3000;

  // Načtení fotek
  const { data, isLoading, error } = useMarsPhotos(
    selectedRover, 
    sol, 
    camera === 'all' ? undefined : camera
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-neon flex items-center">
          <Camera className="w-6 h-6 mr-3" />
          MARS ROVER UPLINK
        </h2>
        <div className="flex space-x-2 text-xs font-mono">
          <div className="px-3 py-1 bg-cyan-900/20 border border-cyan-400/30">
            STATUS: {manifest?.photo_manifest.status.toUpperCase() || 'UNKNOWN'}
          </div>
          <div className="px-3 py-1 bg-cyan-900/20 border border-cyan-400/30">
            MAX SOL: {maxSol}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-cyan-400/30 bg-slate-900/50 p-4 tour-mars-controls">
        <div>
          <label className="block text-[10px] text-cyan-400/50 uppercase mb-1">Select Rover</label>
          <div className="flex space-x-2">
            {ROVERS.map(r => (
              <button
                key={r}
                onClick={() => { setSelectedRover(r); setSol(getDefaultSol(r)); }} 
                className={`px-3 py-1 text-xs uppercase border ${selectedRover === r ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold' : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'}`}
              >
                {r.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-[10px] text-cyan-400/50 uppercase mb-1">Mission Sol (Day)</label>
           <div className="flex items-center space-x-2">
             <button onClick={() => setSol(Math.max(0, sol - 1))} className="p-1 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
             <input 
               type="number" 
               value={sol} 
               onChange={(e) => setSol(Number(e.target.value))}
               max={maxSol}
               className="bg-slate-950 border border-cyan-400/30 w-full p-1 text-center text-cyan-400 font-mono text-sm"
             />
             <button onClick={() => setSol(Math.min(maxSol, sol + 1))} className="p-1 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>

        <div>
          <label className="block text-[10px] text-cyan-400/50 uppercase mb-1">Camera Filter</label>
          <select 
            value={camera} 
            onChange={(e) => setCamera(e.target.value)}
            className="w-full bg-slate-950 border border-cyan-400/30 text-cyan-400 text-xs p-1 uppercase"
          >
            {CAMERAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center border border-dashed border-cyan-400/20">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
            <div className="animate-pulse text-cyan-400 text-xs">ESTABLISHING LINK WITH {selectedRover.toUpperCase()}...</div>
          </div>
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center border border-red-500/30 bg-red-950/10 text-red-500">
          <Info className="w-8 h-8 mb-2" />
          <span className="font-bold">CONNECTION FAILED</span>
          <span className="text-xs mt-1">ROVER DID NOT RESPOND (ERROR {(error as any).message})</span>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 border border-red-500 hover:bg-red-500/20 text-xs uppercase">
            RETRY UPLINK
          </button>
        </div>
      ) : !data?.photos || data.photos.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-cyan-400/10 bg-slate-900/30 text-cyan-400/50">
          <Info className="w-8 h-8 mb-2 opacity-50" />
          <span>NO IMAGERY DATA FOUND FOR SOL {sol}</span>
          <span className="text-[10px] mt-1">Try changing the camera or date.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square bg-black border border-cyan-400/20 overflow-hidden hover:border-cyan-400/60 transition-colors cursor-pointer">
              <img 
                src={photo.img_src} 
                alt={`Mars Rover Photo ${photo.id}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950/90 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold text-white">{photo.camera.name}</div>
                  <div className="text-[9px] text-cyan-400/70">ID: {photo.id}</div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addFavoriteMutation.mutate({
                      nasa_id: String(photo.id),
                      type: 'MARS',
                      metadata: {
                        title: `${selectedRover.toUpperCase()} - ${photo.camera.name}`,
                        image_url: photo.img_src,
                        date: photo.earth_date,
                        rover: selectedRover
                      }
                    });
                  }}
                  className="p-1 text-cyan-400 hover:text-white hover:bg-cyan-400/20 rounded"
                  title="Save to Archive"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarsUplink;

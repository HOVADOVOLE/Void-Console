import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApod } from '../services/nasaService';
import { useAddFavorite } from '../hooks/useFavorites';
import { appLogger } from '../lib/logger';
import { Calendar, Download, Share2, Info, Bookmark, Check } from 'lucide-react';

const VisualFeed = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const addFavoriteMutation = useAddFavorite();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['apod', date],
    queryFn: async () => {
      appLogger.info('APOD', `Fetching data for date: ${date}`);
      return fetchApod(date); 
    },
  });

  const handleSave = () => {
    if (!data) return;
    
    addFavoriteMutation.mutate({
      nasa_id: data.date, // APOD unique ID is the date
      type: 'APOD',
      metadata: {
        title: data.title,
        date: data.date,
        image_url: data.media_type === 'image' ? data.url : null, // Store URL only if image
        description: data.explanation.substring(0, 100) + '...'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-neon flex items-center">
          <span className="w-2 h-8 bg-cyan-400 mr-3 block"></span>
          VISUAL DATA ARCHIVE
        </h2>
        
        <div className="flex items-center space-x-2 bg-slate-900 border border-cyan-400/30 p-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-cyan-400 text-xs focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center border border-dashed border-cyan-400/20">
          <div className="animate-pulse text-cyan-400">SYNCHRONIZING WITH DEEP SPACE NETWORK...</div>
        </div>
      ) : error || !data ? (
        <div className="h-96 flex items-center justify-center border border-red-500/20 text-red-500">
          DATA LINK CORRUPTED
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <div className="border border-cyan-400/30 bg-black relative group overflow-hidden">
               {data.media_type === 'image' ? (
                 <img src={data.hdurl || data.url} alt={data.title} className="w-full h-auto" />
               ) : (
                 <iframe src={data.url} title={data.title} className="w-full aspect-video" />
               )}
               <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-950/80 backdrop-blur-md border-t border-cyan-400/30 flex justify-between items-center translate-y-full group-hover:translate-y-0 transition-transform">
                 <span className="text-sm font-bold">{data.title}</span>
                 <div className="flex space-x-3">
                    <button className="hover:text-white"><Download className="w-4 h-4" /></button>
                    <button className="hover:text-white"><Share2 className="w-4 h-4" /></button>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-cyan-400/30 bg-slate-900/50 p-6">
              <div className="flex items-center mb-4 text-neon">
                <Info className="w-5 h-5 mr-2" />
                <h3 className="font-bold uppercase tracking-widest">Metadata Analysis</h3>
              </div>
              <div className="space-y-4 text-sm text-cyan-400/80">
                <div>
                  <span className="block text-[10px] text-cyan-400/50 uppercase">Object Designation</span>
                  <span className="text-white">{data.title}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-cyan-400/50 uppercase">Capture Date</span>
                  <span className="text-white">{data.date}</span>
                </div>
                {data.copyright && (
                  <div>
                    <span className="block text-[10px] text-cyan-400/50 uppercase">Origin / Copyright</span>
                    <span className="text-white">{data.copyright}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-cyan-400/10">
                  <span className="block text-[10px] text-cyan-400/50 uppercase mb-2">Subject Description</span>
                  <p className="leading-relaxed text-xs">
                    {data.explanation}
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={addFavoriteMutation.isPending || addFavoriteMutation.isSuccess}
              className={`w-full py-3 border font-bold transition-all uppercase text-xs tracking-widest flex items-center justify-center space-x-2 ${
                addFavoriteMutation.isSuccess 
                  ? 'border-green-500 text-green-500 bg-green-500/10' 
                  : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950'
              }`}
            >
              {addFavoriteMutation.isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ARCHIVED SUCCESSFULLY</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{addFavoriteMutation.isPending ? 'SAVING...' : 'SAVE TO ARCHIVE'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualFeed;

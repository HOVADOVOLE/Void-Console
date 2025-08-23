import { useState } from "react";
import { useFavorites, useRemoveFavorite } from "../hooks/useFavorites";
import {
  Archive as ArchiveIcon,
  Trash2,
  Calendar,
  Database,
  Image,
  Radio,
  Sun,
  Map,
  X,
  ExternalLink,
} from "lucide-react";
import { type FavoriteItem } from "../services/favoritesService";

const Archive = () => {
  const { data: favorites, isLoading } = useFavorites();
  const removeMutation = useRemoveFavorite();
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 font-mono">
          ACCESSING ENCRYPTED ARCHIVE...
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "APOD":
        return <Image className="w-4 h-4" />;
      case "NEO":
        return <Database className="w-4 h-4" />;
      case "MARS":
        return <Radio className="w-4 h-4" />;
      case "SOLAR":
        return <Sun className="w-4 h-4" />;
      case "EARTH":
        return <Map className="w-4 h-4" />;
      default:
        return <ArchiveIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon flex items-center">
          <ArchiveIcon className="w-6 h-6 mr-3" />
          PERSONAL DATA ARCHIVE
        </h2>
        <div className="text-xs text-cyan-400/50 font-mono">
          ITEMS_STORED: {favorites?.length || 0}
        </div>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="border border-dashed border-cyan-400/30 bg-slate-900/30 p-12 text-center text-cyan-400/50">
          ARCHIVE EMPTY. SAVE DATA FROM MODULES TO POPULATE.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tour-archive-grid">
          {favorites.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="border border-cyan-400/30 bg-slate-900/50 flex flex-col group overflow-hidden cursor-pointer hover:border-cyan-400 transition-colors"
            >
              {/* Header */}
              <div className="p-3 border-b border-cyan-400/30 bg-cyan-400/5 flex justify-between items-center pointer-events-none">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase">
                  {getTypeIcon(item.type)}
                  <span>{item.type}</span>
                </div>
                <div className="text-[10px] text-cyan-400/50 font-mono">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Content Preview */}
              <div className="flex-1 relative min-h-[150px] bg-black pointer-events-none">
                {item.metadata.image_url ? (
                  <img
                    src={item.metadata.image_url}
                    alt="Saved content"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-sm font-bold text-white mb-2 line-clamp-2">
                      {item.metadata.title}
                    </div>
                    {item.metadata.date && (
                      <div className="text-xs text-cyan-400/60 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />{" "}
                        {item.metadata.date}
                      </div>
                    )}
                  </div>
                )}

                {item.metadata.image_url && (
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-slate-950/80 backdrop-blur-sm">
                    <div className="text-xs font-bold text-white truncate">
                      {item.metadata.title || "Untitled"}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-2 flex justify-end border-t border-cyan-400/30 bg-slate-950">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMutation.mutate(item.id);
                  }}
                  className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Remove from Archive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-slate-900 border border-cyan-400 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-cyan-400/30 bg-cyan-400/5">
              <div className="flex items-center space-x-3">
                {getTypeIcon(selectedItem.type)}
                <h3 className="text-lg font-bold text-neon uppercase tracking-wider">
                  {selectedItem.metadata.title || "ARCHIVED ITEM"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-cyan-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {selectedItem.metadata.image_url && (
                <div className="border border-cyan-400/20 p-1 bg-black">
                  <img
                    src={selectedItem.metadata.image_url}
                    alt="Full size"
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-2 border-cyan-400 pl-4">
                    <div className="text-[10px] text-cyan-400/50 uppercase">
                      Date Captured
                    </div>
                    <div className="text-white font-mono">
                      {selectedItem.metadata.date || "UNKNOWN"}
                    </div>
                  </div>
                  {selectedItem.metadata.rover && (
                    <div className="border-l-2 border-cyan-400 pl-4">
                      <div className="text-[10px] text-cyan-400/50 uppercase">
                        Origin Rover
                      </div>
                      <div className="text-white font-mono uppercase">
                        {selectedItem.metadata.rover}
                      </div>
                    </div>
                  )}
                  <div className="border-l-2 border-cyan-400 pl-4">
                    <div className="text-[10px] text-cyan-400/50 uppercase">
                      Archive ID
                    </div>
                    <div className="text-white font-mono text-xs">
                      {selectedItem.id}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-cyan-400/50 uppercase mb-2">
                    Description / Analysis
                  </div>
                  <p className="text-cyan-400/80 text-sm leading-relaxed">
                    {selectedItem.metadata.description ||
                      "No additional data available for this record."}
                  </p>

                  {selectedItem.metadata.image_url && (
                    <a
                      href={selectedItem.metadata.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center text-xs font-bold text-cyan-400 hover:text-white border border-cyan-400/50 px-3 py-2 hover:bg-cyan-400/20 transition-all"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" /> OPEN SOURCE FILE
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-cyan-400/30 bg-slate-950 flex justify-between items-center">
              <span className="text-[10px] text-cyan-400/30 font-mono">
                SECURE ARCHIVE STORAGE // V1.0
              </span>
              <button
                onClick={() => {
                  removeMutation.mutate(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="flex items-center text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Archive;

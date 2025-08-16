import { useState, useEffect } from 'react';
import { Wifi, Battery, Activity, Menu, HelpCircle } from 'lucide-react';

const Header = ({ onMenuClick, onStartTour }: { onMenuClick: () => void; onStartTour?: () => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-cyan-400/30 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={onMenuClick} className="text-cyan-400 hover:text-white transition-colors p-1">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Left Section - Title only on mobile */}
      <div className="md:hidden font-bold text-neon">
        VOID.CONSOLE
      </div>

      {/* Center Section - System Status (Hidden on small mobile) */}
      <div className="hidden md:flex items-center space-x-6 text-xs tracking-wider header-status-panel">
        <div className="flex items-center text-cyan-400/80">
          <Activity className="w-4 h-4 mr-2 animate-pulse" />
          <span>CPU: OPTIMAL</span>
        </div>
        <div className="flex items-center text-cyan-400/80">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_5px_#22c55e]" />
          <span>NET: SECURE</span>
        </div>
        <div className="flex items-center text-cyan-400/80">
           <span className="mr-2">QUOTA:</span>
           <div className="w-24 h-2 bg-slate-800 border border-cyan-400/30 relative">
             <div className="absolute left-0 top-0 h-full bg-cyan-400/50 w-[35%]" />
           </div>
        </div>
      </div>

      {/* Right Section - Clock & UTC */}
      <div className="flex items-center space-x-4 header-time-panel">
        {onStartTour && (
          <button 
            onClick={onStartTour}
            className="text-cyan-400/60 hover:text-cyan-400 transition-colors p-1"
            title="System Guidance"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}

        <div className="text-right hidden sm:block">
          <div className="text-xs text-cyan-400/60 font-bold">{formatDate(time)}</div>
          <div className="text-xl font-bold tracking-widest text-neon leading-none">
            {formatTime(time)} <span className="text-xs align-top">UTC</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pl-4 border-l border-cyan-400/20 text-cyan-400/60">
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;

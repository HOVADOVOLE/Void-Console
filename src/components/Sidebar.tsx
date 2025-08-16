import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, AlertTriangle, Database, Terminal, LogOut, Radio, Sun, Map, Archive, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', label: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/apod', label: 'VISUAL FEED', icon: Globe },
  { path: '/telemetry', label: 'TELEMETRY', icon: Database },
  { path: '/mars', label: 'MARS UPLINK', icon: Radio },
  { path: '/solar', label: 'SOLAR DEFENSE', icon: Sun },
  { path: '/earth', label: 'PLANETARY OPS', icon: Map },
  { path: '/archive', label: 'PERSONAL ARCHIVE', icon: Archive },
  { path: '/system', label: 'SYSTEM LOGS', icon: Terminal },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { signOut } = useAuth();

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-cyan-400/30 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 md:relative md:translate-x-0 md:bg-slate-900/50",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-cyan-400/30">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse mr-3 shadow-[0_0_10px_#22d3ee]" />
          <h1 className="text-xl font-bold tracking-wider text-neon">VOID.CONSOLE</h1>
        </div>
        <button onClick={onClose} className="md:hidden text-cyan-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto sidebar-nav">
        <div className="px-3 mb-2 text-xs text-cyan-400/50 font-bold uppercase tracking-widest">
          // MODULES
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onClose()} // Close on mobile navigation
            className={({ isActive }) => clsx(
              "flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 group border-l-2",
              isActive 
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[inset_10px_0_20px_-10px_rgba(34,211,238,0.3)]" 
                : "border-transparent text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-400/5 hover:border-cyan-400/50"
            )}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </NavLink>
        ))}

        <div className="mt-8 px-3 mb-2 text-xs text-red-500/70 font-bold uppercase tracking-widest">
          // CRITICAL
        </div>
        <NavLink
          to="/threats"
          onClick={() => onClose()}
          className={({ isActive }) => clsx(
            "flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 group border-l-2",
            isActive 
              ? "border-red-500 bg-red-500/10 text-red-400 shadow-[inset_10px_0_20px_-10px_rgba(239,68,68,0.3)]" 
              : "border-transparent text-red-500/70 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/50"
          )}
        >
          <AlertTriangle className="w-4 h-4 mr-3" />
          THREAT MONITOR
        </NavLink>
      </nav>

      {/* Footer / User Status */}
      <div className="p-4 border-t border-cyan-400/30">
        <div className="flex items-center justify-between p-2 border border-cyan-400/20 bg-slate-950/50">
          <div className="flex flex-col">
            <span className="text-xs text-cyan-400/50">OPERATOR</span>
            <span className="text-sm font-bold">GUEST_USER</span>
          </div>
          <button 
            onClick={() => signOut()}
            className="p-2 hover:text-red-400 transition-colors" 
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-cyan-400/40">
          <span>VER: 1.0.0</span>
          <span>SYS: ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

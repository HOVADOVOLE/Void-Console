import type { TooltipRenderProps } from "react-joyride";
import { Terminal, Check, X, ChevronRight, ChevronLeft } from "lucide-react";

const SystemGuide = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  size,
  isLastStep,
}: TooltipRenderProps) => {
  return (
    <div
      {...tooltipProps}
      className="bg-slate-900/95 border border-cyan-400 p-0 max-w-sm w-80 shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-xl relative z-50 flex flex-col"
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />

      {/* Header */}
      <div className="bg-cyan-950/50 border-b border-cyan-400/30 p-2 flex justify-between items-center">
        <div className="flex items-center text-cyan-400 text-xs font-bold tracking-widest uppercase">
          <Terminal className="w-3 h-3 mr-2 animate-pulse" />
          SYSTEM_GUIDANCE // STEP_0{index + 1}
        </div>
        <button
          {...closeProps}
          className="text-cyan-400/50 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {step.title && (
          <h3 className="text-white font-bold mb-2 uppercase tracking-wide border-l-2 border-cyan-400 pl-2">
            {step.title}
          </h3>
        )}
        <div className="text-cyan-400/80 text-xs leading-relaxed font-mono">
          {step.content}
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="p-2 border-t border-cyan-400/30 bg-slate-950 flex justify-between items-center">
        <div>
          {index > 0 && (
            <button
              {...backProps}
              className="text-cyan-400/50 hover:text-cyan-400 text-[10px] uppercase font-bold flex items-center px-2 py-1"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> BACK
            </button>
          )}
        </div>

        <button
          {...primaryProps}
          className="bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400 text-cyan-400 hover:text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center transition-all"
        >
          {isLastStep ? (
            <>
              COMPLETE <Check className="w-3 h-3 ml-2" />
            </>
          ) : (
            <>
              PROCEED <ChevronRight className="w-3 h-3 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-800 mt-0">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${((index + 1) / size) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SystemGuide;

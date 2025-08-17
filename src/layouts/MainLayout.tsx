import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride";
import SystemGuide from "../components/ui/SystemGuide";
import { getStepsForPath } from "../lib/tourSteps";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Aktualizujeme kroky při změně stránky
    setSteps(getStepsForPath(location.pathname));
  }, [location.pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRunTour(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-cyan-400 font-mono selection:bg-cyan-400 selection:text-slate-950">
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        tooltipComponent={SystemGuide}
        callback={handleJoyrideCallback}
        key={location.pathname} // Reset tour internal state on route change
        styles={{
          options: {
            zIndex: 10000,
            overlayColor: "rgba(2, 6, 23, 0.85)",
          },
        }}
      />

      {/* Sidebar - na desktopu fixní, na mobilu overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header - předáváme funkci pro otevření menu a spuštění tour */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onStartTour={() => setRunTour(true)}
        />

        {/* Hlavní obsah - scrollovatelná oblast */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 relative">
          {/* Pozadí mřížky pro efekt technického výkresu */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay pro zavření menu na mobilu */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;

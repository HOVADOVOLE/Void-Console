import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import { Archive } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import EarthMonitor from "./pages/EarthMonitor";
import MarsUplink from "./pages/MarsUplink";
import SolarDefense from "./pages/SolarDefense";
import SystemLogs from "./pages/SystemLogs";
import Telemetry from "./pages/Telemetry";
import ThreatMonitor from "./pages/ThreatMonitor";
import VisualFeed from "./pages/VisualFeed";

/**
 * Komponenta pro dynamickou správu názvu okna prohlížeče.
 */
function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "VOID.CONSOLE";

    switch (path) {
      case "/":
        title += " // DASHBOARD";
        break;
      case "/apod":
        title += " // VISUAL FEED";
        break;
      case "/telemetry":
        title += " // TELEMETRY";
        break;
      case "/mars":
        title += " // MARS UPLINK";
        break;
      case "/solar":
        title += " // SOLAR DEFENSE";
        break;
      case "/earth":
        title += " // PLANETARY OPS";
        break;
      case "/archive":
        title += " // ARCHIVE";
        break;
      case "/system":
        title += " // SYSTEM LOGS";
        break;
      case "/threats":
        title += " // THREAT MONITOR";
        break;
      case "/login":
        title += " // AUTHENTICATION";
        break;
    }

    document.title = title;
  }, [location]);

  return null;
}

/**
 * Hlavní komponenta aplikace Void Console.
 * Zajišťuje routing a základní CRT overlay efekt.
 */
function App() {
  return (
    <Router>
      <TitleManager />
      {/* CRT Scanline overlay animace */}
      <div className="crt-overlay" />

      <Routes>
        {/* Veřejné routy */}
        <Route path="/login" element={<Login />} />

        {/* Chráněné routy */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apod" element={<VisualFeed />} />
            <Route path="/telemetry" element={<Telemetry />} />
            <Route path="/mars" element={<MarsUplink />} />
            <Route path="/solar" element={<SolarDefense />} />
            <Route path="/earth" element={<EarthMonitor />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/system" element={<SystemLogs />} />
            <Route path="/threats" element={<ThreatMonitor />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

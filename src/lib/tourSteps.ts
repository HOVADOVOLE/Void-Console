import type { Step } from "react-joyride";

export const getStepsForPath = (pathname: string): Step[] => {
  const commonSteps: Step[] = [
    {
      target: ".sidebar-nav",
      title: "NAVIGATION",
      content:
        "Use this panel to switch between different mission modules. Each module provides specific telemetry data.",
      placement: "right",
    },
  ];

  switch (pathname) {
    case "/": // Dashboard
      return [
        {
          target: "body",
          title: "MISSION DASHBOARD",
          content:
            "Central command interface. Overview of critical system metrics and visual feeds.",
          placement: "center",
        },
        ...commonSteps,
        {
          target: ".tour-dashboard-telemetry",
          title: "DEFENSE STATUS",
          content:
            "Real-time threat assessment based on Near Earth Object proximity data.",
          placement: "right",
        },
        {
          target: ".tour-dashboard-radar",
          title: "NEO RADAR",
          content:
            "Live radar visualization of objects within 0.2 AU of Earth.",
          placement: "right",
        },
        {
          target: ".tour-dashboard-apod",
          title: "VISUAL FEED",
          content: "Latest imagery from deep space probes and observatories.",
          placement: "left",
        },
        {
          target: ".tour-dashboard-logs",
          title: "SYSTEM LOGS",
          content: "Live stream of system events and backend communications.",
          placement: "top",
        },
      ];

    case "/mars":
      return [
        {
          target: "body",
          title: "MARS UPLINK",
          content: "Direct connection to Martian surface assets.",
          placement: "center",
        },
        {
          target: ".tour-mars-controls",
          title: "TRANSMISSION CONTROL",
          content:
            "Configure your data link. Select a Rover, Mission Sol (Day), and Camera instrument to retrieve imagery.",
          placement: "bottom",
        },
        // Můžeme přidat krok pro grid, pokud jsou načtená data
      ];

    case "/earth":
      return [
        {
          target: "body",
          title: "PLANETARY OPS",
          content: "Global monitoring system.",
          placement: "center",
        },
        {
          target: ".tour-earth-epic",
          title: "DSCOVR FEED",
          content:
            "Full-disk imagery of Earth from the Lagrange Point 1 satellite.",
          placement: "right",
        },
        {
          target: ".tour-earth-eonet",
          title: "EVENT TRACKER",
          content:
            "Live tracking of natural events including wildfires, icebergs, and severe storms.",
          placement: "left",
        },
      ];

    case "/telemetry":
      return [
        {
          target: "body",
          title: "TELEMETRY DATABASE",
          content:
            "Comprehensive list of all tracked Near Earth Objects for today.",
          placement: "center",
        },
        {
          target: ".tour-telemetry-search",
          title: "SEARCH PROTOCOL",
          content: "Filter objects by their unique designation ID.",
          placement: "bottom",
        },
        {
          target: ".tour-telemetry-table",
          title: "DATA MATRIX",
          content:
            "Sortable telemetry data. Click headers to reorganize by Velocity, Distance, or Hazard status.",
          placement: "top",
        },
      ];

    case "/solar":
      return [
        {
          target: "body",
          title: "SOLAR DEFENSE",
          content: "Monitoring solar activity and space weather.",
          placement: "center",
        },
        {
          target: ".tour-solar-flares",
          title: "FLARE DETECTION",
          content:
            "Log of recent solar flares classified by X-ray intensity (C, M, X class).",
          placement: "right",
        },
        {
          target: ".tour-solar-storms",
          title: "MAGNETOSPHERE",
          content:
            "Tracking of Geomagnetic Storms (GST) and K-index impact on Earth.",
          placement: "left",
        },
      ];

    case "/system":
      return [
        {
          target: "body",
          title: "SYSTEM CONSOLE",
          content: "Raw output of the internal logging subsystem.",
          placement: "center",
        },
        {
          target: ".tour-logs-controls",
          title: "FILTERS",
          content: "Toggle error-only view or purge the current log buffer.",
          placement: "left",
        },
        {
          target: ".tour-logs-content",
          title: "EVENT STREAM",
          content: "Chronological list of all application events.",
          placement: "top",
        },
      ];

    case "/archive":
      return [
        {
          target: "body",
          title: "SECURE ARCHIVE",
          content: "Personal storage for bookmarked mission data.",
          placement: "center",
        },
        {
          target: ".tour-archive-grid",
          title: "DATA VAULT",
          content:
            "Click on any record to view detailed telemetry or download source files.",
          placement: "top",
        },
      ];

    default:
      return [
        {
          target: "body",
          title: "SYSTEM GUIDANCE",
          content: "Explore the interface to discover available data.",
          placement: "center",
        },
        ...commonSteps,
      ];
  }
};

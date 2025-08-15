import { useNeoFeed } from "../../hooks/useNasa";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Circle } from "@visx/shape";
import { ParentSize } from "@visx/responsive";

const RadarContent = ({ width, height }: { width: number; height: number }) => {
  const { data } = useNeoFeed();

  // Střed radaru
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  // Měřítko pro vzdálenost (0 až 0.1 AU např., nebo dynamicky)
  // Většina NEO je mezi 0.001 a 0.2 AU
  const distanceScale = scaleLinear({
    domain: [0, 0.2], // AU
    range: [0, radius],
  });

  if (!data) return null;

  const asteroids = Object.values(data.near_earth_objects).flat();

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        {/* Radar Rings */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <Circle
            key={i}
            r={radius * r}
            fill="none"
            stroke="rgba(34, 211, 238, 0.2)"
            strokeWidth={1}
            strokeDasharray={i === 3 ? "0" : "4 4"}
          />
        ))}

        {/* Crosshair */}
        <line
          x1={-radius}
          y1={0}
          x2={radius}
          y2={0}
          stroke="rgba(34, 211, 238, 0.2)"
        />
        <line
          x1={0}
          y1={-radius}
          x2={0}
          y2={radius}
          stroke="rgba(34, 211, 238, 0.2)"
        />

        {/* Earth Center */}
        <Circle r={4} fill="#22d3ee" className="animate-pulse" />

        {/* Asteroids */}
        {asteroids.map((asteroid) => {
          const distanceAu = parseFloat(
            asteroid.close_approach_data[0].miss_distance.astronomical,
          );
          // Generujeme pseudo-náhodný úhel na základě ID, aby pozice byla deterministická
          const angle = (parseInt(asteroid.id.slice(-4)) / 10000) * 2 * Math.PI;

          const r = distanceScale(Math.min(distanceAu, 0.2)); // Cap at 0.2 AU for visual
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);

          const size = Math.max(
            2,
            Math.min(
              asteroid.estimated_diameter.meters.estimated_diameter_max / 50,
              10,
            ),
          );
          const isHazardous = asteroid.is_potentially_hazardous_asteroid;

          return (
            <g key={asteroid.id}>
              <Circle
                cx={x}
                cy={y}
                r={size}
                fill={isHazardous ? "#ef4444" : "#22d3ee"}
                opacity={0.8}
                className="transition-all duration-300 hover:opacity-100 cursor-pointer"
              />
              {isHazardous && (
                <Circle
                  cx={x}
                  cy={y}
                  r={size + 4}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={1}
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}

        {/* Radar Scan Effect */}
        <line
          x1={0}
          y1={0}
          x2={radius}
          y2={0}
          stroke="url(#radarGradient)"
          strokeWidth={2}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </line>

        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.5)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>
      </Group>
    </svg>
  );
};

const AsteroidRadar = () => {
  return (
    <div className="h-full w-full bg-slate-900/50 border border-cyan-400/30 flex flex-col min-h-[400px]">
      <div className="p-4 border-b border-cyan-400/30 flex justify-between items-center">
        <h3 className="font-bold tracking-wider text-sm">
          NEO RADAR // 0.2 AU RANGE
        </h3>
        <div className="text-[10px] uppercase text-cyan-400/50">
          Live Tracking
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <ParentSize>
          {({ width, height }) => (
            <RadarContent width={width} height={height} />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

export default AsteroidRadar;

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SiloVisualizationProps {
  siloNumber: 1 | 2;
  moisture: number;
  temperature: number;
  isAlert: boolean;
}

const SiloVisualization = ({ siloNumber, moisture, temperature, isAlert }: SiloVisualizationProps) => {
  // Calculate fill level based on moisture (visual representation)
  const fillLevel = Math.min(Math.max((moisture / 10) * 100, 10), 95);
  
  // Determine status
  const getStatus = () => {
    if (moisture > 7) return 'danger';
    if (moisture < 4.5) return 'warning';
    return 'normal';
  };

  const status = getStatus();

  const statusColors = {
    normal: 'from-palm-light/80 to-palm-dark/60',
    warning: 'from-amber-500/80 to-amber-700/60',
    danger: 'from-red-500/80 to-red-700/60',
  };

  const glowClass = {
    normal: '',
    warning: 'glow-warning',
    danger: 'glow-danger',
  }[status];

  // Generate ventilation holes pattern
  const VentilationHoles = ({ rows, cols, className }: { rows: number; cols: number; className?: string }) => (
    <div className={cn("flex flex-col gap-1", className)}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1.5">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-foreground/80"
            />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Silo Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "px-4 py-2 rounded-full font-semibold text-sm uppercase tracking-wider",
          "bg-secondary border border-border",
          isAlert && "pulse-alert border-destructive"
        )}
      >
        Silo {siloNumber}
      </motion.div>

      {/* Kernel Silo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: siloNumber * 0.1 }}
        className={cn("relative", glowClass)}
      >
        {/* Main Silo Body */}
        <div className="relative w-36 h-64 sm:w-44 sm:h-72">
          {/* Silo Rectangular Body */}
          <div 
            className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-48 sm:h-56 rounded-sm border-2 border-foreground/30 overflow-hidden",
              "bg-gradient-to-b from-palm-light/40 to-palm-light/20"
            )}
          >
            {/* Top Ventilation Section */}
            <div className="absolute top-2 sm:top-3 left-0 right-0">
              <VentilationHoles rows={2} cols={8} />
            </div>

            {/* Middle Ventilation Section */}
            <div className="absolute top-14 sm:top-16 left-0 right-0">
              <VentilationHoles rows={2} cols={8} />
            </div>

            {/* Moisture Fill Level */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${fillLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t",
                statusColors[status],
                isAlert && "animate-pulse"
              )}
            >
              {/* Kernel/grain pattern overlay */}
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id={`kernelPattern${siloNumber}`} patternUnits="userSpaceOnUse" width="12" height="10">
                    <ellipse cx="6" cy="5" rx="4" ry="3" fill="currentColor" className="text-foreground/30" />
                  </pattern>
                  <rect width="100%" height="100%" fill={`url(#kernelPattern${siloNumber})`} />
                </svg>
              </div>
            </motion.div>

            {/* Percentage Display */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="stat-value text-2xl sm:text-3xl text-foreground font-bold">
                  {moisture.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Hopper/Cone Bottom */}
          <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-10 sm:h-12">
            <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
              {/* Hopper trapezoid shape */}
              <polygon
                points="0,0 100,0 85,30 15,30"
                className="fill-palm-light/30 stroke-foreground/30"
                strokeWidth="1"
              />
              {/* Inner shadow line */}
              <line x1="15" y1="2" x2="85" y2="2" className="stroke-foreground/10" strokeWidth="1" />
            </svg>
          </div>

          {/* Discharge Outlet */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-6 sm:h-8 bg-muted border-2 border-foreground/30 rounded-b-sm" />

          {/* Support Legs */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-36 sm:w-44 flex justify-between px-3 sm:px-4">
            <div className="w-2 h-8 sm:h-10 bg-muted-foreground/40 rounded-b-sm" />
            <div className="w-2 h-8 sm:h-10 bg-muted-foreground/40 rounded-b-sm" />
          </div>

          {/* Triangular Support Braces */}
          <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-6" viewBox="0 0 100 20">
            <polygon points="10,0 30,0 20,18" className="fill-muted-foreground/30" />
            <polygon points="70,0 90,0 80,18" className="fill-muted-foreground/30" />
          </svg>
        </div>
      </motion.div>

      {/* Temperature Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 px-4 py-2 glass-card"
      >
        <div className="w-3 h-3 rounded-full bg-temp-normal animate-pulse" />
        <span className="font-mono text-lg font-semibold">{temperature.toFixed(1)}°C</span>
      </motion.div>
    </div>
  );
};

export default SiloVisualization;

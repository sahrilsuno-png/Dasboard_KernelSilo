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

  const fillClass = {
    normal: 'moisture-fill',
    warning: 'moisture-fill-warning',
    danger: 'moisture-fill-danger',
  }[status];

  const glowClass = {
    normal: '',
    warning: 'glow-warning',
    danger: 'glow-danger',
  }[status];

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

      {/* Silo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: siloNumber * 0.1 }}
        className={cn("silo-container", glowClass)}
      >
        {/* Silo Structure */}
        <div className="relative w-32 h-48 sm:w-40 sm:h-56">
          {/* Silo Top (Dome) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-8 sm:h-10">
            <div className="silo-body w-full h-full rounded-t-full border-t border-x border-border/30" />
          </div>

          {/* Silo Body */}
          <div className="absolute top-7 sm:top-9 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-32 sm:h-40 overflow-hidden rounded-b-lg border border-t-0 border-border/30">
            <div className="silo-body w-full h-full relative">
              {/* Moisture Level Fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${fillLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "absolute bottom-0 left-0 right-0",
                  fillClass,
                  isAlert && "animate-pulse"
                )}
              >
                {/* Wave Effect */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <motion.path
                      d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z"
                      fill="currentColor"
                      className="text-foreground/20"
                      animate={{ d: [
                        "M0 10 Q25 0 50 10 T100 10 V20 H0 Z",
                        "M0 10 Q25 20 50 10 T100 10 V20 H0 Z",
                        "M0 10 Q25 0 50 10 T100 10 V20 H0 Z"
                      ]}}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Level Markers */}
              {[25, 50, 75].map((level) => (
                <div
                  key={level}
                  className="absolute left-0 right-0 h-px bg-foreground/10"
                  style={{ bottom: `${level}%` }}
                />
              ))}

              {/* Percentage Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="stat-value text-2xl sm:text-3xl text-foreground drop-shadow-lg">
                  {moisture.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Silo Base/Cone */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-8 sm:h-10">
            <div 
              className="silo-body w-full h-full border-x border-b border-border/30"
              style={{ 
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              }}
            />
          </div>

          {/* Support Legs */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 flex justify-between">
            {[0, 1].map((i) => (
              <div key={i} className="w-2 h-6 bg-muted rounded-b-sm" />
            ))}
          </div>
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

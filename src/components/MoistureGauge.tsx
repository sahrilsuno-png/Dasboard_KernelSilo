import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoistureGaugeProps {
  value: number;
  label: string;
  minValue?: number;
  maxValue?: number;
  warningLow?: number;
  warningHigh?: number;
}

const MoistureGauge = ({ 
  value, 
  label, 
  minValue = 0, 
  maxValue = 10,
  warningLow = 4.5,
  warningHigh = 7 
}: MoistureGaugeProps) => {
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
  const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const getStatus = () => {
    if (value > warningHigh) return 'danger';
    if (value < warningLow) return 'warning';
    return 'normal';
  };

  const status = getStatus();

  const statusColors = {
    normal: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  const statusGlow = {
    normal: 'glow-primary',
    warning: 'glow-warning',
    danger: 'glow-danger',
  };

  return (
    <div className={cn("flex flex-col items-center p-6 glass-card", statusGlow[status])}>
      <span className="stat-label mb-4">{label}</span>
      
      {/* Gauge */}
      <div className="relative w-32 h-16 mb-4">
        {/* Background Arc */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
          <defs>
            <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--warning))" />
              <stop offset="45%" stopColor="hsl(var(--success))" />
              <stop offset="70%" stopColor="hsl(var(--success))" />
              <stop offset="100%" stopColor="hsl(var(--destructive))" />
            </linearGradient>
          </defs>
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke={`url(#gauge-gradient-${label})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="126"
            strokeDashoffset={126 - (percentage / 100) * 126}
            className="transition-all duration-1000"
          />
        </svg>

        {/* Needle */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 w-1 h-14 origin-bottom -translate-x-1/2"
          style={{ transformOrigin: 'bottom center' }}
        >
          <div className="w-full h-full bg-foreground rounded-full" />
        </motion.div>

        {/* Center Circle */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-foreground border-2 border-background" />
      </div>

      {/* Value Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("stat-value", statusColors[status])}
      >
        {value.toFixed(1)}%
      </motion.div>

      {/* Range Indicators */}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span>{minValue}%</span>
        <div className="flex-1 h-1 bg-muted rounded-full relative">
          <div 
            className="absolute h-full bg-success rounded-full"
            style={{ left: `${(warningLow / maxValue) * 100}%`, right: `${100 - (warningHigh / maxValue) * 100}%` }}
          />
        </div>
        <span>{maxValue}%</span>
      </div>
    </div>
  );
};

export default MoistureGauge;

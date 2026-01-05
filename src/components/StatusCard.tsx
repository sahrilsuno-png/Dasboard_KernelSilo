import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status?: 'normal' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
}

const StatusCard = ({ title, value, unit, icon: Icon, status = 'normal', trend }: StatusCardProps) => {
  const statusStyles = {
    normal: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
  };

  const statusTextStyles = {
    normal: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  const statusIconStyles = {
    normal: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-destructive/20 text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "glass-card p-5 border-l-4 transition-all duration-300",
        statusStyles[status]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label text-xs">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={cn("stat-value text-3xl", statusTextStyles[status])}>
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            <span className="text-muted-foreground text-sm">{unit}</span>
          </div>
        </div>
        <div className={cn("p-3 rounded-xl", statusIconStyles[status])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            trend === 'up' ? 'bg-destructive' : trend === 'down' ? 'bg-warning' : 'bg-success'
          )} />
          <span className="text-xs text-muted-foreground">
            {trend === 'up' ? 'Naik' : trend === 'down' ? 'Turun' : 'Stabil'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatusCard;

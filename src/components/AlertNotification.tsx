import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  siloNumber: 1 | 2;
  type: 'high' | 'low';
  value: number;
  timestamp: Date;
}

interface AlertNotificationProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const AlertNotification = ({ alerts, onDismiss }: AlertNotificationProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl",
              alert.type === 'high' 
                ? "bg-destructive/20 border-destructive/50 glow-danger" 
                : "bg-warning/20 border-warning/50 glow-warning"
            )}
          >
            <div className={cn(
              "p-2 rounded-full",
              alert.type === 'high' ? "bg-destructive/30" : "bg-warning/30"
            )}>
              <AlertTriangle className={cn(
                "w-5 h-5",
                alert.type === 'high' ? "text-destructive" : "text-warning"
              )} />
            </div>
            
            <div className="flex-1">
              <p className="font-semibold text-sm">
                Silo {alert.siloNumber} - {alert.type === 'high' ? 'Moisture Tinggi' : 'Moisture Rendah'}
              </p>
              <p className="text-xs text-muted-foreground">
                {alert.value.toFixed(1)}% - {alert.type === 'high' ? 'Di atas 7%' : 'Di bawah 4.5%'}
              </p>
            </div>

            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Alert Badge Component
export const AlertBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      <Bell className="w-6 h-6 text-foreground" />
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-destructive text-destructive-foreground rounded-full"
      >
        {count}
      </motion.span>
    </motion.div>
  );
};

export default AlertNotification;

import { motion } from "framer-motion";
import { Palmtree, Loader2, Factory, Thermometer, Droplets, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LoginProps {
  onLogin: (userName: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      onLogin("Operator PKS");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-palm-dark via-background to-palm-dark/50">
      {/* Background Palm Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10">
          <Palmtree className="w-32 h-32 text-palm-gold" />
        </div>
        <div className="absolute bottom-10 right-10">
          <Palmtree className="w-48 h-48 text-palm-light" />
        </div>
        <div className="absolute top-1/2 right-1/4">
          <Palmtree className="w-24 h-24 text-palm-gold" />
        </div>
      </div>

      {/* Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-palm-gold/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-palm-light/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8 relative z-10 border-palm-gold/30"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-palm-dark to-palm-light mb-4"
          >
            <Palmtree className="w-12 h-12 text-palm-gold" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-palm-gold via-palm-light to-palm-gold bg-clip-text text-transparent mb-2"
          >
            PKS Moisture Monitor
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            Sistem Monitoring Kernel Silo Pabrik Kelapa Sawit
          </motion.p>
        </div>

        {/* Features Preview - Palm Oil Factory Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {[
            { label: 'Monitoring Silo', icon: Factory, color: 'text-palm-gold' },
            { label: 'Moisture Sensor', icon: Droplets, color: 'text-primary' },
            { label: 'Suhu Real-time', icon: Thermometer, color: 'text-orange-400' },
            { label: 'Export Logsheet', icon: FileSpreadsheet, color: 'text-palm-light' },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-palm-dark/30 border border-palm-gold/20"
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-xs font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-14 text-base font-semibold gap-3 bg-gradient-to-r from-palm-gold to-palm-light text-palm-dark hover:from-palm-gold/90 hover:to-palm-light/90 transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Masuk dengan Google
              </>
            )}
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Gunakan akun Google untuk mengakses sistem monitoring PKS
        </motion.p>

        {/* Factory Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-palm-gold/20"
        >
          <Factory className="w-4 h-4 text-palm-gold/50" />
          <span className="text-xs text-palm-gold/50">Pabrik Kelapa Sawit - Kernel Processing</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
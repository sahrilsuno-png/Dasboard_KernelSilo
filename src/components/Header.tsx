import { motion } from "framer-motion";
import { Droplets, Menu, LogOut } from "lucide-react";
import { AlertBadge } from "./AlertNotification";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface HeaderProps {
  alertCount: number;
  userName?: string;
  onLogout?: () => void;
}

const Header = ({ alertCount, userName, onLogout }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Droplets className="w-6 h-6 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gradient-primary">
              Palm Kernel Monitor
            </h1>
            <p className="text-xs text-muted-foreground">
              Sistem Monitoring Moisture Silo
            </p>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Alert Badge */}
          <AlertBadge count={alertCount} />

          {/* User Info */}
          {userName && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">Operator</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Mobile Sheet */}
          <Sheet>
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{userName || 'Guest'}</p>
                    <p className="text-xs text-muted-foreground">Operator</p>
                  </div>
                </div>
                {onLogout && (
                  <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

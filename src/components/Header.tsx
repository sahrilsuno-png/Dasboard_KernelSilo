import { motion } from "framer-motion";
import { Palmtree, LogOut, Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

// Palm Leaf SVG Component
const PalmLeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="none">
    <path
      d="M0 35 Q20 30 40 20 Q50 15 55 10 Q60 15 65 18 Q75 25 100 30"
      stroke="currentColor"
      strokeWidth="2"
      className="text-palm-light/40"
    />
    <path
      d="M10 38 Q30 32 50 22 Q60 17 70 20 Q85 28 95 32"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-palm-gold/30"
    />
    {/* Leaf fronds */}
    <ellipse cx="25" cy="28" rx="8" ry="3" className="fill-palm-light/20" />
    <ellipse cx="45" cy="20" rx="10" ry="4" className="fill-palm-light/15" />
    <ellipse cx="70" cy="22" rx="12" ry="4" className="fill-palm-light/15" />
  </svg>
);

// Fresh Fruit Bunch (TBS) Icon
const FruitBunchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <ellipse cx="12" cy="14" rx="6" ry="8" className="fill-palm-gold/60" />
    <ellipse cx="12" cy="13" rx="5" ry="6" className="fill-palm-gold/80" />
    {/* Individual fruits */}
    <circle cx="10" cy="11" r="1.5" className="fill-red-600/70" />
    <circle cx="14" cy="11" r="1.5" className="fill-red-600/70" />
    <circle cx="12" cy="13" r="1.5" className="fill-red-500/80" />
    <circle cx="10" cy="15" r="1.5" className="fill-orange-500/70" />
    <circle cx="14" cy="15" r="1.5" className="fill-orange-500/70" />
    <circle cx="12" cy="17" r="1.5" className="fill-orange-400/70" />
    {/* Stem */}
    <path d="M12 6 L12 9 Q11 8 10 9 M12 6 Q13 7 14 8" stroke="currentColor" strokeWidth="1.5" className="text-palm-dark" />
  </svg>
);

const Header = ({ userName, onLogout }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full border-b border-palm-light/20 bg-gradient-to-r from-palm-dark via-background to-palm-dark/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Background Palm Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <PalmLeafDecor className="absolute -left-10 -top-2 w-48 h-20 opacity-60 rotate-12" />
        <PalmLeafDecor className="absolute -right-10 -top-2 w-48 h-20 opacity-60 -rotate-12 scale-x-[-1]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-palm-gold/40 to-transparent" />
      </div>

      <div className="container relative flex h-18 sm:h-20 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Animated Logo Container */}
          <motion.div 
            className="relative p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-palm-dark to-palm-light border border-palm-gold/30 shadow-lg shadow-palm-gold/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Palmtree className="w-6 h-6 sm:w-7 sm:h-7 text-palm-gold" />
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-xl border border-palm-gold/20 animate-pulse" />
          </motion.div>

          {/* Title Section */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-palm-gold via-palm-light to-palm-gold bg-clip-text text-transparent">
                PKS Moisture Monitor
              </h1>
              <FruitBunchIcon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Leaf className="w-3 h-3 text-palm-light/60" />
              <p className="text-xs text-palm-light/70 font-medium tracking-wide">
                Pabrik Kelapa Sawit • Kernel Silo Control
              </p>
              <Leaf className="w-3 h-3 text-palm-light/60 scale-x-[-1]" />
            </div>
          </div>

          {/* Mobile Title */}
          <div className="sm:hidden">
            <h1 className="text-base font-bold bg-gradient-to-r from-palm-gold to-palm-light bg-clip-text text-transparent">
              PKS Monitor
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info - Desktop */}
          {userName && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-palm-light/60">Operator PKS</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-palm-light/60 hover:text-palm-gold hover:bg-palm-gold/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Mobile Sheet */}
          <Sheet>
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon" className="text-palm-gold hover:bg-palm-gold/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-gradient-to-b from-palm-dark to-background border-palm-light/20">
              <div className="flex flex-col gap-4 mt-8">
                {/* User Card */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-palm-dark/50 to-palm-light/20 border border-palm-gold/20">
                  <div className="p-2 rounded-full bg-palm-gold/20">
                    <Palmtree className="w-5 h-5 text-palm-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{userName || 'Guest'}</p>
                    <p className="text-xs text-palm-light/60">Operator PKS</p>
                  </div>
                </div>

                {/* TBS Decoration */}
                <div className="flex justify-center py-4">
                  <FruitBunchIcon className="w-16 h-16 opacity-50" />
                </div>

                {onLogout && (
                  <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="justify-start gap-2 text-palm-light/70 hover:text-palm-gold hover:bg-palm-gold/10"
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
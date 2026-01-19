import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MoistureSettingsCardProps {
  moistureMin: number;
  moistureMax: number;
  onSave: (min: number, max: number) => Promise<boolean>;
  isSaving: boolean;
}

const MoistureSettingsCard = ({
  moistureMin,
  moistureMax,
  onSave,
  isSaving,
}: MoistureSettingsCardProps) => {
  const [minValue, setMinValue] = useState(moistureMin.toString());
  const [maxValue, setMaxValue] = useState(moistureMax.toString());
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state when props change
  useEffect(() => {
    setMinValue(moistureMin.toString());
    setMaxValue(moistureMax.toString());
  }, [moistureMin, moistureMax]);

  const handleSave = async () => {
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);

    if (isNaN(min) || isNaN(max)) {
      return;
    }

    const success = await onSave(min, max);
    if (success) {
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setMinValue('4.5');
    setMaxValue('7.0');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="p-4 rounded-xl bg-secondary/50 border border-border"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Standar Moisture:</span>{" "}
            <span className="text-success font-medium">
              {moistureMin}% - {moistureMax}%
            </span>
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Ubah Standar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Setting Standar Moisture
              </DialogTitle>
              <DialogDescription>
                Atur batas atas dan batas bawah moisture kernel. Perubahan akan otomatis diterapkan pada chart dan sistem monitoring.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="min-moisture">Batas Bawah (%)</Label>
                <Input
                  id="min-moisture"
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="4.5"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Nilai minimum moisture yang diizinkan
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-moisture">Batas Atas (%)</Label>
                <Input
                  id="max-moisture"
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="7.0"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Nilai maksimum moisture yang diizinkan
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary">
                  <strong>Preview:</strong> {minValue || '0'}% - {maxValue || '0'}%
                </p>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Default
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default MoistureSettingsCard;

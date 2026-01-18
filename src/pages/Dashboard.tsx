import { motion } from "framer-motion";
import { Droplets, Thermometer, Activity, Clock } from "lucide-react";
import Header from "@/components/Header";
import SiloVisualization from "@/components/SiloVisualization";
import MoistureGauge from "@/components/MoistureGauge";
import TrendChart from "@/components/TrendChart";
import StatusCard from "@/components/StatusCard";
import LogsheetExport from "@/components/LogsheetExport";
import { useSiloData } from "@/hooks/useSiloData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardProps {
  userName?: string;
  onLogout?: () => void;
}

const Dashboard = ({ userName, onLogout }: DashboardProps) => {
  const { silo1, silo2, trendData, logData, MOISTURE_MIN, MOISTURE_MAX } = useSiloData();

  const getStatus = (moisture: number) => {
    if (moisture > MOISTURE_MAX) return 'danger';
    if (moisture < MOISTURE_MIN) return 'warning';
    return 'normal';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={userName}
        onLogout={onLogout}
      />

      <main className="container px-4 py-6 space-y-6">
        {/* Real-time Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 glass-card border-gradient"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Sistem Online - Data Real-time</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            <span>Update: {silo1.lastUpdated.toLocaleTimeString('id-ID')}</span>
          </div>
        </motion.div>

        {/* Silo Visualizations */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Monitoring Silo
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            <SiloVisualization
              siloNumber={1}
              moisture={silo1.moisture}
              temperature={silo1.temperature}
              isAlert={silo1.moisture > MOISTURE_MAX || silo1.moisture < MOISTURE_MIN}
            />
            <SiloVisualization
              siloNumber={2}
              moisture={silo2.moisture}
              temperature={silo2.temperature}
              isAlert={silo2.moisture > MOISTURE_MAX || silo2.moisture < MOISTURE_MIN}
            />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="Moisture Silo 1"
            value={silo1.moisture}
            unit="%"
            icon={Droplets}
            status={getStatus(silo1.moisture)}
            trend={silo1.moisture > 6 ? 'up' : silo1.moisture < 5 ? 'down' : 'stable'}
          />
          <StatusCard
            title="Moisture Silo 2"
            value={silo2.moisture}
            unit="%"
            icon={Droplets}
            status={getStatus(silo2.moisture)}
            trend={silo2.moisture > 6 ? 'up' : silo2.moisture < 5 ? 'down' : 'stable'}
          />
          <StatusCard
            title="Suhu Silo 1"
            value={silo1.temperature}
            unit="°C"
            icon={Thermometer}
            status={silo1.temperature > 50 ? 'warning' : 'normal'}
          />
          <StatusCard
            title="Suhu Silo 2"
            value={silo2.temperature}
            unit="°C"
            icon={Thermometer}
            status={silo2.temperature > 50 ? 'warning' : 'normal'}
          />
        </section>

        {/* Moisture Gauges */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Level Moisture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MoistureGauge
              value={silo1.moisture}
              label="Silo 1"
              minValue={0}
              maxValue={10}
              warningLow={MOISTURE_MIN}
              warningHigh={MOISTURE_MAX}
            />
            <MoistureGauge
              value={silo2.moisture}
              label="Silo 2"
              minValue={0}
              maxValue={10}
              warningLow={MOISTURE_MIN}
              warningHigh={MOISTURE_MAX}
            />
          </div>
        </section>

        {/* Standard Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-secondary/50 border border-border"
        >
          <p className="text-sm text-center text-muted-foreground">
            <span className="font-semibold text-foreground">Standar Moisture:</span>{" "}
            <span className="text-success">4.5% - 7%</span>
          </p>
        </motion.div>

        {/* Trend Charts */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Grafik Trend
          </h2>
          <Tabs defaultValue="moisture" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="moisture">Moisture</TabsTrigger>
              <TabsTrigger value="temperature">Suhu</TabsTrigger>
            </TabsList>
            <TabsContent value="moisture">
              <TrendChart data={trendData} type="moisture" />
            </TabsContent>
            <TabsContent value="temperature">
              <TrendChart data={trendData} type="temperature" />
            </TabsContent>
          </Tabs>
        </section>

        {/* Logsheet Export */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Export Logsheet
          </h2>
          <LogsheetExport logData={logData} />
        </section>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4"
        >
          <h3 className="font-semibold mb-3">Legenda</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span>Silo 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-moisture-low" />
              <span>Silo 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-destructive" style={{ borderTop: '2px dashed' }} />
              <span>Batas Atas (7%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-warning" style={{ borderTop: '2px dashed' }} />
              <span>Batas Bawah (4.5%)</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>Palm Kernel Moisture Monitor v1.0</p>
          <p className="text-xs mt-1">© 2026 - Sistem Monitoring Silo Pabrik Kelapa Sawit</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
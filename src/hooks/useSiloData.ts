import { useState, useEffect, useCallback, useRef } from 'react';

interface SiloData {
  moisture: number;
  temperature: number;
  lastUpdated: Date;
}

interface TrendData {
  time: string;
  silo1Moisture: number;
  silo2Moisture: number;
  silo1Temp: number;
  silo2Temp: number;
}

interface Alert {
  id: string;
  siloNumber: 1 | 2;
  type: 'high' | 'low';
  value: number;
  timestamp: Date;
}

export interface LogEntry {
  timestamp: Date;
  silo1Moisture: number;
  silo1Temp: number;
  silo2Moisture: number;
  silo2Temp: number;
}

const MOISTURE_MIN = 4.5;
const MOISTURE_MAX = 7;
const LOG_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

// Simulate realistic data fluctuations
const generateRandomValue = (base: number, variance: number) => {
  return base + (Math.random() - 0.5) * variance;
};

export const useSiloData = () => {
  const [silo1, setSilo1] = useState<SiloData>({
    moisture: 5.8,
    temperature: 42,
    lastUpdated: new Date(),
  });

  const [silo2, setSilo2] = useState<SiloData>({
    moisture: 6.2,
    temperature: 45,
    lastUpdated: new Date(),
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logData, setLogData] = useState<LogEntry[]>([]);
  
  const lastLogTimeRef = useRef<Date>(new Date());

  // Check for alerts
  const checkAlerts = useCallback((siloNumber: 1 | 2, moisture: number) => {
    if (moisture > MOISTURE_MAX) {
      const newAlert: Alert = {
        id: `${siloNumber}-high-${Date.now()}`,
        siloNumber,
        type: 'high',
        value: moisture,
        timestamp: new Date(),
      };
      setAlerts(prev => [...prev.slice(-4), newAlert]); // Keep last 5 alerts
    } else if (moisture < MOISTURE_MIN) {
      const newAlert: Alert = {
        id: `${siloNumber}-low-${Date.now()}`,
        siloNumber,
        type: 'low',
        value: moisture,
        timestamp: new Date(),
      };
      setAlerts(prev => [...prev.slice(-4), newAlert]);
    }
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  // Add log entry
  const addLogEntry = useCallback((s1: SiloData, s2: SiloData) => {
    const entry: LogEntry = {
      timestamp: new Date(),
      silo1Moisture: s1.moisture,
      silo1Temp: s1.temperature,
      silo2Moisture: s2.moisture,
      silo2Temp: s2.temperature,
    };
    setLogData(prev => [...prev, entry]);
  }, []);

  // Initialize trend data and historical log data
  useEffect(() => {
    const now = new Date();
    const initialData: TrendData[] = [];
    const initialLogData: LogEntry[] = [];
    
    // Generate trend data for the last hour (12 points, every 5 minutes)
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60 * 1000);
      initialData.push({
        time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        silo1Moisture: generateRandomValue(5.5, 1.5),
        silo2Moisture: generateRandomValue(6.0, 1.5),
        silo1Temp: generateRandomValue(42, 5),
        silo2Temp: generateRandomValue(45, 5),
      });
    }
    
    // Generate historical log data (simulating past 24 hours with 30-min intervals = 48 entries)
    for (let i = 47; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30 * 60 * 1000);
      initialLogData.push({
        timestamp: time,
        silo1Moisture: generateRandomValue(5.5, 1.5),
        silo1Temp: generateRandomValue(42, 5),
        silo2Moisture: generateRandomValue(6.0, 1.5),
        silo2Temp: generateRandomValue(45, 5),
      });
    }
    
    setTrendData(initialData);
    setLogData(initialLogData);
    lastLogTimeRef.current = now;
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // Update Silo 1
      const newSilo1Moisture = Math.max(3, Math.min(9, generateRandomValue(silo1.moisture, 0.5)));
      const newSilo1Temp = Math.max(35, Math.min(55, generateRandomValue(silo1.temperature, 2)));
      
      const newSilo1 = {
        moisture: newSilo1Moisture,
        temperature: newSilo1Temp,
        lastUpdated: now,
      };
      setSilo1(newSilo1);
      
      // Update Silo 2
      const newSilo2Moisture = Math.max(3, Math.min(9, generateRandomValue(silo2.moisture, 0.5)));
      const newSilo2Temp = Math.max(35, Math.min(55, generateRandomValue(silo2.temperature, 2)));
      
      const newSilo2 = {
        moisture: newSilo2Moisture,
        temperature: newSilo2Temp,
        lastUpdated: now,
      };
      setSilo2(newSilo2);

      // Check for alerts
      checkAlerts(1, newSilo1Moisture);
      checkAlerts(2, newSilo2Moisture);

      // Update trend data
      setTrendData(prev => {
        const newData = [...prev.slice(1), {
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          silo1Moisture: newSilo1Moisture,
          silo2Moisture: newSilo2Moisture,
          silo1Temp: newSilo1Temp,
          silo2Temp: newSilo2Temp,
        }];
        return newData;
      });

      // Log data every 30 minutes
      const timeSinceLastLog = now.getTime() - lastLogTimeRef.current.getTime();
      if (timeSinceLastLog >= LOG_INTERVAL_MS) {
        addLogEntry(newSilo1, newSilo2);
        lastLogTimeRef.current = now;
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [silo1.moisture, silo1.temperature, silo2.moisture, silo2.temperature, checkAlerts, addLogEntry]);

  return {
    silo1,
    silo2,
    trendData,
    alerts,
    dismissAlert,
    logData,
    MOISTURE_MIN,
    MOISTURE_MAX,
  };
};

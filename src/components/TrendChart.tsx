import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, Label, Legend } from "recharts";
import { motion } from "framer-motion";

interface TrendChartProps {
  data: Array<{
    time: string;
    timeLabel: string;
    silo1Moisture: number;
    silo2Moisture: number;
    silo1Temp: number;
    silo2Temp: number;
  }>;
  type: 'moisture' | 'temperature';
}

const TrendChart = ({ data, type }: TrendChartProps) => {
  const isMoisture = type === 'moisture';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 h-80"
    >
      <h3 className="stat-label mb-4">
        {isMoisture ? 'Trend Moisture (%)' : 'Trend Suhu (°C)'}
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <defs>
            <linearGradient id="silo1Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="silo2Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 40%, 18%)" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={9}
            tickLine={false}
            interval="preserveStartEnd"
            tick={{ dy: 5 }}
          >
            <Label 
              value="Waktu (menit)" 
              position="bottom" 
              offset={15}
              style={{ fill: 'hsl(215, 20%, 65%)', fontSize: '11px' }}
            />
          </XAxis>
          <YAxis 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={10}
            tickLine={false}
            domain={isMoisture ? [0, 10] : [20, 60]}
          >
            <Label 
              value={isMoisture ? "Moisture (%)" : "Suhu (°C)"} 
              angle={-90} 
              position="insideLeft" 
              offset={10}
              style={{ fill: 'hsl(215, 20%, 65%)', fontSize: '11px', textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 40%, 18%)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)}${isMoisture ? '%' : '°C'}`,
              name
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return `Waktu: ${payload[0]?.payload?.timeLabel || label}`;
              }
              return `Waktu: ${label}`;
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ fontSize: '11px' }}
          />
          {isMoisture && (
            <>
              <ReferenceLine y={7} stroke="hsl(0, 72%, 51%)" strokeDasharray="5 5" label={{ value: '7%', position: 'right', fontSize: 10, fill: 'hsl(0, 72%, 51%)' }} />
              <ReferenceLine y={4.5} stroke="hsl(38, 92%, 50%)" strokeDasharray="5 5" label={{ value: '4.5%', position: 'right', fontSize: 10, fill: 'hsl(38, 92%, 50%)' }} />
            </>
          )}
          <Area
            type="monotone"
            dataKey={isMoisture ? "silo1Moisture" : "silo1Temp"}
            stroke="hsl(168, 76%, 42%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#silo1Gradient)"
            name="Silo 1"
          />
          <Area
            type="monotone"
            dataKey={isMoisture ? "silo2Moisture" : "silo2Temp"}
            stroke="hsl(199, 89%, 48%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#silo2Gradient)"
            name="Silo 2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TrendChart;
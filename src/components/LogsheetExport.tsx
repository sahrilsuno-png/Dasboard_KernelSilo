import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

interface LogEntry {
  timestamp: Date;
  silo1Moisture: number;
  silo1Temp: number;
  silo2Moisture: number;
  silo2Temp: number;
}

interface LogsheetExportProps {
  logData: LogEntry[];
}

const LogsheetExport = ({ logData }: LogsheetExportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      // Format data for Excel
      const formattedData = logData.map((entry) => ({
        'Tanggal': entry.timestamp.toLocaleDateString('id-ID'),
        'Waktu': entry.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        'Silo 1 - Moisture (%)': entry.silo1Moisture.toFixed(2),
        'Silo 1 - Suhu (°C)': entry.silo1Temp.toFixed(1),
        'Silo 2 - Moisture (%)': entry.silo2Moisture.toFixed(2),
        'Silo 2 - Suhu (°C)': entry.silo2Temp.toFixed(1),
        'Status Silo 1': getStatus(entry.silo1Moisture),
        'Status Silo 2': getStatus(entry.silo2Moisture),
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 12 }, // Tanggal
        { wch: 8 },  // Waktu
        { wch: 20 }, // Silo 1 Moisture
        { wch: 18 }, // Silo 1 Suhu
        { wch: 20 }, // Silo 2 Moisture
        { wch: 18 }, // Silo 2 Suhu
        { wch: 12 }, // Status Silo 1
        { wch: 12 }, // Status Silo 2
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Logsheet Moisture');

      // Generate filename with date
      const now = new Date();
      const filename = `Logsheet_Moisture_${now.toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatus = (moisture: number) => {
    if (moisture > 7) return 'TINGGI';
    if (moisture < 4.5) return 'RENDAH';
    return 'NORMAL';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Logsheet Data</h3>
            <p className="text-sm text-muted-foreground">
              Record per 30 menit • {logData.length} data tersimpan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              {logData.length > 0 
                ? `${logData[0].timestamp.toLocaleDateString('id-ID')} - ${logData[logData.length - 1].timestamp.toLocaleDateString('id-ID')}`
                : 'Belum ada data'}
            </span>
          </div>
          
          <Button
            onClick={exportToExcel}
            disabled={isExporting || logData.length === 0}
            className="ml-auto sm:ml-2"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Mengunduh...' : 'Export Excel'}
          </Button>
        </div>
      </div>

      {/* Preview Table */}
      {logData.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Waktu</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">S1 Moist</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">S1 Suhu</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">S2 Moist</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">S2 Suhu</th>
              </tr>
            </thead>
            <tbody>
              {logData.slice(-5).reverse().map((entry, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-2 px-2">
                    {entry.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className={`text-center py-2 px-2 ${getMoistureColor(entry.silo1Moisture)}`}>
                    {entry.silo1Moisture.toFixed(1)}%
                  </td>
                  <td className="text-center py-2 px-2">{entry.silo1Temp.toFixed(0)}°C</td>
                  <td className={`text-center py-2 px-2 ${getMoistureColor(entry.silo2Moisture)}`}>
                    {entry.silo2Moisture.toFixed(1)}%
                  </td>
                  <td className="text-center py-2 px-2">{entry.silo2Temp.toFixed(0)}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Menampilkan 5 data terakhir
          </p>
        </div>
      )}
    </motion.div>
  );
};

const getMoistureColor = (value: number) => {
  if (value > 7) return 'text-destructive';
  if (value < 4.5) return 'text-warning';
  return 'text-success';
};

export default LogsheetExport;

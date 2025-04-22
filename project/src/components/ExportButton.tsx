import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  data: any[];
  filename: string;
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
    setIsOpen(false);
  };

  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white text-secondary-dark hover:bg-background rounded-lg text-sm border border-secondary/20"
      >
        <Download className="w-4 h-4" />
        Exportar
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary/10 z-40">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-secondary-dark hover:bg-background"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar a Excel
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-secondary-dark hover:bg-background"
            >
              <FileText className="w-4 h-4" />
              Exportar a CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}
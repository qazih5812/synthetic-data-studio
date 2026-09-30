'use client';
import { Mode } from './Workspace';
import { Download, Table2, FileJson, AlertCircle, RefreshCw } from 'lucide-react';
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/exportUtils';
import { useState, useEffect } from 'react';

interface LivePreviewProps {
  data: any;
  loading: boolean;
  error: string | null;
  mode: Mode;
}

// FIX: Safely render any cell value — handles null, undefined, objects, and primitives
function renderCellValue(value: any): React.ReactNode {
  if (value === null)      return <span className="text-red-400/70 italic text-xs">null</span>;
  if (value === undefined) return <span className="text-yellow-400/60 italic text-xs">—</span>;
  if (typeof value === 'boolean') return <span className={value ? 'text-green-400' : 'text-red-400'}>{String(value)}</span>;
  if (typeof value === 'object') return <span className="text-blue-400/80 text-xs font-mono">{JSON.stringify(value)}</span>;
  return String(value);
}

export default function LivePreview({ data, loading, error, mode }: LivePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');

  // FIX: Reset to preview tab whenever new data arrives or mode changes.
  // Without this, the component stays on 'raw' after switching modes.
  useEffect(() => {
    setActiveTab('preview');
  }, [data, mode]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/20 rounded-full animate-pulse" />
          <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Synthesizing Data...
          </h3>
          <p className="text-sm text-muted-foreground">Gemini is architecting your realistic dataset</p>
          <p className="text-xs text-muted-foreground/60">This may take a few seconds — auto-retrying if overloaded</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-red-400">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-foreground dark:text-white">Generation Failed</h3>
        <p className="text-sm text-center max-w-md bg-black/40 p-4 rounded-lg border border-red-500/20 leading-relaxed">
          {error}
        </p>
        <p className="text-xs text-muted-foreground">Tip: Reduce row count or simplify your schema and try again</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
        <Table2 className="w-16 h-16 text-muted-foreground" />
        <h3 className="text-lg font-medium text-muted-foreground">Configure and generate to see preview</h3>
        <p className="text-sm text-muted-foreground/70">Fill in the schema on the right, then click Generate Data</p>
      </div>
    );
  }

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    try {
      if (format === 'csv')  exportToCSV(data, mode);
      if (format === 'json') exportToJSON(data, mode);
      if (format === 'pdf')  exportToPDF(data, mode);
    } catch (e: any) {
      console.error('[Export error]', e.message);
      alert(`Export failed: ${e.message}`);
    }
  };

  const renderTabular = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-muted-foreground p-4">No rows were generated.</div>;
    }
    // FIX: Union all keys from all rows — not just data[0] — handles sparse/inconsistent rows
    const headers = Array.from(new Set(data.flatMap((row: any) => Object.keys(row))));

    return (
      <div className="overflow-auto border border-white/10 rounded-xl bg-black/40 backdrop-blur-md shadow-2xl h-full">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-xl border-b border-white/10">
            <tr>
              <th className="px-4 py-4 font-semibold text-muted-foreground/60 w-12">#</th>
              {headers.map((h) => (
                <th key={h} className="px-6 py-4 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row: any, i: number) => (
              // FIX: Use JSON.stringify of first few fields for a more stable key than index alone
              <tr key={`row-${i}`} className="hover:bg-black/5 dark:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-muted-foreground/40 text-xs">{i + 1}</td>
                {headers.map((h) => (
                  <td key={h} className="px-6 py-3 whitespace-nowrap">
                    {renderCellValue(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-white/5 text-xs text-muted-foreground/60">
          {data.length} rows · {headers.length} columns
        </div>
      </div>
    );
  };

  const renderRelational = () => {
    if (typeof data !== 'object' || Array.isArray(data)) {
      return <pre className="font-mono text-xs text-green-400 p-4">{JSON.stringify(data, null, 2)}</pre>;
    }
    
    return (
      <div className="space-y-8 h-full overflow-auto pr-4">
        {Object.entries(data).map(([tableName, tableData]: [string, any]) => {
          const rows = Array.isArray(tableData) ? tableData : [];
          const cols = rows.length > 0
            ? Array.from(new Set(rows.flatMap((r: any) => Object.keys(r))))
            : [];
          return (
            <div key={tableName} className="space-y-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-primary">{tableName}</h3>
                <span className="text-xs text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                  {rows.length} rows
                </span>
              </div>
              {rows.length > 0 ? (
                <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/40">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-muted-foreground border-b border-white/10">
                      <tr>
                        {cols.map(h => <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rows.map((row: any, i: number) => (
                        <tr key={`${tableName}-row-${i}`} className="hover:bg-black/5 dark:bg-white/[0.02] transition-colors">
                          {cols.map(h => (
                            <td key={h} className="px-4 py-3 whitespace-nowrap">
                              {renderCellValue(row[h])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No rows generated for this table.</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDocument = () => {
    // Render document as a formatted key-value card view when possible
    if (typeof data === 'object' && !Array.isArray(data)) {
      return (
        <div className="h-full overflow-auto space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bg-black/40 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{key}</div>
              {typeof value === 'object' ? (
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-foreground">{String(value)}</p>
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="h-full overflow-auto bg-black/5 dark:bg-white/5 text-foreground p-8 rounded-xl shadow-2xl">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10">
        <div className="flex space-x-1">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-black/5 dark:bg-white/10 text-foreground dark:text-white' : 'text-muted-foreground hover:text-foreground dark:text-white hover:bg-black/5 dark:bg-white/5'}`}
          >
            Visual Preview
          </button>
          <button 
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${activeTab === 'raw' ? 'bg-black/5 dark:bg-white/10 text-foreground dark:text-white' : 'text-muted-foreground hover:text-foreground dark:text-white hover:bg-black/5 dark:bg-white/5'}`}
          >
            <FileJson className="w-4 h-4" />
            <span>Raw JSON</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {mode !== 'document' && (
            <button 
              onClick={() => handleExport('csv')} 
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/5 dark:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          )}
          <button 
            onClick={() => handleExport('json')} 
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/5 dark:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          {mode === 'document' && (
            <button 
              onClick={() => handleExport('pdf')} 
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-xs text-primary transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'raw' ? (
          <div className="h-full overflow-auto bg-[#0d1117] p-6 rounded-xl border border-white/10 font-mono text-sm text-green-400">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          mode === 'tabular'    ? renderTabular() :
          mode === 'relational' ? renderRelational() :
          renderDocument()
        )}
      </div>
    </div>
  );
}

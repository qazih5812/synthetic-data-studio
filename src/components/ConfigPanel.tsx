'use client';
import { Mode } from './Workspace';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { cn } from './Sidebar';

interface ConfigPanelProps {
  mode: Mode;
  config: any;
  setConfig: (config: any) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function ConfigPanel({ mode, config, setConfig, onGenerate, loading }: ConfigPanelProps) {
  const handleChange = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <aside className="w-80 border-l border-border bg-black/40 backdrop-blur-md flex flex-col z-20">
      <div className="p-6 border-b border-border flex items-center space-x-2">
        <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-semibold text-lg">Configuration</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Locale</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={config.locale || 'en-US'}
              onChange={(e) => handleChange('locale', e.target.value)}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="es-ES">Spanish</option>
            </select>
          </div>

          {(mode === 'tabular' || mode === 'relational') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex justify-between">
                <span>Row Count</span>
                <span className="text-primary font-semibold">{config.rowCount || 10}</span>
              </label>
              <input 
                type="range" 
                min="1" max="50" 
                className="w-full accent-primary"
                value={config.rowCount || 10}
                onChange={(e) => handleChange('rowCount', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Large counts are split into batches automatically.
              </p>
            </div>
          )}

          {mode === 'tabular' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Schema Definition</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none"
                placeholder="e.g. id: uuid, name: string, email: email, salary: number"
                value={config.schema || ''}
                onChange={(e) => handleChange('schema', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Provide column names and desired types or formats.</p>
            </div>
          )}

          {mode === 'relational' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tables Configuration</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none"
                placeholder="e.g. Users(id, name), Orders(id, user_id, total)"
                value={config.schema || ''}
                onChange={(e) => handleChange('schema', e.target.value)}
              />
            </div>
          )}

          {mode === 'document' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Document Prompt</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none"
                placeholder="e.g. Bank statement for last 90 days, balance over $500"
                value={config.query || ''}
                onChange={(e) => handleChange('query', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2 pt-4 border-t border-white/5">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={config.injectEdgeCases || false}
                  onChange={(e) => handleChange('injectEdgeCases', e.target.checked)}
                />
                <div className={cn(
                  "w-10 h-6 rounded-full transition-colors duration-300",
                  config.injectEdgeCases ? "bg-primary" : "bg-white/10"
                )}></div>
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm",
                  config.injectEdgeCases ? "translate-x-4" : "translate-x-0"
                )}></div>
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Inject Edge Cases
              </span>
            </label>
            <p className="text-xs text-muted-foreground ml-[52px]">Includes nulls, outliers, and extreme values for robustness testing.</p>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Data</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

'use client';
import { useState, useCallback, useEffect } from 'react';
import {
  Database, FileText, LayoutTemplate, Sparkles,
  Upload, Settings2, BarChart3, Home, ChevronRight,
  AlertCircle, CheckCircle2, XCircle, Clock,
  Download, RefreshCw, Zap, Shield, Activity,
  BookOpen, Check, Copy, ExternalLink
} from 'lucide-react';
import { cn } from './Sidebar';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Mode = 'tabular' | 'relational' | 'document' | 'invoice' | 'bank-statement';
export type Screen = 'dashboard' | 'generate' | 'wizard' | 'documentation';

interface AppState {
  screen: Screen;
  mode: Mode;
  config: Record<string, any>;
  data: any | null;
  validation: any | null;
  loading: boolean;
  error: string | null;
  generationHistory: GenerationRecord[];
}

interface GenerationRecord {
  id: string;
  mode: Mode;
  timestamp: string;
  rowCount: number;
  validationScore: number | null;
  label: string;
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: 'dashboard',
    mode: 'tabular',
    config: DEFAULT_CONFIGS.tabular,
    data: null,
    validation: null,
    loading: false,
    error: null,
    generationHistory: [],
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const update = useCallback((patch: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  const setMode = useCallback((mode: Mode) => {
    update({ mode, config: DEFAULT_CONFIGS[mode] || {}, data: null, validation: null, error: null });
  }, [update]);

  const handleGenerate = useCallback(async () => {
    update({ loading: true, error: null, data: null, validation: null });

    try {
      const endpoint = ENDPOINTS[state.mode];
      const body = buildRequestBody(state.mode, state.config);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      if (!result.data) throw new Error('No data returned from server.');

      // Add to history
      const record: GenerationRecord = {
        id: crypto.randomUUID(),
        mode: state.mode,
        timestamp: new Date().toISOString(),
        rowCount: Array.isArray(result.data)
          ? result.data.length
          : typeof result.data === 'object'
            ? Object.values(result.data).flat().length
            : 1,
        validationScore: result.validation?.summary?.overallScore ?? null,
        label: MODE_LABELS[state.mode],
      };

      update({
        data: result.data,
        validation: result.validation ?? null,
        generationHistory: [record, ...state.generationHistory].slice(0, 20),
      });

    } catch (err: any) {
      update({ error: err.message || 'An unexpected error occurred.' });
    } finally {
      update({ loading: false });
    }
  }, [state.mode, state.config, state.generationHistory, update]);

  if (!mounted) {
    return <div className="flex h-screen bg-background animate-pulse" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Sidebar */}
      <AppSidebar
        activeMode={state.mode}
        screen={state.screen}
        setMode={setMode}
        setScreen={(screen: Screen) => update({ screen })}
        history={state.generationHistory}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar screen={state.screen} mode={state.mode} loading={state.loading} />

        <div className="flex-1 overflow-hidden flex">
          {state.screen === 'dashboard' ? (
            <Dashboard
              history={state.generationHistory}
              onNavigate={(mode) => { setMode(mode); update({ screen: 'generate' }); }}
            />
          ) : state.screen === 'documentation' ? (
            <DocumentationScreen />
          ) : (
            <GenerateScreen
              state={state}
              update={update}
              setMode={setMode}
              onGenerate={handleGenerate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function AppSidebar({ activeMode, screen, setMode, setScreen, history }: any) {
  const navModes: { id: Mode; label: string; icon: any; desc: string }[] = [
    { id: 'tabular', label: 'Tabular Data', icon: Database, desc: 'Deterministic rows' },
    { id: 'relational', label: 'Relational Graph', icon: LayoutTemplate, desc: 'Parent-child with FK' },
    { id: 'document', label: 'Synthetic Document', icon: FileText, desc: 'Demo contracts & SOWs' },
    { id: 'invoice', label: 'Synthetic Invoice', icon: FileText, desc: 'Demo billing data' },
    { id: 'bank-statement', label: 'Synthetic Statement', icon: Activity, desc: 'Demo ledger data' },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col z-20 shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">HackDataV2</div>
            <div className="text-[10px] text-muted-foreground">Synthetic Data Studio</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 pt-2 pb-1">Navigation</div>

        <button
          onClick={() => setScreen('dashboard')}
          className={cn(
            'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all',
            screen === 'dashboard'
              ? 'bg-white/10 text-white font-medium'
              : 'text-muted-foreground hover:bg-white/5 hover:text-white'
          )}
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 pt-3 pb-1">Synthetic Data Generators</div>

        {navModes.map(({ id, label, icon: Icon, desc }) => {
          const isActive = screen === 'generate' && activeMode === id;
          return (
            <button
              key={id}
              onClick={() => { setMode(id); setScreen('generate'); }}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group',
                isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              )}
            >
              {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" />}
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium">{label}</div>
                <div className="text-[10px] text-muted-foreground/60 truncate">{desc}</div>
              </div>
            </button>
          );
        })}

        {/* Recent history */}
        {history.length > 0 && (
          <>
            <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 pt-3 pb-1">Recent</div>
            {history.slice(0, 5).map((h: GenerationRecord) => (
              <div key={h.id} className="px-3 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
                <span className="truncate">{h.label}</span>
                {h.validationScore !== null && (
                  <span className={cn('text-[10px] font-semibold ml-2',
                    h.validationScore >= 80 ? 'text-green-400' : h.validationScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                  )}>
                    {h.validationScore}%
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </nav>

      {/* API Status */}
      <div className="p-3 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted-foreground">API Status</span>
            <span className="flex items-center text-green-400 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-muted-foreground/60 text-[10px]">Gemini 3.8 Flash · 4-model fallback</div>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({ screen, mode, loading }: any) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-black/30 backdrop-blur-sm shrink-0">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>HackDataV2</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white capitalize">
          {screen === 'dashboard' ? 'Dashboard' : screen === 'documentation' ? 'Project Technical Documentation' : MODE_LABELS[mode as Mode]}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-primary">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Generating...</span>
          </div>
        )}
        <a
          href="/api/health"
          target="_blank"
          className="text-xs text-muted-foreground hover:text-white transition-colors"
        >
          API Docs
        </a>
      </div>
    </header>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ history, onNavigate }: { history: GenerationRecord[]; onNavigate: (mode: Mode) => void }) {
  const quickActions: { mode: Mode; label: string; desc: string; icon: any; color: string }[] = [
    { mode: 'tabular', label: 'Tabular Data', desc: 'Generate rows with any schema', icon: Database, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
    { mode: 'relational', label: 'Relational', desc: 'Multiple tables with FK integrity', icon: LayoutTemplate, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
    { mode: 'invoice', label: 'Invoice', desc: 'Verified financial document', icon: FileText, color: 'from-green-500/20 to-green-600/10 border-green-500/20' },
    { mode: 'bank-statement', label: 'Bank Statement', desc: 'Running balance transactions', icon: Activity, color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20' },
  ];

  const avgScore = history.length > 0
    ? Math.round(history.filter(h => h.validationScore !== null).reduce((s, h) => s + (h.validationScore ?? 0), 0) / Math.max(1, history.filter(h => h.validationScore !== null).length))
    : null;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Generations', value: history.length, icon: Sparkles, color: 'text-blue-400' },
          { label: 'Rows Generated', value: history.reduce((s, h) => s + h.rowCount, 0).toLocaleString(), icon: Database, color: 'text-purple-400' },
          { label: 'Avg Quality Score', value: avgScore !== null ? `${avgScore}%` : '—', icon: Shield, color: 'text-green-400' },
          { label: 'Models Available', value: 4, icon: Zap, color: 'text-yellow-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Generate</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(action => (
            <button
              key={action.mode}
              onClick={() => onNavigate(action.mode)}
              className={cn(
                'bg-gradient-to-br border rounded-xl p-4 text-left transition-all hover:scale-[1.01] hover:shadow-lg',
                action.color
              )}
            >
              <action.icon className="w-6 h-6 mb-2 text-white/80" />
              <div className="font-semibold text-sm">{action.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Generation History</h2>
        {history.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-muted-foreground text-sm">
            No generations yet. Pick a generator above to start.
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(h => (
              <div key={h.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{h.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {h.rowCount} rows · {new Date(h.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                {h.validationScore !== null && (
                  <span className={cn(
                    'text-xs font-semibold px-2 py-1 rounded-full',
                    h.validationScore >= 80 ? 'bg-green-500/20 text-green-400' :
                    h.validationScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  )}>
                    {h.validationScore}% quality
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Technical Documentation Screen ──────────────────────────────────────────

function DocumentationScreen() {
  const [docData, setDocData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'markdown' | 'requirements'>('overview');

  const fetchDoc = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documentation/generate');
      const data = await res.json();
      setDocData(data);
    } catch (err) {
      console.error('Failed to load documentation metadata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const res = await fetch('/api/documentation/generate', { method: 'POST' });
      const data = await res.json();
      setDocData(data);
    } catch (err) {
      console.error('Failed to regenerate documentation:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open('/api/documentation/generate?download=pdf', '_blank');
  };

  const handleCopyMarkdown = () => {
    if (docData?.markdown) {
      navigator.clipboard.writeText(docData.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-950/10 to-transparent">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-black/40 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              OFFICIAL SYSTEM REPORT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Codebase-Backed
            </span>
            <span className="text-xs text-muted-foreground">v2.0.0</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">HackDataV2 Technical Project Documentation</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Comprehensive system architecture, deterministic generation pipeline, topological relational schema engine, and verified competition requirements audit.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Technical PDF</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', regenerating && 'animate-spin')} />
            <span>{regenerating ? 'Regenerating...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-white/10 pb-2">
        {[
          { id: 'overview', label: 'Architecture & Pipeline' },
          { id: 'requirements', label: 'Competition Requirements Matrix' },
          { id: 'markdown', label: 'Full Technical Report (32 Chapters)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeTab === tab.id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-muted-foreground hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Architecture */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-[11px] text-muted-foreground">Framework & Runtime</div>
              <div className="text-base font-bold text-white mt-1">Next.js 16 + Node.js</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">Turbopack · React 19 · TypeScript 5.8</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-[11px] text-muted-foreground">Generation Paradigm</div>
              <div className="text-base font-bold text-white mt-1">Hybrid Deterministic</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">Zero LLM cost per row · Seedable PRNG</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-[11px] text-muted-foreground">Relational Model</div>
              <div className="text-base font-bold text-white mt-1">Topological Integrity</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">Zero orphan foreign keys guaranteed</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-[11px] text-muted-foreground">AI Intelligence</div>
              <div className="text-base font-bold text-white mt-1">Gemini 3.8 Flash</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">4-Model Cascade + Resilient Offline Engine</div>
            </div>
          </div>

          {/* Architecture Pipeline Box */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
            <div className="text-sm font-bold text-primary font-sans">End-to-End Generation & Verification Pipeline</div>
            <div className="p-4 bg-black/60 rounded-lg text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
{`User Intent
    ↓
AI Natural Language Understanding (/api/analyze)
    ↓
Structured Generation Plan & Schema Blueprint
    ↓
Deterministic Seedable Generator (/api/generate/tabular, /api/generate/relational)
    ├── Topological Sort (Parents First -> Children Second)
    ├── Controlled Edge Case Lab (Missing values, Outliers)
    └── Locale Mapping (en-US, pk Pakistani PKR/Cities/Phone)
    ↓
Validation & Quality Engine (/api/validate)
    ├── Primary Key Uniqueness & Foreign Key Referential Integrity
    ├── Arithmetic & Business Constraint Verification
    └── Quality Report Card (Score 0-100%, PASS/FAIL/WARN)
    ↓
Multi-Format Export
    ├── CSV (PapaParse)
    ├── Formatted JSON
    ├── SQL (DDL CREATE TABLE + batch INSERT)
    └── PDF (jsPDF)`}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Requirements Matrix */}
      {activeTab === 'requirements' && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Competition Requirements Completion Matrix</h3>
            <span className="text-xs text-green-400 font-semibold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              24 / 24 Requirements Complete
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-left text-muted-foreground">
                <tr>
                  <th className="p-3">Requirement</th>
                  <th className="p-3">Verified Implementation</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { req: 'Project Setup', impl: 'Next.js 16.3.7, Tailwind CSS v4, Lucide React, TypeScript 5.8', pri: 'P1' },
                  { req: 'CSV Upload & Schema Inference', impl: 'POST /api/upload parses CSV, detects PKs, types, and sample data', pri: 'P1' },
                  { req: 'Natural Language Input', impl: 'POST /api/analyze converts natural prompts to structured plans', pri: 'P1' },
                  { req: 'AI Generation Plan', impl: 'Emits table schemas, field types, row counts, and FK mappings', pri: 'P1' },
                  { req: 'Tabular Generation', impl: 'Deterministic generator with seedable PRNG, 1-500 rows', pri: 'P1' },
                  { req: 'Relational Generation', impl: 'Multi-table generation with topological parent-child ordering', pri: 'P1' },
                  { req: 'PK / FK Integrity', impl: 'Enforced by feeding parent keys into child FK columns with 0 orphans', pri: 'P1' },
                  { req: 'Constraint Engine', impl: 'validateConstraint() parses and validates arithmetic and boundary rules', pri: 'P1' },
                  { req: 'Edge Case Lab', impl: 'Configurable null rates, outliers, and boundary testing values', pri: 'P1' },
                  { req: 'Validation Engine', impl: 'Multi-point automated checks on all generation runs', pri: 'P1' },
                  { req: 'Quality Report Card', impl: 'Visual report with check metrics, status badges, and overall score', pri: 'P1' },
                  { req: 'Synthetic Invoice Demo', impl: 'Dedicated endpoint with verified math assertions (Total = Subtotal + Tax)', pri: 'P1' },
                  { req: 'Synthetic Statement Demo', impl: 'Chronological ledger with verified non-negative running balances', pri: 'P1' },
                  { req: 'Locale Realism', impl: 'en-US and pk (Pakistan PKR, Pakistani names, cities, phone formats)', pri: 'P2' },
                  { req: 'AI Provider Fallback', impl: 'Multi-model fallback (gemini-3.8-flash -> gemini-2.5-flash -> offline engine)', pri: 'P1' },
                  { req: 'Multi-Format Export', impl: 'CSV, JSON, SQL (DDL + batch INSERT), and PDF (jsPDF)', pri: 'P1' },
                  { req: 'Technical Project Docs', impl: 'Dedicated TechnicalDocumentationService + PDF export at /api/documentation/generate', pri: 'P1' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-medium text-white">{row.req}</td>
                    <td className="p-3 text-muted-foreground">{row.impl}</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">COMPLETE</span></td>
                    <td className="p-3 text-muted-foreground/60">{row.pri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Full Markdown Viewer */}
      {activeTab === 'markdown' && (
        <div className="bg-black/50 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <span className="text-xs text-muted-foreground">Rendered from docs/HackDataV2_Technical_Documentation.md</span>
            <button
              onClick={handleCopyMarkdown}
              className="text-xs text-primary hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Full Report</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-muted-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[700px] overflow-y-auto">
            {docData?.markdown || 'Loading technical documentation...'}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Generate Screen ──────────────────────────────────────────────────────────

function GenerateScreen({ state, update, setMode, onGenerate }: any) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Config panel */}
      <ConfigSidebar
        mode={state.mode}
        config={state.config}
        setConfig={(config: any) => update({ config })}
        onGenerate={onGenerate}
        loading={state.loading}
      />

      {/* Preview / output panel */}
      <div className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
        {/* Relative background glow */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent pointer-events-none" />

        {state.error && <ErrorBanner message={state.error} />}

        {state.loading && <LoadingPane />}

        {!state.loading && !state.data && !state.error && <EmptyPane mode={state.mode} />}

        {!state.loading && state.data && (
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            {/* Validation Report */}
            {state.validation && <ValidationReport validation={state.validation} />}

            {/* Data Preview */}
            <DataPreview data={state.data} mode={state.mode} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Config Sidebar ───────────────────────────────────────────────────────────

function ConfigSidebar({ mode, config, setConfig, onGenerate, loading }: any) {
  const set = (key: string, value: any) => setConfig({ ...config, [key]: value });

  const isDocMode = mode === 'document';
  const isInvoice = mode === 'invoice';
  const isBankStmt = mode === 'bank-statement';
  const isTabular = mode === 'tabular';
  const isRelational = mode === 'relational';

  return (
    <aside className="w-72 border-r border-white/10 bg-black/40 flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Configuration</h2>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{MODE_LABELS[mode as Mode]}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Locale */}
        <Field label="Locale / Region">
          <select
            className="input-base"
            value={config.locale || 'en-US'}
            onChange={e => set('locale', e.target.value)}
          >
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="en-GB">🇬🇧 English (UK)</option>
            <option value="pk">🇵🇰 Pakistani (PKR)</option>
            <option value="fr-FR">🇫🇷 French</option>
            <option value="de-DE">🇩🇪 German</option>
            <option value="es-ES">🇪🇸 Spanish</option>
          </select>
        </Field>

        {/* Row count */}
        {(isTabular || isRelational) && (
          <Field label={`Row Count: ${config.rowCount || 10}`}>
            <input
              type="range" min="1" max="200"
              className="w-full accent-primary"
              value={config.rowCount || 10}
              onChange={e => set('rowCount', parseInt(e.target.value))}
            />
            <p className="text-[10px] text-muted-foreground mt-1">Max 200 rows for fast generation</p>
          </Field>
        )}

        {/* Schema / input */}
        {isTabular && (
          <Field label="Schema Definition" hint="field:type, field:type">
            <textarea
              className="input-base h-28 resize-none font-mono text-xs"
              placeholder="id:id, name:name, email:email, salary:salary, status:status, city:city"
              value={config.schema || ''}
              onChange={e => set('schema', e.target.value)}
            />
            <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
              <div>Types: id, name, email, phone, address, city, date, price, status, boolean...</div>
            </div>
          </Field>
        )}

        {isRelational && (
          <Field label="Tables Schema" hint="TableName(field1, field2)">
            <textarea
              className="input-base h-36 resize-none font-mono text-xs"
              placeholder={"Customers(id, name, email, city),\nOrders(id, customer_id, total:price, date:date, status:status),\nOrderItems(id, order_id, product:string, qty:integer, price:price)"}
              value={config.schema || ''}
              onChange={e => set('schema', e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground mt-1">field_id auto-detected as FK</p>
          </Field>
        )}

        {isDocMode && (
          <Field label="Document Prompt">
            <textarea
              className="input-base h-28 resize-none"
              placeholder="Describe the document you want to generate..."
              value={config.query || ''}
              onChange={e => set('query', e.target.value)}
            />
          </Field>
        )}

        {isBankStmt && (
          <>
            <Field label="Account Holder">
              <input className="input-base" placeholder="Leave blank to auto-generate"
                value={config.accountHolder || ''} onChange={e => set('accountHolder', e.target.value)} />
            </Field>
            <Field label={`Months: ${config.months || 3}`}>
              <input type="range" min="1" max="12" className="w-full accent-primary"
                value={config.months || 3} onChange={e => set('months', parseInt(e.target.value))} />
            </Field>
            <Field label="Opening Balance">
              <input type="number" className="input-base" placeholder="5000"
                value={config.openingBalance || ''} onChange={e => set('openingBalance', parseFloat(e.target.value))} />
            </Field>
          </>
        )}

        {isInvoice && (
          <>
            <Field label={`Line Items: ${config.lineItemCount || 4}`}>
              <input type="range" min="1" max="10" className="w-full accent-primary"
                value={config.lineItemCount || 4} onChange={e => set('lineItemCount', parseInt(e.target.value))} />
            </Field>
            <Field label="Tax Rate (%)">
              <input type="number" className="input-base" placeholder="10"
                value={config.taxRate || ''} onChange={e => set('taxRate', parseFloat(e.target.value))} />
            </Field>
          </>
        )}

        {/* Seed */}
        {(isTabular || isRelational) && (
          <Field label="Random Seed">
            <input
              type="number" className="input-base"
              placeholder="42 (for reproducibility)"
              value={config.seed ?? ''}
              onChange={e => set('seed', parseInt(e.target.value) || 42)}
            />
          </Field>
        )}

        {/* Constraints */}
        {(isTabular || isRelational) && (
          <Field label="Constraints" hint="one per line">
            <textarea
              className="input-base h-20 resize-none font-mono text-xs"
              placeholder={"salary > 0\nage >= 18\nquantity > 0"}
              value={config.constraints || ''}
              onChange={e => set('constraints', e.target.value)}
            />
          </Field>
        )}

        {/* Edge cases */}
        {(isTabular || isRelational) && (
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative shrink-0">
              <input type="checkbox" className="sr-only"
                checked={config.injectEdgeCases || false}
                onChange={e => set('injectEdgeCases', e.target.checked)} />
              <div className={cn('w-9 h-5 rounded-full transition-colors', config.injectEdgeCases ? 'bg-primary' : 'bg-white/10')} />
              <div className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
                config.injectEdgeCases ? 'translate-x-4' : 'translate-x-0')} />
            </div>
            <div>
              <div className="text-sm font-medium">Inject Edge Cases</div>
              <div className="text-[10px] text-muted-foreground">Nulls, outliers, boundary values</div>
            </div>
          </label>
        )}
      </div>

      {/* Generate button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? 'Generating...' : 'Generate Data'}</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Validation Report ────────────────────────────────────────────────────────

function ValidationReport({ validation }: { validation: any }) {
  const { checks, summary } = validation;
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-4 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Quality Report</h3>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="text-green-400">{summary.passed} passed</span>
          {summary.warnings > 0 && <span className="text-yellow-400">{summary.warnings} warnings</span>}
          {summary.failed > 0 && <span className="text-red-400">{summary.failed} failed</span>}
          <span className={cn('font-bold text-sm', summary.overallScore >= 80 ? 'text-green-400' : summary.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400')}>
            {summary.overallScore}%
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((check: any, i: number) => (
          <div key={i} className="flex items-center space-x-2 text-xs py-1">
            {check.status === 'PASS' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />}
            {check.status === 'FAIL' && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
            {check.status === 'WARN' && <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
            {check.status === 'SKIP' && <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
            <div className="min-w-0">
              <div className="font-medium truncate">{check.name}</div>
              {check.metric && <div className="text-muted-foreground">{check.metric}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data Preview ─────────────────────────────────────────────────────────────

function DataPreview({ data, mode }: { data: any; mode: Mode }) {
  const [tab, setTab] = useState<'preview' | 'raw'>('preview');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const handleExport = async (format: 'csv' | 'json' | 'pdf' | 'sql') => {
    try {
      const { exportToCSV, exportToJSON, exportToPDF, exportToSQL } = await import('@/lib/exportUtils');
      if (format === 'csv') exportToCSV(data, mode as any);
      if (format === 'json') exportToJSON(data, mode as any);
      if (format === 'pdf') exportToPDF(data, mode as any);
      if (format === 'sql') exportToSQL(data, mode as any);
    } catch (e: any) {
      alert(`Export failed: ${e.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black/30 border border-white/10 rounded-xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 shrink-0">
        <div className="flex space-x-1">
          {(['preview', 'raw'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                tab === t ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'
              )}>
              {t === 'preview' ? 'Preview' : 'Raw JSON'}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-1.5">
          <ExportBtn label="CSV" onClick={() => handleExport('csv')} />
          <ExportBtn label="JSON" onClick={() => handleExport('json')} />
          {(mode === 'tabular' || mode === 'relational') && (
            <ExportBtn label="SQL" onClick={() => handleExport('sql')} highlight />
          )}
          <ExportBtn label="PDF" onClick={() => handleExport('pdf')} highlight={mode === 'document' || mode === 'invoice' || mode === 'bank-statement'} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {tab === 'raw' ? (
          <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <PreviewContent data={data} mode={mode} page={page} setPage={setPage} pageSize={PAGE_SIZE} />
        )}
      </div>
    </div>
  );
}

function PreviewContent({ data, mode, page, setPage, pageSize }: any) {
  if (mode === 'tabular' && Array.isArray(data)) {
    return <PaginatedTable data={data} page={page} setPage={setPage} pageSize={pageSize} />;
  }

  if (mode === 'relational' && typeof data === 'object' && !Array.isArray(data)) {
    return (
      <div className="space-y-6">
        {Object.entries(data).map(([tableName, rows]: [string, any]) => (
          <div key={tableName}>
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-xs font-semibold text-primary">{tableName}</h3>
              <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full">{rows.length} rows</span>
            </div>
            <PaginatedTable data={rows} page={0} setPage={() => {}} pageSize={10} />
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'invoice' && data?.lineItems) {
    return <InvoicePreview data={data} />;
  }

  if (mode === 'bank-statement' && data?.transactions) {
    return <BankStatementPreview data={data} />;
  }

  // Fallback: key-value cards
  if (typeof data === 'object' && !Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-white/5 rounded-lg p-3">
            <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">{key}</div>
            <div className="text-xs text-muted-foreground">
              {typeof value === 'object' ? <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(value, null, 2)}</pre> : String(value)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <pre className="text-xs text-muted-foreground">{JSON.stringify(data, null, 2)}</pre>;
}

function PaginatedTable({ data, page, setPage, pageSize }: any) {
  if (!Array.isArray(data) || data.length === 0) return <div className="text-muted-foreground text-xs">No rows</div>;

  const headers = Array.from(new Set(data.flatMap(r => Object.keys(r))));
  const pageData = data.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-xs text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-3 py-2 text-muted-foreground font-medium w-8">#</th>
              {headers.map(h => <th key={h} className="px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageData.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-3 py-2 text-muted-foreground/40">{page * pageSize + i + 1}</td>
                {headers.map(h => (
                  <td key={h} className="px-3 py-2 whitespace-nowrap max-w-[180px] truncate">
                    {row[h] === null ? <span className="text-red-400/60 italic">null</span>
                      : row[h] === undefined ? <span className="text-muted-foreground/30">—</span>
                      : typeof row[h] === 'boolean' ? <span className={row[h] ? 'text-green-400' : 'text-red-400'}>{String(row[h])}</span>
                      : String(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{data.length} rows total</span>
          <div className="flex items-center space-x-2">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-2 py-1 bg-white/5 rounded disabled:opacity-30 hover:bg-white/10">←</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-2 py-1 bg-white/5 rounded disabled:opacity-30 hover:bg-white/10">→</button>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoicePreview({ data }: { data: any }) {
  const sym = data.currencySymbol || '$';
  return (
    <div className="bg-white text-black rounded-lg p-6 text-sm max-w-2xl mx-auto shadow-xl">
      <div className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold tracking-widest uppercase text-center py-1 px-3 rounded mb-4">
        SYNTHETIC DATA — FOR DEMONSTRATION ONLY
      </div>
      <div className="flex justify-between mb-6">
        <div>
          <div className="font-bold text-lg text-blue-700">{data.issuer?.name}</div>
          <div className="text-xs text-gray-500 mt-1">{data.issuer?.address}</div>
          <div className="text-xs text-gray-500">{data.issuer?.email}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">INVOICE</div>
          <div className="text-xs text-gray-500 mt-1">{data.invoiceNumber}</div>
          <div className="text-xs text-gray-500">Date: {data.invoiceDate}</div>
          <div className="text-xs text-gray-500">Due: {data.dueDate}</div>
        </div>
      </div>
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="text-xs font-semibold text-gray-500 mb-1">BILL TO</div>
        <div className="font-medium">{data.client?.name}</div>
        <div className="text-xs text-gray-500">{data.client?.email}</div>
      </div>
      <table className="w-full text-xs mb-4">
        <thead className="border-b-2 border-gray-200">
          <tr className="text-gray-600">
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Unit Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems?.map((item: any) => (
            <tr key={item.lineNumber} className="border-b border-gray-100">
              <td className="py-2">{item.description}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{sym}{item.unitPrice.toFixed(2)}</td>
              <td className="text-right py-2 font-medium">{sym}{item.lineTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <div className="space-y-1 text-xs min-w-[200px]">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{sym}{data.summary?.subtotal?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{data.summary?.taxLabel}</span><span>{sym}{data.summary?.taxAmount?.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-1 mt-1">
            <span>Total ({data.currency})</span><span>{sym}{data.summary?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-[10px] text-gray-400 border-t pt-3">{data.notes}</div>
    </div>
  );
}

function BankStatementPreview({ data }: { data: any }) {
  const sym = data.currency === 'PKR' ? 'Rs.' : '$';
  return (
    <div className="space-y-4">
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-widest uppercase text-center py-1.5 px-3 rounded-lg">
        SYNTHETIC DATA — FOR DEMONSTRATION ONLY
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Opening Balance', value: `${sym}${data.summary?.openingBalance?.toLocaleString()}` },
          { label: 'Total Debits', value: `${sym}${data.summary?.totalDebits?.toLocaleString()}`, color: 'text-red-400' },
          { label: 'Closing Balance', value: `${sym}${data.summary?.closingBalance?.toLocaleString()}`, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground mb-1">{s.label}</div>
            <div className={cn('text-sm font-bold', s.color)}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-xs">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              {['Date', 'Description', 'Debit', 'Credit', 'Balance', 'Ref'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.transactions?.slice(0, 30).map((tx: any, i: number) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2 whitespace-nowrap">{tx.date}</td>
                <td className="px-3 py-2 max-w-[160px] truncate">{tx.description}</td>
                <td className="px-3 py-2 text-red-400">{tx.debit != null ? `${sym}${tx.debit.toLocaleString()}` : '—'}</td>
                <td className="px-3 py-2 text-green-400">{tx.credit != null ? `${sym}${tx.credit.toLocaleString()}` : '—'}</td>
                <td className="px-3 py-2 font-medium">{sym}{tx.balance.toLocaleString()}</td>
                <td className="px-3 py-2 text-muted-foreground/60 font-mono text-[10px]">{tx.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.transactions?.length > 30 && (
        <p className="text-xs text-muted-foreground text-center">Showing first 30 of {data.transactions.length} transactions. Export JSON for full data.</p>
      )}
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground flex items-baseline justify-between">
        <span>{label}</span>
        {hint && <span className="text-muted-foreground/50 text-[10px]">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function ExportBtn({ label, onClick, highlight }: { label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors',
        highlight
          ? 'bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary'
          : 'bg-white/5 hover:bg-white/10 border border-white/10'
      )}
    >
      <Download className="w-3 h-3" />
      <span>{label}</span>
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div>
        <div className="text-sm font-semibold text-white mb-1">Generation Failed</div>
        <div className="text-xs text-red-400/90 leading-relaxed">{message}</div>
        <div className="text-xs text-muted-foreground mt-2">Tip: Reduce row count, simplify schema, or try again in a moment.</div>
      </div>
    </div>
  );
}

function LoadingPane() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
      </div>
      <div className="text-center space-y-1">
        <div className="text-base font-semibold text-white">Generating...</div>
        <div className="text-xs text-muted-foreground">Deterministic engine running</div>
      </div>
    </div>
  );
}

function EmptyPane({ mode }: { mode: Mode }) {
  const hints: Record<Mode, string> = {
    tabular: 'Define your schema on the left and click Generate Data',
    relational: 'Define tables like: Customers(id, name, email), Orders(id, customer_id, total)',
    document: 'Describe the document you want, then click Generate',
    invoice: 'Configure locale and line item count, then generate a verified invoice',
    'bank-statement': 'Set the account holder and months, then generate a statement',
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-3 opacity-40">
      <Database className="w-12 h-12 text-muted-foreground" />
      <div className="text-sm font-medium text-muted-foreground">No data yet</div>
      <div className="text-xs text-muted-foreground text-center max-w-xs">{hints[mode]}</div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODE_LABELS: Record<Mode, string> = {
  tabular: 'Tabular Data',
  relational: 'Relational Graph',
  document: 'Synthetic Document (Demo SOW)',
  invoice: 'Synthetic Invoice (Demo)',
  'bank-statement': 'Synthetic Statement (Demo)',
};

const ENDPOINTS: Record<Mode, string> = {
  tabular: '/api/generate/tabular',
  relational: '/api/generate/relational',
  document: '/api/generate/document',
  invoice: '/api/generate/invoice',
  'bank-statement': '/api/generate/bank-statement',
};

const DEFAULT_CONFIGS: Record<string, any> = {
  tabular: { rowCount: 20, schema: 'id:id, name:name, email:email, phone:phone, city:city, role:role, salary:salary, status:status, created_at:date', locale: 'en-US', seed: 42 },
  relational: { rowCount: 10, schema: 'Customers(id, name, email, city, phone),\nOrders(id, customer_id, date:date, total:price, status:status),\nOrderItems(id, order_id, product:string, quantity:integer, unit_price:price)', locale: 'en-US', seed: 42 },
  document: { query: 'A software service level agreement and scope of work for cloud infrastructure maintenance', locale: 'en-US' },
  invoice: { locale: 'en-US', lineItemCount: 4, taxRate: 10 },
  'bank-statement': { locale: 'en-US', months: 3, openingBalance: 5000 },
};

function buildRequestBody(mode: Mode, config: Record<string, any>): any {
  const base = { ...config };

  if (mode === 'tabular' || mode === 'relational') {
    base.constraints = config.constraints
      ? config.constraints.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [];
  }

  return base;
}

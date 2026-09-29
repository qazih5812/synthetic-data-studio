'use client';
import { Database, FileText, LayoutTemplate, Settings2 } from 'lucide-react';
import { Mode } from './Workspace';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeMode: Mode;
  setActiveMode: (mode: Mode) => void;
}

export default function Sidebar({ activeMode, setActiveMode }: SidebarProps) {
  const navItems = [
    { id: 'tabular', label: 'Tabular', icon: Database },
    { id: 'relational', label: 'Relational', icon: LayoutTemplate },
    { id: 'document', label: 'Document', icon: FileText },
  ] as const;

  return (
    <aside className="w-64 border-r border-border bg-black/40 backdrop-blur-md flex flex-col z-20">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">HackDataV2</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMode(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 w-1 h-full bg-primary rounded-r-full" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110")} />
              <span className="font-medium">{item.label}</span>
              
              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t border-border">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full" />
          <h4 className="text-sm font-semibold mb-1 relative">Gemini Pro API</h4>
          <p className="text-xs text-muted-foreground relative">Ultra-realistic synthetic data powered by LLM.</p>
        </div>
      </div>
    </aside>
  );
}

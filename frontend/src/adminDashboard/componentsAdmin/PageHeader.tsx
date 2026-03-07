import { Search, Settings } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
}

export function PageHeader({ title, subtitle, searchPlaceholder = "Search..." }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-9 pr-4 py-2 rounded-full bg-white/70 border border-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
          />
        </div>
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
        </div>
        <button className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

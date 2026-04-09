import { ThemeConfig } from "../types";

export const themePresets: Record<string, ThemeConfig> = {
  light: {
    "--bg": "#f8fafc",
    "--text": "#0f172a",
    "--card": "#ffffff",
    "--button": "#3b82f6",
    "--buttonText": "#ffffff",
    "--font": "Inter, sans-serif",
    "--radius": "12px"
  },
  dark: {
    "--bg": "#020617",
    "--text": "#e2e8f0",
    "--card": "#111827",
    "--button": "#38bdf8",
    "--buttonText": "#082f49",
    "--font": "Inter, sans-serif",
    "--radius": "12px"
  },
  colorful: {
    "--bg": "#fdf4ff",
    "--text": "#581c87",
    "--card": "#ffffff",
    "--button": "#ec4899",
    "--buttonText": "#ffffff",
    "--font": "Poppins, sans-serif",
    "--radius": "16px"
  }
};

export function ThemePicker({
  onPick
}: {
  onPick: (theme: ThemeConfig) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(themePresets).map(([name, theme]) => (
        <button
          key={name}
          className="rounded-2xl border border-slate-200 bg-white p-2 text-left text-sm font-medium capitalize text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
          onClick={() => onPick(theme)}
        >
          <span className="mb-1 block">{name}</span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full" style={{ background: theme["--bg"] }} />
            <span className="h-3 w-3 rounded-full" style={{ background: theme["--card"] }} />
            <span className="h-3 w-3 rounded-full" style={{ background: theme["--button"] }} />
          </span>
        </button>
      ))}
    </div>
  );
}

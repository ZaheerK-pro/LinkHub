type PageLoaderProps = {
  label?: string;
  fullScreen?: boolean;
};

export function PageLoader({ label = "Loading...", fullScreen = true }: PageLoaderProps) {
  return (
    <div className={`${fullScreen ? "min-h-screen" : "min-h-[220px]"} flex items-center justify-center px-4`}>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/85 px-6 py-5 shadow-sm backdrop-blur">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function AnalyticsChart({ data }: { data: Array<{ day: string; clicks: number }> }) {
  const total = data.reduce((sum, item) => sum + item.clicks, 0);
  const peak = data.reduce((max, item) => (item.clicks > max ? item.clicks : max), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-bold">Traffic Trend</h3>
          <p className="text-xs text-blue-100">Daily clicks performance</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-100">Total</p>
          <p className="text-xl font-black">{total}</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/20 bg-white/10 p-2 text-center">
          <p className="text-[10px] uppercase text-blue-100">Peak Day</p>
          <p className="text-sm font-semibold">{peak}</p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/10 p-2 text-center">
          <p className="text-[10px] uppercase text-blue-100">Records</p>
          <p className="text-sm font-semibold">{data.length}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.2)" vertical={false} />
          <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(15,23,42,0.95)",
              color: "#fff"
            }}
            labelStyle={{ color: "#93c5fd", fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="clicks" stroke="#93c5fd" fill="url(#clicksGradient)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { Link } from "react-router-dom";

const highlights = [
  "Create your personalized link page in minutes",
  "Track click performance across every link",
  "Customize styles with flexible themes",
  "Built for creators, teams, and modern brands"
];

const pillars = [
  {
    title: "Fast setup",
    description: "Claim your profile, add your links, and publish in under a minute."
  },
  {
    title: "Smart analytics",
    description: "Understand what your audience taps most with simple visual insights."
  },
  {
    title: "Brand control",
    description: "Match your color system, typography, and card/button style."
  }
];

const proofCards = [
  { label: "Average setup", value: "1 min" },
  { label: "Themes", value: "3+" },
  { label: "Link capacity", value: "Unlimited" },
  { label: "Multi-tenant", value: "Secure" }
];

export function LandingPage() {
  return (
    <main className="auth-shell text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <nav className="mb-10 flex items-center justify-between rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur md:mb-14 md:px-6">
          <div>
            <div className="text-xl font-black tracking-tight">LinkHub</div>
            <div className="text-xs text-slate-500">Modern link-in-bio for serious growth</div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
              Login
            </Link>
            <Link to="/signup" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <p className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Creator-first link platform
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl md:leading-[1.08]">
              Launch one page
              <br className="hidden md:block" /> that grows
              <br className="hidden md:block" /> every channel.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              LinkHub helps you centralize your audience journey with beautiful pages, flexible design controls, and
              actionable analytics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]"
              >
                Start for free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold hover:bg-slate-50"
              >
                Open dashboard
              </Link>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
              {proofCards.map((card) => (
                <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="text-base font-bold md:text-lg">{card.value}</div>
                  <div className="text-xs text-slate-500">{card.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur md:p-7">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-200/50 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl" />
            <h2 className="text-lg font-bold">Why teams switch to LinkHub</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2">
                  <span className="mt-1 text-indigo-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-xs uppercase tracking-wider text-slate-300">Simple flow</p>
              <p className="mt-2 rounded-lg bg-white/10 px-3 py-2 font-mono text-sm">add links &gt; customize &gt; share</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-white/10 p-2">Drag and reorder links</div>
                <div className="rounded-lg bg-white/10 p-2">Theme presets + custom styles</div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Platform pillars</p>
              <h3 className="mt-1 text-2xl font-black">Everything you need to convert attention</h3>
            </div>
            <p className="hidden max-w-sm text-right text-sm text-slate-500 md:block">
              Built for creators, freelancers, teams, and anyone who wants better link performance.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, idx) => (
              <article key={pillar.title} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {(idx + 1).toString().padStart(2, "0")}
                </p>
                <h4 className="mt-2 text-lg font-bold">{pillar.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Trusted workflow</p>
              <h3 className="mt-2 text-2xl font-black">Made for speed, style, and measurable growth</h3>
              <p className="mt-3 text-sm text-slate-600">
                LinkHub uses route-based multi-tenancy with secure isolation, so every workspace is private while still
                easy to manage at scale.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• JWT auth scoped by tenant</li>
                <li>• Drag-and-drop link ordering</li>
                <li>• Dynamic theme customization</li>
                <li>• Built-in analytics and trends</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-2xl font-black">99.9%</p>
                <p className="text-xs text-slate-300">Uptime-ready architecture</p>
              </div>
              <div className="rounded-2xl bg-indigo-600 p-4 text-white">
                <p className="text-2xl font-black">1 min</p>
                <p className="text-xs text-indigo-100">Average setup time</p>
              </div>
              <div className="rounded-2xl bg-blue-600 p-4 text-white">
                <p className="text-2xl font-black">Real-time</p>
                <p className="text-xs text-blue-100">Click activity updates</p>
              </div>
              <div className="rounded-2xl bg-emerald-600 p-4 text-white">
                <p className="text-2xl font-black">∞</p>
                <p className="text-xs text-emerald-100">Links you can manage</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-2xl">
          <div className="grid items-center gap-4 md:grid-cols-[1.4fr,1fr]">
            <div>
              <h3 className="text-2xl font-black md:text-3xl">Ready to relaunch your link presence?</h3>
              <p className="mt-2 max-w-xl text-sm text-indigo-100">
                Build your page, customize your look, and track your growth from one dashboard.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
              <Link to="/signup" className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">
                Create account
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

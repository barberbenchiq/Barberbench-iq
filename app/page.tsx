"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type WeekData = {
  revenue: number;
  clients: number;
  hours: number;
  rebooked: number;
  retail: number;
};

const defaultWeek: WeekData = {
  revenue: 3850,
  clients: 68,
  hours: 37.5,
  rebooked: 46,
  retail: 310,
};

const money = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
  maximumFractionDigits: 0,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");
  const [editing, setEditing] = useState(false);
  const [week, setWeek] = useState<WeekData>(defaultWeek);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedData = window.localStorage.getItem("barberbench-week");
    if (savedData) {
      try {
        setWeek(JSON.parse(savedData));
      } catch {
        window.localStorage.removeItem("barberbench-week");
      }
    }
  }, []);

  const metrics = useMemo(() => {
    const avgTicket = week.clients ? week.revenue / week.clients : 0;
    const hourly = week.hours ? week.revenue / week.hours : 0;
    const rebookRate = week.clients ? (week.rebooked / week.clients) * 100 : 0;
    const retailRate = week.revenue ? (week.retail / week.revenue) * 100 : 0;
    const score = Math.round(
      clamp(hourly / 1.45, 0, 35) +
        clamp(avgTicket / 2.1, 0, 30) +
        clamp(rebookRate / 2.5, 0, 25) +
        clamp(retailRate, 0, 10)
    );
    return { avgTicket, hourly, rebookRate, retailRate, score: clamp(score, 0, 100) };
  }, [week]);

  function updateField(field: keyof WeekData, value: string) {
    setWeek((current) => ({ ...current, [field]: Math.max(0, Number(value) || 0) }));
  }

  function saveWeek(event: FormEvent) {
    event.preventDefault();
    window.localStorage.setItem("barberbench-week", JSON.stringify(week));
    setSaved(true);
    setEditing(false);
    window.setTimeout(() => setSaved(false), 2200);
  }

  if (view === "landing") {
    return (
      <main className="landing">
        <nav className="nav shell">
          <button className="brand" onClick={() => setView("landing")} aria-label="BarberBench IQ home">
            <span className="brandMark">B</span>
            <span>BARBERBENCH <b>IQ</b></span>
          </button>
          <div className="navLinks">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <button className="button ghost" onClick={() => setView("dashboard")}>Open demo</button>
          </div>
        </nav>

        <section className="hero shell">
          <div className="heroCopy">
            <div className="eyebrow"><span /> Business intelligence built for barbers</div>
            <h1>Know your numbers.<br /><em>Grow your business.</em></h1>
            <p>Turn your weekly figures into clear actions that improve pricing, productivity, client retention and profit.</p>
            <div className="heroActions">
              <button className="button primary" onClick={() => setView("dashboard")}>Try the live dashboard <span>→</span></button>
              <span className="microcopy">No signup required for the demo</span>
            </div>
            <div className="trustRow">
              <div><b>5 min</b><span>weekly check-in</span></div>
              <div><b>4 KPIs</b><span>that matter most</span></div>
              <div><b>1 plan</b><span>for your next week</span></div>
            </div>
          </div>

          <div className="heroVisual" aria-label="Dashboard preview">
            <div className="glow" />
            <div className="previewWindow">
              <div className="windowTop"><span /><span /><span /><small>Weekly performance</small></div>
              <div className="previewHeader"><div><small>BUSINESS SCORE</small><strong>82</strong><span>/ 100</span></div><div className="scoreRing">82</div></div>
              <div className="miniGrid">
                <div><span>Revenue</span><b>$3,850</b><small className="up">↑ 8.4%</small></div>
                <div><span>Hourly rate</span><b>$103</b><small className="up">↑ $7</small></div>
                <div><span>Avg. ticket</span><b>$57</b><small>Target $60</small></div>
                <div><span>Rebooking</span><b>68%</b><small className="up">Strong</small></div>
              </div>
              <div className="coachCard"><span className="spark">✦</span><div><b>Your next best move</b><p>Adding $3 to your average ticket could create an extra $10,608 in annual revenue.</p></div></div>
            </div>
          </div>
        </section>

        <section id="features" className="features shell">
          <div className="sectionIntro"><span>WHAT YOU GET</span><h2>A business coach in your pocket.</h2><p>BarberBench IQ focuses on the numbers you can actually influence each week.</p></div>
          <div className="featureGrid">
            <article><div className="icon">↗</div><h3>Performance score</h3><p>See the health of your barber business at a glance, without spreadsheets or accounting jargon.</p></article>
            <article><div className="icon">◎</div><h3>Clear benchmarks</h3><p>Compare your results against practical targets for revenue, hourly rate, ticket value and retention.</p></article>
            <article><div className="icon">✦</div><h3>Actionable coaching</h3><p>Get one focused recommendation that shows exactly where your biggest growth opportunity sits.</p></article>
          </div>
        </section>

        <section id="how" className="cta shell">
          <div><span className="eyebrow"><span /> BUILT FOR THE BARBER INDUSTRY</span><h2>Your talent fills the chair.<br />Your numbers build the future.</h2></div>
          <button className="button light" onClick={() => setView("dashboard")}>Explore the demo →</button>
        </section>

        <footer className="footer shell"><div className="brand"><span className="brandMark">B</span><span>BARBERBENCH <b>IQ</b></span></div><p>© 2026 BarberBench IQ™ · New Zealand</p></footer>
      </main>
    );
  }

  return (
    <main className="appShell">
      <aside className="sidebar">
        <button className="brand sideBrand" onClick={() => setView("landing")}><span className="brandMark">B</span><span>BARBERBENCH <b>IQ</b></span></button>
        <nav className="sideNav">
          <button className="active"><span>⌂</span> Overview</button>
          <button><span>▥</span> Weekly numbers</button>
          <button><span>↗</span> Insights</button>
          <button><span>◎</span> Goals</button>
        </nav>
        <div className="sideBottom"><button><span>⚙</span> Settings</button><div className="profile"><span>BL</span><div><b>Benji</b><small>Founder beta</small></div></div></div>
      </aside>

      <section className="dashboard">
        <header className="dashHeader"><div><small>WEEKLY OVERVIEW</small><h1>Good evening, Benji.</h1><p>Here is how your business is tracking this week.</p></div><div className="headerActions"><button className="button ghost dark" onClick={() => setView("landing")}>View website</button><button className="button primary" onClick={() => setEditing(true)}>+ Update numbers</button></div></header>

        {saved && <div className="toast">✓ Weekly numbers saved</div>}

        <div className="scoreBanner">
          <div className="scoreMain"><div className="largeRing" style={{"--score": `${metrics.score * 3.6}deg`} as React.CSSProperties}><div><strong>{metrics.score}</strong><span>/100</span></div></div><div><span className="label">BUSINESS HEALTH SCORE</span><h2>{metrics.score >= 80 ? "Strong performance" : metrics.score >= 65 ? "Building momentum" : "Room to grow"}</h2><p>Your fundamentals are healthy. Focus on average ticket value to unlock your next level of growth.</p></div></div>
          <div className="scoreTrend"><span>VS LAST WEEK</span><b>↑ 6 points</b><small>Keep the momentum going</small></div>
        </div>

        <div className="metricGrid">
          <Metric title="Weekly revenue" value={money.format(week.revenue)} note="8.4% vs last week" trend="up" progress={77} />
          <Metric title="Revenue per hour" value={money.format(metrics.hourly)} note="$110 weekly target" trend="neutral" progress={Math.min(100, metrics.hourly / 1.1)} />
          <Metric title="Average ticket" value={money.format(metrics.avgTicket)} note="$60 weekly target" trend="neutral" progress={Math.min(100, metrics.avgTicket / 0.6)} />
          <Metric title="Rebooking rate" value={`${metrics.rebookRate.toFixed(0)}%`} note="Above 65% benchmark" trend="up" progress={metrics.rebookRate} />
        </div>

        <div className="dashboardGrid">
          <section className="panel coaching">
            <div className="panelTitle"><div><span className="spark">✦</span><span><small>BARBERBENCH COACH</small><h3>Your biggest opportunity</h3></span></div><span className="badge">HIGH IMPACT</span></div>
            <div className="opportunity"><div><span>01</span></div><div><h4>Lift your average ticket by $3</h4><p>You are seeing enough clients, but each visit is landing slightly below your $60 target. A small service upgrade or retail conversation can close the gap.</p><div className="impact"><span>Potential annual impact</span><strong>{money.format(week.clients * 52 * 3)}</strong></div></div></div>
            <div className="actionList"><div><b>THIS WEEK'S ACTION</b><p>Offer a beard tidy or premium finish to 10 suitable clients and track the result.</p></div><button>Mark as complete</button></div>
          </section>

          <section className="panel mixPanel">
            <div className="panelHeading"><div><small>REVENUE MIX</small><h3>Where your money comes from</h3></div><span>Weekly</span></div>
            <div className="donutWrap"><div className="donut"><div><b>{money.format(week.revenue + week.retail)}</b><span>Total sales</span></div></div><div className="legend"><div><i className="service"/><span>Services</span><b>{money.format(week.revenue)}</b></div><div><i className="retail"/><span>Retail</span><b>{money.format(week.retail)}</b></div></div></div>
            <div className="retailTip"><span>i</span><p>Retail contributes <b>{metrics.retailRate.toFixed(1)}%</b> of service revenue. A healthy target is 10–15%.</p></div>
          </section>
        </div>

        <section className="panel activityPanel"><div className="panelHeading"><div><small>LAST 6 WEEKS</small><h3>Revenue trend</h3></div><b className="up">↑ 12.6% overall</b></div><div className="chart" aria-label="Six week revenue chart"><div style={{height:"48%"}}><span>$3.1k</span></div><div style={{height:"57%"}}><span>$3.3k</span></div><div style={{height:"51%"}}><span>$3.2k</span></div><div style={{height:"69%"}}><span>$3.5k</span></div><div style={{height:"76%"}}><span>$3.6k</span></div><div className="current" style={{height:"91%"}}><span>{money.format(week.revenue)}</span></div></div><div className="chartLabels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>This week</span></div></section>
      </section>

      {editing && (
        <div className="modalBackdrop" onMouseDown={() => setEditing(false)}>
          <form className="modal" onSubmit={saveWeek} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modalHeader"><div><small>WEEKLY CHECK-IN</small><h2>Update your numbers</h2><p>Enter totals from your booking or point-of-sale system.</p></div><button type="button" onClick={() => setEditing(false)}>×</button></div>
            <div className="formGrid">
              <label><span>Service revenue ($)</span><input type="number" min="0" value={week.revenue} onChange={(e) => updateField("revenue", e.target.value)} /></label>
              <label><span>Clients served</span><input type="number" min="0" value={week.clients} onChange={(e) => updateField("clients", e.target.value)} /></label>
              <label><span>Hours worked</span><input type="number" min="0" step="0.5" value={week.hours} onChange={(e) => updateField("hours", e.target.value)} /></label>
              <label><span>Clients rebooked</span><input type="number" min="0" value={week.rebooked} onChange={(e) => updateField("rebooked", e.target.value)} /></label>
              <label className="full"><span>Retail sales ($)</span><input type="number" min="0" value={week.retail} onChange={(e) => updateField("retail", e.target.value)} /></label>
            </div>
            <div className="modalActions"><button type="button" className="button ghost dark" onClick={() => setEditing(false)}>Cancel</button><button className="button primary" type="submit">Save weekly numbers</button></div>
          </form>
        </div>
      )}
    </main>
  );
}

function Metric({ title, value, note, trend, progress }: { title: string; value: string; note: string; trend: "up" | "neutral"; progress: number }) {
  return <article className="metric"><div className="metricTop"><span>{title}</span><i>↗</i></div><strong>{value}</strong><div className={`metricNote ${trend}`}>{trend === "up" ? "↑" : "→"} {note}</div><div className="progress"><span style={{width: `${clamp(progress, 4, 100)}%`}} /></div></article>;
}

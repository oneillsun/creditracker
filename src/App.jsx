import { useState, useEffect, useRef } from "react";

const INITIAL_CARDS = [
  {
    id: 1,
    name: "Credit One",
    balance: 531,
    limit: 1050,
    last4: "5181",
    color: "#E24B4A",
    bg: "#FCEBEB",
    owner: "antonio",
  },
  {
    id: 2,
    name: "Discover",
    balance: 148.32,
    limit: 200,
    last4: "2237",
    color: "#EF9F27",
    bg: "#FAEEDA",
    owner: "antonio",
  },
  {
    id: 3,
    name: "US Bank",
    balance: 863.36,
    limit: 1000,
    last4: "4568",
    color: "#378ADD",
    bg: "#E6F1FB",
    owner: "antonio",
  },
  {
    id: 4,
    name: "Capital One",
    balance: 122.51,
    limit: 300,
    last4: "3788",
    color: "#1D9E75",
    bg: "#E1F5EE",
    owner: "antonio",
  },
  {
    id: 5,
    name: "Capital One",
    balance: 461.82,
    limit: 1000,
    last4: "6564",
    color: "#9B59B6",
    bg: "#F5EEF8",
    owner: "wife",
  },
  {
    id: 6,
    name: "Credit One",
    balance: 936,
    limit: 2000,
    last4: "",
    color: "#5DADE2",
    bg: "#EBF5FB",
    owner: "wife",
  },
];

const STORAGE_KEY = "creditTracker.v1";

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function monthKeyOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabelOf(date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const MILESTONES = [
  {
    month: 1,
    label: "Jul 2026",
    score: 645,
    util: 37,
    action:
      "Put $1,000 toward US Bank — pays it off completely (86% → 0%) — with the ~$137 left over knocking down Discover next",
    done: false,
  },
  {
    month: 2,
    label: "Aug 2026",
    score: 662,
    util: 19,
    action:
      "$1,000 clears the rest of Discover and pays off Credit One (Antonio) in full, with what's left starting to chip into Credit One (Damarys)",
    done: false,
  },
  {
    month: 3,
    label: "Sep 2026",
    score: 680,
    util: 1,
    action:
      "$1,000 finishes off Credit One (Damarys) and Capital One (Damarys), leaving only ~$63 across all 6 cards combined",
    done: false,
  },
  {
    month: 4,
    label: "Oct 2026",
    score: 688,
    util: 0,
    action:
      "Final ~$63 paid off — completely debt-free across all 6 cards. Request CLIs on every card now, while utilization is 0% — the best possible time to ask",
    done: false,
  },
  {
    month: 5,
    label: "Nov 2026",
    score: 695,
    util: 0,
    action:
      "Apply for 1 new card each (Antonio + Damarys) now that scores are 690+. Keep balances near $0 while the CLIs process",
    done: false,
  },
  {
    month: 6,
    label: "Dec 2026",
    score: 700,
    util: 0,
    action:
      "Final CLIs/new card to close the gap to $15,000 total credit. Keep balances near $0, zero missed payments. Reassess for Vidants business credit",
    done: false,
  },
];

function getUtilColor(pct) {
  if (pct <= 10) return "#1D9E75";
  if (pct <= 30) return "#EF9F27";
  return "#E24B4A";
}

function getScoreColor(score) {
  if (score >= 700) return "#1D9E75";
  if (score >= 660) return "#EF9F27";
  return "#E24B4A";
}

function TrendBars({ title, points, format }) {
  const values = points.map((p) => p.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E7ECF3",
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#F4600C",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}
      >
        {points.map((pt, i) => {
          const h = Math.round(((pt.y - min) / range) * 60) + 10;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: pt.color || "#64748B",
                  fontWeight: 700,
                }}
              >
                {format(pt.y)}
              </div>
              <div
                style={{
                  width: "100%",
                  height: h,
                  background: pt.color || "#F4600C",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s",
                }}
              />
              <div
                style={{ fontSize: 9, color: "#64748B", textAlign: "center" }}
              >
                {pt.x}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreTrendChart({ history }) {
  const values = history.flatMap((h) => [h.score, h.wifeScore]);
  const min = Math.min(...values, 500);
  const max = Math.max(...values, 850);
  const range = max - min || 1;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E7ECF3",
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#F4600C",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Credit score over time
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 11, color: "#F4600C" }}>● Antonio</span>
        <span style={{ fontSize: 11, color: "#9B59B6" }}>● Damarys</span>
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 90 }}
      >
        {history.map((h) => {
          const hA = Math.round(((h.score - min) / range) * 65) + 8;
          const hD = Math.round(((h.wifeScore - min) / range) * 65) + 8;
          return (
            <div
              key={h.monthKey}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 65,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 9, color: "#F4600C", fontWeight: 700 }}
                  >
                    {h.score}
                  </div>
                  <div
                    style={{
                      width: 12,
                      height: hA,
                      background: "#F4600C",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 9, color: "#9B59B6", fontWeight: 700 }}
                  >
                    {h.wifeScore}
                  </div>
                  <div
                    style={{
                      width: 12,
                      height: hD,
                      background: "#9B59B6",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: 9, color: "#64748B" }}>{h.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CreditTracker() {
  const [cards, setCards] = useState(() => loadSaved()?.cards ?? INITIAL_CARDS);
  const [score, setScore] = useState(() => loadSaved()?.score ?? 625);
  const [wifeScore, setWifeScore] = useState(
    () => loadSaved()?.wifeScore ?? 620,
  );
  const [milestones, setMilestones] = useState(
    () => loadSaved()?.milestones ?? MILESTONES,
  );
  const [history, setHistory] = useState(() => loadSaved()?.history ?? []);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState({
    balance: "",
    limit: "",
    last4: "",
  });
  const [tab, setTab] = useState("dashboard");
  const [cardFilter, setCardFilter] = useState("all");

  const remoteSaveTimeout = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/data")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setCards(data.cards ?? INITIAL_CARDS);
        setScore(data.score ?? 625);
        setWifeScore(data.wifeScore ?? 620);
        setMilestones(data.milestones ?? MILESTONES);
        setHistory(data.history ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const data = { cards, score, wifeScore, milestones, history };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    clearTimeout(remoteSaveTimeout.current);
    remoteSaveTimeout.current = setTimeout(() => {
      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
    }, 800);

    return () => clearTimeout(remoteSaveTimeout.current);
  }, [cards, score, wifeScore, milestones, history]);

  const myCards = cards.filter((c) => c.owner === "antonio");
  const wifeCards = cards.filter((c) => c.owner === "wife");
  const filteredCards =
    cardFilter === "all" ? cards : cards.filter((c) => c.owner === cardFilter);

  const totalBalance = cards.reduce((s, c) => s + c.balance, 0);
  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
  const totalUtil =
    totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;
  const totalLimitK = (totalLimit / 1000).toFixed(1);

  const myBalance = myCards.reduce((s, c) => s + c.balance, 0);
  const myLimit = myCards.reduce((s, c) => s + c.limit, 0);
  const myUtil = myLimit > 0 ? Math.round((myBalance / myLimit) * 100) : 0;

  const wifeBalance = wifeCards.reduce((s, c) => s + c.balance, 0);
  const wifeLimit = wifeCards.reduce((s, c) => s + c.limit, 0);
  const wifeUtil =
    wifeLimit > 0 ? Math.round((wifeBalance / wifeLimit) * 100) : 0;

  function startEdit(card) {
    setEditing(card.id);
    setEditVal({
      balance: card.balance,
      limit: card.limit,
      last4: card.last4,
    });
  }

  function saveEdit(id) {
    setCards(
      cards.map((c) =>
        c.id === id
          ? {
              ...c,
              balance: Math.max(0, Number(editVal.balance)),
              limit: Math.max(1, Number(editVal.limit)),
              last4: String(editVal.last4 || "")
                .replace(/\D/g, "")
                .slice(0, 4),
            }
          : c,
      ),
    );
    setEditing(null);
  }

  function toggleMilestone(i) {
    setMilestones(
      milestones.map((m, idx) => (idx === i ? { ...m, done: !m.done } : m)),
    );
  }

  function saveSnapshot() {
    const now = new Date();
    const monthKey = monthKeyOf(now);
    const label = monthLabelOf(now);
    const snapshot = {
      id: monthKey,
      monthKey,
      label,
      savedAt: now.toISOString(),
      score,
      wifeScore,
      totalBalance,
      totalLimit,
      totalUtil,
      myUtil,
      wifeUtil,
    };
    setHistory((prev) => {
      const idx = prev.findIndex((h) => h.monthKey === monthKey);
      const next =
        idx >= 0
          ? prev.map((h, i) => (i === idx ? snapshot : h))
          : [...prev, snapshot];
      return next.sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    });
  }

  function deleteSnapshot(monthKey) {
    setHistory((prev) => prev.filter((h) => h.monthKey !== monthKey));
  }

  function resetAllData() {
    if (
      !window.confirm(
        "Reset all data? This clears cards, scores, milestones, and history.",
      )
    )
      return;
    localStorage.removeItem(STORAGE_KEY);
    setCards(INITIAL_CARDS);
    setScore(625);
    setWifeScore(620);
    setMilestones(MILESTONES);
    setHistory([]);
  }

  function resetMilestones() {
    if (
      !window.confirm(
        "Reset milestones to the default plan? This won't touch your cards, scores, or history.",
      )
    )
      return;
    setMilestones(MILESTONES);
  }

  const completedMilestones = milestones.filter((m) => m.done).length;
  const progressPct = Math.round(
    (completedMilestones / milestones.length) * 100,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6FB",
        fontFamily: "'Barlow', 'Segoe UI', sans-serif",
        color: "#16233A",
        padding: "0 0 40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #EEF2F8 100%)",
          borderBottom: "1px solid rgba(244,96,12,0.2)",
          padding: "24px 28px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "#F4600C",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Family Credit Tracker
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#16233A",
              }}
            >
              Bello Family
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
              Goal: $15,000 total credit · 700+ score · 6 months
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                background: "rgba(244,96,12,0.12)",
                border: "1px solid rgba(244,96,12,0.3)",
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#F4600C",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                ANTONIO
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: getScoreColor(score),
                  lineHeight: 1.1,
                }}
              >
                {score}
              </div>
              <input
                type="range"
                min={500}
                max={850}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                style={{ width: 70, marginTop: 4, accentColor: "#F4600C" }}
              />
            </div>
            <div
              style={{
                background: "rgba(155,89,182,0.12)",
                border: "1px solid rgba(155,89,182,0.3)",
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#9B59B6",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                DAMARYS
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: getScoreColor(wifeScore),
                  lineHeight: 1.1,
                }}
              >
                {wifeScore}
              </div>
              <input
                type="range"
                min={500}
                max={850}
                value={wifeScore}
                onChange={(e) => setWifeScore(Number(e.target.value))}
                style={{ width: 70, marginTop: 4, accentColor: "#9B59B6" }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {["dashboard", "cards", "milestones", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 18px",
                background: tab === t ? "#F4600C" : "transparent",
                color: tab === t ? "#fff" : "#64748B",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
                transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div>
            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                {
                  label: "Combined Balance",
                  value: `$${totalBalance.toLocaleString()}`,
                  sub: `of $${totalLimit.toLocaleString()}`,
                },
                {
                  label: "Combined Utilization",
                  value: `${totalUtil}%`,
                  sub:
                    totalUtil <= 10
                      ? "Excellent"
                      : totalUtil <= 30
                        ? "Good"
                        : "High — reduce ASAP",
                  valColor: getUtilColor(totalUtil),
                },
                {
                  label: "Total Credit",
                  value: `$${totalLimitK}K`,
                  sub: "Target: $15K",
                  valColor: totalLimit >= 15000 ? "#1D9E75" : "#16233A",
                },
                {
                  label: "Plan Progress",
                  value: `${progressPct}%`,
                  sub: `${completedMilestones} of 6 milestones`,
                  valColor: progressPct > 50 ? "#1D9E75" : "#EF9F27",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EEF1F6",
                    borderRadius: 12,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748B",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: s.valColor || "#16233A",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Per-person split */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[
                {
                  label: "Antonio",
                  balance: myBalance,
                  limit: myLimit,
                  util: myUtil,
                  accent: "#F4600C",
                  cards: myCards.length,
                },
                {
                  label: "Damarys",
                  balance: wifeBalance,
                  limit: wifeLimit,
                  util: wifeUtil,
                  accent: "#9B59B6",
                  cards: wifeCards.length,
                },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid #E7ECF3`,
                    borderLeft: `3px solid ${p.accent}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: p.accent,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {p.label} · {p.cards} cards
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: "#64748B" }}>Balance</span>
                    <span style={{ color: "#16233A", fontWeight: 600 }}>
                      ${p.balance.toLocaleString()} / $
                      {p.limit.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#EDF1F7",
                      borderRadius: 99,
                      overflow: "hidden",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(p.util, 100)}%`,
                        background: getUtilColor(p.util),
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: getUtilColor(p.util),
                      fontWeight: 700,
                    }}
                  >
                    {p.util}% utilization
                  </div>
                </div>
              ))}
            </div>

            {/* Utilization bars */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7ECF3",
                borderRadius: 12,
                padding: "18px 20px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#F4600C",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Utilization by card
              </div>
              {cards.map((card) => {
                const pct =
                  card.limit > 0
                    ? Math.round((card.balance / card.limit) * 100)
                    : 0;
                const ownerColor =
                  card.owner === "antonio" ? "#F4600C" : "#9B59B6";
                const ownerLabel =
                  card.owner === "antonio" ? "Antonio" : "Damarys";
                return (
                  <div key={card.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ color: "#475569", fontWeight: 500 }}>
                          {card.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            background: `rgba(${card.owner === "antonio" ? "244,96,12" : "155,89,182"},0.15)`,
                            color: ownerColor,
                            padding: "1px 7px",
                            borderRadius: 99,
                            fontWeight: 600,
                          }}
                        >
                          {ownerLabel}
                        </span>
                        {card.last4 && (
                          <span style={{ fontSize: 11, color: "#64748B" }}>
                            •••• {card.last4}
                          </span>
                        )}
                      </div>
                      <span style={{ color: "#64748B" }}>
                        <span
                          style={{ color: getUtilColor(pct), fontWeight: 700 }}
                        >
                          {pct}%
                        </span>{" "}
                        · ${card.balance.toLocaleString()} / $
                        {card.limit.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#EDF1F7",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(pct, 100)}%`,
                          background: getUtilColor(pct),
                          borderRadius: 99,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score journey */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7ECF3",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#F4600C",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Score journey to 700+
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  height: 80,
                }}
              >
                {[
                  { s: score, l: "Now" },
                  ...MILESTONES.map((m) => ({
                    s: m.score,
                    l: m.label.split(" ")[0],
                  })),
                ].map((pt, i) => {
                  const h = Math.round(((pt.s - 500) / 350) * 70);
                  const isNow = i === 0;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: isNow ? "#F4600C" : "#64748B",
                          fontWeight: isNow ? 700 : 400,
                        }}
                      >
                        {pt.s}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: h,
                          background: isNow
                            ? "#F4600C"
                            : i <= completedMilestones
                              ? "#1D9E75"
                              : "#E7ECF3",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s",
                        }}
                      />
                      <div
                        style={{
                          fontSize: 9,
                          color: "#64748B",
                          textAlign: "center",
                        }}
                      >
                        {pt.l}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CARDS TAB */}
        {tab === "cards" && (
          <div>
            {/* Filter buttons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                ["all", "All Cards"],
                ["antonio", "Antonio"],
                ["wife", "Damarys"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setCardFilter(val)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    background:
                      cardFilter === val
                        ? val === "wife"
                          ? "#9B59B6"
                          : val === "antonio"
                            ? "#F4600C"
                            : "#F4600C"
                        : "#EEF1F6",
                    color: cardFilter === val ? "#fff" : "#64748B",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {filteredCards.map((card) => {
                const pct =
                  card.limit > 0
                    ? Math.round((card.balance / card.limit) * 100)
                    : 0;
                const isEditing = editing === card.id;
                return (
                  <div
                    key={card.id}
                    style={{
                      background: isEditing ? "#FFFFFF" : card.bg,
                      border: `2px solid ${isEditing ? card.color : "transparent"}`,
                      borderRadius: 14,
                      padding: "18px 18px 14px",
                      boxShadow: "0 1px 3px rgba(16,24,40,0.06)",
                      transition: "border 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#16233A",
                            }}
                          >
                            {card.name}
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 99,
                              background:
                                card.owner === "antonio"
                                  ? "rgba(244,96,12,0.15)"
                                  : "rgba(155,89,182,0.15)",
                              color:
                                card.owner === "antonio"
                                  ? "#F4600C"
                                  : "#9B59B6",
                            }}
                          >
                            {card.owner === "antonio" ? "Antonio" : "Damarys"}
                          </span>
                        </div>
                        {card.last4 && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#64748B",
                              marginTop: 3,
                              letterSpacing: "0.04em",
                            }}
                          >
                            •••• {card.last4}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.65)",
                          color: card.color,
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 99,
                          border: "1px solid rgba(16,24,40,0.06)",
                        }}
                      >
                        {pct}%
                      </div>
                    </div>

                    {isEditing ? (
                      <div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#64748B",
                                marginBottom: 4,
                              }}
                            >
                              Balance ($)
                            </div>
                            <input
                              type="number"
                              value={editVal.balance}
                              onChange={(e) =>
                                setEditVal({
                                  ...editVal,
                                  balance: e.target.value,
                                })
                              }
                              style={{
                                width: "100%",
                                background: "#EDF1F7",
                                border: "1px solid #D8DEE9",
                                borderRadius: 8,
                                color: "#16233A",
                                padding: "6px 10px",
                                fontSize: 14,
                                outline: "none",
                              }}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#64748B",
                                marginBottom: 4,
                              }}
                            >
                              Limit ($)
                            </div>
                            <input
                              type="number"
                              value={editVal.limit}
                              onChange={(e) =>
                                setEditVal({
                                  ...editVal,
                                  limit: e.target.value,
                                })
                              }
                              style={{
                                width: "100%",
                                background: "#EDF1F7",
                                border: "1px solid #D8DEE9",
                                borderRadius: 8,
                                color: "#16233A",
                                padding: "6px 10px",
                                fontSize: 14,
                                outline: "none",
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#64748B",
                              marginBottom: 4,
                            }}
                          >
                            Last 4 Digits
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={editVal.last4}
                            onChange={(e) =>
                              setEditVal({
                                ...editVal,
                                last4: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4),
                              })
                            }
                            style={{
                              width: "100%",
                              background: "#EDF1F7",
                              border: "1px solid #D8DEE9",
                              borderRadius: 8,
                              color: "#16233A",
                              padding: "6px 10px",
                              fontSize: 14,
                              outline: "none",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => saveEdit(card.id)}
                            style={{
                              flex: 1,
                              background: "#F4600C",
                              border: "none",
                              borderRadius: 8,
                              color: "#fff",
                              padding: "7px",
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            style={{
                              flex: 1,
                              background: "#EEF1F6",
                              border: "none",
                              borderRadius: 8,
                              color: "#64748B",
                              padding: "7px",
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                              marginBottom: 6,
                              color: "#64748B",
                            }}
                          >
                            <span>Balance</span>
                            <span style={{ color: "#16233A", fontWeight: 600 }}>
                              ${card.balance.toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                              marginBottom: 10,
                              color: "#64748B",
                            }}
                          >
                            <span>Limit</span>
                            <span style={{ color: "#16233A", fontWeight: 600 }}>
                              ${card.limit.toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 6,
                              background: "rgba(15,23,42,0.08)",
                              borderRadius: 99,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.min(pct, 100)}%`,
                                background: getUtilColor(pct),
                                borderRadius: 99,
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 12,
                              color:
                                pct <= 10
                                  ? "#1D9E75"
                                  : pct <= 30
                                    ? "#EF9F27"
                                    : "#E24B4A",
                              fontWeight: 600,
                            }}
                          >
                            {pct <= 10
                              ? "✓ Excellent"
                              : pct <= 30
                                ? "↓ Reduce more"
                                : "⚠ High — priority"}
                          </div>
                          <button
                            onClick={() => startEdit(card)}
                            style={{
                              background: "rgba(255,255,255,0.65)",
                              border: `1px solid ${card.color}55`,
                              borderRadius: 8,
                              color: card.color,
                              padding: "5px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add card hint */}
              <div
                style={{
                  background: "rgba(244,96,12,0.05)",
                  border: "1px dashed rgba(244,96,12,0.2)",
                  borderRadius: 14,
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 160,
                }}
              >
                <div style={{ fontSize: 28, color: "rgba(244,96,12,0.4)" }}>
                  +
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748B",
                    textAlign: "center",
                  }}
                >
                  New card in Month 5<br />
                  after score hits 690+
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {tab === "milestones" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 12,
              }}
            >
              <button
                onClick={resetMilestones}
                style={{
                  background: "#EEF1F6",
                  border: "1px solid #D8DEE9",
                  borderRadius: 8,
                  color: "#64748B",
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset to default plan
              </button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#64748B",
                  marginBottom: 8,
                }}
              >
                <span>Overall progress</span>
                <span style={{ fontWeight: 700, color: "#F4600C" }}>
                  {progressPct}%
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#EDF1F7",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "#F4600C",
                    borderRadius: 99,
                    transition: "width 0.4s",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {milestones.map((m, i) => (
                <div
                  key={i}
                  onClick={() => toggleMilestone(i)}
                  style={{
                    background: m.done ? "rgba(29,158,117,0.08)" : "#FFFFFF",
                    border: `1px solid ${m.done ? "rgba(29,158,117,0.3)" : "#E7ECF3"}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 99,
                      border: `2px solid ${m.done ? "#1D9E75" : "#D8DEE9"}`,
                      background: m.done ? "#1D9E75" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                      fontSize: 12,
                      color: "#fff",
                      fontWeight: 700,
                      transition: "all 0.2s",
                    }}
                  >
                    {m.done ? "✓" : m.month}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: m.done ? "#1D9E75" : "#16233A",
                        }}
                      >
                        {m.label}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 12,
                            background: "rgba(244,96,12,0.15)",
                            color: "#F4600C",
                            padding: "2px 8px",
                            borderRadius: 99,
                            fontWeight: 600,
                          }}
                        >
                          ~{m.score}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            background: "#EEF1F6",
                            color: "#64748B",
                            padding: "2px 8px",
                            borderRadius: 99,
                          }}
                        >
                          {m.util}% util
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: m.done ? "#1D9E75" : "#64748B",
                        lineHeight: 1.5,
                      }}
                    >
                      {m.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "rgba(244,96,12,0.08)",
                border: "1px solid rgba(244,96,12,0.15)",
                borderRadius: 10,
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Tap any milestone to mark it complete · Score targets are
              estimates based on your utilization reduction plan
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div>
                <button
                  onClick={saveSnapshot}
                  style={{
                    background: "#F4600C",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    padding: "9px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save This Month&apos;s Snapshot
                </button>
                {history.length > 0 && (
                  <span
                    style={{ fontSize: 12, color: "#64748B", marginLeft: 10 }}
                  >
                    Last saved: {history[history.length - 1].label}
                  </span>
                )}
              </div>
              <button
                onClick={resetAllData}
                style={{
                  background: "rgba(226,75,74,0.1)",
                  border: "1px solid rgba(226,75,74,0.3)",
                  borderRadius: 8,
                  color: "#E24B4A",
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset all data
              </button>
            </div>

            {history.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px dashed #D8DEE9",
                  borderRadius: 12,
                  padding: "30px 20px",
                  textAlign: "center",
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                No snapshots yet — save one to start tracking trends.
              </div>
            ) : (
              <div>
                <ScoreTrendChart history={history} />
                <TrendBars
                  title="Combined utilization over time"
                  points={history.map((h) => ({
                    x: h.label,
                    y: h.totalUtil,
                    color: getUtilColor(h.totalUtil),
                  }))}
                  format={(v) => `${v}%`}
                />
                <TrendBars
                  title="Combined balance over time"
                  points={history.map((h) => ({
                    x: h.label,
                    y: h.totalBalance,
                  }))}
                  format={(v) => `$${v.toLocaleString()}`}
                />

                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E7ECF3",
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#F4600C",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 14,
                    }}
                  >
                    Month-to-month comparison
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 30px",
                        gap: 8,
                        fontSize: 11,
                        color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "0 8px 8px",
                        borderBottom: "1px solid #EDF1F7",
                      }}
                    >
                      <span>Month</span>
                      <span>Score (A/D)</span>
                      <span>Balance</span>
                      <span>Util</span>
                      <span>Δ vs prior</span>
                      <span />
                    </div>
                    {history.map((h, i) => {
                      const prev = i > 0 ? history[i - 1] : null;
                      const balanceDelta = prev
                        ? h.totalBalance - prev.totalBalance
                        : null;
                      const utilDelta = prev
                        ? h.totalUtil - prev.totalUtil
                        : null;
                      return (
                        <div
                          key={h.monthKey}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 30px",
                            gap: 8,
                            fontSize: 13,
                            padding: "10px 8px",
                            borderBottom:
                              i < history.length - 1
                                ? "1px solid #EEF1F6"
                                : "none",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{h.label}</span>
                          <span style={{ color: "#64748B" }}>
                            <span style={{ color: "#F4600C" }}>{h.score}</span>
                            {" / "}
                            <span style={{ color: "#9B59B6" }}>
                              {h.wifeScore}
                            </span>
                          </span>
                          <span>${h.totalBalance.toLocaleString()}</span>
                          <span style={{ color: getUtilColor(h.totalUtil) }}>
                            {h.totalUtil}%
                          </span>
                          <span
                            style={{
                              color:
                                balanceDelta === null
                                  ? "#64748B"
                                  : balanceDelta <= 0 && utilDelta <= 0
                                    ? "#1D9E75"
                                    : "#E24B4A",
                              fontWeight: 600,
                            }}
                          >
                            {balanceDelta === null
                              ? "—"
                              : `${balanceDelta > 0 ? "+" : ""}$${balanceDelta.toLocaleString()} · ${utilDelta > 0 ? "+" : ""}${utilDelta}%`}
                          </span>
                          <button
                            onClick={() => deleteSnapshot(h.monthKey)}
                            title="Delete snapshot"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#64748B",
                              cursor: "pointer",
                              fontSize: 14,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

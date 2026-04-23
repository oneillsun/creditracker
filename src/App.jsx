import { useState, useEffect } from "react";

const INITIAL_CARDS = [
  { id: 1, name: "Credit One", balance: 577, limit: 850, color: "#E24B4A", bg: "#FCEBEB", owner: "antonio" },
  { id: 2, name: "Discover", balance: 137, limit: 200, color: "#EF9F27", bg: "#FAEEDA", owner: "antonio" },
  { id: 3, name: "US Bank", balance: 135, limit: 500, color: "#378ADD", bg: "#E6F1FB", owner: "antonio" },
  { id: 4, name: "Capital One", balance: 0, limit: 300, color: "#1D9E75", bg: "#E1F5EE", owner: "antonio" },
  { id: 5, name: "Capital One", balance: 292, limit: 500, color: "#9B59B6", bg: "#F5EEF8", owner: "wife" },
  { id: 6, name: "Credit One", balance: 936, limit: 2000, color: "#5DADE2", bg: "#EBF5FB", owner: "wife" },
];

const MILESTONES = [
  { month: 1, label: "Apr 2026", score: 645, util: 30, action: "Pay down Credit One → $400, Discover → $60", done: false },
  { month: 2, label: "May 2026", score: 660, util: 15, action: "Pay down Credit One → $200. Request CLI on US Bank", done: false },
  { month: 3, label: "Jun 2026", score: 675, util: 10, action: "Credit One under $85. Request CLIs on Capital One & Discover", done: false },
  { month: 4, label: "Jul 2026", score: 685, util: 10, action: "Apply for 1 new card — Discover It or Capital One Quicksilver", done: false },
  { month: 5, label: "Aug 2026", score: 695, util: 10, action: "Another round of CLIs. Consider 2nd new card if 690+", done: false },
  { month: 6, label: "Sep 2026", score: 700, util: 10, action: "Final CLIs. Hit $15K total. Begin Vidants business credit", done: false },
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

export default function CreditTracker() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [score, setScore] = useState(625);
  const [wifeScore, setWifeScore] = useState(620);
  const [milestones, setMilestones] = useState(MILESTONES);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState({ balance: "", limit: "" });
  const [tab, setTab] = useState("dashboard");
  const [cardFilter, setCardFilter] = useState("all");

  const myCards = cards.filter(c => c.owner === "antonio");
  const wifeCards = cards.filter(c => c.owner === "wife");
  const filteredCards = cardFilter === "all" ? cards : cards.filter(c => c.owner === cardFilter);

  const totalBalance = cards.reduce((s, c) => s + c.balance, 0);
  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
  const totalUtil = totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;
  const totalLimitK = (totalLimit / 1000).toFixed(1);

  const myBalance = myCards.reduce((s, c) => s + c.balance, 0);
  const myLimit = myCards.reduce((s, c) => s + c.limit, 0);
  const myUtil = myLimit > 0 ? Math.round((myBalance / myLimit) * 100) : 0;

  const wifeBalance = wifeCards.reduce((s, c) => s + c.balance, 0);
  const wifeLimit = wifeCards.reduce((s, c) => s + c.limit, 0);
  const wifeUtil = wifeLimit > 0 ? Math.round((wifeBalance / wifeLimit) * 100) : 0;

  function startEdit(card) {
    setEditing(card.id);
    setEditVal({ balance: card.balance, limit: card.limit });
  }

  function saveEdit(id) {
    setCards(cards.map(c => c.id === id
      ? { ...c, balance: Math.max(0, Number(editVal.balance)), limit: Math.max(1, Number(editVal.limit)) }
      : c
    ));
    setEditing(null);
  }

  function toggleMilestone(i) {
    setMilestones(milestones.map((m, idx) => idx === i ? { ...m, done: !m.done } : m));
  }

  const completedMilestones = milestones.filter(m => m.done).length;
  const progressPct = Math.round((completedMilestones / milestones.length) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A1628",
      fontFamily: "'Barlow', 'Segoe UI', sans-serif",
      color: "#F5F8FA",
      padding: "0 0 40px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0A1628 0%, #1B2E4A 100%)",
        borderBottom: "1px solid rgba(244,96,12,0.2)",
        padding: "24px 28px 0",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#F4600C", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
              Family Credit Tracker
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "#F5F8FA" }}>
              Bello Family
            </div>
            <div style={{ fontSize: 13, color: "#8499AE", marginTop: 2 }}>Goal: $15,000 total credit · 700+ score · 6 months</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "rgba(244,96,12,0.12)", border: "1px solid rgba(244,96,12,0.3)", borderRadius: 12, padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#F4600C", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>ANTONIO</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: getScoreColor(score), lineHeight: 1.1 }}>{score}</div>
              <input type="range" min={500} max={850} value={score} onChange={e => setScore(Number(e.target.value))} style={{ width: 70, marginTop: 4, accentColor: "#F4600C" }} />
            </div>
            <div style={{ background: "rgba(155,89,182,0.12)", border: "1px solid rgba(155,89,182,0.3)", borderRadius: 12, padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#9B59B6", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>DAMARYS</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: getScoreColor(wifeScore), lineHeight: 1.1 }}>{wifeScore}</div>
              <input type="range" min={500} max={850} value={wifeScore} onChange={e => setWifeScore(Number(e.target.value))} style={{ width: 70, marginTop: 4, accentColor: "#9B59B6" }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {["dashboard", "cards", "milestones"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 18px",
              background: tab === t ? "#F4600C" : "transparent",
              color: tab === t ? "#fff" : "#8499AE",
              border: "none",
              borderRadius: "8px 8px 0 0",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              letterSpacing: "0.02em",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Combined Balance", value: `$${totalBalance.toLocaleString()}`, sub: `of $${totalLimit.toLocaleString()}` },
                { label: "Combined Utilization", value: `${totalUtil}%`, sub: totalUtil <= 10 ? "Excellent" : totalUtil <= 30 ? "Good" : "High — reduce ASAP", valColor: getUtilColor(totalUtil) },
                { label: "Total Credit", value: `$${totalLimitK}K`, sub: "Target: $15K", valColor: totalLimit >= 15000 ? "#1D9E75" : "#F5F8FA" },
                { label: "Plan Progress", value: `${progressPct}%`, sub: `${completedMilestones} of 6 milestones`, valColor: progressPct > 50 ? "#1D9E75" : "#EF9F27" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#8499AE", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.valColor || "#F5F8FA", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#8499AE", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Per-person split */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Antonio", balance: myBalance, limit: myLimit, util: myUtil, accent: "#F4600C", cards: myCards.length },
                { label: "Damarys", balance: wifeBalance, limit: wifeLimit, util: wifeUtil, accent: "#9B59B6", cards: wifeCards.length },
              ].map((p, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)`, borderLeft: `3px solid ${p.accent}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: p.accent, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{p.label} · {p.cards} cards</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "#8499AE" }}>Balance</span>
                    <span style={{ color: "#F5F8FA", fontWeight: 600 }}>${p.balance.toLocaleString()} / ${p.limit.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${Math.min(p.util, 100)}%`, background: getUtilColor(p.util), borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 12, color: getUtilColor(p.util), fontWeight: 700 }}>{p.util}% utilization</div>
                </div>
              ))}
            </div>

            {/* Utilization bars */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#F4600C", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Utilization by card</div>
              {cards.map(card => {
                const pct = card.limit > 0 ? Math.round((card.balance / card.limit) * 100) : 0;
                const ownerColor = card.owner === "antonio" ? "#F4600C" : "#9B59B6";
                const ownerLabel = card.owner === "antonio" ? "Antonio" : "Damarys";
                return (
                  <div key={card.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#C8D4E0", fontWeight: 500 }}>{card.name}</span>
                        <span style={{ fontSize: 10, background: `rgba(${card.owner === "antonio" ? "244,96,12" : "155,89,182"},0.15)`, color: ownerColor, padding: "1px 7px", borderRadius: 99, fontWeight: 600 }}>{ownerLabel}</span>
                      </div>
                      <span style={{ color: "#8499AE" }}>
                        <span style={{ color: getUtilColor(pct), fontWeight: 700 }}>{pct}%</span>
                        {" "}· ${card.balance.toLocaleString()} / ${card.limit.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: getUtilColor(pct), borderRadius: 99, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score journey */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "#F4600C", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Score journey to 700+</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {[{ s: score, l: "Now" }, ...MILESTONES.map(m => ({ s: m.score, l: m.label.split(" ")[0] }))].map((pt, i) => {
                  const h = Math.round(((pt.s - 500) / 350) * 70);
                  const isNow = i === 0;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 10, color: isNow ? "#F4600C" : "#8499AE", fontWeight: isNow ? 700 : 400 }}>{pt.s}</div>
                      <div style={{
                        width: "100%",
                        height: h,
                        background: isNow ? "#F4600C" : i <= completedMilestones ? "#1D9E75" : "rgba(255,255,255,0.1)",
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.3s",
                      }} />
                      <div style={{ fontSize: 9, color: "#8499AE", textAlign: "center" }}>{pt.l}</div>
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
              {[["all", "All Cards"], ["antonio", "Antonio"], ["wife", "Damarys"]].map(([val, label]) => (
                <button key={val} onClick={() => setCardFilter(val)} style={{
                  padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                  background: cardFilter === val ? (val === "wife" ? "#9B59B6" : val === "antonio" ? "#F4600C" : "#F4600C") : "rgba(255,255,255,0.07)",
                  color: cardFilter === val ? "#fff" : "#8499AE",
                  transition: "all 0.15s",
                }}>{label}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {filteredCards.map(card => {
              const pct = card.limit > 0 ? Math.round((card.balance / card.limit) * 100) : 0;
              const isEditing = editing === card.id;
              return (
                <div key={card.id} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${isEditing ? card.color : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 14,
                  padding: "18px 18px 14px",
                  transition: "border 0.2s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#F5F8FA" }}>{card.name}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                        background: card.owner === "antonio" ? "rgba(244,96,12,0.15)" : "rgba(155,89,182,0.15)",
                        color: card.owner === "antonio" ? "#F4600C" : "#9B59B6",
                      }}>{card.owner === "antonio" ? "Antonio" : "Damarys"}</span>
                    </div>
                    <div style={{ background: card.bg, color: card.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{pct}%</div>
                  </div>

                  {isEditing ? (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#8499AE", marginBottom: 4 }}>Balance ($)</div>
                          <input
                            type="number"
                            value={editVal.balance}
                            onChange={e => setEditVal({ ...editVal, balance: e.target.value })}
                            style={{
                              width: "100%",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              borderRadius: 8,
                              color: "#F5F8FA",
                              padding: "6px 10px",
                              fontSize: 14,
                              outline: "none",
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "#8499AE", marginBottom: 4 }}>Limit ($)</div>
                          <input
                            type="number"
                            value={editVal.limit}
                            onChange={e => setEditVal({ ...editVal, limit: e.target.value })}
                            style={{
                              width: "100%",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              borderRadius: 8,
                              color: "#F5F8FA",
                              padding: "6px 10px",
                              fontSize: 14,
                              outline: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => saveEdit(card.id)} style={{
                          flex: 1, background: "#F4600C", border: "none", borderRadius: 8,
                          color: "#fff", padding: "7px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}>Save</button>
                        <button onClick={() => setEditing(null)} style={{
                          flex: 1, background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8,
                          color: "#8499AE", padding: "7px", fontSize: 13, cursor: "pointer",
                        }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#8499AE" }}>
                          <span>Balance</span><span style={{ color: "#F5F8FA", fontWeight: 600 }}>${card.balance.toLocaleString()}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, color: "#8499AE" }}>
                          <span>Limit</span><span style={{ color: "#F5F8FA", fontWeight: 600 }}>${card.limit.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: getUtilColor(pct), borderRadius: 99 }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: pct <= 10 ? "#1D9E75" : pct <= 30 ? "#EF9F27" : "#E24B4A", fontWeight: 600 }}>
                          {pct <= 10 ? "✓ Excellent" : pct <= 30 ? "↓ Reduce more" : "⚠ High — priority"}
                        </div>
                        <button onClick={() => startEdit(card)} style={{
                          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8, color: "#C8D4E0", padding: "5px 12px", fontSize: 12, cursor: "pointer",
                        }}>Update</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add card hint */}
            <div style={{
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
            }}>
              <div style={{ fontSize: 28, color: "rgba(244,96,12,0.4)" }}>+</div>
              <div style={{ fontSize: 13, color: "#8499AE", textAlign: "center" }}>New card in Month 4<br />after score hits 675+</div>
            </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {tab === "milestones" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#8499AE", marginBottom: 8 }}>
                <span>Overall progress</span>
                <span style={{ fontWeight: 700, color: "#F4600C" }}>{progressPct}%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "#F4600C", borderRadius: 99, transition: "width 0.4s" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {milestones.map((m, i) => (
                <div key={i} onClick={() => toggleMilestone(i)} style={{
                  background: m.done ? "rgba(29,158,117,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${m.done ? "rgba(29,158,117,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 99,
                    border: `2px solid ${m.done ? "#1D9E75" : "rgba(255,255,255,0.2)"}`,
                    background: m.done ? "#1D9E75" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                    fontSize: 12, color: "#fff", fontWeight: 700,
                    transition: "all 0.2s",
                  }}>{m.done ? "✓" : m.month}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: m.done ? "#1D9E75" : "#F5F8FA" }}>{m.label}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 12, background: "rgba(244,96,12,0.15)", color: "#F4600C", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>
                          ~{m.score}
                        </span>
                        <span style={{ fontSize: 12, background: "rgba(255,255,255,0.07)", color: "#8499AE", padding: "2px 8px", borderRadius: 99 }}>
                          {m.util}% util
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: m.done ? "#1D9E75" : "#8499AE", lineHeight: 1.5 }}>{m.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(244,96,12,0.08)", border: "1px solid rgba(244,96,12,0.15)", borderRadius: 10, fontSize: 12, color: "#8499AE" }}>
              Tap any milestone to mark it complete · Score targets are estimates based on your utilization reduction plan
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import * as Icons from "lucide-react";
import leadData from './leads.json';

import CorgiFull from './assets/corgi-full.png';
import CorgiMark from './assets/corgi-mark.png';

const BDR_NAMES = [
  "Unassigned", "Alex", "Sam", "Jordan", "Taylor",
  "Morgan", "Casey", "Riley", "Jamie", "Drew", "Avery"
];

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Disqualified"];

const STATUS_STYLES = {
  "New":          "bg-slate-100 text-slate-500",
  "Contacted":    "bg-blue-50 text-blue-500",
  "Qualified":    "bg-emerald-50 text-emerald-600",
  "Disqualified": "bg-red-50 text-red-400",
};

function leadKey(lead) {
  return `${lead.name}__${lead.domain || lead.website_url || ""}`;
}

function getSignals(lead) {
  const signals = [];
  const fy = lead.founded_year || 0;
  const hc = lead.headcount || 0;
  const fs = (lead.funding_stage || "").toLowerCase();
  const tf = lead.total_funding || 0;

  if (fy >= 2023)
    signals.push({ label: "New Co", icon: "🌱", style: "bg-emerald-50 text-emerald-600 border-emerald-100" });
  if ((fs.includes("seed") || fs.includes("series_a") || fs.includes("series a")) && tf > 0)
    signals.push({ label: "Funded", icon: "🔥", style: "bg-orange-50 text-orange-500 border-orange-100" });
  if (hc >= 1 && hc <= 5)
    signals.push({ label: "Early Team", icon: "👤", style: "bg-purple-50 text-purple-600 border-purple-100" });
  if (hc >= 6 && hc <= 25)
    signals.push({ label: "Scaling", icon: "📈", style: "bg-blue-50 text-blue-500 border-blue-100" });

  return signals;
}

const App = () => {
  const [search, setSearch]               = useState("");
  const [tierFilter, setTierFilter]       = useState("All");
  const [sourceFilter, setSourceFilter]   = useState("All");
  const [hcFilter, setHcFilter]           = useState("All");
  const [foundedFilter, setFoundedFilter] = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");

  const [statuses, setStatuses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lead_statuses") || "{}"); }
    catch { return {}; }
  });

  const [claims, setClaims] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lead_claims") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("lead_statuses", JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem("lead_claims", JSON.stringify(claims));
  }, [claims]);

  const updateStatus = (key, val) => setStatuses(prev => ({ ...prev, [key]: val }));
  const updateClaim  = (key, val) => setClaims(prev => ({ ...prev, [key]: val }));

  const stats = useMemo(() => {
    const total     = leadData.length;
    const t1        = leadData.filter(l => l.tier === "Tier 1").length;
    const avg       = total > 0
      ? (leadData.reduce((acc, l) => acc + l.score, 0) / total).toFixed(0)
      : 0;
    const contacted = Object.values(statuses).filter(
      s => s === "Contacted" || s === "Qualified"
    ).length;
    return { total, t1, avg, contacted };
  }, [statuses]);

  const filtered = useMemo(() => {
    return leadData.filter(lead => {
      const key    = leadKey(lead);
      const status = statuses[key] || "New";
      const hc     = lead.headcount || 0;
      const fy     = lead.founded_year || 0;

      if (!lead.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (tierFilter !== "All"   && lead.tier !== tierFilter) return false;
      if (sourceFilter !== "All" && (lead.source || "").toLowerCase() !== sourceFilter) return false;
      if (statusFilter !== "All" && status !== statusFilter) return false;

      if (hcFilter === "1-10"  && !(hc >= 1  && hc <= 10))  return false;
      if (hcFilter === "11-25" && !(hc >= 11 && hc <= 25))  return false;
      if (hcFilter === "26-50" && !(hc >= 26 && hc <= 50))  return false;

      if (foundedFilter === "2023+"     && !(fy >= 2023))                    return false;
      if (foundedFilter === "2021-2022" && !(fy >= 2021 && fy <= 2022))      return false;
      if (foundedFilter === "pre-2021"  && !(fy > 0 && fy < 2021))           return false;

      return true;
    });
  }, [search, tierFilter, sourceFilter, hcFilter, foundedFilter, statusFilter, statuses]);

  const FilterBtn = ({ active, onClick, children }) => (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all
        ${active ? "bg-[#FF5C35] text-white shadow-sm" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#FF5C35]/20">
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <img src={CorgiFull} alt="Corgi Logo" className="h-10 w-auto object-contain" />
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A]">BDR Dashboard</h2>
              <p className="text-[10px] font-bold text-[#FF5C35] uppercase tracking-[0.2em]">Growth Intel v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Icons.Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none w-full text-sm font-medium focus:ring-2 focus:ring-[#FF5C35]/10 focus:border-[#FF5C35] transition-all"
                placeholder="Search by company..."
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-xs font-bold outline-none cursor-pointer hover:border-[#FF5C35] transition-all shadow-sm"
              onChange={e => setTierFilter(e.target.value)}
            >
              <option value="All">All Tiers</option>
              <option value="Tier 1">High Priority</option>
              <option value="Tier 2">Mid Priority</option>
            </select>
          </div>
        </div>

        {/* STATS — 4 cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Leads</p>
            <p className="text-6xl font-extrabold text-[#0F172A] mt-2 leading-none tracking-tighter">{stats.total}</p>
            <Icons.Database className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-slate-100 transition-colors" size={100} />
          </div>
          <div className="bg-[#FF5C35] p-8 rounded-[2.5rem] shadow-xl shadow-[#FF5C35]/20 text-white relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">T1 Targets</p>
            <p className="text-6xl font-extrabold mt-2 leading-none tracking-tighter">{stats.t1}</p>
            <Icons.Zap className="absolute -bottom-4 -right-4 text-white/10 group-hover:text-white/20 transition-colors" size={100} />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Score</p>
            <p className="text-6xl font-extrabold text-[#0F172A] mt-2 leading-none tracking-tighter">{stats.avg}</p>
            <Icons.BarChart3 className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-slate-100 transition-colors" size={100} />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contacted</p>
            <p className="text-6xl font-extrabold text-[#0F172A] mt-2 leading-none tracking-tighter">{stats.contacted}</p>
            <Icons.UserCheck className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-slate-100 transition-colors" size={100} />
          </div>
        </div>

        {/* ICP FILTER BAR */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm px-6 py-4 mb-6 flex flex-wrap gap-x-6 gap-y-3 items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Filter</span>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mr-1">Source</span>
            {["All", "apollo", "yc", "github", "news"].map(s => (
              <FilterBtn key={s} active={sourceFilter === s} onClick={() => setSourceFilter(s)}>
                {s === "All" ? "All" : s.toUpperCase()}
              </FilterBtn>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-100" />

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mr-1">Team</span>
            {[["All","Any"],["1-10","1–10"],["11-25","11–25"],["26-50","26–50"]].map(([v,l]) => (
              <FilterBtn key={v} active={hcFilter === v} onClick={() => setHcFilter(v)}>{l}</FilterBtn>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-100" />

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mr-1">Founded</span>
            {[["All","Any"],["2023+","2023+"],["2021-2022","21–22"],["pre-2021","<2021"]].map(([v,l]) => (
              <FilterBtn key={v} active={foundedFilter === v} onClick={() => setFoundedFilter(v)}>{l}</FilterBtn>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-100" />

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mr-1">Status</span>
            {["All", ...STATUS_OPTIONS].map(s => (
              <FilterBtn key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</FilterBtn>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400">Company Details</th>
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400">Industry / Stats</th>
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Score</th>
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Claimed By</th>
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right pr-14">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filtered.map((lead, idx) => {
                const key     = leadKey(lead);
                const status  = statuses[key] || "New";
                const claim   = claims[key]   || "Unassigned";
                const signals = getSignals(lead);

                return (
                  <tr key={idx} className="group hover:bg-slate-50/30 transition-all">

                    {/* COMPANY DETAILS */}
                    <td className="p-7">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#0F172A] group-hover:text-[#FF5C35] transition-colors tracking-tight">
                          {lead.name}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          {lead.headcount > 0 ? `${lead.headcount} team members` : "Team size unknown"} •{" "}
                          {lead.founded_year > 0 ? `Founded ${lead.founded_year}` : "Founded unknown"}
                        </span>
                        {lead.source && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mt-1">
                            via {lead.source}
                          </span>
                        )}
                        {signals.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {signals.map((sig, i) => (
                              <span key={i}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase tracking-wide ${sig.style}`}>
                                {sig.icon} {sig.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* INDUSTRY */}
                    <td className="p-7">
                      <div className="text-sm font-semibold text-slate-600 capitalize">{lead.industry || "—"}</div>
                      <div className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight opacity-70">
                        {lead.funding_stage || "Private"} •{" "}
                        {lead.total_funding > 0 ? `$${lead.total_funding.toLocaleString()}` : "Bootstrapped"}
                      </div>
                    </td>

                    {/* SCORE */}
                    <td className="p-7 text-center">
                      <div className="inline-block px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                        <p className="text-3xl font-extrabold text-[#0F172A] leading-none tracking-tighter">{lead.score}</p>
                        <p className={`text-[8px] font-black mt-1.5 uppercase tracking-widest ${lead.tier === "Tier 1" ? "text-[#FF5C35]" : "text-slate-400"}`}>
                          {lead.tier}
                        </p>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-7 text-center">
                      <select
                        value={status}
                        onChange={e => updateStatus(key, e.target.value)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border-0 outline-none cursor-pointer transition-all ${STATUS_STYLES[status]}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>

                    {/* CLAIMED BY */}
                    <td className="p-7 text-center">
                      <select
                        value={claim}
                        onChange={e => updateClaim(key, e.target.value)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border outline-none cursor-pointer transition-all
                          ${claim === "Unassigned"
                            ? "bg-slate-50 border-slate-100 text-slate-300"
                            : "bg-[#FF5C35]/10 border-[#FF5C35]/20 text-[#FF5C35] hover:border-[#FF5C35]"}`}
                      >
                        {BDR_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-7">
                      <div className="flex justify-end gap-2 pr-4">
                        {lead.website_url &&
                         lead.website_url.startsWith("http") &&
                         !lead.website_url.includes("vercel.app") &&
                         !lead.website_url.includes("techcrunch.com") &&
                         !lead.website_url.includes("google.com") ? (
                          <a href={lead.website_url} target="_blank" rel="noreferrer"
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl hover:border-[#FF5C35] hover:text-[#FF5C35] transition-all shadow-sm uppercase tracking-tighter">
                            Website
                          </a>
                        ) : (
                          <span className="px-5 py-2.5 bg-slate-50 border border-slate-100 text-slate-300 text-[10px] font-bold rounded-xl uppercase tracking-tighter cursor-not-allowed">
                            Website
                          </span>
                        )}

                        {lead.linkedin_url && lead.linkedin_url.includes("linkedin.com") ? (
                          <a href={lead.linkedin_url} target="_blank" rel="noreferrer"
                            className="px-5 py-2.5 bg-[#FF5C35] text-white text-[10px] font-bold rounded-xl hover:shadow-lg hover:shadow-[#FF5C35]/30 transition-all shadow-sm uppercase tracking-tighter">
                            LinkedIn
                          </a>
                        ) : (
                          <span className="px-5 py-2.5 bg-slate-100 text-slate-300 text-[10px] font-bold rounded-xl uppercase tracking-tighter cursor-not-allowed">
                            LinkedIn
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="mt-12 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
          <img src={CorgiMark} alt="Corgi Mark" className="h-8 w-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0F172A]">Corgi Intelligence System</p>
        </div>

      </div>
    </div>
  );
};

export default App;
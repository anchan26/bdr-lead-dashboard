import React, { useState, useMemo } from 'react';
import * as Icons from "lucide-react";
import leadData from './leads.json';

import CorgiFull from './assets/corgi-full.png'; 
import CorgiMark from './assets/corgi-mark.png'; 

const App = () => {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");

  const stats = useMemo(() => {
    const total = leadData.length;
    const t1    = leadData.filter(l => l.tier === "Tier 1").length;
    const avg   = total > 0 ? (leadData.reduce((acc, curr) => acc + curr.score, 0) / total).toFixed(0) : 0;
    return { total, t1, avg };
  }, []);

  const filtered = useMemo(() => {
    return leadData.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) &&
      (tierFilter === "All" || l.tier === tierFilter)
    );
  }, [search, tierFilter]);

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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-xs font-bold outline-none cursor-pointer hover:border-[#FF5C35] transition-all shadow-sm"
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option value="All">All Tiers</option>
              <option value="Tier 1">High Priority</option>
              <option value="Tier 2">Mid Priority</option>
            </select>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Leads</p>
            <p className="text-7xl font-extrabold text-[#0F172A] mt-2 leading-none tracking-tighter">{stats.total}</p>
            <Icons.Database className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-slate-100 transition-colors" size={120} />
          </div>
          <div className="bg-[#FF5C35] p-8 rounded-[2.5rem] shadow-xl shadow-[#FF5C35]/20 text-white relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">T1 Targets</p>
            <p className="text-7xl font-extrabold mt-2 leading-none tracking-tighter">{stats.t1}</p>
            <Icons.Zap className="absolute -bottom-4 -right-4 text-white/10 group-hover:text-white/20 transition-colors" size={120} />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Lead Score</p>
            <p className="text-7xl font-extrabold text-[#0F172A] mt-2 leading-none tracking-tighter">{stats.avg}</p>
            <Icons.BarChart3 className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-slate-100 transition-colors" size={120} />
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
                <th className="p-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right pr-14">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filtered.map((lead, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/30 transition-all">
                  <td className="p-7">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-[#0F172A] group-hover:text-[#FF5C35] transition-colors tracking-tight">{lead.name}</span>
                      <span className="text-xs text-slate-400 mt-1">
                        {lead.headcount > 0 ? `${lead.headcount} team members` : "Team size unknown"} • {lead.founded_year > 0 ? `Founded ${lead.founded_year}` : "Founded unknown"}
                      </span>
                      {lead.source && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mt-1">
                          via {lead.source}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="text-sm font-semibold text-slate-600 capitalize">{lead.industry || "—"}</div>
                    <div className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight opacity-70">
                      {lead.funding_stage || "Private"} • {lead.total_funding > 0 ? `$${lead.total_funding.toLocaleString()}` : "Bootstrapped"}
                    </div>
                  </td>
                  <td className="p-7 text-center">
                    <div className="inline-block px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                      <p className="text-3xl font-extrabold text-[#0F172A] leading-none tracking-tighter">{lead.score}</p>
                      <p className={`text-[8px] font-black mt-1.5 uppercase tracking-widest ${lead.tier === "Tier 1" ? "text-[#FF5C35]" : "text-slate-400"}`}>
                        {lead.tier}
                      </p>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex justify-end gap-2 pr-4">

                      {/* WEBSITE BUTTON */}
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

                      {/* LINKEDIN BUTTON */}
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
              ))}
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
import React from 'react';
import { WeeklyReport } from '../types';
import { Zap, Target, BarChart2, TrendingUp } from 'lucide-react';
import { formatNumber, formatPercent, getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const NewEngineSection: React.FC<Props> = ({ report }) => {
  const { newEngine } = report;

  return (
    <section id="section-new-engine" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>3. Isolated Weekly Published Performance</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200 font-medium">
                The "New" Engine
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Metrics isolated strictly for only the videos published during this specific week
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium border border-stone-200">
            {newEngine.totalPostsPublished} New Posts Tracked
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            {newEngine.engagementRatePercent}% Combined ER
          </span>
        </div>
      </div>

      {/* Narrative */}
      <div className="my-4 p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
        <p>{newEngine.narrative}</p>
      </div>

      {/* Key New-Engine Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-stone-600" />
            <span>Total New Views</span>
          </div>
          <div className="mt-2 text-xl font-bold text-stone-900">
            {newEngine.totalNewViews.toLocaleString()}
          </div>
          {newEngine.viewsWowChangePercent !== 0 && (
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              +{newEngine.viewsWowChangePercent}% WoW Growth
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-stone-600" />
            <span>Avg Views / Post</span>
          </div>
          <div className="mt-2 text-xl font-bold text-stone-900">
            {newEngine.avgViewsPerPost.toLocaleString()}
          </div>
          {newEngine.avgViewsWowChangePercent !== 0 && (
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              +{newEngine.avgViewsWowChangePercent}% WoW
            </div>
          )}
        </div>

        {/* Priority Highlight: Median Views */}
        <div className="p-3.5 rounded-lg bg-stone-100 border border-stone-300 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-stone-700" />
              <span>Median Views / Post</span>
            </span>
            <span className="text-[9px] bg-stone-200 text-stone-900 px-1.5 py-0.2 rounded font-bold">KEY BASELINE</span>
          </div>
          <div className="mt-2 text-xl font-bold text-stone-950">
            {newEngine.medianViewsPerPost.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-600 font-medium mt-0.5">
            {newEngine.medianViewsWowChangePercent > 0 ? `+${newEngine.medianViewsWowChangePercent}% WoW` : 'Benchmark'} (Non-viral baseline)
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-stone-600" />
            <span>New Interactions</span>
          </div>
          <div className="mt-2 text-xl font-bold text-stone-900">
            {newEngine.totalInteractions.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-600 mt-0.5">
            {newEngine.engagementRatePercent}% Engagement Rate
          </div>
        </div>
      </div>

      {/* Platform New-Engine Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-600 font-semibold border-y border-stone-200">
              <th className="py-2.5 px-3">Platform (New Engine)</th>
              <th className="py-2.5 px-3 text-center">Posts Published</th>
              <th className="py-2.5 px-3">Total New Views</th>
              <th className="py-2.5 px-3">Avg Views / Post</th>
              <th className="py-2.5 px-3">Median Views / Post</th>
              <th className="py-2.5 px-3">Total Interactions</th>
              <th className="py-2.5 px-3">Engagement Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {newEngine.platforms.map((p) => {
              const badge = getPlatformBadgeColor(p.platform);
              return (
                <tr key={p.platform} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.platform}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center font-medium text-stone-800">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-semibold">
                      {p.postsPublished}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-stone-900">
                    {p.totalNewViews.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.avgViewsPerPost.toLocaleString()}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-900 px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                      {p.medianViewsPerPost.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.interactions.toLocaleString()}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-stone-900">
                      {p.engagementRatePercent}%
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Combined Row */}
            <tr className="bg-stone-50/90 font-semibold border-t-2 border-stone-200 text-stone-900">
              <td className="py-3 px-3">Combined Total / Avg</td>
              <td className="py-3 px-3 text-center">{newEngine.totalPostsPublished}</td>
              <td className="py-3 px-3">{newEngine.totalNewViews.toLocaleString()}</td>
              <td className="py-3 px-3">{newEngine.avgViewsPerPost.toLocaleString()}</td>
              <td className="py-3 px-3 text-stone-900 font-bold">{newEngine.medianViewsPerPost.toLocaleString()}</td>
              <td className="py-3 px-3">{newEngine.totalInteractions.toLocaleString()}</td>
              <td className="py-3 px-3">{newEngine.engagementRatePercent}% ER</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

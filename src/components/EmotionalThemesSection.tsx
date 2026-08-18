import React from 'react';
import { WeeklyReport } from '../types';
import { Layers, HeartHandshake, Eye, Clock, BarChart } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const EmotionalThemesSection: React.FC<Props> = ({ report }) => {
  const { emotionalThemesMatrix } = report;
  const maxViews = Math.max(...emotionalThemesMatrix.themes.map((t) => t.totalViews), 1);

  return (
    <section id="section-emotional-themes" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm scroll-mt-48">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>6. Quantified Emotional Themes Matrix</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-900 border border-stone-200 font-medium">
                Narrative Performance
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Grouping weekly published content by core emotional angles to find repeatable creative winners
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            {emotionalThemesMatrix.themes.length} Core Narrative Pillars
          </span>
        </div>
      </div>

      {/* Narrative block */}
      <div className="my-4 p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
        <HeartHandshake className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
        <p>{emotionalThemesMatrix.narrative}</p>
      </div>

      {/* Visual Horizontal Distribution Chart (Figure 5.1) */}
      <div className="my-5 p-4 rounded-xl bg-stone-50/70 border border-stone-200">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-stone-800">
          <span className="flex items-center gap-1.5">
            <BarChart className="w-3.5 h-3.5 text-stone-600" />
            <span>Figure 5.1: Consolidated New-Content Views by Core Narrative Theme</span>
          </span>
          <span className="text-[11px] text-stone-500 font-normal">
            Week {report.weekNumber} Total: {formatNumber(emotionalThemesMatrix.consolidated.totalViews)} views
          </span>
        </div>

        <div className="space-y-3">
          {emotionalThemesMatrix.themes.map((theme, idx) => {
            const widthPercent = Math.max(Math.round((theme.totalViews / maxViews) * 100), 2);
            // Elegant neutral slate shades
            const slateShades = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];
            const barColor = slateShades[idx % slateShades.length];

            return (
              <div key={theme.id || theme.themeName} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-800">{theme.themeName}</span>
                  <div className="flex items-center gap-2 text-stone-600">
                    <span className="font-bold text-stone-900">{theme.totalViews.toLocaleString()} views</span>
                    <span className="text-[11px] text-stone-400">({theme.shareOfNewViewsPercent}% of total)</span>
                  </div>
                </div>

                <div className="w-full bg-stone-200/70 rounded-full h-3.5 overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: barColor,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Thematic Matrix Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-600 font-semibold border-y border-stone-200">
              <th className="py-2.5 px-3">Emotional Theme Pillar</th>
              <th className="py-2.5 px-3 text-center">Post Volume</th>
              <th className="py-2.5 px-3">Total Views</th>
              <th className="py-2.5 px-3">Avg Views / Post</th>
              <th className="py-2.5 px-3">Likes / Comments / Shares</th>
              <th className="py-2.5 px-3">Total Watch Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {emotionalThemesMatrix.themes.map((theme, idx) => {
              const slateShades = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];
              const dotColor = slateShades[idx % slateShades.length];
              return (
                <tr key={theme.id || theme.themeName} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      ></span>
                      <span>{theme.themeName}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-semibold">
                      {theme.postVolume}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-stone-900">
                    {theme.totalViews.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {theme.avgViewsPerPost.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {theme.likes.toLocaleString()} / {theme.comments} / {theme.shares}
                  </td>

                  <td className="py-3 px-3 font-semibold text-stone-900">
                    {theme.watchTimeHours} Hours
                  </td>
                </tr>
              );
            })}

            {/* Consolidated Row */}
            <tr className="bg-stone-50 font-semibold border-t-2 border-stone-200 text-stone-900">
              <td className="py-3 px-3">Consolidated Themes Matrix</td>
              <td className="py-3 px-3 text-center">{emotionalThemesMatrix.consolidated.postVolume}</td>
              <td className="py-3 px-3">{emotionalThemesMatrix.consolidated.totalViews.toLocaleString()}</td>
              <td className="py-3 px-3">{emotionalThemesMatrix.consolidated.avgViewsPerPost.toLocaleString()}</td>
              <td className="py-3 px-3">
                {emotionalThemesMatrix.consolidated.likes.toLocaleString()} / {emotionalThemesMatrix.consolidated.comments} / {emotionalThemesMatrix.consolidated.shares}
              </td>
              <td className="py-3 px-3 text-stone-900 font-bold">{emotionalThemesMatrix.consolidated.watchTimeHours} Hours</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

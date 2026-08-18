import React, { useState } from 'react';
import { WeeklyReport } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, ArrowRight, Layers, Target, Eye, Clock, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatNumber, formatPercent } from '../utils/formatters';

interface Props {
  reports: WeeklyReport[];
  selectedReportId: string;
}

export const ComparisonView: React.FC<Props> = ({ reports, selectedReportId }) => {
  // Sort reports chronologically Week 1 -> Week 4
  const sortedReports = [...reports].sort((a, b) => a.weekNumber - b.weekNumber);

  const [primaryWeekId, setPrimaryWeekId] = useState<string>(selectedReportId);
  const defaultSecondaryId =
    sortedReports.find((r) => r.id !== primaryWeekId)?.id || sortedReports[0]?.id || '';
  const [secondaryWeekId, setSecondaryWeekId] = useState<string>(defaultSecondaryId);

  const primaryReport = reports.find((r) => r.id === primaryWeekId) || reports[0];
  const secondaryReport = reports.find((r) => r.id === secondaryWeekId) || reports[1] || reports[0];

  // Prepare chart dataset across all available weeks
  const trendData = sortedReports.map((r) => ({
    week: `Week ${r.weekNumber}`,
    weekNum: r.weekNumber,
    grandViews: r.executiveSummary.grandCombinedViews,
    newViews: r.newEngine.totalNewViews,
    evergreenViews: r.evergreenEngine.totalEvergreenViews,
    medianViews: r.newEngine.medianViewsPerPost,
    avgViews: r.newEngine.avgViewsPerPost,
    watchHours: r.engagementAndRetention.totalWatchTimeHours,
    followers: r.evergreenEngine.combined.totalFollowers,
    profileVisits: r.evergreenEngine.combined.totalProfileVisits,
    fbViews: r.executiveSummary.platformViewsComparison.find((p) => p.platform.includes('Facebook'))?.currWeekViews || 0,
    igViews: r.executiveSummary.platformViewsComparison.find((p) => p.platform.includes('Instagram'))?.currWeekViews || 0,
    ttViews: r.executiveSummary.platformViewsComparison.find((p) => p.platform.includes('TikTok'))?.currWeekViews || 0,
  }));

  // Calculate side-by-side differences
  const viewsDiff = primaryReport.executiveSummary.grandCombinedViews - secondaryReport.executiveSummary.grandCombinedViews;
  const viewsDiffPercent = secondaryReport.executiveSummary.grandCombinedViews > 0
    ? (viewsDiff / secondaryReport.executiveSummary.grandCombinedViews) * 100
    : 0;

  const newViewsDiff = primaryReport.newEngine.totalNewViews - secondaryReport.newEngine.totalNewViews;
  const newViewsDiffPercent = secondaryReport.newEngine.totalNewViews > 0
    ? (newViewsDiff / secondaryReport.newEngine.totalNewViews) * 100
    : 0;

  const medianDiff = primaryReport.newEngine.medianViewsPerPost - secondaryReport.newEngine.medianViewsPerPost;
  const medianDiffPercent = secondaryReport.newEngine.medianViewsPerPost > 0
    ? (medianDiff / secondaryReport.newEngine.medianViewsPerPost) * 100
    : 0;

  const watchTimeDiff = primaryReport.engagementAndRetention.totalWatchTimeHours - secondaryReport.engagementAndRetention.totalWatchTimeHours;

  return (
    <div id="comparison-view-container" className="space-y-6">
      {/* Header & Week Selector Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>Multi-Week Performance Growth & Comparison</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Track creative baseline progress, compare any two weeks side-by-side, and visualize long-term trajectory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700">Compare:</span>
              <select
                id="select-primary-week"
                value={primaryWeekId}
                onChange={(e) => setPrimaryWeekId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-500"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    Week {r.weekNumber} ({r.dateRange})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">vs.</span>
              <select
                id="select-secondary-week"
                value={secondaryWeekId}
                onChange={(e) => setSecondaryWeekId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-500"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    Week {r.weekNumber} ({r.dateRange})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Side-by-Side Quick Comparison Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {/* Total Account Views Diff */}
          <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Account Views
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold text-stone-900">
                  {primaryReport.executiveSummary.grandCombinedViewsFormatted}
                </span>
                <span className="text-xs text-stone-400 block">
                  vs {secondaryReport.executiveSummary.grandCombinedViewsFormatted} (W{secondaryReport.weekNumber})
                </span>
              </div>
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                  viewsDiffPercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {viewsDiffPercent >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {formatPercent(viewsDiffPercent)}
              </span>
            </div>
          </div>

          {/* New Engine Views Diff */}
          <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              New Content Views
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold text-stone-900">
                  {formatNumber(primaryReport.newEngine.totalNewViews)}
                </span>
                <span className="text-xs text-stone-400 block">
                  vs {formatNumber(secondaryReport.newEngine.totalNewViews)} (W{secondaryReport.weekNumber})
                </span>
              </div>
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                  newViewsDiffPercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {newViewsDiffPercent >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {formatPercent(newViewsDiffPercent)}
              </span>
            </div>
          </div>

          {/* Median Views Benchmark */}
          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-300">
            <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider flex items-center justify-between">
              <span>Median Baseline Views</span>
              <span className="text-[9px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.2 rounded">Core Metric</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold text-stone-900">
                  {primaryReport.newEngine.medianViewsPerPost.toLocaleString()}
                </span>
                <span className="text-xs text-amber-900/70 block">
                  vs {secondaryReport.newEngine.medianViewsPerPost.toLocaleString()} (W{secondaryReport.weekNumber})
                </span>
              </div>
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                  medianDiffPercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {medianDiffPercent >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {formatPercent(medianDiffPercent)}
              </span>
            </div>
          </div>

          {/* Watch Time Diff */}
          <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Watch Time
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold text-stone-900">
                  {primaryReport.engagementAndRetention.totalWatchTimeHours} hrs
                </span>
                <span className="text-xs text-stone-400 block">
                  vs {secondaryReport.engagementAndRetention.totalWatchTimeHours} hrs (W{secondaryReport.weekNumber})
                </span>
              </div>
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                  watchTimeDiff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {watchTimeDiff >= 0 ? '+' : ''}{watchTimeDiff.toFixed(1)} hrs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Rising Baseline Performance Tracker (Ahmed's Focus) */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-stone-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Creative Baseline Growth Tracker (Median vs Average Views / Post)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Demonstrates lifting typical non-viral performance over time (excluding outlier viral skew)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span>Median Views (Benchmark)</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span>Average Views</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="medianViews"
                name="Median Views / Post"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="avgViews"
                name="Average Views / Post"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Evergreen Engine vs New Creative Output (Stacked Views) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="pb-3 mb-4 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Evergreen vs. New Content Views Trajectory</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Separating circulating legacy momentum from freshly published batch views
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => formatNumber(val)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: '1px solid #44403c',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="evergreenViews" name="Evergreen Legacy Views" fill="#10b981" stackId="a" />
                <Bar dataKey="newViews" name="New Batch Views" fill="#3b82f6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Platform Share Trajectory */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="pb-3 mb-4 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>Platform Views Evolution (FB vs IG vs TikTok)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Tracking channel distribution shifts and viral momentum
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => formatNumber(val)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: '1px solid #44403c',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="igViews" name="Instagram Reels" fill="#f43f5e" stroke="#e11d48" fillOpacity={0.2} />
                <Area type="monotone" dataKey="fbViews" name="Facebook Reels" fill="#3b82f6" stroke="#2563eb" fillOpacity={0.2} />
                <Area type="monotone" dataKey="ttViews" name="TikTok Posts" fill="#71717a" stroke="#18181b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

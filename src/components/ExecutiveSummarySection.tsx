import React from 'react';
import { WeeklyReport } from '../types';
import { TrendingUp, TrendingDown, Eye, Layers, Compass, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatNumber, formatPercent, getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const ExecutiveSummarySection: React.FC<Props> = ({ report }) => {
  const { executiveSummary, newEngine, evergreenEngine } = report;

  return (
    <section id="section-executive-summary" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm scroll-mt-48">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight">
              1. Executive Summary & Campaign Snapshot
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Grand combined metrics across Facebook, Instagram, and TikTok for Week {report.weekNumber} ({report.dateRange})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            63 Scheduled Target (21/Platform)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
            100% On-Time Cadence
          </span>
        </div>
      </div>

      {/* Hero Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
        {/* Total Grand Combined Views */}
        <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Total Weekly Views
            </span>
            <div className="p-1.5 rounded-md bg-stone-200 text-stone-800">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {executiveSummary.grandCombinedViewsFormatted}
            </span>
            <span
              className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
                executiveSummary.wowChangePercent >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {executiveSummary.wowChangePercent >= 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {formatPercent(executiveSummary.wowChangePercent)} WoW
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            New & evergreen legacy views combined across all 3 channels
          </p>
        </div>

        {/* New Engine (Weekly Batch Views) */}
        <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              New Content Views
            </span>
            <div className="p-1.5 rounded-md bg-stone-200 text-stone-800">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {formatNumber(newEngine.totalNewViews)}
            </span>
            {newEngine.viewsWowChangePercent !== 0 && (
              <span className="inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {formatPercent(newEngine.viewsWowChangePercent)} WoW
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Isolated resonance of posts published specifically this week
          </p>
        </div>

        {/* Median Baseline Views */}
        <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Median Baseline / Post
            </span>
            <div className="p-1.5 rounded-md bg-stone-200 text-stone-800">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {newEngine.medianViewsPerPost.toLocaleString()}
            </span>
            {newEngine.medianViewsWowChangePercent > 0 && (
              <span className="inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {formatPercent(newEngine.medianViewsWowChangePercent)} WoW
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            True non-viral creative baseline (Core health benchmark)
          </p>
        </div>

        {/* Total Watch Time */}
        <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Cumulative Watch Time
            </span>
            <div className="p-1.5 rounded-md bg-stone-200 text-stone-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {report.engagementAndRetention.totalWatchTimeHours} hrs
            </span>
            <span className="text-xs text-stone-500 font-medium">
              ({report.engagementAndRetention.avgWatchTimeSeconds}s avg)
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Audience attention captured across FB, IG, and TikTok
          </p>
        </div>
      </div>

      {/* Platform Comparison Table & Key Strategic Shift */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        {/* Platform Breakdown Cards */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Platform Views Week-over-Week Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {executiveSummary.platformViewsComparison.map((p) => {
              const badge = getPlatformBadgeColor(p.platform);
              const isPositive = p.wowChangePercent >= 0;
              return (
                <div
                  key={p.platform}
                  id={`platform-card-${p.platform.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.platform}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center ${
                        isPositive ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                      )}
                      {formatPercent(p.wowChangePercent)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-lg font-bold text-stone-900">
                      {formatNumber(p.currWeekViews)}
                    </div>
                    <div className="text-[11px] text-stone-500 flex justify-between mt-0.5">
                      <span>Prev: {formatNumber(p.prevWeekViews)}</span>
                      <span className="text-[10px] text-stone-400">{p.source}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
            {executiveSummary.summaryText}
          </div>
        </div>

        {/* Key Strategic Shift Box */}
        <div className="rounded-lg bg-stone-50 border border-stone-300 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-stone-700" />
              <span>Key Strategic Shift</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed font-normal">
              {executiveSummary.keyStrategicShift}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-700">
            <span>Evergreen Share: <strong>{evergreenEngine.evergreenSharePercent}%</strong></span>
            <span>New Batch: <strong>{100 - Math.round(evergreenEngine.evergreenSharePercent)}%</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};

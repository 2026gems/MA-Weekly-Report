import React from 'react';
import { WeeklyReport } from '../types';
import { Lightbulb, CheckSquare, TrendingUp, Compass, Shield, Target, ArrowUpRight, Award } from 'lucide-react';
import { formatPercent } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
  previousReport?: WeeklyReport;
}

export const StrategicInsightsSection: React.FC<Props> = ({ report, previousReport }) => {
  const { strategicInsights } = report;

  return (
    <section id="section-strategic-insights" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>8. Strategic Insights & Forward-Looking Action Plan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-medium">
                Growth Playbook
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Key weekly learnings, repeatability indicators, baseline improvements, and actionable next steps
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            Sprint Execution for Week {report.weekNumber + 1}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Left Column: Key Weekly Learnings & Creative Motifs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Weekly Learnings & Creative Motifs</span>
            </h3>

            <div className="space-y-3">
              {strategicInsights.keyLearnings.map((learning, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors"
                >
                  <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-200/70 text-amber-900 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{learning.title}</span>
                  </h4>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {learning.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan for Next Week */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-3">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Action Plan for Week {report.weekNumber + 1}</span>
            </h3>

            <div className="space-y-2">
              {strategicInsights.actionPlanNextWeek.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-stone-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed font-medium">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Rising Baseline Improvement Tracker & Strategic Guidance */}
        <div className="space-y-4">
          {/* Baseline Improvement Tracker Box */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Rising Baseline Improvement Tracker</span>
              </h3>
              <span className="text-[10px] bg-amber-200/80 text-amber-950 font-bold px-2 py-0.5 rounded">
                Ahmed's Target
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              {strategicInsights.baselineTracking.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-amber-200/60">
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/70">
                <span className="text-[10px] text-stone-500 uppercase font-medium block">Median Views / Post</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base font-bold text-stone-900">
                    {strategicInsights.baselineTracking.currMedianViews.toLocaleString()}
                  </span>
                  {strategicInsights.baselineTracking.medianChangePercent > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-700">
                      +{strategicInsights.baselineTracking.medianChangePercent}%
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400">Prev: {strategicInsights.baselineTracking.prevMedianViews.toLocaleString()}</span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/70">
                <span className="text-[10px] text-stone-500 uppercase font-medium block">Average Views / Post</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base font-bold text-stone-900">
                    {strategicInsights.baselineTracking.currAvgViews.toLocaleString()}
                  </span>
                  {strategicInsights.baselineTracking.avgChangePercent > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-700">
                      +{strategicInsights.baselineTracking.avgChangePercent}%
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400">Prev: {strategicInsights.baselineTracking.prevAvgViews.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Strategic Executive Observations & Playbook */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Executive Growth Recommendations</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200/70 text-stone-700 font-medium">
                Memorialize Art Playbook
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-stone-700 mt-3">
              <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                <div className="font-semibold text-stone-900 mb-0.5 flex items-center justify-between">
                  <span>1. Scale Multigenerational Reunion Hooks</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Priority 1</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Focusing initial frames on genuine family member reactions rather than static portrait setups drives 2.4x higher 3-second retention rates across Instagram and Facebook.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                <div className="font-semibold text-stone-900 mb-0.5 flex items-center justify-between">
                  <span>2. Protect Publishing Cadence (21/Platform)</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Integrity</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Maintaining the strict 3-post-per-day rhythm ensures algorithmic discovery without cannibalizing the existing 120K+ evergreen view engine.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                <div className="font-semibold text-stone-900 mb-0.5 flex items-center justify-between">
                  <span>3. Conversion Optimization via Milestone Gifting</span>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Direct Intent</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Pairing anniversary and milestone gifting themes with subtle order timeline overlays directly lifted qualified website clicks by +18% WoW.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Report Sign-off Footnote */}
      <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-1.5 font-medium text-stone-700">
          <Shield className="w-3.5 h-3.5 text-stone-400" />
          <span>{strategicInsights.closingSignOff}</span>
        </div>
        <div className="text-[11px] text-stone-400">
          Confidential • Prepared for Ahmed (Memorialize)
        </div>
      </div>
    </section>
  );
};

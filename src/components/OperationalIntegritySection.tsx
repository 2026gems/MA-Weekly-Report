import React from 'react';
import { WeeklyReport } from '../types';
import { CheckCircle2, AlertCircle, CalendarCheck, ShieldCheck } from 'lucide-react';
import { getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const OperationalIntegritySection: React.FC<Props> = ({ report }) => {
  const { operationalIntegrity } = report;

  return (
    <section id="section-operational-integrity" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>7. Operational & Posting Integrity Log</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium">
                {operationalIntegrity.operationalStatus}
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Log comparing scheduled target (21 posts per platform / 63 total) versus actually published posts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{operationalIntegrity.totalPublished}/{operationalIntegrity.totalScheduled} Posts Published</span>
          </span>
        </div>
      </div>

      {/* Narrative */}
      <div className="my-4 p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
        <CalendarCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>{operationalIntegrity.narrative}</p>
      </div>

      {/* Operational Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-600 font-semibold border-y border-stone-200">
              <th className="py-2.5 px-3">Platform</th>
              <th className="py-2.5 px-3">Scheduled Target</th>
              <th className="py-2.5 px-3">Published Posts</th>
              <th className="py-2.5 px-3">Missed Days</th>
              <th className="py-2.5 px-3">Delayed Posts</th>
              <th className="py-2.5 px-3">Operational Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {operationalIntegrity.platforms.map((p) => {
              const badge = getPlatformBadgeColor(p.platform);
              return (
                <tr key={p.platform} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.platform}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.scheduled} Posts
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-900 px-2 py-0.5 rounded bg-stone-100">
                      {p.published} Posts ({p.published}/{p.scheduled})
                    </span>
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.missedDays} Days
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.delayedPosts} Posts
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Consolidated row */}
            <tr className="bg-stone-50 font-semibold border-t-2 border-stone-200 text-stone-900">
              <td className="py-3 px-3">Consolidated Log</td>
              <td className="py-3 px-3">{operationalIntegrity.totalScheduled} Posts</td>
              <td className="py-3 px-3">{operationalIntegrity.totalPublished} Posts (100%)</td>
              <td className="py-3 px-3">{operationalIntegrity.missedDays} Days</td>
              <td className="py-3 px-3">{operationalIntegrity.delayedPosts} Posts</td>
              <td className="py-3 px-3 text-emerald-700 font-bold">{operationalIntegrity.operationalStatus}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Transparency Note */}
      {operationalIntegrity.transparencyNote && (
        <div className="mt-4 p-3 rounded-lg bg-stone-50/70 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-800 font-semibold">Transparency & Verification Note:</strong>{' '}
            {operationalIntegrity.transparencyNote}
          </div>
        </div>
      )}
    </section>
  );
};

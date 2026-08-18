import React, { useEffect, useState } from 'react';
import { ActiveTab, WeeklyReport } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  UploadCloud, 
  Printer, 
  Calendar, 
  Trash2,
  Plus
} from 'lucide-react';

interface HeaderProps {
  reports: WeeklyReport[];
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenUploadModal: () => void;
  onOpenEditorModal: () => void;
  onDeleteReport: (reportId: string) => void;
}

const DASHBOARD_SECTIONS = [
  { id: 'section-executive-summary', label: '1. Executive Summary' },
  { id: 'section-evergreen-engine', label: '2. Evergreen Engine' },
  { id: 'section-new-engine', label: '3. New Engine' },
  { id: 'section-top-content', label: '4. Top Content' },
  { id: 'section-retention-trackers', label: '5. Retention Trackers' },
  { id: 'section-emotional-themes', label: '6. Emotional Themes' },
  { id: 'section-operational-integrity', label: '7. Integrity Log' },
  { id: 'section-strategic-insights', label: '8. Strategic Insights' },
];

export const Header: React.FC<HeaderProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  activeTab,
  onTabChange,
  onOpenUploadModal,
  onOpenEditorModal,
  onDeleteReport,
}) => {
  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0];
  const sortedReports = [...reports].sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));

  const [activeSectionId, setActiveSectionId] = useState<string>('section-executive-summary');

  // Track active section on scroll
  useEffect(() => {
    if (activeTab !== 'dashboard') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (const section of DASHBOARD_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSectionId(sectionId);
    }
  };

  return (
    <header id="main-header" className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      {/* Top Brand & Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-950 font-bold text-sm tracking-tight shadow-sm shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Memorialize Art
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-medium">
                  Social Intelligence Dashboard
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Weekly Performance Reports • Prepared by <span className="text-stone-200 font-semibold">MOAE Digitals</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Import PDF & Edit */}
          <div className="flex items-center gap-2">
            <button
              id="import-pdf-header-btn"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-white text-stone-950 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              title="Import PDF Report or Raw Analytics"
            >
              <UploadCloud className="w-3.5 h-3.5 text-stone-900" />
              <span>+ Import PDF Report</span>
            </button>

            {currentReport && (
              <>
                <button
                  id="edit-report-header-btn"
                  onClick={onOpenEditorModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium transition-colors cursor-pointer"
                  title="Edit Current Week Metrics"
                >
                  <span>Edit Metrics</span>
                </button>

                <button
                  id="delete-report-header-btn"
                  onClick={() => onDeleteReport(currentReport.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-stone-400 border border-stone-700 hover:border-rose-800 text-xs font-medium transition-colors cursor-pointer"
                  title={`Delete Week ${currentReport.weekNumber} Report`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete Week {currentReport.weekNumber}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Horizontally Scrollable Week Tabs */}
        <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 w-full">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
              Select Week:
            </span>

            {sortedReports.map((report) => {
              const isSelected = report.id === selectedReportId;
              return (
                <button
                  key={report.id}
                  id={`week-btn-${report.id}`}
                  onClick={() => onSelectReport(report.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-stone-100 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700 border border-stone-700/60'
                  }`}
                >
                  Week {report.weekNumber}
                </button>
              );
            })}

            <button
              onClick={onOpenUploadModal}
              className="px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 whitespace-nowrap bg-stone-800/40 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-dashed border-stone-700 flex items-center gap-1 cursor-pointer"
              title="Add a new week"
            >
              <Plus className="w-3 h-3" />
              <span>New Week</span>
            </button>
          </div>

          {currentReport && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-stone-400 shrink-0">
              <span className="flex items-center gap-1 text-stone-300">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span className="font-semibold text-white">Week {currentReport.weekNumber}</span> ({currentReport.dateRange})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main View Navigation Tabs */}
      <div className="bg-stone-950 border-t border-stone-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto py-1.5 scrollbar-none">
          <button
            id="tab-dashboard"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-stone-800 text-white font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-stone-300" />
            <span>Weekly Dashboard</span>
          </button>

          <button
            id="tab-comparison"
            onClick={() => onTabChange('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-stone-800 text-white font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-stone-300" />
            <span>Growth & Performance Comparison</span>
          </button>

          <button
            id="tab-themes"
            onClick={() => onTabChange('themes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-stone-800 text-white font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-stone-300" />
            <span>Emotional Themes Matrix</span>
          </button>

          <button
            id="tab-upload"
            onClick={() => onTabChange('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-stone-800 text-white font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-stone-300" />
            <span>Import PDF Report</span>
          </button>

          <button
            id="tab-export"
            onClick={() => onTabChange('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'bg-stone-800 text-white font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-stone-300" />
            <span>Export & PDF View</span>
          </button>
        </div>
      </div>

      {/* Pinned Section Navigation Bar (Permanently pinned when scrolling the dashboard) */}
      {activeTab === 'dashboard' && currentReport && (
        <div id="pinned-sections-navbar" className="bg-stone-900/95 backdrop-blur-md border-t border-stone-800/80 px-4 sm:px-6 lg:px-8 py-1.5 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 w-full">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1.5 flex items-center gap-1">
                <span>Pinned Sections:</span>
              </span>

              {DASHBOARD_SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    id={`pin-nav-${sec.id}`}
                    onClick={() => scrollToSection(sec.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white text-stone-950 font-bold shadow-xs'
                        : 'bg-stone-800/70 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

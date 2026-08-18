import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_REPORTS } from './data/mockReports';
import { WeeklyReport, ActiveTab, EvergreenPlatformData, NewEnginePlatformData, PlatformComparison } from './types';
import { Header } from './components/Header';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { EvergreenEngineSection } from './components/EvergreenEngineSection';
import { NewEngineSection } from './components/NewEngineSection';
import { TopPerformingSection } from './components/TopPerformingSection';
import { RetentionTrackerSection } from './components/RetentionTrackerSection';
import { EmotionalThemesSection } from './components/EmotionalThemesSection';
import { OperationalIntegritySection } from './components/OperationalIntegritySection';
import { StrategicInsightsSection } from './components/StrategicInsightsSection';
import { ComparisonView } from './components/ComparisonView';
import { UploadView } from './components/UploadView';
import { ReportEditorModal } from './components/ReportEditorModal';
import { QuickEditFloatingBar } from './components/QuickEditFloatingBar';
import { 
  Printer, 
  Layers, 
  UploadCloud,
  CheckCircle,
  ExternalLink,
  Edit3,
  Sparkles
} from 'lucide-react';
import { formatNumber, formatPercent } from './utils/formatters';
import { recomputeReport } from './utils/recomputeReport';
import { 
  subscribeToWeeklyReports, 
  saveReportToFirestore, 
  deleteReportFromFirestore, 
  seedInitialReportsIfEmpty 
} from './lib/firebase';

const STORAGE_KEY = 'memorialize_weekly_reports_v2';

export default function App() {
  const [reports, setReports] = useState<WeeklyReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));
        }
      }
    } catch (e) {
      console.warn('Could not load reports from localStorage', e);
    }
    return [...INITIAL_REPORTS].sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));
  });

  const [selectedReportId, setSelectedReportId] = useState<string>(() => {
    return reports[0]?.id || 'week-4';
  });
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Quick Edit Mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isRecomputing, setIsRecomputing] = useState<boolean>(false);
  const [recomputeNotice, setRecomputeNotice] = useState<string | null>(null);
  
  // Snapshot for discarding edits
  const originalReportRef = useRef<WeeklyReport | null>(null);
  const recomputeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Firestore subscription and seed if empty
  useEffect(() => {
    seedInitialReportsIfEmpty(INITIAL_REPORTS);

    const unsubscribe = subscribeToWeeklyReports(
      (cloudReports) => {
        if (cloudReports && cloudReports.length > 0) {
          // If the user is currently editing, don't clobber active draft unless they haven't made unsaved changes
          setReports((prev) => {
            if (isEditMode && hasUnsavedChanges) {
              return prev;
            }
            return cloudReports;
          });
          setIsCloudSynced(true);
          setSelectedReportId((currentId) => {
            const exists = cloudReports.some((r) => r.id === currentId);
            return exists ? currentId : cloudReports[0].id;
          });
        }
      },
      (error) => {
        console.warn('Using local fallback due to Firestore sync issue:', error);
      }
    );

    return () => unsubscribe();
  }, [isEditMode, hasUnsavedChanges]);

  // Sort descending by weekNumber so most recent week is always first
  const sortedReports = [...reports].sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));

  // Sync to local storage as fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedReports));
    } catch (e) {
      console.warn('Could not save reports to localStorage', e);
    }
  }, [sortedReports]);

  // Current active report
  const currentReport = sortedReports.find((r) => r.id === selectedReportId) || sortedReports[0];
  
  // Previous report for WoW comparisons
  const previousReport = currentReport ? sortedReports.find((r) => r.weekNumber === currentReport.weekNumber - 1) : undefined;

  // Store original report when entering edit mode
  const handleToggleEditMode = () => {
    if (!isEditMode && currentReport) {
      originalReportRef.current = JSON.parse(JSON.stringify(currentReport));
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      setHasUnsavedChanges(false);
      setRecomputeNotice(null);
    }
  };

  // Helper to schedule a debounced recomputation of the current report
  const scheduleRecompute = useCallback((draftReport: WeeklyReport) => {
    setHasUnsavedChanges(true);
    setIsRecomputing(true);

    if (recomputeTimerRef.current) {
      clearTimeout(recomputeTimerRef.current);
    }

    recomputeTimerRef.current = setTimeout(() => {
      const recomputed = recomputeReport(draftReport);
      setReports((prev) =>
        prev.map((r) => (r.id === recomputed.id ? recomputed : r))
      );
      setIsRecomputing(false);
      setRecomputeNotice('✨ Auto-recomputed all affected totals');
      setTimeout(() => setRecomputeNotice(null), 3000);
    }, 450);
  }, []);

  // Update Evergreen Platform Data (e.g. Facebook Evergreen views, followers, visits)
  const handleUpdateEvergreenPlatform = (index: number, updatedFields: Partial<EvergreenPlatformData>) => {
    if (!currentReport) return;
    const newPlatforms = [...currentReport.evergreenEngine.platforms];
    newPlatforms[index] = {
      ...newPlatforms[index],
      ...updatedFields,
    };

    const draftReport: WeeklyReport = {
      ...currentReport,
      evergreenEngine: {
        ...currentReport.evergreenEngine,
        platforms: newPlatforms,
      },
    };

    // Update state immediately for reactive inputs
    setReports((prev) =>
      prev.map((r) => (r.id === draftReport.id ? draftReport : r))
    );

    // Schedule debounced formula recomputation
    scheduleRecompute(draftReport);
  };

  // Update Evergreen Narrative
  const handleUpdateEvergreenNarrative = (narrative: string) => {
    if (!currentReport) return;
    const draftReport: WeeklyReport = {
      ...currentReport,
      evergreenEngine: {
        ...currentReport.evergreenEngine,
        narrative,
      },
    };
    setReports((prev) =>
      prev.map((r) => (r.id === draftReport.id ? draftReport : r))
    );
    setHasUnsavedChanges(true);
  };

  // Update New Engine Platform Data
  const handleUpdateNewEnginePlatform = (index: number, updatedFields: Partial<NewEnginePlatformData>) => {
    if (!currentReport) return;
    const newPlatforms = [...currentReport.newEngine.platforms];
    newPlatforms[index] = {
      ...newPlatforms[index],
      ...updatedFields,
    };

    const draftReport: WeeklyReport = {
      ...currentReport,
      newEngine: {
        ...currentReport.newEngine,
        platforms: newPlatforms,
      },
    };

    setReports((prev) =>
      prev.map((r) => (r.id === draftReport.id ? draftReport : r))
    );

    scheduleRecompute(draftReport);
  };

  // Update New Engine Narrative
  const handleUpdateNewEngineNarrative = (narrative: string) => {
    if (!currentReport) return;
    const draftReport: WeeklyReport = {
      ...currentReport,
      newEngine: {
        ...currentReport.newEngine,
        narrative,
      },
    };
    setReports((prev) =>
      prev.map((r) => (r.id === draftReport.id ? draftReport : r))
    );
    setHasUnsavedChanges(true);
  };

  // Update Executive Summary Fields
  const handleUpdateExecutiveSummary = (updatedFields: Partial<WeeklyReport['executiveSummary']>) => {
    if (!currentReport) return;
    const draftReport: WeeklyReport = {
      ...currentReport,
      executiveSummary: {
        ...currentReport.executiveSummary,
        ...updatedFields,
      },
    };
    setReports((prev) =>
      prev.map((r) => (r.id === draftReport.id ? draftReport : r))
    );
    scheduleRecompute(draftReport);
  };

  // Update Platform Comparison
  const handleUpdatePlatformComparison = (index: number, updatedFields: Partial<PlatformComparison>) => {
    if (!currentReport) return;
    const newComps = [...currentReport.executiveSummary.platformComparisons];
    newComps[index] = {
      ...newComps[index],
      ...updatedFields,
    };
    const draftReport: WeeklyReport = {
      ...currentReport,
      executiveSummary: {
        ...currentReport.executiveSummary,
        platformComparisons: newComps,
      },
    };
    setReports((prev) =>
      prev.map((r) => (r.id === draftReport.id ? draftReport : r))
    );
    scheduleRecompute(draftReport);
  };

  // Save current report from inline Quick Edit to Cloud Firestore
  const handleSaveQuickEdits = async () => {
    if (!currentReport) return;
    const finalReport = recomputeReport(currentReport);
    
    // Save to local and Firestore
    await handleSaveReport(finalReport);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    originalReportRef.current = null;
    setRecomputeNotice('Changes saved and synced to cloud database!');
    setTimeout(() => setRecomputeNotice(null), 3000);
  };

  // Discard inline edits and revert back to snapshot
  const handleDiscardQuickEdits = () => {
    if (originalReportRef.current) {
      const restored = originalReportRef.current;
      setReports((prev) =>
        prev.map((r) => (r.id === restored.id ? restored : r))
      );
    }
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setRecomputeNotice(null);
  };

  // Force immediate recomputation
  const handleForceRecompute = () => {
    if (!currentReport) return;
    const recomputed = recomputeReport(currentReport);
    setReports((prev) =>
      prev.map((r) => (r.id === recomputed.id ? recomputed : r))
    );
    setRecomputeNotice('✓ Metrics recalculated with exact formulas');
    setTimeout(() => setRecomputeNotice(null), 2500);
  };

  // Handle saving an updated or newly imported report to Cloud Firestore
  const handleSaveReport = async (reportToSave: WeeklyReport) => {
    const recomputed = recomputeReport(reportToSave);

    // Optimistic local update
    setReports((prevReports) => {
      const existingIdx = prevReports.findIndex((r) => r.id === recomputed.id || r.weekNumber === recomputed.weekNumber);
      let updated: WeeklyReport[];
      if (existingIdx >= 0) {
        updated = [...prevReports];
        updated[existingIdx] = recomputed;
      } else {
        updated = [recomputed, ...prevReports];
      }
      return updated.sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));
    });
    setSelectedReportId(recomputed.id);
    setActiveTab('dashboard');

    // Save to Cloud Firestore
    try {
      await saveReportToFirestore(recomputed);
    } catch (err) {
      console.error('Failed to sync report to Firestore:', err);
    }
  };

  // Handle deleting a whole report from Cloud Firestore
  const handleDeleteReport = async (reportId: string) => {
    const reportToDelete = reports.find((r) => r.id === reportId);
    const confirmMessage = reportToDelete 
      ? `Are you sure you want to delete Week ${reportToDelete.weekNumber} report? You can re-import a PDF to regenerate it anytime.`
      : 'Are you sure you want to delete this report?';

    if (window.confirm(confirmMessage)) {
      setReports((prevReports) => {
        const filtered = prevReports.filter((r) => r.id !== reportId);
        if (filtered.length > 0) {
          const nextSelected = filtered.sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0))[0];
          setSelectedReportId(nextSelected.id);
        } else {
          setSelectedReportId('');
        }
        return filtered;
      });

      try {
        await deleteReportFromFirestore(reportId);
      } catch (err) {
        console.error('Failed to delete report from Firestore:', err);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Sticky Clean Header with Quick Edit Controls */}
      <Header
        reports={sortedReports}
        selectedReportId={selectedReportId}
        onSelectReport={(id) => setSelectedReportId(id)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenUploadModal={() => setActiveTab('upload')}
        onOpenEditorModal={() => setIsEditorModalOpen(true)}
        onDeleteReport={handleDeleteReport}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        isRecomputing={isRecomputing}
        recomputeNotice={recomputeNotice}
        onSaveChanges={handleSaveQuickEdits}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        {/* If no reports exist */}
        {sortedReports.length === 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-sm space-y-4">
            <UploadCloud className="w-12 h-12 text-stone-400 mx-auto" />
            <h2 className="text-lg font-bold text-stone-900">No Weekly Reports Found</h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              You can import a PDF report or raw notes to generate a full weekly performance dashboard.
            </p>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              + Import PDF Report
            </button>
          </div>
        )}

        {/* TAB 1: Weekly Dashboard View */}
        {activeTab === 'dashboard' && currentReport && (
          <div className="space-y-6 animate-fadeIn">
            {/* Report Top Meta & Sync Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm">Week {currentReport.weekNumber} Executive Dashboard</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-medium">{currentReport.dateRange}</span>
                {isEditMode && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    <Edit3 className="w-3 h-3" />
                    <span>Quick Edit Enabled</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://MOAEdigitals.github.io/MA-Weekly-Report/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 font-medium px-2 py-0.5 rounded bg-stone-50 border border-stone-200 transition-colors"
                  title="Official Report Repository Link"
                >
                  <span>MOAEdigitals.github.io/MA-Weekly-Report</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>

                {isCloudSynced && (
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium shrink-0 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Cloud Database Synced</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <ExecutiveSummarySection 
              report={currentReport} 
              isEditMode={isEditMode}
              onToggleEditMode={handleToggleEditMode}
              onUpdateExecutiveSummary={handleUpdateExecutiveSummary}
              onUpdatePlatformComparison={handleUpdatePlatformComparison}
            />

            {/* Section 2: Evergreen Engine */}
            <EvergreenEngineSection 
              report={currentReport} 
              isEditMode={isEditMode}
              onToggleEditMode={handleToggleEditMode}
              onUpdateEvergreenPlatform={handleUpdateEvergreenPlatform}
              onUpdateNarrative={handleUpdateEvergreenNarrative}
            />

            {/* Section 3: New Engine */}
            <NewEngineSection 
              report={currentReport} 
              isEditMode={isEditMode}
              onToggleEditMode={handleToggleEditMode}
              onUpdateNewEnginePlatform={handleUpdateNewEnginePlatform}
              onUpdateNarrative={handleUpdateNewEngineNarrative}
            />

            {/* Section 4: Top Performing Content */}
            <TopPerformingSection report={currentReport} />

            {/* Section 5: Retention & Engagement */}
            <RetentionTrackerSection report={currentReport} />

            {/* Section 6: Emotional Themes Matrix */}
            <EmotionalThemesSection report={currentReport} />

            {/* Section 7: Operational Integrity Log */}
            <OperationalIntegritySection report={currentReport} />

            {/* Section 8: Strategic Insights */}
            <StrategicInsightsSection report={currentReport} previousReport={previousReport} />
          </div>
        )}

        {/* TAB 2: Multi-Week Growth & Comparison View */}
        {activeTab === 'comparison' && sortedReports.length > 0 && (
          <div className="animate-fadeIn">
            <ComparisonView reports={sortedReports} selectedReportId={selectedReportId} />
          </div>
        )}

        {/* TAB 3: Emotional Themes Deep Dive */}
        {activeTab === 'themes' && currentReport && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
              <div className="pb-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-stone-700" />
                    <span>Emotional Themes Matrix Analysis — Week {currentReport.weekNumber}</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Quantifying audience response across core narrative categories to inform next week's creative production
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-800 rounded-md border border-stone-200">
                  {currentReport.emotionalThemesMatrix.consolidated.postVolume} Total Posts Categorized
                </span>
              </div>
            </div>

            <EmotionalThemesSection report={currentReport} />

            {/* Cross-Week Theme Insights Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                Key Thematic Takeaways:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">1. Grandparent & Multigenerational Core</div>
                  <p className="text-stone-600 leading-relaxed">
                    Continues to deliver the highest watch time and shares per post. Visualizing 3 generations (child, mother, late grandparent) acts as the strongest emotional anchor.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">2. Milestone Gifting (High Intent)</div>
                  <p className="text-stone-600 leading-relaxed">
                    Drives disproportionate website click-throughs and saves. Excellent format for lower-funnel custom portrait orders.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">3. Loss & Reunification Narrative</div>
                  <p className="text-stone-600 leading-relaxed">
                    Strongest average watch time (16s+) on Facebook. Requires authentic opening video footage within the first 2 seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Upload & Import Data */}
        {activeTab === 'upload' && (
          <div className="animate-fadeIn">
            <UploadView
              existingReports={sortedReports}
              onSaveReport={handleSaveReport}
              onCancel={() => setActiveTab('dashboard')}
            />
          </div>
        )}

        {/* TAB 5: Clean Print / PDF Executive Briefing View */}
        {activeTab === 'export' && currentReport && (
          <div className="space-y-6 animate-fadeIn">
            {/* Export Toolbar */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-stone-900">
                  Executive Briefing Document (Week {currentReport.weekNumber})
                </h2>
                <p className="text-xs text-stone-500">
                  Clean, print-ready document formatted strictly for executive presentation.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="print-briefing-btn"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>

            {/* Formatted Executive Paper Document */}
            <div className="bg-white rounded-2xl border border-stone-300 p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none">
              {/* Document Header */}
              <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-bold tracking-widest text-stone-600 uppercase mb-1">
                    EXECUTIVE PERFORMANCE REPORT
                  </div>
                  <h1 className="text-2xl font-bold text-stone-950 tracking-tight">
                    Memorialize Art — Social Performance Intelligence
                  </h1>
                  <p className="text-xs text-stone-600 mt-1">
                    Week {currentReport.weekNumber} Consolidated Report ({currentReport.dateRange})
                  </p>
                </div>

                <div className="text-right text-xs text-stone-600">
                  <div>Prepared by: <strong className="text-stone-900">MOAE Digitals</strong></div>
                  <div>Status: <span className="text-emerald-700 font-semibold">{currentReport.operationalIntegrity.operationalStatus}</span></div>
                </div>
              </div>

              {/* High-Level Overview */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                  1. Executive Summary & Key Results
                </h2>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {currentReport.executiveSummary.summaryText}
                </p>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800">
                  <strong>Key Strategic Shift:</strong> {currentReport.executiveSummary.keyStrategicShift}
                </div>
              </div>

              {/* Core Health Metrics Grid */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                  2. Core Health Metrics (New vs. Evergreen)
                </h2>
                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 border border-stone-200 rounded-lg bg-stone-50">
                    <span className="text-[10px] text-stone-500 uppercase font-medium block">Total Account Views</span>
                    <span className="text-lg font-bold text-stone-950 mt-1 block">
                      {currentReport.executiveSummary.grandCombinedViewsFormatted}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {formatPercent(currentReport.executiveSummary.wowChangePercent)} WoW
                    </span>
                  </div>

                  <div className="p-3 border border-stone-200 rounded-lg bg-stone-50">
                    <span className="text-[10px] text-stone-500 uppercase font-medium block">New Content Views</span>
                    <span className="text-lg font-bold text-stone-950 mt-1 block">
                      {formatNumber(currentReport.newEngine.totalNewViews)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      +{currentReport.newEngine.viewsWowChangePercent}% WoW
                    </span>
                  </div>

                  <div className="p-3 border border-stone-300 rounded-lg bg-stone-100">
                    <span className="text-[10px] text-stone-800 uppercase font-bold block">Median Baseline</span>
                    <span className="text-lg font-bold text-stone-950 mt-1 block">
                      {currentReport.newEngine.medianViewsPerPost.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-600 font-medium">Core Benchmark</span>
                  </div>

                  <div className="p-3 border border-stone-200 rounded-lg bg-stone-50">
                    <span className="text-[10px] text-stone-500 uppercase font-medium block">Total Watch Time</span>
                    <span className="text-lg font-bold text-stone-950 mt-1 block">
                      {currentReport.engagementAndRetention.totalWatchTimeHours} hrs
                    </span>
                    <span className="text-[10px] text-stone-500">Across all channels</span>
                  </div>
                </div>
              </div>

              {/* Thematic Matrix Breakdown */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                  3. Emotional Themes Matrix
                </h2>
                <table className="w-full text-left text-xs border-collapse border border-stone-200">
                  <thead className="bg-stone-100 text-stone-700">
                    <tr>
                      <th className="p-2 border border-stone-200">Narrative Theme</th>
                      <th className="p-2 border border-stone-200 text-center">Posts</th>
                      <th className="p-2 border border-stone-200">Total Views</th>
                      <th className="p-2 border border-stone-200">Share of New Views</th>
                      <th className="p-2 border border-stone-200">Watch Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReport.emotionalThemesMatrix.themes.map((t) => (
                      <tr key={t.themeName} className="border-b border-stone-200">
                        <td className="p-2 font-medium">{t.themeName}</td>
                        <td className="p-2 text-center">{t.postVolume}</td>
                        <td className="p-2 font-semibold">{t.totalViews.toLocaleString()}</td>
                        <td className="p-2">{t.shareOfNewViewsPercent}%</td>
                        <td className="p-2">{t.watchTimeHours} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Strategic Next Steps */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                  4. Action Plan for Week {currentReport.weekNumber + 1}
                </h2>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {currentReport.strategicInsights.actionPlanNextWeek.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-stone-900">•</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign-off */}
              <div className="pt-6 border-t-2 border-stone-900 flex justify-between items-center text-xs text-stone-600">
                <div className="font-semibold text-stone-900">
                  {currentReport.strategicInsights.closingSignOff}
                </div>
                <div>Memorialize Art Weekly Intelligence • MOAE Digitals</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar for Quick Edit Mode */}
      <QuickEditFloatingBar
        isEditMode={isEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        isRecomputing={isRecomputing}
        recomputeNotice={recomputeNotice}
        weekNumber={currentReport?.weekNumber || 4}
        onSaveChanges={handleSaveQuickEdits}
        onDiscardChanges={handleDiscardQuickEdits}
        onForceRecompute={handleForceRecompute}
        onToggleEditMode={handleToggleEditMode}
      />

      {/* Live Metric Editor Modal */}
      {isEditorModalOpen && currentReport && (
        <ReportEditorModal
          report={currentReport}
          onSave={handleSaveReport}
          onClose={() => setIsEditorModalOpen(false)}
        />
      )}
    </div>
  );
}

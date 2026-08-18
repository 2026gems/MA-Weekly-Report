import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { WeeklyReport } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

// Test connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'weeklyReports', 'connection-check'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline.');
    }
    return false;
  }
}

const REPORTS_COLLECTION = 'weeklyReports';

// Real-time listener for reports collection
export function subscribeToWeeklyReports(
  onUpdate: (reports: WeeklyReport[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = collection(db, REPORTS_COLLECTION);
    return onSnapshot(
      q,
      (snapshot) => {
        const reports: WeeklyReport[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as WeeklyReport;
          // Filter out any legacy week 1 or week 2
          if (data && data.weekNumber && data.weekNumber >= 3) {
            reports.push({
              ...data,
              id: docSnap.id,
            });
          }
        });
        // Sort descending by weekNumber (most recent week first)
        reports.sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));
        onUpdate(reports);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, REPORTS_COLLECTION);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    handleFirestoreError(err, OperationType.LIST, REPORTS_COLLECTION);
    if (onError) onError(err);
    return () => {};
  }
}

// Save or update a single weekly report in Cloud Firestore
export async function saveReportToFirestore(report: WeeklyReport): Promise<void> {
  const docId = report.id || `week-${report.weekNumber}`;
  const cleanReport: WeeklyReport = {
    ...report,
    id: docId,
  };

  try {
    const docRef = doc(db, REPORTS_COLLECTION, docId);
    await setDoc(docRef, cleanReport, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${REPORTS_COLLECTION}/${docId}`);
    throw error;
  }
}

// Delete a report from Cloud Firestore
export async function deleteReportFromFirestore(reportId: string): Promise<void> {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, reportId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${REPORTS_COLLECTION}/${reportId}`);
    throw error;
  }
}

// Seed initial reports if cloud collection is currently empty, and clean up any week 1/2 docs
export async function seedInitialReportsIfEmpty(initialReports: WeeklyReport[]): Promise<void> {
  try {
    // Delete legacy week-1 and week-2 if they exist in Firestore
    try {
      await deleteDoc(doc(db, REPORTS_COLLECTION, 'week-1'));
      await deleteDoc(doc(db, REPORTS_COLLECTION, 'week-2'));
    } catch {
      // ignore
    }

    const snapshot = await getDocs(collection(db, REPORTS_COLLECTION));
    // Check if we have valid reports (week 3+)
    let hasValidReports = false;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.weekNumber >= 3) {
        hasValidReports = true;
      }
    });

    if (!hasValidReports && initialReports.length > 0) {
      console.log('Seeding initial Week 3 and Week 4 reports to Cloud Firestore...');
      for (const report of initialReports) {
        if (report.weekNumber >= 3) {
          await saveReportToFirestore(report);
        }
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, REPORTS_COLLECTION);
  }
}

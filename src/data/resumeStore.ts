// Stores uploaded resume PDFs in the browser (IndexedDB).
//
// NOTE: this app is a static site (no server), so uploaded files cannot be
// written into the project folder on the server. They are kept in the
// visitor's browser and are keyed by the candidate's identity, so a second
// upload by the same person REPLACES the earlier file.

const DB_NAME = 'daxin_hr_crm_resumes';
const STORE = 'resumes';
const VERSION = 1;

export interface StoredResume {
  key: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  blob: Blob;
}

/** Identity key so re-uploads by the same person overwrite the old file. */
export function personKey(mobile: string, email: string): string {
  const m = (mobile || '').replace(/\D/g, '').slice(-10);
  const e = (email || '').trim().toLowerCase();
  return e || m || 'unknown';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function saveResume(key: string, file: File): Promise<StoredResume> {
  const db = await openDb();
  const record: StoredResume = {
    key,
    fileName: file.name,
    fileType: file.type || 'application/pdf',
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
    blob: file
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record); // put() overwrites any existing entry for this key
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return record;
}

export async function getResume(key: string): Promise<StoredResume | undefined> {
  const db = await openDb();
  const result = await new Promise<StoredResume | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as StoredResume | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return result;
}

export async function deleteResume(key: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function openResumeInNewTab(key: string): Promise<boolean> {
  const rec = await getResume(key);
  if (!rec) return false;
  const url = URL.createObjectURL(rec.blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

/**
 * Offline-First Telemetry Caching & Sync Queue Service
 *
 * Uses IndexedDB as primary storage with LocalStorage fallback.
 * Safely queues workout logs & stopwatch sessions during network outages
 * and automatically drains to MongoDB when connectivity is restored.
 */

const DB_NAME = "fitora_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "telemetry_queue";
const LOCAL_STORAGE_KEY = "fitora_offline_telemetry_queue";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export type TelemetryQueueType = "WORKOUT_LOG" | "STOPWATCH_SESSION";

export interface OfflineQueueItem {
  id: string;
  type: TelemetryQueueType;
  payload: any;
  createdAt: string;
  attempts: number;
  lastAttemptAt?: string;
  error?: string;
}

// ── Authentication Helper ───────────────────────────────────────────────────

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    if (token) return { Authorization: `Bearer ${token}` };

    const session = localStorage.getItem("fitora_auth_session");
    if (session) {
      const parsed = JSON.parse(session);
      const sessToken = parsed?.token || parsed?.access_token;
      if (sessToken) return { Authorization: `Bearer ${sessToken}` };
    }
    return {};
  } catch {
    return {};
  }
}

// ── IndexedDB Engine with LocalStorage Fallback ─────────────────────────────

function isIndexedDBSupported(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      return reject(new Error("IndexedDB not supported"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

// ── LocalStorage Fallback Helpers ───────────────────────────────────────────

function getLocalStorageQueue(): OfflineQueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalStorageQueue(items: OfflineQueueItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

// ── Queue CRUD Operations ───────────────────────────────────────────────────

export async function enqueueTelemetry(
  type: TelemetryQueueType,
  payload: any,
): Promise<OfflineQueueItem> {
  const item: OfflineQueueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to LocalStorage
    const current = getLocalStorageQueue();
    current.push(item);
    setLocalStorageQueue(current);
  }

  notifyQueueStateChanged();
  return item;
}

export async function getPendingQueue(): Promise<OfflineQueueItem[]> {
  try {
    const db = await openDatabase();
    return await new Promise<OfflineQueueItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalStorageQueue();
  }
}

export async function getPendingCount(): Promise<number> {
  try {
    const db = await openDatabase();
    return await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result || 0);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalStorageQueue().length;
  }
}

export async function deleteQueueItem(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const current = getLocalStorageQueue().filter((item) => item.id !== id);
    setLocalStorageQueue(current);
  }

  notifyQueueStateChanged();
}

export async function updateQueueItem(item: OfflineQueueItem): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const current = getLocalStorageQueue().map((ex) =>
      ex.id === item.id ? item : ex,
    );
    setLocalStorageQueue(current);
  }
}

// ── Event Emitter ───────────────────────────────────────────────────────────

let isSyncing = false;

async function notifyQueueStateChanged() {
  if (typeof window === "undefined") return;
  const count = await getPendingCount();
  window.dispatchEvent(
    new CustomEvent("fitora-offline-queue-change", {
      detail: {
        pendingCount: count,
        isSyncing,
      },
    }),
  );
}

// ── Sync Execution Engine ───────────────────────────────────────────────────

export async function syncPendingTelemetry(): Promise<{
  synced: number;
  failed: number;
}> {
  if (typeof window === "undefined") return { synced: 0, failed: 0 };
  if (!navigator.onLine) return { synced: 0, failed: 0 };
  if (isSyncing) return { synced: 0, failed: 0 };

  isSyncing = true;
  await notifyQueueStateChanged();

  let synced = 0;
  let failed = 0;

  try {
    const queue = await getPendingQueue();
    if (queue.length === 0) {
      isSyncing = false;
      await notifyQueueStateChanged();
      return { synced: 0, failed: 0 };
    }

    const authHeader = getAuthHeader();

    for (const item of queue) {
      try {
        let success = false;

        if (item.type === "WORKOUT_LOG") {
          const res = await fetch(`${API_URL}/workouts/log`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader,
            },
            body: JSON.stringify(item.payload),
          });

          if (res.ok) {
            success = true;
            // Notify UI to refresh workout logs from MongoDB
            window.dispatchEvent(
              new CustomEvent("fitora-workout-logged", {
                detail: {
                  userId: item.payload?.userId,
                  exerciseName: item.payload?.exerciseName,
                  date: item.payload?.date,
                },
              }),
            );
          } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            // Unrecoverable validation error — discard to prevent queue poison
            console.warn(`[Offline Queue] Discarding invalid item ${item.id}:`, res.status);
            await deleteQueueItem(item.id);
            continue;
          }
        } else if (item.type === "STOPWATCH_SESSION") {
          const res = await fetch(`${API_URL}/stopwatch/session-complete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader,
            },
            body: JSON.stringify(item.payload),
          });

          if (res.ok) {
            success = true;
          } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            await deleteQueueItem(item.id);
            continue;
          }
        }

        if (success) {
          await deleteQueueItem(item.id);
          synced++;
        } else {
          item.attempts = (item.attempts || 0) + 1;
          item.lastAttemptAt = new Date().toISOString();
          await updateQueueItem(item);
          failed++;
        }
      } catch (networkErr: any) {
        // Network dropped mid-sync
        item.attempts = (item.attempts || 0) + 1;
        item.lastAttemptAt = new Date().toISOString();
        item.error = networkErr?.message || "Network request failed";
        await updateQueueItem(item);
        failed++;
        break; // Stop draining if network went down again
      }
    }
  } finally {
    isSyncing = false;
    await notifyQueueStateChanged();
  }

  if (synced > 0 && typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("fitora-offline-synced", {
        detail: { syncedCount: synced },
      }),
    );
  }

  return { synced, failed };
}

// ── Auto-Sync Listeners & Background Timer ───────────────────────────────────

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  // 1. Sync on network connection restored
  window.addEventListener("online", () => {
    syncPendingTelemetry();
  });

  // 2. Sync on tab refocus
  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        syncPendingTelemetry();
      }
    });
  }

  // 3. Periodic fallback poll every 30s when online
  setInterval(() => {
    if (navigator.onLine && !isSyncing) {
      getPendingCount().then((count) => {
        if (count > 0) syncPendingTelemetry();
      });
    }
  }, 30000);
}

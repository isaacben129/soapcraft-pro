export interface LocalStorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
const memory = new Map<string, string>();
const fallback: LocalStorageAdapter = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };
export function storage(): LocalStorageAdapter { return typeof window !== "undefined" && window.localStorage ? window.localStorage : fallback; }
export function saveLocal<T>(key: string, value: T): void { storage().setItem(key, JSON.stringify(value)); }
export function loadLocal<T>(key: string): T | null { const raw = storage().getItem(key); return raw ? JSON.parse(raw) as T : null; }

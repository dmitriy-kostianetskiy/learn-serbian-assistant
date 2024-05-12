export interface CacheService<T extends object> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
}

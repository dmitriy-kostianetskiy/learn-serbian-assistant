export interface StorageService<T extends object> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
}

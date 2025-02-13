import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Save data to localStorage
   * @param key Storage key
   * @param data Data to store
   */
  save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Load data from localStorage
   * @param key Storage key
   * @returns Parsed data or null if not found
   */
  load<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  /**
   * Remove data from localStorage
   * @param key Storage key
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all data from localStorage
   */
  clear(): void {
    localStorage.clear();
  }
}

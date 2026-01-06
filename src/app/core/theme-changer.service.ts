import { Injectable, inject, signal, effect, DOCUMENT } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const LOCAL_STORAGE_THEME_KEY = 'input-otp-theme';
export type Theme = 'dark' | 'light' | 'auto';
export type ThemeWithoutAuto = Exclude<Theme, 'auto'>;
const DARK_MODE_CLASS = 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeChangerService {
  private _document = inject(DOCUMENT);
  private browserStorage = inject(LocalStorageService);
  private _isDark = signal(false);
  public isDark = this._isDark.asReadonly();
  private _window = this._document.defaultView;

  constructor() {
    this.setTheme(this.getPreferredTheme());
    if (this._window !== null && this._window.matchMedia) {
      this._window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          const storedTheme = this.getStoredTheme();
          if (storedTheme !== 'light' && storedTheme !== 'dark') {
            this.setTheme(this.getPreferredTheme());
          }
        });
    }

    effect(() => {
      if (this._isDark()) {
        this._document.body.classList.add(DARK_MODE_CLASS);
        this.setStoredTheme('dark');
      } else {
        this._document.body.classList.remove(DARK_MODE_CLASS);
        this.setStoredTheme('light');
      }
    });
  }

  private getStoredTheme = () =>
    this.browserStorage.load<ThemeWithoutAuto>(LOCAL_STORAGE_THEME_KEY);
  private setStoredTheme = (theme: ThemeWithoutAuto) => {
    this.browserStorage.save(LOCAL_STORAGE_THEME_KEY, theme);
  };

  private getPreferredTheme = (): Theme => {
    const storedTheme = this.getStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

    if (this._window !== null && this._window.matchMedia) {
      return this._window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  private setTheme = (
    theme: Theme,
    document = this._document,
    isDarkSignal = this._isDark,
  ) => {
    if (document.defaultView !== null && document.defaultView.matchMedia) {
      if (
        theme === 'auto' &&
        document.defaultView.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        isDarkSignal.set(true);
      } else {
        isDarkSignal.set(theme === 'dark');
      }
    }
  };

  public changeTheme(theme: ThemeWithoutAuto) {
    this.setStoredTheme(theme);
    this.setTheme(theme);
  }
}

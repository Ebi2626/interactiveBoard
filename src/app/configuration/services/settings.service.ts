import { Injectable, inject, signal } from '@angular/core';
import { Settings } from '../../models/settings.model';
import { LocalStorageService } from '../../global/services/local-storage.service';
import { LocalStorageKey } from '../../models/localStorage.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private localStorageService = inject(LocalStorageService);

  public settings = signal<Settings>({
    maxConnectionNumber: null,
    allowedSelfConnection: false,
    saveDataInLocalStorage: false,
  });

  constructor() {
    const settingsFromLocalStorage = this.localStorageService.getItem(LocalStorageKey.SETTINGS);
    if (settingsFromLocalStorage) {
      this.updateSettings(settingsFromLocalStorage);
    }
  }

  public updateSettings(newSettings: Partial<Settings>): void {
    this.settings.update((oldSettings) => ({ ...oldSettings, ...newSettings }));
    if (newSettings.saveDataInLocalStorage) {
      this.localStorageService.setItem(LocalStorageKey.SETTINGS, this.settings());
    } else {
      this.localStorageService.clear();
    }
  }
}

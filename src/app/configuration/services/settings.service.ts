import { Injectable, signal } from '@angular/core';
import { Settings } from '../../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings = signal<Settings>({
    maxConnectionNumber: null,
    allowedSelfConnection: false,
  });

  updateSettings(newSettings: Partial<Settings>) {
    this.settings.update((oldSettings) => ({...oldSettings, ...newSettings}));
  }
}

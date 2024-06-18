import { Injectable, effect, inject, signal } from '@angular/core';
import { PositionMap } from '../../models/position.model';
import { LocalStorageService } from '../../global/services/local-storage.service';
import { SettingsService } from './settings.service';
import { LocalStorageKey } from '../../models/localStorage.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private localStorageService = inject(LocalStorageService);
  private settingsService = inject(SettingsService);
  public positions = signal<PositionMap>({});

  constructor() {
    this.fetchDataFromLocalStorage();
    effect(() => {
      if (this.settingsService.settings().saveDataInLocalStorage) {
        this.localStorageService.setItem(LocalStorageKey.POSITIONS, this.positions());
      }
    })
  }

  private fetchDataFromLocalStorage(): void {
    const dataFromLocalStorage = this.localStorageService.getItem(LocalStorageKey.POSITIONS);
    if (dataFromLocalStorage) {
      this.setAllPositions(dataFromLocalStorage);
    }
  }

  private setAllPositions(positions: PositionMap): void {
    this.positions.update(() => ({ ...positions }));
  }

  public setPosition(instanceId: string, cssStyle: string): void {
    this.positions.update((oldPositions) => ({ ...oldPositions, [instanceId]: cssStyle }));
  }
}

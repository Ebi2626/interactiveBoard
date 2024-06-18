import { Injectable, effect, inject, signal } from '@angular/core';
import { TypeElement, TypeOnBoard } from '../../models/type.model';
import { LocalStorageService } from '../../global/services/local-storage.service';
import { SettingsService } from './settings.service';
import { LocalStorageKey } from '../../models/localStorage.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private localStorageService = inject(LocalStorageService);
  private settingsService = inject(SettingsService);

  public types = signal<TypeElement[]>([]);
  public typesOnBoard = signal<TypeOnBoard[]>([]);
  public typeNumber = signal<number>(0);

  private fetchDataFromLocalStorage(): void {
    const types = this.localStorageService.getItem(LocalStorageKey.TYPES);
    const board = this.localStorageService.getItem(LocalStorageKey.BOARD);
    const typeNumber = this.localStorageService.getItem(LocalStorageKey.TYPE_NUMBER);

    if (types) {
      this.types.update(() => [...types]);
    }
    if (board) {
      this.typesOnBoard.update(() => [...board]);
    }
    if (typeNumber || typeNumber === 0) {
      this.typeNumber.update(() => typeNumber);
    }
  }

  constructor() {
    this.fetchDataFromLocalStorage();
    
    effect(() => {
      if (this.settingsService.settings().saveDataInLocalStorage) {
        this.localStorageService.setItem(LocalStorageKey.TYPES, this.types());
        this.localStorageService.setItem(LocalStorageKey.BOARD, this.typesOnBoard());
        this.localStorageService.setItem(LocalStorageKey.TYPE_NUMBER, this.typeNumber());
      }
    })
  }

}

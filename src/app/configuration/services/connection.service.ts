import { Injectable, effect, inject, signal } from '@angular/core';
import { Connection } from '../../models/type.model';
import * as R from 'ramda';
import { Subject } from 'rxjs';
import { StoreService } from './store.service';
import { ValidationErrors } from '../../models/settings.model';
import { SettingsService } from './settings.service';
import { LocalStorageService } from '../../global/services/local-storage.service';
import { LocalStorageKey } from '../../models/localStorage.model';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private storeService = inject(StoreService);
  private settingsService = inject(SettingsService);
  private localStorageService = inject(LocalStorageService);
  private _from: string | null = null;

  public connections = signal<Connection[]>([]);
  public redrawConnections: Subject<void> = new Subject();

  constructor() {
    this.fetchDataFromLocalStorage();
    effect(() => {
      if (this.settingsService.settings().saveDataInLocalStorage) {
        this.localStorageService.setItem(LocalStorageKey.CONNECTIONS, this.connections());
      }
    })
  }

  private fetchDataFromLocalStorage(): void {
    const connections = this.localStorageService.getItem(LocalStorageKey.CONNECTIONS);
    if (connections) {
      this.connections.update(() => [...connections]);
    }
  }

  private isConnectionValid(startingInstanceId: string, endingInstanceId: string): boolean {
    const firstElement = this.storeService.typesOnBoard().find((el) => el.instanceId === startingInstanceId);
    const secondElement = this.storeService.typesOnBoard().find((el) => el.instanceId === endingInstanceId);

    if (!this.settingsService.settings().allowedSelfConnection) {
      if (firstElement?.id === secondElement?.id) {
        throw new Error(ValidationErrors.SAME_TYPE_CONNECTION)
      }
    }

    const maxConnections = this.settingsService.settings().maxConnectionNumber;

    if (maxConnections !== null) {
      const startingElementConnectionCount = this.connections().reduce((acc, curr) => {
        if (curr.from === startingInstanceId || curr.to === startingInstanceId) {
          return acc + 1;
        }
        return acc;
      }, 1);
      const endingElementConnectionCount = this.connections().reduce((acc, curr) => {
        if (curr.from === endingInstanceId || curr.to === endingInstanceId) {
          return acc + 1;
        }
        return acc;
      }, 1);

      if (startingElementConnectionCount > maxConnections || endingElementConnectionCount > maxConnections) {
        throw new Error(`${ValidationErrors.MAX_CONNECTIONS_NUMBER} ${maxConnections}`);
      }
    }

    return true;
  }

  private findConnection(from: string, to: string): number {
    return this.connections().findIndex((el) => (el.from === from && el.to === to) || (el.from === to && el.to === from));
  }

  private addConnection(from: string, to: string): void {
    const isValidConnection = this.isConnectionValid(from, to);
    if (isValidConnection) {
      this.connections.update((connections) => R.uniq([...connections, { from, to }]));
    }
  }

  private removeConnection(connectionIndex: number): void {
    this.connections.update((oldConnections) => oldConnections.filter((_, i) => i !== connectionIndex));
  }

  public addOrRemoveConnection(instanceIndex: string): void {
    if (this._from !== null) {
      const from = this._from;
      this._from = null;
      const existingConnectionIndex = this.findConnection(from, instanceIndex);
      if (existingConnectionIndex !== -1) {
        this.removeConnection(existingConnectionIndex);
      } else {
        this.addConnection(from, instanceIndex);
      }
    } else {
      this._from = instanceIndex;
    }
  }

  public clearConnection(instanceId: string): void {
    this.connections.update((connections) => R.uniq(connections.filter(({ from, to }) => from !== instanceId && to !== instanceId)));
  }
}

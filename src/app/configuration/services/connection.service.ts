import { Injectable, inject, signal } from '@angular/core';
import { Connection } from '../../models/type.model';
import * as R from 'ramda';
import { Subject } from 'rxjs';
import { StoreService } from './store.service';
import { ValidationErrors } from '../../models/settings.model';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private storeService = inject(StoreService);
  private settingsService = inject(SettingsService);
  private _from: string | null = null;

  public connections = signal<Connection[]>([]);
  public redrawConnections: Subject<void> = new Subject();


  private isConnectionValid(startingInstanceId: string, endingInstanceId: string): boolean {
    const firstElement = this.storeService.typesOnBoard().find((el) => el.instanceId === startingInstanceId);
    const secondElement = this.storeService.typesOnBoard().find((el) => el.instanceId === endingInstanceId);

    if(!this.settingsService.settings().allowedSelfConnection){
      if (firstElement?.id === secondElement?.id) {
        throw new Error(ValidationErrors.SAME_TYPE_CONNECTION)
      }
    }

    const maxConnections = this.settingsService.settings().maxConnectionNumber;
    
    if(maxConnections !== null) {
      const startingElementConnectionCount = this.connections().reduce((acc, curr) => {
        if(curr.from === startingInstanceId || curr.to === startingInstanceId) {
          return acc + 1;
        }
        return acc;
      }, 1);
      const endingElementConnectionCount = this.connections().reduce((acc, curr) => {
        if(curr.from === endingInstanceId || curr.to === endingInstanceId) {
          return acc + 1;
        }
        return acc;
      }, 1);

      if(startingElementConnectionCount > maxConnections || endingElementConnectionCount > maxConnections) {
        throw new Error(`${ValidationErrors.MAX_CONNECTIONS_NUMBER} ${maxConnections}`);
      }
    }

    return true;
  }


  public addConnection(instanceIndex: string): void {
    if (this._from !== null) {
      const from = this._from;
      this._from = null;
      const isValidConnection = this.isConnectionValid(from, instanceIndex);
      if (isValidConnection) {
        this.connections.update((connections) => R.uniq([...connections, { from, to: instanceIndex }]));
      } 
    } else {
      this._from = instanceIndex;
    }
  }

  public clearConnection(instanceId: string): void {
    this.connections.update((connections) => R.uniq(connections.filter(({ from, to }) => from !== instanceId && to !== instanceId)));
  }
}

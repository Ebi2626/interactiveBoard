import { Injectable, inject, signal } from '@angular/core';
import { Connection } from '../../models/type.model';
import { TypeManagementService } from './type-management.service';
import * as R from 'ramda';
import { Subject } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  storeService = inject(StoreService);
  connections = signal<Connection[]>([]);
  public redrawConnections: Subject<void> = new Subject();

  private _from: number | null = null;

  private isConnectionValid(firstId: string | undefined, secondId: string | undefined): boolean {
    if (firstId !== undefined && secondId !== undefined && firstId !== secondId) {
      return true;
    }
    return false;
  }

  addConnection(typeIndex: number) {
    if (this._from !== null) {
      const firstTypeId = this.storeService.typesOnBoard().find((el) => el.index === this._from)?.id;
      const secondTypeId = this.storeService.typesOnBoard().find((el) => el.index === typeIndex)?.id;
      const isValidConnection = this.isConnectionValid(firstTypeId, secondTypeId);
      if (isValidConnection) {
        this.connections.update((connections) => R.uniq([...connections, { from: this._from!, to: typeIndex }]));
        console.log('Zaktualizowana lista połączeń: ', this.connections());
      } else {
        console.error('Nie można połączyć elementów o tych samych id');
      }
      this._from = null;
    } else {
      this._from = typeIndex;
    }
  }

  clearConnection(indexToRemove: number) {
    console.log('usuwamy połączenia z indexem: ', indexToRemove);
    this.connections.update((connections) => R.uniq(connections.filter(({ from, to }) => from !== indexToRemove && to !== indexToRemove)));
  }
}

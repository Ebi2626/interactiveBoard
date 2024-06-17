import { Injectable, inject, signal } from '@angular/core';
import { Connection, InputType, TypeElement, TypeOnBoard } from '../../models/type.model';
import { Subject } from 'rxjs';
import * as R from 'ramda';
import { ConnectionService } from './connection.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class TypeManagementService {
  private connectionService = inject(ConnectionService);
  private storeService = inject(StoreService);
  private _currentIndexOnBoard = 0;


  private copyFieldsWithDiffrentIds(inputTypeList: InputType[]): InputType[] {
    return inputTypeList.map((inputType: InputType) => {
      return { ...inputType, id: self.crypto.randomUUID()}
    });
  }

  hideTypeFromTheBoard(indexOfType: number) {
    console.log('Usuwamy tablicy typ o indexie:', indexOfType);
    this.storeService.typesOnBoard.update((types) => types.filter((type, i) => i !== indexOfType));
    this.connectionService.clearConnection(indexOfType);
  }

  putTypeOnBoard(typeId: string) {
    const typeToAddOnBoard = this.storeService.types().find((type) => type.id === typeId);
    if (typeToAddOnBoard) {
      const typeWithCopiedFields: TypeOnBoard = {
        ...typeToAddOnBoard,
        index: this._currentIndexOnBoard,
        inputList: this.copyFieldsWithDiffrentIds(typeToAddOnBoard.inputList),
        instanceId: self.crypto.randomUUID(),
      };
      console.log('Wstawiamy na tablicę typ: ', typeWithCopiedFields);
      this.storeService.typesOnBoard.update((typesOnBoard) => [...typesOnBoard, { ...typeWithCopiedFields}]);
      this._currentIndexOnBoard += 1;
    }
  }

  addType(newType: TypeElement) {
    console.log('Dodajemy typ: ', newType);
    this.storeService.types.update((types) => [...types, newType]);
    this.putTypeOnBoard(newType.id);
  }

  removeType(typeId: string) {
    console.log('Usuwamy typ o id: ', typeId);
    const indexesToRemove: number[] = [];
    this.storeService.typesOnBoard().forEach(({ id }, i) => {
      if (id === typeId) {
        indexesToRemove.push(i);
      }
    });
    this.storeService.types.update((types) => types.filter((type) => type.id !== typeId));
    this.storeService.typesOnBoard.update((types) => types.filter((type) => type.id !== typeId));
    indexesToRemove.sort((a, b) => a - b).forEach((index) => {
      this.connectionService.clearConnection(index);
    });

  }

  updateType(editedType: TypeElement) {
    console.log('Aktualizujemy typ: ', editedType);
    this.storeService.types.update((types) => types.map((type) => {
      if (type.id === editedType.id) {
        return { ...editedType };
      }
      return { ...type };
    }));
    this.storeService.typesOnBoard.update((types) => types.map((type) => {
      if (type.id === editedType.id) {
        return { ...editedType, index: type.index, instanceId: type.instanceId };
      }
      return { ...type };
    }));
  }

}

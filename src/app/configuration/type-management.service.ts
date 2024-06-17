import { Injectable, signal } from '@angular/core';
import { Connection, TypeElement, TypeOnBoard } from '../models/type.model';

@Injectable({
  providedIn: 'root'
})
export class TypeManagementService {

  private _from: number | null = null;

  private _currentIndexOnBoard = 0;

  connections = signal<Connection[]>([]);

  types = signal<TypeElement[]>([]);

  typesOnBoard = signal<TypeOnBoard[]>([]);

  hideTypeFromTheBoard(indexOfType: number) {
    console.log('Usuwamy tablicy typ o indexie:', indexOfType);
    this.typesOnBoard.update((types) => types.filter((type, i) => i !== indexOfType));
    this.clearConnection(indexOfType);
  }

  putTypeOnBoard(typeId: string) {
    const typeToAddOnBoard = this.types().find((type) => type.id === typeId);
    if (typeToAddOnBoard) {
      console.log('Wstawiamy na tablicę typ: ', typeToAddOnBoard);
      this.typesOnBoard.update((typesOnBoard) => [...typesOnBoard, { ...typeToAddOnBoard, index: this._currentIndexOnBoard }]);
      this._currentIndexOnBoard += 1;
    }

  }

  addType(newType: TypeElement) {
    console.log('Dodajemy typ: ', newType);
    this.types.update((types) => [...types, newType]);
    this.putTypeOnBoard(newType.id);
  }

  removeType(typeId: string) {
    console.log('Usuwamy typ o id: ', typeId);
    const indexesToRemove: number[] = [];
    this.typesOnBoard().forEach(({ id }, i) => {
      if (id === typeId) {
        indexesToRemove.push(i);
      }
    });
    this.types.update((types) => types.filter((type) => type.id !== typeId));
    this.typesOnBoard.update((types) => types.filter((type) => type.id !== typeId));
    indexesToRemove.sort((a, b) => a - b).forEach((index) => {
      this.clearConnection(index);
    });

  }

  updateType(editedType: TypeElement) {
    console.log('Aktualizujemy typ: ', editedType);
    this.types.update((types) => types.map((type) => {
      if (type.id === editedType.id) {
        return { ...editedType };
      }
      return { ...type };
    }));
    this.typesOnBoard.update((types) => types.map((type) => {
      if (type.id === editedType.id) {
        return { ...editedType, index: type.index };
      }
      return { ...type };
    }));
  }

  isConnectionValid(firstId: string | undefined, secondId: string | undefined): boolean {
    if (firstId !== undefined && secondId !== undefined && firstId !== secondId) {
      return true;
    }
    return false;
  }

  addConnection(typeIndex: number) {
    if (this._from !== null) {
      const firstTypeId = this.typesOnBoard().find((el) => el.index === this._from)?.id;
      const secondTypeId = this.typesOnBoard().find((el) => el.index === typeIndex)?.id;
      const isValidConnection = this.isConnectionValid(firstTypeId, secondTypeId);
      if (isValidConnection) {
        this.connections.update((connections) => Array.from(new Set([...connections, { from: this._from!, to: typeIndex }])));
        console.log('Zaktualizowana lista połączeń: ', this.connections());
      } else {
        console.error('Invalid connection');
      }
      this._from = null;
    } else {
      this._from = typeIndex;
    }
  }

  clearConnection(indexToRemove: number) {
    console.log('usuwamy połączenia z indexem: ', indexToRemove);
    this.connections.update((connections) => Array.from(new Set(connections.filter(({ from, to }) => from !== indexToRemove && to !== indexToRemove))));
  }
}

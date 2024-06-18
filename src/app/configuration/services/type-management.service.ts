import { Injectable, inject } from '@angular/core';
import { InputType, TypeElement, TypeOnBoard } from '../../models/type.model';
import { ConnectionService } from './connection.service';
import { StoreService } from './store.service';
import { ProgramErrors } from '../../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class TypeManagementService {
  private connectionService = inject(ConnectionService);
  private storeService = inject(StoreService);

  private copyFieldsWithDiffrentIds(inputTypeList: InputType[]): InputType[] {
    return inputTypeList.map((inputType: InputType) => {
      return { ...inputType, id: self.crypto.randomUUID()}
    });
  }

  public hideTypeFromTheBoard(instanceId: string): void {
    this.connectionService.clearConnection(instanceId);
    this.storeService.typesOnBoard.update((types) => types.filter((type) => type.instanceId !== instanceId));
  }

  public putTypeOnBoard(typeId: string): void {
    const typeToAddOnBoard = this.storeService.types().find((type) => type.id === typeId);

    if (typeToAddOnBoard) {

      // Add unique instanceId and copy inputs with new ids
      const typeWithCopiedFields: TypeOnBoard = {
        ...typeToAddOnBoard,
        inputList: this.copyFieldsWithDiffrentIds(typeToAddOnBoard.inputList),
        instanceId: self.crypto.randomUUID(),
      };
      
      this.storeService.typesOnBoard.update((typesOnBoard) => [...typesOnBoard, { ...typeWithCopiedFields}]);
    } else {
      throw new Error(`${ProgramErrors.LACK_OF_TYPE_ON_BOARD} ${typeId}`);
    }

  }

  public addType(newType: TypeElement): void {
    this.storeService.types.update((types) => [...types, newType]);
    this.storeService.typeNumber.update((oldTypeNumber) => oldTypeNumber + 1);
    this.putTypeOnBoard(newType.id);
  }

  public removeType(typeId: string): void {

    // find all instances with given typeId on the board
    const instancesToRemove: string[] = this.storeService.typesOnBoard()
      .filter(({id}) => id === typeId)
      .map(({instanceId}) => instanceId);

    // Remove connections
    instancesToRemove.forEach((instanceId) => {
      this.connectionService.clearConnection(instanceId);
    });

    // Update data
    this.storeService.types.update((types) => types.filter((type) => type.id !== typeId));
    this.storeService.typesOnBoard.update((types) => types.filter((type) => type.id !== typeId));
  }

  public updateType(editedType: TypeElement): void {
    // Edit type template
    this.storeService.types.update((types) => types.map((type) => {
      if (type.id === editedType.id) {
        return { ...editedType };
      }
      return { ...type };
    }));

    // Edit all type instances on the board
    this.storeService.typesOnBoard.update((types) => types.map((type) => {
      if (type.id === editedType.id) {
        return { ...editedType, instanceId: type.instanceId };
      }
      return { ...type };
    }));
  }

}

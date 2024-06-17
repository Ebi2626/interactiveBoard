import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TypeElement } from '../../../models/type.model';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TypeManagementService } from '../../services/type-management.service';
import { MatListModule } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TypePopup } from '../type-popup/type-popup.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-type[instaceId]',
  standalone: true,
  imports: [TypePopup, FormsModule, MatCardModule, MatButton, MatListModule, MatFormFieldModule, MatInputModule, TextFieldModule],
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeComponent {
  private typeManagementService = inject(TypeManagementService)
  private connectionService = inject(ConnectionService);
  private dialog = inject(MatDialog);
  
  typeContent = input<TypeElement>();
  instaceId = input<string>();
  name: string = '';

  ngOnInit() {
    this.name = this.typeContent()!.name;
  }

  updateValue(value: any, inputId: string) {

    const newInputList = this.typeContent()!.inputList.map((field) => {
      if (field.id === inputId) {
        return {
          ...field,
          value
        }
      }
      return field;
    });

    const updatedType: TypeElement = {
      ...this.typeContent()!,
      inputList: newInputList,
    };

    this.typeManagementService.updateType(updatedType);
  }

  addConnection() {
    this.connectionService.addConnection(this.instaceId() as string);
  }

  editContent() {
    this.dialog.open(TypePopup, { data: this.typeContent() });
  }

  removeType() {
    this.typeManagementService.removeType(this.typeContent()!.id);
  }

  hideType() {
    this.typeManagementService.hideTypeFromTheBoard(this.instaceId() as string);
  }

}

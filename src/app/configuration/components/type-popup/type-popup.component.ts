import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TypeManagementService } from '../../services/type-management.service';
import { TypeElement } from '../../../models/type.model';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatListModule, MatButtonModule, MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogContent],
  templateUrl: './type-popup.component.html',
  styleUrl: './type-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypePopup {
  typeManagementService = inject(TypeManagementService)
  storeService = inject(StoreService);
  typeForm: FormGroup;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public formData: TypeElement) {
      this.typeForm = this.fb.group({
        name: this.fb.control(formData?.name || ''),
        inputList: this.fb.array(formData?.inputList?.length ? formData.inputList.map((item) => this.fb.control(item.label)) : [])
      });
  }

  get inputList() {
    return this.typeForm.get('inputList') as FormArray;
  }

  addField() {
    this.inputList.push(this.fb.control(''));
  }

  removeField(index: number) {
    this.inputList.removeAt(index);
  }

  updateType() {
    const updatedType: TypeElement = {
      ...this.formData,
      inputList: this.inputList.controls.map((control) => {
        return {
          id: self.crypto.randomUUID(),
          label: control.value,
          value: '',
        }
      }),
    };
    this.typeManagementService.updateType(updatedType)
  }

  addNewType() {
    const newType: TypeElement = {
      id: self.crypto.randomUUID(),
      color: Math.floor(Math.random() * 16777215).toString(16),
      name: this.typeForm.get('name')?.value,
      inputList: this.inputList.controls.filter((control) => control.value).map((control) => {
        return {
          id: self.crypto.randomUUID(),
          label: control.value,
          value: '',
        }
      }),
      typeNumber: this.storeService.types().length + 1
    };
    this.typeManagementService.addType(newType)
  }

}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { TypeManagementService } from '../../type-management.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-type-choice',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDialogModule],
  templateUrl: './type-choice.component.html',
  styleUrl: './type-choice.component.scss'
})
export class TypeChoiceComponent {
  typeManagementService = inject(TypeManagementService)

  types = this.typeManagementService.types();

  choosenType: string = '';

  putTypeOnTheBoard() {
    if (this.choosenType) {
      this.typeManagementService.putTypeOnBoard(this.choosenType);
    }

  }
}

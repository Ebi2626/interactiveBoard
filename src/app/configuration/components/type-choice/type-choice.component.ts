import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { TypeManagementService } from '../../services/type-management.service';
import { MatButtonModule } from '@angular/material/button';
import { StoreService } from '../../services/store.service';
import { ProgramErrors } from '../../../models/settings.model';

@Component({
  selector: 'app-type-choice',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDialogModule],
  templateUrl: './type-choice.component.html',
  styleUrl: './type-choice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeChoiceComponent {
  storeService = inject(StoreService);
  typeManagementService = inject(TypeManagementService);

  types = this.storeService.types();

  chosenType: string = '';

  putTypeOnTheBoard() {
    if (this.chosenType) {
      this.typeManagementService.putTypeOnBoard(this.chosenType);
    } else {
      throw new Error(ProgramErrors.TYPE_NOT_CHOSE);
    }
  }
}

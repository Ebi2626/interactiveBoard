import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormGroupFromObject, Settings } from '../../../models/settings.model';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogContent],
  templateUrl: './settings-popup.component.html',
  styleUrl: './settings-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPopupComponent {
  private settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);
  public form: FormGroup;

  constructor() {
    this.form = this.fb.group<FormGroupFromObject<Settings>>({
      maxConnectionNumber: this.fb.control(this.settingsService.settings().maxConnectionNumber),
      allowedSelfConnection: this.fb.control(this.settingsService.settings().allowedSelfConnection, { nonNullable: true }),
      saveDataInLocalStorage: this.fb.control(this.settingsService.settings().saveDataInLocalStorage, { nonNullable: true })
    })
  }

  public saveSettings(): void {
    const updatedSettings: Settings = {
      ...this.settingsService.settings(),
      ...this.form?.value
    }
    this.settingsService.updateSettings(updatedSettings);
  }
}

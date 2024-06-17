import { Component, ElementRef, QueryList, ViewChildren, computed, effect, inject } from '@angular/core';
import { TypeManagementService } from './services/type-management.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TypeComponent } from './components/type-component/type.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { TypeChoiceComponent } from './components/type-choice/type-choice.component';
import { TypePopup } from './components/type-popup/type-popup.component';
import { DrawingConnectionsDirective } from './directives/drawing-connections.directive';
import { SettingsPopupComponent } from './components/settings-popup/settings-popup.component';
import { LoggerService } from './services/logger.service';
import { ConnectionService } from './services/connection.service';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [MatButtonModule, TypeComponent, CdkDrag, DrawingConnectionsDirective],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  readonly dialog = inject(MatDialog);
  typeManagementService = inject(TypeManagementService);
  connectionService = inject(ConnectionService);
  loggerService = inject(LoggerService);
  storeService = inject(StoreService);
  types = this.storeService.typesOnBoard;
  connections = this.connectionService.connections;

  @ViewChildren(TypeComponent, { read: ElementRef }) typesOnTheBoard: QueryList<ElementRef<TypeComponent>> | undefined;

  addNewType() {
    this.dialog.open(TypePopup);
  }

  useType() {
    this.dialog.open(TypeChoiceComponent);
  }

  openSettings() {
    this.dialog.open(SettingsPopupComponent);
  }

  recalculatePaths() {
    this.connectionService.redrawConnections.next();
  }

  logData() {
    this.loggerService.logAllData();
  }
}

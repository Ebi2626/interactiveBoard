import { Component, ElementRef, QueryList, ViewChildren, computed, effect, inject } from '@angular/core';
import { TypeManagementService } from './type-management.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TypeComponent } from './components/type-component/type.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { TypeChoiceComponent } from './components/type-choice/type-choice.component';
import { TypePopup } from './components/type-popup/type-popup.component';
import { DrawingConnectionsDirective } from './directives/drawing-connections.directive';

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
  types = this.typeManagementService.typesOnBoard;
  connections = this.typeManagementService.connections;

  @ViewChildren(TypeComponent, { read: ElementRef }) typesOnTheBoard: QueryList<ElementRef<TypeComponent>> | undefined;

  addNewType() {
    this.dialog.open(TypePopup);
  }

  useType() {
    this.dialog.open(TypeChoiceComponent);
  }

  recalculatePaths() {
    this.typeManagementService.redrawConnections.next();
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren, effect, inject, signal } from '@angular/core';
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
import { PositionService } from './services/position.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [MatButtonModule, TypeComponent, CdkDrag, DrawingConnectionsDirective],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationComponent {
  readonly dialog = inject(MatDialog);
  private connectionService = inject(ConnectionService);
  private loggerService = inject(LoggerService);
  private storeService = inject(StoreService);
  private _positionService = inject(PositionService);
  private positionSettled = signal<boolean>(false);
  private componentInitialized = signal<boolean>(false);
  public types = this.storeService.typesOnBoard;
  public connections = this.connectionService.connections;

  @ViewChildren(TypeComponent, { read: ElementRef }) typesOnTheBoard: QueryList<ElementRef<HTMLElement>> | undefined;

  constructor() {
    effect(() => {
      if (this.types() && this.componentInitialized() && !this.positionSettled()) {
        // TODO: refactor logic so we could avoid this time for rendering children
        setTimeout(() => {
          this.setComponentsPositions();
        }, 100)
      }
    })
  }

  public addNewType(): void {
    this.dialog.open(TypePopup);
  }

  public useType(): void {
    this.dialog.open(TypeChoiceComponent);
  }

  public openSettings(): void {
    this.dialog.open(SettingsPopupComponent);
  }

  public recalculatePaths(): void {
    this.connectionService.redrawConnections.next();
  }

  public logData(): void {
    this.loggerService.logAllData();
  }

  public saveComponentPosition(instanceId: string): void {
    const htmlElement = Array.from(this.typesOnTheBoard!).find((el) => el.nativeElement.id === instanceId)?.nativeElement;
    const transformStyle = htmlElement?.style?.transform;
    if (htmlElement && transformStyle) {
      this._positionService.setPosition(instanceId, `transform: ${transformStyle}`);
    }
  }

  private setComponentsPositions(): void {
    const positions = this._positionService.positions();
    const elements = Array.from(this.typesOnTheBoard!);
    for (const id in positions) {
      const element = elements.find((el) => el.nativeElement.id === id);
      if (element) {
        element.nativeElement.setAttribute('style', positions[id]);
      }
    }
    this.recalculatePaths();
    this.positionSettled.update(() => true);
  }

  ngAfterViewInit(): void {
    this.componentInitialized.update(() => true);
  }
}

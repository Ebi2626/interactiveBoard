import { ChangeDetectorRef, Component, ContentChildren, ElementRef, QueryList, ViewChildren, computed, effect, inject } from '@angular/core';
import { TypeManagementService } from './type-management.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TypeComponent } from './components/type-component/type.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { TypeChoiceComponent } from './components/type-choice/type-choice.component';
import { TypePopup } from './components/type-popup/type-popup.component';
// @ts-ignore
import { CurvyPath } from 'svg-dom-arrows';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [MatButtonModule, TypeComponent, CdkDrag],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  readonly dialog = inject(MatDialog);
  typeManagementService = inject(TypeManagementService);
  types = this.typeManagementService.typesOnBoard;

  connections = this.typeManagementService.connections;

  curvePaths = computed(() => {
    if (!this.connections().length || !this.types().length) {
      return [];
    }
    return this.connections().map(({ from, to }) => {
      const startElement = this.typesOnTheBoard?.toArray()?.[from]?.nativeElement;
      const endingElement = this.typesOnTheBoard?.toArray()?.[to]?.nativeElement;
      if (startElement && endingElement) {
        const options = {
          start: {
            element: startElement,
            position: {
              top: 0.5,
              left: 1
            }
          },
          end: {
            element: endingElement,
            position: {
              top: 0.5,
              left: 0
            }
          },
          style: 'stroke:black;stroke-width:4;fill:transparent',
          appendTo: document.body
        }
        return new CurvyPath(options);
      }
      return false;

    }).filter((i) => i) || [];
  })

  constructor() {
    effect(() => {
      this.recalculatePaths();
    });
  }

  @ViewChildren(TypeComponent, { read: ElementRef }) typesOnTheBoard: QueryList<ElementRef<TypeComponent>> | undefined;


  addNewType() {
    this.dialog.open(TypePopup);
  }

  useType() {
    this.dialog.open(TypeChoiceComponent);
  }


  ngAfterViewInit() {
    this.recalculatePaths();
  }

  recalculatePaths() {
    this.curvePaths().forEach((path) => {
      path.redraw();
    });
  }
}

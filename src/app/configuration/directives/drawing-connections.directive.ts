import { Directive, ElementRef, Inject, Renderer2, effect, inject } from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { TypeManagementService } from '../services/type-management.service';
import { Connection } from '../../models/type.model';
import { ConnectionService } from '../services/connection.service';

interface Coords {
  x: number;
  y: number;
}

@Directive({
  selector: '[appDrawingConnections]',
  standalone: true
})
export class DrawingConnectionsDirective {
  private _sub: Subscription = new Subscription();
  private _width: number = 0;
  private _height: number = 0;
  private _renderer = inject(Renderer2);
  private _document: Document;
  private _elementRef = inject(ElementRef);
  private _canvas?: HTMLCanvasElement;
  private _canvasStyle: string = 'position: absolute; top: 0; left: 0; z-index: -1;';
  private _connectionsService = inject(ConnectionService);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this._document = document;

    // Adjust canvas to screen size
    this._sub.add(
      fromEvent(window, 'resize').pipe(debounceTime(300)).subscribe((e: Event) => {
          const window = e.target as Window;
          this._width = window.innerWidth;
          this._height = window.innerHeight;
        }
      )
    );

    // Redraw connections on any connection change
    effect(() => {
      this.redrawConnections();
    });

    // Redraw connections on drag'n'drop
    this._sub.add(
      this._connectionsService.redrawConnections.pipe(debounceTime(30)).subscribe(() => {
        this.redrawConnections();
      })
    )
   }

  private createCanvasElement() {
    this._canvas = this._document.createElement('canvas');
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.setAttribute('style', this._canvasStyle);
    this._renderer.appendChild(this._elementRef.nativeElement, this._canvas);  
  }

  ngOnInit() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this.createCanvasElement();
  }


  private drawLine(startingCoords: Coords, endingCoords: Coords) {
    const ctx = this._canvas?.getContext("2d");
    ctx?.moveTo(startingCoords.x, startingCoords.y)
    ctx?.lineTo(endingCoords.x, endingCoords.y);
    ctx?.stroke();
  }

  private recreateCanvas() {
    this._canvas?.remove();
    this.createCanvasElement();
  }

  private getMidElementCoords(el: HTMLElement): Coords {
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = rect.left;
    const y = rect.top;
    return {
      x: x + width / 2,
      y: y + height / 2
    };
  }

  private drawConnection(connection: Connection, appTypeElements: HTMLElement[]) {
    const startChild = appTypeElements.at(connection.from);
    const endChild = appTypeElements.at(connection.to);
    if(startChild && endChild) {
      const startCoords = this.getMidElementCoords(startChild);
      const endCoords = this.getMidElementCoords(endChild);
      this.drawLine(startCoords, endCoords);
    } else {
      console.error('Wrong connection to draw');
    }
  }

  public redrawConnections() {
    this.recreateCanvas();
    const appTypeElements = Array.from(this._document.querySelectorAll('app-type')) as HTMLElement[];
    this._connectionsService.connections().forEach((connection) => {
      this.drawConnection(connection, appTypeElements);
    })
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}

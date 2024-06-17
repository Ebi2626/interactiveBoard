import { Injectable, signal } from '@angular/core';
import { TypeElement, TypeOnBoard } from '../../models/type.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  types = signal<TypeElement[]>([]);
  typesOnBoard = signal<TypeOnBoard[]>([]);

}

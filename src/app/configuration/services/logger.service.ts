import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import { ConnectionService } from './connection.service';
import { StoreService } from './store.service';
import { PositionService } from './position.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private storeService = inject(StoreService);
  private settingService = inject(SettingsService);
  private connectionService = inject(ConnectionService);
  private positionService = inject(PositionService);

  private logTypesData() {
    console.group('_____ Types information _____');

    console.group('___ All created types ___');
    console.log(this.storeService.types())
    console.groupEnd();

    console.group('___ All types on the board ___');
    console.log(this.storeService.typesOnBoard());
    console.groupEnd();

    console.group('___ Type number ___')
    console.log(this.storeService.typeNumber());
    console.groupEnd()

    console.groupEnd();
  }

  private logConnectionsData() {
    console.group('_____ Connections information ______');
    console.group('___ All connections ___');
    console.log(this.connectionService.connections());
    console.groupEnd();
    console.groupEnd();
  }

  private logSettingsData() {
    console.group('_____ Settings information _____')
    console.log(this.settingService.settings());
    console.groupEnd();
  }

  private logPositionData() {
    console.group('_____ Positions information ______');
    console.log(this.positionService.positions());
    console.groupEnd();
  }

  public logAllData() {

    console.log('Logging time: ', Date());

    this.logTypesData();
    this.logConnectionsData();
    this.logPositionData();
    this.logSettingsData();

    
  }
}

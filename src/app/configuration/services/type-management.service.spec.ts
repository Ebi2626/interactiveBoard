import { TestBed } from '@angular/core/testing';

import { TypeManagementService } from './type-management.service';

describe('TypeManagementService', () => {
  let service: TypeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

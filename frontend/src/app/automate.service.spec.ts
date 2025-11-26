import { TestBed } from '@angular/core/testing';

import { AutomateService } from './automate.service';

describe('AutomateService', () => {
  let service: AutomateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { BrewtimerService } from './brewtimer.service';

describe('BrewtimerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrewtimerService]
    });
  });

  it('should ...', inject([BrewtimerService], (service: BrewtimerService) => {
    expect(service).toBeTruthy();
  }));
});

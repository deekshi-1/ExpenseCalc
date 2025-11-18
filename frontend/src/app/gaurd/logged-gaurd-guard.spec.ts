import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedGaurdGuard } from './logged-gaurd-guard';

describe('loggedGaurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedGaurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

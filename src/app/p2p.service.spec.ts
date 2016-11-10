/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { P2pService } from './p2p.service';

describe('Service: P2p', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [P2pService]
    });
  });

  it('should ...', inject([P2pService], (service: P2pService) => {
    expect(service).toBeTruthy();
  }));
});

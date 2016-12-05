/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModelUtilsService } from './model-utils.service';

describe('Service: ModelUtils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelUtilsService]
    });
  });

  it('should ...', inject([ModelUtilsService], (service: ModelUtilsService) => {
    expect(service).toBeTruthy();
  }));
});

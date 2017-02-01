/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockNotificationsService } from './mock-notifications.service';

describe('MockNotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockNotificationsService]
    });
  });

  it('should ...', inject([MockNotificationsService], (service: MockNotificationsService) => {
    expect(service).toBeTruthy();
  }));
});

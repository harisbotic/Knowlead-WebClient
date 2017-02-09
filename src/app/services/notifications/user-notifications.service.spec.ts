/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserNotificationsService } from './user-notifications.service';

describe('UserNotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserNotificationsService]
    });
  });

  it('should ...', inject([UserNotificationsService], (service: UserNotificationsService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FriendshipNotificationsService } from './friendship-notifications.service';

describe('FriendshipNotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendshipNotificationsService]
    });
  });

  it('should ...', inject([FriendshipNotificationsService], (service: FriendshipNotificationsService) => {
    expect(service).toBeTruthy();
  }));
});

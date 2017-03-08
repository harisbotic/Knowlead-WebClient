import { TestBed, inject } from '@angular/core/testing';
import { ChatNotificationsService } from './chat-notifications.service';

describe('ChatNotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatNotificationsService]
    });
  });

  it('should ...', inject([ChatNotificationsService], (service: ChatNotificationsService) => {
    expect(service).toBeTruthy();
  }));
});

import { Directive, HostListener } from '@angular/core';
import { NotificationService } from '../services/notifications/notification.service';

@Directive({
  selector: '[appFeedbackForm]'
})
export class FeedbackFormDirective {

  constructor(protected notificationService: NotificationService) { }

  @HostListener('click', ['$event']) clicked() {
    this.notificationService.openFeedbackForm();
  }

}

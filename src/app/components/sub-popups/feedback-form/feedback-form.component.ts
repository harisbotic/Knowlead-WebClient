import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NotificationService } from '../../../services/notifications/notification.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent extends BaseComponent implements OnInit {

  @Output() closed = new EventEmitter<any>();
  opened = true;
  form = new FormGroup({
    text: new FormControl('', [Validators.required])
  });

  constructor(protected http: Http,
      protected notificationService: NotificationService,
      protected analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
  }

  openChanged(newOpen: boolean) {
    if (!newOpen) {
      this.form.reset();
      this.closed.emit();
    }
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.analyticsService.sendFeedback(this.form.value.text).subscribe(() => {
      this.notificationService.info('feedback|success');
    }, (err) => {
      this.notificationService.error('feedback|error', err);
    });
    this.closed.emit();
  }

}

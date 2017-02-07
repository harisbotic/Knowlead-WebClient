import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NotificationService } from '../../../services/notifications/notification.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { BaseFormComponent } from '../../../base-form.component';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent extends BaseComponent implements OnInit {

  opened: boolean;
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
    }
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.analyticsService.sendFeedback(this.form.value.text).subscribe(() => {
      this.notificationService.info('feedback|success');
      this.form.reset();
    }, (err) => {
      this.notificationService.error('feedback|error', err);
    });
    this.opened = false;
  }

}

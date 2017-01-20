import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NotificationService } from '../../services/notification.service';
import { FEEDBACK } from '../../utils/urls';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {

  opened: boolean;
  form = new FormGroup({
    text: new FormControl('', [Validators.required])
  });

  constructor(protected http: Http, protected notificationService: NotificationService) { }

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
    this.http.post(FEEDBACK, this.form.value).subscribe(() => {
      this.notificationService.info('feedback|success');
      this.form.reset();
    }, (err) => {
      this.notificationService.error('feedback|error', err);
    });
    this.opened = false;
  }

}

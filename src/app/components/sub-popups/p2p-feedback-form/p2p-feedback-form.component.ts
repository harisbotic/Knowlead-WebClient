import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BaseFormComponent } from '../../../base-form.component';
import { P2PFeedbackModel } from '../../../models/dto';
import { FeedbackService } from '../../../services/feedback.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-p2p-feedback-form',
  templateUrl: './p2p-feedback-form.component.html',
  styleUrls: ['./p2p-feedback-form.component.scss']
})
export class P2pFeedbackFormComponent extends BaseFormComponent<P2PFeedbackModel> implements OnInit {
  helpfulFeedback: number;
  expertiseFeedback: number;

  @Input() p2pId: number;
  @Output() closed = new EventEmitter<any>();

  opened = true;

  constructor(protected feedbackService: FeedbackService,
              protected notificationService: NotificationService) { super(); }

  submit() {
    return this.feedbackService.giveP2pFeedback(this.getValue());
  }

  onSubmitSuccess(result: any) {
    this.restartForm();
    this.closed.emit();
  }

  onSubmitError(err: any) {
    this.notificationService.error('Error giving feedback', err);
  }

  getNewValue(): P2PFeedbackModel {
    return {
      p2pId: this.p2pId,
      helpful: undefined,
      expertise: undefined,
      feedbackText: undefined,

      p2p: undefined,
      feedbackId: undefined,
      teacherReply: undefined,
      teacherId: undefined,
      teacher: undefined,
      fosId: undefined,
      fos: undefined,
      studentId: undefined,
      student: undefined,
      createdAt: undefined,
    };
  }

  getNewForm(): FormGroup {
    return new FormGroup({
      p2pId: new FormControl('', Validators.required),
      helpful: new FormControl('', Validators.required),
      expertise: new FormControl('', Validators.required),
      feedbackText: new FormControl('', Validators.required)
    });
  }

  getValue() {
    return Object.assign(super.getValue(), {
      helpful: this.helpfulFeedback,
      expertise: this.expertiseFeedback
    });
  }

}

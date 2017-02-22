import { Component, OnInit, Input } from '@angular/core';
import { P2PModel, ApplicationUserModel, ResponseModel, P2PStatus, P2PFeedbackModel } from '../../../models/dto';
import { AccountService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { RealtimeService } from '../../../services/realtime.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../base-form.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.scss'],
  providers: [FeedbackService]
})
export class P2pComponent extends BaseFormComponent<P2PFeedbackModel> implements OnInit {

  _p2p: P2PModel;
  _p2pId: number;
  callable: boolean;

  @Input() set p2pId(value: number) {
    if (typeof(value) === 'string') {
      value = parseInt(value, 10);
    }
    this._p2pId = value;
    if (value != null) {
      this.subscriptions.push(this.p2pService.get(value).subscribe((p2p) => {
        this._p2p = p2p;
        this.refresh();
      }));
    } else {
      this._p2p = null;
    }
  };
  get p2pId(): number {
    return this._p2pId;
  }

  get p2p(): P2PModel {
    return this._p2p;
  };

  user: ApplicationUserModel;
  P2PStatus = P2PStatus;
  modalOpened = false;

  helpfulFeedback: number;
  expertiseFeedback: number;

  constructor(protected accountService: AccountService,
              protected storageService: StorageService,
              protected p2pService: P2pService,
              protected notificationService: NotificationService,
              protected modelUtilsService: ModelUtilsService,
              protected realtimeService: RealtimeService,
              protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected feedbackService: FeedbackService) {
    super();
  }

  closeModal() {
    this.modalOpened = false;
  }

  checkClose() {
    if (!this.modalOpened) {
      this.closeModal();
    }
  }

  submit() {
    this.feedbackService.giveP2pFeedback(this.getValue()).subscribe(() => {
      this.restartForm();
      this.closeModal();
    }, (err) => {
      this.notificationService.error('Error giving feedback', err);
    });
  }

  getNewValue(): P2PFeedbackModel {
    delete this.helpfulFeedback;
    delete this.expertiseFeedback;
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
      student: undefined
    };
  }

  refreshFeedback() {
    this.form.patchValue({
      helpful: this.helpfulFeedback,
      expertise: this.expertiseFeedback
    });
  }

  getNewForm(): FormGroup {
    return new FormGroup({
      p2pId: new FormControl('', Validators.required),
      helpful: new FormControl('', Validators.required),
      expertise: new FormControl('', Validators.required),
      feedbackText: new FormControl('', Validators.required)
    });
  }

  refresh() {
    if (!this.user || !this.p2p) {
      return;
    }
    this.callable = !this.p2p.isDeleted && !!this.p2p.scheduledWithId && this.p2p.createdById === this.user.id;
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.user = user;
      this.refresh();
    }));
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.modalOpened = params['feedback'] === 'true';
    }));
  }

  bookmark() {
    if (this.user && this.p2p.createdById !== this.user.id) {
      this.p2pService.bookmark(this.p2p).subscribe(undefined, err => {
        this.notificationService.error('Error bookmarking', err);
      });
    }
  }

  deleted() {
    this.subscriptions.push(this.p2pService.delete(this.p2p).subscribe(undefined, (error: ResponseModel) => {
      this.notificationService.error('p2p|delete fail', error && error.errors ? error.errors[0] : undefined);
    }));
  }

  deletable(): boolean {
    if (this.p2p.isDeleted) {
      return false;
    }
    return (this.user) ? this.user.id === this.p2p.createdById : false;
  }

  callOrFeedback() {
    if (this.p2p.status === P2PStatus.Finished) {
      this.modalOpened = true;
    } else {
      this.realtimeService.call(this.p2p.p2pId);
    }
  }

}

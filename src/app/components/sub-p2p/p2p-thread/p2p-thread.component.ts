import { Component, Input, OnInit } from '@angular/core';
import { ThreadModel } from '../p2p-discussion/p2p-discussion.component';
import { P2PMessageModel, P2PStatus, ApplicationUserModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { dateValidator } from '../../../validators/date.validator';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-p2p-thread',
  templateUrl: './p2p-thread.component.html',
  styleUrls: ['./p2p-thread.component.scss']
})
export class P2pThreadComponent extends BaseFormComponent<P2PMessageModel> implements OnInit {

  @Input() _thread: ThreadModel;
  @Input() openCode = 0; // When this code equals to number of messages then new offer form is displayed
  @Input() set thread(value: ThreadModel) {
    this._thread = value;
    this.schedulable = this.thread.withId !== this.thread.p2p.createdById &&
      this.thread.p2p.scheduledWithId == null && !this.thread.p2p.isDeleted;
    for (let i = 0; i < value.messages.length; i++) {
      value.messages[i]['last'] = i === value.messages.length - 1;
    }
  }
  get thread() {
    return this._thread;
  }

  schedulable: boolean;
  fullName = ModelUtilsService.getUserFullName;
  user: ApplicationUserModel;
  P2PStatus = P2PStatus;

  constructor(
      protected p2pService: P2pService,
      protected notificationService: NotificationService,
      protected accountService: AccountService) {
    super();
  }

  getNewForm() {
    return new FormGroup({
      text: new FormControl(undefined, Validators.required),
      dateTimeOffer: new FormControl(undefined, [Validators.required, dateValidator({minDate: new Date()})]),
      priceOffer: new FormControl(undefined, Validators.required),
      p2pId: new FormControl(undefined),
      messageToId: new FormControl(undefined)
    });
  }

  getNewValue(): P2PMessageModel {
    let lastPrice = this.thread.p2p.initialPrice;
    let lastDate = undefined;
    for (let message of this.thread.messages) {
      lastPrice = message.priceOffer;
      lastDate = message.dateTimeOffer;
    }
    return {
      text: '',
      dateTimeOffer: lastDate,
      priceOffer: lastPrice,
      p2pId: this.thread.p2p.p2pId,
      messageToId: this.thread.withId,

      p2pMessageId: undefined,
      timestamp: undefined,
      p2p: undefined,
      messageTo: undefined,
      messageFrom: undefined,
      messageFromId: undefined
    };
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.subscriptions.push(this.p2pService.message(this.getValue()).subscribe(() => {
      this.restartForm();
    }, (err) => {
      this.notificationService.error('Error posting message', err);
    }));
  }

  schedule() {
    this.p2pService.schedule(this.thread.messages[this.thread.messages.length - 1]).subscribe(undefined, (err) => {
      this.notificationService.error('Error scheduling', err);
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user = user));
  }

}

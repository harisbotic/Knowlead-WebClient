import { Component, Input, OnInit } from '@angular/core';
import { ThreadModel } from '../p2p-discussion/p2p-discussion.component';
import { P2PMessageModel, P2PStatus, ApplicationUserModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { dateValidator } from '../../../validators/date.validator';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { AccountService } from '../../../services/account.service';
import { RealtimeService } from '../../../services/realtime.service';

@Component({
  selector: 'app-p2p-thread',
  templateUrl: './p2p-thread.component.html',
  styleUrls: ['./p2p-thread.component.scss']
})
export class P2pThreadComponent extends BaseFormComponent<P2PMessageModel> implements OnInit {

  @Input() _thread: ThreadModel;
  openCode = 0; // When this code equals to number of messages then new offer form is displayed
  @Input() set thread(value: ThreadModel) {
    if (this._thread && value && this._thread.messages.length === this.openCode) {
      this.openCode = value.messages.length;
    }
    this._thread = value;
    this.schedulable = this.thread.withId !== this.thread.p2p.createdById &&
      this.thread.p2p.scheduledWithId == null && !this.thread.p2p.isDeleted;
    this.refresh();
  }
  get thread() {
    return this._thread;
  }

  schedulable: boolean;
  user: ApplicationUserModel;
  P2PStatus = P2PStatus;
  isMyP2p: boolean;

  constructor(
      protected p2pService: P2pService,
      protected notificationService: NotificationService,
      protected accountService: AccountService,
      protected realtimeService: RealtimeService) {
    super();
  }

  refresh() {
    if (this.user && this.thread && this.thread.p2p) {
      this.isMyP2p = this.user.id === this.thread.p2p.createdById;
    }
    let i;
    for (i = 0; i < this.thread.messages.length; i++) {
      this.thread.messages[i]['last'] = this.thread.messages.length - 1 === i;
    }
    for (i = this.thread.messages.length - 1; i >= 0 && this.thread.messages[i].offerAcceptedId; i--) {
      this.thread.messages[i]['last'] = true;
    }
    if (i >= 0 && i < this.thread.messages.length - 1 && this.isMyP2p) {
      this.thread.messages[i]['scheduleOverride'] = true;
      this.thread.messages[i]['last'] = true;
    }
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

      offerAcceptedId: undefined,
      p2pMessageId: undefined,
      timestamp: undefined,
      p2p: undefined,
      messageTo: undefined,
      messageFrom: undefined,
      messageFromId: undefined,
      offerAccepted: undefined,
    };
  }

  submit() {
    this.subscriptions.push(this.p2pService.message(this.getValue()).delay(100).subscribe(() => {
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

  accept() {
    this.p2pService.acceptOffer(this.thread.messages[this.thread.messages.length - 1]).subscribe(undefined, (err) => {
      this.notificationService.error('Error accepting', err);
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.user = user;
      this.refresh();
    }));
  }

  acceptOrSchedule() {
    if (this.isMyP2p) {
      this.schedule();
    } else {
      this.accept();
    }
  }

}

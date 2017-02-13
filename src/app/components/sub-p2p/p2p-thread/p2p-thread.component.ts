import { Component, Input } from '@angular/core';
import { ThreadModel } from '../p2p-discussion/p2p-discussion.component';
import { P2PMessageModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { dateValidator } from '../../../validators/date.validator';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';

@Component({
  selector: 'app-p2p-thread',
  templateUrl: './p2p-thread.component.html',
  styleUrls: ['./p2p-thread.component.scss']
})
export class P2pThreadComponent extends BaseFormComponent<P2PMessageModel> {

  @Input() thread: ThreadModel;

  fullName = ModelUtilsService.getUserFullName;

  constructor(protected p2pService: P2pService, protected notificationService: NotificationService) { super(); }

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
    let lastPrice = this.thread.initialPrice;
    let lastDate = undefined;
    for (let message of this.thread.messages) {
      lastPrice = message.priceOffer;
      lastDate = message.dateTimeOffer;
    }
    return {
      text: '',
      dateTimeOffer: lastDate,
      priceOffer: lastPrice,
      p2pId: this.thread.p2pId,
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

}

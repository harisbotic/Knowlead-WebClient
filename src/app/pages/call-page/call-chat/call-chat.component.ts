import { Component, OnInit, OnDestroy } from '@angular/core';
import { Guid, ApplicationUserModel, ChatMessageModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute } from '@angular/router';
import { RealtimeService } from '../../../services/realtime.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-call-chat',
  templateUrl: './call-chat.component.html',
  styleUrls: ['./call-chat.component.scss']
})
export class CallChatComponent extends BaseFormComponent<ChatMessageModel> implements OnInit, OnDestroy {

  user: ApplicationUserModel;
  messages: ChatMessageModel[] = [];
  callId: Guid;

  cacheKey: string;

  constructor(protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected realtimeService: RealtimeService,
    protected storageService: StorageService) { super(); }

  protected addMessage(message: ChatMessageModel) {
    this.messages = [message].concat(this.messages);
  }

  ngOnInit() {
    super.ngOnInit();
    this.accountService.currentUser().subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(this.activatedRoute.parent.params.subscribe(params => {
      this.callId = params['id'];
      this.cacheKey = 'call-chat-' + this.callId;
      if (this.storageService.temporaryCache[this.cacheKey]) {
        this.messages = this.storageService.temporaryCache[this.cacheKey];
      }
      if (this.form) {
        this.restartForm();
      }
    }));
    this.subscriptions.push(this.realtimeService.callMessageSubject.subscribe(msg => {
      this.addMessage(msg);
    }));
  }

  getNewForm(): FormGroup {
    return new FormGroup({
      message: new FormControl('', Validators.required),
      sendToId: new FormControl('', Validators.required)
    });
  }

  getNewValue(): ChatMessageModel {
    return {
      message: '',
      sendToId: this.callId,

      rowKey: undefined,
      senderId: undefined,
      timestamp: undefined
    };
  }

  submit() {
    this.realtimeService.sendCallMsg(this.getValue());
    this.restartForm();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.storageService.temporaryCache[this.cacheKey] = this.messages;
  }

}

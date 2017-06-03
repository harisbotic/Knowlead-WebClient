import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationUserModel, ChatMessageModel, FriendshipModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { Observable } from 'rxjs/Rx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService, ConverisationMessageModel } from '../../../services/chat.service';
import { AccountService } from '../../../services/account.service';

interface ExtendedConverisationMessage extends ConverisationMessageModel {
  isMine: boolean;
  from: ApplicationUserModel;
  showProfile: boolean;
}

@Component({
  selector: 'app-chat-converisation',
  templateUrl: './chat-converisation.component.html',
  styleUrls: ['./chat-converisation.component.scss']
})
export class ChatConverisationComponent extends BaseFormComponent<ChatMessageModel> implements OnInit {

  @Input() user: ApplicationUserModel;
  @Output() close = new EventEmitter();
  me: ApplicationUserModel;
  @ViewChild('chatInput') chatInput: ElementRef;

  opened = false;
  isEmpty = true;
  friendship: FriendshipModel;
  focused: boolean;

  constructor(protected chatService: ChatService, protected accountService: AccountService) { super(); }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.chatService.allMessagesSubject.subscribe(message => {
      if (message.converisation === this.user.id) {
        this.open();
      }
    }));
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => {
      this.me = user;
    }));
    this.subscriptions.push(this.chatService.getFriendshipStatus(this.user.id).subscribe(friendship => {
      this.friendship = friendship;
    }));
  }

  get chatElement(): HTMLInputElement {
    return (this.chatInput) ? this.chatInput.nativeElement : undefined;
  }

  closed(event: MouseEvent) {
    event.cancelBubble = true;
    this.close.emit();
  }

  open() {
    this.opened = true;
    setTimeout(this.focus.bind(this), 200);
  }

  minimize() {
    this.opened = false;
  }

  toggleOpen() {
    if (this.opened) {
      this.minimize();
    } else {
      this.open();
    }
  }

  focus() {
    if (this.chatElement) {
      this.chatElement.focus();
    } else {
      console.warn('Chat element not found, cannot focus');
    }
  }

  getNewValue(): ChatMessageModel {
    return {
      recipientId: this.user.id,
      message: '',

      senderId: undefined,
      rowKey: undefined,
      timestamp: undefined
    };
  }
  getNewForm(): FormGroup {
    return new FormGroup({
      recipientId: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }
  submit() {
    this.chatService.sendMessage(this.getValue());
    this.restartForm();
  }
  getConverisation(): Observable<ExtendedConverisationMessage[]> {
    return this.chatService.getConverisation(this.user.id)
      .map(messages => messages.map(this.extendMessage.bind(this))
        .map((extended: ExtendedConverisationMessage, index) => {
          extended.showProfile = index === messages.length - 1 || messages[index].senderId !== messages[index + 1].senderId;
          return extended;
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      )
      .do(messages => {
        this.isEmpty = messages.length === 0;
      });
  }

  private extendMessage(message: ConverisationMessageModel): ExtendedConverisationMessage {
    const ret: ExtendedConverisationMessage = <any>message;
    if (this.me && this.user) {
      ret.from = (message.senderId === this.me.id) ? this.me : this.user;
      ret.isMine = message.senderId === this.me.id;
    }
    return ret;
  }

}

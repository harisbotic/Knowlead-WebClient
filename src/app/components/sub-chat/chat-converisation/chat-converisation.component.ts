import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationUserModel, NewChatMessage } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { Observable } from 'rxjs/Rx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-converisation',
  templateUrl: './chat-converisation.component.html',
  styleUrls: ['./chat-converisation.component.scss']
})
export class ChatConverisationComponent extends BaseFormComponent<NewChatMessage> {

  @Input() user: ApplicationUserModel;
  @Output() close = new EventEmitter();

  opened = false;

  constructor(protected chatService: ChatService) { super(); }

  closed() {
    this.close.emit();
  }

  open() {
    this.opened = true;
  }

  toggleOpen() {
    this.opened = !this.opened;
  }

  getNewValue(): NewChatMessage | Observable<NewChatMessage> {
    return {
      sendToId: this.user.id,
      message: ''
    };
  }
  getNewForm(): FormGroup {
    return new FormGroup({
      sendToId: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }
  submit() {
    console.log(this.getValue());
    this.chatService.sendMessage(this.getValue());
    this.restartForm();
  }

}

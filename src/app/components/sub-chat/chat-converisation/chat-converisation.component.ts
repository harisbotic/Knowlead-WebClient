import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationUserModel } from '../../../models/dto';

@Component({
  selector: 'app-chat-converisation',
  templateUrl: './chat-converisation.component.html',
  styleUrls: ['./chat-converisation.component.scss']
})
export class ChatConverisationComponent implements OnInit {

  @Input() user: ApplicationUserModel;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closed() {
    this.close.emit();
  }

}

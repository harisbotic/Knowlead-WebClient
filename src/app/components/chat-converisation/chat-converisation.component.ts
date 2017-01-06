import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationUserModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';

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

  fullName = ModelUtilsService.getUserFullName;

  closed() {
    this.close.emit();
  }

}
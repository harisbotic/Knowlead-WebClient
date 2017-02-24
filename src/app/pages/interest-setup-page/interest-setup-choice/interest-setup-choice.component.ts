import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InterestModel, FOSModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-interest-setup-choice',
  templateUrl: './interest-setup-choice.component.html',
  styleUrls: ['./interest-setup-choice.component.scss']
})
export class InterestSetupChoiceComponent extends BaseComponent {

  @Output() remove = new EventEmitter<FOSModel>();
  @Input() interest: InterestModel;

  constructor() { super(); }

  removed() {
    this.remove.emit(this.interest.fos);
  }

}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InterestModel, FOSModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-interest-setup-choice',
  templateUrl: './interest-setup-choice.component.html',
  styleUrls: ['./interest-setup-choice.component.scss']
})
export class InterestSetupChoiceComponent extends BaseComponent implements OnInit {

  @Output() remove = new EventEmitter<FOSModel>();
  constructor() { super(); }
  @Input() interest: InterestModel = {
    fosId:0,
    fos: {
      name: "MY CHOICE No1",
      children: [],
      parentFosId: -1,
      coreLookupId: 0,
      code: "testni primjer",
      parent: null
    },
    stars:0
  };
  niz: string[] = [
    "interest-setup|very low",
    "interest-setup|low",
    "interest-setup|good",
    "interest-setup|very good",
    "interest-setup|excellent"
  ];  
  ngOnInit() {
  }
  removed() {
    this.remove.emit(this.interest.fos);
  }

}

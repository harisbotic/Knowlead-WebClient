import { Component, OnInit, Input } from '@angular/core';
import { InterestModel } from '../models/dto';

@Component({
  selector: 'app-interest-setup-choice',
  templateUrl: './interest-setup-choice.component.html',
  styleUrls: ['./interest-setup-choice.component.scss']
})
export class InterestSetupChoiceComponent implements OnInit {

  constructor() { }
@Input() interest: InterestModel = { fosId:0, fos:{name:"MY CHOICE No1",children:[], parentFosId:-1,coreLookupId:0, code:"testni primjer"},stars:0};
  niz: string[] = ["interest-setup:very low", "interest-setup:low", "interest-setup:good", "interest-setup:very good", "interest-setup:excellent"];  
  ngOnInit() {
  }

}

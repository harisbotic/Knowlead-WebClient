import { Component, OnInit } from '@angular/core';
import { ConfirmEmail } from '../models';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss']
})
export class ConfirmEmailPageComponent implements OnInit {
  confirm: ConfirmEmail = new ConfirmEmail(); 
  constructor() { }

  ngOnInit() {
  }

}

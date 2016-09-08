import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ConfirmEmail } from '../models';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss']
})
export class ConfirmEmailPageComponent implements OnInit {
  confirm: ConfirmEmail = new ConfirmEmail();
  constructor(protected route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params:any) => {
      this.confirm.code = params.code;
      this.confirm.email = params.email;
    })
  }

}

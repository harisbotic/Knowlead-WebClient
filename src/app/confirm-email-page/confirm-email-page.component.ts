import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ConfirmEmail, ErrorModel } from '../models';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: [AccountService]

})
export class ConfirmEmailPageComponent implements OnInit {
  confirm: ConfirmEmail = new ConfirmEmail();
  errors: ErrorModel[];
  constructor(protected route:ActivatedRoute,  protected accountService: AccountService) { }

  confirmEmail(){
    this.accountService.confirmEmail(this.confirm).subscribe((result) => {
      
    },(errorResult)=>{
      this.errors = errorResult.json().errorList;
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params:any) => {
      this.confirm.code = params.code;
      this.confirm.email = params.email;
    })
  }

}

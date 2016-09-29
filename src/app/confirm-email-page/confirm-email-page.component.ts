import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AccountService } from './../account.service';
import { ConfirmEmailModel, ErrorModel } from './../models/dto';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: [AccountService]

})
export class ConfirmEmailPageComponent implements OnInit {
  confirm: ConfirmEmailModel;
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
      this.confirm = {code: params.code, email: params.email, password: ""};
      this.confirm.code = params.code;
      this.confirm.email = params.email;
    })
  }

}

import { Component } from '@angular/core';
import { AccountService } from './../account.service';
import { RegisterUserModel, ResponseModel } from './../models/dto';
import { FrontendErrorCodes } from './../models/frontend.constants';
import { safeJsonExtraction } from './../utils/converters';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [AccountService]
})
export class RegisterPageComponent {

  test: string  = "";
  busy: boolean = false;
  cridentials: RegisterUserModel = {email: "", password: ""};
  response: ResponseModel;

  constructor(protected accountService: AccountService) {
  }

  register() {

    if(this.test != this.cridentials.password)
     { 
      this.response = <ResponseModel>{errors: [FrontendErrorCodes.passwordsDontMatch]}
      return;  
     }

    this.busy = true;
    this.accountService.register (this.cridentials).finally(() => { this.busy = false; })
      .subscribe((response) => {
        this.response = response;
      },(errorResponse) => {
        this.response = errorResponse;
      });
  }

}

import { Component } from '@angular/core';
import { AccountService } from './../account.service';
import { RegisterUserModel, ResponseModel } from './../models/dto';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [AccountService]
})
export class RegisterPageComponent {

  busy: boolean = false;
  cridentials: RegisterUserModel = {email: "", password: ""};
  response: ResponseModel;

  constructor(protected accountService: AccountService) {
  }

  register() {
    this.busy = true;
    this.accountService.register (this.cridentials).finally(() => { this.busy = false; })
      .subscribe((response) => {
        this.response = response;
      },(errorResponse) => {
        this.response = errorResponse.json();
        console.log(this.response);
      });
  }

}

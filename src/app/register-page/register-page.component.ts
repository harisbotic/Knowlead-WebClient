import { Component } from '@angular/core';
import { RegisterModel, ActionResponse } from "../models";
import { AccountService } from './../account.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [AccountService]
})
export class RegisterPageComponent {

  cridentials: RegisterModel = new RegisterModel();
  response: ActionResponse;

  constructor(protected accountService: AccountService) {
  }

  register() {
    this.accountService.register(this.cridentials).subscribe((response) => {
      this.response = response;
    },(errorResponse) => {
      this.response = errorResponse.json();
    });
  }

}

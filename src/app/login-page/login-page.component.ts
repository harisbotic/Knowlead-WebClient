import { Component } from '@angular/core';
import { SessionService } from "../session.service";
import { LoginModel, ErrorModel, LoginResponse } from "../models";
import { Observable } from "rxjs/observable";
import "rxjs/Rx"

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: []
})
export class LoginPageComponent {

  success: boolean = false;
  busy: boolean = false;
  error: ErrorModel;
  cridentials: LoginModel;

  constructor(protected sessionService: SessionService) {
    this.cridentials = new LoginModel("", "");
  }

  loginClicked() {
    this.busy = true;
    delete this.error;
    this.sessionService.login(this.cridentials).finally(() => {
      this.busy = false;
    }).subscribe(loginResponse => {
      this.error = ErrorModel.fromLoginResponse(loginResponse);
    });
  }
}

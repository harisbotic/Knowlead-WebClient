import { Component } from '@angular/core';
import { SessionService } from "../session.service";
import { Observable } from "rxjs/observable";
import "rxjs/Rx"
import { Router } from '@angular/router';
import { ErrorModel, RegisterUserModel } from './../models/dto';
import { responseToErrorModel, loginResponseToErrorModel } from './../utils/converters';

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
  cridentials: RegisterUserModel;

  constructor(protected sessionService: SessionService, protected router: Router) {
    this.cridentials = {email: "", password: ""};
  }

  loginClicked() {
    this.busy = true;
    delete this.error;
    this.sessionService.login(this.cridentials).finally(() => {
      this.busy = false;
    }).subscribe(loginResponse => {
      this.error = loginResponseToErrorModel(loginResponse);
      if (this.error == undefined) {
        this.router.navigate(["/home"]);
      }
    });
  }
}

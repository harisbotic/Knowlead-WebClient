import { Component } from '@angular/core';
import { SessionService } from "../../services/session.service";
import "rxjs/Rx"
import { Router } from '@angular/router';
import { ResponseModel, RegisterUserModel } from './../../models/dto';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: []
})
export class LoginPageComponent {

  success: boolean = false;
  busy: boolean = false;
  response: ResponseModel;
  cridentials: RegisterUserModel;

  constructor(protected sessionService: SessionService, protected router: Router) {
    this.cridentials = {email: "", password: ""};
  }

  loginClicked() {
    this.busy = true;
    delete this.response;
    this.sessionService.login(this.cridentials).finally(() => {
      this.busy = false;
    }).subscribe(loginResponse => {
      this.router.navigate(["/home"]);
    }, (errorResponse) => {
      this.response = errorResponse;
    });
  }
}

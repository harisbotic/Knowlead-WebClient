import { Component } from '@angular/core';
import { SessionService } from "../session.service";
import { LoginModel } from "../models";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [SessionService]
})
export class LoginPageComponent {

  success: boolean = false;
  tried: boolean = false;
  errorDescription: string;
  cridentials: LoginModel;

  constructor(protected sessionService: SessionService) { 
    this.cridentials = new LoginModel("", "");
  }


  loginClicked() {
    this.sessionService.login(this.cridentials).subscribe(loginModel => {
      this.success = loginModel.error == null;
      this.errorDescription = loginModel.error_description;
    },errorModel => {}, () => {
      this.tried = true;
    });
  }

}

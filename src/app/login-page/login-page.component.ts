import { Component, AfterContentInit } from '@angular/core';
import { SessionService } from "../session.service";
import { LoginModel } from "../models";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [SessionService]
})
export class LoginPageComponent implements AfterContentInit {

  success: boolean = false;
  tried: boolean = false;
  errorDescription: string;

  constructor(protected sessionService: SessionService) { 
  }

  ngAfterContentInit() {
    this.sessionService.login(new LoginModel("neki_tamo", "Password123.")).subscribe(loginModel => {
      this.success = loginModel.error == null;
      this.errorDescription = loginModel.error_description;
    },errorModel => {}, () => {
      this.tried = true;
    });
  }

}

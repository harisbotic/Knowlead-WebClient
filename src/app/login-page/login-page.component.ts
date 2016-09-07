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

  constructor(protected sessionService: SessionService) { 
  }

  ngAfterContentInit() {
    this.sessionService.login(new LoginModel("neki_tamo", "hepek")).subscribe(action => {
      this.success = action.success;
      this.tried = true;
    });
  }

}

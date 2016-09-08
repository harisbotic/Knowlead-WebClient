import { Component } from '@angular/core';
import { SessionService } from '../session.service';
import { RegisterModel, ActionResponse } from "../models";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [SessionService]
})
export class RegisterPageComponent {

  cridentials: RegisterModel = new RegisterModel();
  response: ActionResponse;

  constructor(protected sessionService: SessionService) {
    console.log(this.response);
  }

  register() {
    this.sessionService.register(this.cridentials).subscribe((response) => {
      this.response = response;
    },(errorResponse) => {
      this.response = errorResponse.json();
    });
  }

}

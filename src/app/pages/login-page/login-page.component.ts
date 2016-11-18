import { Component, OnInit } from '@angular/core';
import { SessionService } from "../../services/session.service";
import "rxjs/Rx"
import { Router } from '@angular/router';
import { ResponseModel, RegisterUserModel } from './../../models/dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: []
})
export class LoginPageComponent implements OnInit {

  success: boolean = false;
  busy: boolean = false;
  response: ResponseModel;
  form: FormGroup;

  constructor(protected sessionService: SessionService, protected router: Router) {
  }

  loginClicked() {
    console.log(this.form.controls['email'].errors);
    this.busy = true;
    delete this.response;
    this.sessionService.login(this.form.value).finally(() => {
      this.busy = false;
    }).subscribe(loginResponse => {
      this.router.navigate(["/home"]);
    }, (errorResponse) => {
      this.response = errorResponse;
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
  }
}

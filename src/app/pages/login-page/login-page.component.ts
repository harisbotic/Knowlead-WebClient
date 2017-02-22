import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import { ResponseModel } from './../../models/dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../base-form.component';
import { LoginUserModel } from '../../models/frontend.models';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: []
})
export class LoginPageComponent extends BaseFormComponent<LoginUserModel> implements OnInit {

  response: ResponseModel;
  form: FormGroup;
  busy: boolean;

  constructor(protected sessionService: SessionService, protected router: Router) {
    super();
  }

  submit() {
    this.busy = true;
    delete this.response;
    this.subscriptions.push(this.sessionService.login(this.form.value).finally(() => {
      this.busy = false;
    }).subscribe(loginResponse => {
      this.router.navigate(['/home']);
    }, (errorResponse) => {
      this.response = errorResponse;
    }));
  }

  getNewForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  getNewValue() {
    return {
      email: '',
      password: ''
    };
  }
}

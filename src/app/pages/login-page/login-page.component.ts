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

  form: FormGroup;
  busy: boolean;

  constructor(protected sessionService: SessionService, protected router: Router) {
    super();
  }

  onSubmitSuccess(result: any) {
    this.router.navigate(['/home']);
  }

  onSubmitError(err: any) {
    // console.warn('Error handler in Login Page was not implemented');
  }

  submit() {
    return this.sessionService.login(this.form.value);
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

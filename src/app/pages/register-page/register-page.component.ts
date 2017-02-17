import { Component, OnInit, DoCheck } from '@angular/core';
import { AccountService } from './../../services/account.service';
import { ResponseModel } from './../../models/dto';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PATTERN_EMAIL, PATTERN_ONE_LOWERCASE } from '../../utils/index';
import { RegisterUserModel } from '../../models/dto';
import { BaseFormComponent } from '../../base-form.component';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: []
})
export class RegisterPageComponent extends BaseFormComponent<RegisterUserModel> implements OnInit, DoCheck {

  busy = false;
  response: ResponseModel;
  form: FormGroup;
  referral: string;

  constructor(protected accountService: AccountService,
              protected router: Router,
              protected route: ActivatedRoute) {
    super();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.busy = true;
    this.subscriptions.push(this.accountService.register(this.form.value).finally(() => { this.busy = false; })
      .subscribe((response) => {
        this.response = response;
        this.router.navigate(['/registerSuccess']);
      }, (errorResponse) => {
        this.response = errorResponse;
      }
    ));
  }

  getNewForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(PATTERN_EMAIL)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PATTERN_ONE_LOWERCASE)
      ]),
      referralUserId: new FormControl(undefined),
      confirmpassword: new FormControl('')
    });
  }

  getNewValue(): Observable<RegisterUserModel> {
    return this.route.queryParams.map(params => {
      return {
        referralUserId: params['ref'],
        email: '',
        password: ''
      };
    });
  }

  ngDoCheck() {
    if (this.form && this.form.controls['confirmpassword'].value !== this.form.controls['password'].value) {
      this.form.controls['confirmpassword'].setErrors({'passwords_dont_match': true});
    } else {
      this.form.controls['confirmpassword'].setErrors(null);
    }
  }
}

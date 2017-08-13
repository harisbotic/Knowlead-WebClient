import { Component, OnInit, DoCheck, ViewContainerRef } from '@angular/core';
import { AccountService } from './../../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PATTERN_EMAIL, PATTERN_ONE_LOWERCASE } from '../../utils/index';
import { RegisterUserModel, ResponseModel } from '../../models/dto';
import { BaseFormComponent } from '../../base-form.component';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: []
})
export class RegisterPageComponent extends BaseFormComponent<RegisterUserModel> implements OnInit, DoCheck {

  form: FormGroup;
  referral: string;

  constructor(protected accountService: AccountService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected ve: ViewContainerRef) {
    super();
  }

  submit() {
    return this.accountService.register(this.form.value);
  }

  onSubmitSuccess(result: any) {
    this.router.navigate(['/registerSuccess']);
  }

  onSubmitError(errorResponse: any) {
    if (errorResponse.formErrors && errorResponse.formErrors['email']) {
      this.errorResponse.errors.push(errorResponse.formErrors['email'][0]);
    }
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
      confirmpassword: new FormControl(''),
      terms: new FormControl(null, [Validators.requiredTrue])
    });
  }

  getNewValue(): Observable<RegisterUserModel> {
    return this.route.queryParams.map(params => {
      return {
        referralUserId: params['ref'],
        email: '',
        password: '',
        terms: false,
        confirmpassword: ''
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

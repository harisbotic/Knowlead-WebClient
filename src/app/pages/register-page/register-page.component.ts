import { Component, OnInit, DoCheck } from '@angular/core';
import { AccountService } from './../../services/account.service';
import { ResponseModel } from './../../models/dto';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PATTERN_EMAIL, PATTERN_ONE_LOWERCASE } from '../../utils/index';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [AccountService]
})
export class RegisterPageComponent extends BaseComponent implements OnInit, DoCheck {

  busy: boolean = false;
  response: ResponseModel;
  form: FormGroup;

  constructor(protected accountService: AccountService,
              protected router: Router) {
    super();
  }

  register() {
    if (!this.form.valid) {
      return;
    }

    this.busy = true;
    this.subscriptions.push(this.accountService.register(this.form.value).finally(() => { this.busy = false; })
      .subscribe((response) => {
        this.response = response;
        this.router.navigate(['/login']);
      }, (errorResponse) => {
        this.response = errorResponse;
      }
    ));
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(PATTERN_EMAIL)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PATTERN_ONE_LOWERCASE)
      ]),
      confirmpassword: new FormControl('')
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

interface ValidationResult {
    [key: string]: boolean;
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../base-form.component';
import { PasswordResetModel } from '../../models/dto';
import { PATTERN_ONE_LOWERCASE } from '../../utils/index';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notifications/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseFormComponent<PasswordResetModel> implements OnInit {

  form: FormGroup;
  areDiff: boolean;
  errMsg: boolean;

  constructor(protected accountService: AccountService,
              protected route: ActivatedRoute,
              protected notificationService: NotificationService,
              protected router: Router) { super(); }

  getNewForm () {
    return new FormGroup({
      newPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PATTERN_ONE_LOWERCASE)
      ]),
      newPassRe: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PATTERN_ONE_LOWERCASE)
      ]),
      token: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required)
    });
  }

  getNewValue(): Observable<PasswordResetModel> {
    return this.route.queryParams.map((params: any) => {
      return {token: params.token, email: params.email, newPassword: ''};
    });
  }

  areTheyDifferent () : boolean {
    if (this.form.get('newPassword').value === this.form.get('newPassRe').value) {
      return false;
    }
    return true;
  }

  submit () {
    if (this.areTheyDifferent()) {
      this.errMsg = true;
    } else {
      this.accountService.resetPassword(this.getValue()).subscribe(() => {
        this.errMsg = false;
        this.notificationService.info('Password Changed', 'Your password has been changed');
        this.router.navigate(['login']);
      });
    }
  }
}
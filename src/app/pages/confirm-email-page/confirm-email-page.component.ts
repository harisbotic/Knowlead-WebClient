import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from './../../services/account.service';
import { ConfirmEmailModel, ResponseModel } from './../../models/dto';
import { SessionService } from '../../services/session.service';
import { BaseFormComponent } from '../../base-form.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { NotificationService } from '../../services/notifications/notification.service';
import { joinTranslation } from '../../utils/translate-utils';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: []

})
export class ConfirmEmailPageComponent extends BaseFormComponent<ConfirmEmailModel> implements OnInit {
  constructor(protected route: ActivatedRoute,
              protected accountService: AccountService,
              protected sessionService: SessionService,
              protected router: Router,
              protected notificationService: NotificationService) {
    super();
  }

  getNewForm() {
    return new FormGroup({
      email: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  getNewValue(): Observable<ConfirmEmailModel> {
    return this.route.queryParams.map((params: any) => {
      return {code: params.code, email: params.email, password: ''};
    });
  }

  submit() {
    return this.accountService.confirmEmail(this.getValue());
  }

  onSubmitSuccess(result: any) {
    this.subscriptions.push(this.sessionService
      .login({email: this.getValue().email, password: this.getValue().password})
      .subscribe(() => {
        this.router.navigate(['/profilesetup']);
      }
    ));
  }

  onSubmitError(err: any) {
    this.notificationService.error(
      joinTranslation('confirm-email-page', 'error-confirming'),
      joinTranslation('confirm-email-page', 'error-confirming-text')
    );
  }
}

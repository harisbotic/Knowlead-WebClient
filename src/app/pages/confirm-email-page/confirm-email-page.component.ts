import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from './../../services/account.service';
import { ConfirmEmailModel, ResponseModel } from './../../models/dto';
import { SessionService } from '../../services/session.service';
import { BaseFormComponent } from '../../base-form.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: []

})
export class ConfirmEmailPageComponent extends BaseFormComponent<ConfirmEmailModel> implements OnInit {
  response: ResponseModel;
  constructor(protected route: ActivatedRoute,
              protected accountService: AccountService,
              protected sessionService: SessionService,
              protected router: Router) {
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
    this.subscriptions.push(this.accountService.confirmEmail(this.getValue()).subscribe((result) => {
      this.subscriptions.push(this.sessionService
        .login({email: this.getValue().email, password: this.getValue().password})
        .subscribe(() => {
          this.router.navigate(['/profilesetup']);
        }
      ));
    }, this.errorHandler));
  }

}

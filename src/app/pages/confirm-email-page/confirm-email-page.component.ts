import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from './../../services/account.service';
import { ConfirmEmailModel, ResponseModel } from './../../models/dto';
import { SessionService } from '../../services/session.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: []

})
export class ConfirmEmailPageComponent extends BaseComponent implements OnInit {
  confirm: ConfirmEmailModel;
  response: ResponseModel;
  constructor(protected route: ActivatedRoute,
              protected accountService: AccountService,
              protected sessionService: SessionService,
              protected router: Router) {
    super();
  }

  confirmEmail() {
    this.subscriptions.push(this.accountService.confirmEmail(this.confirm).subscribe((result) => {
      this.subscriptions.push(this.sessionService
        .login({email: this.confirm.email, password: this.confirm.password})
        .subscribe(() => {
          this.router.navigate(['/profilesetup']);
        }
      ));
    }, (errorResult) => {
      this.response = errorResult.json();
    }));
  }
  ngOnInit() {
    this.subscriptions.push(this.route.queryParams.subscribe((params: any) => {
      this.confirm = {code: params.code, email: params.email, password: ''};
      this.confirm.code = params.code;
      this.confirm.email = params.email;
    }));
  }

}

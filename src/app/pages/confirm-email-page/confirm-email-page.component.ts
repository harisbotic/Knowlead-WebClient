import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from './../../services/account.service';
import { ConfirmEmailModel, ResponseModel } from './../../models/dto';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: [AccountService]

})
export class ConfirmEmailPageComponent implements OnInit {
  confirm: ConfirmEmailModel;
  response: ResponseModel;
  constructor(protected route:ActivatedRoute,
              protected accountService: AccountService,
              protected sessionService: SessionService,
              protected router: Router) { }

  confirmEmail(){
    this.accountService.confirmEmail(this.confirm).subscribe((result) => {
      this.sessionService
        .login({email: this.confirm.email, password: this.confirm.password})
        .subscribe(() => {
          this.router.navigate(["/profilesetup"]);
        });
    },(errorResult)=>{
      this.response = errorResult.json();
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params:any) => {
      this.confirm = {code: params.code, email: params.email, password: ""};
      this.confirm.code = params.code;
      this.confirm.email = params.email;
    })
  }

}

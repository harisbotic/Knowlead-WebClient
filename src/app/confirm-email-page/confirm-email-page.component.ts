import { Component, OnInit } from '@angular/core';
import { ConfirmEmail, ErrorModel } from '../models';
import { SessionService} from '../session.service';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],

  providers: [SessionService]

})
export class ConfirmEmailPageComponent implements OnInit {
  confirm: ConfirmEmail = new ConfirmEmail();
  errors: ErrorModel[];
  constructor( protected sessionservice: SessionService) { }

  confirmEmail(){
    this.sessionservice.confirmEmail(this.confirm).subscribe((result) => {
      
    },(errorResult)=>{
      this.errors = errorResult.json().errorList;
    });
  }
  ngOnInit() {
  }

}

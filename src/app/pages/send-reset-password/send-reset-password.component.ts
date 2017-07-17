import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-send-reset-password',
  templateUrl: './send-reset-password.component.html',
  styleUrls: ['./send-reset-password.component.scss']
})
export class SendResetPasswordComponent implements OnInit {

  form: FormGroup;
  showError: boolean = false;
  sentSucc: boolean = false;

  constructor(protected accountService: AccountService) {
    this.form = new FormGroup({
      mail: new FormControl(null, [
        Validators.required,
        Validators.email
      ])
    });
   }

  ngOnInit() {

  }

  submitMail () {
    if (this.form.get('mail').valid) {
      this.accountService.getPasswordResetToken(this.form.get('mail').value).subscribe(() => {
        this.sentSucc = true;
      });
    }
  }
}

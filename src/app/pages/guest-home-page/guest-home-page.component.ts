import { Component, OnInit } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-guest-home-page',
  templateUrl: './guest-home-page.component.html',
  styleUrls: ['./guest-home-page.component.scss']
})
export class GuestHomePageComponent extends BaseComponent implements OnInit {

  constructor(protected realtimeService: RealtimeService, protected router: Router, protected accountService: AccountService) {
    super();
  }

  pritisno() {
    this.realtimeService.send();
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().take(1).subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
    }));
  }

}

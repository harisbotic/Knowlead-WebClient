import { Component, OnInit } from '@angular/core';
import { SubProfileBaseComponent } from '../sub-profile-base.component';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent extends SubProfileBaseComponent implements OnInit {
  constructor(accountService: AccountService, activatedRoute: ActivatedRoute) { super(accountService, activatedRoute); }
}

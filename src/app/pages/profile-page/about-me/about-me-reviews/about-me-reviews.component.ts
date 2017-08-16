import { Component, OnInit } from '@angular/core';
import { SubProfileBaseComponent } from '../../sub-profile-base.component';
import { AccountService } from '../../../../services/account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-me-reviews',
  templateUrl: './about-me-reviews.component.html',
  styleUrls: ['./about-me-reviews.component.scss']
})
export class AboutMeReviewsComponent extends SubProfileBaseComponent implements OnInit {
  reviews: any[];
  constructor(accountService: AccountService, activatedRoute: ActivatedRoute) { super(accountService, activatedRoute); }
}

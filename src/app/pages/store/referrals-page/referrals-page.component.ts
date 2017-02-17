import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { BaseComponent } from '../../../base.component';
import { ReferralStatsModel, RewardModel, ApplicationUserModel } from '../../../models/dto';
import { AccountService } from '../../../services/account.service';
import { ModelUtilsService } from '../../../services/model-utils.service';

interface StepInterface {
  count: number;
  last: boolean;
  upperString: string;
  lowerString: string;
  additionalString?: string;
  width: number;

  canClaim?: boolean;
}

@Component({
  selector: 'app-referrals-page',
  templateUrl: './referrals-page.component.html',
  styleUrls: ['./referrals-page.component.scss'],
  providers: [StoreService]
})
export class ReferralsPageComponent extends BaseComponent implements OnInit {

  stops: StepInterface[] = [{
    count: 3,
    width: 128,
    upperString: '50',
    lowerString: 'Minutes',
    last: false,
  }, {
    count: 10,
    width: 275,
    upperString: '150',
    lowerString: 'Minutes',
    last: false
  }, {
    count: 30,
    width: 418,
    upperString: '400',
    lowerString: 'Minutes',
    last: false,
  }, {
    count: 70,
    width: 564,
    upperString: '700',
    lowerString: 'Minutes',
    last: false,
  }, {
    count: 120,
    width: 708,
    upperString: '1100',
    lowerString: 'Minutes',
    additionalString: 'Knowlead Cup',
    last: false,
  }, {
    count: 250,
    width: 855,
    upperString: '1100',
    lowerString: 'Minutes',
    additionalString: 'Knowlead T-Shirt',
    last: false,
  }, {
    count: 404,
    width: 1200,
    upperString: 'SPECIAL',
    lowerString: 'REWARD',
    last: true,
  }];

  stats: ReferralStatsModel;
  rewards: RewardModel[];
  user: ApplicationUserModel;
  getReferralLink = ModelUtilsService.getReferralLink;

  constructor(protected storeService: StoreService, protected accountService: AccountService) { super(); }

  refresh() {
    if (!this.stats || !this.rewards) {
      return;
    }
    for (let claimable of this.stats.rewardsAvailable) {
      let reward = this.rewards.find(r => r.coreLookupId === claimable);
      let step = this.stops.find(s => s.count === reward.minutesReward);
      step.canClaim = true;
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user));
    this.subscriptions.push(this.storeService.getReferralStats().subscribe(stats => {
      this.stats = stats;
      this.refresh();
    }));
    this.subscriptions.push(this.storeService.getRewardLookups().subscribe(rewards => {
      this.rewards = rewards;
      this.refresh();
    }));
  }

}

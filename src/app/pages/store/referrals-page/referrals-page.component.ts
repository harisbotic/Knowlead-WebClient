import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { BaseComponent } from '../../../base.component';
import { ReferralStatsModel, RewardModel, ApplicationUserModel } from '../../../models/dto';
import { AccountService } from '../../../services/account.service';
import { ModelUtilsService } from '../../../services/model-utils.service';

interface StopInterface {
  count: number;
  last: boolean;
  upperString: string;
  lowerString: string;
  upperExtraString?: string;
  lowerExtraString?: string;
  width: number;

  claimed?: boolean;
  canClaim?: boolean;
}

interface ReferralStatus {
  email: string;
  status: string; // EMAIL / REGISTRATION
}

@Component({
  selector: 'app-referrals-page',
  templateUrl: './referrals-page.component.html',
  styleUrls: ['./referrals-page.component.scss'],
  providers: [StoreService]
})
export class ReferralsPageComponent extends BaseComponent implements OnInit {

  stops: StopInterface[] = [{
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
    upperExtraString: 'Knowlead',
    lowerExtraString: 'Cup',
    last: false,
  }, {
    count: 250,
    width: 855,
    upperString: '2200',
    lowerString: 'Minutes',
    upperExtraString: 'Knowlead',
    lowerExtraString: 'T-Shirt',
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
  currentStop: StopInterface;
  getReferralLink = ModelUtilsService.getReferralLink;
  statuses: ReferralStatus[];

  constructor(protected accountService: AccountService, protected storeService: StoreService) { super(); }

  findStopByReward(reward: RewardModel): StopInterface {
    return this.stops.find(s => s.count === parseInt(reward.code.substr(3), 10));
  }
  findRewardByStop(stop: StopInterface): RewardModel {
    return this.rewards.find(r => r.code === 'ref' + stop.count);
  }

  refresh() {
    if (!this.stats || !this.rewards) {
      return;
    }
    for (let stop of this.stops) {
      stop.canClaim = false;
      stop.claimed = false;
    }
    for (let claimable of this.stats.rewardsAvailable) {
      let reward = this.rewards.find(r => r.coreLookupId === claimable);
      let stop = this.findStopByReward(reward);
      if (stop == null) {
        console.error('BACKEND REWARDS NOT CONSISTENT WITH FRONTEND');
      } else {
        stop.canClaim = true;
      }
    }
    for (let claimed of this.stats.rewardsClaimed) {
      let reward = this.rewards.find(r => r.coreLookupId === claimed);
      let stop = this.findStopByReward(reward);
      stop.claimed = true;
      if (stop && (!this.currentStop || stop.count > this.currentStop.count)) {
        this.currentStop = stop;
      }
    }
    this.statuses = [];
    for (let key of Object.keys(this.stats.unregisteredReferrals)) {
      this.statuses.push({
        email: key,
        status: this.stats.unregisteredReferrals[key]
      });
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.user = user));
    this.subscriptions.push(this.storeService.getReferralStats().subscribe(stats => {
      this.stats = stats;
      this.refresh();
    }));
    this.subscriptions.push(this.storeService.getRewardLookups().subscribe(rewards => {
      this.rewards = rewards;
      this.refresh();
    }));
  }

  claimReward(stop: StopInterface) {
    if (stop.canClaim) {
      let reward = this.findRewardByStop(stop);
      if (reward) {
        this.storeService.claimReward(reward).subscribe(() => {
          this.storeService.getReferralStats().subscribe((stats) => {
            this.stats = stats;
            this.refresh();
          });
        });
        console.error('Error finding backend model for claiming reward');
      }
    }
  }

}

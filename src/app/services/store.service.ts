import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { ReferralStatsModel, RewardModel } from '../models/dto';
import { REFERRALS, CLAIM_REWARD, REDEEM } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class StoreService {

  constructor(protected http: Http, protected storageService: StorageService, protected analyticsService: AnalyticsService) { }

  getReferralStats(): Observable<ReferralStatsModel> {
    return this.http.get(REFERRALS).map(responseToResponseModel).map(o => o.object);
  }

  getRewardLookups(): Observable<RewardModel[]> {
    return this.storageService.getFromStorage('rewards', undefined);
  }

  claimReward(rewardModel: RewardModel): Observable<any> {
    this.analyticsService.sendEvent('claimReward', rewardModel.code);
    return this.http.post(CLAIM_REWARD, rewardModel);
  }

  redeem(code: string): Observable<any> {
    let searchParams = new URLSearchParams();
    searchParams.set('promocode', code);
    return this.http.post(REDEEM, null, {search : searchParams})
      .map(responseToResponseModel)
      .map(o => o.object)
      .do(() => {
        this.analyticsService.sendEvent('redeemCode', code);
      })
  }

}

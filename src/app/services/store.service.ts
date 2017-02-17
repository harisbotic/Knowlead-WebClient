import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReferralStatsModel, RewardModel } from '../models/dto';
import { REFERRALS, CLAIM_REWARD } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

@Injectable()
export class StoreService {

  constructor(protected http: Http, protected storageService: StorageService) { }

  getReferralStats(): Observable<ReferralStatsModel> {
    return this.http.get(REFERRALS).map(responseToResponseModel).map(o => o.object);
  }

  getRewardLookups(): Observable<RewardModel[]> {
    return this.storageService.getFromStorage('rewards', undefined);
  }

  claimReward(rewardModel: RewardModel): Observable<any> {
    return this.http.post(CLAIM_REWARD, rewardModel);
  }

}

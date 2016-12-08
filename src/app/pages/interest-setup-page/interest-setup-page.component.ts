import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../services/storage.service';
import { FOSModel, InterestModel } from './../../models/dto';
import { AccountService } from '../../services/account.service';
import { ApplicationUserModel } from '../../models/dto';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-interest-setup-page',
  templateUrl: './interest-setup-page.component.html',
  styleUrls: ['./interest-setup-page.component.scss'],
  providers: [AccountService]
})
export class InterestSetupPageComponent extends BaseComponent implements OnInit {

  category: FOSModel;
  root: FOSModel;
  _search: string;
  user: ApplicationUserModel;

  set search(value: string) {
    this._search = value;
    if (!!value) {
      this.category = null;
    }
  }

  get search(): string {
    return this._search;
  }

  interests: InterestModel[] = [];

  constructor(
    protected storageService: StorageService,
    protected accountService: AccountService,
    protected router: Router) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.storageService.getFOShierarchy().subscribe(root => {
      this.root = root;
    }));
    this.subscriptions.push(this.accountService.currentUser().subscribe((user) => {
      this.user = user;
      this.interests = this.user.interests;
    }));
  }

  shouldShowSelector(): boolean {
    return !!this.search || !!this.category;
  }

  hideSelector() {
    this.search = '';
    this.category = null;
  }

  findInterestByFos(fos: FOSModel): InterestModel {
    return _.find(this.interests, (interest: InterestModel) => {
      return interest.fos.code == fos.code;
    })
  }

  isRemovable = (fos: FOSModel): boolean => { 
    return this.findInterestByFos(fos) != null;
  }

  fosAdded(fos: FOSModel) {
    if (this.isRemovable(fos)) {
      console.error("${fos.name} was already added");
    } else {
      this.interests.push({
        fos: fos,
        fosId: fos.coreLookupId,
        stars: 0
      });
    }
  }

  fosRemoved(fos: FOSModel) {
    if (!this.isRemovable(fos)) {
      console.error("${fos.name} wasn't added, but tried to remove it");
    } else {
      let toDelete = this.findInterestByFos(fos);
      _.remove(this.interests, (f) => {return toDelete === f});
    }
  }

  submit() {
    this.subscriptions.push(this.accountService.patchInterests(this.interests).subscribe((response) => {
      this.router.navigate(["/"]);
    }));
  }

}

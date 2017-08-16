import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../services/storage.service';
import { AccountService } from '../../services/account.service';
import { ApplicationUserModel, FOSModel, InterestModel } from '../../models/dto';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { find, remove } from 'lodash';

@Component({
  selector: 'app-interest-setup-page',
  templateUrl: './interest-setup-page.component.html',
  styleUrls: ['./interest-setup-page.component.scss'],
  providers: []
})
export class InterestSetupPageComponent extends BaseComponent implements OnInit {

  category: FOSModel;
  root: FOSModel;
  _search = '';
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
    protected router: Router,
    protected activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.storageService.getFOShierarchy().subscribe(root => {
      this.root = root;
    }));
    this.subscriptions.push(this.accountService.currentUser().filter(user => !!user).take(1).subscribe((user) => {
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
    return find(this.interests, (interest: InterestModel) => {
      return interest.fos.code === fos.code;
    });
  }

  isRemovable = (fos: FOSModel): boolean => {
    return this.findInterestByFos(fos) != null;
  }

  fosAdded(fos: FOSModel) {
    if (this.isRemovable(fos)) {
      console.error('${fos.name} was already added');
    } else {
      this.interests.push({
        fos: fos,
        fosId: fos.coreLookupId,
        stars: 0,
        createdAt: undefined
      });
    }
  }

  fosRemoved(fos: FOSModel) {
    if (!this.isRemovable(fos)) {
      console.error('${fos.name} wasn\'t added, but tried to remove it');
    } else {
      let toDelete = this.findInterestByFos(fos);
      remove(this.interests, (f) => { return toDelete === f; });
    }
  }

  submit() {
    this.subscriptions.push(this.accountService.patchInterests(this.interests).subscribe((response) => {
      this.router.navigate(['/']);
    }));
  }

}

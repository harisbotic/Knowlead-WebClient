import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../services/storage.service';
import { AccountService } from '../../services/account.service';
import { ApplicationUserModel, FOSModel, InterestModel } from '../../models/dto';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-interest-setup-page',
  templateUrl: './interest-setup-page.component.html',
  styleUrls: ['./interest-setup-page.component.scss'],
  providers: []
})
export class InterestSetupPageComponent extends BaseComponent implements OnInit {

  category: FOSModel;
  root: FOSModel;
  _search: string;
  user: ApplicationUserModel;
  backUrl: string;

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
  isVoting: boolean;

  constructor(
    protected storageService: StorageService,
    protected accountService: AccountService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.queryParams.subscribe(params => {
      this.isVoting = !!params['vote'];
      if (this.isVoting) {
        this.backUrl = '/interestsetup';
      } else {
        this.backUrl = '/profilesetup';
      }
      this.subscriptions.push(this.storageService.getFOShierarchy().subscribe(root => {
        root = _.cloneDeep(root);
        let keepUnlocked = !this.isVoting;
        const shouldKeep = (fos: FOSModel, level: number): boolean => {
          // If this is leaf, return whether or not this should be kept
          if (!fos.children || fos.children.length === 0) {
            return (level < 2) || fos.unlocked === keepUnlocked;
          }
          // If there are any children that are kept, keep this node
          fos.children = fos.children.filter((foss) => shouldKeep(foss, level + 1));
          // Always keep root and main categories
          if (level < 2) {
            return true;
          }
          return fos.children.length > 0;
        };
        shouldKeep(root, 0);
        this.root = root;
      }));
      this.subscriptions.push(this.accountService.currentUser().filter(user => !!user).take(1).subscribe((user) => {
        this.user = user;
        this.interests = this.user.interests.filter(interest => interest.fos.unlocked === !this.isVoting);
      }));
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
        stars: 0
      });
    }
  }

  fosRemoved(fos: FOSModel) {
    if (!this.isRemovable(fos)) {
      console.error('${fos.name} wasn\'t added, but tried to remove it');
    } else {
      let toDelete = this.findInterestByFos(fos);
      _.remove(this.interests, (f) => { return toDelete === f; });
    }
  }

  submit() {
    this.subscriptions.push(this.accountService.patchInterests(this.interests, this.isVoting).subscribe((response) => {
      if (this.isVoting) {
        this.router.navigate(['/']);
      } else {
        this.router.navigateByUrl('/interestsetup?vote=true');
      }
    }));
  }

}

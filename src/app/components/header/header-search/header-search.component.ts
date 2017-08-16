import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { FormControl } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { ApplicationUserModel, FOSModel, ApplicationUserInterestModel, InterestModel } from '../../../models/dto';
import { Observable } from 'rxjs/Rx';
import { DropdownValueInterface } from '../../../models/frontend.models';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { StorageService } from '../../../services/storage.service';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent extends BaseComponent implements OnInit {

  me: ApplicationUserModel;
  control = new FormControl();
  results: ApplicationUserModel[] = [];
  resultFoses: DropdownValueInterface<number[]>[] = [];
  allFoses: DropdownValueInterface<number[]>[];
  userInterests: InterestModel[] = [];
  temp: ApplicationUserModel[] = [];
  constructor(protected accountService: AccountService, protected storageService: StorageService) { super(); }

  ngOnInit() {
    this.control.valueChanges
      .debounceTime(500)
      .do((value: string) => {
        this.resultFoses = [];
        if (value === '') {
          return;
        }
        for (let i = 0; i < this.allFoses.length; i++) {
          if ( this.allFoses[i].label.toLowerCase().includes(value.toLowerCase())) {
            this.resultFoses.push(this.allFoses[i]);
          }
        }
        for (let j = 0; j < this.resultFoses.length; j++) {
          for (let k = 0; k < this.userInterests.length; k++) {
            if (this.resultFoses[j].value[0] === this.userInterests[k].fosId) {
              (<any>this.resultFoses[j]).score = -this.userInterests[k].stars;
            } else {
              (<any>this.resultFoses[j]).score = 1;
            }
          }
        }
        this.resultFoses = sortBy(this.resultFoses, 'score');
        console.log(this.resultFoses);
        this.resultFoses.splice(5, this.resultFoses.length - 1);
      })
      .flatMap((value) => this.accountService.search(value))
      .subscribe(results => this.results = results);

    this.subscriptions.push(
      this.storageService.getFOShierarchy().subscribe(root => {
        this.allFoses = ModelUtilsService.fosesWithChildren(root);
      }),
      this.accountService.currentUser().subscribe(user => {
        this.me = user;
        this.userInterests = this.me.interests;
      })
    );
  }

  swap() {
    this.subscriptions.push(Observable.timer(200).subscribe(() => {
      let tmp = this.results;
      this.results = this.temp;
      this.temp = tmp;
    }));
  }

}

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { FormControl } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { ApplicationUserModel, FOSModel } from '../../../models/dto';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent extends BaseComponent implements OnInit {

  control = new FormControl();
  results: ApplicationUserModel[] = [];
  resultFoses: FOSModel[] = [];
  temp: ApplicationUserModel[] = [];
  constructor(protected accountService: AccountService) { super(); }

  ngOnInit() {
    this.control.valueChanges
      .debounceTime(500)
      .flatMap((value) => this.accountService.search(value))
      .subscribe(results => this.results = results);
  }

  swap() {
    this.subscriptions.push(Observable.timer(200).subscribe(() => {
      let tmp = this.results;
      this.results = this.temp;
      this.temp = tmp;
    }));
  }

}

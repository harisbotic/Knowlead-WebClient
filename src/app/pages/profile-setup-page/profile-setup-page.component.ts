import { Component, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel, ResponseModel } from './../../models/dto';
import { StorageService } from './../../services/storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import * as _ from 'lodash';
import { AccountService } from './../../services/account.service';
import { Router } from '@angular/router';
import { dateValidator } from '../../validators/date.validator';
import { BaseComponent } from '../../base.component';
import { DropdownValueInterface } from '../../models/frontend.models';

@Component({
  selector: 'app-profile-setup-page',
  templateUrl: './profile-setup-page.component.html',
  styleUrls: ['./profile-setup-page.component.scss', '../../../assets/styles/flags.css'],
  providers: []
})
export class ProfileSetupPageComponent extends BaseComponent implements AfterViewInit {

  form: FormGroup;
  user: ApplicationUserModel;
  realUser: ApplicationUserModel;
  response: ResponseModel;

  countries: DropdownValueInterface<number>[];
  languages: DropdownValueInterface<number>[];

  constructor(
      protected storageService: StorageService,
      protected translateService: TranslateService,
      protected formBuilder: FormBuilder,
      protected accountService: AccountService,
      protected router: Router) {
    super();
    this.form = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'surname': new FormControl(null, [Validators.required]),
      'birthdate': new FormControl(null, [Validators.required, dateValidator({minYearsOld: 10})]),
      'isMale': new FormControl(null, [Validators.required]),
      'countryId': new FormControl(null),
      'motherTongueId': new FormControl(null, [Validators.required]),
      'profilePictureId': new FormControl(null)
    });
  }

  private countryForDropdown(country: CountryModel): DropdownValueInterface<number> {
    return {label: country.name, value: country.geoLookupId};
  }

  private languageForDropdown(language: LanguageModel): DropdownValueInterface<number> {
    return {label: language.name, value: language.coreLookupId};
  }

  private loadUser() {
    this.subscriptions.push(this.accountService.currentUser().filter(user => !!user).take(1).subscribe((user: ApplicationUserModel) => {
      console.log('user');
      this.user = _.cloneDeep(user);
      if (this.user.isMale == null) {
        this.user.isMale = true;
      }
      this.user.motherTongueId = <any>[this.user.motherTongueId];
      this.user.countryId = <any>[this.user.countryId];
      this.form.patchValue(this.user);
      console.log('after patch');

      // for (let key1 of Object.keys(this.user)) {
      //   let found = false;
      //   for (let key2 in this.form.controls) {
      //     if (key2 === key1 || key1 === key2 + 'Id') {
      //       found = true;
      //     }
      //   }
      //   if (!found) {
      //     delete this.user[key1];
      //   }
      // }
    }));
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.realUser = user));
  }

  ngAfterViewInit() {
    const countriesGetter = this.storageService.getCountries().take(1).do(countries => {
      this.countries = countries.map(this.countryForDropdown);
      console.log(countries);
    });
    const languagesGetter = this.storageService.getLanguages().take(1).do(languages => {
      this.languages = languages.map(this.languageForDropdown);
      console.log(languages);
    }).delay(0);
    this.subscriptions.push(countriesGetter.merge(languagesGetter).subscribe(undefined, undefined, () => {
      this.loadUser();
    }));
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.subscriptions.push(this.accountService
      .patchUserDetails(this.form.value)
      .subscribe((user) => {
        this.router.navigate(['/interestsetup']);
      }, (error: ResponseModel) => {
        this.response = error;
      }
    ));
  }

}

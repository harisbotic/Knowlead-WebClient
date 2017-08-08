import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel, ResponseModel } from './../../models/dto';
import { StorageService } from './../../services/storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AccountService } from './../../services/account.service';
import { Router } from '@angular/router';
import { dateValidator } from '../../validators/date.validator';
import { DropdownValueInterface } from '../../models/frontend.models';
import { BaseFormComponent } from '../../base-form.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-profile-setup-page',
  templateUrl: './profile-setup-page.component.html',
  styleUrls: ['./profile-setup-page.component.scss', '../../../assets/styles/flags.css'],
  providers: []
})
export class ProfileSetupPageComponent extends BaseFormComponent<ApplicationUserModel> implements OnInit {

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
  }

  getNewForm() {
    return new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'surname': new FormControl(null, [Validators.required]),
      'birthdate': new FormControl(null, [Validators.required, dateValidator({minYearsOld: 10})]),
      'isMale': new FormControl(null, [Validators.required]),
      'countryId': new FormControl(null),
      'motherTongueId': new FormControl(null, [Validators.required]),
      'profilePictureId': new FormControl(null)
    });
  }

  getNewValue(): ApplicationUserModel {
    if (this.user) {
      return this.user;
    } else {
      return null;
    }
  }

  private countryForDropdown(country: CountryModel): DropdownValueInterface<number> {
    return {label: country.name, value: country.geoLookupId};
  }

  private languageForDropdown(language: LanguageModel): DropdownValueInterface<number> {
    return {label: language.name, value: language.coreLookupId};
  }

  private loadUser() {
    this.subscriptions.push(this.accountService.currentUser().filter(user => !!user).take(1).subscribe((user: ApplicationUserModel) => {
      this.user = cloneDeep(user);
      if (this.user.isMale == null) {
        this.user.isMale = true;
      }
      this.restartForm();
    }));
    this.subscriptions.push(this.accountService.currentUser().subscribe(user => this.realUser = user));
  }

  ngOnInit() {
    super.ngOnInit();
    const countriesGetter = this.storageService.getCountries().take(1).do(countries => {
      this.countries = countries.map(this.countryForDropdown);
    });
    const languagesGetter = this.storageService.getLanguages().take(1).do(languages => {
      this.languages = languages.map(this.languageForDropdown);
    }).delay(0);
    this.subscriptions.push(countriesGetter.merge(languagesGetter).subscribe(undefined, undefined, () => {
      this.loadUser();
    }));
  }

  submit() {
    this.subscriptions.push(this.accountService
      .patchUserDetails(this.form.value)
      .subscribe((user) => {
        this.router.navigate(['/interestsetup']);
      }, this.errorHandler
    ));
  }

}

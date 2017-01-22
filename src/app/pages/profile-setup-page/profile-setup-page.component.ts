import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel, StateModel, ResponseModel } from './../../models/dto';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './../../services/storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { baseLookup } from './../../utils/index';
import * as _ from 'lodash';
import { AccountService } from './../../services/account.service';
import { Router } from '@angular/router';
import { joinTranslation } from '../../utils/translate-utils';
import { dateValidator } from '../../validators/date.validator';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-profile-setup-page',
  templateUrl: './profile-setup-page.component.html',
  styleUrls: ['./profile-setup-page.component.scss', '../../../assets/styles/flags.css'],
  providers: []
})
export class ProfileSetupPageComponent extends BaseComponent implements OnInit {

  dateSelector: boolean = false;
  genderSelector: boolean = false;
  form: FormGroup;
  states: StateModel[] = [];
  state: StateModel;
  motherTongue: LanguageModel;
  country: CountryModel;
  user: ApplicationUserModel;
  response: ResponseModel;

  constructor(
      protected storageService: StorageService,
      protected translateService: TranslateService,
      protected formBuilder: FormBuilder,
      protected accountService: AccountService,
      protected router: Router) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'surname': new FormControl(null, [Validators.required]),
      'birthdate': new FormControl(null, [Validators.required, dateValidator({minYearsOld: 10})]),
      'isMale': new FormControl(null, [Validators.required]),
      'aboutMe': new FormControl(null),
      'country': new FormControl(null),
      'motherTongue': new FormControl(null, [Validators.required]),
      'languages': new FormControl(null),
      'state': new FormControl(null),
      'profilePictureId': new FormControl(null)
    });
    this.subscriptions.push(this.accountService.currentUser().filter(user => !!user).subscribe((user: ApplicationUserModel) => {
      this.form.patchValue(user);
      this.user = _.cloneDeep(user);

      this.countryChanged(this.user.country);
      this.stateChanged(this.user.state);
      this.mainLanguageChanged(this.user.motherTongue);

      for (let key1 of Object.keys(this.user)) {
        let found = false;
        for (let key2 in this.form.controls) {
          if (key2 === key1 || key1 === key2 + 'Id') {
            found = true;
          }
        }
        if (!found) {
          delete this.user[key1];
        }
      }
    }));
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.subscriptions.push(this.accountService
      .patchUserDetails(this.form.value)
      .subscribe((response: ResponseModel) => {
        this.router.navigate(['/interestsetup']);
      }, (error: ResponseModel) => {
        this.response = error;
      }
    ));
  }

  getGender(): string {
    if (this.form.value.isMale == null) {
      return joinTranslation('common', 'gender');
    } else {
      return this.form.value.isMale ? joinTranslation('common', 'male') : joinTranslation('common', 'female');
    }
  }

  countryLookup = (query: string): Observable<CountryModel[]> => {
    return baseLookup(this.storageService.getCountries(), query);
  }

  languageLookup = (query: string): Observable<LanguageModel[]> => {
    return baseLookup(this.storageService.getLanguages()
      .map((languages: LanguageModel[]) => {
        return _.filter(languages, (language) => {
          if (this.form.value.motherTongue != null &&
              language.coreLookupId === this.form.value.motherTongue.coreLookupId) {
            return false;
          }
          if (this.form.value.languages != null && _.find(this.form.value.languages, language) != null) {
            return false;
          }
          return true;
        });
      })
      , query);
  }

  stateLookup = (query: string): Observable<StateModel[]> => {
    return baseLookup(Observable.of(this.states), query);
  }

  stateChanged(state: StateModel) {
    this.form.patchValue({state: state});
    this.state = state;
  }

  countryChanged(country: CountryModel) {
    this.country = country;
    this.states = [];
    this.stateChanged(null);
    if (country != null) {
      this.form.patchValue({country: country});
      this.subscriptions.push(this.storageService.getStates(country).subscribe((states: StateModel[]) => {
        this.states = states;
      }));
    } else {
      this.form.patchValue({countryId: null});
    }
  }

  languageAdded(language: LanguageModel) {
    if (language != null) {
      this.form.patchValue({languages: _.uniq([...(this.form.value.languages || []), language])});
    }
  }

  languageRemoved(language: LanguageModel) {
    let languages = this.form.value.languages;
    _.remove(languages, language);
    this.form.patchValue({languages: languages});
  }

  mainLanguageChanged(language: LanguageModel) {
    this.form.patchValue({motherTongue: language});
    this.motherTongue = language;
  }

}

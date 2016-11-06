import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel, StateModel, ResponseModel } from './../models/dto';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './../storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { joinTranslation } from './../utils/translate-utils';
import { TranslationTestComponent } from './../translation-test/translation-test.component';
import { baseLookup } from './../utils/index';
import * as _ from 'lodash';
import { SessionService } from './../session.service';
import { AccountService } from './../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-setup-page',
  templateUrl: './profile-setup-page.component.html',
  styleUrls: ['./profile-setup-page.component.scss', '../../assets/styles/flags.css'],
  providers: [AccountService]
})
export class ProfileSetupPageComponent implements OnInit {

  dateSelector: boolean = false;
  genderSelector: boolean = false;
  form: FormGroup;
  newLanguage: LanguageModel;
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
  }

  ngOnInit() {
    this.accountService.currentUser().subscribe((user: ApplicationUserModel) => {
      this.user = _.cloneDeep(user);
      this.form = new FormGroup({
        "name": new FormControl(this.user.name),
        "surname": new FormControl(this.user.surname),
        "birthdate": new FormControl(this.user.birthdate),
        "isMale": new FormControl(this.user.isMale),
        "aboutMe": new FormControl(this.user.aboutMe),
        "country": new FormControl(this.user.country),
        "motherTongue": new FormControl(this.user.motherTongue),
        "languages": new FormControl(this.user.languages),
        "state": new FormControl(this.user.state)
      });

      this.countryChanged(this.user.country);
      this.stateChanged(this.user.state);
      this.mainLanguageChanged(this.user.motherTongue);

      for (let key1 in this.user) {
        let found = false;
        for (let key2 in this.form.controls) {
          if (key2 == key1 || key1 == key2 + "Id") {
            found = true;
          }
        }
        if (!found) {
          delete this.user[key1];
        }
      }
    })
  }

  submit() {
    this.accountService
      .patchUserDetails(this.form.value)
      .subscribe((response: ResponseModel) => {
        this.router.navigate(["/interestsetup"]);
      }, (error: ResponseModel) => {
        this.response = error;
      }
    );
  }

  getGender(): string {
    if (this.form.value.isMale == null)
      return "common:gender";
    else
      return this.form.value.isMale ? "common:male" : "common:female";
  }

  countryLookup = (query: string): Observable<CountryModel[]> => {
    return baseLookup(this.storageService.getCountries(), query);
  }

  languageLookup = (query: string): Observable<LanguageModel[]> => {
    return baseLookup(this.storageService.getLanguages()
      .map((languages: LanguageModel[]) => {
        return _.filter(languages, (language) => 
        {
          if (this.form.value.motherTongue != null &&
              language.coreLookupId == this.form.value.motherTongue.coreLookupId)
            return false;
          if (this.form.value.languages != null && _.find(this.form.value.languages, language) != null)
            return false;
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
      this.storageService.getStates(country).subscribe((states: StateModel[]) => {
        this.states = states;
      });
    }
    else
      this.form.patchValue({countryId: null});
  }

  birthdayChanged(value: Date) {
    this.form.patchValue({birthdate: value});
  }

  languageAdded(language: LanguageModel) {
    if (language != null)
      this.form.patchValue({languages: _.uniq([...(this.form.value.languages || []), language])});
    Observable.timer(1).subscribe(() => {
      this.newLanguage = null;
    });
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

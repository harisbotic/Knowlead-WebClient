import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel, StateModel } from './../models/dto';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './../storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { joinTranslation } from './../utils/translate-utils';
import { TranslationTestComponent } from './../translation-test/translation-test.component';
import { baseLookup } from './../utils/index';
import * as _ from 'lodash';
import { SessionService } from './../session.service';
import * as jsonpatch from 'fast-json-patch';

@Component({
  selector: 'app-profile-setup-page',
  templateUrl: './profile-setup-page.component.html',
  styleUrls: ['./profile-setup-page.component.scss', '../../assets/styles/flags.css'],
  providers: []
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

  constructor(
      protected storageService: StorageService,
      protected translateService: TranslateService,
      protected formBuilder: FormBuilder,
      protected sessionService: SessionService) {
  }

  ngOnInit() {
    this.sessionService.getUser().subscribe((user: ApplicationUserModel) => {
      this.user = user;
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
      this.state = this.user.state;
      this.country = this.user.country;
      this.motherTongue = this.user.motherTongue;
    })
  }

  submit() {
    let submission: ApplicationUserModel = this.form.value;
    submission.countryId = submission.country.geoLookupId;
    submission.motherTongueId = submission.motherTongue.coreLookupId;
    submission.stateId = submission.state ? submission.state.geoLookupId : null;
    console.log(jsonpatch.compare(this.user, this.form.value));
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
      .filter((language: LanguageModel) => {
        if (this.form.value.motherTongue != null &&
            language.coreLookupId == this.form.value.motherTongue.coreLookupId)
          return false;
        if (this.form.value.languages != null && _.find(this.form.value.languages, language) != null)
          return false;
        return true;
      })
      , query);
  }

  stateLookup = (query: string): Observable<StateModel[]> => {
    return baseLookup(Observable.from(this.states), query);
  }

  stateChanged(state: StateModel) {
    this.form.patchValue({state: state});
    this.state = state;
  }

  countryChanged(country: CountryModel) {
    this.states = [];
    this.stateChanged(null);
    if (country != null) {
      this.form.patchValue({country: country});
      this.storageService.getStates(country).subscribe((state: StateModel) => {
        this.states.push(state);
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
  }

}

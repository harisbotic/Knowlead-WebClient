import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel, StateModel } from './../models/dto';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './../storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { joinTranslation } from './../utils/translate-utils';
import { TranslationTestComponent } from './../translation-test/translation-test.component';
import { baseLookup } from './../utils/index';
import * as _ from 'lodash';

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
  country: CountryModel;
  mainLanguage: LanguageModel;
  newLanguage: LanguageModel;
  states: StateModel[] = [];
  selectedState: StateModel;

  constructor(
      protected storageService: StorageService,
      protected translateService: TranslateService,
      protected formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "name": null,
      "surname": null,
      "birthdate": null,
      "isMale": null,
      "aboutMe": null,
      "countryId": null,
      "motherTongueId": null,
      "languages": null,
      "stateId": null
    });
  }

  submit() {
    console.log(this.form.value);
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
        if (language.coreLookupId == this.form.value.motherTongueId)
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
    this.form.patchValue({stateId: state ? state.geoLookupId : null});
    this.selectedState = state;
  }

  countryChanged(country: CountryModel) {
    this.states = [];
    this.stateChanged(null);
    if (country != null) {
      this.form.patchValue({countryId: country.geoLookupId});
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
    this.form.patchValue({motherTongueId: language ? language.coreLookupId : null});
  }

}

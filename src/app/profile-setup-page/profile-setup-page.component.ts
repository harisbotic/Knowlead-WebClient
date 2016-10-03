import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationUserModel, CountryModel, LanguageModel } from './../models/dto';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './../storage.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { joinTranslation } from './../utils/translate-utils';
import { TranslationTestComponent } from './../translation-test/translation-test.component';
import { baseLookup } from './../utils/index';

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
      "countryId": null
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
    return baseLookup(this.storageService.getLanguages(), query);
  }

  countryChanged(country) {
    console.log(country);
    if (country != null)
      this.form.patchValue({countryId: country.geoLookupId});
    else
      this.form.patchValue({countryId: null});
  }

  birthdayChanged(value) {
    this.form.patchValue({birthdate: value});
    console.log(value);
  }

}

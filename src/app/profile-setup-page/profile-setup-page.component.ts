import { Component, Inject } from '@angular/core';
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
  styleUrls: ['./profile-setup-page.component.scss'],
  providers: []
})
export class ProfileSetupPageComponent {

  user: ApplicationUserModel = <ApplicationUserModel>{};
  dateSelector: boolean = false;
  genderSelector: boolean = false;

  constructor(protected storageService: StorageService, protected translateService: TranslateService) {
  }

  submit() {
    console.log(this.user);
  }

  getGender(): string {
    if (this.user.isMale === undefined)
      return "common:gender";
    else
      return this.user.isMale ? "common:male" : "common:female";
  }

  countryLookup = (query: string): Observable<CountryModel[]> => {
    return baseLookup(this.storageService.getCountries(), query);
  }

  languageLookup = (query: string): Observable<LanguageModel[]> => {
    return baseLookup(this.storageService.getLanguages(), query);
  }

  countryChanged() {
    if (this.user.country != null)
      this.user.countryId = this.user.country.geoLookupId;
    else
      delete this.user.countryId
  }

}

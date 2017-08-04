import { Component, OnInit } from '@angular/core';
import { SubProfileBaseComponent } from '../../sub-profile-base.component';
import { AccountService } from '../../../../services/account.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUserModel, CountryModel, LanguageModel } from '../../../../models/dto';
import { BaseFormComponent } from '../../../../base-form.component';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/Rx';
import { DropdownValueInterface } from '../../../../models/frontend.models';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent extends BaseFormComponent<ApplicationUserModel> implements OnInit {

  me: ApplicationUserModel;
  user: ApplicationUserModel;
  editable: boolean;

  countries: DropdownValueInterface<number>[];
  languages: DropdownValueInterface<number>[];

  ngOnInit() {
    super.ngOnInit();
    this.storageService.getCountries().take(1).subscribe(countries => {
      this.countries = countries.map(this.countryForDropdown);
    });
    this.storageService.getLanguages().take(1).subscribe(languages => {
      this.languages = languages.map(this.languageForDropdown);
    });
    this.subscriptions.push(this.activatedRoute.parent.params.subscribe((params) => {
      this.accountService.getUserById(params['id'], true).subscribe(user => {
        this.user = user;
        this.restartForm();
      });
    }));
    this.subscriptions.push(
      this.accountService.currentUser().subscribe( user => this.me = user)
    );
  }

  constructor(protected storageService: StorageService,
              protected accountService: AccountService,
              protected activatedRoute: ActivatedRoute) { super();
  }

  isMy(): boolean {
    if (this.user && this.me) {
      return this.user.id === this.me.id;
    }
    return false;
  }

  setEditable() {
    this.editable = true;
  }

  getNewValue(): ApplicationUserModel | Observable<ApplicationUserModel> {
    return this.user;
  }

  getNewForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      motherTongueId: new FormControl(null, Validators.required),
      countryId: new FormControl(null),
      birthdate: new FormControl(null, Validators.required)
    });
  }

  private countryForDropdown(country: CountryModel): DropdownValueInterface<number> {
    return {label: country.name, value: country.geoLookupId};
  }

  private languageForDropdown(language: LanguageModel): DropdownValueInterface<number> {
    return {label: language.name, value: language.coreLookupId};
  }

  submit() {
    this.subscriptions.push(this.accountService
      .patchUserDetails(this.form.value).subscribe( () => {
        this.editable = false;
      }))
  }

  cancelAction() {
    this.editable = false;
    this.restartForm();
  }
}

import { Component, OnInit } from '@angular/core';
import { StorageService } from './../storage.service';
import { FOSModel, InterestModel } from './../models/dto';

@Component({
  selector: 'app-interest-setup-page',
  templateUrl: './interest-setup-page.component.html',
  styleUrls: ['./interest-setup-page.component.scss']
})
export class InterestSetupPageComponent implements OnInit {

  category: FOSModel;
  root: FOSModel;
  _search: string;

  set search(value: string) {
    this._search = value;
    if (!!value) {
      this.category = null;
    }
  }

  get search(): string {
    return this._search;
  }

  interests: InterestModel[] = [];

  constructor(protected storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getFOShierarchy().subscribe(root => {
      //this.category = root.children[2];
      // console.log(this.category);
      this.root = root;
    });
  }

  shouldShowSelector(): boolean {
    return !!this.search || !!this.category;
  }

  hideSelector() {
    this.search = '';
    this.category = null;
  }

  findInterestByFos(fos: FOSModel): InterestModel {
    return _.find(this.interests, (interest: InterestModel) => {
      return interest.fos.code == fos.code;
    })
  }

  isRemovable = (fos: FOSModel): boolean => { 
    return this.findInterestByFos(fos) != null;
  }

  fosAdded(fos: FOSModel) {
    if (this.isRemovable(fos)) {
      console.error("${fos.name} was already added");
    } else {
      this.interests.push({
        fos: fos,
        fosId: fos.coreLookupId,
        stars: 0
      });
    }
    console.log(this.interests);
  }

  fosRemoved(fos: FOSModel) {
    if (!this.isRemovable(fos)) {
      console.error("${fos.name} wasn't added, but tried to remove it");
    } else {
      let toDelete = this.findInterestByFos(fos);
      _.remove(this.interests, (f) => {return toDelete === f});
    }
    console.log(this.interests);
  }

}

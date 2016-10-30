import { Component, OnInit, Input } from '@angular/core';
import { InterestModel, FOSModel } from './../models/dto';

@Component({
  selector: 'app-interest-setup-selector',
  templateUrl: './interest-setup-selector.component.html',
  styleUrls: ['./interest-setup-selector.component.scss']
})
export class InterestSetupSelectorComponent implements OnInit {

  @Input() root: FOSModel;
  @Input() set search(search: string) {
    this._search = search;
    this.refresh();
  }
  @Input() set category(category: FOSModel) {
    this._category = category;
    this.refresh();
  }
  get category(): FOSModel {
    return this._category;
  }
  get search(): string {
    return this._search;
  }

  _search: string;
  _category: FOSModel;
  selectedCategory: FOSModel;
  subcategories: FOSModel[];

  refresh() {
    this.subcategories = (this.category) ? this.category.children : undefined;
  }

  isRemovable(fos: FOSModel): boolean {
    return true;
  }

  remove(fos: FOSModel) {
  }

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Input() isRemovableCallback: (fos: FOSModel) => boolean;
  get category(): FOSModel {
    return this._category;
  }
  get search(): string {
    return this._search;
  }
  @Output() fosAdded = new EventEmitter<FOSModel>();
  @Output() fosRemoved = new EventEmitter<FOSModel>();

  _search: string;
  _category: FOSModel;
  selectedCategory: FOSModel;
  subcategories: FOSModel[];

  refresh() {
    this.subcategories = (this.category) ? this.category.children : undefined;
  }

  remove(fos: FOSModel) {
    this.fosRemoved.emit(fos);
  }

  // Propagate this fos to parent
  addCategory(fos: FOSModel) {
    this.fosAdded.emit(fos);
  }

  // When left side is selected
  itemClicked(fos: FOSModel) {
    if (fos.children != null && fos.children.length > 0) {
      this.selectedCategory = fos;
    } else {
      delete this.selectedCategory;
      this.addCategory(fos);
    }
  }

  // When right side is selected
  subItemClicked(fos: FOSModel) {
    this.addCategory(fos);
  }

  constructor() { }

  ngOnInit() {
  }

}

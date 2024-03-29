import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FOSModel } from './../../../models/dto';
import { stringContains } from '../../../utils/index';
import { BaseComponent } from '../../../base.component';
import { ActivatedRoute } from '@angular/router';
import { clone } from 'lodash';

@Component({
  selector: 'app-interest-setup-selector',
  templateUrl: './interest-setup-selector.component.html',
  styleUrls: ['./interest-setup-selector.component.scss']
})
export class InterestSetupSelectorComponent extends BaseComponent implements OnInit {

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
  @Output() removeSelector = new EventEmitter();

  _search: string;
  _category: FOSModel;
  selectedCategory: FOSModel;
  subcategories: FOSModel[];

  back() {
    if (this.selectedCategory) {
      delete this.selectedCategory;
    } else {
      this.removeSelector.emit();
    }
  }

  searchFos(fos: FOSModel, level: number, parent: FOSModel) {
    if (level === 0 && !!fos.children) {
      fos.children.forEach(f => this.searchFos(f, 1, fos));
    }
    // When searching for level 1, if name matches, whole FOS should be added
    if (level === 1) {
      if (stringContains(fos.name, this.search)) {
        this.subcategories.push(fos);
      } else {
        if (!!fos.children) {
          let tmp = clone(fos);
          tmp.children = [];
          fos.children.forEach(f => {
            this.searchFos(f, 2, tmp);
          });
          if (tmp.children.length > 0) {
            this.subcategories.push(tmp);
          }
        }
      }
    }
    // When searching for level 2, add matches to the parent
    if (level === 2) {
      if (stringContains(fos.name, this.search)) {
        parent.children.push(fos);
      }
      if (!!fos.children && fos.children.length > 0) {
        console.error('2nd level contains children ... ${fos.name}');
      }
    }
  }

  refresh() {
    this.subcategories = (this.category) ? this.category.children : undefined;
    if (!!this.search) {
      this.subcategories = [];
      this.root.children.forEach(f => this.searchFos(f, 0, this.root));
    }
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

  showSubSubCategories() {
    return this.selectedCategory &&
      this.selectedCategory.children &&
      this.selectedCategory.children.length > 0;
  }

  constructor(protected activatedRoute: ActivatedRoute) { super(); }

  ngOnInit() {
    this.activatedRoute.queryParams.skip(1).delay(100).subscribe((f) => {
      delete this.selectedCategory;
      this.removeSelector.emit();
    });
  }

}

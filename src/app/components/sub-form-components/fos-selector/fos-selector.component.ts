import { Component, OnInit, forwardRef, ViewChild, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FOSModel } from '../../../models/dto';
import { StorageService } from '../../../services/storage.service';
import { stringContains, getFOSParents } from '../../../utils/index';
import { EmptyLookupComponent } from '../empty-lookup/empty-lookup.component';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';

type CallbackType = (value: any) => void;

@Component({
  selector: 'app-fos-selector',
  templateUrl: './fos-selector.component.html',
  styleUrls: ['./fos-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FosSelectorComponent),
      multi: true
    }
  ]
})
export class FosSelectorComponent extends BaseFormInputComponent<FOSModel> implements OnInit {

  @ViewChild('lookupElement') lookupElement: EmptyLookupComponent<FOSModel>;

  @Input() outputType = 'object';

  parents: FOSModel[] = [];

  root: FOSModel;

  constructor(protected storageService: StorageService) { super(); }

  emitChange() {
    let tmp = this.value === this.root ? null : this.value;
    if (this.outputType === 'object') {
      this.changeCb(tmp);
    } else {
      this.changeCb(tmp ? tmp.coreLookupId : null);
    }
    this.parents = this.getParents();
  }

  ngOnInit() {
    this.subscriptions.push(this.storageService.getFOShierarchy().subscribe(root => {
      this.root = root;
      this.value = root;
      let cb = (fos: any) => {
        if (fos.children) {
          fos.children.forEach((f: any) => {
            if (fos.displayName != null) {
              f.displayName = fos.displayName + ' > ' + f.name;
            } else {
              f.displayName = f.name;
            }
          });
          fos.children.forEach(cb);
        }
      };
      cb(this.root);
      this.root.name = 'All';
    }));
  }

  lookup = (query: string): FOSModel[] => {
    if (this.value == null) {
      return null;
    }
    if (query === '') {
      return this.value.children;
    }
    let res = <FOSModel[]>[];
    let cb = (fos: FOSModel) => {
      if (stringContains(fos.name, query)) {
        res.push(fos);
      }
      if (fos.children != null) {
        fos.children.forEach(cb);
      }
    };
    if (this.value.children != null) {
      this.value.children.forEach(cb);
    }
    return res;
  }

  writeValue(obj: FOSModel | number): void {
    if (typeof obj === 'number') {
      this.storageService.getFosById(obj).take(1).subscribe(fos => this.value = fos);
    } else {
      this.value = obj;
    }
  }

  getParents(): FOSModel[] {
    let ret = [this.root].concat(getFOSParents(this.value).reverse());
    if (this.value !== this.root && this.value != null) {
      ret.push(this.value);
    }
    return ret;
  }

  breadcrumbClicked(item) {
    this.value = item;
    setTimeout(() => {
      if (this.lookupElement) { this.lookupElement.focused(); }
    }, 100);
  }

}

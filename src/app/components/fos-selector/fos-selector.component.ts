import { Component, OnInit, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FOSModel } from '../../models/dto';
import { StorageService } from '../../services/storage.service';
import { baseLookup, stringContains, getFOSParents } from '../../utils/index';
import { EmptyLookupComponent } from '../empty-lookup/empty-lookup.component';

type CallbackType = (value: FOSModel) => void;

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
export class FosSelectorComponent implements OnInit, ControlValueAccessor {

  @ViewChild("lookupElement") lookupElement: EmptyLookupComponent<FOSModel>;

  parents: FOSModel[] = [];

  _value: FOSModel;
  get value(): FOSModel {
    return this._value;
  }
  set value(value: FOSModel) {
    if (value == null) {
      if (this.root != null) {
        this.value = this.root;
      }
      return;
    }
    this._value = value;
    if (this.chCallback != null && this.callCallbacks)
      this.chCallback(value == this.root ? null : value);
    //if (this.lookupElement) {
    //  this.lookupElement.open = false;
    //}
    this.parents = this.getParents();
    this.callCallbacks = true;
  }
  chCallback: CallbackType;
  tcCallback: CallbackType;
  callCallbacks = true;

  root: FOSModel;

  constructor(protected storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getFOShierarchy().subscribe(root => {
      this.root = root;
      this.value = root;
      let cb = (fos: any) => {
        if (fos.children) {
          fos.children.forEach((f: any) => {
            if (fos.displayName != null)
              f.displayName = fos.displayName + " > " + f.name;
            else
              f.displayName = f.name;
          });
          fos.children.forEach(cb);
        }
      }
      cb(this.root);
      this.root.name = "All";
    });
  }

  lookup = (query: string): FOSModel[] => {
    if (this.value == null)
      return null;
    if (query == "")
      return this.value.children;
    let res = <FOSModel[]>[];
    let cb = (fos: FOSModel) => {
      if (stringContains(fos.name, query))
        res.push(fos);
      if (fos.children != null) {
        fos.children.forEach(cb);
      }
    }
    if (this.value.children != null)
      this.value.children.forEach(cb);
    return res;
  }

  writeValue(obj: FOSModel) : void {
    this.callCallbacks = false;
    this.value = obj;
  }

  registerOnChange(fn: CallbackType) : void {
    this.chCallback = fn;
  }

  registerOnTouched(fn: CallbackType) : void {
    this.tcCallback = fn;
  }

  getParents(): FOSModel[] {
    let ret = [this.root].concat(getFOSParents(this.value).reverse());
    if (this.value != this.root && this.value != null)
      ret.push(this.value);
    return ret;
  }

  breadcrumbClicked(item) {
    this.value = item;
    setTimeout(() => {
      if (this.lookupElement) this.lookupElement.focused()
    }, 100);
  }

}

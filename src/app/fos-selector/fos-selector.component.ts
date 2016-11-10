import { Component, OnInit, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FOSModel } from '../models/dto';
import { StorageService } from '../storage.service';
import { baseLookup, stringContains } from '../utils/index';

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

  @ViewChild("lookupElement") lookupElement;

  _value: FOSModel;
  search: string;
  get value(): FOSModel {
    return this._value;
  }
  set value(value: FOSModel) {
    this._value = value;
    if (this.chCallback != null)
      this.chCallback(value);
    if (this.lookupElement) {
      this.lookupElement.open = false;
      this.search = "";
    }
  }
  chCallback: CallbackType;
  tcCallback: CallbackType;

  root: FOSModel;

  constructor(protected storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getFOShierarchy().subscribe(root => {
      this.root = root;
      this.value = root;
    });
  }

  lookup = (query: string): FOSModel[] => {
    if (this.value == null)
      return null;
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
    this.value = obj;
  }

  registerOnChange(fn: CallbackType) : void {
    this.chCallback = fn;
  }

  registerOnTouched(fn: CallbackType) : void {
    this.tcCallback = fn;
  }

}

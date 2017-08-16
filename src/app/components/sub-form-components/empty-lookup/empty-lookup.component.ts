import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-empty-lookup',
  templateUrl: './empty-lookup.component.html',
  styleUrls: ['./empty-lookup.component.scss']
})
export class EmptyLookupComponent<T> extends BaseComponent implements OnInit {

  isFocused = false;

  @Input() placeholder = '';
  @Input() lookup: (query: string) => T[] | Observable<T[]>;
  @Input() field: string;
  @Output() pickChange = new EventEmitter<T>();
  @ViewChild('inputElement') inputElement: ElementRef;
  items: T[];
  value: string;

  getText(item: T) {
    if (this.field) {
      return item[this.field];
    } else {
      return item;
    }
  }

  refresh() {
    if (this.lookup == null) {
      return;
    }
    let ret = this.lookup(this.value || '');
    if (ret instanceof Array) {
      ret = Observable.of(ret);
    }
    if (ret != null) {
      this.subscriptions.push(ret.subscribe(vals => this.items = vals));
    }
  }

  selected(item: T) {
    this.pickChange.emit(item);
    this.focused();
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }

  isOpen(): boolean {
    return this.isFocused;
  }

  focused() {
    this.isFocused = true;
    this.inputElement.nativeElement.focus();
    this.refresh();
  }

  blured() {
    setTimeout(() => {
      if (document.activeElement !== this.inputElement.nativeElement) {
        this.isFocused = false;
      }
    }, 100);
  }

  clicked(event: MouseEvent) {
    this.focused();
    event.preventDefault();
  }

}

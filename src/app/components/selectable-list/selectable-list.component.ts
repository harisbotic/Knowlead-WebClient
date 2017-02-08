import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss']
})
export class SelectableListComponent extends BaseComponent implements OnInit {

  @Input() items: any[];
  @Input() isRemovableCallback: (item: any) => boolean;
  @Input() displayProperty: string;
  @Output() itemClicked = new EventEmitter<any>();
  @Output() itemRemoved = new EventEmitter<any>();

  constructor() { super(); }

  ngOnInit() {
  }

  isRemovable(item) {
    if (this.isRemovableCallback != null) {
      return this.isRemovableCallback(item);
    }
    return false;
  }

  displayItem(item): string {
    if (this.displayProperty != null) {
      return item[this.displayProperty];
    }
    return item;
  }

  itemClickedLocal(item) {
    this.itemClicked.emit(item);
  }

  itemRemovedLocal(item) {
    this.itemRemoved.emit(item);
  }

  loop(from: number, to: number) {
    const ret = [];
    for (let i = 0; i < to; i++) {
      ret.push(i);
    }
    return ret;
  }

  getItem(index: number) {
    return this.items[index];
  }

}

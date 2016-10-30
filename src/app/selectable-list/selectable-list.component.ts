import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss']
})
export class SelectableListComponent implements OnInit {

  @Input() items: any[];
  @Input() isRemovableCallback: (item: any) => boolean; 
  @Input() displayProperty: string;
  @Output() itemClicked = new EventEmitter<any>();
  @Output() itemRemoved = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  isRemovable(item) {
    if (this.isRemovableCallback != null) {
      return this.isRemovableCallback(item);
    }
    return false;
  }

  displayItem(item): string {
    if (this.displayProperty != null)
      return item[this.displayProperty];
    return item;
  }

  itemClickedLocal(item) {
    this.itemClicked.emit(item);
  }

  itemRemovedLocal(item) {
    this.itemRemoved.emit(item);
  }

}

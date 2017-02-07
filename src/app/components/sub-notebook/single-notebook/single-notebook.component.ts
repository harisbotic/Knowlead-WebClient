import { Component, OnInit, Input } from '@angular/core';
import { NotebookModel } from '../../../models/dto';
import { getGuid } from '../../../utils/index';

@Component({
  selector: 'app-single-notebook',
  templateUrl: './single-notebook.component.html',
  styleUrls: ['./single-notebook.component.scss']
})
export class SingleNotebookComponent implements OnInit {

  @Input() notebook: NotebookModel;

  guid = getGuid();

  constructor() { }

  ngOnInit() {
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookEditPopupComponent } from './notebook-edit-popup.component';

describe('NotebookEditPopupComponent', () => {
  let component: NotebookEditPopupComponent;
  let fixture: ComponentFixture<NotebookEditPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookEditPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

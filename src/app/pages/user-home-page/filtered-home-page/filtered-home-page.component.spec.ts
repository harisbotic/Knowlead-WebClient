import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredHomePageComponent } from './filtered-home-page.component';

describe('FilteredHomePageComponent', () => {
  let component: FilteredHomePageComponent;
  let fixture: ComponentFixture<FilteredHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

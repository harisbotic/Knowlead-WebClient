import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeReviewsComponent } from './about-me-reviews.component';

describe('AboutMeReviewsComponent', () => {
  let component: AboutMeReviewsComponent;
  let fixture: ComponentFixture<AboutMeReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutMeReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMeReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

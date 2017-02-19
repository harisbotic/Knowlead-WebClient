import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeP2psComponent } from './about-me-p2ps.component';

describe('AboutMeP2psComponent', () => {
  let component: AboutMeP2psComponent;
  let fixture: ComponentFixture<AboutMeP2psComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutMeP2psComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMeP2psComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

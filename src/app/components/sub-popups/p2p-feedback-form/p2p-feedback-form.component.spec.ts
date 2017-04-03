import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pFeedbackFormComponent } from './p2p-feedback-form.component';

describe('P2pFeedbackFormComponent', () => {
  let component: P2pFeedbackFormComponent;
  let fixture: ComponentFixture<P2pFeedbackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P2pFeedbackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

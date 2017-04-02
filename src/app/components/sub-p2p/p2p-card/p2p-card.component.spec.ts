import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pCardComponent } from './p2p-card.component';

describe('P2pCardComponent', () => {
  let component: P2pCardComponent;
  let fixture: ComponentFixture<P2pCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P2pCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

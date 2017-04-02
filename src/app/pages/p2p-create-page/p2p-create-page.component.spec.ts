import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pCreatePageComponent } from './p2p-create-page.component';

describe('P2pCreatePageComponent', () => {
  let component: P2pCreatePageComponent;
  let fixture: ComponentFixture<P2pCreatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P2pCreatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

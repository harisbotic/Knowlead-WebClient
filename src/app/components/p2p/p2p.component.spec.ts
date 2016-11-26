/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { P2pComponent } from './p2p.component';

describe('P2pComponent', () => {
  let component: P2pComponent;
  let fixture: ComponentFixture<P2pComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P2pComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

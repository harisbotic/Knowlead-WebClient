/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { P2pThreadComponent } from './p2p-thread.component';

describe('P2pThreadComponent', () => {
  let component: P2pThreadComponent;
  let fixture: ComponentFixture<P2pThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P2pThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

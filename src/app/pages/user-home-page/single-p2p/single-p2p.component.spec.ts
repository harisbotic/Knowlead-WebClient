/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SingleP2pComponent } from './single-p2p.component';

describe('SingleP2pComponent', () => {
  let component: SingleP2pComponent;
  let fixture: ComponentFixture<SingleP2pComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleP2pComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

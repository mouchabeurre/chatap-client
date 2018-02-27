import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsAddComponent } from './guests-add.component';

describe('GuestsAddComponent', () => {
  let component: GuestsAddComponent;
  let fixture: ComponentFixture<GuestsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

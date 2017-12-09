import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomcreationdialogComponent } from './roomcreationdialog.component';

describe('RoomcreationdialogComponent', () => {
  let component: RoomcreationdialogComponent;
  let fixture: ComponentFixture<RoomcreationdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomcreationdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomcreationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

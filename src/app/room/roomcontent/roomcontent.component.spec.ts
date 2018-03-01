import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomcontentComponent } from './roomcontent.component';

describe('RoomcontentComponent', () => {
  let component: RoomcontentComponent;
  let fixture: ComponentFixture<RoomcontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomcontentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

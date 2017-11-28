import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalayoutComponent } from './globalayout.component';

describe('GlobalayoutComponent', () => {
  let component: GlobalayoutComponent;
  let fixture: ComponentFixture<GlobalayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

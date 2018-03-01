import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackGrowlerComponent } from './snack-growler.component';

describe('SnackGrowlerComponent', () => {
  let component: SnackGrowlerComponent;
  let fixture: ComponentFixture<SnackGrowlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackGrowlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackGrowlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

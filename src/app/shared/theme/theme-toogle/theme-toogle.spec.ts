import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToogle } from './theme-toogle';

describe('ThemeToogle', () => {
  let component: ThemeToogle;
  let fixture: ComponentFixture<ThemeToogle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToogle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeToogle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

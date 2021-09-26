import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimerjevalnikComponent } from './primerjevalnik.component';

describe('PrimerjevalnikComponent', () => {
  let component: PrimerjevalnikComponent;
  let fixture: ComponentFixture<PrimerjevalnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimerjevalnikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimerjevalnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

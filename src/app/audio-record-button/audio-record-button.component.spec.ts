import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRecordButtonComponent } from './audio-record-button.component';

describe('AudioRecordButtonComponent', () => {
  let component: AudioRecordButtonComponent;
  let fixture: ComponentFixture<AudioRecordButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioRecordButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioRecordButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

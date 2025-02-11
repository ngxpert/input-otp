import {
  AfterViewInit,
  Component,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOTPComponent, REGEXP_ONLY_DIGITS } from '@ngxpert/input-otp';
import { FakeDashComponent } from './components/fake-dash/fake-dash.component';
import { SlotComponent } from './components/slot/slot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputOTPComponent, FormsModule, FakeDashComponent, SlotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  otpValue = '12';
  REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;

  otp = viewChild<InputOTPComponent>(InputOTPComponent);
  disabled = signal(false);
  t1: ReturnType<typeof setTimeout> | undefined;
  t2: ReturnType<typeof setTimeout> | undefined;

  onComplete(value: string) {
    console.log('OTP completed:', value);
  }
  ngAfterViewInit() {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobile) {
      this.disabled.set(true);
    }
    this.t1 = setTimeout(() => {
      this.disabled.set(false);
    }, 1_900);

    this.t2 = setTimeout(
      () => {
        this.otp()?.inputRef()?.nativeElement.focus();
      },
      isMobile ? 0 : 2_500,
    );
  }

  ngOnDestroy() {
    clearTimeout(this.t1);
    clearTimeout(this.t2);
  }
}

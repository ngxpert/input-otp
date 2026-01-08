import {
  AfterViewInit,
  Component,
  OnDestroy,
  signal,
  viewChild,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOTPComponent, REGEXP_ONLY_DIGITS } from '@ngxpert/input-otp';
import { FakeDashComponent } from '../fake-dash/fake-dash.component';
import { SlotComponent } from '../slot/slot.component';
import { cn } from '../../lib/utils';
@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  imports: [InputOTPComponent, FormsModule, FakeDashComponent, SlotComponent],
})
export class ShowcaseComponent implements AfterViewInit, OnDestroy {
  otpValue = '12';
  REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
  cn = cn;
  readonly className = input('');

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

  onSubmit() {
    console.log('OTP submitted:', this.otpValue);
  }

  ngOnDestroy() {
    clearTimeout(this.t1);
    clearTimeout(this.t2);
  }
}

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  booleanAttribute,
  numberAttribute,
  viewChild,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOTPComponent } from '@ngxpert/input-otp';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.component.html',
  imports: [InputOTPComponent, FormsModule],
})
export class TestBaseInputComponent implements AfterViewInit {
  value = '';
  cn = cn;

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly inputMode = input<'numeric' | 'text'>('numeric');
  readonly maxLength = input(6, { transform: numberAttribute });
  readonly pattern = input<string | RegExp>();
  readonly placeholder = input<string>();
  readonly containerClass = input<string>();
  readonly id = input<string>();
  readonly name = input<string>();
  readonly focusAfterInit = input(false, { transform: booleanAttribute });
  @Output() complete = new EventEmitter<string>();

  otpInput = viewChild<InputOTPComponent>('otpInput');

  ngAfterViewInit() {
    if (this.focusAfterInit()) {
      this.otpInput()?.inputRef()?.nativeElement.focus();
    }
  }
}

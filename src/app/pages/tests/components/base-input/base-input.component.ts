import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  numberAttribute,
  viewChild,
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

  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() inputMode: 'numeric' | 'text' = 'numeric';
  @Input({ transform: numberAttribute }) maxLength = 6;
  @Input() pattern?: string | RegExp;
  @Input() placeholder?: string;
  @Input() containerClass?: string;
  @Input() id?: string;
  @Input() name?: string;
  @Input({ transform: booleanAttribute }) focusAfterInit = false;
  @Output() complete = new EventEmitter<string>();

  otpInput = viewChild<InputOTPComponent>('otpInput');

  ngAfterViewInit() {
    if (this.focusAfterInit) {
      this.otpInput()?.inputRef()?.nativeElement.focus();
    }
  }
}

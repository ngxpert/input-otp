import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOTPComponent } from '@ngxpert/input-otp';
import { SlotComponent } from './slot.component';
import { FakeDashComponent } from './fake-components';

@Component({
  selector: 'app-examples-main',
  template: `
    <input-otp
      [maxLength]="6"
      containerClass="group flex items-center has-[:disabled]:opacity-30"
      [(ngModel)]="otpValue"
      #otp="inputOtp"
    >
      <div class="flex">
        @for (slot of otp.slots().slice(0, 3); track $index) {
          <app-slot
            [isActive]="slot.isActive"
            [char]="slot.char"
            [placeholderChar]="slot.placeholderChar"
            [hasFakeCaret]="slot.hasFakeCaret"
          />
        }
      </div>
      <app-fake-dash />
      <div class="flex">
        @for (slot of otp.slots().slice(3, 6); track $index + 3) {
          <app-slot
            [isActive]="slot.isActive"
            [char]="slot.char"
            [placeholderChar]="slot.placeholderChar"
            [hasFakeCaret]="slot.hasFakeCaret"
          />
        }
      </div>
    </input-otp>
  `,
  imports: [FormsModule, InputOTPComponent, SlotComponent, FakeDashComponent],
})
export class ExamplesMainComponent {
  otpValue = '';
}

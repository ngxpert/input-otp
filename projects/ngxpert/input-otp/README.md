# @ngxpert/input-otp

A modern, lightweight, and accessible OTP input component for Angular applications.

## Installation

```bash
npm install @ngxpert/input-otp
```

## Features

- 📱 Mobile-friendly
- 🔒 Password manager detection
- ♿️ Accessible
- 🎨 Highly customizable
- 🚀 Built with Angular standalone components

## Usage

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { InputOTPComponent, OtpSlotDirective, REGEXP_ONLY_DIGITS } from '@ngxpert/input-otp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputOTPComponent, OtpSlotDirective],
  template: `
    <lib-input-otp
      #otp="otpContext"
      [maxLength]="6"
      [pattern]="REGEXP_ONLY_DIGITS"
      containerClassName="group flex items-center has-[:disabled]:opacity-30"
      [(value)]="otpValue"
      (complete)="onComplete($event)"
    >
      <div class="flex gap-2">
        @for (slot of otp.renderContext.slots; track slot) {
          <ng-container *libOtpSlot="slot">
            <!-- Custom slot template -->
            <div
              class="relative w-10 h-14 text-[2rem] flex items-center justify-center transition-all duration-300 border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20 outline outline-0 outline-accent-foreground/20"
              [class.outline-4]="slot.isActive"
              [class.outline-accent-foreground]="slot.isActive"
            >
              <div class="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
                {{ slot.char ?? slot.placeholderChar }}
              </div>
              @if (slot.hasFakeCaret) {
                <div class="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
                  <div class="w-px h-8 bg-white"></div>
                </div>
              }
            </div>
          </ng-container>
        }
      </div>
    </lib-input-otp>
  `
})
export class AppComponent {
  otpValue = '';
  REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;

  onComplete(value: string) {
    console.log('OTP completed:', value);
  }
}
```

## Styling

The component uses Tailwind CSS classes by default. Add these animations to your `tailwind.config.ts`:

```typescript
const config = {
  theme: {
    extend: {
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.2s ease-out infinite',
      },
    },
  },
};

export default config;
```

## Props

### InputOTPComponent

| Prop               | Type                          | Default         | Description                          |
| ------------------ | ----------------------------- | --------------- | ------------------------------------ |
| maxLength          | number                        | required        | Maximum length of the OTP input      |
| value              | string                        | ''              | Current value of the input           |
| pattern            | string \| RegExp              | undefined       | Pattern to validate input against    |
| textAlign          | 'left' \| 'center' \| 'right' | 'left'          | Text alignment within the input      |
| placeholder        | string                        | undefined       | Placeholder text                     |
| inputMode          | 'numeric' \| 'text'           | 'numeric'       | Input mode for mobile keyboards      |
| disabled           | boolean                       | false           | Whether the input is disabled        |
| autoComplete       | string                        | 'one-time-code' | Autocomplete attribute value         |
| containerClassName | string                        | undefined       | Class name for the container element |

### Events

| Event       | Type   | Description                        |
| ----------- | ------ | ---------------------------------- |
| valueChange | string | Emitted when the value changes     |
| complete    | string | Emitted when all digits are filled |

### Slot Context

The `*libOtpSlot` directive provides the following context to your template:

```typescript
interface SlotProps {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}
```

## License

MIT

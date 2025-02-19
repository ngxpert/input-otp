# The only accessible & unstyled & full featured Input OTP component for Angular
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

### OTP Input for Angular 🔐 by [@shhdharmen](https://twitter.com/shhdharmen)



## Usage

```bash
ng add @ngxpert/input-otp
```

Then import the component.

```ts
import { InputOTPComponent } from '@ngxpert/input-otp';
@Component({
  selector: 'app-my-component',
  template: `
    <input-otp [maxLength]="6" [(ngModel)]="otpValue">
      <div style="display: flex;">
        @for (slot of otp.slots(); track $index) {
          <div>{{ slot.char }}</div>
        }
      </div>
    </input-otp>
  `,
  imports: [InputOTPComponent, FormsModule],
})
export class MyComponent {
  otpValue = '';
}
```

## Features

- ✅ Works with `Template-Driven Forms` and `Reactive Forms` out of the box.
- ✅ Supports copy-paste-cut
- ✅ Supports all keybindings

## Default example

The example below uses `tailwindcss` `tailwind-merge` `clsx`:

### main.component

```tsx
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

```

### slot.component

```ts
import { Component, Input } from '@angular/core';
import { FakeCaretComponent } from './fake-components';
import { cn } from './utils';

@Component({
  selector: 'app-slot',
  template: `
    <div
      [class]="
        cn(
          'relative w-10 h-14 text-[2rem]',
          'flex items-center justify-center',
          'transition-all duration-300',
          'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
          'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
          'outline outline-0 outline-accent-foreground/20',
          { 'outline-4 outline-accent-foreground': isActive }
        )
      "
    >
      @if (char) {
        <div>{{ char }}</div>
      } @else {
        {{ ' ' }}
      }
      @if (hasFakeCaret) {
        <app-fake-caret />
      }
    </div>
  `,
  imports: [FakeCaretComponent],
})
export class SlotComponent {
  @Input() isActive = false;
  @Input() char: string | null = null;
  @Input() placeholderChar: string | null = null;
  @Input() hasFakeCaret = false;
  cn = cn;
}

```

### fake-components

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-fake-dash',
  template: `
    <div class="flex w-10 justify-center items-center">
      <div class="w-3 h-1 rounded-full bg-border"></div>
    </div>
  `,
})
export class FakeDashComponent {}

@Component({
  selector: 'app-fake-caret',
  template: `
    <div
      class="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink"
    >
      <div class="w-px h-8 bg-white"></div>
    </div>
  `,
})
export class FakeCaretComponent {}

```

### utils

```ts
// Small utility to merge class names.
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

## How it works

There's currently no native OTP/2FA/MFA input in HTML, which means people are either going with

1. a simple input design or
2. custom designs like this one.

This library works by rendering an invisible input as a sibling of the slots, contained by a `relative`ly positioned parent (the container root called _input-otp_).

<!-- ## Features

### This is the most complete OTP input for Angular. It's fully featured

Works with `Template-Driven Forms` and `Reactive Forms` out of the box.

<details>
<summary>Supports iOS + Android copy-paste-cut</summary>

TBA video

</details>

<details>
<summary>Automatic OTP code retrieval from transport (e.g SMS)</summary>

By default, this input uses `autocomplete='one-time-code'` and it works as it's a single input. 

TBA video

</details>

<details>
<summary>Supports screen readers (a11y)</summary>

Take a look at Stripe's input. The screen reader does not behave like it normally should on a normal single input.
That's because Stripe's solution is to render a 1-digit input with "clone-divs" rendering a single char per div.

https://github.com/guilhermerodz/input-otp/assets/10366880/3d127aef-147c-4f28-9f6c-57a357a802d0

So we're rendering a single input with invisible/transparent colors instead.
The screen reader now gets to read it, but there is no appearance. Feel free to build whatever UI you want:

TBA video

</details>

<details>
<summary>Supports all keybindings</summary>

Should be able to support all keybindings of a common text input as it's an input.

TBA video

</details> -->

## API Reference

### `<input-otp>`

The root container. Define settings for the input via inputs. Then, use the `inputOtp.slots()` property to create the slots.

#### Inputs and outputs

```ts
export interface InputOTPInputsOutputs {
  // The number of slots
  maxLength: InputSignal<number>;

  // Pro tip: input-otp export some patterns by default such as REGEXP_ONLY_DIGITS which you can import from the same library path
  // Example: import { REGEXP_ONLY_DIGITS } from '@ngxpert/input-otp';
  // Then use it as: <input-otp [pattern]="REGEXP_ONLY_DIGITS">
  pattern?: InputSignal<string | RegExp | undefined>;

  // While rendering the input slot, you can access both the char and the placeholder, if there's one and it's active.
  // If you expect input to be of 6 characters, provide 6 characters in the placeholder.
  placeholder?: InputSignal<string | undefined>;

  // Virtual keyboard appearance on mobile
  // Default: 'numeric'
  inputMode?: InputSignal<'numeric' | 'text'>;

  // The autocomplete attribute for the input
  // Default: 'one-time-code'
  autoComplete?: InputSignal<string | undefined>;

  // The class name for the container
  containerClass?: InputSignal<string | undefined>;

  // Emits the complete value when the input is filled
  complete: OutputEmitterRef<string>;
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/shhdharmen"><img src="https://avatars.githubusercontent.com/u/6831283?v=4?s=100" width="100px;" alt="Dharmen Shah"/><br /><sub><b>Dharmen Shah</b></sub></a><br /><a href="#a11y-shhdharmen" title="Accessibility">️️️️♿️</a> <a href="#question-shhdharmen" title="Answering Questions">💬</a> <a href="https://github.com/ngxpert/input-otp/issues?q=author%3Ashhdharmen" title="Bug reports">🐛</a> <a href="https://github.com/ngxpert/input-otp/commits?author=shhdharmen" title="Code">💻</a> <a href="#content-shhdharmen" title="Content">🖋</a> <a href="https://github.com/ngxpert/input-otp/commits?author=shhdharmen" title="Documentation">📖</a> <a href="#example-shhdharmen" title="Examples">💡</a> <a href="#maintenance-shhdharmen" title="Maintenance">🚧</a> <a href="#projectManagement-shhdharmen" title="Project Management">📆</a> <a href="https://github.com/ngxpert/input-otp/pulls?q=is%3Apr+reviewed-by%3Ashhdharmen" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ngxpert/input-otp/commits?author=shhdharmen" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

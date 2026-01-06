import { Component, Input, input } from '@angular/core';
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
          'border-y border-r',
          'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
          'outline outline-0 outline-accent-foreground/20',
          { 'outline-4 outline-accent-foreground': isActive() },
          { 'border-l rounded-l-md': first() },
          { 'rounded-r-md': last() }
        )
      "
    >
      @if (char) {
        <div>{{ char }}</div>
      } @else {
        {{ ' ' }}
      }
      @if (hasFakeCaret()) {
        <app-fake-caret />
      }
    </div>
  `,
  imports: [FakeCaretComponent],
})
export class SlotComponent {
  readonly isActive = input(false);
  @Input() char: string | null = null;
  readonly placeholderChar = input<string | null>(null);
  readonly hasFakeCaret = input(false);
  readonly first = input(false);
  readonly last = input(false);
  cn = cn;
}

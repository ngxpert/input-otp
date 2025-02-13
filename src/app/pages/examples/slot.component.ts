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

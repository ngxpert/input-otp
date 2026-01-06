import { Component, Input, input } from '@angular/core';
import { FakeCaretComponent } from '../fake-caret/fake-caret.component';
import { NgClass } from '@angular/common';
import { SlotProps } from '@ngxpert/input-otp';

@Component({
  selector: 'app-slot',
  imports: [FakeCaretComponent, NgClass],
  templateUrl: './slot.component.html',
})
export class SlotComponent implements SlotProps {
  readonly isActive = input(false);
  @Input() char: string | null = null;
  readonly placeholderChar = input<string | null>(null);
  readonly hasFakeCaret = input(false);
  readonly first = input(false);
  readonly last = input(false);
  private _animateIdx: number | undefined;
  willAnimateChar = false;
  willAnimateCaret = false;
  @Input()
  get animateIdx(): number | undefined {
    return this._animateIdx;
  }

  set animateIdx(value: number | undefined) {
    this._animateIdx = value;
    this.willAnimateChar =
      this._animateIdx !== undefined && this._animateIdx < 2;
    this.willAnimateCaret = this._animateIdx === 2;
  }
}

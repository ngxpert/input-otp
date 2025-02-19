import { Component, Input } from '@angular/core';
import { FakeCaretComponent } from '../fake-caret/fake-caret.component';
import { NgClass } from '@angular/common';
import { SlotProps } from '@ngxpert/input-otp';

@Component({
  selector: 'app-slot',
  imports: [FakeCaretComponent, NgClass],
  templateUrl: './slot.component.html',
})
export class SlotComponent implements SlotProps {
  @Input() isActive = false;
  @Input() char: string | null = null;
  @Input() placeholderChar: string | null = null;
  @Input() hasFakeCaret = false;
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

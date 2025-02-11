import { Directive } from '@angular/core';
import { SlotProps } from '../../types';

@Directive({
  selector: '[libOtpSlot]',
})
export class OtpSlotDirective implements SlotProps {
  isActive = false;
  char: string | null = null;
  placeholderChar: string | null = null;
  hasFakeCaret = false;
}

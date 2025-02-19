import { InputSignal, OutputEmitterRef } from '@angular/core';

export interface SlotProps {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}

export interface InputOTPInputsOutputs {
  maxLength: InputSignal<number>;
  // TODO: Add support for textAlign
  textAlign?: InputSignal<'left' | 'center' | 'right'>;
  pattern?: InputSignal<string | RegExp | undefined>;
  placeholder?: InputSignal<string | undefined>;
  inputMode?: InputSignal<'numeric' | 'text'>;
  disabled?: InputSignal<boolean>;
  autoComplete?: InputSignal<string | undefined>;
  // TODO: Add support for password manager badge
  pushPasswordManagerStrategy?: InputSignal<'increase-width' | 'none'>;
  containerClass?: InputSignal<string | undefined>;
  complete: OutputEmitterRef<string>;
}

export interface OTPSlot {
  char: string | null;
  placeholderChar: string | null;
  isActive: boolean;
  hasFakeCaret: boolean;
}

export interface OTPRenderContext {
  slots: OTPSlot[];
  isFocused: boolean;
  isHovering: boolean;
}

export interface SlotProps {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}

export interface OTPInputProps {
  value?: string;
  maxLength: number;
  textAlign?: 'left' | 'center' | 'right';
  pattern?: string | RegExp;
  placeholder?: string;
  inputMode?: 'numeric' | 'text';
  disabled?: boolean;
  autoComplete?: string;
  pushPasswordManagerStrategy?: 'increase-width' | 'none';
  containerClassName?: string;
  noScriptCSSFallback?: string | null;
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

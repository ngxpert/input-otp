import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  linkedSignal,
  OnDestroy,
  output,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { OTPSlot } from '../../types';
import { DOCUMENT } from '@angular/common';
import { getControlValueSignal } from '../../control-value-signal';

// TODO: Fix password manager badge tracking
// const PWM_BADGE_MARGIN_RIGHT = 18;
const PWM_BADGE_SPACE_WIDTH_PX = 40;
const PWM_BADGE_SPACE_WIDTH = `${PWM_BADGE_SPACE_WIDTH_PX}px`;

// TODO: Fix password manager badge tracking
// const PASSWORD_MANAGERS_SELECTORS = [
//   '[data-lastpass-icon-root]', // LastPass
//   'com-1password-button', // 1Password
//   '[data-dashlanecreated]', // Dashlane
//   '[style$="2147483647 !important;"]', // Bitwarden
// ].join(',');

@Component({
  selector: 'input-otp',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './input-otp.component.html',
  exportAs: 'inputOtp',
  styleUrls: ['./input-otp.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputOTPComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: InputOTPComponent,
      multi: true,
    },
  ],
  host: {
    '[id]': 'id',
  },
})
export class InputOTPComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator
{
  static nextId = 0;
  readonly idNextId = `input-otp-${InputOTPComponent.nextId++}`;
  id = input<string | undefined>(this.idNextId);
  name = input<string | undefined>();
  containerRef = viewChild<ElementRef<HTMLDivElement>>('containerRef');
  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  maxLength = input.required<number>();
  textAlign = input<'left' | 'center' | 'right'>('left');
  pattern = input<string | RegExp>();
  placeholder = input<string>();
  inputMode = input<'numeric' | 'text'>('numeric');
  disabled = input<boolean>(false);
  autoComplete = input<string>();
  pushPasswordManagerStrategy = input<'increase-width' | 'none'>(
    'increase-width',
  );
  containerClass = input<string>();
  pasteTransformer = input<(content: string | undefined) => string>();
  complete = output<string>();

  mirrorSelectionStart = signal<number | null>(null);
  mirrorSelectionEnd = signal<number | null>(null);
  isFocused = signal(false);
  isHovering = signal(false);
  hasPWMBadge = signal(false);
  hasPWMBadgeSpace = signal(false);
  done = signal(false);
  formControl = new FormControl('');
  value = getControlValueSignal(this.formControl, inject(Injector));
  slots = computed<OTPSlot[]>(() => {
    const slots: OTPSlot[] = [];
    for (let i = 0; i < this.maxLength(); i++) {
      const mirrorSelectionStart = this.mirrorSelectionStart();
      const mirrorSelectionEnd = this.mirrorSelectionEnd();
      const isActive =
        this.isFocused() &&
        mirrorSelectionStart !== null &&
        mirrorSelectionEnd !== null &&
        ((mirrorSelectionStart === mirrorSelectionEnd &&
          i === mirrorSelectionStart) ||
          (i >= mirrorSelectionStart && i < mirrorSelectionEnd));

      const value = this.value();
      const char = value && value[i] !== undefined ? value[i] : null;
      const placeholderChar =
        value && value[0] !== undefined
          ? null
          : (this.placeholder()?.[i] ?? null);
      slots.push({
        char,
        placeholderChar,
        isActive,
        hasFakeCaret: isActive && char === null,
      });
    }
    return slots;
  });

  private resizeObserver?: ResizeObserver;
  private previousValue: string | null | undefined;
  private document = inject(DOCUMENT);
  private renderer2 = inject(Renderer2);
  private isIOS = false;
  private inputMetadataRef = linkedSignal<{
    prev: [
      number | null,
      number | null,
      'none' | 'forward' | 'backward' | null,
    ];
  }>(() => ({
    prev: [
      this.inputRef()?.nativeElement?.selectionStart ?? null,
      this.inputRef()?.nativeElement?.selectionEnd ?? null,
      this.inputRef()?.nativeElement?.selectionDirection ?? 'none',
    ],
  }));
  private onDocumentSelectionChange?: () => void;

  constructor() {
    this.formControl.addValidators([this.validate.bind(this)]);
    effect(() => {
      const newValue = this.value();
      if (
        this.previousValue !== null &&
        this.previousValue !== undefined &&
        this.previousValue.length < this.maxLength() &&
        this.formControl.valid
      ) {
        // formControl.valid is true if the value is valid, so we can safely emit the value
        this.valueOrFocusedChanged();

        if (
          newValue !== null &&
          newValue !== undefined &&
          newValue.length === this.maxLength()
        ) {
          this.complete.emit(newValue);
        }
      }
      this.previousValue = newValue;
    });
  }

  writeValue(value: string): void {
    this.formControl.setValue(value);
  }
  registerOnChange(fn: (value: string | null) => void): void {
    this.formControl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: () => void): void {
    this.formControl.valueChanges.subscribe(fn);
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
  validate(control: AbstractControl<string | null>): ValidationErrors | null {
    const value = control.value;
    if (value?.length !== this.maxLength()) {
      return { length: true };
    }
    const pattern = this.pattern();
    const regexp = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    if (value?.length > 0 && !regexp?.test(value)) {
      return { pattern: true };
    }
    return null;
  }

  private valueOrFocusedChanged() {
    // Forcefully remove :autofill state
    console.log('valueOrFocusedChanged');
    this.inputRef()?.nativeElement?.dispatchEvent(new Event('input'));

    // Update the selection state
    const s = this.inputRef()?.nativeElement?.selectionStart;
    const e = this.inputRef()?.nativeElement?.selectionEnd;
    const dir = this.inputRef()?.nativeElement?.selectionDirection;
    if (
      s !== null &&
      s !== undefined &&
      e !== null &&
      e !== undefined &&
      dir !== null &&
      dir !== undefined
    ) {
      this.mirrorSelectionStart.set(s);
      this.mirrorSelectionEnd.set(e);
      this.inputMetadataRef.set({ prev: [s, e, dir] });
    }
  }

  rootStyle = computed<Record<string, string>>(() => ({
    position: 'relative',
    cursor: this.disabled() ? 'default' : 'text',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    pointerEvents: 'none',
  }));

  inputStyle = computed<Record<string, string | undefined>>(() => {
    const willPushPWMBadge =
      this.pushPasswordManagerStrategy() !== 'none' &&
      this.hasPWMBadge() &&
      this.hasPWMBadgeSpace();

    return {
      position: 'absolute',
      inset: '0',
      width: willPushPWMBadge
        ? `calc(100% + ${PWM_BADGE_SPACE_WIDTH})`
        : '100%',
      clipPath: willPushPWMBadge
        ? `inset(0 ${PWM_BADGE_SPACE_WIDTH} 0 0)`
        : undefined,
      height: '100%',
      display: 'flex',
      textAlign: this.textAlign(),
      opacity: '1',
      color: 'transparent',
      pointerEvents: 'all',
      background: 'transparent',
      caretColor: 'transparent',
      border: '0 solid transparent',
      outline: '0 solid transparent',
      boxShadow: 'none',
      lineHeight: '1',
      letterSpacing: '-0.5em',
      fontSize: 'var(--root-height)',
      fontFamily: 'monospace',
      fontVariantNumeric: 'tabular-nums',
    };
  });

  ngAfterViewInit() {
    this.setupResizeObserver();
    const onDocumentSelectionChange = () => {
      const input = this.inputRef()?.nativeElement;
      if (this.document.activeElement !== input) {
        this.mirrorSelectionStart.set(null);
        this.mirrorSelectionEnd.set(null);
        return;
      }

      // Aliases
      const _s = input.selectionStart;
      const _e = input.selectionEnd;
      const _dir = input.selectionDirection;
      const _ml = input.maxLength;
      const _val = input.value;
      const _prev = this.inputMetadataRef().prev;

      // Algorithm
      let start = -1;
      let end = -1;
      let direction: 'forward' | 'backward' | 'none' | undefined;
      if (_val.length !== 0 && _s !== null && _e !== null) {
        const isSingleCaret = _s === _e;
        const isInsertMode = _s === _val.length && _val.length < _ml;

        if (isSingleCaret && !isInsertMode) {
          const c = _s;
          if (c === 0) {
            start = 0;
            end = 1;
            direction = 'forward';
          } else if (c === _ml) {
            start = c - 1;
            end = c;
            direction = 'backward';
          } else if (_ml > 1 && _val.length > 1) {
            let offset = 0;
            if (_prev[0] !== null && _prev[1] !== null) {
              direction = c < _prev[1] ? 'backward' : 'forward';
              const wasPreviouslyInserting =
                _prev[0] === _prev[1] && _prev[0] < _ml;
              if (direction === 'backward' && !wasPreviouslyInserting) {
                offset = -1;
              }
            }

            start = offset + c;
            end = offset + c + 1;
          }
        }

        if (start !== -1 && end !== -1 && start !== end) {
          input.setSelectionRange(start, end, direction);
        }
      }

      // Finally, update the state
      const s = start !== -1 ? start : _s;
      const e = end !== -1 ? end : _e;
      const dir = direction ?? _dir;
      this.mirrorSelectionStart.set(s);
      this.mirrorSelectionEnd.set(e);
      // Store the previous selection value
      this.inputMetadataRef.set({ prev: [s, e, dir] });
    };
    this.document.addEventListener(
      'selectionchange',
      onDocumentSelectionChange,
      {
        capture: true,
      },
    );

    // Set initial mirror state
    onDocumentSelectionChange();
    this.onDocumentSelectionChange = onDocumentSelectionChange;
    if (this.document.activeElement === this.inputRef()?.nativeElement) {
      this.changeFocus(true);
    }
    // Apply needed styles
    if (!this.document.getElementById('input-otp-style')) {
      const styleEl = this.document.createElement('style');
      styleEl.id = 'input-otp-style';
      this.document.head.appendChild(styleEl);

      if (styleEl.sheet) {
        const autofillStyles =
          'background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;';

        this.safeInsertRule(
          styleEl.sheet,
          '[data-input-otp]::selection { background: transparent !important; color: transparent !important; }',
        );
        this.safeInsertRule(
          styleEl.sheet,
          `[data-input-otp]:autofill { ${autofillStyles} }`,
        );
        this.safeInsertRule(
          styleEl.sheet,
          `[data-input-otp]:-webkit-autofill { ${autofillStyles} }`,
        );
        // iOS
        this.safeInsertRule(
          styleEl.sheet,
          `@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }`,
        );
        // PWM badges
        this.safeInsertRule(
          styleEl.sheet,
          `[data-input-otp] + * { pointer-events: all !important; }`,
        );
      }
    }
    // Track root height
    const updateRootHeight = () => {
      if (this.containerRef()?.nativeElement) {
        this.renderer2.setStyle(
          this.containerRef()?.nativeElement,
          '--root-height',
          `${this.inputRef()?.nativeElement.clientHeight}px`,
        );
      }
    };
    updateRootHeight();
  }

  private safeInsertRule(sheet: CSSStyleSheet, rule: string) {
    try {
      sheet.insertRule(rule);
    } catch {
      console.error('input-otp could not insert CSS rule:', rule);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    if (this.onDocumentSelectionChange) {
      this.document.removeEventListener(
        'selectionchange',
        this.onDocumentSelectionChange,
        { capture: true },
      );
    }
  }

  onMouseEnter() {
    this.isHovering.set(true);
  }

  onMouseLeave() {
    this.isHovering.set(false);
  }

  onFocus() {
    this.changeFocus(true);
  }

  onBlur() {
    this.changeFocus(false);
  }

  private changeFocus(value: boolean) {
    console.log('changeFocus', value);
    this.isFocused.set(value);
    this.valueOrFocusedChanged();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    const input = this.inputRef()?.nativeElement;
    if (!input) return;

    this.resizeObserver = new ResizeObserver(() => {
      const container = this.containerRef()?.nativeElement;
      if (container) {
        container.style.setProperty('--root-height', `${input.clientHeight}px`);
      }
    });

    this.resizeObserver.observe(input);
  }
}

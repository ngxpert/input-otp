import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  linkedSignal,
  OnDestroy,
  Output,
  Renderer2,
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
  readonly id = `input-otp-${InputOTPComponent.nextId++}`;
  containerRef = viewChild<ElementRef<HTMLDivElement>>('containerRef');
  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  maxLength = input.required<number>();
  @Input() textAlign: 'left' | 'center' | 'right' = 'left';
  @Input() pattern?: string | RegExp;
  @Input() placeholder?: string;
  @Input() inputMode: 'numeric' | 'text' = 'numeric';
  @Input() disabled = false;
  @Input() autoComplete?: string;
  @Input() pushPasswordManagerStrategy: 'increase-width' | 'none' =
    'increase-width';
  @Input() containerClass?: string;
  @Input() pasteTransformer?: (content: string | undefined) => string;
  @Output() complete = new EventEmitter<string>();

  mirrorSelectionStart: number | null = null;
  mirrorSelectionEnd: number | null = null;
  private _isFocused = false;
  get isFocused() {
    return this._isFocused;
  }
  /**
   * Every time the input's focus state changes, the slots are recomputed.
   */
  set isFocused(value: boolean) {
    this._isFocused = value;
    this.slots.set(this.computeSlots());
    // TODO
    // this.valueOrFocusChanged();
  }
  isHovering = false;
  hasPWMBadge = false;
  hasPWMBadgeSpace = false;
  done = false;
  formControl = new FormControl('');
  slots = linkedSignal<OTPSlot[]>(() => this.computeSlots());

  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private resizeObserver?: ResizeObserver;
  private previousValue: string | null = null;
  private document = inject(DOCUMENT);
  private inputMetadataRef = linkedSignal<{
    prev:
      | [number | null, number | null, 'none' | 'forward' | 'backward' | null]
      | null;
  }>(() => {
    const input = this.inputRef()?.nativeElement;
    if (!input) return { prev: null };

    return {
      prev: [
        input.selectionStart,
        input.selectionEnd,
        input.selectionDirection,
      ],
    };
  });
  private renderer2 = inject(Renderer2);
  private isIOS = false;

  constructor() {
    this.formControl.addValidators([this.validate.bind(this)]);
    this.formControl.valueChanges.subscribe((newValue) => {
      // TODO
      // this.valueOrFocusChanged();
      this.setMirrorValues();
      this.slots.set(this.computeSlots());
      const maybeHasDeleted =
        typeof this.previousValue === 'string' &&
        newValue !== null &&
        newValue.length < this.previousValue.length;
      if (maybeHasDeleted) {
        // Since cutting/deleting text doesn't trigger
        // selectionchange event, we'll have to dispatch it manually.
        // NOTE: The following line also triggers when cmd+A then pasting
        // a value with smaller length, which is not ideal for performance.
        this.document.dispatchEvent(new Event('selectionchange'));
      }
      if (
        this.previousValue !== null &&
        this.previousValue.length < this.maxLength() &&
        this.formControl.valid
      ) {
        // formControl.valid is true if the value is valid, so we can safely emit the value
        this.complete.emit(newValue!);
      }
      this.previousValue = newValue;
    });
  }

  // TODO
  // private valueOrFocusChanged() {
  //   syncTimeouts(() => {
  //     // Forcefully remove :autofill state
  //     this.inputRef()?.nativeElement.dispatchEvent(new Event('input'));
  //     // Update the selection state
  //     const s = this.inputRef()?.nativeElement.selectionStart;
  //     const e = this.inputRef()?.nativeElement.selectionEnd;
  //     const dir = this.inputRef()?.nativeElement.selectionDirection;
  //     if (
  //       s !== null &&
  //       e !== null &&
  //       s !== undefined &&
  //       e !== undefined &&
  //       dir !== undefined &&
  //       dir !== null
  //     ) {
  //       this.mirrorSelectionStart = s;
  //       this.mirrorSelectionEnd = e;
  //       this.inputMetadataRef.set({ prev: [s, e, dir] });
  //     }
  //   });
  // }

  private computeSlots() {
    const value = this.formControl.value;
    const maxLength = this.maxLength();
    return Array.from({ length: maxLength }).map((_, slotIdx) => {
      const isActive =
        this.isFocused &&
        this.mirrorSelectionStart !== null &&
        this.mirrorSelectionEnd !== null &&
        ((this.mirrorSelectionStart === this.mirrorSelectionEnd &&
          slotIdx === this.mirrorSelectionStart) ||
          (slotIdx >= this.mirrorSelectionStart &&
            slotIdx < this.mirrorSelectionEnd));

      const char =
        value && value?.[slotIdx] !== undefined ? value[slotIdx] : null;
      const placeholderChar =
        value && value?.[0] !== undefined
          ? null
          : (this.placeholder?.[slotIdx] ?? null);
      return {
        isActive,
        char,
        placeholderChar,
        hasFakeCaret: isActive && char === null,
      };
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
    if (this.pattern) {
      const regexp =
        typeof this.pattern === 'string'
          ? new RegExp(this.pattern)
          : this.pattern;
      if (value?.length > 0 && !regexp.test(value)) {
        return { pattern: true };
      }
    }
    return null;
  }

  get rootStyle(): Record<string, string> {
    return {
      position: 'relative',
      cursor: this.disabled ? 'default' : 'text',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      pointerEvents: 'none',
    };
  }

  get inputStyle(): Record<string, string | undefined> {
    const willPushPWMBadge =
      this.pushPasswordManagerStrategy !== 'none' &&
      this.hasPWMBadge &&
      this.hasPWMBadgeSpace;

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
      textAlign: this.textAlign,
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
  }

  ngAfterViewInit() {
    // TODO: Fix iOS pasting
    // this.isIOS =
    //   typeof window !== 'undefined' &&
    //   window?.CSS?.supports?.('-webkit-touch-callout', 'none');
    // TODO: Fix password manager badge tracking
    // this.setupPasswordManagerBadgeTracking();
    this.setupResizeObserver();
    if (this.document.activeElement === this.inputRef()?.nativeElement) {
      this.isFocused = true;
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

  onSelectionChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;

    if (this.document.activeElement !== input) {
      this.mirrorSelectionStart = null;
      this.mirrorSelectionEnd = null;
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
    let direction: 'none' | 'forward' | 'backward' | undefined = undefined;
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
          if (_prev?.[0] !== null && _prev?.[1] !== null) {
            direction = c < _prev![1] ? 'backward' : 'forward';
            const wasPreviouslyInserting =
              _prev?.[0] === _prev![1] && _prev![0] < _ml;
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
    this.mirrorSelectionStart = s;
    this.mirrorSelectionEnd = e;
    this.slots.set(this.computeSlots());
    // Store the previous selection value
    this.inputMetadataRef.set({ prev: [s, e, dir] });
  }

  ngOnDestroy() {
    this.timeouts.forEach(clearTimeout);
    this.resizeObserver?.disconnect();
  }

  // TODO: Fix iOS pasting
  // onPaste(event: ClipboardEvent) {
  //   const input = this.inputRef()?.nativeElement;
  //   if (!input) return;

  //   if (
  //     !this.pasteTransformer &&
  //     (!this.isIOS || !event.clipboardData || !input)
  //   ) {
  //     return;
  //   }

  //   const _content = event.clipboardData?.getData('text/plain');
  //   const content = this.pasteTransformer
  //     ? this.pasteTransformer(_content)
  //     : _content;
  //   if (!content) return;
  //   event.preventDefault();

  //   const start = input.selectionStart;
  //   const end = input.selectionEnd;

  //   const isReplacing = start !== end;
  //   const value = this.formControl.value;

  //   const newValueUncapped = isReplacing
  //     ? value?.slice(0, start!) + content + value?.slice(end!) // Replacing
  //     : value?.slice(0, start!) + content + value?.slice(start!); // Inserting
  //   const newValue = newValueUncapped?.slice(0, this.maxLength());

  //   if (this.pattern) {
  //     const regexp =
  //       typeof this.pattern === 'string'
  //         ? new RegExp(this.pattern)
  //         : this.pattern;
  //     if (newValue.length > 0 && !regexp.test(newValue)) {
  //       return;
  //     }
  //   }

  //   this.formControl.setValue(newValue);

  //   const _start = Math.min(newValue.length, this.maxLength() - 1);
  //   const _end = newValue.length;

  //   input.setSelectionRange(_start, _end);
  //   this.mirrorSelectionStart = _start;
  //   this.mirrorSelectionEnd = _end;
  //   this.slots.set(this.computeSlots());
  // }

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  onFocus() {
    this.setMirrorValues();
    this.isFocused = true;
  }

  private setMirrorValues() {
    const input = this.inputRef()?.nativeElement;
    const value = this.formControl.value;
    if (input) {
      const start = Math.min(value?.length ?? 0, this.maxLength() - 1);
      const end = value?.length ?? 0;
      input.setSelectionRange(start, end);
      this.mirrorSelectionStart = start;
      this.mirrorSelectionEnd = end;
    }
  }

  onBlur() {
    this.isFocused = false;
  }

  // TODO: Fix password manager badge tracking
  // private setupPasswordManagerBadgeTracking() {
  //   if (this.pushPasswordManagerStrategy === 'none') return;

  //   const trackPWMBadge = () => {
  //     const container = this.containerRef()?.nativeElement;
  //     const input = this.inputRef()?.nativeElement;
  //     if (!container || !input || this.done) return;

  //     const elementToCompare = container;

  //     const rightCornerX =
  //       elementToCompare.getBoundingClientRect().left +
  //       elementToCompare.offsetWidth;
  //     const centereredY =
  //       elementToCompare.getBoundingClientRect().top +
  //       elementToCompare.offsetHeight / 2;
  //     const x = rightCornerX - PWM_BADGE_MARGIN_RIGHT;
  //     const y = centereredY;

  //     const pmws = document.querySelectorAll(PASSWORD_MANAGERS_SELECTORS);

  //     if (pmws.length === 0) {
  //       const maybeBadgeEl = document.elementFromPoint(x, y);
  //       if (maybeBadgeEl === container) return;
  //     }

  //     this.hasPWMBadge = true;
  //     this.done = true;
  //   };

  //   const checkHasSpace = () => {
  //     const container = this.containerRef()?.nativeElement;
  //     if (!container) return;

  //     const viewportWidth = window.innerWidth;
  //     const distanceToRightEdge =
  //       viewportWidth - container.getBoundingClientRect().right;
  //     this.hasPWMBadgeSpace = distanceToRightEdge >= PWM_BADGE_SPACE_WIDTH_PX;
  //   };

  //   // Initial check
  //   checkHasSpace();

  //   // Setup interval for space checking
  //   const interval = setInterval(checkHasSpace, 1000);
  //   this.timeouts.push(interval);

  //   // Setup timeouts for badge tracking
  //   this.timeouts.push(setTimeout(trackPWMBadge, 0));
  //   this.timeouts.push(setTimeout(trackPWMBadge, 2000));
  //   this.timeouts.push(setTimeout(trackPWMBadge, 5000));
  //   this.timeouts.push(
  //     setTimeout(() => {
  //       this.done = true;
  //     }, 6000),
  //   );
  // }

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

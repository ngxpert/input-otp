import { computed, type Injector, type Signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs';

/**
 * Returns a signal that contains the value of a control (or a form).
 * @param control
 * @param injector
 */
export function getControlValueSignal<T>(
  control: FormControl<T>,
  injector: Injector,
): Signal<T | undefined> {
  const valueChanges = computed(() => {
    return untracked(() =>
      toSignal(control.valueChanges.pipe(startWith(control.value)), {
        injector,
        initialValue: undefined,
      }),
    );
  });

  return computed(() => valueChanges()());
}

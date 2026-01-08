import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appComponentWClass]',
})
export class ComponentWClassDirective {
  readonly class = input('');
}

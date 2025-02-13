import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appComponentWClass]',
})
export class ComponentWClassDirective {
  @Input() class = '';
}

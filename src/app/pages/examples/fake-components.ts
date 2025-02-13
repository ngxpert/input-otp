import { Component } from '@angular/core';

@Component({
  selector: 'app-fake-dash',
  template: `
    <div class="flex w-10 justify-center items-center">
      <div class="w-3 h-1 rounded-full bg-border"></div>
    </div>
  `,
})
export class FakeDashComponent {}

@Component({
  selector: 'app-fake-caret',
  template: `
    <div
      class="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink"
    >
      <div class="w-px h-8 bg-white"></div>
    </div>
  `,
})
export class FakeCaretComponent {}

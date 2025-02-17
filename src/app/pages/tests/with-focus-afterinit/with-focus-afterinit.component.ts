import { Component } from '@angular/core';
import { TestBaseInputComponent } from '../components/base-input/base-input.component';

@Component({
  selector: 'app-test-with-focus-afterinit',
  templateUrl: './with-focus-afterinit.component.html',
  imports: [TestBaseInputComponent],
})
export class TestWithFocusAfterInitComponent {}

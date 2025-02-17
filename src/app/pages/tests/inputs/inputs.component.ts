import { Component } from '@angular/core';
import { TestBaseInputComponent } from '../components/base-input/base-input.component';

@Component({
  selector: 'app-test-inputs',
  templateUrl: './inputs.component.html',
  imports: [TestBaseInputComponent],
})
export class TestInputsComponent {}

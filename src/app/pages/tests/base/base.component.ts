import { Component } from '@angular/core';
import { TestBaseInputComponent } from '../components/base-input/base-input.component';
@Component({
  selector: 'app-test-base',
  templateUrl: './base.component.html',
  imports: [TestBaseInputComponent],
})
export class TestBaseComponent {}

import { Component } from '@angular/core';
import { TestBaseInputComponent } from '../components/base-input/base-input.component';

@Component({
  selector: 'app-test-with-on-complete',
  templateUrl: './with-on-complete.component.html',
  imports: [TestBaseInputComponent],
})
export class TestWithOnCompleteComponent {
  disabled = false;
  onComplete = () => {
    this.disabled = true;
  };
}

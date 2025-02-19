import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBaseInputComponent } from '../components/base-input/base-input.component';
@Component({
  selector: 'app-copy-paste',
  templateUrl: './copy-paste.component.html',
  imports: [TestBaseInputComponent],
})
export class CopyPasteComponent {
  copyContainer = viewChild<ElementRef<HTMLDivElement>>('copyContainer');

  copy() {
    // get the text content of the container
    const text = this.copyContainer()?.nativeElement.textContent;
    if (!text) {
      return;
    }
    // copy the text to the clipboard
    navigator.clipboard.writeText(text);
  }
}

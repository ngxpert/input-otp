import { Component, Input } from '@angular/core';
import { ButtonDirective } from '../ui/button/button.component';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  imports: [ButtonDirective, CdkCopyToClipboard],
})
export class CopyButtonComponent {
  @Input() textToCopy = '';
  isCopied = false;

  copied() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }
}

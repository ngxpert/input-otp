import { Component } from '@angular/core';
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import mainComponentContent from '../../pages/examples/main/main.component' with { loader: 'text' };
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import slotComponentContent from '../../pages/examples/main/slot.component' with { loader: 'text' };
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import fakeComponentsContent from '../../pages/examples/main/fake-components' with { loader: 'text' };
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import utilsContent from '../../pages/examples/main/utils' with { loader: 'text' };
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe } from '@angular/common';
import { CodeHighlightPipe } from '../../shared/pipes/code-highlight.pipe';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { CopyButtonComponent } from '../copy-button/copy-button.component';
@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  imports: [
    MatTabsModule,
    AsyncPipe,
    CodeHighlightPipe,
    SafeHtmlPipe,
    CopyButtonComponent,
  ],
})
export class CodeComponent {
  readonly files: { fileName: string; content: string; language: string }[] = [
    {
      fileName: 'main.component.ts',
      content: `
${mainComponentContent}`,
      language: 'angular-ts',
    },
    {
      fileName: 'slot.component.ts',
      content: `
${slotComponentContent}`,
      language: 'angular-ts',
    },
    {
      fileName: 'fake-components.ts',
      content: `
${fakeComponentsContent}`,
      language: 'angular-ts',
    },
    {
      fileName: 'utils.ts',
      content: `
${utilsContent}`,
      language: 'ts',
    },
    {
      fileName: 'styles.css',
      content: `
@import "tailwindcss";

@theme {
  --animate-caret-blink: caret-blink 1.2s ease-out infinite;
  @keyframes caret-blink {
    0%,
    70%,
    100% {
      opacity: 1;
    }
    20%,
    50% {
      opacity: 0;
    }
  }
}`,
      language: 'css',
    },
  ];
}

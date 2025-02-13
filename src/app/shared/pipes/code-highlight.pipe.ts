import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { codeToHtml } from 'shiki/bundle/web';

@Pipe({
  name: 'codeHighlight',
  standalone: true,
})
export class CodeHighlightPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    language = 'typescript',
  ): Observable<string> {
    return value
      ? from(
          codeToHtml(value, {
            lang: language,
            themes: {
              light: 'one-light',
              dark: 'one-dark-pro',
            },
            defaultColor: false,
          }),
        )
      : of('');
  }
}

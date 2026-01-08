import { Component } from '@angular/core';
import { cn } from '../../lib/utils';
import { ComponentWClassDirective } from '../../shared/components/component-w-class/component-w-class.directive';
@Component({
  selector: 'app-page-header',
  template: `
    <section
      [class]="
        cn(
          'mx-auto flex max-w-[500px] flex-col items-center gap-2 py-8 md:py-12 lg:pt-24',
          class()
        )
      "
    >
      <ng-content />
    </section>
  `,
})
export class PageHeaderComponent extends ComponentWClassDirective {
  cn = cn;
}

@Component({
  selector: 'app-page-header-heading',
  template: `
    <h1
      [class]="
        cn(
          'text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] max-w-[330px] md:min-w-[540px]',
          class()
        )
      "
    >
      <ng-content />
    </h1>
  `,
})
export class PageHeaderHeadingComponent extends ComponentWClassDirective {
  cn = cn;
}

@Component({
  selector: 'app-page-header-description',
  template: `
    <p
      [class]="
        cn(
          'max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl text-pretty',
          class()
        )
      "
    >
      <ng-content />
    </p>
  `,
})
export class PageHeaderDescriptionComponent extends ComponentWClassDirective {
  cn = cn;
}

@Component({
  selector: 'app-page-actions',
  template: `
    <div
      [class]="
        cn(
          'flex w-full items-center justify-center space-x-4 py-4 md:pb-6',
          class()
        )
      "
    >
      <ng-content />
    </div>
  `,
})
export class PageActionsComponent extends ComponentWClassDirective {
  cn = cn;
}

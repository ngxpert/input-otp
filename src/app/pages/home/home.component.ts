import { AfterViewInit, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import {
  PageHeaderComponent,
  PageHeaderDescriptionComponent,
  PageHeaderHeadingComponent,
  PageActionsComponent,
} from '../../components/page-header/page-header.component';
import { cn } from '../../lib/utils';
import { BehaviorSubject } from 'rxjs';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { ShowcaseComponent } from '../../components/showcase/showcase.component';
import {
  ButtonDirective,
  buttonVariants,
} from '../../components/ui/button/button.component';
import { IconGithubComponent } from '../../components/icons';
import { siteConfig } from '../../config/site';
import { SiteHeaderComponent } from '../../components/site-header/site-header.component';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { CodeComponent } from '../../components/code/code.component';
import { MatTabsModule } from '@angular/material/tabs';
const fadeUpClassname =
  'lg:motion-safe:opacity-0 lg:motion-safe:animate-fade-up';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PageHeaderComponent,
    PageHeaderHeadingComponent,
    AsyncPipe,
    ShowcaseComponent,
    PageHeaderDescriptionComponent,
    PageActionsComponent,
    IconGithubComponent,
    CdkCopyToClipboard,
    ButtonDirective,
    SiteHeaderComponent,
    SiteFooterComponent,
    CodeComponent,
    MatTabsModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  fadeUpClassname = fadeUpClassname;
  cn = cn;
  readonly heading = 'Stop wasting time building OTP inputs.';
  starCount$ = new BehaviorSubject<number>(0);
  http = inject(HttpClient);
  buttonVariants = buttonVariants;
  siteConfig = siteConfig;
  isCopied = false;
  ngAfterViewInit() {
    this.http.get('https://api.github.com/repos/ngxpert/input-otp').subscribe({
      next: (res) => {
        this.starCount$.next(
          (res as unknown as { stargazers_count: number }).stargazers_count,
        );
      },
    });
  }

  copied() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 3000);
  }
}

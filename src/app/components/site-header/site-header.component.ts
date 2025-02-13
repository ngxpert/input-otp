import { Component } from '@angular/core';
import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button/button.component';
import { IconGithubComponent } from '../icons';
import { IconTwitterComponent } from '../icons';
import { siteConfig } from '../../config/site';
import { ModeToggleComponent } from '../mode-toggle/mode-toggle.component';
@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  imports: [IconGithubComponent, IconTwitterComponent, ModeToggleComponent],
})
export class SiteHeaderComponent {
  cn = cn;
  buttonVariants = buttonVariants;
  siteConfig = siteConfig;
}

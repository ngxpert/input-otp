import { Component } from '@angular/core';
import { siteConfig } from '../../config/site';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent {
  siteConfig = siteConfig;
}

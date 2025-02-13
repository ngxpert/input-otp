import { Component, inject } from '@angular/core';
import { ButtonDirective } from '../ui/button/button.component';
import { ThemeWithoutAuto } from '../../core/theme-changer.service';
import { ThemeChangerService } from '../../core/theme-changer.service';

@Component({
  selector: 'app-mode-toggle',
  templateUrl: './mode-toggle.component.html',
  imports: [ButtonDirective],
})
export class ModeToggleComponent {
  private themeChanger = inject(ThemeChangerService);
  isDark = this.themeChanger.isDark;

  changeTheme(theme: ThemeWithoutAuto) {
    this.themeChanger.changeTheme(theme);
  }
}

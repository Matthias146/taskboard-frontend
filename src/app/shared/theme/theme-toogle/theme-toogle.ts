import { Component } from '@angular/core';
import { Theme } from '../../../core/services/theme';

@Component({
  selector: 'app-theme-toogle',
  imports: [],
  templateUrl: './theme-toogle.html',
  styleUrl: './theme-toogle.scss',
})
export class ThemeToogle {
  constructor(public theme: Theme) {}

  toggle() {
    this.theme.toggle();
  }
}

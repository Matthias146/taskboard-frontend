import { Component, input } from '@angular/core';

@Component({
  selector: 'button[appButton]',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.btn]': 'true',
    '[class.btn--primary]': 'variant() === "primary"',
    '[class.btn--secondary]': 'variant() === "secondary"',
    '[class.btn--outline]': 'variant() === "outline"',
    '[disabled]': 'disabled',
  },
})
export class Button {
  disabled = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
}

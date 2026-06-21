import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

// angular material
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonModule],
})
export class Hero {
  public readonly title = input<string>('Bookshelf');
  public readonly subtitle = input<string>('A place to organize your books.');
}
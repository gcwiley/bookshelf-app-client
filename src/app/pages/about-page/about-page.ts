import { ChangeDetectionStrategy, Component } from '@angular/core';

// angular material
import { MatIconModule } from '@angular/material/icon';

// shared component
import { Navbar, Footer } from '../../components';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about-page.scss',
  imports: [Navbar, Footer],
})
export class AboutPage {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/layout/header.component';
// import { FooterComponent } from './shared/components/layout/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'Office Dress Shop';
}
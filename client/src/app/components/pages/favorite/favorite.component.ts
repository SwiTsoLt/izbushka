import { Component } from '@angular/core';
import { NavbarComponent } from '../../UI/navbar/navbar.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent {

}

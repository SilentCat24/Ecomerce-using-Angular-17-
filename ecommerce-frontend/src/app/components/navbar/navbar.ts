import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CartService } from '../../service/cart';
import { Auth } from '../../service/auth';


@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(Auth);
  cart = inject(CartService);
  menuOpen = false


    toggleMenu() { this.menuOpen = !this.menuOpen; }
  logout() { this.auth.logout(); this.menuOpen = false; }

}

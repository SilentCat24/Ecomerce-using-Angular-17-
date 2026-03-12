import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit  {
 cart = inject(CartService);

  ngOnInit() {
    this.cart.loadCart().subscribe();
  }

  updateQty(itemId: string, qty: number) {
    this.cart.updateItem(itemId, qty).subscribe();
  }

  removeItem(itemId: string) {
    this.cart.removeItem(itemId).subscribe();
  }


  getTotal() {
    const sub = this.cart.cart().subtotal;
    const shipping = sub > 100 ? 0 : 9.99;
    const tax = sub * 0.08;
    return sub + shipping + tax;
  }

  
}

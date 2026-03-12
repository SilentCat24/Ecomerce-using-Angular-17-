import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService,Product } from '../../service/product';
import { CartService } from '../../service/cart';



@Component({
  selector: 'app-product-card',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})

export class ProductCard {
  @Input({ required: true }) product!: Product;
  cartService = inject(CartService);
  productService = inject(ProductService);
  adding = false;

   get discount() { return this.productService.getDiscountPercent(this.product); }

  getStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  addToCart() {
    this.adding = true;
    this.cartService.addToCart(this.product._id).subscribe({
      complete: () => setTimeout(() => this.adding = false, 1200)
    });
  }

}

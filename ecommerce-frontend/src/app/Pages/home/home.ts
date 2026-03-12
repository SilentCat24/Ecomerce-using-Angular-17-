import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService,Product } from '../../service/product';
import { ProductCard } from '../../components/product-card/product-card';



@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private productService = inject(ProductService);
  featured: Product[] = [];
  loading = true;


   categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Home', icon: '🏠' },
    { name: 'Accessories', icon: '👜' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Books', icon: '📚' }
  ];

  benefits = [
    { icon: '', title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: '', title: 'Easy Returns', desc: '30-day hassle-free returns' },
    { icon: '', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
    { icon: '', title: '24/7 Support', desc: 'Always here to help' }
  ];

  ngOnInit() {
    this.productService.getFeatured().subscribe({
      next: products => { this.featured = products; this.loading = false; },
      error: () => this.loading = false
    });
  }

}

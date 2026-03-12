import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService,Product,ProductFilters } from '../../service/product';
import { ProductCard } from '../../components/product-card/product-card';



@Component({
  selector: 'app-products',
  imports: [ProductCard,CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products: Product[] = [];
  categories: string[] = [];
  total = 0;
  pages = 1;
  currentPage = 1;
  loading = false;
  searchTimer: any;

  filters: ProductFilters = { sort: '-createdAt', page: 1, limit: 12 };

  get pageNumbers(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.filters.category = params['category'];
      if (params['keyword']) this.filters.keyword = params['keyword'];
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: res => {
        this.products = res.products;
        this.total = res.total;
        this.pages = res.pages;
        this.currentPage = res.page;
        this.categories = res.categories;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.loadProducts();
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 400);
  }

  setRating(r: number) {
    this.filters.rating = this.filters.rating === r ? undefined : r;
    this.applyFilters();
  }

  resetFilters() {
    this.filters = { sort: '-createdAt', page: 1, limit: 12 };
    this.loadProducts();
  }

  goToPage(page: number) {
    this.filters.page = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


}

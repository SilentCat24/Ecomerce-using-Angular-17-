import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';


export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  tags: string[];
  reviews?: Review[];
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}


export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
  categories: string[];
}

export interface ProductFilters {
  keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
  sort?: string;
  featured?: boolean;
}



@Injectable({
  providedIn: 'root',
})
export class ProductService {
 private apiUrl = `${environment.apiUrl}/products`;

   constructor(private http: HttpClient) {}

    getProducts(filters: ProductFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val.toString());
      }
    });
    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }
  
 getFeatured() {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  getById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Partial<Product>) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: string, product: Partial<Product>) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addReview(id: string, review: { rating: number; comment: string }) {
    return this.http.post(`${this.apiUrl}/${id}/reviews`, review);
  }

  getDiscountPercent(product: Product): number {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }


}

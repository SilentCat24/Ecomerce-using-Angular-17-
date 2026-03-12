import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../environment/environment';


export interface CartItem {
  _id: string;
  product: { _id: string; name: string; images: string[]; price: number; stock: number };
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  coupon?: { code: string; discount: number };
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  emptyCart: Cart = {
    items: [] as CartItem[],
    subtotal: 0,
    total: 0,
  };
  cart = signal<Cart>(this.emptyCart);

  
  itemCount = computed(() =>
    this.cart().items.reduce((n, i) => n + i.quantity, 0)
  );

  constructor(private http: HttpClient) {}

  loadCart() {
    return this.http.get<Cart>(this.apiUrl).pipe(tap(c => this.cart.set(c)));
  }

  addToCart(productId: string, quantity = 1) {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId, quantity })
      .pipe(tap(c => this.cart.set(c)));
  }

  updateItem(itemId: string, quantity: number) {
    return this.http.put<Cart>(`${this.apiUrl}/update/${itemId}`, { quantity })
      .pipe(tap(c => this.cart.set(c)));
  }

  removeItem(itemId: string) {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${itemId}`)
      .pipe(tap(c => this.cart.set(c)));
  }

  clearCart() {
    return this.http.delete(`${this.apiUrl}/clear`)
      .pipe(tap(() => this.cart.set(this.emptyCart)));
  }
}
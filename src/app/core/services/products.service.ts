import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilters, ProductsResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters, page: number = 0, size: number = 12): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ProductFilters];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`);
  }

  getMaterials(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/materials`);
  }

  // Admin methods
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/api/v1/admin/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/api/v1/admin/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/v1/admin/products/${id}`);
  }
}

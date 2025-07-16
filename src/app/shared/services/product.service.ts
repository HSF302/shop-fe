import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse, ProductFilter, CatalogData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter = {}): Observable<ProductsResponse> {
    let params = new HttpParams();
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.page !== undefined) params = params.set('page', filter.page.toString());
    if (filter.size !== undefined) params = params.set('size', filter.size.toString());

    return this.http.get<ProductsResponse>(`${this.API_URL}/products`, { 
      params, 
      withCredentials: true 
    });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`, { withCredentials: true });
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.API_URL}/products`, product, { withCredentials: true });
  }

  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.API_URL}/products/${id}`, product, { withCredentials: true });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/products/${id}`, { withCredentials: true });
  }

  uploadProductImage(id: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    
    return this.http.post(`${this.API_URL}/products/${id}/upload-image`, formData, { 
      withCredentials: true 
    });
  }

  getCatalogData(): Observable<CatalogData> {
    return this.http.get<CatalogData>(`${this.API_URL}/catalog/all`, { withCredentials: true });
  }

  // Catalog management methods for admin
  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.API_URL}/catalog/categories`, category, { withCredentials: true });
  }

  createSize(size: any): Observable<any> {
    return this.http.post(`${this.API_URL}/catalog/sizes`, size, { withCredentials: true });
  }

  createColor(color: any): Observable<any> {
    return this.http.post(`${this.API_URL}/catalog/colors`, color, { withCredentials: true });
  }

  createMaterial(material: any): Observable<any> {
    return this.http.post(`${this.API_URL}/catalog/materials`, material, { withCredentials: true });
  }

  createAddon(addon: any): Observable<any> {
    return this.http.post(`${this.API_URL}/catalog/addons`, addon, { withCredentials: true });
  }
}

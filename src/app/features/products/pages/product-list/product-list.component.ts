import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatPaginatorModule} from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { Product } from '../../../../core/models/product.model';
import { ProductsState } from '../../../../store/products/products.state';
import * as ProductsActions from '../../../../store/products/products.actions';
import * as ProductsSelectors from '../../../../store/products/products.selectors';

@Component({
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
    AsyncPipe,
    ProductCardComponent,
    RouterModule,
    ProductFilterComponent
  ],
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalPages$: Observable<number>;
  currentPage$: Observable<number>;
  filters$: Observable<any>;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<{ products: ProductsState }>) {
    this.products$ = this.store.select(ProductsSelectors.selectProducts);
    this.loading$ = this.store.select(ProductsSelectors.selectLoading);
    this.error$ = this.store.select(ProductsSelectors.selectError);
    this.totalPages$ = this.store.select(ProductsSelectors.selectTotalPages);
    this.currentPage$ = this.store.select(ProductsSelectors.selectCurrentPage);
    this.filters$ = this.store.select(ProductsSelectors.selectFilters);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(filters?: any, page?: number): void {
    this.store.dispatch(ProductsActions.loadProducts({ filters, page }));
  }

  onFiltersChanged(filters: any): void {
    this.loadProducts(filters, 0);
  }

  onPageChanged(event: PageEvent): void {
    this.filters$.pipe(takeUntil(this.destroy$)).subscribe(filters => {
      this.loadProducts(filters, event.pageIndex);
    });
  }

  onProductClick(product: Product): void {
    // Navigation will be handled by router link in template
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
